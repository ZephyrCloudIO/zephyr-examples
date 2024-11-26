import type { ModuleFederationPluginOptions } from "@rspack/core";

export const mfConfig: ModuleFederationPluginOptions = {
  name: "home",
  filename: "remoteEntry.js",
  exposes: {
    "./RemoteEntry": "./src/RemoteEntry.tsx"
  },
  shared: ["react", "react-dom", "react-router"]
};
