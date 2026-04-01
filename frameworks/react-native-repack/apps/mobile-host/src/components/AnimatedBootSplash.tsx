import React, {useState} from 'react';
import {Animated, Image, StyleSheet, View} from 'react-native';

import BootSplash from 'react-native-bootsplash';

type Props = {
  onAnimationEnd: () => void;
};

export default function AnimatedBootSplash({onAnimationEnd}: Props) {
  const [opacity] = useState(() => new Animated.Value(1));

  const {container, logo} = BootSplash.useHideAnimation({
    manifest: require('../../assets/bootsplash/manifest.json'),
    logo: require('../../assets/bootsplash/logo.png'),
    statusBarTranslucent: true,
    navigationBarTranslucent: false,

    animate: () => {
      Animated.timing(opacity, {
        useNativeDriver: true,
        toValue: 0,
        duration: 1000,
      }).start(() => {
        onAnimationEnd();
      });
    },
  });

  return (
    <View style={styles.container}>
      <Animated.View
        {...container}
        style={[
          container.style,
          {
            opacity: opacity.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0, 0, 1],
            }),
          },
          {
            transform: [
              {
                scale: opacity.interpolate({
                  inputRange: [0, 1],
                  outputRange: [5, 1],
                }),
              },
            ],
          },
        ]}>
        <Image {...logo} accessibilityIgnoresInvertColors />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 99999,
    width: '100%',
    height: '100%',
  },
});
