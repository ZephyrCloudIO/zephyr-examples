module.exports = {
  commands: require('@callstack/repack/commands/rspack'),
  dependencies: {
    'react-native-screen-corner-radius': {
      platforms: {
        android: null,
      },
    },
  },
};
