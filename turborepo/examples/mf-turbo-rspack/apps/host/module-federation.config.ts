import type { ModuleFederationPluginOptions } from "@rspack/core";

export const mfConfig: ModuleFederationPluginOptions = {
  name: "turbo_host",
  filename: "remoteEntry.js",
  remotes: {
    turbo_home: "turbo_home@http://localhost:3001/remoteEntry.js",
    turbo_settings: "turbo_settings@http://localhost:3002/remoteEntry.js"
  },
  exposes: {
    "./RemoteEntry": "./src/App.tsx"
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
