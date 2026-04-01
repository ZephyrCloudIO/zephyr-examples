import {Platform} from 'react-native';

import {vrem} from './useResponsiveSizes.ts';

export const ff300 = {
  fontFamily: Platform.select({
    ios: 'Mulish Light',
    android: 'mulishlight',
  }),
};

export const ff400 = {
  fontFamily: Platform.select({
    ios: 'Mulish Regular',
    android: 'mulishregular',
  }),
};

export const ff500 = {
  fontFamily: Platform.select({
    ios: 'Mulish Medium',
    android: 'mulishmedium',
  }),
};

export const ff600 = {
  fontFamily: Platform.select({
    ios: 'Mulish Semi Bold',
    android: 'mulishsemibold',
  }),
};

export const ff700 = {
  fontFamily: Platform.select({
    ios: 'Mulish Bold',
    android: 'mulishbold',
  }),
};

export const ff800 = {
  fontFamily: Platform.select({
    ios: 'Mulish Extra Bold',
    android: 'mulishextrabold',
  }),
};

export const ff900 = {
  fontFamily: Platform.select({
    ios: 'Mulish Black',
    android: 'mulishblack',
  }),
};

// for base weights refer to https://callstack.github.io/react-native-paper/docs/guides/fonts/#material-design-3

const fontConfig = {
  default: {
    ...ff400,
    fontSize: vrem(14),
    lineHeight: vrem(20),
  },
  displaySmall: {
    ...ff400,
    fontSize: vrem(36),
    lineHeight: vrem(44),
  },
  displayMedium: {
    ...ff400,
    fontSize: vrem(45),
    lineHeight: vrem(52),
  },
  displayLarge: {
    ...ff400,
    fontSize: vrem(57),
    lineHeight: vrem(64),
  },
  headlineSmall: {
    ...ff700,
    fontSize: vrem(24),
    lineHeight: vrem(32),
  },
  headlineMedium: {
    ...ff700,
    fontSize: vrem(28),
    lineHeight: vrem(36),
  },
  headlineLarge: {
    ...ff700,
    fontSize: vrem(32),
    lineHeight: vrem(40),
  },
  titleSmall: {
    ...ff500,
    fontSize: vrem(14),
    lineHeight: vrem(20),
  },
  titleMedium: {
    ...ff500,
    fontSize: vrem(16),
    lineHeight: vrem(24),
  },
  titleLarge: {
    ...ff500,
    fontSize: vrem(22),
    lineHeight: vrem(28),
  },
  labelSmall: {
    ...ff700,
    fontSize: vrem(11),
    lineHeight: vrem(16),
  },
  labelMedium: {
    ...ff500,
    fontSize: vrem(12),
    lineHeight: vrem(16),
  },
  labelLarge: {
    ...ff500,
    fontSize: vrem(14),
    lineHeight: vrem(20),
  },
  bodySmall: {
    ...ff400,
    fontSize: vrem(12),
    lineHeight: vrem(16),
  },
  bodyMedium: {
    ...ff400,
    fontSize: vrem(14),
    lineHeight: vrem(20),
  },
  bodyLarge: {
    ...ff400,
    fontSize: vrem(16),
    lineHeight: vrem(24),
  },
};

export default fontConfig;
