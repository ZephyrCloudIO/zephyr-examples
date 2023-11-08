const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const DashboardPlugin = require('@module-federation/dashboard-plugin');

/**
 * @type {import('webpack').Configuration & { devServer?: import('webpack-dev-server').Configuration }}
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
    port: 3002,
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
    new ModuleFederationPlugin({
      name: 'dsl__REMOTE_VERSION__',
      library: { type: 'var', name: 'dsl__REMOTE_VERSION__' },
      filename: 'remoteEntry.js',
      remotes: {},
      exposes: {
        './Button': './src/Button',
        './Carousel': './src/Carousel',
        './TextField': './src/TextField',
      },
      // sharing code based on the installed version, to allow for multiple vendors with different versions
      shared: require('./package.json').dependencies,
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      // excludeChunks: ['remoteEntry'],
    }),
    new DashboardPlugin({
      versionStrategy: 'buildHash',
      filename: 'dashboard.json',
      environment: 'development',
      dashboardURL: `${process.env.DASHBOARD_BASE_URL}/update?token=${process.env.DASHBOARD_WRITE_TOKEN}`,
      metadata: {
        baseUrl: 'http://localhost:3002',
        source: {
          url: 'https://github.com/module-federation/federation-dashboard/tree/master/dashboard-example/dsl',
        },
        remote: 'http://localhost:3002/remoteEntry.js',
      },
    }),
  ],
};
