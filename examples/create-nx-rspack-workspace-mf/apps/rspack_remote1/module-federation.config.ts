import { ModuleFederationConfig } from '@nx/rspack/module-federation';

const config: ModuleFederationConfig = {
  name: 'rspack_remote1',

  exposes: {
    './Module': './src/remote-entry.ts',
  },
};

export default config;
