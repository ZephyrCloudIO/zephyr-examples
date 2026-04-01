import React from 'react';

import {useNavigation} from '@react-navigation/native';
import {AccountScreen} from 'mobile-core';

import packageJson from '../../package.json';

export const AccountScreenWrapper = () => {
  const navigation = useNavigation();

  const handleLoginPress = () => {
    navigation.navigate('Login');
  };

  return (
    <AccountScreen
      appVersion={packageJson.version}
      onLoginPress={handleLoginPress}
    />
  );
};
