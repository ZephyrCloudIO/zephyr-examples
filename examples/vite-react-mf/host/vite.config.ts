import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { withZephyr } from 'vite-plugin-zephyr';

const mfConfig = {
  name: 'vite-host',
  filename: 'remoteEntry.js',
  remotes: {
    'vite-remote': {
      entry: 'http://localhost:5174/remoteEntry.js',
      type: 'module',
    },
    vite_webpack: {
      entry: 'http://localhost:8080/remoteEntry.js',
      type: 'var',
    },
    vite_rspack: {
      entry: 'http://localhost:8081/remoteEntry.js',
      type: 'var',
    },
  },
  shared: {
    react: {
      singleton: true,
    },
    'react-dom': {
      singleton: true,
    },
  },
};

export default defineConfig({
  plugins: [react(), withZephyr({ mfConfig })],
  build: {
    target: 'chrome89',
  },
});
