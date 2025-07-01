import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
  Modal,
  Alert,
} from 'react-native';
import Share from 'react-native-share';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import dayjs, {Dayjs} from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Calendar, {EventData} from '../components/OwnCalendar';
import TransactionList from '../components/TransactionList';
import LinearProgressBar from '../components/LinearProgress';
import {useCurrency} from '../context/CurrencyContext';
import {useTransactionsByCreatedDate} from '../hooks/useTransactionCreatedAt';
import {formatCurrency} from '../lib/currency_formatter';
import FontFamily from '../assets/typography';
import Icon from '@react-native-vector-icons/ionicons';
// import {generateDailyIncomeHtml} from '../utils/generateHtmlIncome';
import {generateDailyActivityHtml} from '../utils/generateIncomeDebt';
import {useTransactions} from '../hooks/useGetTransactions';

dayjs.extend(customParseFormat);

const SEGMENTS = [30, 60, 90, 120, 240];
const RANK_ICONS = [
  require('../assets/badge/Badge_01.png'),
  require('../assets/badge/Badge_02.png'),
  require('../assets/badge/Badge_03.png'),
  require('../assets/badge/Badge_04.png'),
  require('../assets/badge/Badge_05.png'),
];

import Netinfo from '@react-native-community/netinfo';

const Report = () => {
  const [loading, setLoading] = React.useState(false);
  const {t} = useTranslation();
  const today = dayjs();
  const [selectedDate, setSelectedDate] = useState<Dayjs>(today);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  useEffect(() => {
    const unsubscribe = Netinfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  const {locale, currencyCode} = useCurrency();

  const {transactions, refresh: refreshByDate} =
    useTransactionsByCreatedDate(selectedDate);
  const {transactions: listTrans, refresh: refreshAllTrans} = useTransactions();

  useFocusEffect(
    useCallback(() => {
      refreshByDate?.();
      refreshAllTrans?.();
    }, [refreshByDate, refreshAllTrans]),
  );

  const uniqueDatesListAllTrans = useMemo(
    () => [...new Set(listTrans.map(tx => tx.date))],
    [listTrans],
  );

  const uniqueDates = useMemo(
    () => [...new Set(transactions.map(tx => tx.date))],
    [transactions],
  );

  const {totalIncome, totalExpense} = useMemo(() => {
    return transactions.reduce(
      (acc, tx) => {
        const amount = parseFloat(tx.amount || '0');
        tx.type === 'income'
          ? (acc.totalIncome += amount)
          : (acc.totalExpense += amount);
        return acc;
      },
      {totalIncome: 0, totalExpense: 0},
    );
  }, [transactions]);

  const nav = useNavigation();
  const eventDataForSelectedDate = useMemo<Record<string, EventData[]>>(() => {
    if (!selectedDate || transactions.length === 0) return {};
    const dateKey = selectedDate.format('DD/MM/YYYY');

    return {
      [dateKey]: transactions.map(tx => ({
        title: tx.title || tx.note || `${tx.category} (${tx.amount})`,
        status: tx.type === 'income' ? 'done' : 'pending',
      })),
    };
  }, [transactions, selectedDate]);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} />
      <ScrollView>
        <Text style={styles.header}>{t('checkin')}</Text>
        <LinearProgressBar
          progress={uniqueDatesListAllTrans.length}
          segments={SEGMENTS}
          rankIcons={RANK_ICONS}
          activeColor="#00cc99"
          inactiveColor="#ddd"
          iconSize={24}
        />
        <Calendar
          events={eventDataForSelectedDate}
          onDateSelect={setSelectedDate}
        />
        <TouchableOpacity
          style={styles.sectionRight}
          onPress={() => nav.navigate('InsightScreen')}>
          <Text style={styles.sectionTitleRight}>
            {t('insightMonthly.title')}
          </Text>
          <Icon name="chevron-forward" size={20} color="#727272FF" />
        </TouchableOpacity>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t('filter.transaction_on')} {selectedDate.format('DD MMM YYYY')}
          </Text>
        </View>
        <View style={styles.summaryContainer}>
          <SummaryCard
            label={t('total_income_today')}
            amount={formatCurrency(totalIncome, locale, currencyCode)}
            bgColor="#e0f7f1"
            textColor="#00b894"
          />
          <SummaryCard
            label={t('total_expense_today')}
            amount={formatCurrency(totalExpense, locale, currencyCode)}
            bgColor="#ffeaea"
            textColor="#d63031"
          />
        </View>

        {transactions.length > 0 && (
          <Pressable
            onPress={async () => {
              if (!isConnected) {
                Alert.alert(
                  t('network_error_title') || 'No Internet Connection',
                  t('network_error_message') ||
                    'Please check your connection and try again.',
                );
                return;
              }

              try {
                setLoading(true);

                const html = await generateDailyActivityHtml({
                  date: dayjs().format('DD MMMM YYYY'),
                  list: transactions || [],
                  locale,
                  currencyCode,
                  t,
                  totalIncome,
                  totalExpense,
                });

                const options = {
                  html,
                  fileName:
                    t('receipt.DailyIncomeRecap') +
                    dayjs().format('DDMMYYYY') +
                    'eps' +
                    Math.floor(Date.now() / 1000).toString(),
                  directory: 'Documents',
                };

                const file = await RNHTMLtoPDF.convert(options);
                if (file.filePath) {
                  await Share.open({
                    url: `file://${file.filePath}`,
                    type: 'application/pdf',
                    title: t('receipt.DailyIncomeRecapTitle'),
                  });
                }
              } catch (err) {
                console.log('Export error:', err);
              } finally {
                setLoading(false);
              }
            }}
            style={({pressed}) => [
              styles.downloadButton,

              pressed && {opacity: 0.85, transform: [{scale: 0.98}]},
            ]}>
            <Text style={styles.downloadButtonText}>{t('downloadPDF')}</Text>
          </Pressable>
        )}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t('receipt.activityDetails')}
          </Text>
        </View>
        <TransactionList transactions={transactions} />
        <Modal visible={loading} transparent animationType="fade">
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.3)',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                padding: 20,
                backgroundColor: 'white',
                borderRadius: 12,
              }}>
              <ActivityIndicator size="large" color="#3478F6" />
              <Text style={{marginTop: 10, fontFamily: FontFamily.ROKKIT_BOLD}}>
                {t('generating') || 'Generating PDF...'}
              </Text>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
};

