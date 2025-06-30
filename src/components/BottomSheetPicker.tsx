import React, {useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
} from 'react-native';
import {useFormContext, Controller} from 'react-hook-form';
import Icon from '@react-native-vector-icons/ionicons';
import {AppColors} from '../constants/colors';
import {useTranslation} from 'react-i18next';

type Props = {
  name: string;
  label: string;
  options: string[];
  placeHolder?: string;
  icons?: string[];
};

export default function BottomSheetPicker({
  name,
  label,
  options,
  placeHolder,
  icons,
}: Props) {
  const {control, setValue} = useFormContext();

  const [visible, setVisible] = React.useState(false);

  const handleSelect = (val: string) => {
    setValue(name, val);
    setVisible(false);
  };

  const {t} = useTranslation();
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <Controller
        name={name}
        control={control}
        render={({field: {value}}) => (
          <>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setVisible(true)}>
              <Text style={value ? styles.inputText : styles.placeholder}>
                {t(value) === t('transaction-category.addNewSubCategory') ||
                t(value) === t('transaction-category.addNewCategory')
                  ? ''
                  : t(value) || placeHolder}
              </Text>
              <Icon name="chevron-down" size={18} color={'black'} />
            </TouchableOpacity>

            <Modal
              visible={visible}
              animationType="slide"
              transparent
              onRequestClose={() => setVisible(false)}>
              <TouchableOpacity
                style={styles.modalBackdrop}
                activeOpacity={1}
                onPressOut={() => setVisible(false)}>
                <View style={styles.modalContent}>
                  <FlatList
                    data={options}
                    keyExtractor={item => item}
                    renderItem={({item, index}) => (
                      <TouchableOpacity
                        style={styles.modalItem}
                        onPress={() => handleSelect(item)}>
                        {icons?.length && (
                          <Icon
                            name={
                              t(item) ===
                              t('transaction-category.addNewCategory')
                                ? 'add'
                                : icons[index]
                            }
                            size={20}
                            color={AppColors.action}
                            style={{marginRight: 10}}
                          />
                        )}
                        <Text style={styles.modalItemText}>{t(item)}</Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              </TouchableOpacity>
            </Modal>
          </>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 20,
  },
  label: {
    fontWeight: '500',
    marginBottom: 6,
    marginLeft: 4,
    fontSize: 16,
    color: '#333',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#D2D2D2FF',
    flexDirection: 'row',
  },
  inputText: {
    fontSize: 16,
    color: '#000',
  },
  placeholder: {
    fontSize: 16,
    color: '#999',
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#F7F7F7FF',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '50%',
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  modalItemText: {
    fontSize: 16,
  },
});
