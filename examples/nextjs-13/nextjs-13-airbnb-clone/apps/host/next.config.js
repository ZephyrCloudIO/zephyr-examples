const { withZe } = require('./ze-plugin/next-utils/with-ze');
const remoteMap = require('./remote-map');

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
};

module.exports = withZe(nextConfig, {
  hostName: 'host',
  remoteMap,
  // Here we can add some metadata to provide more information about the app
  metadata: {
    baseUrl: 'http://localhost:3010', // This value is used to genereate the remote URL on the host
    source: {
      url: 'https://github.com/ZephyrCloudIO/zephyr-examples/tree/main/examples/nextjs-13/template/apps/remote',
    },
    remote: 'http://localhost:3011/_next/static/chunks/remoteEntry.js',
  },
});
