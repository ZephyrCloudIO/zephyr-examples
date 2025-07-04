import type { ModuleFederationPluginOptions } from "@rspack/core";

export const mfConfig: ModuleFederationPluginOptions = {
  name: "turbo_settings",
  filename: "remoteEntry.js",
  exposes: {
    "./RemoteEntry": "./src/RemoteEntry.tsx"
  },
  remotes: {
    turbo_host: "turbo_host@http://localhost:3000/remoteEntry.js"
  },
  shared: ["react", "react-dom", "react-router", "react-router-dom"]
};
