import React from 'react';
import {Image, StyleSheet, View} from 'react-native';

import {
  ActivityIndicator,
  colors,
  HStack,
  Order,
  Text,
  useProducts,
  useTheme,
  useTranslation,
  VStack,
} from 'mobile-core';

type Props = {
  order: Order;
  testID?: string;
};

export function OrderItem({order, testID}: Props) {
  const {t} = useTranslation('orders');
  const theme = useTheme();
  const {data, isLoading} = useProducts();

  return (
    <View testID={testID} style={styles.container}>
      <HStack style={styles.infoContainer}>
        <Text style={styles.infoTitle} variant="bodyLarge">
          {t('list.id')}
        </Text>
        <Text variant="bodyLarge">{order.id}</Text>
      </HStack>
      <HStack style={styles.infoContainer}>
        <Text style={styles.infoTitle} variant="bodyLarge">
          {t('list.date')}
        </Text>
        <Text variant="bodyLarge">{new Date(order.date).toDateString()}</Text>
      </HStack>
      <Text variant="bodyLarge">{t('list.orderedItems')}</Text>
      <View style={styles.orderContainer}>
        {isLoading ? <ActivityIndicator /> : null}
        {order.items.map(item => {
          const product = data?.find(p => p.id === item.id);

          if (!product) {
            return null;
          }

          return (
            <HStack style={styles.cartItemContainer} key={item.id}>
              <Image
                source={{uri: product.pictureUrl}}
                style={styles.cartItemImage}
              />
              <VStack style={styles.cartItemDescription}>
                <Text variant="bodyMedium">{product.name}</Text>
                <Text variant="labelMedium">3 x ${product.price}</Text>
                <HStack>
                  <Text variant="labelMedium">{item.size}</Text>
                  <Text style={styles.bulletSeparator} variant="labelSmall">
                    •
                  </Text>
                  <Text variant="labelMedium">{item.color}</Text>
                  <View
                    style={[
                      styles.colorPill,
                      {
                        backgroundColor: product.colorsAvailable.find(
                          c => c.name === item.color,
                        )?.hex,
                        borderColor: theme.colors.primary,
                      },
                    ]}
                  />
                </HStack>
              </VStack>
            </HStack>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    paddingBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.grayscale.darkGray,
  },
  infoContainer: {
    alignItems: 'center',
  },
  infoTitle: {
    marginRight: 4,
  },
  orderContainer: {
    marginLeft: 32,
    marginTop: 16,
  },
  cartItemContainer: {
    marginBottom: 8,
  },
  cartItemImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },
  cartItemDescription: {
    marginLeft: 8,
    justifyContent: 'center',
  },
  bulletSeparator: {
    marginHorizontal: 4,
  },
  colorPill: {
    height: 16,
    width: 16,
    marginLeft: 4,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
