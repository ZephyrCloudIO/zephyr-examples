import { withReact } from '@nx/react';
import { withModuleFederation } from '@nx/react/module-federation';
import { composePlugins, withNx } from '@nx/webpack';
import { withZephyr } from 'zephyr-webpack-plugin';

const mfConfig = {
  name: 'team-red',
  exposes: {
    './TeamRedLayout': './src/app/team-red-layout',
  },
  // remotes:  {
  //   'team-blue': '^2.0.1',
  //   'team-green': 'latest',
  //   'team-green': 'env:latest',
  // }
  // dependency resolution and app version
  remotes: ['team-green', 'team-blue'],
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
