const { withZe } = require('./ze-plugin/next-utils/with-ze');

/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = withZe(nextConfig, {
  hostName: 'remote__REMOTE_VERSION__',
  mfOptions: {
    exposes: {
      './table': './components/table/table',
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
