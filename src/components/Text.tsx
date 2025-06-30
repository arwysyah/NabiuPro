// components/Text.tsx
import React from 'react';
import {
  Text,
  TextProps as RNTextProps,
  StyleSheet,
  TextStyle,
} from 'react-native';
import FontFamily from '../assets/typography';

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
type Weight = 'regular' | 'bold';

interface Props extends RNTextProps {
  children: React.ReactNode;
  size?: Size;
  weight?: Weight;
  color?: string;
  style?: TextStyle;
}

const fontSizes: Record<Size, number> = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
};

const fontFamilies: Record<Weight, string> = {
  regular: FontFamily.ROKKIT_BOLD,
  bold: FontFamily.KAUSHAN_REGULAR,
};

export const RNText = ({
  children,
  size = 'md',
  weight = 'regular',
  color = '#000',
  style,
  ...rest
}: Props) => {
  return (
    <Text
      style={[
        styles.text,
        {
          fontSize: fontSizes[size],
          fontFamily: fontFamilies[weight],
          color,
        },
        style,
      ]}
      {...rest}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    // Default styles if needed
  },
});
