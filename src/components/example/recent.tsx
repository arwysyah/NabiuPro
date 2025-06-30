import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {formatCurrency} from '../../lib/currency_formatter';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {SafeIcon} from '../OwnCalendar';
import {useCurrency} from '../../context/CurrencyContext';
import FontFamily from '../../assets/typography';
import {dayFormatter} from '../../screen/Home';

const RecentTransactions = ({transactions}: any) => {
  const {t} = useTranslation();
  const nav = useNavigation();
  const {currencyCode, locale} = useCurrency();
  return (
    <View style={styles.container}>
      {transactions.length > 0 && (
        <View style={styles.header}>
          <Text style={styles.title}>{t('home.sheet.title')}</Text>
          <TouchableOpacity
            onPress={() => {
              nav.navigate('Recent');
            }}>
            <SafeIcon name="chevron-forward" />
          </TouchableOpacity>
        </View>
      )}
      {transactions
        .sort((a, b) => b.id - a.id)
        .slice(0, 5)
        .map((item, idx) => (
          <TouchableOpacity
            style={styles.item}
            key={idx}
            onPress={() => nav.navigate('RecentDetail', {transaction: item})}>
            <View style={styles.info}>
              <Text style={styles.name}>{t(item.title)}</Text>
              <Text style={styles.date}>{dayFormatter(item.created_at)}</Text>
            </View>
            <Text style={[styles.amount, {color: item.color}]}>
              {item.symbol}
              {formatCurrency(item.amount, locale, currencyCode)}
            </Text>
          </TouchableOpacity>
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginTop: 10,
    backgroundColor: '#FFFFFF',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {fontSize: 16, fontWeight: 'bold'},
  more: {fontSize: 20, color: '#888'},
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 10,
    backgroundColor: '#0099FFFF',
    borderRadius: 6,
    padding: 5,
  },
  info: {flex: 1},
  name: {fontSize: 18, fontFamily: FontFamily.ROKKIT_BOLD},
  date: {fontSize: 10, color: '#888'},
  amount: {fontWeight: 'bold'},
});

export default RecentTransactions;
