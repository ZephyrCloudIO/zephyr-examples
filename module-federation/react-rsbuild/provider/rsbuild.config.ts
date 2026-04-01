import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';
import { withZephyr } from 'zephyr-rsbuild-plugin';

export default defineConfig({
  output: {
    assetPrefix: 'auto',
  },
  plugins: [
    pluginReact(),
    pluginModuleFederation({
      name: 'federation_provider',
      filename: 'remoteEntry.js',
      exposes: {
        './button': './src/Button.tsx',
      },
      shared: ['react', 'react-dom'],
    }),
    withZephyr(),
  ],
  server: {
    port: 3000,
  },
});
