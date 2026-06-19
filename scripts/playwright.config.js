const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './src/tests',
  outputDir: './test-results',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1, // Single worker to avoid duplicate API calls
  reporter: [['html', { outputFolder: './playwright-report' }]],
  timeout: 120000,
  use: {
    baseURL: 'https://zephyrcloud.app',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    // The CI Playwright container runs as root; Chromium requires --no-sandbox
    // to launch as root. Only applied in CI so local runs keep the sandbox.
    launchOptions: {
      args: process.env.CI ? ['--no-sandbox'] : [],
    },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
