import { defineConfig } from 'vite';
import { extensions, classicEmberSupport, ember } from '@embroider/vite';
import { babel } from '@rollup/plugin-babel';
import { withZephyr } from 'vite-plugin-zephyr';

export default defineConfig({
  plugins: [
    classicEmberSupport(),
    ember(),
    // extra plugins here
    babel({
      babelHelpers: 'runtime',
      extensions,
    }),
    withZephyr(),
  ],
  resolve: {
    preserveSymlinks: false,
  },
  optimizeDeps: {
    disabled: false,
    esbuildOptions: {
      preserveSymlinks: false,
    },
  },
});
