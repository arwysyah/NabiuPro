import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import {Controller} from 'react-hook-form';
import useToggle from '../hooks/useToggle';

type Props = {
  name: string;
  control: any;
  placeholder: string;
  error?: string;
  matchPassword?: string;
};

const PasswordField = ({name, control, placeholder, error}: Props) => {
  const [secure, toggleSecure] = useToggle(true);

  return (
    <View style={{marginBottom: 16}}>
      <Controller
        control={control}
        name={name}
        render={({field: {onChange, value}}) => (
          <View style={styles.inputContainer}>
            <TextInput
              placeholder={placeholder}
              value={value}
              onChangeText={onChange}
              secureTextEntry={secure}
              style={[styles.input, error && styles.errorInput]}
            />
            <TouchableOpacity onPress={toggleSecure}>
              <Text style={styles.toggle}>{secure ? '👁️' : '🙈'}</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

export default PasswordField;

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  input: {
    flex: 1,
  },
  toggle: {
    marginLeft: 10,
    fontSize: 18,
  },
  errorInput: {
    borderColor: '#f00',
  },
  errorText: {
    color: '#f00',
    marginTop: 4,
  },
});
