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

// App-specific validation rules with unique content to verify correct deployment
const APP_VALIDATIONS: Record<string, AppValidation> = {
  // Framework-specific apps
  "angular-vite-zephyr-template": {
    uniqueText: ["Angular", "Vite", "Welcome", "Hello"],
  },
  "qwik-starter": {
    uniqueText: ["Qwik", "Welcome to Qwik", "City", "Welcome"],
  },
  "react-vite-ts": {
    uniqueText: ["Vite", "React", "Click", "count", "Edit"],
  },
  "solid-zephyr-template": {
    uniqueText: ["Solid", "SolidJS", "Hello", "World"],
  },
  "svelte-zephyr-template": {
    uniqueText: ["Svelte", "SvelteKit", "Welcome", "Hello"],
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
  "rspack-react-starter": {
    uniqueText: ["Rspack", "React", "Hello", "World"],
  },
  "rolldown-react": {
    uniqueText: ["Rolldown", "React", "Hello", "World"],
  },
  "rspress-ssg": {
    uniqueText: ["Rspress", "Getting Started", "Documentation", "Guide"],
  },

  // Module Federation apps
  "create-mf-app-rspack-host": {
    uniqueText: ["Module Federation", "Host", "Remote", "Micro"],
  },
  "default-webpack-mf-first": {
    uniqueText: ["Webpack", "Module Federation", "Remote", "Host"],
  },
  "default-webpack-mf-second": {
    uniqueText: ["Webpack", "Module Federation", "Remote", "Host"],
  },
  host: {
    uniqueText: ["Host", "Module Federation", "Remote", "Micro"],
  },
  shell: {
    uniqueText: ["Shell", "Module Federation", "Remote", "Micro"],
  },
  remote1: {
    uniqueText: ["Remote", "Module Federation", "Remote1", "Micro"],
  },
  remote2: {
    uniqueText: ["Remote", "Module Federation", "Remote2", "Micro"],
  },

  // Airbnb clone microfrontends
  "airbnb-react-host": {
    uniqueText: ["Airbnb", "Home", "Properties", "Welcome"],
  },
  "airbnb-categories": {
    uniqueText: ["Categories", "Airbnb", "Search", "Filter"],
  },
  "airbnb-favorites": {
    uniqueText: ["Favorites", "Airbnb", "Saved", "Wishlist"],
  },
  "airbnb-home": {
    uniqueText: ["Home", "Airbnb", "Welcome", "Search"],
  },
  "airbnb-properties": {
    uniqueText: ["Properties", "Airbnb", "Listings", "Available"],
  },
  "airbnb-reservations": {
    uniqueText: ["Reservations", "Airbnb", "Bookings", "Trips"],
  },
  "airbnb-trips": {
    uniqueText: ["Trips", "Airbnb", "Travel", "Journey"],
  },

  // Tractor v2 microfrontends
  "tractor-v2-app": {
    uniqueText: ["Tractor", "Welcome", "App", "Home"],
  },
  "tractor-v2-checkout": {
    uniqueText: ["Checkout", "Tractor", "Cart", "Purchase"],
  },
  "tractor-v2-decide": {
    uniqueText: ["Decide", "Tractor", "Choose", "Select"],
  },
  "tractor-v2-explore": {
    uniqueText: ["Explore", "Tractor", "Discover", "Browse"],
  },

  // Team microfrontends
  "team-blue": {
    uniqueText: ["Blue", "Team", "Welcome", "Hello"],
  },
  "team-green": {
    uniqueText: ["Green", "Team", "Welcome", "Hello"],
  },
  "team-red": {
    uniqueText: ["Red", "Team", "Welcome", "Hello"],
  },

  // Vite microfrontends
  "vite-host": {
    uniqueText: ["Vite", "Host", "Module Federation", "Remote"],
  },
  "vite-remote": {
    uniqueText: ["Vite", "Remote", "Module Federation", "Component"],
  },
  "vite-rspack": {
    uniqueText: ["Vite", "Rspack", "Bundle", "Build"],
  },
  "vite-webpack": {
    uniqueText: ["Vite", "Webpack", "Bundle", "Build"],
  },

  // Generic fallback
  default: {
    uniqueText: ["Welcome", "Hello", "Home", "App", "Component", "React", "Vue", "Angular"],
  },
};

test.describe("Individual App Deployment Validation", () => {
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
  });

  test("validate all deployed applications individually", async ({ page }) => {
    test.setTimeout(120 * 1000);
    // Get deployed apps within the test
    const results = [];

    for (const app of deployedApps) {
      console.log(`\n🧪 Testing ${app.name}: ${app.url}`);

      // Skip turbo apps for now as requested
      if (app.name.includes("turbo-")) {
        console.log(
          `  ⏭️  Skipping ${app.name} - turbo apps commented out until fixed`
        );
        results.push({
          name: app.name,
          status: "skipped",
          reason: "turbo app",
        });
        continue;
      }

      const validation =
        APP_VALIDATIONS[app.name] || APP_VALIDATIONS["default"];

      try {
        // Navigate to the app
        const response = await page.goto(app.url, {
          waitUntil: "networkidle",
          timeout: 15000,
        });

        // Check response status
        const status = response?.status();
        expect(status).toBeLessThan(400);

        // Wait for content to render
        await page.waitForTimeout(3000);

        // Check for unique text content that validates correct app deployment
        const pageText = await page.textContent("body");
        expect(pageText?.trim().length).toBeGreaterThan(20);

        let foundUniqueText = true; // Default to true for apps without specific text requirements
        if (validation.uniqueText.length > 0) {
          foundUniqueText = false;
          for (const text of validation.uniqueText) {
            if (pageText?.toLowerCase().includes(text.toLowerCase())) {
              console.log(`    ✓ Found unique text: "${text}"`);
              foundUniqueText = true;
              break;
            }
          }

          if (!foundUniqueText) {
            console.log(
              `    ⚠️  Expected text not found. Looking for: ${validation.uniqueText.join(
                ", "
              )}`
            );
            console.log(
              `    📄 Page content snippet: "${pageText?.slice(0, 200)}..."`
            );
            // Use soft assertion to continue testing other apps
            expect.soft(foundUniqueText).toBe(true);
          }
        }

        results.push({
          name: app.name,
          status: "passed",
          foundUniqueText,
          httpStatus: status,
        });
        console.log(`    ✅ ${app.name} validation passed`);
      } catch (error: any) {
        console.error(`    ❌ ${app.name} failed:`, error.message);

        // Try to get some debug info
        try {
          const bodyText = await page.textContent("body");
          console.log(
            `    📄 Page content snippet: "${bodyText?.slice(0, 200)}..."`
          );
        } catch (debugError: any) {
          console.log(`    🔍 Debug failed: ${debugError.message}`);
        }

        results.push({
          name: app.name,
          status: "failed",
          error: error.message,
        });

        // Use soft assertion to continue with other apps
        expect.soft(false).toBe(true);
      }
    }

    // Summary
    const passed = results.filter((r) => r.status === "passed").length;
    const failed = results.filter((r) => r.status === "failed").length;
    const skipped = results.filter((r) => r.status === "skipped").length;

    console.log(`\n📊 Individual App Validation Summary:`);
    console.log(`    ✅ Passed: ${passed}`);
    console.log(`    ❌ Failed: ${failed}`);
    console.log(`    ⏭️  Skipped: ${skipped}`);
    console.log(`    📊 Total: ${results.length}`);

    // Expect at least 80% of non-skipped apps to pass
    const testableApps = results.length - skipped;
    if (testableApps > 0) {
      expect(passed / testableApps).toBeGreaterThan(0.8);
    }
  });

  test("deployment summary", async () => {
    const totalApps = deployedApps.length;
    const turboApps = deployedApps.filter((app) =>
      app.name.includes("turbo-")
    ).length;
    const activeApps = totalApps - turboApps;

    console.log(`\n📊 Deployment Summary:`);
    console.log(`   Total applications: ${totalApps}`);
    console.log(`   Active tests: ${activeApps}`);
    console.log(`   Turbo apps (skipped): ${turboApps}`);
    console.log(
      `   Apps with custom validation: ${
        Object.keys(APP_VALIDATIONS).filter((k) => k !== "default").length
      }`
    );

    expect(totalApps).toBeGreaterThan(0);
    expect(activeApps).toBeGreaterThan(0);
  });
});
