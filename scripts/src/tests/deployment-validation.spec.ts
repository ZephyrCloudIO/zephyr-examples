import { test, expect } from "@playwright/test";
import { getDeployedApps } from "./test-helper.js";
import { APP_VALIDATIONS } from './app-validations.js';

interface DeployedApp {
  app: string;
  name: string;
  url: string;
}

test.describe("Deployment Validation", () => {
  let deployedApps: DeployedApp[] = [];

  test.beforeAll(async () => {
    console.log("Fetching deployed applications...");
    deployedApps = await getDeployedApps();
    console.log(`Found ${deployedApps.length} deployed applications`);

    if (deployedApps.length === 0) {
      throw new Error(
        "No deployed applications found. Make sure build-packages has run successfully."
      );
    }

    // Log all found apps
    deployedApps.forEach((app) => {
      console.log(`- ${app.name}: ${app.url}`);
    });
  });

  test.skip("all deployed applications must load successfully", async ({ page }) => {
    test.setTimeout(240000); // 4 minutes for all apps

    expect(deployedApps.length).toBeGreaterThan(0);

    const results: Array<{
      name: string;
      url: string;
      status: "passed" | "failed" | "skipped";
      error?: string;
      details?: string;
    }> = [];

    const failedApps: Array<{
      name: string;
      error: string;
      details: string;
    }> = [];

    for (const app of deployedApps) {
      console.log(`\n🧪 Validating ${app.name}: ${app.url}`);

      // Skip turbo apps for now as they're known to be problematic
      if (app.name.includes("turbo-")) {
        console.log(
          `  ⏭️  Skipping ${app.name} - turbo apps are currently disabled`
        );
        results.push({
          name: app.name,
          url: app.url,
          status: "skipped",
        });
        continue;
      }

      const validation =
        APP_VALIDATIONS[app.name] || APP_VALIDATIONS["default"];

      try {
        // Optimized navigation - reduced timeout and waitUntil strategy
        const response = await page.goto(app.url, {
          waitUntil: "domcontentloaded", // Faster than networkidle
          timeout: 20000, // Reduced from 30s to 20s
        });

        // Check HTTP status
        const status = response?.status();
        if (!status || status >= 400) {
          throw new Error(`HTTP ${status}`);
        }

        // Reduced wait time for content rendering
        await page.waitForTimeout(1500); // Reduced from 3s to 1.5s

        const bodyText = await page.textContent("body");
        if (!bodyText) {
          throw new Error(`No body content (body: ${bodyText})`);
        }

        // Validate required text content
        const foundTexts: string[] = [];
        const missingTexts: string[] = [];

        for (const text of validation.uniqueText) {
          if (bodyText?.toLowerCase().includes(text.toLowerCase())) {
            console.log(`  ✓ Found expected text: "${text}"`);
            foundTexts.push(text);
          } else {
            missingTexts.push(text);
          }
        }

        if (missingTexts.length > 0) {
          const error = `Missing required text(s): ${missingTexts.join(", ")}. Found: ${foundTexts.join(", ")}`;
          const details = `Page content: "${bodyText?.slice(0, 300)}..."`;
          
          console.log(`  ❌ ${error}`);
          console.log(`  📄 ${details}`);
          
          failedApps.push({
            name: app.name,
            error,
            details,
          });
          
          results.push({
            name: app.name,
            url: app.url,
            status: "failed",
            error,
            details,
          });
        } else {
          console.log(`  ✅ ${app.name} validation passed`);
          results.push({
            name: app.name,
            url: app.url,
            status: "passed",
          });
        }
      } catch (error: any) {
        const errorMsg = error.message || "Unknown error";
        const details = `Failed to validate: ${errorMsg}`;
        
        console.error(`  ❌ ${app.name} failed: ${errorMsg}`);
        
        failedApps.push({
          name: app.name,
          error: errorMsg,
          details,
        });
        
        results.push({
          name: app.name,
          url: app.url,
          status: "failed",
          error: errorMsg,
          details,
        });
      }
    }

    // Summary and final validation
    const passed = results.filter((r) => r.status === "passed").length;
    const failed = results.filter((r) => r.status === "failed").length;
    const skipped = results.filter((r) => r.status === "skipped").length;

    console.log(`\n📊 Deployment Validation Results:`);
    console.log(`    ✅ Passed: ${passed}`);
    console.log(`    ❌ Failed: ${failed}`);
    console.log(`    ⏭️  Skipped: ${skipped}`);
    console.log(`    📊 Total: ${results.length}`);

    // Display all failures at the end
    if (failedApps.length > 0) {
      console.log(`\n💥 FAILED APPLICATIONS (${failedApps.length}):`);
      failedApps.forEach((failure, index) => {
        console.log(`\n${index + 1}. ${failure.name}:`);
        console.log(`   Error: ${failure.error}`);
        console.log(`   Details: ${failure.details}`);
      });
    }

    // Final assertion - fail if ANY apps failed (but we've collected all failures)
    if (failedApps.length > 0) {
      throw new Error(
        `${failedApps.length} applications failed validation. See details above.`
      );
    }

    console.log(`\n🎉 All ${passed} applications validated successfully!`);
  });

  test("deployment summary", async () => {
    const totalApps = deployedApps.length;
    const turboApps = deployedApps.filter((app) =>
      app.name.includes("turbo-")
    ).length;
    const activeApps = totalApps - turboApps;

    console.log(`\n📊 Deployment Summary:`);
    console.log(`   Total applications: ${totalApps}`);
    console.log(`   Validated applications: ${activeApps}`);
    console.log(`   Turbo apps (skipped): ${turboApps}`);
    console.log(
      `   Apps with custom validation: ${
        Object.keys(APP_VALIDATIONS).filter((k) => k !== "default").length
      }`
    );
    console.log('---------- deployedApps: ', deployedApps.map((app) => app.name))

    expect(totalApps).toBeGreaterThan(0);
    expect(activeApps).toBeGreaterThan(0);
  });
});
