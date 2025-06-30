import React, {useCallback, useMemo, useRef, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';

const formatNumberID = (value: string): string => {
  const numeric = value.replace(/\D/g, '');
  if (!numeric) return '';
  return new Intl.NumberFormat('id-ID').format(Number(numeric));
};

const removeSeparators = (formatted: string): string => {
  return formatted.replace(/\./g, '');
};

export default function KeyboardInput(): JSX.Element {
  const [value, setValue] = useState<string>('');
  const sheetRef = useRef<BottomSheet>(null);

  const snapPoints = useMemo(() => ['25%'], []);

  const handleKeyPress = useCallback(
    (key: string) => {
      const raw = removeSeparators(value);

      if (key === 'del') {
        const newRaw = raw.slice(0, -1);
        setValue(formatNumberID(newRaw));
      } else {
        const newRaw = raw + key;
        setValue(formatNumberID(newRaw));
      }
    },
    [value],
  );

  const openKeyboard = () => {
    sheetRef.current?.expand();
  };

  const renderKeyboard = () => {
    const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'del'];

    return (
      <View style={styles.keyboard}>
        {keys.map(key => (
          <TouchableOpacity
            key={key}
            style={styles.key}
            onPress={() => handleKeyPress(key)}>
            <Text style={styles.keyText}>{key === 'del' ? '⌫' : key}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={value}
        placeholder="Masukkan angka"
        editable={false}
        onPressIn={openKeyboard}
        pointerEvents="none"
      />

      <BottomSheet
        ref={sheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose>
        {renderKeyboard()}
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20, justifyContent: 'center'},
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 14,
    fontSize: 20,
    textAlign: 'right',
  },
  keyboard: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    justifyContent: 'center',
  },
  key: {
    width: '30%',
    margin: '1.5%',
    paddingVertical: 20,
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    alignItems: 'center',
  },
  keyText: {
    fontSize: 22,
    fontWeight: '600',
  },
});
