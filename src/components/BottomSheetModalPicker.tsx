// components/BottomSheetPicker.tsx
import React, {useRef} from 'react';
import {Text, TouchableOpacity, View, StyleSheet} from 'react-native';
import {useFormContext, Controller} from 'react-hook-form';
import BottomSheetModalPicker from './BottomSheetModalPicker';
import {BottomSheetModalPickerRef} from './BottomSheetPicker';

type Props = {
  name: string;
  label: string;
  options: string[];
  placeholder?: string;
};

export default function BottomSheetPicker({
  name,
  label,
  options,
  placeholder,
}: Props) {
  const pickerRef = useRef<BottomSheetModalPickerRef>(null);
  const {control, setValue} = useFormContext();

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <Controller
        name={name}
        control={control}
        render={({field: {value}}) => (
          <>
            <TouchableOpacity
              onPress={() => pickerRef.current?.open()}
              style={styles.input}>
              <Text style={!value ? styles.placeholder : styles.inputText}>
                {value || placeholder || 'Select'}
              </Text>
            </TouchableOpacity>
            <BottomSheetModalPicker
              ref={pickerRef}
              options={options}
              onSelect={val => setValue(name, val)}
              selected={value}
            />
          </>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 20,
    marginHorizontal: 10,
  },
  label: {
    fontWeight: '500',
    marginBottom: 6,
    marginLeft: 2,
    color: '#333',
    fontSize: 16,
  },
  input: {
    backgroundColor: '#F6F8FB',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5EAF1',
  },
  placeholder: {
    color: '#999',
    fontSize: 16,
  },
  inputText: {
    color: '#111',
    fontSize: 16,
  },
});
