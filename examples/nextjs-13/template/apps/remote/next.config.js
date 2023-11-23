const NextFederationPlugin = require('@module-federation/nextjs-mf');
const { NextMedusaPlugin } = require('@module-federation/dashboard-plugin');
const { execSync } = require('child_process');

// you can use NODE_ENV to switch between environments
const environment = 'development';

/** @type {import('next').NextConfig} */
const nextConfig = {
  cleanDistDir: false,
  webpack: (config, { isServer }) => {
    // TODO: should use versionResolver from ze-plugin/next-utils/version-resolver.js
    const gitSHA = execSync(`git rev-list -n 1 HEAD -- .`, { cwd: process.cwd() }).toString().trim();

    // workaround to @module-federation/nextjs-mf@v7 bug
    config.optimization.minimize = false;

    config.plugins.push(
      new NextFederationPlugin({
        // name: 'remote',
        name: 'remote__REMOTE_VERSION__',
        filename: 'static/chunks/remoteEntry.js',
        remotes: {},
        exposes: {
          './table': './components/table/table',
          // whatever else
        },
        shared: {
          // whatever else
        },
      }),
      new NextMedusaPlugin({
        skipPost: isServer,
        versionStrategy: gitSHA,
        filename: 'dashboard.json',
        environment,
        dashboardURL: `${process.env.ZE_DASHBOARD_API_URL}/update?token=${process.env.ZE_WRITE_TOKEN}`,
        metadata: {
          baseUrl: 'http://localhost:3011',
          source: {
            url: 'https://github.com/ZephyrCloudIO/zephyr-examples/tree/main/examples/nextjs-13/template/apps/remote',
          },
          remote: 'http://localhost:3011/_next/static/chunks/remoteEntry.js',
        },
      })
    );

    return config;
  },
};

module.exports = nextConfig;
