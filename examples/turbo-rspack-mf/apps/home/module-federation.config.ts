import type { ModuleFederationPluginOptions } from "@rspack/core";

export const mfConfig: ModuleFederationPluginOptions = {
  name: "home",
  filename: "remoteEntry.js",
  exposes: {
    "./RemoteEntry": "./src/RemoteEntry.tsx"
  },
  remotes: {
    host: "host@http://localhost:3000/remoteEntry.js"
  },
  shared: ["react", "react-dom", "react-router"]
};
