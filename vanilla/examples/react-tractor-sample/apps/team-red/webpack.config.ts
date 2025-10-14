import { withReact } from '@nx/react';
import { withModuleFederation } from '@nx/module-federation/webpack';
import { ModuleFederationConfig } from '@nx/module-federation'
import { composePlugins, withNx } from '@nx/webpack';
import { withZephyr } from 'zephyr-webpack-plugin';

const mfConfig: ModuleFederationConfig = {
  name: 'team_red',
  exposes: {
    './TeamRedLayout': './src/app/team-red-layout',
  },
  additionalShared: [
    ['react', { singleton: true }] ,
    ['react-dom', { singleton: true }] ,
  ],
  remotes: ['team_green', 'team_blue'],
};

// Nx plugins for webpack.
export default composePlugins(
  withNx(),
  withReact(),
  withModuleFederation(mfConfig),
  withZephyr(),
  (config) => {
    return config;
  }
);
