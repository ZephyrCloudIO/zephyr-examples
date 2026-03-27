import React from 'react';

import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {OrdersScreenStandaloneWrapper} from './wrappers/OrdersScreenStandaloneWrapper';

export type MainStackParamList = {
  Cart: {
    id: string;
  };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends MainStackParamList {}
  }
}

const Main = createNativeStackNavigator<MainStackParamList>();

const MainNavigator = () => {
  return (
    <Main.Navigator screenOptions={{headerShown: false}}>
      <Main.Screen name="Cart" component={OrdersScreenStandaloneWrapper} />
    </Main.Navigator>
  );
};

export default MainNavigator;
