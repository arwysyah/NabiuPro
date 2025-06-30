import React, {useEffect, useState, useMemo} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import {
  insertTransaction,
  markAsPaid,
  selectDebtOrReceivable,
} from '../lib/schema';
import {formatCurrency} from '../lib/currency_formatter';
import {useTranslation} from 'react-i18next';
import {useCurrency} from '../context/CurrencyContext';
import PageHeader from './PageHeader';
import dayjs from 'dayjs';
import {useNavigation, useRoute} from '@react-navigation/native';
import {AppColors} from '../constants/colors';
import {ConfirmationModal} from './ConfirmationModal';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import FontFamily from '../assets/typography';
import {useDeleteDebtOrReceivable} from '../hooks/useDeleteDebtsOrReceivable';
import {useTransactions} from '../hooks/useGetTransactions';

type Type = 'debt' | 'receivable';

interface Transaction {
  id: string;
  title: string;
  fromTo: string;
  amount: number;
  date: string;
  note?: string;
  created_at?: string;
  status: string;
  type?: 'income' | 'expense';
}

const DebtList = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Transaction | null>(null);
  const {
    transactions: trans,
    loading: _Load,
    error: _err,
    refresh,
  } = useTransactions();
  const route = useRoute();
  const type = route?.params?.type ?? 'debt';
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [search, setSearch] = useState('');
  const [sortDesc, setSortDesc] = useState(true);

  const {t} = useTranslation();
  const {currencyCode, locale} = useCurrency();
  useEffect(() => {
    loadData();
  }, [type]);

  const loadData = async () => {
    const data = await selectDebtOrReceivable(type);
    setTransactions(data);
  };
  const {remove, loading: deleting} = useDeleteDebtOrReceivable();

  const handleDelete = async (id: number) => {
    Alert.alert(
      t('delete_confirmation_title') || 'Delete',
      t('delete_confirmation_message') ||
        'Are you sure you want to delete this transaction?',
      [
        {text: t('plan.cancel') || 'Cancel', style: 'cancel'},
        {
          text: t('detail.delete') || 'Delete',
          style: 'destructive',
          onPress: async () => {
            await remove({id, type: type}, loadData);

            // TODO: Add your API or DB delete call here
          },
        },
      ],
    );
  };

  const filteredData = useMemo(() => {
    return transactions
      .filter(item => {
        const text = `${item.title} ${item.fromTo}`.toLowerCase();
        return text.includes(search.toLowerCase());
      })
      .sort((a, b) =>
        sortDesc
          ? new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          : new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      );
  }, [transactions, search, sortDesc]);
  const messages = t('debts.confirmation_message_title');

  const message =
    type === 'debt'
      ? t('debts.confirmation_message_debt')
      : t('debts.confirmation_message_receivable');
  const toggleSort = () => setSortDesc(prev => !prev);
  const nav = useNavigation();

  const renderItem = ({item}: {item: Transaction}) => {
    const isOverdue =
      dayjs(item.date).isBefore(dayjs(), 'day') && item.status !== 'completed';

    return (
      <View style={[styles.card, isOverdue && styles.overdueCard]}>
        <View style={styles.cardHeader}>
          <Ionicons
            name={
              type === 'receivable' ? 'arrow-down-circle' : 'arrow-up-circle'
            }
            size={28}
            color={type === 'receivable' ? '#27ae60' : '#e74c3c'}
            style={styles.icon}
          />
          <View style={{flex: 1}}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text
              style={[
                styles.cardAmount,
                type === 'receivable' ? styles.income : styles.expense,
              ]}>
              {type === 'receivable' ? '+' : '-'}
              {formatCurrency(item.amount, locale, currencyCode)}
            </Text>
          </View>
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>
            {type === 'debt' ? t('to') : t('from')}:
          </Text>
          <Text style={styles.metaValue}>{t('fromTo.' + item.fromTo)}</Text>
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>{t('date')}:</Text>
          <Text style={[styles.metaValue, isOverdue && styles.overdueText]}>
            {dayjs(item.date).format('DD-MM-YYYY')}
          </Text>
          {isOverdue && (
            <Text style={styles.overdueBadge}>• {t('overdue')}</Text>
          )}
        </View>

        {item.note ? (
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>{t('note')}:</Text>
            <Text style={styles.metaValue}>{item.note}</Text>
          </View>
        ) : (
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>{t('note')}:</Text>
            <Text style={styles.metaValue}>{t('noNote')}</Text>
          </View>
        )}

        <View style={[styles.statusBadge, styles.status(item.status)]}>
          <Text style={styles.statusText}>
            {t(item.status as 'pending' | 'completed' | 'default')}
          </Text>
        </View>

        {item.status !== 'completed' && (
          <TouchableOpacity
            style={styles.paidButton}
            onPress={() => {
              setSelectedItem(item);
              setShowModal(true);
            }}>
            <Text style={styles.paidButtonText}>
              {type === 'debt' ? t('mark_as_paid') : t('mark_as_received')}
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(item.id)}>
          <Ionicons name="trash" size={20} color="white" />
        </TouchableOpacity>
      </View>
    );
  };
  const totalBalance = trans.reduce((sum, item) => {
    if (item.type === 'income' || item.type === 'saving') {
      return sum + Number(item.amount);
    } else if (item.type === 'expense') {
      return sum - Number(item.amount);
    }
    return sum; // in case other types exist
  }, 0);

  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#FFFFFFFF'}}>
      <View style={styles.controls}>
        <TouchableOpacity
          onPress={() => {
            nav.goBack();
          }}
          style={styles.backButton}>
          <Ionicons name="chevron-back" size={22} color="#2d3436" />
        </TouchableOpacity>

        <View style={styles.searchWrapper}>
          <Ionicons
            name="search"
            size={18}
            color="#888"
            style={{marginRight: 6}}
          />
          <TextInput
            placeholder={t('search_placeholder') || 'Cari judul'}
            value={search}
            placeholderTextColor={'black'}
            onChangeText={setSearch}
            style={[styles.search, {flex: 1}]}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color="#888" />
            </TouchableOpacity>
          )}
        </View>

        <ConfirmationModal
          visible={showModal}
          title={messages}
          message={message}
          cancelLabel={t('debts.cancel')}
          acceptLabel={t('debts.confirm')}
          onClose={() => {
            setShowModal(false);
          }}
          onConfirm={async () => {
            try {
              if (!selectedItem) return;

              const success = await markAsPaid(type, selectedItem.id);
              const isDebt = type === 'debt';

              const todayFormatted = dayjs().format('DD/MM/YYYY');
              const transactionPayload = {
                title:
                  type === 'debt'
                    ? 'Pay debt'
                    : 'Received payment for receivables',
                categoryId: '11',
                type: isDebt ? 'expense' : 'income',
                amount: selectedItem.amount?.toString() ?? '0',
                date: todayFormatted,
                category: isDebt ? 'Loan Repayment' : 'Investment Return',
                subcategory: isDebt ? 'Personal Loan' : 'Dividend',
                note:
                  type === 'debt'
                    ? t('debts.pay_money_to') + selectedItem.fromTo
                    : t('debts.received_money_from') + selectedItem.fromTo,
              };

              const response = await insertTransaction(transactionPayload);
              if (response) {
                if (success) loadData();
              }

              // Clean up UI state
              setShowModal(false);
              setSelectedItem(null);
            } catch (error) {
              console.error('Transaction confirmation failed:', error);
              // Optionally show a toast or alert to the user
            }
          }}
          onCancel={async () => {
            const success = await markAsPaid(type, selectedItem.id);
            if (success) {
              loadData();
            }
            setShowModal(false);
            setSelectedItem(null);
          }}
        />

        <TouchableOpacity onPress={toggleSort} style={styles.sortBtn}>
          <Ionicons
            name={sortDesc ? 'arrow-down' : 'arrow-up'}
            size={20}
            color="#2d3436"
          />
          <Text style={styles.sortText}>
            {sortDesc ? t('newest_date') : t('oldest_date')}
          </Text>
        </TouchableOpacity>
      </View>
      {filteredData.length === 0 ? (
        <View style={styles.container}>
          <Text
            style={{
              fontFamily: FontFamily.ROKKIT_BOLD,
              fontSize: 20,
              color: 'black',
              textAlign: 'center',
            }}>
            {t('data_not_found')}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.container}
        />
      )}
      <TouchableOpacity
        style={[styles.fab, {marginBottom: insets.bottom}]}
        onPress={() => {
          if (totalBalance < 50000) {
            const title = t('wallet.notEnoughMoney');
            const msg = t('wallet.message', {
              amount: formatCurrency(50000, locale, currencyCode),
            });

            Alert.alert(title, msg);
          } else {
            nav.navigate('DebtsReceivable', {type: type});
          }
        }}>
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default DebtList;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 32,
    backgroundColor: 'white',
  },
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    backgroundColor: '#3478F6',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: {width: 0, height: 4},
  },

  backButton: {
    marginRight: 8,
    justifyContent: 'center',
  },
  controls: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
    flexDirection: 'row',
    alignItems: 'center',
  },

  searchWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecf0f1',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 40,
    marginRight: 8,
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecf0f1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  search: {
    fontSize: 14,
    flex: 1,
    color: 'black',
  },
  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
  },
  sortText: {
    fontSize: 14,
    color: '#2d3436',
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  icon: {
    marginRight: 12,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3436',
    marginBottom: 2,
  },

  cardAmount: {
    fontSize: 15,
    fontWeight: 'bold',
  },

  income: {
    color: '#2ecc71',
  },

  expense: {
    color: '#e74c3c',
  },

  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 6,
  },

  metaLabel: {
    color: '#636e72',
    fontSize: 13,
    fontWeight: '500',
  },

  metaValue: {
    color: '#2d3436',
    fontSize: 13,
    flexShrink: 1,
  },

  overdueText: {
    color: '#d63031',
    fontWeight: '600',
  },

  overdueBadge: {
    fontSize: 13,
    color: '#d63031',
    fontWeight: 'bold',
    marginLeft: 6,
  },

  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 50,
    marginTop: 10,
  },

  status: status => ({
    backgroundColor:
      status === 'completed'
        ? '#dff9fb'
        : status === 'pending'
        ? '#ffeaa7'
        : '#fab1a0',
  }),

  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2d3436',
  },

  paidButton: {
    marginTop: 12,
    backgroundColor: '#0984e3',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    width: 180,
    alignSelf: 'center',
  },

  paidButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  deleteButton: {
    position: 'absolute',
    bottom: -20,
    right: 12,
    backgroundColor: '#D97469FF',
    padding: 8,
    borderRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    backgroundColor: '#3478F6',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: {width: 0, height: 4},
  },
});
