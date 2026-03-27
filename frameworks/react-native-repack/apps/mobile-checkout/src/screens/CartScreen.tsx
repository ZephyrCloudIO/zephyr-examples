import React from 'react';
import {StyleSheet} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import {Text, VStack} from 'mobile-core';

import CheckoutSection from '../components/CheckoutSection';

const CartScreen = () => {
  const navigation = useNavigation();

  const handleCheckoutSuccess = () => {
    navigation.navigate('CheckoutSuccessScreen');
  };

  return (
    <VStack style={styles.container}>
      <Text>Cart Screen</Text>
      <CheckoutSection onCheckoutSuccess={handleCheckoutSuccess} />
    </VStack>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CartScreen;
