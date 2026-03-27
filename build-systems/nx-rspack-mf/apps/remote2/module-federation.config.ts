const config = {
  name: 'remote2',

  exposes: {
    './Module': './src/remote-entry.ts',
  },
};

export default config;
