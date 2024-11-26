import type { ModuleFederationPluginOptions } from "@rspack/core";

export const mfConfig: ModuleFederationPluginOptions = {
  name: "host",
  remotes: {
    home: "home@http://localhost:3001/remoteEntry.js",
    settings: "settings@http://localhost:3002/remoteEntry.js"
  },
  shared: ["react", "react-dom", "react-router"]
};
