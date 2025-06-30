import Icon from '@react-native-vector-icons/ionicons';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {AppColors} from '../constants/colors';
import {Option} from '../types/general';

export const Radio = ({
  value,
  label,
  options,
  subLabel,
  onChange,
}: {
  value: string;
  subLabel?: string;
  label: string;
  options: Option[];
  onChange?: (value: string | number) => void;
}) => {
  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      {subLabel && <Text style={styles.subLabel}>{subLabel}</Text>}

      <View style={styles.optionsContainer}>
        {options.map(x => (
          <TouchableOpacity
            key={x.value}
            activeOpacity={0.8}
            onPress={() => {
              onChange?.(x.value);
            }}>
            <View style={styles.optionWrapper}>
              <View style={styles.optionContent}>
                <View style={styles.iconWrapper}>
                  {value === x.value ? (
                    <Icon
                      name="radio-button-on"
                      size={26}
                      color={AppColors.primary}
                    />
                  ) : (
                    <Icon name="radio-button-off" size={26} color="#dddddd" />
                  )}
                </View>
                <Text style={styles.optionLabel}>{x.label}</Text>
              </View>
              {x.icon && <View style={styles.rightIcon}>{x.icon}</View>}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontWeight: '600',
  },
  subLabel: {
    fontSize: 12,
    color: '#6B7280', // tailwind "text-muted"
  },
  optionsContainer: {
    flexDirection: 'column',
    gap: 8,
  },
  optionWrapper: {
    backgroundColor: '#ffffff',
    borderColor: '#D1D5DB', // tailwind border-gray-300
    borderWidth: 1,
    padding: 5,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    marginRight: 12,
  },
  optionLabel: {
    fontWeight: '600',
  },
  rightIcon: {
    paddingHorizontal: 16,
  },
});
