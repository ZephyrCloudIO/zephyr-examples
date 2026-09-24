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
    port: 3000,
  },
  output: {
    assetPrefix: 'auto',
  },
  plugins: [
    pluginReact(),
    pluginModuleFederation({
      name: 'host',
      filename: 'remoteEntry.js',
      remotes: {
        header: 'header@http://localhost:3001/remoteEntry.js',
        hero: 'hero@http://localhost:3002/remoteEntry.js',
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
    }),
    ...(!exampleOffline ? [withZephyr()] : []),
  ],
});
