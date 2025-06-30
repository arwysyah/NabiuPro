// src/components/Button.tsx

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';

type ButtonType = 'primary' | 'secondary';

type Props = {
  label: string;
  onPress: () => void;
  type?: ButtonType;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
};

const Button: React.FC<Props> = ({
  label,
  onPress,
  type = 'primary',
  style,
  textStyle,
  disabled = false,
}) => {
  const isPrimary = type === 'primary';

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isPrimary ? styles.primary : styles.secondary,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled}>
      <Text
        style={[
          styles.text,
          isPrimary ? styles.textPrimary : styles.textSecondary,
          textStyle,
        ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: '#3E8BFF',
    width: 267,
    height: 51,
  },
  secondary: {
    backgroundColor: '#FFFFFF',
    borderColor: '#DDDDDD',
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  textPrimary: {
    color: '#fff',
  },
  textSecondary: {
    color: '#333',
  },
});

export default Button;
