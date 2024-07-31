const {
  container: { ModuleFederationPluginV1 },
  HtmlRspackPlugin,
} = require('@rspack/core');

const { withZephyr } = require('zephyr-webpack-plugin');

module.exports = withZephyr()({
  entry: './src/index.js',

  mode: 'development',
  devtool: 'source-map',

  optimization: {
    minimize: false,
  },
  resolve: {
    extensions: ['.jsx', '.js', '.json', '.mjs'],
  },
  output: {
    publicPath: 'auto',
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: {
          loader: 'builtin:swc-loader',
          options: {
            jsc: {
              parser: {
                syntax: 'ecmascript',
                jsx: true,
              },
            },
          },
        },
        exclude: /node_modules/,
      },
    ],
  },

  plugins: [
    new ModuleFederationPluginV1({
      name: 'app_03',
      filename: 'remoteEntry.js',
      remotes: {
      },
      exposes: {
        './Button': './src/Button',
      },
      shared: {
        'react-dom': {
          singleton: true,
        },
        react: {
          singleton: true,
        },
      },
    }),
    new HtmlRspackPlugin({
      template: './src/index.html',
    }),
  ],
});
