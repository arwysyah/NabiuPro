import React, {useState} from 'react';
import {View, Text, Modal, TouchableOpacity, FlatList} from 'react-native';
import {Controller, useFormContext, useWatch} from 'react-hook-form';
import {styles} from '../styles/form.styles';

const subcategoriesMap: Record<string, string[]> = {
  food: ['Groceries', 'Dining Out', 'Snacks'],
  transport: ['Fuel', 'Public Transport', 'Taxi'],
  bills: ['Electricity', 'Water', 'Internet'],
  entertainment: ['Streaming', 'Games', 'Movies'],
  others: ['Gifts', 'Miscellaneous'],
};

export const SubcategoryPicker = () => {
  const {control, setValue} = useFormContext();
  const selectedCategory = useWatch({name: 'category'});
  const [visible, setVisible] = useState(false);

  const subcategories = subcategoriesMap[selectedCategory] || [];

  return (
    <Controller
      name="subcategory"
      control={control}
      render={({field: {value}}) => (
        <>
          <Text style={styles.label}>Subcategory</Text>
          <TouchableOpacity
            style={styles.picker}
            disabled={!selectedCategory}
            onPress={() => setVisible(true)}>
            <Text>{value || 'Select Subcategory'}</Text>
          </TouchableOpacity>
          <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.modalContainer}>
              <FlatList
                data={subcategories}
                keyExtractor={item => item}
                renderItem={({item}) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => {
                      setValue('subcategory', item);
                      setVisible(false);
                    }}>
                    <Text>{item}</Text>
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
