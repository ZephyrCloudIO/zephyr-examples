import React from 'react';
import {Alert} from 'react-native';

import ProductDetailsScreen from '../../screens/ProductDetailsScreen';

export const ProductDetailsScreenStandaloneWrapper = () => {
  const goBack = () => {
    Alert.alert('Go back');
  };

  const goToCart = () => {
    Alert.alert('Go to cart');
  };

  const productId = '1';

  return (
    <ProductDetailsScreen
      goBack={goBack}
      goToCart={goToCart}
      productId={productId}
    />
  );
};
