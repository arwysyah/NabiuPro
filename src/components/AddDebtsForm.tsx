import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  Platform,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {useForm, FormProvider} from 'react-hook-form';
import BottomSheetPicker from '../components/BottomSheetPicker';
import CalculatorField from '../components/CalculatorInput';
import PageHeader from './PageHeader';
import {BotAssistant, BotAssistantRef} from './NobiPopUp';

import {StackActions, useNavigation} from '@react-navigation/native';

import {useTranslation} from 'react-i18next';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Button from './Button';

import {CalendarModal, CalendarModalRef} from './CalendarModal';
import dayjs from 'dayjs';
import {insertDebtOrReceivable, insertTransaction} from '../lib/schema';

export type AddTransactionScreenProps = {
  type: string;
  amountProps?: string;
};
export default function AddDebtsOrReceivable({
  type,
  amountProps,
}: AddTransactionScreenProps) {
  const calendarRef = useRef<CalendarModalRef>(null);
  const form = useForm({
    defaultValues: {
      title: '',
      date: '',
      fromTo: '',
      amount: amountProps ? amountProps : '',
      note: '',
    },
  });

  const botRef = useRef<BotAssistantRef>(null);

  const nav = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const onSubmit = form.handleSubmit(async data => {
    try {
      setIsLoading(true);
      const todayFormatted = dayjs().format('DD/MM/YYYY');
      const response = await insertDebtOrReceivable({
        title: data.title,
        date: new Date(date).toString(),
        type: type,
        amount: data.amount ?? '0',
        fromTo: t('toFrom.' + data.fromTo),
        note: data.note,
      });
      if (response) {
        if (type !== 'debt') {
          const transactionPayload = {
            title: data.title,

            categoryId: '11',
            type: 'expense',
            amount: data.amount?.toString() ?? '0',
            date: todayFormatted,
            category: 'Loan Repayment',
            subcategory: 'Personal Loan',
            note: data.note,
          };
          await insertTransaction(transactionPayload);
        }
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
    } finally {
      botRef.current?.closePopup();
    }
  });

  const {title, date, fromTo, amount} = form.watch();

  const {t} = useTranslation();
  const fromToOptions = [
    'Family',
    'Friends',
    'Coworkers',
    'Clients',
    'Partners',
    'Neighbors',
    'Classmates',
    'Mentors',
    'Online Friends',
  ];
  const isFormValid =
    title.length > 0 &&
    date?.toString().length > 0 &&
    fromTo.length > 0 &&
    amount.length > 0;
  //   console.log(title.length, 'ss', date.toString().length);

  return (
    <FormProvider {...form}>
      <PageHeader title={t(`home.popUp.${type}`)} />

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
        enableOnAndroid={true}
        extraScrollHeight={Platform.OS === 'android' ? 100 : 120}>
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

        <BottomSheetPicker
          name="fromTo"
          label={type == 'debt' ? t('to') : t('from')}
          options={fromToOptions.map(i => t('fromTo.' + i))}
          //   disabled={categoriesLoading || !!categoriesError}
          placeHolder={t('select')}
          //   icons={categoryIcon}
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
        <CalendarModal
          title={t('selectDate')}
          ref={calendarRef}
          mode={'single'}
          rangeType={'daily'}
          onChange={val => {
            form.setValue('date', val);
          }}
          btnCloseLabel={t('close')}
        />

        <View>
          <Text style={styles.label}>{t('deadline')}</Text>
          <TouchableOpacity
            onPress={() => {
              calendarRef.current?.open();
            }}
            style={[styles.input, !date && styles.placeholderText]}>
            {date ? (
              <Text style={{fontSize: 16, color: '#333'}}>
                {dayjs(date).format('DD MMM YYYY')}
              </Text>
            ) : (
              <Text style={{fontSize: 16, color: '#D5D3D3FF'}}>
                {t('selectDate')}
              </Text>
            )}
          </TouchableOpacity>
        </View>

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
            disabled={!isFormValid}
          />
        </View>
      </KeyboardAwareScrollView>

      <BotAssistant
        ref={botRef}
        propWidth={-130}
        propHeight={-120}
        content={
          type === 'debt'
            ? t('createPlan.botMessageDebt')
            : t('createPlan.botMessageReceivable')
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
