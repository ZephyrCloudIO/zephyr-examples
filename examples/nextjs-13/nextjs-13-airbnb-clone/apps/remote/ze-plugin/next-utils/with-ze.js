const path = require('path');
const withPlugins = require('next-compose-plugins');
const { merge } = require('webpack-merge');
const { DefinePlugin } = require('webpack');
const { NextFederationPlugin } = require('@module-federation/nextjs-mf');
const { NextMedusaPlugin } = require('@module-federation/dashboard-plugin');
const { versionResolver } = require('./version-resolver');
const { remotesResolver } = require('./remote-resolver');

/** @typedef {import('@module-federation/utilities').ModuleFederationPluginOptions} ModuleFederationPluginOptions*/

/**
 * @typedef {{
 *  environment?: string;
 *  delegatePath?: string;
 *  hostName: string;
 *  outputRemoteEntryPath?: string;
 *  outputDashboardDataFilename?: string;
 *  dashboardURL?: string;
 *  mfOptions?: ModuleFederationPluginOptions;
 *  mfOverrideOptions?: ModuleFederationPluginOptions;
 *  remoteMap?: {
 *    [globalName: string]: string;
 *  };
 *  metadata?: {
 *    [k: string]: any;
 *  };
 * }} Options
 */

/**
 *
 * @param {import('next').NextConfig} nextConfig
 * @param {Options} options
 * @returns
 */
const withZe = (
  nextConfig,
  {
    environment = 'development',
    outputRemoteEntryPath = 'static/chunks',
    outputDashboardDataFilename = 'dashboard.json',
    delegatePath = require.resolve('./remote-delegate.ts'),
    dashboardURL = `${process.env.ZE_DASHBOARD_API_URL}/update?token=${process.env.ZE_WRITE_TOKEN}`,
    remoteMap = {},
    mfOptions = {},
    mfOverrideOptions = {},
    hostName,
    metadata,
  },
) => {
  return withPlugins(
    [
      () => ({
        cleanDistDir: false,
        webpack: (config, { isServer }) => {
          const version = versionResolver();

          // workaround to @module-federation/nextjs-mf@v7 bug
          config.optimization.minimize = false;

          config.plugins.push(
            // This is important to pass static data to the ze-remote-delegate during build time
            new DefinePlugin({
              'process.env.ZE_DASHBOARD_API_URL': JSON.stringify(process.env.ZE_DASHBOARD_API_URL),
              'process.env.ZE_DASHBOARD_ENV': JSON.stringify(environment),
              'process.env.ZE_READ_TOKEN': JSON.stringify(process.env.ZE_READ_TOKEN),
            }),
            new NextFederationPlugin({
              ...mfOptions,
              name: hostName,
              extraOptions: {},
              filename: path.join(`static/${isServer ? 'ssr' : 'chunks'}`, 'remoteEntry.js'),
              remotes: remotesResolver({ isServer, remoteMap, delegatePath }),
              // override default options
              ...mfOverrideOptions,
            }),
            new NextMedusaPlugin({
              skipPost: isServer,
              versionStrategy: version,
              // filename: path.join(outputRemoteEntryPath, 'remoteEntry.js'),
              filename: outputDashboardDataFilename,
              environment,
              dashboardURL,
              metadata,
            }),
          );

          return config;
        },
      }),
    ],
    nextConfig,
  );
};

exports.withZe = withZe;
exports.withZephyr = withZe;
