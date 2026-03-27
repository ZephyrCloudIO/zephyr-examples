import {useCallback} from 'react';
import {Dimensions, useWindowDimensions} from 'react-native';

// iPhone 15 Pro Max dimensions
const MOCK_WIDTH = 430;
const MOCK_HEIGHT = 932;

const {width: staticWidth, height: staticHeight} = Dimensions.get('window');

export const rem = (value = 1, screenWidth = staticWidth) =>
  (value * screenWidth) / MOCK_WIDTH;

export const vrem = (value = 1, screenHeight = staticHeight) =>
  (value * screenHeight) / MOCK_HEIGHT;

export const useResponsiveSizes = () => {
  const {width: dynamicWidth, height: dynamicHeight} = useWindowDimensions();

  const dynamicRem = useCallback(
    (value: number) => rem(value, dynamicWidth),
    [dynamicWidth],
  );

  const dynamicVrem = useCallback(
    (value: number) => vrem(value, dynamicHeight),
    [dynamicHeight],
  );

  return {
    rem: dynamicRem,
    vrem: dynamicVrem,
  };
};
