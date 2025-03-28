import { withReact } from '@nx/react';
import { withModuleFederation } from '@nx/module-federation/webpack';
import { ModuleFederationConfig } from '@nx/module-federation';
import { composePlugins, withNx } from '@nx/webpack';
import { withZephyr } from 'zephyr-webpack-plugin';

const mfConfig: ModuleFederationConfig = {
  name: 'team_green',
  exposes: {
    './GreenRecos': './src/app/team-green-recos.tsx',
  },
  additionalShared: [
    ['react', { singleton: true }] ,
    ['react-dom', { singleton: true }] ,
  ],
};

// Nx plugins for webpack.
module.exports = composePlugins(
  withNx(),
  withReact(),
  withModuleFederation(mfConfig),
  withZephyr(),
  (config, ctx) => {
    return config;
  }
);
