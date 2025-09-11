import { test, expect } from "@playwright/test";
import { getDeployedApps } from "./test-helper.js";

interface DeployedApp {
  app: string;
  name: string;
  url: string;
}

interface AppValidation {
  title: RegExp;
  uniqueText: string[];
  selectors: string[];
}

// App-specific validation rules with unique content to verify correct deployment
const APP_VALIDATIONS: Record<string, AppValidation> = {
  // Framework-specific apps
  "angular-vite-zephyr-template": {
    title: /angular/i,
    uniqueText: ["Angular", "Vite"],
    selectors: ["app-root"],
  },
  "qwik-starter": {
    title: /qwik/i,
    uniqueText: ["Qwik", "Welcome to Qwik"],
    selectors: ["body"],
  },
  "react-vite-ts": {
    title: /vite.*react/i,
    uniqueText: ["Vite", "React"],
    selectors: ["#root"],
  },
  "solid-zephyr-template": {
    title: /solid/i,
    uniqueText: ["Solid", "SolidJS"],
    selectors: ["#root"],
  },
  "svelte-zephyr-template": {
    title: /svelte/i,
    uniqueText: ["Svelte", "SvelteKit"],
    selectors: ["body"],
  },
  "modern-js": {
    title: /modern/i,
    uniqueText: ["Modern.js", "Modern"],
    selectors: ["#root"],
  },
  "nx-ng": {
    title: /nx/i,
    uniqueText: ["Nx", "Angular"],
    selectors: ["app-root"],
  },
  "parcel-react": {
    title: /parcel/i,
    uniqueText: ["Parcel", "React"],
    selectors: ["#root"],
  },
  "rspack-react-starter": {
    title: /rspack/i,
    uniqueText: ["Rspack", "React"],
    selectors: ["#root"],
  },
  "rolldown-react": {
    title: /rolldown/i,
    uniqueText: ["Rolldown", "React"],
    selectors: ["#root"],
  },
  "rspress-ssg": {
    title: /rspress/i,
    uniqueText: ["Rspress", "Getting Started"],
    selectors: ["#app"],
  },

  // Module Federation apps
  "create-mf-app-rspack-host": {
    title: /host/i,
    uniqueText: ["Module Federation", "Host"],
    selectors: ["#root"],
  },
  "default-webpack-mf-first": {
    title: /webpack/i,
    uniqueText: ["Webpack", "Module Federation"],
    selectors: ["#root"],
  },
  "default-webpack-mf-second": {
    title: /webpack/i,
    uniqueText: ["Webpack", "Module Federation"],
    selectors: ["#root"],
  },
  host: {
    title: /.+/,
    uniqueText: ["Host", "Module Federation"],
    selectors: ["#root"],
  },
  shell: {
    title: /.+/,
    uniqueText: ["Shell", "Module Federation"],
    selectors: ["#root"],
  },
  remote1: {
    title: /.+/,
    uniqueText: ["Remote", "Module Federation"],
    selectors: ["#root"],
  },
  remote2: {
    title: /.+/,
    uniqueText: ["Remote", "Module Federation"],
    selectors: ["#root"],
  },

  // Airbnb clone microfrontends
  "airbnb-react-host": {
    title: /airbnb/i,
    uniqueText: ["Airbnb", "Home", "Properties"],
    selectors: ["#root", "nav"],
  },
  "airbnb-categories": {
    title: /airbnb/i,
    uniqueText: ["Categories", "Airbnb"],
    selectors: ["#root"],
  },
  "airbnb-favorites": {
    title: /airbnb/i,
    uniqueText: ["Favorites", "Airbnb"],
    selectors: ["#root"],
  },
  "airbnb-home": {
    title: /airbnb/i,
    uniqueText: ["Home", "Airbnb"],
    selectors: ["#root"],
  },
  "airbnb-properties": {
    title: /airbnb/i,
    uniqueText: ["Properties", "Airbnb"],
    selectors: ["#root"],
  },
  "airbnb-reservations": {
    title: /airbnb/i,
    uniqueText: ["Reservations", "Airbnb"],
    selectors: ["#root"],
  },
  "airbnb-trips": {
    title: /airbnb/i,
    uniqueText: ["Trips", "Airbnb"],
    selectors: ["#root"],
  },

  // Tractor v2 microfrontends
  "tractor-v2-app": {
    title: /tractor/i,
    uniqueText: ["Tractor", "Welcome"],
    selectors: ["#root"],
  },
  "tractor-v2-checkout": {
    title: /tractor/i,
    uniqueText: ["Checkout", "Tractor"],
    selectors: ["#root"],
  },
  "tractor-v2-decide": {
    title: /tractor/i,
    uniqueText: ["Decide", "Tractor"],
    selectors: ["#root"],
  },
  "tractor-v2-explore": {
    title: /tractor/i,
    uniqueText: ["Explore", "Tractor"],
    selectors: ["#root"],
  },

  // Team microfrontends
  "team-blue": {
    title: /.+/,
    uniqueText: ["Blue", "Team"],
    selectors: ["#root"],
  },
  "team-green": {
    title: /.+/,
    uniqueText: ["Green", "Team"],
    selectors: ["#root"],
  },
  "team-red": {
    title: /.+/,
    uniqueText: ["Red", "Team"],
    selectors: ["#root"],
  },

  // Vite microfrontends
  "vite-host": {
    title: /vite/i,
    uniqueText: ["Vite", "Host"],
    selectors: ["#root"],
  },
  "vite-remote": {
    title: /vite/i,
    uniqueText: ["Vite", "Remote"],
    selectors: ["#root"],
  },
  "vite-rspack": {
    title: /vite/i,
    uniqueText: ["Vite", "Rspack"],
    selectors: ["#root"],
  },
  "vite-webpack": {
    title: /vite/i,
    uniqueText: ["Vite", "Webpack"],
    selectors: ["#root"],
  },

  // Turbo apps - commented out as requested since they're not showing content
  // 'turbo-host': {
  //   title: /turbo/i,
  //   uniqueText: ['Turbo', 'Host'],
  //   selectors: ['#root']
  // },
  // 'turbo-home': {
  //   title: /turbo/i,
  //   uniqueText: ['Turbo', 'Home'],
  //   selectors: ['#root']
  // },
  // 'turbo-settings': {
  //   title: /turbo/i,
  //   uniqueText: ['Turbo', 'Settings'],
  //   selectors: ['#root']
  // },

  // Generic fallback
  default: {
    title: /.+/,
    uniqueText: [],
    selectors: ["body", "#root", "#app", "main", "div"],
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

        // Check page title
        const title = await page.title();
        expect(title).toMatch(validation.title);
        expect(title.length).toBeGreaterThan(0);

        // Check for required selectors
        let foundValidSelector = false;
        for (const selector of validation.selectors) {
          try {
            const element = page.locator(selector).first();
            if (await element.isVisible()) {
              foundValidSelector = true;
              console.log(`    ✓ Found valid selector: ${selector}`);
              break;
            }
          } catch (e) {
            continue;
          }
        }
        expect(foundValidSelector).toBe(true);

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
          title,
          foundUniqueText,
          httpStatus: status,
        });
        console.log(`    ✅ ${app.name} validation passed`);
      } catch (error: any) {
        console.error(`    ❌ ${app.name} failed:`, error.message);

        // Try to get some debug info
        try {
          const title = await page.title();
          const bodyText = await page.textContent("body");
          console.log(`    🔍 Debug - Title: "${title}"`);
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
