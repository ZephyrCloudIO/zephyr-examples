const {
  container: { ModuleFederationPluginV1 },
  HtmlRspackPlugin,
    CopyRspackPlugin
} = require('@rspack/core');
const path = require('path');

const { withZephyr } = require('zephyr-webpack-plugin');

const mode = process.env.NODE_ENV || 'development';
const prod = mode === 'production';

module.exports = withZephyr()({
  entry: {
    bundle: ['./src/main.js'],
  },
  resolve: {
    extensions: ['.mjs', '.js', '.svelte'],
    mainFields: ['svelte', 'browser', 'module', 'main'],
    conditionNames: ['svelte', 'browser', 'import'],
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: '[name].js',
    chunkFilename: '[name].[id].js',
    publicPath: 'auto',
  },
  module: {
    rules: [
      {
        test: /\.svelte$/,
        use: {
          loader: 'svelte-loader',
          options: {
            emitCss: true,
            hotReload: true,
          },
        },
      },
    ],
  },
  mode,
  plugins: [
    new CopyRspackPlugin({
      patterns: [{
        from: './src/index.html',
        to: './index.html'
      }]
    }),
    new ModuleFederationPluginV1({
      name: 'app_04',
      filename: 'remoteEntry.js',
      exposes: {
        './App': './src/main.js',
        './loadApp': './src/loadApp.js',
      },
      shared: [],
    }),
  ],
  devtool: prod ? false : 'source-map',
  experiments: {
    css: true,
  },
});
