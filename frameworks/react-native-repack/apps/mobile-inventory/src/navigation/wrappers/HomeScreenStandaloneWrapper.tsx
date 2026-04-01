import React from 'react';

import HomeScreen from '../../screens/HomeScreen';

export const HomeScreenStandaloneWrapper = () => {
  const handleProductPress = (productId: string) => {
    console.log('Navigating to product details', productId);
  };

  return <HomeScreen onProductPress={handleProductPress} />;
};
