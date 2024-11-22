const rspack = require('@rspack/core');
const isDev = process.env.NODE_ENV === 'development';
const refreshPlugin = require('@rspack/plugin-react-refresh');

const path = require('path');
const { ModuleFederationPlugin } = require('@module-federation/enhanced/rspack');
const { withZephyr } = require('zephyr-rspack-plugin');
const { dependencies: deps } = require('../../package.json');

const name = 'tractor_v2_explore';

/**
 * @type {import('@rspack/cli').Configuration}
 */
const config = {
  entry: { main: './src/index.tsx' },
  resolve: { extensions: ['...', '.ts', '.tsx', '.jsx'] },
  optimization: { minimize: false, sideEffects: true },
  devServer: {
    port: 3003,
    static: { directory: path.join(__dirname, 'build') },
    liveReload: false,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
    },
    historyApiFallback: true,
  },
  devtool: 'source-map',
  output: {
    path: __dirname + '/dist',
    uniqueName: name,
    publicPath: 'auto',
    filename: '[name].js',
  },
  experiments: { css: true },
  module: {
    rules: [
      {
        test: /\.svg$/,
        type: 'asset',
      },
      {
        test: /\.(jsx?|tsx?)$/,
        exclude: /(node_modules|\.webpack)/,
        use: [
          {
            loader: 'builtin:swc-loader',
            options: {
              sourceMap: true,
              jsc: {
                parser: {
                  syntax: 'typescript',
                  tsx: true,
                },
                transform: {
                  react: {
                    runtime: 'automatic',
                    development: isDev,
                    refresh: isDev,
                  },
                },
              },
              env: {
                targets: ['chrome >= 87', 'edge >= 88', 'firefox >= 78', 'safari >= 14'],
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new rspack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
    new rspack.ProgressPlugin({}),
    new rspack.HtmlRspackPlugin({
      template: './index.html',
      excludeChunks: [name],
      filename: 'index.html',
      inject: true,
      publicPath: '/',
    }),
    new ModuleFederationPlugin({
      name,
      filename: 'remoteEntry.js',
      dts: false,
      shared: {
        react: {
          singleton: true,
          version: deps.react,
          requiredVersion: deps.react,
        },
        'react-dom': {
          singleton: true,
          version: deps.react,
          requiredVersion: deps.react,
        },
        'react-router': {
          singleton: true,
          version: deps['react-router'],
          requiredVersion: deps['react-router'],
        },
        'react-router-dom': {
          singleton: true,
          version: deps['react-router-dom'],
          requiredVersion: deps['react-router-dom'],
        },
      },
      // remotes: {
      //   tractor_v2_checkout: 'tractor_v2_checkout@http://localhost:3001/remoteEntry.js',
      // },
      exposes: {
        './HomePage': path.resolve(__dirname) + '/src/HomePage.tsx',
        './CategoryPage': path.resolve(__dirname) + '/src/CategoryPage.tsx',
        './StoresPage': path.resolve(__dirname) + '/src/StoresPage.tsx',
        './Recommendations': path.resolve(__dirname) + '/src/Recommendations.tsx',
        './StorePicker': path.resolve(__dirname) + '/src/StorePicker.tsx',
        './Header': path.resolve(__dirname) + '/src/Header.tsx',
        './Footer': path.resolve(__dirname) + '/src/Footer.tsx',
      },
    }),
    ...(isDev ? [new refreshPlugin()] : []),
  ],
};

module.exports = process.env['WITH_ZE'] !== undefined ? withZephyr()(config) : config;
