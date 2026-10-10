import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';
import { withZephyr } from 'zephyr-rsbuild-plugin';

export default defineConfig({
  html: {
    title: 'TanStack Router + Rsbuild',
  },
  plugins: [
    pluginReact(),
    pluginModuleFederation({
      name: 'tanstack_router_host',
      remotes: {
        // Zephyr rewrites this to the deployed catalog version at build time
        catalog: 'catalog@http://localhost:3001/mf-manifest.json',
      },
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
    port: 3000,
  },
});
