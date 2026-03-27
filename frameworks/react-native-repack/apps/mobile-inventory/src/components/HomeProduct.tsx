import React from 'react';
import {Image, Pressable, StyleSheet, View} from 'react-native';

import {
  colors,
  Icon,
  type Product,
  Text,
  useResponsiveSizes,
  useTheme,
} from 'mobile-core';

import FavButton from './FavButton';

type Props = {
  item: Product;
  onPress: () => void;
  testID?: string;
};

export default function HomeProduct({item, onPress, testID}: Props) {
  const styles = useStyles();

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      style={styles.container}
      onPress={onPress}>
      <Image
        accessibilityIgnoresInvertColors
        source={{uri: item.pictureUrl}}
        style={styles.productImage}
      />
      <View style={styles.productDetails}>
        <View style={styles.productInfo}>
          <Text variant="labelSmall">${item.price}</Text>
          <View style={styles.productRating}>
            <Icon source="star" color={colors.secondary.goldenrod} size={12} />
            <Text variant="labelSmall">{item.rating.toFixed(1)}</Text>
          </View>
        </View>
        <Text variant="labelLarge">{item.name}</Text>
      </View>
      <FavButton style={styles.favoriteButton} />
    </Pressable>
  );
}

const useStyles = () => {
  const theme = useTheme();
  const {vrem, rem} = useResponsiveSizes();

  const styles = StyleSheet.create({
    container: {
      marginHorizontal: rem(12),
      marginVertical: vrem(12),
      backgroundColor: theme.colors.background,
    },
    productImage: {
      width: rem(190),
      height: vrem(250),
      borderRadius: rem(8),
      resizeMode: 'cover',
      marginBottom: vrem(4),
    },
    productDetails: {
      marginHorizontal: rem(8),
    },
    productInfo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    productRating: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    favoriteButton: {
      position: 'absolute',
      top: 0,
      right: 0,
    },
  });

  return styles;
};
