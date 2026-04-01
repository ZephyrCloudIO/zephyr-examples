import React from 'react';
import {StyleSheet} from 'react-native';

import {ActivityIndicator} from 'react-native-paper';

import {VStack} from './VStack';

export const LoadingScreen = () => {
  return (
    <VStack style={styles.container}>
      <ActivityIndicator />
    </VStack>
  );
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
});
