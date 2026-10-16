import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { withZephyr } from 'vite-plugin-zephyr';

// Client build: everything the browser needs is uploaded to Zephyr and served by
// the Zephyr edge. Our SSR server never serves these files itself.
export default defineConfig({
  plugins: [
    react(),
    // `snapshotType: 'csr'` keeps this upload a plain static snapshot. If a Vite SSR
    // output ended up in the same build, Zephyr would mark the snapshot as `ssr` and
    // try to render it on Zephyr's own SSR runtime. We render on our own server.
    withZephyr({ snapshotType: 'csr' }),
  ],
  build: {
    // Emits .vite/manifest.json, which is uploaded to Zephyr with the other assets.
    manifest: true,
  },
  experimental: {
    // The HTML shell is rendered on a different origin than the one hosting the
    // assets. URLs emitted inside JS (lazy chunks, imported images) must resolve
    // against the script's own URL on the Zephyr edge, not the page origin.
    renderBuiltUrl(_filename, { hostType }) {
      return hostType === 'js' ? { relative: true } : undefined;
    },
  },
});
