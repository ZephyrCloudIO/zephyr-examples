import type { ModuleFederationPluginOptions } from "@rspack/core";

export const mfConfig: ModuleFederationPluginOptions = {
  name: "turbo_home",
  filename: "remoteEntry.js",
  exposes: {
    "./RemoteEntry": "./src/RemoteEntry.tsx"
  },
  remotes: {
    turbo_host: "turbo_host@http://localhost:3000/remoteEntry.js"
  },
  shared: {
    react: {
      singleton: true,
      eager: true,
      requiredVersion: "^19.2.0"
    },
    "react-dom": {
      singleton: true,
      eager: true,
      requiredVersion: "^19.2.0"
    },
    "react-router": {
      singleton: true,
      eager: true,
      requiredVersion: "^7.9.5"
    }
  }
};
