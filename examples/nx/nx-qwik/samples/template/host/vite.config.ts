import { qwikVite } from '@builder.io/qwik/optimizer';
import { qwikCity } from '@builder.io/qwik-city/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { qwikNxVite } from 'qwik-nx/plugins';

export default defineConfig({
  cacheDir: '../../../node_modules/.vite/samples/template/host',
  plugins: [
    qwikNxVite(),
    qwikCity(),
    qwikVite({
      client: {
        outDir: '../../../dist/samples/template/host/client',
      },
      ssr: {
        outDir: '../../../dist/samples/template/host/server',
      },
    }),
    tsconfigPaths({ root: '../../../' }),
  ],
  server: {
    fs: {
      // Allow serving files from the project root
      allow: ['../../../'],
    },
  },
  preview: {
    headers: {
      'Cache-Control': 'public, max-age=600',
    },
  },
  test: {
    globals: true,
    cache: {
      dir: '../../../node_modules/.vitest',
    },
    environment: 'node',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  },
});
