import { writeFile } from 'node:fs/promises';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { withZephyr } from 'vite-plugin-zephyr';

// Client build: uploaded to Zephyr. Its deployment is recorded for the server build.
export default defineConfig({
  plugins: [
    react(),
    withZephyr({
      // Keep this a static snapshot; rendering happens on our own server.
      snapshotType: 'csr',
      hooks: {
        // Runs once the upload finishes. `url` is this build's immutable version URL.
        // The server build bundles this file, so every server deploy knows exactly
        // which client build its components match.
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
  experimental: {
    // Assets live on the Zephyr origin, not the page origin: resolve URLs emitted
    // inside JS against the script's own URL.
    renderBuiltUrl(_filename, { hostType }) {
      return hostType === 'js' ? { relative: true } : undefined;
    },
  },
});
