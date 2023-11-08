const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const DashboardPlugin = require('@module-federation/dashboard-plugin');

const dashboardURL = `${process.env.DASHBOARD_BASE_URL}/env/development/get-remote?token=${process.env.DASHBOARD_READ_TOKEN}`;

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
    port: 3001,
  },
  cache: false,
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  output: {
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[contenthash].js',
    publicPath: 'auto',
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
      name: 'home',
      filename: 'remoteEntry.js',
      library: { type: 'var', name: 'home' },
      remotes: {
        dsl: DashboardPlugin.clientVersion({
          currentHost: 'home',
          remoteName: 'dsl',
          dashboardURL,
        }),
        search: DashboardPlugin.clientVersion({
          currentHost: 'home',
          remoteName: 'search',
          dashboardURL,
        }),
        nav: DashboardPlugin.clientVersion({
          currentHost: 'home',
          remoteName: 'nav',
          dashboardURL,
        }),
        utils: DashboardPlugin.clientVersion({
          currentHost: 'home',
          remoteName: 'utils',
          dashboardURL,
        }),
      },
      exposes: {
        './ProductCarousel': './src/ProductCarousel',
        './HeroImage': './src/HeroImage',
      },
      // sharing code based on the installed version, to allow for multiple vendors with different versions
      shared: require('./package.json').dependencies,
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      excludeChunks: ['remoteEntry'],
    }),
    new DashboardPlugin({
      versionStrategy: 'buildHash',
      filename: 'dashboard.json',
      dashboardURL: `${process.env.DASHBOARD_BASE_URL}/update?token=${process.env.DASHBOARD_WRITE_TOKEN}`,
      versionChangeWebhook: 'http://cnn.com/',
      metadata: {
        clientUrl: process.env.DASHBOARD_BASE_URL,
        baseUrl: 'http://localhost:3001',
        source: {
          url: 'https://github.com/module-federation/federation-dashboard/tree/master/dashboard-example/home',
        },
        remote: 'http://localhost:3001/remoteEntry.js',
      },
    }),
  ],
};
