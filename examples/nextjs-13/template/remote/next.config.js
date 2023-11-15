const NextFederationPlugin = require('@module-federation/nextjs-mf');

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, options) => {
    const { isServer } = options;
    config.plugins.push(
      new NextFederationPlugin({
        name: 'remote',
        filename: 'static/chunks/remoteEntry.js',
        exposes: {
          './table': './components/table/table',
          // whatever else
        },
        shared: {
          // whatever else
        },
      })
    );

    return config;
  },
};

module.exports = nextConfig;
