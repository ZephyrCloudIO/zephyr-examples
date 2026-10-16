import { readFileSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import {
  pluginModuleFederation,
  type ModuleFederationOptions,
} from '@module-federation/rsbuild-plugin';
import { withZephyr } from 'zephyr-rsbuild-plugin';

const { version } = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'));

const federation: ModuleFederationOptions = {
  name: 'product',
  filename: 'remoteEntry.js',
  exposes: {
    './ProductCard': './src/ProductCard.tsx',
  },
  // The host provides React, on its server and in the browser.
  shared: {
    react: { singleton: true },
    'react-dom': { singleton: true },
  },
  dts: false,
};

export default defineConfig({
  source: {
    define: { __PRODUCT_CARD_VERSION__: JSON.stringify(version) },
  },
  output: {
    // Resolve chunk URLs from wherever remoteEntry is served, not the host origin
    assetPrefix: 'auto',
  },
  html: {
    title: 'Product card remote',
  },
  // The same container is built twice: for browsers, and for Node so a host
  // server can render it. Zephyr uploads both into one deployment, with the
  // Node build under /server/.
  environments: {
    web: {},
    node: {
      source: { entry: { index: './src/node.ts' } },
      output: {
        target: 'node',
        distPath: { root: 'dist/server' },
        // Rsbuild leaves Node builds unminified by default. This one is served
        // publicly from the Zephyr edge like the browser build, so minify it too.
        minify: true,
      },
    },
  },
  plugins: [
    pluginReact(),
    pluginModuleFederation(federation),
    pluginModuleFederation(federation, { target: 'node', environment: 'node' }),
    withZephyr({
      // A Node build would otherwise make this an SSR deployment that Zephyr
      // runs itself. Here the host's own server does the rendering.
      snapshotType: 'csr',
      hooks: {
        // Tell the host which deployment of this remote it was built with.
        async onDeployComplete({ url, snapshot }) {
          const deployment = { applicationUid: snapshot.application_uid, url };
          await writeFile(
            new URL('./zephyr-deployment.json', import.meta.url),
            `${JSON.stringify(deployment, null, 2)}\n`
          );
        },
      },
    }),
  ],
  server: {
    port: 3001,
  },
});
