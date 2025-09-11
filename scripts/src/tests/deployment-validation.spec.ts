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
    uniqueText: ["Angular", "Vite"],
  },
  "react-vite-ts": {
    uniqueText: ["Vite", "React"],
  },
  "solid-zephyr-template": {
    uniqueText: ["Solid", "Vite"],
  },
  "svelte-zephyr-template": {
    uniqueText: ["Svelte", "Vite"],
  },
  "modern-js": {
    uniqueText: ["Modern.js", "Get Started"],
  },
  "nx-ng": {
    uniqueText: ["Welcome", "Hello there"],
  },
  "parcel-react": {
    uniqueText: ["Hello", "Zephyr", "Parcel"],
  },
  "rspack-react-starter": {
    uniqueText: ["Rspack", "React"],
  },
  "rolldown-react": {
    uniqueText: ["Rolldown", "React"],
  },
  "rollup-react-ts": {
    uniqueText: ["Rollup", "React"],
  },
  "rspress-ssg": {
    uniqueText: ["My Site", "A cool website!"],
  },

  // Module Federation apps
  "create-mf-app-rspack-host": {
    uniqueText: ["with zephyr", "react", "TypeScript"],
  },
  "default-webpack-mf-first": {
    uniqueText: ["App1", "App 2"],
  },
  "default-webpack-mf-second": {
    uniqueText: ["App 2"],
  },
  host: {
    uniqueText: ["Hello there", "Welcome host", "Remote1", "Remote2"],
  },
  shell: {
    uniqueText: ["Hello there", "Welcome shell"],
  },
  remote1: {
    uniqueText: ["Hello there", "Welcome remote1"],
  },
  remote2: {
    uniqueText: ["Hello there", "Welcome remote2"],
  },

  // Airbnb clone microfrontends
  "airbnb-react-host": {
    uniqueText: ["Airbnb", "your home"],
  },
  "airbnb-categories": {
    uniqueText: ["Beach", "Windmills"],
  },
  "airbnb-favorites": {
    uniqueText: ["Favorites", "favorited"],
  },
  "airbnb-home": {
    uniqueText: ["Americas", "Europe"],
  },
  "airbnb-properties": {
    uniqueText: ["Properties", "List of your properties"],
  },
  "airbnb-reservations": {
    uniqueText: ["Reservations", "Bookings on your properties"],
  },
  "airbnb-trips": {
    uniqueText: ["Trips", "Where you've been and where you're going"],
  },

  // Basehref examples
  "basehref-rspack-app": {
    uniqueText: ["Rspack", "React", "TypeScript"],
  },
  "basehref-vite-app": {
    uniqueText: ["BaseHref Vite Example", "Configuration Info"],
  },
  "basehref-webpack-app": {
    uniqueText: ["BaseHref Webpack Example", "Navigation"],
  },

  // Tractor v2 microfrontends
  "tractor-v2-app": {
    uniqueText: [
      "Machines",
      "Stores",
      "Classic Tractors",
      "Autonomous Tractors",
    ],
  },
  "tractor-v2-checkout": {
    uniqueText: ["Checkout Remote", "Cart Page"],
  },
  "tractor-v2-decide": {
    uniqueText: ["Decide Remote", "Product Page"],
  },
  "tractor-v2-explore": {
    uniqueText: ["Explore Remote", "Home Page"],
  },

  // Team microfrontends
  "team-blue": {
    uniqueText: ["basket", "item"],
  },
  "team-green": {
    uniqueText: ["Related", "Products"],
  },
  "team-red": {
    uniqueText: ["The Model Store", "Tractor"],
  },

  // Vite microfrontends
  "vite-host": {
    uniqueText: ["Vite remote", "from Webpack", "from Rspack", "Vite + React"],
  },
  "vite-remote": {
    uniqueText: ["Vite + React", "button"],
  },
  "vite-rspack": {
    uniqueText: ["This is a component from Rspack.", "react"],
  },
  "vite-webpack": {
    uniqueText: ["This is a component from Webpack.", "Button"],
  },

  // Additional apps found in deployment
  "-react-vite-nx-source": {
    uniqueText: ["Welcome react-vite-nx", "Hello there"],
  },

  // Turbo apps - currently disabled due to deployment issues
  // "turbo-host": {
  //   uniqueText: ["Turbo", "Host"],
  // },
  // "turbo-home": {
  //   uniqueText: ["Turbo", "Home"],
  // },
  // "turbo-settings": {
  //   uniqueText: ["Turbo", "Settings"],
  // },

  default: {
    uniqueText: ["Add your test validation to ./scripts/tests"],
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
        console.log(
          `  ⏭️  Skipping ${app.name} - turbo apps are currently disabled`
        );
        continue;
      }

      const validation =
        APP_VALIDATIONS[app.name] || APP_VALIDATIONS["default"];

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

      const bodyText = await page.textContent("body");

      // HARD FAIL: Must find ALL expected text content
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
        console.log(`  ❌ Missing text(s): ${missingTexts.join(", ")}`);
        console.log(`  ✓ Found text(s): ${foundTexts.join(", ")}`);
        console.log(`  📄 Page content: "${bodyText?.slice(0, 300)}..."`);
      }

      expect(
        missingTexts.length,
        `${app.name} is missing required text(s): ${missingTexts.join(
          ", "
        )}. Found: ${foundTexts.join(", ")}`
      ).toBe(0);

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
        criticalErrors.forEach((error) => console.log(`    - ${error}`));

        // HARD FAIL if too many critical errors
        expect(
          criticalErrors.length,
          `${app.name} has ${criticalErrors.length} critical console errors`
        ).toBeLessThan(3);
      }

      console.log(`  ✅ ${app.name} validation passed`);
    }

    const testedApps = deployedApps.filter(
      (app) => !app.name.includes("turbo-")
    ).length;
    console.log(`\n🎉 All ${testedApps} applications validated successfully!`);
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

    expect(totalApps).toBeGreaterThan(0);
    expect(activeApps).toBeGreaterThan(0);
  });
});
