import { defineConfig } from '@playwright/test';

const offlineEnvironment = {
  ...process.env,
  ZEPHYR_EXAMPLE_OFFLINE: '1',
};

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  use: {
    baseURL: 'http://127.0.0.1:3000',
    trace: 'retain-on-failure',
  },
  webServer: [
    {
      command:
        "pnpm --filter './apps/header' exec rsbuild dev --host 127.0.0.1 --strict-port",
      env: offlineEnvironment,
      reuseExistingServer: false,
      url: 'http://127.0.0.1:3001/remoteEntry.js',
      timeout: 120_000,
    },
    {
      command:
        "pnpm --filter './apps/hero' exec rsbuild dev --host 127.0.0.1 --strict-port",
      env: offlineEnvironment,
      reuseExistingServer: false,
      url: 'http://127.0.0.1:3002/remoteEntry.js',
      timeout: 120_000,
    },
    {
      command:
        "pnpm --filter './apps/host' exec rsbuild dev --host 127.0.0.1 --strict-port",
      env: offlineEnvironment,
      reuseExistingServer: false,
      url: 'http://127.0.0.1:3000',
      timeout: 120_000,
    },
  ],
});
