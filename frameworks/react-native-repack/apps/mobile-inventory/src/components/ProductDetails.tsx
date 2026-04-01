import React from 'react';
import {Image, ScrollView, StyleSheet, View} from 'react-native';

import {Product, Text} from 'mobile-core';

import ColorPicker from './ColorPicker';
import FavButton from './FavButton';
import SizePicker from './SizePicker';

type Props = {
  product: Product;
  onColorChange: (color: string) => void;
  onSizeChange: (size: string) => void;
};

export default function ProductDetails({
  product,
  onColorChange,
  onSizeChange,
}: Props) {
  return (
    <ScrollView>
      <View style={styles.productContainer}>
        <View>
          <Image
            accessibilityIgnoresInvertColors
            source={{uri: product.pictureUrl}}
            style={styles.productImage}
          />
          <FavButton style={styles.favButton} size={24} />
        </View>
        <View style={styles.productInfoSection}>
          <Text variant="headlineMedium">{product.name}</Text>
          <Text variant="labelMedium">${product.price}</Text>
          <View style={styles.productVariantSection}>
            <Text style={styles.productVariantTitle} variant="labelLarge">
              Color
            </Text>
            <ColorPicker
              colors={product.colorsAvailable}
              onChange={onColorChange}
            />
          </View>
          <View style={styles.productVariantSection}>
            <Text style={styles.productVariantTitle} variant="labelLarge">
              Size
            </Text>
            <SizePicker
              sizes={product.sizesAvailable}
              onChange={onSizeChange}
            />
          </View>
          <Text variant="bodySmall" style={styles.productDescription}>
            {product.description}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  productContainer: {
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 120,
  },
  productImage: {
    width: 380,
    height: 500,
    resizeMode: 'cover',
  },
  favButton: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  productInfoSection: {
    margin: 16,
  },
  productVariantSection: {
    marginVertical: 8,
  },
  productVariantTitle: {
    marginBottom: 12,
  },
  productDescription: {
    marginTop: 16,
  },
});
