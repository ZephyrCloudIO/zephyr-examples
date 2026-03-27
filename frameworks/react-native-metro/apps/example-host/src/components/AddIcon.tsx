import type React from 'react';
import { StyleSheet, View } from 'react-native';

interface AddIconProps {
  width?: number;
  height?: number;
  backgroundColor?: string;
}

export const AddIcon: React.FC<AddIconProps> = ({
  width = 20,
  height = 20,
  backgroundColor = 'white',
}) => {
  return (
    <View style={styles.container}>
      <View style={[styles.vertical, { height, backgroundColor }]} />
      <View style={[styles.horizontal, { width, backgroundColor }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  vertical: {
    width: 2,
    position: 'absolute',
  },
  horizontal: {
    height: 2,
    position: 'absolute',
  },
});

export default AddIcon;
