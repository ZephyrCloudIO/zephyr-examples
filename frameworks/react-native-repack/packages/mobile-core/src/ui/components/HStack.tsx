import React from 'react';
import {StyleSheet, View, type ViewProps} from 'react-native';

type HStackProps = ViewProps;

export const HStack = ({style, ...rest}: HStackProps) => {
  return <View {...rest} style={[style, styles.view]} />;
};

const styles = StyleSheet.create({
  view: {
    flexDirection: 'row',
  },
});
