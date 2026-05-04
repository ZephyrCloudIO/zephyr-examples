import angular from '@analogjs/vite-plugin-angular';
import { federation } from '@module-federation/vite';
import { defineConfig } from 'vite';
import { withZephyr, type ModuleFederationOptions } from 'vite-plugin-zephyr';

const mfConfig: ModuleFederationOptions = {
  name: 'angular_vite_host',
  filename: 'remoteEntry.js',
  remotes: {
    angular_vite_remote: {
      type: 'module',
      name: 'angular_vite_remote',
      entry: 'http://localhost:5174/remoteEntry.js',
      entryGlobalName: 'angular_vite_remote',
      shareScope: 'default',
    },
  },
  shared: {
    '@angular/core': { singleton: true, strictVersion: true },
    '@angular/common': { singleton: true, strictVersion: true },
    '@angular/platform-browser': { singleton: true, strictVersion: true },
    rxjs: { singleton: true },
  },
};

export default defineConfig({
  plugins: [angular(), federation(mfConfig), withZephyr()],
  server: {
    origin: 'http://localhost:5173',
    port: 5173,
  },
  build: {
    target: 'chrome89',
  },
});
