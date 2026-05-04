import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';
import { createConfig } from '@nx/angular-rsbuild';
import { withZephyr } from 'zephyr-rsbuild-plugin';

const shared = {
  '@angular/common': { singleton: true, strictVersion: true },
  '@angular/core': { singleton: true, strictVersion: true },
  '@angular/platform-browser': { singleton: true, strictVersion: true },
  rxjs: { singleton: true },
};

export default async () => createConfig({
  options: {
    assets: [],
    browser: './src/main.ts',
    devServer: {
      port: 4201,
    },
    index: './src/index.html',
    outputHashing: 'none',
    outputPath: './dist',
    styles: ['./src/styles.css'],
  },
  rsbuildConfigOverrides: {
    output: {
      assetPrefix: 'auto',
    },
  },
}).then((config) => {
  const browser = config.environments?.browser;

  return {
    ...config,
    environments: undefined,
    html: browser?.html,
    output: {
      ...browser?.output,
      assetPrefix: 'auto',
    },
    plugins: [
      ...(config.plugins ?? []),
      ...(browser?.plugins ?? []),
      pluginModuleFederation({
        name: 'angular_rsbuild_remote',
        filename: 'remoteEntry.js',
        exposes: {
          './PromoCard': './src/promo-card.component.ts',
        },
        shared,
      }),
      withZephyr(),
    ],
    source: {
      ...config.source,
      ...browser?.source,
    },
  };
});
