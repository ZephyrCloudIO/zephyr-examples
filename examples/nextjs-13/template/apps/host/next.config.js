const { DefinePlugin } = require('webpack');
const NextFederationPlugin = require('@module-federation/nextjs-mf');
const { NextMedusaPlugin } = require('@module-federation/dashboard-plugin');
const { createDelegatedModule } = require('@module-federation/utilities');

// const REMOTE_APP_URL = process.env.NEXT_PUBLIC_REMOTE_APP_URL || 'http://localhost:3011';

// TODO: need to fix this
// const environment = process.env.NODE_ENV || 'development';
const environment = 'development';
const dashboardURL = `${process.env.DASHBOARD_BASE_URL}/env/${environment}/get-remote?token=${process.env.DASHBOARD_READ_TOKEN}`;

// this enables you to use import() and the webpack parser
// loading remotes on demand, not ideal for SSR
const getRemotes = (/** @type {Boolean} */ isServer) => {
  // TODO: discussion about zephyr + nextjs (SSR remotes)
  const location = isServer ? 'ssr' : 'chunks';
  // const location = 'chunks';

  const remotes = {
    // remote: `__REMOTE_URL__/_next/static/${location}/__REMOTE_VERSION__.remoteEntry.js`,
    // remote: `remote@${REMOTE_APP_URL}/_next/static/${location}/__REMOTE_VERSION__.remoteEntry.js`,
    // remote: `remote@__REMOTE_URL__/_next/static/${location}/__REMOTE_VERSION__.remoteEntry.js`,
    // remote: `__REMOTE_URL__/_next/static/chunks/remoteEntry.js`,
    remote: `http://localhost:3011/_next/static/chunks/remoteEntry.js`,
  };

  return Object.entries(remotes || {}).reduce((acc, [remote, url]) => {
    return {
      ...acc,
      [remote]: createDelegatedModule(require.resolve('./remote-delegate.ts'), {
        remote: `${remote}@${url}`,
      }),
    };
  }, {});
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  cleanDistDir: false,
  webpack: (config, options) => {
    const { isServer } = options;
    config.plugins.push(
      new DefinePlugin({
        'process.env.DASHBOARD_CLIENT_URL': JSON.stringify(dashboardURL),
      }),
      new NextFederationPlugin({
        name: 'host',
        filename: 'static/chunks/remoteEntry.js',
        library: { type: 'var', name: 'host' },
        // remotes: getRemotes(isServer),
        remotes: {
          remote: 'remote@http://localhost:3011/_next/static/chunks/remoteEntry.js',
        },
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
        environment,
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
