import React from 'react';
import {StyleSheet, View, type ViewProps} from 'react-native';

type VStackProps = ViewProps;

export const VStack = ({style, ...rest}: VStackProps) => {
  return <View {...rest} style={[style, styles.view]} />;
};

const styles = StyleSheet.create({
  view: {
    flexDirection: 'column',
  },
});
