const NextFederationPlugin = require('@module-federation/nextjs-mf');
const { NextMedusaPlugin } = require('@module-federation/dashboard-plugin');
const { execSync } = require('child_process');
/** @type {import('next').NextConfig} */
const nextConfig = {
  cleanDistDir: false,
  webpack: (config, options) => {
    const gitSHA = execSync(`git rev-list -n 1 HEAD -- .`, { cwd: process.cwd() }).toString().trim();
    const { isServer } = options;
    config.plugins.push(
      new NextFederationPlugin({
        name: 'remote__REMOTE_VERSION__',
        library: { type: 'var', name: 'remote__REMOTE_VERSION__' },
        // name: 'remoteRaw',
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
        environment: 'development',
        dashboardURL: `${process.env.DASHBOARD_BASE_URL}/update?token=${process.env.DASHBOARD_WRITE_TOKEN}`,
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
