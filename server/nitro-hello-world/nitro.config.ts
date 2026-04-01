import { defineNitroConfig } from "nitro/config";

export default defineNitroConfig({
  preset: "zephyr",
  serverEntry: "./src/server.ts",
  zephyr: {
    deployOnBuild: true,
  },
});
