import * as path from "node:path";
import { defineConfig } from "@rspack/cli";
import { rspack } from "@rspack/core";
import * as RefreshPlugin from "@rspack/plugin-react-refresh";
import { ModuleFederationPlugin } from "@module-federation/enhanced/rspack";
import { withZephyr } from "zephyr-rspack-plugin";

const isDev = process.env.NODE_ENV === "development";
const publicPath = process.env.PUBLIC_PATH || "/";

// Target browsers, see: https://github.com/browserslist/browserslist
const targets = ["chrome >= 87", "edge >= 88", "firefox >= 78", "safari >= 14"];

export default withZephyr()(
  defineConfig({
    context: __dirname,
    entry: {
      main: "./src/index.ts",
    },
    resolve: {
      extensions: ["...", ".ts", ".tsx", ".jsx"],
    },

    devServer: {
      port: 8081,
      historyApiFallback: true,
      watchFiles: [path.resolve(__dirname, "src")],
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods":
          "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        "Access-Control-Allow-Headers":
          "X-Requested-With, content-type, Authorization",
      },
    },
    output: {
      uniqueName: "remote",
      publicPath,
    },

    experiments: {
      css: true,
    },

    module: {
      rules: [
        {
          test: /\.svg$/,
          type: "asset",
        },
        {
          test: /\.css$/,
          use: ["postcss-loader"],
          type: "css",
        },
        {
          test: /\.(jsx?|tsx?)$/,
          use: [
            {
              loader: "builtin:swc-loader",
              options: {
                jsc: {
                  parser: {
                    syntax: "typescript",
                    tsx: true,
                  },
                  transform: {
                    react: {
                      runtime: "automatic",
                      development: isDev,
                      refresh: isDev,
                    },
                  },
                },
                env: { targets },
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new rspack.HtmlRspackPlugin({
        template: "./index.html",
      }),
      new ModuleFederationPlugin({
        name: "remote",
        filename: "remoteEntry.js",
        exposes: {
          "./recipe": "./src/Recipe.tsx",
        },
        shared: ["react", "react-dom"],
      }),
      isDev ? new RefreshPlugin() : null,
    ].filter(Boolean),
    optimization: {
      minimizer: [
        new rspack.SwcJsMinimizerRspackPlugin(),
        new rspack.LightningCssMinimizerRspackPlugin({
          minimizerOptions: { targets },
        }),
      ],
    },
  })
);
