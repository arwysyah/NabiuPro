import React from 'react';
import {TextInput, View, Text, StyleSheet} from 'react-native';
import {Controller} from 'react-hook-form';

type Props = {
  name: string;
  control: any;
  placeholder: string;
  keyboardType?: any;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  error?: string;
};

const InputField = ({
  name,
  control,
  placeholder,
  keyboardType = 'default',
  autoCapitalize = 'none',
  error,
}: Props) => (
  <View style={{marginBottom: 16}}>
    <Controller
      control={control}
      name={name}
      render={({field: {onChange, value}}) => (
        <TextInput
          style={[styles.input, error && styles.errorInput]}
          onChangeText={onChange}
          value={value}
          placeholder={placeholder}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
        />
      )}
    />
    {error && <Text style={styles.errorText}>{error}</Text>}
  </View>
);

export default InputField;

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
  },
  errorInput: {
    borderColor: '#f00',
  },
  errorText: {
    color: '#f00',
    marginTop: 4,
  },
});
