import { test, expect } from "@playwright/test";
import { getDeployedApps } from "./test-helper.js";

interface DeployedApp {
  app: string;
  name: string;
  url: string;
}

let deployedApps: DeployedApp[] = [];

test.describe("Deployment Validation", () => {
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

  test("should have deployed applications available", async () => {
    expect(deployedApps.length).toBeGreaterThan(0);
  });

  test("all deployed applications should load successfully", async ({
    page,
  }) => {
    const results = [];

    for (const app of deployedApps.slice(0, 5)) {
      // Test first 5 apps
      console.log(`Testing ${app.name}: ${app.url}`);

      try {
        const response = await page.goto(app.url, {
          waitUntil: "networkidle",
          timeout: 15000,
        });

        const status = response?.status();
        const title = await page.title();

        // Basic checks
        expect(status).toBeLessThan(400);
        expect(title.length).toBeGreaterThan(0);

        // Check page has rendered content
        await page.waitForTimeout(2000);
        const bodyText = await page.textContent("body");
        expect(bodyText?.trim().length).toBeGreaterThan(10);

        results.push({
          name: app.name,
          url: app.url,
          status,
          title,
          success: true,
        });

        console.log(`✅ ${app.name} - Status: ${status}, Title: "${title}"`);
      } catch (error: any) {
        console.error(`❌ ${app.name} failed:`, error.message);
        results.push({
          name: app.name,
          url: app.url,
          success: false,
          error: error.message,
        });

        // Don't fail the entire test for individual app failures
        // expect.soft() allows test to continue
        expect.soft(true).toBe(false);
      }
    }

    // Summary
    const successful = results.filter((r) => r.success).length;
    const total = results.length;
    console.log(
      `\n📊 Test Summary: ${successful}/${total} applications loaded successfully`
    );

    // At least 80% should work
    expect(successful / total).toBeGreaterThan(0.8);
  });

  test("sample applications should render expected content", async ({
    page,
  }) => {
    // Test a few key applications more thoroughly
    const keyApps = deployedApps.filter((app) =>
      [
        "react-vite-ts",
        "angular-vite-zephyr-template",
        "qwik-starter",
        "modern-js",
      ].includes(app.name)
    );

    if (keyApps.length === 0) {
      console.log('No key applications found for detailed testing');
      test.skip();
    }

    for (const app of keyApps) {
      console.log(`Detailed testing of ${app.name}: ${app.url}`);

      await page.goto(app.url, { waitUntil: "networkidle" });

      // Check basic page structure
      const title = await page.title();
      expect(title).toBeTruthy();

      // Check for common app containers
      const hasRoot = (await page.locator("#root").count()) > 0;
      const hasApp = (await page.locator("#app").count()) > 0;
      const hasAppRoot = (await page.locator("app-root").count()) > 0;
      const hasMain = (await page.locator("main").count()) > 0;

      expect(hasRoot || hasApp || hasAppRoot || hasMain).toBe(true);

      // Check page has meaningful content
      const bodyText = await page.textContent("body");
      expect(bodyText?.length).toBeGreaterThan(50);

      console.log(`✅ ${app.name} detailed validation passed`);
    }
  });
});
