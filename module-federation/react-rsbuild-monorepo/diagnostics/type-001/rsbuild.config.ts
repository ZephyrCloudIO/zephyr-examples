import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';
import { defineConfig } from '@rsbuild/core';

export default defineConfig({
  source: {
    entry: {
      index: './src/index.ts',
    },
  },
  plugins: [
    pluginModuleFederation({
      name: 'type_001_fixture',
      filename: 'remoteEntry.js',
      exposes: {
        './Broken': './src/index.ts',
      },
      dts: {
        generateTypes: {
          tsConfigPath: './tsconfig.json',
        },
      },
    }),
  ],
});