export const SummaryCard = ({
  label,
  amount,
  bgColor,
  textColor,
}: {
  label: string;
  amount: string;
  bgColor: string;
  textColor: string;
}) => (
  <View style={[styles.summaryCard, {backgroundColor: bgColor}]}>
    <Text style={styles.summaryLabel}>{label}</Text>
    <Text style={[styles.summaryAmount, {color: textColor}]}>{amount}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: 'white'},
  safeArea: {paddingBottom: 10},
  header: {
    fontFamily: FontFamily.ROKKIT_BOLD,
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 8,
  },
  sectionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    marginTop: 16,
    gap: 6, // or use marginLeft in Text for spacing
  },

  sectionTitleRight: {
    fontSize: 20,
    fontWeight: '600',
    fontFamily: FontFamily.ROKKIT_BOLD,
    marginVertical: 8,
    color: '#727272FF',
  },
  section: {paddingHorizontal: 16},
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: FontFamily.ROKKIT_BOLD,
    marginVertical: 8,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 12,
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#2d3436',
    fontFamily: FontFamily.ROKKIT_BOLD,
  },
  summaryAmount: {
    fontSize: 14,
    fontFamily: FontFamily.ROKKIT_BOLD,
    marginTop: 4,
  },
  downloadButton: {
    backgroundColor: '#6890DFFF',
    marginHorizontal: 16,
    marginTop: 12,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  disabledDownloadButton: {
    backgroundColor: '#CACACAFF',
    marginHorizontal: 16,
    marginTop: 12,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  downloadButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: FontFamily.ROKKIT_BOLD,
  },
});

export default Report;
