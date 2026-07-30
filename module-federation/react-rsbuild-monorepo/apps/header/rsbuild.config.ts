import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';
import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { withZephyr } from 'zephyr-rsbuild-plugin';

const exampleOffline = process.env['ZEPHYR_EXAMPLE_OFFLINE'] === '1';

export default defineConfig({
  source: {
    entry: {
      index: './src/index.ts',
    },
  },
  server: {
    port: 3001,
  },
  output: {
    assetPrefix: 'auto',
  },
  plugins: [
    pluginReact(),
    pluginModuleFederation({
      name: 'header',
      filename: 'remoteEntry.js',
      manifest: true,
      exposes: {
        './Header': './src/Header.tsx',
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: '19.2.7',
        },
        'react-dom': {
          singleton: true,
          requiredVersion: '19.2.7',
        },
      },
      dts: {
        generateTypes: {
          tsConfigPath: './tsconfig.json',
        },
      },
    }),
    ...(!exampleOffline ? [withZephyr()] : []),
  ],
});
