import React, {ReactNode} from 'react';
import {ColorValue, Platform, StyleSheet, View} from 'react-native';

import {useModuleBoundaryStore} from '../../utils';

const getCornerRadius = Platform.select({
  ios: () => require('react-native-screen-corner-radius').ScreenCornerRadius,
  default: () => 0,
});

export const ModuleBoundary = ({
  color,
  withTopRadius = false,
  withBottomRadius = false,
  children,
}: {
  children: ReactNode;
  color: ColorValue;
  withTopRadius?: boolean;
  withBottomRadius?: boolean;
}) => {
  const {isEnabled} = useModuleBoundaryStore();

  if (!isEnabled || !React.isValidElement(children)) {
    return children;
  }

  return (
    <View style={styles.container}>
      <View
        pointerEvents="none"
        style={[
          styles.borderView,
          {
            borderColor: color,
          },
          withTopRadius && styles.topRadius,
          withBottomRadius && styles.bottomRadius,
        ]}
      />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  borderView: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1000,
    width: '100%',
    height: '100%',
    borderWidth: 8,
    borderStyle: 'dotted',
  },
  topRadius: {
    borderTopLeftRadius: getCornerRadius(),
    borderTopRightRadius: getCornerRadius(),
  },
  bottomRadius: {
    borderBottomLeftRadius: getCornerRadius(),
    borderBottomRightRadius: getCornerRadius(),
  },
});
