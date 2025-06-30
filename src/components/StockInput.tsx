import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

export const StockInput = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  const increment = () => {
    const newValue = (parseInt(value || '0', 10) + 1).toString();
    onChange(newValue);
  };

  const decrement = () => {
    const newValue = Math.max(0, parseInt(value || '0', 10) - 1).toString();
    onChange(newValue);
  };

  return (
    <View style={styles.stockInputContainer}>
      <TouchableOpacity onPress={decrement} style={styles.stockButton}>
        <Text style={styles.stockButtonText}>−</Text>
      </TouchableOpacity>
      <TextInput
        style={[styles.input, styles.stockTextInput]}
        keyboardType="numeric"
        value={value}
        onChangeText={
          text => onChange(text.replace(/[^0-9]/g, '')) // keep only numbers
        }
        placeholder="0"
        placeholderTextColor={'grey'}
      />
      <TouchableOpacity onPress={increment} style={styles.stockButton}>
        <Text style={styles.stockButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  stockInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  stockButton: {
    width: 44,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.8,
    borderColor: '#D2D2D2FF',
  },
  stockButtonText: {
    fontSize: 24,
    color: '#333',
  },
  stockTextInput: {
    flex: 1,
    marginHorizontal: 8,
    textAlign: 'center',
    paddingVertical: 14,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    borderWidth: 0.8,
    borderColor: '#D2D2D2FF',
    color: 'black',
  },
});
