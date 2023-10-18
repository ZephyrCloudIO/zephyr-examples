const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const DashboardPlugin = require('@module-federation/dashboard-plugin');
const path = require('path');

const dashboardURL = `${process.env.DASHBOARD_BASE_URL}/env/development/get-remote?token=${process.env.DASHBOARD_READ_TOKEN}`;

/**
 * @type {import('webpack').Configuration}
 **/
const webpackConfig = {
  entry: './src/index',
  mode: 'development',
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    port: 3001,
  },
  output: {
    publicPath: 'auto',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        type: 'javascript/auto',
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.(js|ts)x?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'remote',
      filename: 'remoteEntry.js',
      shared: ['react', 'react-dom'],
      exposes: {
        './Button': './src/components/Button',
      },
      remotes: {
        remote: DashboardPlugin.clientVersion({
          currentHost: 'remote',
          remoteName: 'home',
          dashboardURL,
        }),
      },
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new DashboardPlugin({
      versionStrategy: `${Date.now()}`,
      filename: 'dashboard.json',
      environment: 'development',
      dashboardURL: `${process.env.DASHBOARD_BASE_URL}/update?token=${process.env.DASHBOARD_WRITE_TOKEN}`,
      metadata: {
        baseUrl: 'http://localhost:3001',
        source: {
          url: 'https://github.com/ZephyrCloudIO/zephyr-examples/tree/main/examples/react-18/template/remote',
        },
        remote: 'http://localhost:3001/remoteEntry.js',
      },
    }),
  ],
};

module.exports = webpackConfig;
