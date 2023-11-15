// eslint-disable-next-line @typescript-eslint/no-var-requires
const withNx = require('@nrwl/next/plugins/with-nx');
const NextFederationPlugin = require('@module-federation/nextjs-mf');

const REMOTE_APP_URL =
  process.env.NEXT_PUBLIC_REMOTE_APP_URL || 'http://localhost:3001';

// this enables you to use import() and the webpack parser
// loading remotes on demand, not ideal for SSR
const remotes = (/** @type {Boolean} */ isServer) => {
  const location = isServer ? 'ssr' : 'chunks';
  return {
    remote: `remote@${REMOTE_APP_URL}/_next/static/${location}/remoteEntry.js`,
  };
};

/**
 * @type {import('@nrwl/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: {
    // Set this to true if you would like to to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },
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
      })
    );

    return config;
  },
};

module.exports = withNx(nextConfig);
