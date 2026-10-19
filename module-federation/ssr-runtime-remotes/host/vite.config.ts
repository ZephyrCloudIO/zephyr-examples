import { existsSync, readFileSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { withZephyr } from 'vite-plugin-zephyr';

const remoteDeployment = new URL('../remote/zephyr-deployment.json', import.meta.url);

// Client build: uploaded to Zephyr. Its deployment is recorded for the server build.
export default defineConfig(({ command }) => ({
  plugins: [
    react(),
    withZephyr({
      // Keep this a static snapshot; rendering happens on our own server.
      snapshotType: 'csr',
      hooks: {
        // Runs once the upload finishes. `url` is this build's immutable version URL.
        // The server build bundles this file, so every server deploy renders into
        // the exact client build it was built with.
        async onDeployComplete({ url, snapshotId, snapshot }) {
          const deployment = { url, snapshotId, applicationUid: snapshot.application_uid };
          await writeFile(
            new URL('./server/zephyr-deployment.json', import.meta.url),
            `${JSON.stringify(deployment, null, 2)}\n`
          );
        },
      },
    }),
  ],
  define: {
    // Opened straight from its Zephyr URL, with no server to pick a build, the page
    // loads the product card build this host was built with. `pnpm dev` uses the
    // remote's dev server instead.
    __PRODUCT_REMOTE_URL__: JSON.stringify(
      command === 'build' ? readRemoteUrl() : 'http://localhost:3001'
    ),
    // Leaves the federation runtime's Node.js code out of the browser bundle.
    ENV_TARGET: JSON.stringify('web'),
  },
  experimental: {
    // Assets live on the Zephyr origin, not the page origin: resolve URLs emitted
    // inside JS against the script's own URL.
    renderBuiltUrl(_filename, { hostType }) {
      return hostType === 'js' ? { relative: true } : undefined;
    },
  },
}));

function readRemoteUrl(): string {
  if (!existsSync(remoteDeployment)) {
    throw new Error('Deploy the remote first: run `pnpm build` from the example root.');
  }
  return new URL(JSON.parse(readFileSync(remoteDeployment, 'utf8')).url).origin;
}
