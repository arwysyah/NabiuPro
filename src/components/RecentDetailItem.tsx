import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {formatCurrency} from '../lib/currency_formatter';
import Icon from '@react-native-vector-icons/ionicons';
import {useTranslation} from 'react-i18next';
import {useCurrency} from '../context/CurrencyContext';
import dayjs from 'dayjs';

interface RecentDetailItemProps {
  transaction: {
    title: string;
    date: string;
    created_at: string;
    amount: number;
    color: 'green' | 'red';
    symbol: string;
    icon?: string;
  };
  onEdit?: () => void;
  onDelete: (id: string) => void;
}

const RecentDetailItem: React.FC<RecentDetailItemProps> = ({
  transaction,
  onEdit,
  onDelete,
}) => {
  const isPositive = transaction.color === 'green';
  const {currencyCode, locale} = useCurrency();
  const {t} = useTranslation();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View
          style={[
            styles.avatar,
            {backgroundColor: isPositive ? '#d1fae5' : '#fee2e2'},
          ]}>
          {transaction.icon ? (
            <Icon
              name={transaction.icon}
              size={28}
              color={isPositive ? '#16a34a' : '#dc2626'}
            />
          ) : (
            <Text
              style={[
                styles.avatarText,
                {color: isPositive ? '#16a34a' : '#dc2626'},
              ]}>
              {transaction.title.charAt(0).toUpperCase()}
            </Text>
          )}
        </View>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
          {t(transaction.title)}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>{t('detail.date')}</Text>
        <Text style={styles.value}>{transaction.date}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>{t('detail.createdAt')}</Text>
        <Text style={styles.value}>
          {dayjs(transaction.created_at).format('DD-MM-YYYY')}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>{t('detail.amount')}</Text>
        <Text
          style={[styles.amount, {color: isPositive ? '#16a34a' : '#dc2626'}]}>
          {transaction.symbol}{' '}
          {formatCurrency(transaction.amount, locale, currencyCode)}
        </Text>
      </View>

      {/* Buttons Container */}
      <View style={styles.buttonsContainer}>
        {/* <TouchableOpacity
          style={[styles.button, styles.editButton]}
          onPress={onEdit}>
          <Icon name="pencil-outline" size={20} color="#2563eb" />
          <Text style={styles.editText}>{t('detail.edit')}</Text>
        </TouchableOpacity> */}
        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={() => onDelete(transaction.id)}>
          <Icon name="trash-outline" size={20} color="#dc2626" />
          <Text style={styles.deleteText}>{t('detail.delete')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 24,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 15,
    shadowOffset: {width: 0, height: 6},
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    flexShrink: 1,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 8,
  },
  label: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '600',
  },
  value: {
    fontSize: 16,
    color: '#374151',
    maxWidth: '60%',
    textAlign: 'right',
  },
  amount: {
    fontSize: 20,
    fontWeight: '700',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    flex: 1,
    justifyContent: 'center',
  },
  editButton: {
    backgroundColor: '#e0e7ff',
    marginRight: 12,
  },
  deleteButton: {
    backgroundColor: '#fee2e2',
  },
  editText: {
    color: '#2563eb',
    fontWeight: '700',
    fontSize: 16,
    marginLeft: 8,
  },
  deleteText: {
    color: '#dc2626',
    fontWeight: '700',
    fontSize: 16,
    marginLeft: 8,
  },
});

export default RecentDetailItem;
