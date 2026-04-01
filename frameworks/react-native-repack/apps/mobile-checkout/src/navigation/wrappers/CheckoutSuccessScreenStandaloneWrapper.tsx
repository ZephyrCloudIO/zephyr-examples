import React from 'react';
import {Alert} from 'react-native';

import CheckoutSuccessScreen from '../../screens/CheckoutSuccessScreen';

export const CheckoutSuccessScreenStandaloneWrapper = () => {
  const handleDismiss = () => {
    Alert.alert('Dismiss CheckoutSuccess');
  };

  return <CheckoutSuccessScreen onDismiss={handleDismiss} />;
};
