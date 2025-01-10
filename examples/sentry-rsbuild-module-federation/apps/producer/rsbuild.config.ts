import { defineConfig, type RsbuildPlugin } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { config as mfConfig } from "./module-federation.config";
import { withZephyr } from "zephyr-rspack-plugin";
import { sentryWebpackPlugin } from "@sentry/webpack-plugin";

const ZephyrRsbuildPlugin = (): RsbuildPlugin => ({
  name: "zephyr-rsbuild-plugin",
  setup(build) {
    build.modifyRspackConfig(async (rspackConfig, utils) => {
      await utils.prependPlugins([
        sentryWebpackPlugin({
          //@ts-expect-error - needed
          name: "ZentryWebpackPlugin",
          debug: true,
          moduleMetadata: ({ release }) => {
            return {
              dsn: "https://d2912da0b529f704208812ab4facdec7@o4508279640817664.ingest.us.sentry.io/4508615785971712",
              release,
            };
          },
          org: "shane-test-company",
          project: "4508615785971712",
          authToken:
            "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",
        }),
      ]);
      const zephyrConfig = await withZephyr()(rspackConfig);
      const config = utils.mergeConfig(zephyrConfig);
      console.log("CONFIG", zephyrConfig.plugins?.length);
    });
  },
});

export default defineConfig({
  plugins: [
    pluginReact({ splitChunks: { react: false, router: false } }),
    ZephyrRsbuildPlugin(),
  ],
  server: {
    port: 3001,
    open: false,
  },
  // output: {
  //   sourceMap: true
  // },
  moduleFederation: {
    options: mfConfig,
  },
});
