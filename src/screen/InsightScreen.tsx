import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {useMonthlyInsight} from '../hooks/useMonthlyInsight';
import {useTranslation} from 'react-i18next';
import {BarChart} from 'react-native-gifted-charts';
import FontFamily from '../assets/typography';
import PageHeader from '../components/PageHeader';
import {useCurrency} from '../context/CurrencyContext';
import {formatCurrency} from '../lib/currency_formatter';
import {SummaryCard} from './Report';

const InsightScreen = () => {
  const summary = useMonthlyInsight();

  const {t} = useTranslation();
  const {locale, currencyCode} = useCurrency();
  if (!summary)
    return <Text style={styles.loading}>{t('insight.loading')}</Text>;

  const chartData = [
    {
      label: t('insight.income'),
      value: summary.income,
      frontColor: '#28c76f',
    },
    {
      label: t('insight.expense'),
      value: summary.expense,
      frontColor: '#ea5455',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <PageHeader title={t('insight.title')} />
      <Text style={styles.header}></Text>
      <Text style={styles.period}>{t('insight.period')}</Text>

      <View style={styles.summaryContainer}>
        <SummaryCard
          label={t('insight.income')}
          amount={formatCurrency(summary.income, locale, currencyCode)}
          bgColor="#e0f8ee"
          textColor="#28c76f"
        />
        <SummaryCard
          label={t('insight.expense')}
          amount={formatCurrency(summary.expense, locale, currencyCode)}
          bgColor="#fdecea"
          textColor="#ea5455"
        />
      </View>

      <Text style={styles.difference}>
        {t('insight.difference')}:{' '}
        {formatCurrency(summary.difference, locale, currencyCode)}
      </Text>

      {/* Beautiful Bar Chart */}
      <View style={styles.chartContainer}>
        <BarChart
          data={chartData}
          barWidth={42}
          spacing={40}
          hideRules
          yAxisColor="#ccc"
          xAxisLabelTextStyle={{
            color: '#555',
            fontFamily: FontFamily.ROKKIT_BOLD,
          }}
          yAxisTextStyle={{color: '#777', fontFamily: FontFamily.ROKKIT_BOLD}}
          noOfSections={4}
          maxValue={Math.max(summary.income, summary.expense) * 1.2}
        />
      </View>
    </ScrollView>
  );
};

export default InsightScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
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
    paddingHorizontal: 16,
    marginTop: 12,
    gap: 12,
  },
  period: {
    fontSize: 14,
    color: '#888',
    marginBottom: 18,
    fontFamily: FontFamily.ROKKIT_BOLD,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryBox: {
    width: '48%',
    padding: 14,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
    fontFamily: FontFamily.ROKKIT_BOLD,
  },
  income: {
    fontSize: 18,
    color: '#28c76f',
    fontWeight: '700',
    fontFamily: FontFamily.ROKKIT_BOLD,
  },
  expense: {
    fontSize: 18,
    color: '#ea5455',
    fontWeight: '700',
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
    color: '#ea5455',
    marginHorizontal: 8,
    fontFamily: FontFamily.ROKKIT_BOLD,
  },
  breakdownPercent: {
    fontSize: 14,
    color: '#999',
    fontFamily: FontFamily.ROKKIT_BOLD,
  },
});
