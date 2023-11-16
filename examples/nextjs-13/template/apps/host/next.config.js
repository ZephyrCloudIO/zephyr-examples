const NextFederationPlugin = require('@module-federation/nextjs-mf');
const { NextMedusaPlugin } = require('@module-federation/dashboard-plugin');

const dashboardURL = `${process.env.DASHBOARD_BASE_URL}/env/development/get-remote?token=${process.env.DASHBOARD_READ_TOKEN}`;

const REMOTE_APP_URL = process.env.NEXT_PUBLIC_REMOTE_APP_URL || 'http://localhost:3011';

// this enables you to use import() and the webpack parser
// loading remotes on demand, not ideal for SSR
const remotes = (/** @type {Boolean} */ isServer) => {
  const location = isServer ? 'ssr' : 'chunks';

  return {
    // remote: `internal ${require.resolve('./delegate-module.js')}?remote=remote@${REMOTE_APP_URL}/_next/static/${location}/remoteEntry.js`,
    remote: `remote@${REMOTE_APP_URL}/_next/static/${location}/remoteEntry.js`,
  };
};

// http://localhost:3002/4dd451fb268a702d01ed.remoteEntry.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  cleanDistDir: false,
  webpack: (config, options) => {
    const { isServer } = options;
    config.plugins.push(
      new NextFederationPlugin({
        name: 'host',
        filename: 'static/chunks/remoteEntry.js',
        remotes: remotes(isServer),
        exposes: {
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
