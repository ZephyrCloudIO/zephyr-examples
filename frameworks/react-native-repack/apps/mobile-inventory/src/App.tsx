import React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {QueryClient, QueryProvider} from 'mobile-core';

import MainNavigator from './navigation/MainNavigator';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryProvider client={queryClient}>
      <NavigationContainer>
        <MainNavigator />
      </NavigationContainer>
    </QueryProvider>
  );
};

export default App;
