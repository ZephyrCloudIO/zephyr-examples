const { withZe } = require('./ze-plugin/next-utils/with-ze');
const remoteMap = require('./remote-map')

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'res.cloudinary.com',
      'avatars.githubusercontent.com',
      'lh3.googleusercontent.com',
      'picsum.photos',
    ],
  },
}

module.exports = withZe(nextConfig, {
  hostName: 'host',
  remoteMap,
  // Here we can add some metadata to provide more information about the app
  metadata: {
    baseUrl: 'http://localhost:3010', // This value is used to genereate the remote URL on the host
    source: {
      url: 'https://github.com/ZephyrCloudIO/zephyr-examples/tree/main/examples/nextjs-13/nextjs-13-airbnb-clone/apps/host',
    },
    remote: 'http://localhost:3010/_next/static/chunks/remoteEntry.js',
  },
});

// const { NextFederationPlugin } = require('@module-federation/nextjs-mf');

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     domains: [
//       'res.cloudinary.com',
//       'avatars.githubusercontent.com',
//       'lh3.googleusercontent.com',
//       'picsum.photos',
//     ],
//   },
//   webpack(config, options) {
//     const { isServer } = options;
//     const remoteDir = isServer ? 'ssr' : 'chunks';

//     config.plugins.push(
//       new NextFederationPlugin({
//         name: 'host',
//         filename: `static/${remoteDir}/remoteEntry.js`,
//         remotes: {
//           remote: `remote@http://localhost:3011/_next/static/${remoteDir}/remoteEntry.js`,
//         },
//         shared: {},
//         extraOptions: {
//           exposePages: true,
//         },
//       })
//     );

//     return config;
//   },
// };

// module.exports = nextConfig;