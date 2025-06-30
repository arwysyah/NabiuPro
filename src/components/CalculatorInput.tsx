// components/CalculatorField.tsx
import React, {useRef} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Keyboard} from 'react-native';
import {useFormContext, Controller} from 'react-hook-form';
import CalculatorBottomSheet, {
  CalculatorSheetRef,
} from './CalculatorBottomSheet';
import {formatCurrency} from '../lib/currency_formatter';
import {useCurrency} from '../context/CurrencyContext';

type Props = {
  name: string;
  placeholder?: string;
  isDisabled?: boolean;
};

export default function CalculatorField({
  name,
  placeholder,
  isDisabled,
}: Props) {
  const {control, setValue} = useFormContext();
  const calculatorRef = useRef<CalculatorSheetRef>(null);

  const openCalculator = (current: string) => {
    if (isDisabled) {
      return;
    }
    calculatorRef.current?.open(current);
    Keyboard.dismiss();
  };

  const {currencyCode, locale} = useCurrency();
  return (
    <View>
      <Controller
        name={name}
        control={control}
        render={({field: {value}}) => (
          <TouchableOpacity
            style={styles.fakeInput}
            onPress={() => openCalculator(value || '')}>
            <Text style={value ? styles.inputText : styles.placeholderText}>
              {formatCurrency(value, locale, currencyCode) ||
                placeholder ||
                'Enter amount'}
            </Text>
          </TouchableOpacity>
        )}
      />
      <CalculatorBottomSheet
        currencyCode={currencyCode}
        ref={calculatorRef}
        onSubmit={val => setValue(name, val)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fakeInput: {
    padding: 18,
    borderRadius: 10,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    borderColor: '#D2D2D2FF',
    borderWidth: 0.8,
    // margin: 10,
  },
  placeholderText: {
    color: '#888',
  },
  inputText: {
    color: '#000',
  },
});
