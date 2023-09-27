const { composePlugins, withNx } = require('@nx/next');
const NextFederationPlugin = require('@module-federation/nextjs-mf');
const DashboardPlugin = require('@module-federation/dashboard-plugin');

const REMOTE_APP_URL =
  process.env.NEXT_PUBLIC_REMOTE_APP_URL || 'http://localhost:3001';

// this enables you to use import() and the webpack parser
// loading remotes on demand, not ideal for SSR
const remotes = (/** @type {Boolean} */ isServer) => {
  const location = isServer ? 'ssr' : 'chunks';
  return {
    remote: `internal ${require.resolve(
      './delegate-module.js'
    )}?remote=remote@${REMOTE_APP_URL}/_next/static/${location}/remoteEntry.js`,
    // remote: `remote@${REMOTE_APP_URL}/_next/static/${location}/remoteEntry.js`,
  };
};

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: {
    // Set this to true if you would like to to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },
  webpack: (config, options) => {
    const { isServer } = options;

    const mfPluginOptions = {
      name: 'host',
      filename: 'static/chunks/remoteEntry.js',
      remotes: remotes(isServer),
      exposes: {
        // whatever else
      },
      shared: {
        // whatever else
        shared: require('./package.json').dependencies,
      },
    };

    config.plugins.push(new NextFederationPlugin(mfPluginOptions));

    config.plugins.push(
      new DashboardPlugin({
        versionStrategy: `${Date.now()}`,
        filename: 'dashboard.json',
        dashboardURL: `https://api-dev.zephyr-cloud.io/update?token=${process.env.DASHBOARD_WRITE_TOKEN}`,
        versionChangeWebhook: 'http://cnn.com/',
        metadata: {
          clientUrl: process.env.DASHBOARD_BASE_URL,
          baseUrl: 'http://localhost:3000',
          remote: 'http://localhost:3000/remoteEntry.js',
          source: {
            url: 'https://github.com/ZephyrCloudIO/zephyr-examples',
          },
        },
        standalone: mfPluginOptions,
      })
    );

    return config;
  },
};

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
];

module.exports = composePlugins(...plugins)(nextConfig);
