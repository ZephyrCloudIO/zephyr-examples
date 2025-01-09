import { defineConfig, type RsbuildPlugin } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { config as mfConfig } from "./module-federation.config";
import { withZephyr } from "zephyr-rspack-plugin";

const ZephyrRsbuildPlugin = (): RsbuildPlugin => ({
  name: "zephyr-rsbuild-plugin",
  setup(build) {
    build.modifyRspackConfig(async (rspackConfig, utils) => {
      const zephyrConfig = await withZephyr()(rspackConfig);
      utils.mergeConfig(rspackConfig, zephyrConfig);
    });
  },
});

export default defineConfig({
  plugins: [pluginReact(), ZephyrRsbuildPlugin()],
  server: {
    port: 3000,
  },
  moduleFederation: {
    options: mfConfig,
  },
});
