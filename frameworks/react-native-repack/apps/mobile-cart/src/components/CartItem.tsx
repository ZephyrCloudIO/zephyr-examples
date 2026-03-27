import React from 'react';
import {Image, StyleSheet, View} from 'react-native';

import {
  Divider,
  HStack,
  Text,
  useProduct,
  useTranslation,
  VStack,
} from 'mobile-core';
import {useTheme} from 'react-native-paper';

type Props = {
  itemId: string;
  quantity: number;
  size: string;
  color: string;
};

export default function CartItem({itemId, quantity, size, color}: Props) {
  const theme = useTheme();
  const {t} = useTranslation('cart');
  const product = useProduct(itemId);

  if (!product) {
    return null;
  }

  const productColor = product.colorsAvailable.find(c => c.name === color);

  return (
    <HStack style={styles.container}>
      <Image style={styles.image} source={{uri: product.pictureUrl}} />
      <VStack style={styles.detailsContainer}>
        <Text numberOfLines={1} variant="headlineSmall">
          {product.name}
        </Text>
        <HStack style={styles.variantSection}>
          <Text numberOfLines={1} variant="labelMedium">
            {size}
          </Text>
          <Text style={styles.bulletSeparator}>•</Text>
          <Text numberOfLines={1} variant="labelMedium">
            {productColor?.name}
          </Text>
          <View
            style={[
              styles.colorPill,
              {
                backgroundColor: productColor?.hex,
                borderColor: theme.colors.primary,
              },
            ]}
          />
        </HStack>
        <Divider style={styles.divider} />
        <HStack style={styles.quantityContainer}>
          <Text variant="labelMedium">{t('quantity')}</Text>
          <Text variant="labelMedium">{quantity}</Text>
        </HStack>
        <Divider style={styles.divider} />
        <View style={styles.priceContainer}>
          <Text variant="labelMedium">${product.price}</Text>
        </View>
      </VStack>
    </HStack>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    columnGap: 16,
  },
  image: {
    width: 140,
    height: 140,
    resizeMode: 'cover',
  },
  detailsContainer: {
    flex: 1,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  divider: {
    marginVertical: 8,
  },
  variantSection: {
    alignItems: 'center',
    marginTop: 4,
  },
  bulletSeparator: {
    marginHorizontal: 8,
  },
  colorPill: {
    height: 16,
    width: 16,
    marginLeft: 4,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
