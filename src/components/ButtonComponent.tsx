import {
  ActivityIndicator,
  StyleSheet,
  Text as RNText,
  TouchableOpacity,
  View,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
} from 'react-native';

import {
  baseStyles,
  sizeStyles,
  textSizeStyles,
  radiusStyles,
} from './Button.styles';
import {AppColors} from '../constants/colors';

interface TextButtonProps {
  onPress: () => void;
  label: string | React.ReactNode;
  labelStyle?: TextStyle;
}

export const TextButton = ({onPress, label, labelStyle}: TextButtonProps) => (
  <TouchableOpacity onPress={onPress}>
    {typeof label === 'string' ? (
      <RNText style={[styles.textAction, labelStyle]}>{label}</RNText>
    ) : (
      label
    )}
  </TouchableOpacity>
);

type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'action'
  | 'error'
  | 'success'
  | 'warning'
  | 'default';
type ButtonSize = 'small' | 'standard' | 'large';
type ButtonRadius = 'none' | 'small' | 'standard' | 'stadium';

interface ButtonProps extends TouchableOpacityProps {
  onPress?: () => void;
  children: string | React.ReactNode;
  isLoading?: boolean;
  icon?: React.ReactNode;
  variant?: ButtonVariant;
  expand?: boolean;
  size?: ButtonSize;
  radius?: ButtonRadius;
}

const getVariantStyles = (variant: ButtonVariant, isDisabled: boolean) => {
  const bg = {
    primary: AppColors.primary,
    secondary: '#4A94DEFF',
    action: AppColors.action,
    error: '#f87171',
    success: '#4ade80',
    warning: '#facc15',
    default: '#d1d5db',
  };

  const bgDisabled = {
    primary: 'rgba(59,130,246,0.3)',
    secondary: 'rgba(209,213,219,0.3)',
    action: 'rgba(59,130,246,0.4)',
    error: 'rgba(248,113,113,0.3)',
    success: 'rgba(74,222,128,0.3)',
    warning: 'rgba(250,204,21,0.3)',
    default: 'rgba(209,213,219,0.3)',
  };

  const text = {
    primary: '#ffffff',
    secondary: '#000000',
    action: '#ffffff',
    error: '#ffffff',
    success: '#ffffff',
    warning: '#ffffff',
    default: '#1f2937cc',
  };

  const border = {
    primary: AppColors.primary,
    secondary: AppColors.secondary,
    action: AppColors.action,
    error: '#ef4444',
    success: '#16a34a',
    warning: '#eab308',
    default: '#9ca3af',
  };

  const textColor = isDisabled ? text[variant] + '99' : text[variant];
  const backgroundColor = isDisabled ? bgDisabled[variant] : bg[variant];
  const borderColor = isDisabled ? border[variant] + '4D' : border[variant];

  return {textColor, backgroundColor, borderColor};
};

export const Button = ({
  onPress,
  children,
  isLoading,
  icon,
  variant = 'default',
  expand = false,
  size = 'standard',
  radius = 'standard',

  ...props
}: ButtonProps) => {
  const isDisabled = isLoading || props.disabled;
  const {textColor, backgroundColor} = getVariantStyles(variant, isDisabled);

  return (
    <View style={baseStyles.row}>
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        style={[
          baseStyles.button,
          {backgroundColor},
          sizeStyles[size],
          radiusStyles[radius],
          expand && {flex: 1},
          props.style as ViewStyle,
        ]}
        {...props}>
        <RNText
          style={[
            baseStyles.text,
            textSizeStyles[size],
            {color: textColor},
            props.style as TextStyle,
          ]}>
          {children}
        </RNText>
        {isLoading && (
          <ActivityIndicator
            style={baseStyles.iconSpacing}
            color={AppColors.white}
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

export const OutlineButton = ({
  onPress,
  children,
  isLoading,
  icon,
  variant = 'default',
  expand = false,
  size = 'standard',
  radius = 'standard',
  ...props
}: ButtonProps) => {
  const isDisabled = isLoading || props.disabled;
  const {textColor, borderColor} = getVariantStyles(variant, isDisabled);

  return (
    <View style={baseStyles.row}>
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        style={[
          baseStyles.button,
          {
            borderWidth: 1,
            borderColor,
            backgroundColor: 'transparent',
          },
          sizeStyles[size],
          radiusStyles[radius],
          expand && {flex: 1},
          props.style as ViewStyle,
        ]}
        {...props}>
        <RNText
          style={[
            baseStyles.text,
            textSizeStyles[size],
            {color: textColor},
            props.style as TextStyle,
          ]}>
          {children}
        </RNText>
        {isLoading && (
          <ActivityIndicator
            style={baseStyles.iconSpacing}
            color={AppColors.primary}
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  textAction: {
    color: AppColors.action,
    fontWeight: '500',
  },
});
