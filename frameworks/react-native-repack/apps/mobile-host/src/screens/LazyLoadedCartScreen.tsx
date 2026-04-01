import React from 'react';

import ErrorBoundary from '../components/ErrorBoundary';
import Placeholder from '../components/Placeholder';
import {CartNavigationProps} from '../navigation/types';

const CartScreen = React.lazy(async () => {
  // @ts-ignore federated dts not enabled yet
  // eslint-disable-next-line import/no-unresolved
  return await import('MobileCart/CartScreen');
});

type Props = CartNavigationProps;

const LazyLoadedCartScreen = ({navigation}: Props) => {
  const handleCheckoutSuccess = () => {
    navigation.navigate('CheckoutSuccess');
  };

  return (
    <ErrorBoundary name="CartScreen">
      <React.Suspense fallback={<Placeholder />}>
        <CartScreen onCheckoutSuccess={handleCheckoutSuccess} />
      </React.Suspense>
    </ErrorBoundary>
  );
};

export default LazyLoadedCartScreen;
