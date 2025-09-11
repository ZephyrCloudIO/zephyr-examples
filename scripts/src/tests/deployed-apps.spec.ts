import { test, expect } from "@playwright/test";
import { getDeployedApps } from "./test-helper.js";

interface DeployedApp {
  app: string;
  name: string;
  url: string;
}

interface AppValidation {
  title: RegExp;
  selectors: string[];
}

// App-specific validation rules
const APP_VALIDATIONS: Record<string, AppValidation> = {
  "angular-vite-zephyr-template": {
    title: /angular/i,
    selectors: ["app-root", "h1"],
  },
  "create-mf-app-rspack-host": {
    title: /host/i,
    selectors: ["#root", "h1"],
  },
  "modern-js": {
    title: /modern/i,
    selectors: ["#root", "main"],
  },
  "nx-ng": {
    title: /nx/i,
    selectors: ["app-root", "main"],
  },
  "parcel-react": {
    title: /parcel|react/i,
    selectors: ["#root", "div"],
  },
  "qwik-starter": {
    title: /qwik/i,
    selectors: ["body", "main"],
  },
  "react-vite-ts": {
    title: /react|vite/i,
    selectors: ["#root", "div"],
  },
  "rolldown-react": {
    title: /rolldown|react/i,
    selectors: ["#root", "div"],
  },
  "rspack-react-starter": {
    title: /rspack|react/i,
    selectors: ["#root", "div"],
  },
  "rspress-ssg": {
    title: /rspress/i,
    selectors: ["#app", "main"],
  },
  "solid-zephyr-template": {
    title: /solid/i,
    selectors: ["#root", "div"],
  },
  "svelte-zephyr-template": {
    title: /svelte/i,
    selectors: ["body", "main"],
  },
  // Microfrontend apps
  "airbnb-react-host": {
    title: /airbnb/i,
    selectors: ["#root", "div", "nav"],
  },
  "default-webpack-mf-first": {
    title: /webpack/i,
    selectors: ["#root", "div"],
  },
  "turbo-host": {
    title: /turbo/i,
    selectors: ["#root", "div"],
  },
  "vite-host": {
    title: /vite/i,
    selectors: ["#root", "div"],
  },
  // Generic fallbacks
  default: {
    title: /.+/, // Any non-empty title
    selectors: ["body", "#root", "#app", "main", "div"],
  },
};

test.describe("Deployed Applications Validation", () => {
  let deployedApps: DeployedApp[] = [];

  test.beforeAll(async () => {
    deployedApps = await getDeployedApps();
    console.log(`Found ${deployedApps.length} deployed applications`);

    if (deployedApps.length === 0) {
      throw new Error(
        "No deployed applications found. Make sure build-packages has run successfully."
      );
    }
  });

  test("validate all deployed applications", async ({ page }) => {
    // Get deployed apps within the test
    const apps = await getDeployedApps();
    
    if (apps.length === 0) {
      console.log("No deployed applications found. Skipping validation.");
      test.skip();
      return;
    }

    for (const app of apps) {
      console.log(`Testing ${app.name}: ${app.url}`);

      try {
        // Navigate to the deployed application
        const response = await page.goto(app.url, {
          waitUntil: "networkidle",
          timeout: 15000,
        });

        // Check that the page loads successfully
        expect(response?.status()).toBeLessThan(400);

        // Get validation rules for this app
        const validation =
          APP_VALIDATIONS[app.name] || APP_VALIDATIONS["default"];

        // Wait for page to be ready
        await page.waitForTimeout(2000);

        // Check page title
        const title = await page.title();
        expect(title).toMatch(validation.title);
        expect(title.length).toBeGreaterThan(0);

        // Check that at least one expected selector exists and is visible
        let foundValidSelector = false;
        for (const selector of validation.selectors) {
          try {
            const element = await page.locator(selector).first();
            if (await element.isVisible()) {
              foundValidSelector = true;
              console.log(
                `✓ Found valid selector: ${selector} for ${app.name}`
              );
              break;
            }
          } catch (e) {
            // Selector not found, try next one
            continue;
          }
        }

        expect(foundValidSelector).toBe(true);

        // Check that page has rendered content (not just empty)
        const bodyText = await page.textContent("body");
        expect(bodyText?.trim().length).toBeGreaterThan(10);

        // Additional check: no major JavaScript errors in console
        const errorLogs: string[] = [];
        page.on("console", (msg) => {
          if (msg.type() === "error") {
            errorLogs.push(msg.text());
          }
        });

        // Wait a bit more for any delayed content
        await page.waitForTimeout(3000);

        // Allow some errors but not critical ones
        const criticalErrors = errorLogs.filter(
          (error) =>
            !error.includes("favicon") &&
            !error.includes("404") &&
            !error.includes("net::ERR_FAILED")
        );

        if (criticalErrors.length > 0) {
          console.warn(
            `⚠️  Found ${criticalErrors.length} console errors for ${app.name}:`,
            criticalErrors
          );
        }

        console.log(`✅ ${app.name} validation passed`);
      } catch (error: any) {
        console.error(`❌ ${app.name} failed:`, error.message);
        // Use soft assertions to continue with other apps
        expect.soft(false).toBe(true);
      }
    }
  });
});
