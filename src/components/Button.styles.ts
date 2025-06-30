import {StyleSheet} from 'react-native';

export const baseStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    position: 'relative',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
    fontWeight: '500',
  },
  iconSpacing: {
    marginLeft: 8,
  },
});

// Button sizes
export const sizeStyles = StyleSheet.create({
  small: {paddingVertical: 6, paddingHorizontal: 12},
  standard: {paddingVertical: 10, paddingHorizontal: 16},
  large: {paddingVertical: 12, paddingHorizontal: 24},
});

// Text sizes
export const textSizeStyles = StyleSheet.create({
  small: {fontSize: 14},
  standard: {fontSize: 16},
  large: {fontSize: 16},
});

// Radius
export const radiusStyles = StyleSheet.create({
  none: {borderRadius: 0},
  small: {borderRadius: 4},
  standard: {borderRadius: 8},
  stadium: {borderRadius: 999},
});
