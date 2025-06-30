import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
  Platform,
} from 'react-native';
import {useForm, FormProvider} from 'react-hook-form';
import CalculatorField from './CalculatorInput';
import PageHeader from './PageHeader';
import {BotAssistant, BotAssistantRef} from './NobiPopUp';
import {useNavigation, useRoute} from '@react-navigation/native';
import {CalendarModal, CalendarModalRef} from './CalendarModal';
import dayjs from 'dayjs';
import {insertPlan} from '../lib/init';
import {useTranslation} from 'react-i18next';
import {useGoBackTwiceAndNavigate} from '../hooks/useGoBackTwice';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

export type AddTransactionScreenProps = {
  type: string;
};
export default function CreatePlan() {
  const route = useRoute();

  const amountProps = route?.params?.amount;
  const form = useForm({
    defaultValues: {
      title: '',
      amount: amountProps ? amountProps : '',
      note: '',
      calendarValue: null,
    },
  });
  const [loading, setLoading] = useState(false);

  const botRef = useRef<BotAssistantRef>(null);
  const [calendarView, setCalendarView] = useState<
    'one day' | 'daily' | 'monthly' | 'yearly' | ''
  >('');
  const [showViewPicker, setShowViewPicker] = useState(false);
  const goBackTwiceAndNavigate = useGoBackTwiceAndNavigate();
  const nav = useNavigation();
  const onSubmit = form.handleSubmit(async data => {
    setLoading(true);
    try {
      const startDate = new Date(data.calendarValue?.startDate);
      const endDate = new Date(data.calendarValue?.endDate);
      const diffInMs = endDate.getTime() - startDate.getTime();
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24)) + 1;
      const dividedAmount = Number(data.amount) / diffInDays;

      const response = await insertPlan(
        data.title,
        dividedAmount,
        startDate.toString(),
        endDate.toString(),
        data.note,
      );

      if (response) {
        botRef.current?.openPopup();
        setTimeout(() => {
          if (amountProps) {
            goBackTwiceAndNavigate('Plan');
          } else {
            nav.goBack();
          }
        }, 3000);
      }
    } catch (error) {
      console.log(error);
    } finally {
      botRef.current?.closePopup();
      setTimeout(() => {
        setLoading(false);
      }, 3000);
    }
  });

  const {title, amount} = form.watch();
  const selectedDate = form.watch('calendarValue');
  const isFormValid =
    title?.trim() && selectedDate?.startDate && amount?.trim();
  const calendarRef = useRef<CalendarModalRef>(null);

  const {t} = useTranslation();

  return (
    <FormProvider {...form}>
      <PageHeader title={t('createPlan.question')} />
      <View style={{height: 100, backgroundColor: 'white'}} />
      <BotAssistant
        ref={botRef}
        content={t('createPlan.botMessage')}
        propHeight={Dimensions.get('window').height * 0.075}
        propWidth={30}
      />
      <KeyboardAwareScrollView
        contentContainerStyle={{
          padding: 24,
          paddingBottom: 150,
          flexGrow: 1,
          backgroundColor: '#FFFFFF',
        }}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        extraScrollHeight={Platform.OS === 'android' ? 100 : 120}>
        <Text style={styles.label}>{t('createPlan.title')}</Text>
        <TextInput
          placeholderTextColor={'grey'}
          style={styles.input}
          placeholder={t('createPlan.placeholderTitle')}
          onChangeText={text => form.setValue('title', text)}
          defaultValue={form.getValues('title')}
        />
        <Text style={styles.label}>{t('createPlan.amount')}</Text>
        <CalculatorField
          isDisabled={amountProps !== undefined}
          name="amount"
          placeholder={t('createPlan.placeholderAmount')}
          style={[
            styles.input,
            !form.watch('amount')?.trim() && styles.placeholderText,
          ]}
        />
        <Text style={styles.label}>{t('createPlan.calendarType')}</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowViewPicker(true)}>
          <Text
            style={{
              fontSize: 16,
              color: calendarView.length == 0 ? '#C1BABAFF' : '#333',
            }}>
            {calendarView.length === 0
              ? t('createPlan.range')
              : t(`createPlan.calendarOptions.${calendarView}`)}
          </Text>
        </TouchableOpacity>

        <CalendarModal
          title={
            calendarView === 'one day'
              ? t('selectDate')
              : calendarView === 'daily'
              ? t('selectDateStartEndDate')
              : t('selectDateStart')
          }
          ref={calendarRef}
          mode={calendarView === 'one day' ? 'single' : 'range'}
          rangeType={calendarView.toLowerCase()}
          btnCloseLabel={t('close')}
          onChange={val => {
            const response =
              calendarView === 'one day'
                ? {
                    startDate: val,
                    endDate: val,
                  }
                : {val};
            form.setValue(
              'calendarValue',
              calendarView === 'one day' ? response : val,
            );
          }}
        />
        {selectedDate?.startDate && selectedDate?.endDate && (
          <View>
            <Text style={styles.label}>{t('createPlan.dates')}</Text>
            <TouchableOpacity
              style={[styles.input, !selectedDate && styles.placeholderText]}
              onPress={() => {
                setShowViewPicker(true);
              }}>
              <Text style={{fontSize: 16, color: '#333'}}>
                {dayjs(selectedDate?.startDate).format('DD MMM YYYY')} -{' '}
                {dayjs(selectedDate?.endDate).format('DD MMM YYYY')}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Note */}
        <Text style={styles.label}>{t('createPlan.note')}</Text>
        <TextInput
          style={[styles.input, styles.noteInput]}
          placeholder={t('createPlan.placeholderNote')}
          multiline
          placeholderTextColor={'grey'}
          numberOfLines={3}
          maxLength={150}
          onChangeText={text => form.setValue('note', text)}
          defaultValue={form.getValues('note')}
        />
        <TouchableOpacity
          style={[
            styles.button,
            (!isFormValid || loading) && styles.buttonDisabled,
          ]}
          onPress={onSubmit}
          disabled={!isFormValid || loading}>
          <Text style={styles.buttonText}>{t('createPlan.save')}</Text>
        </TouchableOpacity>

        <Modal visible={showViewPicker} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              {['one day', 'monthly', 'yearly', 'daily'].map(option => (
                <TouchableOpacity
                  key={option}
                  onPress={() => {
                    setCalendarView(
                      option as 'one day' | 'daily' | 'monthly' | 'yearly',
                    );
                    setShowViewPicker(false);
                    calendarRef.current?.open();
                  }}
                  style={styles.modalOption}>
                  <Text style={styles.modalOptionText}>
                    {t(`createPlan.calendarOptions.${option}`)}
                  </Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity onPress={() => setShowViewPicker(false)}>
                <Text style={styles.modalCancel}>
                  {t('createPlan.calendarOptions.cancel')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </KeyboardAwareScrollView>
    </FormProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingBottom: 100,
    backgroundColor: '#fff',
    flex: 1,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalOption: {
    paddingVertical: 12,
  },
  modalOptionText: {
    fontSize: 18,
    color: 'black',
  },
  modalCancel: {
    fontSize: 16,
    color: '#007AFF',
    textAlign: 'center',
    marginTop: 12,
  },
  image: {
    width: 120,
    height: 60,
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
