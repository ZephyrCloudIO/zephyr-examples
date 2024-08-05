const rspack = require('@rspack/core');
const isDev = process.env.NODE_ENV === 'development';

const path = require('path');
const { ModuleFederationPlugin } = require('@module-federation/enhanced/rspack');

const name = 'tractor_v2_checkout';

/**
 * @type {import('@rspack/cli').Configuration}
 */
module.exports = {
  entry: { main: './src/index.tsx' },
  resolve: { extensions: ['...', '.ts', '.tsx', '.jsx'] },
  optimization: { minimize: false },
  devServer: {
    port: 3001,
    static: { directory: path.join(__dirname, 'build') },
    liveReload: false,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
    },
  },
  devtool: 'source-map',
  output: {
    path: __dirname + '/dist',
    uniqueName: name,
    publicPath: 'auto',
    filename: '[name].js',
  },
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
      excludedChunks: [name],
      filename: 'index.html',
      inject: true,
      publicPath: '/',
    }),
    new ModuleFederationPlugin({
      name,
      filename: 'remoteEntry.js',
      shared: ['react', 'react-dom', 'react-router', 'react-router-dom'],
      remotes: {
        tractor_v2_explore: 'tractor_v2_explore@http://localhost:3003/remoteEntry.js',
      },
      exposes: {
        './CartPage': path.resolve(__dirname) + '/src/CartPage.tsx',
        './Checkout': path.resolve(__dirname) + '/src/Checkout.tsx',
        './Thanks': path.resolve(__dirname) + '/src/Thanks.tsx',
        './AddToCart': path.resolve(__dirname) + '/src/AddToCart.tsx',
        './MiniCart': path.resolve(__dirname) + '/src/MiniCart.tsx',
      },
    }),
  ],
};
