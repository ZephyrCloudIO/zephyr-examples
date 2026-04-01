import React from 'react';
import {StyleSheet} from 'react-native';

import {
  Button as RNPButton,
  ButtonProps as RNPButtonProps,
} from 'react-native-paper';

export const Button = ({style, ...rest}: RNPButtonProps) => {
  return <RNPButton style={[styles.buttonBorderRadius, style]} {...rest} />;
};

const styles = StyleSheet.create({
  buttonBorderRadius: {
    borderRadius: 4,
  },
});
