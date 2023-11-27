const { withZe } = require('./ze-plugin/next-utils/with-ze');
const remoteMap = require('./remote-map');

/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = withZe(nextConfig, {
  hostName: 'host',
  remoteMap,

  /*
  // Here we can add some metadata to provide more information about the app
  metadata: {
    baseUrl: 'http://localhost:3010',
    source: {
      url: 'https://github.com/ZephyrCloudIO/zephyr-examples/tree/main/examples/nextjs-13/template/apps/host',
    },
    remote: 'http://localhost:3010/_next/static/chunks/remoteEntry.js',
  },
  */
});
