import React from 'react';
import {Alert} from 'react-native';

import CartScreen from '../../screens/CartScreen';

// Wrapper for standalone usage of CartScreen
export const CartScreenStandaloneWrapper = () => {
  const handleCheckoutSuccess = () => {
    Alert.alert('Navigate to CheckoutSuccess');
  };

  return <CartScreen onCheckoutSuccess={handleCheckoutSuccess} />;
};
