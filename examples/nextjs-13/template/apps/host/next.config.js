const { DefinePlugin } = require('webpack');
const NextFederationPlugin = require('@module-federation/nextjs-mf');
const { NextMedusaPlugin } = require('@module-federation/dashboard-plugin');
const { versionResolver } = require('./ze-plugin/next-utils/version-resolver');
const { remotesResolver } = require('./ze-plugin/next-utils/remote-resolver');
const remoteMap = require('./remote-map');

// you can use NODE_ENV to switch between environments
const environment = 'development';

/** @type {import('next').NextConfig} */
const nextConfig = {
  cleanDistDir: false,
  webpack: (config, { isServer }) => {
    const version = versionResolver();

    // workaround to @module-federation/nextjs-mf@v7 bug
    config.optimization.minimize = false;

    config.plugins.push(
      // This is important to pass static data to the ze-remote-delegate during build time
      new DefinePlugin({
        'process.env.ZE_DASHBOARD_API_URL': JSON.stringify(process.env.ZE_DASHBOARD_API_URL),
        'process.env.ZE_DASHBOARD_ENV': JSON.stringify(environment),
        'process.env.ZE_READ_TOKEN': JSON.stringify(process.env.ZE_READ_TOKEN),
      }),
      new NextFederationPlugin({
        name: 'host',
        filename: 'static/chunks/remoteEntry.js',
        remotes: remotesResolver({ isServer, remoteMap, delegatePath: require.resolve('./remote-delegate.ts') }),
        exposes: {
          // whatever else
        },
        shared: {
          // whatever else
        },
      }),
      new NextMedusaPlugin({
        skipPost: isServer,
        versionStrategy: version,
        filename: 'dashboard.json',
        environment,
        dashboardURL: `${process.env.ZE_DASHBOARD_API_URL}/update?token=${process.env.ZE_WRITE_TOKEN}`,
        metadata: {
          baseUrl: 'http://localhost:3010',
          source: {
            url: 'https://github.com/ZephyrCloudIO/zephyr-examples/tree/main/examples/nextjs-13/template/apps/host',
          },
          remote: 'http://localhost:3010/_next/static/chunks/remoteEntry.js',
        },
      })
    );

    return config;
  },
};

module.exports = nextConfig;
