import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useStocks} from '../hooks/useStock';
import PageHeader from '../components/PageHeader';
import {StockInput} from '../components/StockInput';
import {useNavigation} from '@react-navigation/native';
import {useRoute, RouteProp} from '@react-navigation/native';
import {updateStock} from '../lib/db/queries.stock';
import Icon from '@react-native-vector-icons/ionicons';
import dayjs from 'dayjs';

type FormData = {
  title: string;
  stock: string;
  satuan: string;
  hargaBeli: string;
  hargaJual: string;
};

// Define route param type
type LedgerFormRouteParams = {
  existingStock?: {
    id: string;
    name: string;
    unit: string;
    stock: number;
    purchase_price: string;
    selling_price: string;
  };
};
const satuanOptions = ['pcs', 'porsi', 'cup', 'dozen', 'kg', 'liter', 'meter'];

export default function CreateLedgerNoteForm() {
  const {stocks, loading, error, addStock} = useStocks();
  const {t} = useTranslation();
  const nav = useNavigation();
  const [showSatuanPicker, setShowSatuanPicker] = useState(false);
  const route =
    useRoute<RouteProp<Record<string, LedgerFormRouteParams>, string>>();
  const existingStock = route.params?.existingStock;
  const isEdit = Boolean(existingStock);

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    setValue,
    watch,
    formState: {errors, isValid},
  } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      title: '',
      stock: '',
      satuan: satuanOptions[0],
      hargaBeli: '',
      hargaJual: '',
    },
  });

  useEffect(() => {
    if (existingStock) {
      setValue('title', existingStock.name);
      setValue('stock', existingStock.stock.toString());
      setValue('satuan', existingStock.units);
      setValue('hargaBeli', existingStock?.purchase_price?.toString() ?? '');
      setValue('hargaJual', existingStock?.selling_price?.toString() ?? '');
    }
  }, [existingStock, setValue]);
  const onSubmit = async (data: FormData) => {
    try {
      const payload = {
        name: data.title,
        unit: data.satuan,
        stock: Number(data.stock),
        purchasePrice: Number(data.hargaBeli),
        sellingPrice: Number(data.hargaJual),
        purchaseDate: dayjs().format('YYYY-MM-DD'),
        note: '',
      };

      let success;
      if (isEdit) {
        success = await updateStock({
          id: Number(existingStock!.id),
          ...payload,
        });
      } else {
        success = await addStock(payload);
      }

      if (success) {
        reset();
        if (isEdit) {
          nav.goBack();
        }
        nav.goBack();
      }
    } catch (error) {
      console.error('Stock save error:', error);
    }
  };

  return (
    <View style={styles.page}>
      <PageHeader title={isEdit ? t('ledger.titleEdit') : t('ledger.title')} />
      <KeyboardAwareScrollView
        contentContainerStyle={{
          padding: 24,
          paddingBottom:
            Platform.OS === 'android'
              ? Dimensions.get('screen').height / 2
              : 100,
          flexGrow: 1,
          backgroundColor: '#FFFFFF',
        }}
        keyboardShouldPersistTaps="handled"
        extraScrollHeight={Platform.OS === 'android' ? 100 : 120}>
        {/* Input Fields */}
        {[
          {
            label: t('ledger.productTitle'),
            name: 'title',
            placeholder: t('ledger.placeholder.title'),
            keyboardType: 'default',
            rules: {
              required: t('ledger.validation.required'),
              minLength: {
                value: 3,
                message: t('ledger.validation.minLength', {count: 3}),
              },
            },
          },
          {
            label: t('ledger.purchasePrice'),
            name: 'hargaBeli',
            placeholder: t('ledger.placeholder.purchasePrice'),
            keyboardType: 'numeric',
            rules: {
              required: t('ledger.validation.required'),
              pattern: {
                value: /^[0-9]+(\.[0-9]{1,2})?$/,
                message: t('ledger.validation.onlyNumbersDecimal'),
              },
              validate: (val: string) =>
                Number(val) > 0 || t('ledger.validation.positiveNumber'),
            },
          },
          {
            label: t('ledger.sellingPrice'),
            name: 'hargaJual',
            placeholder: t('ledger.sellingPrice'),
            keyboardType: 'numeric',
            rules: {
              required: t('ledger.validation.required'),
              pattern: {
                value: /^[0-9]+(\.[0-9]{1,2})?$/,
                message: t('ledger.validation.onlyNumbersDecimal'),
              },
              validate: (val: string) =>
                Number(val) > 0 || t('ledger.validation.positiveNumber'),
            },
          },
        ].map((field, idx) => (
          <View key={idx} style={styles.field}>
            <Text style={styles.label}>{field.label}</Text>
            <Controller
              control={control}
              name={field.name as keyof FormData}
              rules={field.rules}
              render={({field: {onChange, value}}) => (
                <TextInput
                  editable={isEdit && field.name === 'title' ? false : true}
                  style={[
                    isEdit && field.name === 'title'
                      ? {backgroundColor: '#DDDCDCFF'}
                      : {backgroundColor: '#FFFFFF'},
                    styles.input,
                    errors[field.name as keyof FormData] && styles.inputError,
                  ]}
                  placeholder={field.placeholder}
                  placeholderTextColor={'#999'}
                  keyboardType={field.keyboardType as any}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors[field.name as keyof FormData] && (
              <Text style={styles.errorText}>
                {errors[field.name as keyof FormData]?.message}
              </Text>
            )}
          </View>
        ))}

        {/* Stock */}
        <Text style={styles.label}>{t('ledger.quantity')}</Text>
        <Controller
          control={control}
          name="stock"
          rules={{
            required: t('ledger.validation.required'),
            pattern: {
              value: /^[0-9]+$/,
              message: t('ledger.validation.onlyNumbers'),
            },
            validate: value =>
              Number(value) > 0 || t('ledger.validation.positiveNumber'),
          }}
          render={({field: {onChange, value}}) => (
            <StockInput
              value={value}
              onChange={onChange}
              style={errors.stock && styles.inputError}
            />
          )}
        />
        {errors.stock && (
          <Text style={styles.errorText}>{errors.stock.message}</Text>
        )}

        {/* Unit Picker */}
        <Text style={styles.label}>{t('ledger.unit')}</Text>
        <TouchableOpacity
          disabled={isEdit}
          style={[styles.input, errors.satuan && styles.inputError]}
          onPress={() => setShowSatuanPicker(true)}>
          <Text style={{fontSize: 16, color: '#333'}}>
            {watch('satuan') || t('ledger.selectUnit')}
          </Text>
          <Icon name="chevron-down" size={20} color="#888" />
        </TouchableOpacity>
        {errors.satuan && (
          <Text style={styles.errorText}>{errors.satuan.message}</Text>
        )}

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.button, !isValid && styles.buttonDisabled]}
          onPress={handleSubmit(onSubmit)}
          disabled={!isValid}>
          {/* <Text style={styles.buttonText}>{t('ledger.submit')}</Text> */}
          <Text style={styles.buttonText}>
            {isEdit ? t('ledger.update') : t('ledger.submit')}
          </Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>

      {/* Modal Picker */}
      <Modal visible={showSatuanPicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {satuanOptions.map(option => (
              <TouchableOpacity
                key={option}
                onPress={() => {
                  setValue('satuan', option, {shouldValidate: true});
                  setShowSatuanPicker(false);
                }}
                style={styles.modalOption}>
                <Text style={styles.modalOptionText}>{t(option)}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setShowSatuanPicker(false)}>
              <Text style={styles.modalCancel}>{t('plan.cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {flex: 1, backgroundColor: '#FFFFFFFF'},
  scrollContent: {
    padding: 24,
    paddingBottom: 100,
    flexGrow: 1,
  },
  field: {marginBottom: 16},
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
    color: '#1F2937',
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    marginTop: 4,
    fontSize: 14,
  },
  button: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonDisabled: {
    backgroundColor: '#93C5FD',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalOption: {
    paddingVertical: 14,
  },
  modalOptionText: {
    fontSize: 18,
    color: '#1F2937',
  },
  modalCancel: {
    textAlign: 'center',
    marginTop: 12,
    fontSize: 16,
    color: '#3B82F6',
  },
});
