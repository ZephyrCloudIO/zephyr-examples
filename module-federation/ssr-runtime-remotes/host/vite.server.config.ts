import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Server build for the Fastify server (Docker / AWS). No Zephyr plugin here on purpose: the
// server bundle is deployed to your own infrastructure, not uploaded to Zephyr.
export default defineConfig({
  plugins: [react()],
  // Static files are uploaded to Zephyr by the client build, not shipped here.
  publicDir: false,
  // Drop React's development build from the bundle.
  define: { 'process.env.NODE_ENV': JSON.stringify('production') },
  build: {
    ssr: 'server/fastify.ts',
    outDir: 'dist-server',
    target: 'node22',
    rollupOptions: {
      output: { entryFileNames: 'server.mjs' },
    },
  },
  // Bundle every dependency so the container only needs `server.mjs`.
  ssr: { noExternal: true },
});
