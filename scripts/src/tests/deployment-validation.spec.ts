import { test, expect } from "@playwright/test";
import { getDeployedApps } from "./test-helper.js";
import { APP_VALIDATIONS } from "./app-validations.js";

interface DeployedApp {
  app: string;
  name: string;
  url: string;
}

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

test.describe("Deployment Validation", () => {
  let deployedApps: DeployedApp[] = [];

  test.beforeAll(async () => {
    console.log("Fetching deployed applications...");

    try {
      deployedApps = await getDeployedApps();
    } catch (error: any) {
      console.error("Error fetching deployed apps:", error);
      deployedApps = [];
    }

    console.log(`Found ${deployedApps.length} deployed applications`);

    if (deployedApps.length === 0) {
      throw new Error(
        "No deployed applications found. Make sure build-packages has run successfully."
      );
    }

    deployedApps.forEach((app) => {
      console.log(`- ${app.name}: ${app.url}`);
    });
  });

  test("all deployed applications must load successfully", async ({ page }) => {
    test.setTimeout(360_000); // 6 minutes for ~36 apps

    expect(deployedApps.length).toBeGreaterThan(0);

    const results = [];
    const failedApps: Array<{ name: string; error: string; details: string }> =
      [];

    for (const app of deployedApps) {
      console.log(`\n🧪 Validating ${app.name}: ${app.url}`);

      // Skip turbo apps
      if (app.name.includes("turbo-")) {
        console.log(`  ⏭️  Skipping ${app.name} (turbo app)`);
        results.push({ name: app.name, url: app.url, status: "skipped" });
        continue;
      }

      const validation = APP_VALIDATIONS[app.name];
      if (!validation) {
        console.log(`  ⏭️  Skipping ${app.name} - no validation rule provided`);
        results.push({
          name: app.name,
          url: app.url,
          status: "skipped",
          details: "No validation defined in app-validations.ts",
        });
        continue;
      }

      let response;
      let navigationError;

      // Navigate and wait for network to be idle (handles defer scripts)
      try {
        response = await page.goto(app.url, {
          waitUntil: "networkidle",
          timeout: 30_000,
        });
      } catch (e) {
        navigationError = e;
      }

      if (!response || response.status() >= 400) {
        const err = navigationError?.message || `HTTP ${response?.status()}`;
        console.error(`  ❌ Navigation failed: ${err}`);

        failedApps.push({
          name: app.name,
          error: err,
          details: `Navigation failed for ${app.url}`,
        });

        results.push({
          name: app.name,
          url: app.url,
          status: "failed",
          error: err,
        });

        continue;
      }

      // ---------- 3) Extract text with smart waiting and timeout protection ----------
      let bodyText = "";

      try {
        // Set a page-level timeout for this operation
        page.setDefaultTimeout(10_000);

        // First, try to get text immediately using innerText (which excludes hidden elements and styles)
        bodyText = await page.evaluate(() => {
          // Use innerText which excludes script/style tags and hidden elements
          return document.body.innerText || "";
        });
        bodyText = bodyText.replace(/\s+/g, " ");

        // If body is essentially empty or shows "Loading", wait for JS to render content
        if (bodyText.trim().length < 50 || bodyText.includes("Loading")) {
          try {
            await page.waitForFunction(
              () => {
                const body = document.body;
                const text = body.innerText || "";
                // Wait until body has content AND no longer shows "Loading"
                return text.trim().length > 50 && !text.includes("Loading");
              },
              { timeout: 10_000 } // Longer timeout for module federation apps
            );
            // Re-extract text after waiting
            bodyText = await page.evaluate(() => {
              return document.body.innerText || "";
            });
            bodyText = bodyText.replace(/\s+/g, " ");
          } catch (e) {
            // Timeout - proceed anyway, might be a slow loading app
          }
        }
      } catch (e) {
        console.log(`  ⚠️  Error extracting text: ${e.message}`);
        // If text extraction fails entirely, mark as failed
        failedApps.push({
          name: app.name,
          error: "Text extraction timeout",
          details: `Failed to extract page content within timeout`,
        });

        results.push({
          name: app.name,
          url: app.url,
          status: "failed",
          error: "Text extraction timeout",
        });

        continue;
      }

      const missingTexts: string[] = [];

      for (const expected of validation.uniqueText) {
        if (!bodyText.toLowerCase().includes(expected.toLowerCase())) {
          missingTexts.push(expected);
        } else {
          console.log(`  ✓ Found: "${expected}"`);
        }
      }

      if (missingTexts.length > 0) {
        const shortPreview = bodyText.slice(0, 500);

        const error = `Missing text: ${missingTexts.join(", ")}`;
        console.log(`  ❌ ${error}`);
        console.log(`  📄 Body Preview: "${shortPreview}..."`);

        failedApps.push({
          name: app.name,
          error,
          details: shortPreview,
        });

        results.push({
          name: app.name,
          url: app.url,
          status: "failed",
          error,
          details: shortPreview,
        });

        continue;
      }

      // ---------- Passed ----------
      console.log(`  ✅ ${app.name} validation passed`);

      results.push({
        name: app.name,
        url: app.url,
        status: "passed",
      });
    }

    // ---------- Summary ----------
    console.log("\n📊 Deployment Validation Results:");
    const passed = results.filter((r) => r.status === "passed").length;
    const failed = results.filter((r) => r.status === "failed").length;
    const skipped = results.filter((r) => r.status === "skipped").length;

    console.log(`    ✅ Passed: ${passed}`);
    console.log(`    ❌ Failed: ${failed}`);
    console.log(`    ⏭️  Skipped: ${skipped}`);
    console.log(`    📊 Total: ${results.length}`);

    if (failedApps.length > 0) {
      console.log(`\n💥 FAILED APPLICATIONS (${failedApps.length}):`);
      for (const f of failedApps) {
        console.log(`\n- ${f.name}`);
        console.log(`  Error: ${f.error}`);
        console.log(`  Details: ${f.details}`);
      }
    }

    expect(failedApps.length, "some apps failed validation").toBe(0);
  });

  test("deployment summary", async () => {
    const totalApps = deployedApps.length;
    const turboApps = deployedApps.filter((a) =>
      a.name.includes("turbo-")
    ).length;

    expect(totalApps).toBeGreaterThan(0);
    expect(totalApps - turboApps).toBeGreaterThan(0);
  });
});
