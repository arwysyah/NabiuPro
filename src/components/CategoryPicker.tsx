import React, {useState} from 'react';
import {View, Text, Modal, TouchableOpacity, FlatList} from 'react-native';
import {Controller, useFormContext} from 'react-hook-form';
import {styles} from '../styles/form.styles';
import Icon from '@react-native-vector-icons/ionicons';

const categories = [
  {id: 'food', name: 'Food'},
  {id: 'transport', name: 'Transport'},
  {id: 'bills', name: 'Bills'},
  {id: 'entertainment', name: 'Entertainment'},
  {id: 'others', name: 'Others'},
];

export const CategoryPicker = () => {
  const {control, setValue} = useFormContext();
  const [visible, setVisible] = useState(false);

  return (
    <Controller
      name="category"
      control={control}
      render={({field: {value}}) => (
        <>
          <Text style={styles.label}>Category</Text>

          <TouchableOpacity
            style={styles.picker}
            onPress={() => setVisible(true)}>
            <Text>
              {categories.find(c => c.id === value)?.name || 'Select Category'}
            </Text>
          </TouchableOpacity>
          <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.modalContainer}>
              <FlatList
                data={categories}
                keyExtractor={item => item.id}
                renderItem={({item}) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => {
                      setValue('category', item.id);
                      setValue('subcategory', '');
                      setVisible(false);
                    }}>
                    <Text>{item.name}</Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity
                onPress={() => setVisible(false)}
                style={styles.modalCancel}>
                <Text style={{color: '#007AFF'}}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </>
      )}
    />
  );
};
