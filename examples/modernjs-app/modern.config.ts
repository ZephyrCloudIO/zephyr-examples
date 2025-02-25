import { appTools, defineConfig } from "@modern-js/app-tools";
import { withZephyr } from "zephyr-modernjs-plugin";

// https://modernjs.dev/en/configure/app/usage
export default defineConfig({
  html: {
    outputStructure: "flat",
  },
  source: {
    mainEntryName: "index",
  },
  output: {
    distPath: {
      html: "./",
    },
  },
  plugins: [
    appTools({
      bundler: "rspack", // Or 'webpack'
    }),
    withZephyr(),
  ],
});
