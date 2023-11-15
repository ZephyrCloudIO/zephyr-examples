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
    devMiddleware: {
      writeToDisk: true,
    },
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    port: 3001,
    proxy: {
      '/remoteEntry.js': {
        target: 'http://localhost:3001',
        pathRewrite: { '^/.*.remoteEntry.js': '/remoteEntry.js' },
      },
    },
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
      name: 'remote__REMOTE_VERSION__',
      library: { type: 'var', name: 'remote__REMOTE_VERSION__' },
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
      versionStrategy: 'buildHash',
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
