import React, {useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';

import {ProductColor, useTheme} from 'mobile-core';

type Props = {
  colors: Array<ProductColor>;
  onChange: (color: string) => void;
};

export default function ColorPicker({colors, onChange}: Props) {
  const theme = useTheme();
  const [selectedColor, setSelectedColor] = useState(colors[0].name);

  const handlePress = (color: string) => {
    setSelectedColor(color);
    onChange(color);
  };

  return (
    <View style={styles.container}>
      {colors.map(color => (
        <View
          key={color.name}
          style={[
            styles.pillContainer,
            selectedColor === color.name
              ? {backgroundColor: theme.colors.primary}
              : undefined,
          ]}>
          <View
            style={[
              styles.pillBackground,
              {backgroundColor: theme.colors.background},
            ]}>
            <Pressable
              accessibilityRole="button"
              style={[styles.pill, {backgroundColor: color.hex}]}
              onPress={() => handlePress(color.name)}
            />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  pill: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  pillBackground: {
    padding: 2,
    borderRadius: 16,
  },
  pillContainer: {
    padding: 2,
    borderRadius: 18,
    marginHorizontal: 8,
  },
});
