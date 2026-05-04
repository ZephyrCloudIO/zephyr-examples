import angular from '@analogjs/vite-plugin-angular';
import { federation } from '@module-federation/vite';
import { defineConfig } from 'vite';
import { withZephyr, type ModuleFederationOptions } from 'vite-plugin-zephyr';

const mfConfig: ModuleFederationOptions = {
  name: 'angular_remote',
  filename: 'remoteEntry.js',
  exposes: {
    './PromoCard': './src/promo-card.component.ts',
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
    origin: 'http://localhost:5174',
    port: 5174,
  },
  build: {
    target: 'chrome89',
  },
});
