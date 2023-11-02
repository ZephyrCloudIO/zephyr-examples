const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const DashboardPlugin = require('@module-federation/dashboard-plugin');

/**
 * @type {import('webpack').Configuration & { devServer?: import('webpack-dev-server').Configuration }}}
 */
module.exports = {
  entry: './src/index',
  mode: 'development',
  devServer: {
    devMiddleware: {
      writeToDisk: true,
    },
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    port: 3005,
  },
  cache: false,
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  output: {
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[contenthash].js',
    publicPath: `auto`,
    clean: false,
  },
  module: {
    rules: [
      {
        test: /\.(js|ts)x?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.m?js$/,
        resolve: {
          fullySpecified: false,
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      // excludeChunks: ['remoteEntry'],
    }),
    new ModuleFederationPlugin({
      name: 'utils__REMOTE_VERSION__',
      library: { type: 'var', name: 'utils__REMOTE_VERSION__' },
      filename: 'remoteEntry.js',
      remotes: {},
      exposes: {
        './analytics': './src/analytics',
        './foo': './src/foo',
      },
      shared: require('./package.json').dependencies,
    }),
    new DashboardPlugin({
      versionStrategy: 'buildHash',
      dashboardURL: `${process.env.DASHBOARD_BASE_URL}/update?token=${process.env.DASHBOARD_WRITE_TOKEN}`,
      filename: 'dashboard.json',
      metadata: {
        baseUrl: 'http://localhost:3005',
        source: {
          url: 'https://github.com/module-federation/federation-dashboard/tree/master/dashboard-example/utils',
        },
        remote: 'http://localhost:3005/remoteEntry.js',
      },
    }),
  ],
};
