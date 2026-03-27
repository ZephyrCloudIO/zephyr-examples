import React from 'react';

import {createNativeStackNavigator} from '@react-navigation/native-stack';

import CartScreen from '../screens/CartScreen';
import {CheckoutSuccessScreenStandaloneWrapper} from './wrappers/CheckoutSuccessScreenStandaloneWrapper';

export type MainStackParamList = {
  CartScreen: undefined;
  CheckoutSuccessScreen: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends MainStackParamList {}
  }
}

const Main = createNativeStackNavigator<MainStackParamList>();

const MainNavigator = () => {
  return (
    <Main.Navigator>
      <Main.Screen name="CartScreen" component={CartScreen} />
      <Main.Screen
        name="CheckoutSuccessScreen"
        component={CheckoutSuccessScreenStandaloneWrapper}
      />
    </Main.Navigator>
  );
};

export default MainNavigator;
