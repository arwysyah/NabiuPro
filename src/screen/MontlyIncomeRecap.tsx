import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Modal,
  Alert,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {BarChart} from 'react-native-gifted-charts';
import FontFamily from '../assets/typography';
import PageHeader, {PageHeaderWithoutSafe} from '../components/PageHeader';
import {useCurrency} from '../context/CurrencyContext';
import {formatCurrency} from '../lib/currency_formatter';
import {useMonthlyStoreIncomeItem} from '../hooks/useMonthlyStoreItem';
import dayjs from 'dayjs';
import {useStoreMonthlyIncome} from '../hooks/useStoreIncomeMonthly';
import Share from 'react-native-share';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import {generateMonthlyIncomeHtml} from '../utils/generateMonthlyIncome';

import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import Netinfo from '@react-native-community/netinfo';
const MonthlyIncomeRecap = () => {
  const summary = useStoreMonthlyIncome();
  const [loading, setLoading] = React.useState(false);
  const {list} = useMonthlyStoreIncomeItem();
  const {t, i18n} = useTranslation();
  const {locale, currencyCode} = useCurrency();
  const insets = useSafeAreaInsets();
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  useEffect(() => {
    const unsubscribe = Netinfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => unsubscribe();
  }, []);
  if (!summary) {
    return <Text style={styles.loading}>{t('insight.loading')}</Text>;
  }

  // Group income by month_year
  const incomeByMonth: {[key: string]: number} = {};

  const sortedList = list?.slice().sort((a, b) => {
    return (
      new Date(b.purchase_date).getTime() - new Date(a.purchase_date).getTime()
    );
  });

  let totalCapital = 0;
  // let totalSelling = 0;
  let totalPaid = 0;
  let totalProfit = 0;

  sortedList?.forEach(item => {
    const capital = item.purchase_price * item.stock;
    // const selling = item.selling_price * item.stock;
    const paid = item.totalPaid;
    const profit = paid - capital;

    totalCapital += capital;
    // totalSelling += selling;
    totalPaid += paid;
    totalProfit += profit;

    const key = item.month_year;
    incomeByMonth[key] = (incomeByMonth[key] || 0) + paid;
  });

  const chartData = [
    {
      label: t('ledger.capital'),
      value: totalCapital,
      frontColor: '#FFF2E0',
    },
    {
      label: t('insightMonthly.income'),
      value: totalPaid,

      frontColor: '#42A5F5',
    },
  ];

  const currentLang = i18n.language; // e.g., 'id' or 'en'
  dayjs.locale(currentLang === 'id' ? 'id' : 'en');

  return (
    <SafeAreaView style={styles.container}>
      <PageHeaderWithoutSafe title={t('insightMonthly.title')} />
      <ScrollView
        style={{flex: 1, paddingHorizontal: 20, paddingBottom: 20}}
        contentContainerStyle={{paddingBottom: 10}}>
        <Text style={styles.header}>{t('insightMonthly.summary')}</Text>
        <Text style={styles.period}>{t('insightMonthly.period')}</Text>
        <Text style={styles.header}>{dayjs().format('MMMM YYYY')}</Text>

        <View style={styles.summaryContainer}>
          <SummaryCard
            label={t('ledger.capital')}
            amount={formatCurrency(totalCapital, locale, currencyCode)}
            bgColor="#FFF2E0"
            textColor="#FF9F43"
          />
          <SummaryCard
            label={t('insightMonthly.income')}
            amount={formatCurrency(totalPaid, locale, currencyCode)}
            bgColor="#E3F2FD"
            textColor="#42A5F5"
          />

          <SummaryCard
            label={t('ledger.profit')}
            amount={formatCurrency(totalProfit, locale, currencyCode)}
            bgColor="#e0f8ee"
            textColor={totalProfit < 0 ? '#F35F5FFF' : '#28c76f'}
          />
        </View>

        <Text style={styles.difference}>
          {t('ledger.profit')}:{' '}
          {formatCurrency(totalProfit, locale, currencyCode)}
        </Text>

        {/* Income Chart */}
        <Text style={styles.breakdownTitle}>
          {t('insightMonthly.income_chart')}
        </Text>
        <View style={styles.chartContainer}>
          <BarChart
            data={chartData}
            barWidth={42}
            spacing={30}
            // roundedTop
            hideRules
            yAxisColor="#ccc"
            xAxisLabelTextStyle={{
              color: '#555',
              fontFamily: FontFamily.ROKKIT_BOLD,
            }}
            yAxisTextStyle={{color: '#777', fontFamily: FontFamily.ROKKIT_BOLD}}
            noOfSections={4}
            maxValue={Math.max(...chartData.map(d => d.value), 1000) * 1.2}
          />
        </View>

        {/* Income Breakdown List */}
        <Text style={styles.breakdownTitle}>
          {t('insightMonthly.income_list')}
        </Text>

        {/* Column Headers */}

        {/* Data Rows */}
        {list?.length > 0 && (
          <ScrollView horizontal>
            <View style={styles.tableContainer}>
              {/* Header */}
              <View style={[styles.row, styles.headerRow]}>
                <Text style={[styles.cellDate, styles.headerText]}>
                  {t('ledger.date')}
                </Text>
                <Text style={[styles.cellName, styles.headerText]}>
                  {t('ledger.name')}
                </Text>
                <Text style={[styles.cellStock, styles.headerText]}>
                  {t('ledger.stock')}
                </Text>
                <Text style={[styles.cellPrice, styles.headerText]}>
                  {t('ledger.purchasePrice')}
                </Text>
                <Text style={[styles.cellPrice, styles.headerText]}>
                  {t('ledger.sellingPrice')}
                </Text>

                <Text style={[styles.cellTotal, styles.headerText]}>
                  {t('ledger.total')}
                </Text>
                <Text style={[styles.cellTotalProfit, styles.headerText]}>
                  {t('ledger.totalProfit')}
                </Text>
              </View>

              {/* Data Rows */}
              {sortedList?.map((item, index) => (
                <View
                  key={index}
                  style={[
                    styles.row,
                    index % 2 === 0 ? styles.rowEven : styles.rowOdd,
                  ]}>
                  <Text style={styles.cellDate}>
                    {dayjs(item.purchase_date).format('DD-MM-YYYY')}
                  </Text>
                  <Text style={styles.cellName}>{item.name}</Text>
                  <Text style={styles.cellStock}>{item.stock}</Text>
                  <Text style={styles.cellPrice}>
                    {formatCurrency(item.purchase_price, locale, currencyCode)}
                  </Text>
                  <Text style={styles.cellPrice}>
                    {formatCurrency(item.selling_price, locale, currencyCode)}
                  </Text>
                  <Text style={styles.cellTotal}>
                    {formatCurrency(item.totalPaid, locale, currencyCode)}
                  </Text>
                  <Text style={styles.cellTotalProfit}>
                    {formatCurrency(
                      item.totalPaid - item.purchase_price * item.stock,
                      locale,
                      currencyCode,
                    )}
                  </Text>
                </View>
              ))}
            </View>
          </ScrollView>
        )}
        {list?.length > 0 && (
          <View
            style={{
              alignSelf: 'center',
              padding: 20,
              marginBottom: insets.bottom + 10,
            }}>
            <View>
              <Pressable
                onPress={async () => {
                  try {
                    if (!isConnected) {
                      Alert.alert(
                        t('network_error_title') || 'No Internet Connection',
                        t('network_error_message') ||
                          'Please check your connection and try again.',
                      );
                      return;
                    }
                    setLoading(true);

                    const html = await generateMonthlyIncomeHtml({
                      date: dayjs().format('MMMM YYYY'),
                      list: sortedList || [],
                      locale,
                      currencyCode,
                      totalCapital,
                      totalPaid,
                      totalProfit,
                      t,
                    });

                    const options = {
                      html,
                      fileName:
                        t('receipt.MonthlyIncomeRecap') +
                        dayjs().format('MMM YYYY') +
                        'eps' +
                        Math.floor(Date.now() / 1000).toString(),
                      directory: 'Documents',
                    };

                    const file = await RNHTMLtoPDF.convert(options);
                    if (file.filePath) {
                      await Share.open({
                        url: `file://${file.filePath}`,
                        type: 'application/pdf',
                        title: t('receipt.MonthlyIncomeRecapTitle'),
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
                <Text style={styles.downloadButtonText}>
                  {t('downloadPDF')}
                </Text>
              </Pressable>
            </View>
          </View>
        )}
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
    </SafeAreaView>
  );
};

export default MonthlyIncomeRecap;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFFFF',
  },
  loading: {
    marginTop: 40,
    fontSize: 18,
    textAlign: 'center',
    color: '#888',
    fontFamily: FontFamily.ROKKIT_BOLD,
  },
  header: {
    fontSize: 24,
    marginBottom: 4,
    color: '#333',
    fontFamily: FontFamily.ROKKIT_BOLD,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',

    marginTop: 12,
    gap: 12,
  },
  tableContainer: {
    marginTop: 16,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#F9F9F9',
    borderWidth: 1,
    borderColor: '#DDD',
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  headerRow: {
    backgroundColor: '#EAEAEA',
  },
  headerText: {
    fontWeight: '600',
    fontSize: 13,
    color: '#333',
  },
  rowEven: {
    backgroundColor: '#FFFFFF',
  },
  rowOdd: {
    backgroundColor: '#F5F5F5',
  },
  cellDate: {
    width: 100,
    fontSize: 12,
    color: '#333',
  },
  cellName: {
    width: 90,
    fontSize: 12,
    color: '#333',
  },
  cellStock: {
    width: 50,
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
  downloadButton: {
    backgroundColor: '#3478F6',
    paddingVertical: 14,
    paddingHorizontal: 80,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',

    alignSelf: 'center',

    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 6,

    // Elevation for Android
    elevation: 6,
  },

  downloadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: FontFamily.ROKKIT_BOLD,
  },
  cellPrice: {
    width: 90,
    fontSize: 12,
    color: '#333',
    textAlign: 'right',
  },
  cellTotal: {
    width: 100,
    fontSize: 12,
    color: '#333',
    textAlign: 'right',
  },
  cellTotalProfit: {
    width: 100,
    fontSize: 12,
    color: '#31C816FF',
    textAlign: 'right',
  },
  period: {
    fontSize: 14,
    color: '#888',
    marginBottom: 18,
    fontFamily: FontFamily.ROKKIT_BOLD,
  },
  difference: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    fontFamily: FontFamily.ROKKIT_BOLD,
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 28,
  },
  breakdownTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
    color: '#333',
    fontFamily: FontFamily.KAUSHAN_REGULAR,
  },
  breakdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  breakdownCategory: {
    flex: 1,
    fontSize: 14,
    color: '#444',
  },
  breakdownAmount: {
    fontSize: 14,
    color: '#28c76f',
    fontFamily: FontFamily.ROKKIT_BOLD,
  },
  breakdownPercent: {
    fontSize: 14,
    color: '#999',
    fontFamily: FontFamily.ROKKIT_BOLD,
  },

  listContainer: {
    marginTop: 10,
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
});

const SummaryCard = ({
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
