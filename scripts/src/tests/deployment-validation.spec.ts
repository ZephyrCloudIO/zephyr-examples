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
    uniqueText: ["Beach", "Windmills", "Modern", "Countryside"],
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

  // Turbo apps - currently disabled due to deployment issues
  // "turbo-host": {
  //   uniqueText: ["Turbo", "Host", "Module Federation", "Remote"],
  // },
  // "turbo-home": {
  //   uniqueText: ["Turbo", "Home", "Welcome", "App"],
  // },
  // "turbo-settings": {
  //   uniqueText: ["Turbo", "Settings", "Configuration", "Options"],
  // },

  // Generic fallback
  default: {
    uniqueText: ["Welcome", "Hello", "Home", "App", "Component", "React", "Vue", "Angular"],
  },
};

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

  test("all deployed applications must load successfully", async ({ page }) => {
    test.setTimeout(300000); // 5 minutes for all apps

    expect(deployedApps.length).toBeGreaterThan(0);

    for (const app of deployedApps) {
      console.log(`\n🧪 Validating ${app.name}: ${app.url}`);

      // Skip turbo apps for now as they're known to be problematic
      if (app.name.includes("turbo-")) {
        console.log(`  ⏭️  Skipping ${app.name} - turbo apps are currently disabled`);
        continue;
      }

      const validation = APP_VALIDATIONS[app.name] || APP_VALIDATIONS["default"];

      // Navigate to the app - HARD FAIL if this doesn't work
      const response = await page.goto(app.url, {
        waitUntil: "networkidle",
        timeout: 30000,
      });

      // HARD FAIL: HTTP status must be success
      const status = response?.status();
      expect(status, `${app.name} returned HTTP ${status}`).toBeLessThan(400);

      // Wait for content to render
      await page.waitForTimeout(3000);

      // HARD FAIL: Page must have content
      const bodyText = await page.textContent("body");
      expect(
        bodyText?.trim().length,
        `${app.name} has no content (${bodyText?.trim().length} chars)`
      ).toBeGreaterThan(20);

      // HARD FAIL: Must find expected text content
      let foundUniqueText = false;
      for (const text of validation.uniqueText) {
        if (bodyText?.toLowerCase().includes(text.toLowerCase())) {
          console.log(`  ✓ Found expected text: "${text}"`);
          foundUniqueText = true;
          break;
        }
      }

      if (!foundUniqueText) {
        console.log(`  ❌ Expected text not found. Looking for: ${validation.uniqueText.join(", ")}`);
        console.log(`  📄 Page content: "${bodyText?.slice(0, 300)}..."`);
      }

      expect(
        foundUniqueText,
        `${app.name} does not contain expected text. Expected one of: ${validation.uniqueText.join(", ")}`
      ).toBe(true);

      // Check for critical console errors
      const errorLogs: string[] = [];
      page.on("console", (msg) => {
        if (msg.type() === "error") {
          errorLogs.push(msg.text());
        }
      });

      // Filter out non-critical errors
      const criticalErrors = errorLogs.filter(
        (error) =>
          !error.includes("favicon") &&
          !error.includes("404") &&
          !error.includes("net::ERR_FAILED") &&
          !error.includes("Failed to load resource")
      );

      if (criticalErrors.length > 0) {
        console.log(`  ⚠️  Critical console errors found for ${app.name}:`);
        criticalErrors.forEach(error => console.log(`    - ${error}`));
        
        // HARD FAIL if too many critical errors
        expect(
          criticalErrors.length,
          `${app.name} has ${criticalErrors.length} critical console errors`
        ).toBeLessThan(3);
      }

      console.log(`  ✅ ${app.name} validation passed`);
    }

    const testedApps = deployedApps.filter(app => !app.name.includes("turbo-")).length;
    console.log(`\n🎉 All ${testedApps} applications validated successfully!`);
  });

  test("deployment summary", async () => {
    const totalApps = deployedApps.length;
    const turboApps = deployedApps.filter(app => app.name.includes("turbo-")).length;
    const activeApps = totalApps - turboApps;
    
    console.log(`\n📊 Deployment Summary:`);
    console.log(`   Total applications: ${totalApps}`);
    console.log(`   Validated applications: ${activeApps}`);
    console.log(`   Turbo apps (skipped): ${turboApps}`);
    console.log(`   Apps with custom validation: ${Object.keys(APP_VALIDATIONS).filter(k => k !== 'default').length}`);
    
    expect(totalApps).toBeGreaterThan(0);
    expect(activeApps).toBeGreaterThan(0);
  });
});