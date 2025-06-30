import React, {useState} from 'react';
import {Modal, View, Text, StyleSheet, TextInput, Button} from 'react-native';

type Props = {
  visible: boolean;
  date: string | null;
  habitType: string;
  currentCount: number;
  onClose: () => void;
  onSave: (count: number) => void;
};

const HabitEditModal: React.FC<Props> = ({
  visible,
  date,
  habitType,
  currentCount,
  onClose,
  onSave,
}) => {
  const [count, setCount] = useState(currentCount.toString());

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>{habitType.toUpperCase()}</Text>
          <Text style={styles.subtitle}>{date}</Text>
          <TextInput
            style={styles.input}
            keyboardType="number-pad"
            value={count}
            onChangeText={setCount}
          />
          <View style={styles.buttonGroup}>
            <Button title="Cancel" onPress={onClose} />
            <Button title="Save" onPress={() => onSave(Number(count))} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#00000088',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    marginBottom: 12,
  },
  input: {
    borderColor: '#aaa',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginBottom: 12,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default HabitEditModal;
