import {staticAdapter} from "@builder.io/qwik-city/adapters/static/vite";
import {extendConfig} from "@builder.io/qwik-city/vite";
import {withZephyr} from "vite-plugin-zephyr";

import baseConfig from "../../vite.config";


export default extendConfig(baseConfig, () => {
  return {
    build: {
      ssr: true,
      rollupOptions: {
        input: ["@qwik-city-plan"],
      },
    },
    plugins: [
      staticAdapter({
        origin: "",
      }),
      withZephyr()
    ],
  };
});
