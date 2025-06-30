import React, {useState, useRef} from 'react';
import {
  TextInput,
  View,
  StyleSheet,
  type NativeSyntheticEvent,
  type TextInputSelectionChangeEventData,
  type TextInput as RNTextInput,
} from 'react-native';

const formatNumberID = (value: string): string => {
  const numeric = value.replace(/\D/g, '');
  if (!numeric) {
    return '';
  }
  return new Intl.NumberFormat('id-ID').format(Number(numeric));
};

const removeSeparators = (formatted: string): string =>
  formatted.replace(/\./g, '');

const NumberInput = () => {
  const [displayValue, setDisplayValue] = useState<string>('');
  const inputRef = useRef<RNTextInput>(null);
  const cursorPosRef = useRef<number>(0);

  const handleChangeText = (text: string) => {
    const raw = removeSeparators(text);
    const formatted = formatNumberID(raw);

    const addedChars = formatted.length - displayValue.length;
    const newCursor = Math.max(cursorPosRef.current + addedChars, 0);

    setDisplayValue(formatted);

    setTimeout(() => {
      inputRef.current?.setNativeProps({
        selection: {start: newCursor, end: newCursor},
      });
    }, 0);
  };

  const handleSelectionChange = (
    event: NativeSyntheticEvent<TextInputSelectionChangeEventData>,
  ) => {
    cursorPosRef.current = event.nativeEvent.selection.start;
  };

  return (
    <View style={styles.container}>
      <TextInput
        ref={inputRef}
        style={styles.input}
        value={displayValue}
        onChangeText={handleChangeText}
        onSelectionChange={handleSelectionChange}
        keyboardType="numeric"
        placeholder="Masukkan angka"
        maxLength={20}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 18,
  },
});

export default NumberInput;
