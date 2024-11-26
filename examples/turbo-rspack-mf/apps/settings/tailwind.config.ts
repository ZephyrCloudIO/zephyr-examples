// tailwind config is required for editor support

import type { Config } from "tailwindcss";
import sharedConfig from "@repo/tailwind-config";

const config: Pick<Config, "content" | "presets"> = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "../home/src/**/*.{js,ts,jsx,tsx}",
    "../host/src/**/*.{js,ts,jsx,tsx}"
  ],
  presets: [sharedConfig]
};

export default config;
