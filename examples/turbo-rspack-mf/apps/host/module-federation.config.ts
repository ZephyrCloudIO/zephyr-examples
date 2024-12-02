import type { ModuleFederationPluginOptions } from "@rspack/core";

export const mfConfig: ModuleFederationPluginOptions = {
  name: "host",
  filename: "remoteEntry.js",
  remotes: {
    home: "home@http://localhost:3001/remoteEntry.js",
    settings: "settings@http://localhost:3002/remoteEntry.js"
  },
  exposes: {
    "./RemoteEntry": "./src/App.tsx"
  },
  shared: ["react", "react-dom", "react-router"]
};
