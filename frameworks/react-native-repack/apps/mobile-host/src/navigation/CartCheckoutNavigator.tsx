import React from 'react';

import {createNativeStackNavigator} from '@react-navigation/native-stack';

import LazyLoadedCartScreen from '../screens/LazyLoadedCartScreen';
import LazyLoadedCheckoutSuccessScreen from '../screens/LazyLoadedCheckoutSuccessScreen';

export type CartStackParamList = {
  Cart: undefined;
  CheckoutSuccess: undefined;
};

const CartCheckout = createNativeStackNavigator<CartStackParamList>();

const CartCheckoutNavigator = () => {
  return (
    <CartCheckout.Navigator screenOptions={{headerShown: false}}>
      <CartCheckout.Screen name="Cart" component={LazyLoadedCartScreen} />
      <CartCheckout.Screen
        options={{
          presentation: 'fullScreenModal',
        }}
        name="CheckoutSuccess"
        component={LazyLoadedCheckoutSuccessScreen}
      />
    </CartCheckout.Navigator>
  );
};

export default CartCheckoutNavigator;
