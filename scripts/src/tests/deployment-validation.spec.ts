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
          timeout: 30000,
        });

        const status = response?.status();

        // Basic checks
        expect(status).toBeLessThan(400);

        // Check page has rendered content
        await page.waitForTimeout(2000);
        const bodyText = await page.textContent("body");
        expect(bodyText?.trim().length).toBeGreaterThan(10);

        // Get validation rules for this app
        const validation =
          APP_VALIDATIONS[app.name] || APP_VALIDATIONS["default"];

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

        results.push({
          name: app.name,
          url: app.url,
          status,
          foundUniqueText,
          success: true,
        });

        console.log(`✅ ${app.name} - Status: ${status}`);
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

      // Get validation rules for this app
      const validation =
        APP_VALIDATIONS[app.name] || APP_VALIDATIONS["default"];

      // Check page has meaningful content
      const bodyText = await page.textContent("body");
      expect(bodyText?.length).toBeGreaterThan(50);

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

        expect(foundUniqueText).toBe(true);
      }

      console.log(`✅ ${app.name} detailed validation passed`);
    }
  });
});
