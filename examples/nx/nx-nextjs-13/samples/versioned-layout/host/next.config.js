const { composePlugins, withNx } = require('@nx/next');
const NextFederationPlugin = require('@module-federation/nextjs-mf');

const HEADER_REMOTE_APP_URL =
  process.env.NEXT_PUBLIC_HEADER_REMOTE_APP_URL || 'http://localhost:3001';
const FOOTER_REMOTE_APP_URL =
  process.env.NEXT_PUBLIC_FOOTER_REMOTE_APP_URL || 'http://localhost:3002';

// this enables you to use import() and the webpack parser
// loading remotes on demand, not ideal for SSR
const getRemotes = (/** @type {Boolean} */ isServer) => {
  const location = isServer ? 'ssr' : 'chunks';
  return {
    header: `internal ${require.resolve(
      './delegate-module.js'
    )}?remote=header@${HEADER_REMOTE_APP_URL}/_next/static/${location}/remoteEntry.js`,
    footer: `internal ${require.resolve(
      './delegate-module.js'
    )}?remote=footer@${FOOTER_REMOTE_APP_URL}/_next/static/${location}/remoteEntry.js`,
  };

  // const remotes = {
  //   header: `header@${HEADER_REMOTE_APP_URL}/_next/static/${location}/remoteEntry.js`,
  //   footer: `footer@${FOOTER_REMOTE_APP_URL}/_next/static/${location}/remoteEntry.js`,
  // };

  // const delegateRemotes = Object.keys(remotes).reduce((acc, key) => {
  //   acc[key] = `internal ${require.resolve('./delegate-module.js')}?${key}=${
  //     remotes[key]
  //   }`;
  //   return acc;
  // }, {});

  // console.log('delegateRemotes', delegateRemotes);

  // return delegateRemotes;
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
    config.plugins.push(
      new NextFederationPlugin({
        name: 'host',
        filename: 'static/chunks/remoteEntry.js',
        remotes: getRemotes(isServer),
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

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
];

module.exports = composePlugins(...plugins)(nextConfig);
