module.exports = {
  preset: 'react-native',
  fakeTimers: {
    enableGlobally: true,
  },
  transformIgnorePatterns: [
    'node_modules/(?!(?:.pnpm/)?((jest-)?react-native|@react-native(-community)?|react-navigation|@react-navigation|react-native-svg))',
  ],
};
