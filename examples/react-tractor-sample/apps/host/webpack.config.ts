import { withReact } from '@nx/react';
import { withModuleFederation } from '@nx/react/module-federation';
import { composePlugins, withNx } from '@nx/webpack';
import { withZephyr } from 'zephyr-webpack-plugin';

const mfConfig = {
  name: 'host',
  remotes: ['team-red'],
  additionalShared: ['react', 'react-dom'],
};

// Nx plugins for webpack.
module.exports = composePlugins(
  withNx(),
  withReact(),
  withZephyr(),
  withModuleFederation(mfConfig),
  (config) => {
    return config;
  }
);
