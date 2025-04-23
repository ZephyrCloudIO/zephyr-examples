import * as path from "node:path";
import { defineConfig } from "@rspack/cli";
import { rspack } from "@rspack/core";
import * as RefreshPlugin from "@rspack/plugin-react-refresh";
import { ModuleFederationPlugin } from "@module-federation/enhanced/rspack";
import { withZephyr } from "zephyr-rspack-plugin";

// Função para garantir que o remote seja uma string com o prefixo do publicPath
const createDynamicRemote = (publicPath: string) => {
  // Verifica se publicPath é 'auto' ou contém algo específico
  const appPath = publicPath !== "auto" ? publicPath : "";
  return `promise new Promise(resolve => {
    const remoteUrl = window.location.origin + '${appPath}/remoteEntry.js';
    resolve(remoteUrl);
  })`;
};

const publicPath = process.env.PUBLIC_PATH || "auto";
const isDev = process.env.NODE_ENV === "development";

// Target browsers, see: https://github.com/browserslist/browserslist
const targets = ["chrome >= 87", "edge >= 88", "firefox >= 78", "safari >= 14"];

// export default withZephyr()(
export default defineConfig({
  context: __dirname,
  entry: {
    main: "./src/index.ts",
  },
  resolve: {
    extensions: ["...", ".ts", ".tsx", ".jsx"],
  },

  devServer: {
    port: 8080,
    historyApiFallback: true,
    watchFiles: [path.resolve(__dirname, "src")],
  },
  output: {
    uniqueName: "host",
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
      name: "host",
      exposes: {},
      filename: "remoteEntry.js",
      remotes: {
        remote: "remote@http://localhost:8081/app/remoteEntry.js",
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
});
