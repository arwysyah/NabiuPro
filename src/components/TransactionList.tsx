import React from 'react';
import {FlatList, Text, View, StyleSheet} from 'react-native';

import {formatCurrency} from '../lib/currency_formatter';
import {useCurrency} from '../context/CurrencyContext';
import Ionicons from '@react-native-vector-icons/ionicons';
import {useTranslation} from 'react-i18next';

interface Transaction {
  id: number;
  title: string;
  amount: number;
  note?: string;
  type: 'income' | 'expense';
  category: string;
  subcategory?: string;
}

interface Props {
  transactions: Transaction[];
}

const TransactionList: React.FC<Props> = ({transactions}) => {
  const {currencyCode, locale} = useCurrency();
  const {t} = useTranslation();
  return (
    <FlatList
      data={transactions}
      keyExtractor={item => String(item.id)}
      contentContainerStyle={{padding: 16}}
      renderItem={({item}) => (
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>{t(item.title)}</Text>
            <Text
              style={[
                styles.amount,
                item.type === 'expense' ? styles.expense : styles.income,
              ]}>
              {formatCurrency(item.amount, locale, currencyCode)}
            </Text>
          </View>
          {item.note ? <Text style={styles.note}>{item.note}</Text> : null}
          <View style={styles.footer}>
            <Ionicons name="pricetag-outline" size={14} color="#555" />
            <Text style={styles.category}>
              {t(item.category)}
              {t(item?.subcategory) ? `• ${t(item.subcategory)}` : ''}
            </Text>
          </View>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f9fafb',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: {
    fontWeight: '600',
    fontSize: 16,
    color: '#2c3e50',
  },
  amount: {
    fontWeight: '700',
    fontSize: 14,
  },
  income: {
    color: '#27ae60',
  },
  expense: {
    color: '#e74c3c',
  },
  note: {
    fontSize: 13,
    color: '#777',
    fontStyle: 'italic',
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 4,
  },
  category: {
    fontSize: 13,
    color: '#555',
  },
});

export default TransactionList;
