import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  Platform,
  Dimensions,
} from 'react-native';
import {useForm, FormProvider} from 'react-hook-form';
import BottomSheetPicker from '../components/BottomSheetPicker';
import CalculatorField from '../components/CalculatorInput';
import PageHeader from './PageHeader';
import {BotAssistant, BotAssistantRef} from './NobiPopUp';

// Import the hook to get categories
import {useCategories} from '../hooks/useCategories';
import {StackActions, useNavigation} from '@react-navigation/native';
import {insertTransaction} from '../lib/schema';
import {useTranslation} from 'react-i18next';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Button from './Button';

import dayjs from 'dayjs';

import {insertCategory, insertSubCategory} from '../lib/init';
import AddItemModal from './AddCategoryModal';
import {useRateApp} from '../hooks/useRateApp';

export type AddTransactionScreenProps = {
  type: string;
  amountProps?: string;
};
export default function AddTransactionScreen({
  type,
  amountProps,
}: AddTransactionScreenProps) {
  const form = useForm({
    defaultValues: {
      title: '',
      category: '',
      subCategory: '',
      amount: amountProps ? amountProps : '',
      note: '',
    },
  });

  const botRef = useRef<BotAssistantRef>(null);

  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useCategories();

  const nav = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const onSubmit = form.handleSubmit(async data => {
    try {
      setIsLoading(true);

      const todayFormatted = dayjs().format('DD/MM/YYYY');
      const response = await insertTransaction({
        title: data.title,
        categoryId: '11',
        type: type,
        amount: data.amount ?? '0',
        date: todayFormatted,
        category: data.category,
        subcategory: data.subCategory,
        note: data.note,
      });
      if (response) {
        botRef.current?.openPopup();
        setTimeout(() => {
          if (amount) {
            nav.dispatch(StackActions.pop(2));
          } else {
            nav.goBack();
          }

          setIsLoading(false);
        }, 3000);
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    } finally {
      botRef.current?.closePopup();
      if (!hasRated) {
        await requestReview().then(res => console.log('res', res));
      }
    }
  });
  const {t} = useTranslation();
  const {title, category, subCategory, amount} = form.watch();

  const isFormValid =
    title?.trim() &&
    amount?.trim() &&
    category?.trim() &&
    category !== t('transaction-category.addNewCategory') &&
    subCategory?.trim() &&
    subCategory !== t('transaction-category.addNewSubCategory');

  const categoryOptions = [
    ...categories.filter(i => i.type === type).map(cat => cat.name),
    t('transaction-category.addNewCategory'),
  ];
  const categoryIcon = categories
    .filter(i => i.type === type)
    .map(cat => cat.icon);

  const selectedCategory = form.watch('category');

  const subCategoryOptions = useMemo(() => {
    const match = categories.find(cat => cat.name === selectedCategory);
    return [
      ...(match?.subCategories ?? []),
      t('transaction-category.addNewSubCategory'),
    ];
  }, [selectedCategory, categories]);
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);

  const [showNewSubCategoryInput, setShowNewSubCategoryInput] = useState(false);

  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showAddSubCategoryModal, setShowAddSubCategoryModal] = useState(false);
  const {hasRated, requestReview} = useRateApp();

  useEffect(() => {
    if (category === t('transaction-category.addNewCategory')) {
      setShowAddCategoryModal(true);
      form.setValue('category', '');
      form.setValue('subCategory', '');
    }
  }, [category, form, t]);

  useEffect(() => {
    if (subCategory === t('transaction-category.addNewSubCategory')) {
      setShowAddSubCategoryModal(true);
      form.setValue('subCategory', '');
    }
  }, [form, subCategory, t]);

  const handleAddCategory = async (name: string) => {
    await insertCategory(name, type, 'cube-outline'); // You can allow icon selection later
    setShowAddCategoryModal(false);
    form.setValue('category', name);
  };

  const handleAddSubCategory = async (name: string) => {
    await insertSubCategory(form.watch('category'), name);
    setShowAddSubCategoryModal(false);
    form.setValue('subCategory', name);
  };
  const height = Dimensions.get('screen').height;

  return (
    <FormProvider {...form}>
      <PageHeader title={t(`home.popUp.${type}`)} />

      <KeyboardAwareScrollView
        contentContainerStyle={{
          padding: 24,
          paddingBottom: Platform.OS === 'android' ? height / 4 : 100,
          flexGrow: 1,
          backgroundColor: '#FFFFFF',
        }}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        extraScrollHeight={Platform.OS === 'android' ? 100 : 120}>
        <View style={{alignSelf: 'center'}}></View>
        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            source={require('../assets/chart.png')}
            resizeMode="cover"
          />
        </View>

        <Text style={styles.label}>{t('transaction.title')}</Text>
        <TextInput
          style={styles.input}
          placeholder={t('transaction.placeholderTitle')}
          onChangeText={text => form.setValue('title', text)}
          defaultValue={form.getValues('title')}
          placeholderTextColor={'#D5D3D3FF'}
        />
        <AddItemModal
          visible={showAddCategoryModal}
          title={t('transaction-category.addNewCategory')}
          placeholder={t('transaction-category.enterNewCategory')}
          onCancel={() => setShowAddCategoryModal(false)}
          onSave={handleAddCategory}
        />

        <AddItemModal
          visible={showAddSubCategoryModal}
          title={t('transaction-category.addNewSubCategory')}
          placeholder={t('transaction-category.enterNewSubCategory')}
          onCancel={() => setShowAddSubCategoryModal(false)}
          onSave={handleAddSubCategory}
        />

        {showNewCategoryInput && (
          <View style={{marginBottom: 20}}>
            <TextInput
              style={styles.input}
              placeholder={t('transaction-category.enterNewCategory')}
              onSubmitEditing={async e => {
                const name = e.nativeEvent.text.trim();
                if (!name) return;
                await insertCategory(name, type, '📁');
                setShowNewCategoryInput(false);
                form.setValue('category', name);
              }}
            />
          </View>
        )}

        {showNewSubCategoryInput && (
          <View style={{marginBottom: 20}}>
            <TextInput
              style={styles.input}
              placeholder={t('transaction-category.addNewSubCategory')}
              onSubmitEditing={async e => {
                const name = e.nativeEvent.text.trim();
                if (!name) return;
                await insertSubCategory(selectedCategory, name);
                setShowNewSubCategoryInput(false);
                form.setValue('subCategory', name);
              }}
            />
          </View>
        )}

        <BottomSheetPicker
          name="category"
          label={t('transaction.category')}
          options={categoryOptions}
          disabled={categoriesLoading || !!categoriesError}
          placeHolder={t('select')}
          icons={categoryIcon}
        />

        <BottomSheetPicker
          name="subCategory"
          label={t('transaction.subCategory')}
          options={subCategoryOptions}
          placeHolder={t('select')}
        />

        <Text style={styles.label}>{t('transaction.amount')}</Text>
        <CalculatorField
          isDisabled={amountProps !== undefined}
          name="amount"
          placeholder={t('transaction.placeholderAmount')}
          style={[
            styles.input,
            !form.watch('amount')?.trim() && styles.placeholderText,
          ]}
        />

        <Text style={styles.label}>{t('transaction.note')}</Text>
        <TextInput
          style={[styles.input, styles.noteInput]}
          placeholder={t('transaction.placeholderNote')}
          multiline
          numberOfLines={3}
          maxLength={100}
          placeholderTextColor={'#D5D3D3FF'}
          onChangeText={text => form.setValue('note', text)}
          defaultValue={form.getValues('note')}
        />

        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <Button
            label={t('transaction.save')}
            onPress={onSubmit}
            disabled={isLoading || !isFormValid}
          />
        </View>
      </KeyboardAwareScrollView>

      <BotAssistant
        ref={botRef}
        propWidth={-130}
        propHeight={-120}
        content={
          type === 'expense'
            ? t('transaction.botMessage')
            : t('transaction.botMessageIncome')
        }
      />
    </FormProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingBottom: 100,
    backgroundColor: '#ffFFFf',
    marginBottom: 100,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  image: {
    width: 200,
    height: 160,
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
    paddingHorizontal: 20,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 0.8,
    borderColor: '#D2D2D2FF',
    color: 'black',
  },
  noteInput: {
    height: 90,
    textAlignVertical: 'top',
    color: 'black',
  },
  disabledField: {
    backgroundColor: '#F5F6F8',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    justifyContent: 'center',
    marginBottom: 20,
    borderColor: '#D2D2D2FF',
    borderWidth: 0.8,
  },
  disabledFieldText: {
    color: '#000', // Black for valid input
  },

  placeholderText: {
    color: '#999', // Grey for placeholder
  },
  button: {
    backgroundColor: '#3478F6',
    paddingVertical: 16,
    borderRadius: 999,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  buttonDisabled: {
    backgroundColor: '#3478F6', // Greyed out when disabled
    opacity: 0.4,
  },
});
