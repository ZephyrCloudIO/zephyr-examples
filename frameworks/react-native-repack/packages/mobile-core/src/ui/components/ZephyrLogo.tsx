import React from 'react';
import {Image, ImageProps} from 'react-native';

import LogoImage from '../../assets/zephyr_logo.png';

export function ZephyrLogo(props: ImageProps) {
  return <Image source={LogoImage} resizeMode="contain" {...props} />;
}
