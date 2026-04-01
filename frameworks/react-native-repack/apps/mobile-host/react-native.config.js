module.exports = {
  commands: require('@callstack/repack/commands/rspack'),
  assets: ['./assets/fonts'],
  dependencies: {
    'react-native-screen-corner-radius': {
      platforms: {
        android: null,
      },
    },
  },
};
