const NextFederationPlugin = require('@module-federation/nextjs-mf');
const { NextMedusaPlugin } = require('@module-federation/dashboard-plugin');

/** @type {import('next').NextConfig} */
const nextConfig = {
  cleanDistDir: false,
  webpack: (config, options) => {
    const { isServer } = options;
    config.plugins.push(
      new NextFederationPlugin({
        name: 'remote__REMOTE_VERSION__',
        library: { type: 'var', name: 'remote__REMOTE_VERSION__' },
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
        versionStrategy: 'buildHash',
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
