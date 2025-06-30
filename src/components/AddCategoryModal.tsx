import React from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

type AddItemModalProps = {
  visible: boolean;
  title: string;
  placeholder: string;
  onCancel: () => void;
  onSave: (value: string) => void;
};

export default function AddItemModal({
  visible,
  title,
  placeholder,
  onCancel,
  onSave,
}: AddItemModalProps) {
  const [value, setValue] = React.useState('');

  const handleSave = () => {
    if (value.trim()) {
      onSave(value.trim());
      setValue('');
    }
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <View style={styles.container}>
          <Text style={styles.title}>{title}</Text>
          <TextInput
            placeholder={placeholder}
            value={value}
            onChangeText={setValue}
            style={styles.input}
          />
          <View style={styles.actions}>
            <TouchableOpacity onPress={onCancel}>
              <Text style={styles.cancel}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSave}>
              <Text style={styles.save}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  actions: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cancel: {
    marginRight: 20,
    color: '#888',
    fontWeight: '500',
  },
  save: {
    color: '#3478F6',
    fontWeight: '600',
  },
});
