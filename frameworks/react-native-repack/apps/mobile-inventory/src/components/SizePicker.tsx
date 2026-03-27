import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';

import {Button, Text, useTheme} from 'mobile-core';

type Props = {
  sizes: Array<string>;
  onChange: (size: string) => void;
};

export default function SizePicker({sizes, onChange}: Props) {
  const theme = useTheme();
  const [selectedSize, setSelectedSize] = useState(sizes[0]);

  const handlePress = (size: string) => {
    setSelectedSize(size);
    onChange(size);
  };

  return (
    <View style={styles.container}>
      {sizes.map(size => (
        <View
          key={size}
          style={[
            styles.buttonContainer,
            selectedSize === size
              ? {backgroundColor: theme.colors.primary}
              : {},
          ]}>
          <Button key={size} onPress={() => handlePress(size)}>
            <Text
              variant="labelSmall"
              style={
                selectedSize === size
                  ? {color: theme.colors.onPrimary}
                  : undefined
              }>
              {size}
            </Text>
          </Button>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  buttonContainer: {
    borderRadius: 4,
  },
});
