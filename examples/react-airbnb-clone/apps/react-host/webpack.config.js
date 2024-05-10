const {
  ModuleFederationPlugin,
} = require('@module-federation/enhanced/webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

/**
 * @type {import('webpack').Configuration & { devServer?: import('webpack-dev-server').Configuration }}
 */
const config = {
  entry: './src/index',
  mode: 'development',
  cache: false,
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    fallback: {
      path: require.resolve('path-browserify'),
      util: require.resolve('util/'),
    },
    alias: { '@shared': path.resolve(__dirname, '../', 'shared/src') },
  },
  devServer: {
    static: { directory: path.resolve(__dirname, 'dist'), serveIndex: true },
    port: 3010,
    hot: true,
    compress: true,
    historyApiFallback: true,
  },
  output: {
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[contenthash].js',
    assetModuleFilename: 'images/[hash][ext][query]',
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
        resolve: { fullySpecified: false },
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [{ loader: 'file-loader' }],
      },
      {
        test: /\.css$/i,
        include: path.resolve(__dirname, 'src'),
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'host',
      filename: 'remoteEntry.js',
      remotes: {
        categories: `categories@http://localhost:3011/remoteEntry.js`,
        home: `home@http://localhost:3012/remoteEntry.js`,
        favorites: `favorites@http://localhost:3013/remoteEntry.js`,
        trips: `trips@http://localhost:3014/remoteEntry.js`,
        properties: `properties@http://localhost:3015/remoteEntry.js`,
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: false,
        },
        'react-dom': {
          singleton: true,
          requiredVersion: false,
        },
        'react-icons': {
          singleton: true,
          requiredVersion: false,
        },
        'react-router-dom': {
          singleton: true,
          requiredVersion: false,
        },
        'react/jsx-runtime': {
          singleton: true,
          requiredVersion: false,
        },
        swr: {
          singleton: true,
          requiredVersion: false,
        },
      },
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      favicon: './public/assets/favicon.ico',
    }),
  ],
  devtool: 'source-map',
};

module.exports = config;
