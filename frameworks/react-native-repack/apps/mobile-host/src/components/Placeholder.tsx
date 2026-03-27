import React, {FC} from 'react';
import {SafeAreaView, StyleSheet, Text} from 'react-native';

import {useTheme, ZephyrLogo} from 'mobile-core';

type Props = {
  label?: string;
};

const Placeholder: FC<Props> = ({label}) => {
  const theme = useTheme();

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.colors.onBackground}]}>
      <ZephyrLogo style={styles.image} />
      {label ? (
        <Text style={[styles.text, {color: theme.colors.background}]}>
          {label}
        </Text>
      ) : null}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    marginBottom: 16,
    width: 200,
    height: 200,
  },
  text: {
    fontSize: 24,
  },
});

export default Placeholder;
