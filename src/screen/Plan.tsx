import React, {useState, useMemo, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Modal,
  Image,
  Alert,
  ToastAndroid,
} from 'react-native';
import PageHeader from '../components/PageHeader';
import Calendar from '../components/OwnCalendar';
import {useGetAllPlans} from '../hooks/useGetPlans';
import {useMemoEvents} from '../hooks/useMemoEvents';
import dayjs from 'dayjs';
import Ionicons from '@react-native-vector-icons/ionicons';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {usePlansByDate, usePlansByDateAll} from '../hooks/useGetPlanByDate';
import PlanList from '../components/PlanList';
import {insertPlanByDate} from '../lib/init';
import {useTranslation} from 'react-i18next';
import FontFamily from '../assets/typography';
import CalculatorBottomSheet, {
  CalculatorSheetRef,
} from '../components/CalculatorBottomSheet';
import {formatCurrency} from '../lib/currency_formatter';
import {useCurrency} from '../context/CurrencyContext';
import {ConfirmationModal} from '../components/ConfirmationModal';
import {insertTransaction} from '../lib/schema';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';

// Define plan type for modal confirmation
type PlanType = {
  id: string;
  title: string;
  amount: number;
};

const Plan = () => {
  const navigation = useNavigation();

  const {plans, loading, error, refetch} = useGetAllPlans();
  const [selectedDate, setSelectedDate] = useState<string>(
    dayjs().format('YYYY-MM-DD'),
  );

  const {
    plans: planHasDone,
    loading: loadingByPlan,
    error: errorByPlan,
    refetch: refetchByPlan,
  } = usePlansByDate(selectedDate);
  const {
    plans: planAll,
    loading: _,
    error: _____,
    refetch: refetchAllPlan,
  } = usePlansByDateAll();

  const [modalVisible, setModalVisible] = useState(false);
  const [planToConfirm, setPlanToConfirm] = useState<PlanType | null>(null);

  const eventsByDate = useMemoEvents(plans);
  const selectedPlans = useMemo(() => {
    return [...(eventsByDate[selectedDate] || [])].sort((a, b) => b.id - a.id);
  }, [selectedDate, eventsByDate]);

  const openConfirmationModal = (plan: PlanType) => {
    setPlanToConfirm(plan);
    setModalVisible(true);
  };

  const {currencyCode, locale} = useCurrency();
  const {t} = useTranslation();
  const [value, setValue] = useState('');
  const [errorMessage, setErrorMessage] = useState(false);
  const calculatorRef = useRef<CalculatorSheetRef>(null);
  const confirmMarkDone = async () => {
    calculatorRef.current?.open();
    setModalVisible(false);
  };
  const submit = async () => {
    if (!planToConfirm) return;

    setModalVisible(false);

    try {
      const res = await insertPlanByDate({
        idParent: planToConfirm.id,
        date: selectedDate,
        title: planToConfirm.title,
        amount: planToConfirm.amount,
      });

      if (res) {
        const todayFormatted = dayjs().format('DD/MM/YYYY');
        const transactionPayload = {
          title: planToConfirm.title,
          categoryId: '11',
          type: 'expense',
          amount: planToConfirm.amount?.toString() ?? '0',
          date: todayFormatted,
          category: 'Shopping',
          subcategory: 'Others',
          note: '',
        };

        await insertTransaction(transactionPayload);
        refetch();
        refetchByPlan();
        refetchAllPlan();
      }
    } catch (err) {
      Alert.alert(err?.toString());
    }
  };
  const submitOnly = async () => {
    if (!planToConfirm) return;

    setModalVisible(false);

    try {
      const res = await insertPlanByDate({
        idParent: planToConfirm.id,
        date: selectedDate,
        title: planToConfirm.title,
        amount: planToConfirm.amount,
      });

      if (res) {
        const todayFormatted = dayjs().format('DD/MM/YYYY');
        const transactionPayload = {
          title: planToConfirm.title,
          categoryId: '11',
          type: 'expense',
          amount: planToConfirm.amount?.toString() ?? '0',
          date: todayFormatted,
          category: 'Shopping',
          subcategory: 'Others',
          note: '',
        };

        refetch();
        refetchByPlan();
        refetchAllPlan();
      }
    } catch (err) {
      Alert.alert(err?.toString());
    }
  };
  const insets = useSafeAreaInsets();

  useFocusEffect(
    React.useCallback(() => {
      refetch();
      refetchByPlan();
      refetchAllPlan();
    }, []),
  );
  const [showModal, setShowModal] = useState(false);
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>{t('plan.loading')}</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{color: 'red'}}>{t('plan.error')}</Text>
      </View>
    );
  }
  const updatedEvents = Object.fromEntries(
    Object.entries(eventsByDate).map(([date, items]) => [
      date,
      (items ?? []).map(item => {
        const hasMatchingPlan = planAll.some(
          plan => plan.date === date && plan.idParent === item.id,
        );
        return {
          ...item,
          status: hasMatchingPlan,
        };
      }),
    ]),
  );

  return (
    <SafeAreaView style={styles.container}>
      <PageHeader title={t('plan.title')} />

      <ScrollView
        style={styles.container}
        contentContainerStyle={{paddingBottom: 40}}>
        <Calendar
          events={updatedEvents}
          onDateSelect={date => {
            setSelectedDate(dayjs(date).format('YYYY-MM-DD'));
          }}
        />

        {selectedDate && (
          <View style={styles.eventListContainer}>
            <Text style={styles.dateLabel}>
              {t('plan.yourPlans')}
              {dayjs(selectedDate).format('D MMM YYYY')}:
            </Text>

            {/* {planHasDone.length !== 0 && ( */}
            <PlanList
              plans={selectedPlans}
              selectedDate={selectedDate}
              planHasDoneList={planHasDone?.map(i => ({
                id: i.idParent,
                date: i.date,
                amount: i.amount,
              }))}
              onPressCheckMark={openConfirmationModal}
            />
            {/* )} */}
          </View>
        )}
      </ScrollView>
      <ConfirmationModal
        visible={showModal}
        title={t('debts.confirmation_message_title')}
        message={t('reduce_money')}
        cancelLabel={t('nowaller')}
        acceptLabel={t('debts.confirm')}
        onClose={() => {
          setShowModal(false);
        }}
        onConfirm={async () => {
          await submit();
          setShowModal(false);
        }}
        onCancel={async () => {
          await submitOnly();
          calculatorRef.current?.open();
          setShowModal(false);
        }}
      />
      {planToConfirm && (
        <CalculatorBottomSheet
          total={formatCurrency(planToConfirm.amount, locale, currencyCode)}
          ref={calculatorRef}
          onSubmit={val => {
            if (
              val.toString() !== planToConfirm?.amount.toFixed(0).toString()
            ) {
              setValue(val);
              ToastAndroid.show(t('nominalDoesntMatch'), ToastAndroid.LONG);
            } else {
              setValue(val);
              setShowModal(true);
              // setModalVisible(false);
            }
          }}
        />
      )}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{t('plan.confirmationTitle')}</Text>
            <Text style={styles.modalMessage}>
              {t('plan.confirmationMessage')}
            </Text>

            <View style={styles.modalButtonRow}>
              <Pressable
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.modalButtonText}>{t('plan.cancel')}</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.modalOkButton]}
                onPress={confirmMarkDone}>
                <Text style={[styles.modalButtonText, {color: 'white'}]}>
                  {t('debts.confirm')}
                </Text>
              </Pressable>
            </View>
          </View>
          <Image
            source={require('../assets/onboard/robot.png')}
            style={{height: 120, width: 120}}
          />
        </View>
      </Modal>

      <TouchableOpacity
        style={[
          {marginBottom: insets.bottom > 25 ? insets.bottom - 10 : 0},
          styles.fab,
          ,
        ]}
        onPress={() => navigation.navigate('CreatePlan')}>
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: 'white'},
  center: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  eventListContainer: {paddingHorizontal: 16, paddingTop: 12},
  dateLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
    fontFamily: FontFamily.ROKKIT_BOLD,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  modalCancelButton: {
    backgroundColor: '#ddd',
  },
  modalOkButton: {
    backgroundColor: '#007bff',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Plan;
