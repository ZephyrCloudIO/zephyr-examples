import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';
import { withZephyr } from 'zephyr-rsbuild-plugin';

export default defineConfig({
  output: {
    // Resolve chunk URLs from wherever remoteEntry is served, not the host origin
    assetPrefix: 'auto',
  },
  html: {
    title: 'Catalog remote',
  },
  plugins: [
    pluginReact(),
    pluginModuleFederation({
      name: 'catalog',
      filename: 'remoteEntry.js',
      exposes: {
        './ProductList': './src/ProductList.tsx',
        './ProductDetail': './src/ProductDetail.tsx',
      },
      // The router must be a singleton so exposed components read the host's router context
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true },
        '@tanstack/react-router': { singleton: true },
      },
      dts: false,
    }),
    withZephyr(),
  ],
  server: {
    port: 3001,
  },
});
