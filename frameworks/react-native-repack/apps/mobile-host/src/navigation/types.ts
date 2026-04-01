import {CompositeScreenProps} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {MaterialBottomTabScreenProps} from 'react-native-paper';

import {CartStackParamList} from './CartCheckoutNavigator';
import {MainStackParamList} from './MainNavigator';
import {TabsParamList} from './TabsNavigator';

export type ProductDetailsNavigationProps = NativeStackScreenProps<
  MainStackParamList,
  'ProductDetails'
>;

export type CheckoutSuccessNavigationProps = CompositeScreenProps<
  NativeStackScreenProps<CartStackParamList, 'CheckoutSuccess'>,
  MaterialBottomTabScreenProps<TabsParamList, 'CartNavigator'>
>;

export type CartNavigationProps = CompositeScreenProps<
  NativeStackScreenProps<CartStackParamList, 'Cart'>,
  MaterialBottomTabScreenProps<TabsParamList, 'CartNavigator'>
>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends MainStackParamList {}
  }
}
