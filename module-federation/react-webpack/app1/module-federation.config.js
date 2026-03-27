module.exports = {
  name: 'default_webpack_mf_first',
  remotes: {
    default_webpack_mf_second: 'default_webpack_mf_second@http://localhost:3002/mf-manifest.json',
  },
  shared: {
    react: {
      singleton: true,
    },
    'react-dom': {
      singleton: true,
    },
  },
};
