const { withZe } = require('./ze-plugin/next-utils/with-ze');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com', 'avatars.githubusercontent.com', 'lh3.googleusercontent.com', 'picsum.photos'],
  },
}

module.exports = withZe(nextConfig, {
  hostName: 'remote',
  mfOptions: {
    exposes: {
      './ListingCategory': './components/ListingCategory',
      // whatever else
    },
  },
  // Here we can add some metadata to provide more information about the app
  metadata: {
    baseUrl: 'http://localhost:3011', // This value is used to genereate the remote URL on the host
    source: {
      url: 'https://github.com/ZephyrCloudIO/zephyr-examples/tree/main/examples/nextjs-13/template/apps/remote',
    },
    remote: 'http://localhost:3011/_next/static/chunks/remoteEntry.js',
  },
});

// const { NextFederationPlugin } = require('@module-federation/nextjs-mf');

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     domains: ['res.cloudinary.com', 'avatars.githubusercontent.com', 'lh3.googleusercontent.com', 'picsum.photos'],
//   },
//   webpack(config, options) {
//     const { isServer } = options;
//     const remoteDir = isServer ? 'ssr' : 'chunks';

//     config.plugins.push(
//       new NextFederationPlugin({
//         name: 'remote',
//         filename: `static/${remoteDir}/remoteEntry.js`,
//         exposes: {
//           './ListingCategory': './components/ListingCategory.tsx',
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