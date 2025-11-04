import { pluginReact } from '@rsbuild/plugin-react';
import { defineConfig } from '@rsbuild/core';

export default defineConfig({
  html: {
    template: './src/index.html',
  },
  plugins: [pluginReact()],

  source: {
    entry: {
      index: './src/main.tsx',
    },
    tsconfigPath: './tsconfig.app.json',
  },
  server: {
    port: 4202,
  },
  output: {
    copy: [{ from: './src/favicon.ico' }, { from: './src/assets' }],

    target: 'web',
    distPath: {
      root: 'dist',
    },
  },
});
