import React from 'react';
import {StyleSheet, ViewStyle} from 'react-native';

import {colors, IconButton} from 'mobile-core';

type Props = {
  style?: ViewStyle;
  size?: number;
};

export default function FavButton({style, size = 16}: Props) {
  const [isFavorite, setIsFavorite] = React.useState(false);

  return (
    <IconButton
      icon={isFavorite ? 'heart' : 'heart-outline'}
      iconColor={colors.primary.scarlet}
      size={size}
      onPress={() => setIsFavorite(!isFavorite)}
      style={[styles.favButton, style]}
    />
  );
}
const styles = StyleSheet.create({
  // eslint-disable-next-line react-native/no-color-literals
  favButton: {
    backgroundColor: 'rgba(100, 100, 100, 0.3)',
  },
});
