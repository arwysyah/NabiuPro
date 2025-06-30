import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {Swipeable} from 'react-native-gesture-handler';
import {formatCurrency} from '../lib/currency_formatter';
import PageHeader from '../components/PageHeader';
import {useTranslation} from 'react-i18next';
import {useFocusEffect, useNavigation} from '@react-navigation/native';

// Optional: If you use vector icons, for example Ionicons
import Ionicons from '@react-native-vector-icons/ionicons';
import {deleteTransaction} from '../lib/schema';
import {useCurrency} from '../context/CurrencyContext';
import FontFamily from '../assets/typography';
import {useGetTransactionByPage} from '../hooks/useGetTransactionByPage';

const Recent = () => {
  const navigation = useNavigation();
  const {currencyCode, locale} = useCurrency();
  const {t} = useTranslation();
  const {transactions, loading, error, refresh, loadMore, hasMore} =
    useGetTransactionByPage();

  const [data, setData] = useState(
    transactions
      .map(item => ({
        id: item?.id ?? '',
        title: item?.title ?? 'NO',
        date: item.date,
        amount: item.amount,
        color: item.type !== 'income' ? 'red' : 'green',
        icon: '',
        created_at: item.created_at,
        symbol: item.type !== 'income' ? '-' : '+',
      }))
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      ),
  );

  // Update data when transactions change
  React.useEffect(() => {
    setData(
      transactions
        .map(item => ({
          id: item?.id ?? '',
          title: item?.title ?? 'NO',
          date: item.date,
          amount: item.amount,
          color: item.type !== 'income' ? 'red' : 'green',
          icon: '',
          created_at: item.created_at,
          symbol: item.type !== 'income' ? '-' : '+',
        }))
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        ),
    );
  }, [transactions]);

  useFocusEffect(
    React.useCallback(() => {
      refresh();
    }, []),
  );

  // Delete item from list with confirmation
  const handleDelete = id => {
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
            await deleteTransaction(id);
            refresh();
            // TODO: Add your API or DB delete call here
          },
        },
      ],
    );
  };

  // Render right actions (delete button) on swipe
  const renderRightActions = (progress, dragX, id) => {
    return (
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDelete(id)}>
        <Ionicons name="trash" size={24} color="#fff" />
      </TouchableOpacity>
    );
  };

  const renderItem = ({item}) => (
    <Swipeable
      renderRightActions={(progress, dragX) =>
        renderRightActions(progress, dragX, item.id)
      }>
      <TouchableOpacity
        style={styles.item}
        onPress={() =>
          navigation.navigate('RecentDetail', {transaction: item})
        }>
        <View style={styles.info}>
          <Text style={styles.name}>{t(item.title)}</Text>
          <Text style={styles.date}>{item.date}</Text>
        </View>

        <Text style={[styles.amount, {color: item.color}]}>
          {item.symbol}
          {formatCurrency(item.amount, locale, currencyCode)}
        </Text>

        {/* Arrow icon for navigation */}
        <Ionicons
          name="chevron-forward"
          size={20}
          color="#888"
          style={{marginLeft: 10}}
        />
      </TouchableOpacity>
    </Swipeable>
  );

  return (
    <View style={styles.container}>
      <PageHeader title={t('activity')} />

      <FlatList
        data={transactions.map(item => ({
          id: item?.id ?? '',
          title: item?.title ?? 'NO',
          date: item.date,
          amount: item.amount,
          color: item.type !== 'income' ? 'red' : 'green',
          icon: '',
          created_at: item.created_at,
          symbol: item.type !== 'income' ? '-' : '+',
        }))}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{paddingHorizontal: 20}}
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          if (hasMore && !loading) {
            loadMore();
          }
        }}
        refreshing={loading}
        onRefresh={refresh}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    flex: 1,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
  },
  info: {flex: 1},
  name: {fontSize: 18, fontFamily: FontFamily.ROKKIT_BOLD},
  date: {fontSize: 10, color: '#888'},
  amount: {fontWeight: 'bold'},
  deleteButton: {
    backgroundColor: '#EB6B6BFF',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    marginVertical: 8,
    borderRadius: 5,
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
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

export default Recent;
