import React, {forwardRef, useImperativeHandle, useRef, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {BottomSheetModal, BottomSheetView} from '@gorhom/bottom-sheet';
import FontFamily from '../assets/typography';
import {formatCustomNumber} from '../lib/currency_formatter';
import {useCurrency} from '../context/CurrencyContext';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type Props = {
  onSubmit: (value: string) => void;
  total?: string;
};

export type CalculatorSheetRef = {
  open: (initialValue: string) => void;
  close: () => void;
};

const CalculatorBottomSheet = forwardRef<CalculatorSheetRef, Props>(
  ({onSubmit, total}, ref) => {
    const sheetRef = useRef<BottomSheetModal>(null);
    const [value, setValue] = useState('');
    const [error, setError] = useState('');

    useImperativeHandle(ref, () => ({
      open: () => {
        // setValue(initialValue);
        setError('');
        sheetRef.current?.expand();
        sheetRef.current?.present();
      },
      close: () => {
        sheetRef.current?.close();
      },
    }));

    // Added 'C' and '%'
    const keys = [
      'C',
      '(',
      ')',
      '+',
      '7',
      '8',
      '9',
      '-',
      '4',
      '5',
      '6',
      '*',
      '1',
      '2',
      '3',
      '/',
      '0',
      '%',
      'Del',
      '=',
    ];

    const invalidSequenceRegex = /[+\/*]{2,}|--|(\+\+)+/;

    const isValidExpression = (expr: string) => {
      if (!/^[0-9+\-*/.()%() ]*$/.test(expr)) return false;
      if (invalidSequenceRegex.test(expr)) return false;
      if (/^[+*/]/.test(expr)) return false;

      const parts = expr.split(/[\+\-\*\/]/);
      for (const part of parts) {
        if ((part.match(/\./g) || []).length > 1) return false;
      }

      return true;
    };

    const evaluateExpression = (expr: string) => {
      try {
        if (!isValidExpression(expr)) return 'Error';
        // eslint-disable-next-line no-eval
        const result = eval(expr);
        if (typeof result === 'number' && isFinite(result)) {
          return result.toString();
        }
        return 'Error';
      } catch {
        return 'Error';
      }
    };

    const {currencyCode, locale} = useCurrency();
    // Helper: convert last number in expression to percentage (divide by 100)
    const applyPercentage = (expr: string) => {
      // Match last number (including decimals)
      const regex = /(\d*\.?\d+)(?!.*\d)/;
      const match = expr.match(regex);
      if (!match) return expr;

      const numberStr = match[0];
      const numberValue = parseFloat(numberStr);
      if (isNaN(numberValue)) return expr;

      const percentValue = numberValue / 100;

      // Replace last number with percentage
      const newExpr = expr.slice(0, match.index) + percentValue.toString();
      return newExpr;
    };

    const handlePress = (key: string) => {
      setError('');

      if (key === 'Del') {
        setValue(prev => prev.slice(0, -1));
        return;
      }

      if (key === 'C') {
        setValue('');
        setError('');
        return;
      }

      if (key === '%') {
        const newValue = applyPercentage(value);
        if (isValidExpression(newValue)) {
          setValue(newValue);
        } else {
          setError('Invalid percentage');
        }
        return;
      }

      if (key === '=') {
        const result = evaluateExpression(value);
        if (result === 'Error') {
          setError('Invalid Expression');
        } else {
          setValue(result);
        }
        return;
      }

      const newValue = value + key;
      if (isValidExpression(newValue)) {
        setValue(newValue);
      }
    };

    const handleSubmit = () => {
      const result = evaluateExpression(value || '0');
      if (result === 'Error') {
        setError('Invalid Expression');
        return;
      }
      onSubmit(result);
      setValue('');
      sheetRef.current?.close();
    };
    const insets = useSafeAreaInsets();
    return (
      <BottomSheetModal ref={sheetRef} index={0} snapPoints={['80%']}>
        <BottomSheetView>
          <View style={styles.container}>
            {total && (
              <View
                style={{
                  backgroundColor: 'rgba(0,0,0,0.2)',
                  paddingHorizontal: 8, // horizontal padding instead of fixed width
                  paddingVertical: 4,
                  alignItems: 'center',
                  alignSelf: 'flex-start', // optional: prevents stretching
                  borderRadius: 2,
                }}>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: FontFamily.ROKKIT_BOLD,
                    color: '#079D01FF',
                  }}>
                  {total}
                </Text>
              </View>
            )}

            <Text style={styles.display}>
              {formatExpressionDigits(value, locale, currencyCode) || '0'}
            </Text>
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <View style={styles.grid}>
              {keys.map(key => (
                <TouchableOpacity
                  key={key}
                  style={styles.key}
                  onPress={() => handlePress(key)}>
                  <Text style={styles.keyText}>{key}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={[styles.okButton, {marginBottom: insets.bottom}]}
              onPress={handleSubmit}>
              <Text style={styles.okText}>OK</Text>
            </TouchableOpacity>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

export default CalculatorBottomSheet;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  display: {
    fontSize: 32,
    textAlign: 'center',
    marginBottom: 8,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  key: {
    width: '22%',
    backgroundColor: '#f2f2f2',
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  keyText: {
    fontSize: 20,
  },
  okButton: {
    backgroundColor: '#007bff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  okText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
export const formatExpressionDigits = (
  expression: string,
  locale: string = 'en-US',
  currencyCode: string = 'USD',
): string => {
  return expression.replace(/\d+(?:\.\d+)?/g, match => {
    const [intPart, decimalPart] = match.split('.');
    const formattedInt = Number(intPart).toLocaleString(locale, {
      style: 'decimal',
      useGrouping: true,
      minimumFractionDigits: 0,
    });

    let formattedDecimal = '';
    if (decimalPart) {
      // Get the decimal separator from the locale
      const test = 1.1;
      const localeDecimalSeparator = test
        .toLocaleString(locale)
        .replace(/\d/g, '')
        .charAt(0);
      formattedDecimal = localeDecimalSeparator + decimalPart;
    }

    return formattedInt + formattedDecimal;
  });
};
