
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
// import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { NormalizedOutputOptions, OutputBundle } from 'rollup';
import { withZephyr } from "vite-plugin-zephyr"
import * as fs from "fs"



import { ze_log, ze_error } from 'zephyr-edge-contract';
import { logger, getApplicationConfiguration } from 'zephyr-agent';

// function withZephyr() {
//   return {
//     name: 'with-zephyr',
//     writeBundle: async (options: NormalizedOutputOptions, bundle: OutputBundle) => {
//       const pluginOptions = {
//         application_uid: 'my-app',
//       };
//       ze_log('zephyr agent started.');
//       const logEvent = logger(pluginOptions);
//       const { EDGE_URL, username, email } = await getApplicationConfiguration({
//         application_uid: pluginOptions.application_uid,
//       });

//       console.log(options, bundle);
//     },
//   };
// }



export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/examples/react-vite-nx',

  server: {
    port: 4200,
    host: 'localhost',
  },

  preview: {
    port: 4300,
    host: 'localhost',
  },

  plugins: [react(), withZephyr()],

  build: {
    outDir: '../../dist/examples/react-vite-nx',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  }
});
