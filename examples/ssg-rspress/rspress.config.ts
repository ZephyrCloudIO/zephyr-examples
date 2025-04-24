import * as path from "node:path";
import { defineConfig } from "rspress/config";
import { withZephyr } from "zephyr-rspack-plugin";

const zephyrRsbuildPlugin = () => ({
  name: "zephyr-rsbuild-plugin",
  setup(api: { modifyRspackConfig: (config: any) => Promise<void> }) {
    api.modifyRspackConfig(async (config: any) => {
      // this is important to avoid multiple zephyr build triggers
      config.name === "web" && (await withZephyr()(config));
    });
  },
});

export default defineConfig({
  root: path.join(__dirname, "docs"),
  title: "My Site",
  icon: "/rspress-icon.png",
  logo: {
    light: "/rspress-light-logo.png",
    dark: "/rspress-dark-logo.png",
  },
  themeConfig: {
    socialLinks: [
      {
        icon: "github",
        mode: "link",
        content: "https://github.com/web-infra-dev/rspress",
      },
    ],
  },
  ssg: true,
  builderConfig: {
    plugins: [zephyrRsbuildPlugin()],
  },
});
