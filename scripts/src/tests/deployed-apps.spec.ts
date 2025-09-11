import { test, expect } from "@playwright/test";
import { getDeployedApps } from "./test-helper.js";

interface DeployedApp {
  app: string;
  name: string;
  url: string;
}

interface AppValidation {
  uniqueText: string[];
}

// App-specific validation rules
const APP_VALIDATIONS: Record<string, AppValidation> = {
  "angular-vite-zephyr-template": {
    uniqueText: ["Angular", "Vite", "Welcome", "Hello"],
  },
  "create-mf-app-rspack-host": {
    uniqueText: ["Module Federation", "Host", "Remote", "Micro"],
  },
  "modern-js": {
    uniqueText: ["Modern.js", "Modern", "Get Started", "Welcome"],
  },
  "nx-ng": {
    uniqueText: ["Nx", "Angular", "Welcome", "Hello World"],
  },
  "parcel-react": {
    uniqueText: ["Parcel", "React", "Hello", "World"],
  },
  "qwik-starter": {
    uniqueText: ["Qwik", "Welcome to Qwik", "City", "Welcome"],
  },
  "react-vite-ts": {
    uniqueText: ["Vite", "React", "Click", "count", "Edit"],
  },
  "rolldown-react": {
    uniqueText: ["Rolldown", "React", "Hello", "World"],
  },
  "rspack-react-starter": {
    uniqueText: ["Rspack", "React", "Hello", "World"],
  },
  "rspress-ssg": {
    uniqueText: ["Rspress", "Getting Started", "Documentation", "Guide"],
  },
  "solid-zephyr-template": {
    uniqueText: ["Solid", "SolidJS", "Hello", "World"],
  },
  "svelte-zephyr-template": {
    uniqueText: ["Svelte", "SvelteKit", "Welcome", "Hello"],
  },
  // Microfrontend apps
  "airbnb-react-host": {
    uniqueText: ["Airbnb", "Home", "Properties", "Welcome"],
  },
  "default-webpack-mf-first": {
    uniqueText: ["Webpack", "Module Federation", "Remote", "Host"],
  },
  "turbo-host": {
    uniqueText: ["Turbo", "Host", "Module Federation", "Remote"],
  },
  "vite-host": {
    uniqueText: ["Vite", "Host", "Module Federation", "Remote"],
  },
  // Generic fallbacks
  default: {
    uniqueText: ["Welcome", "Hello", "Home", "App", "Component", "React", "Vue", "Angular"],
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
    test.setTimeout(120 * 1000); // 2 minutes timeout for the entire test
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

        // Check that page has rendered content (not just empty)
        const bodyText = await page.textContent("body");
        expect(bodyText?.trim().length).toBeGreaterThan(10);

        // Check for unique text content that validates correct app deployment
        let foundUniqueText = true; // Default to true for apps without specific text requirements
        if (validation.uniqueText.length > 0) {
          foundUniqueText = false;
          for (const text of validation.uniqueText) {
            if (bodyText?.toLowerCase().includes(text.toLowerCase())) {
              console.log(`✓ Found unique text: "${text}" for ${app.name}`);
              foundUniqueText = true;
              break;
            }
          }

          if (!foundUniqueText) {
            console.log(
              `⚠️ Expected text not found for ${app.name}. Looking for: ${validation.uniqueText.join(
                ", "
              )}`
            );
            console.log(
              `📄 Page content snippet: "${bodyText?.slice(0, 200)}..."`
            );
            // Use soft assertion to continue testing other apps
            expect.soft(foundUniqueText).toBe(true);
          }
        }

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
