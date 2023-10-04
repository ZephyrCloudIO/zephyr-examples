const { composePlugins, withNx } = require('@nx/next');
const NextFederationPlugin = require('@module-federation/nextjs-mf');

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: {
    // Set this to true if you would like to to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },
  webpack: (config) => {
    config.plugins.push(
      new NextFederationPlugin({
        name: 'footer',
        filename: 'static/chunks/remoteEntry.js',
        exposes: {
          './footer': './components/footer/footer',
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

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
];

module.exports = composePlugins(...plugins)(nextConfig);
