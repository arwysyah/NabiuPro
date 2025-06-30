import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import Ionicons from '@react-native-vector-icons/ionicons';

import {AppColors} from '../constants/colors';
import FontFamily from '../assets/typography';
import {SELL_HISTORY_KEY} from '../hooks/useSaveOrder';
import {formatCurrency} from '../lib/currency_formatter';
import {SafeAreaView} from 'react-native-safe-area-context';
import PageHeader from '../components/PageHeader';
import {useCurrency} from '../context/CurrencyContext';
import dayjs from 'dayjs';
import {useDailyReset} from '../hooks/useReset';

export default function SavedOrdersScreen() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const {t} = useTranslation();
  const {currencyCode, locale} = useCurrency();
  const loadSavedOrders = async () => {
    try {
      const data = await AsyncStorage.getItem(SELL_HISTORY_KEY);
      if (data) {
        const parsedData = JSON.parse(data);
        const sorted = parsedData.sort(
          (
            a: {date: string | number | Date},
            b: {date: string | number | Date},
          ) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );
        setOrders(sorted);
      }
    } catch (error) {
      console.error('Error loading saved orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadSavedOrders);
    return unsubscribe;
  }, [navigation]);
  useDailyReset();
  const renderItem = ({item}: {item: any}) => {
    const totalPrice = item.items.reduce(
      (sum: number, it: any) => sum + it.quantity * it.selling_price,
      0,
    );

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => {
          navigation.navigate('YourCartScreen', {
            selectedItems: item.items,
            isEdit: true,
            id: item.id,
          });
        }}>
        <View style={styles.headerRow}>
          <Ionicons
            name="clipboard-outline"
            size={20}
            color={AppColors.primary}
          />
          <View style={{marginLeft: 8}}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.date}>
              {dayjs(item.date).format('DD/MM/YYYY hh:mm')}
            </Text>
          </View>
          <View style={{flex: 1}} />
          <Text style={styles.total}>
            {formatCurrency(totalPrice, locale, currencyCode)}
          </Text>
        </View>

        <View style={styles.itemsList}>
          {item.items.map((it: any, index: number) => (
            <View key={index} style={styles.itemRow}>
              <Text style={styles.itemName}>{it.name}</Text>
              <Text style={styles.itemQty}>
                {it.quantity} ×{' '}
                {formatCurrency(it.selling_price, locale, currencyCode)}
              </Text>
              <Text style={styles.itemPrice}>
                {formatCurrency(
                  it.quantity * it.selling_price,
                  locale,
                  currencyCode,
                )}
              </Text>
            </View>
          ))}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: '#fdfdfd'}}>
      <PageHeader title={t('savedOrders')} />
      {orders.length === 0 ? (
        <Text style={styles.empty}>{t('noSavedOrders')}</Text>
      ) : (
        <>
          {/* <View
            style={{
              backgroundColor: 'rgba(0, 5, 2,0.3)',
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 2,
              marginBottom: 10,
              borderRadius: 8,
              margin: 16,
            }}>
            <Text style={styles.reset}>{t('deletedOrder')}</Text>
          </View> */}
          {loading ? (
            <View style={styles.center}>
              <ActivityIndicator size="large" color={AppColors.primary} />
            </View>
          ) : (
            <FlatList
              data={orders}
              keyExtractor={item => item.id.toString()}
              renderItem={renderItem}
              contentContainerStyle={{paddingHorizontal: 16}}
              showsVerticalScrollIndicator={false}
            />
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: {width: 0, height: 4},
    shadowRadius: 10,
    elevation: 3, // soft elevation for Android
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontFamily: FontFamily.ROKKIT_BOLD,
    fontSize: 16,
    color: '#222',
  },
  date: {
    color: '#999',
    fontSize: 12,
    marginTop: 2,
  },
  total: {
    fontFamily: FontFamily.ROKKIT_BOLD,
    color: AppColors.primary,
    fontSize: 16,
  },
  itemsList: {
    marginTop: 14,
    borderTopColor: '#eee',
    borderTopWidth: 1,
    paddingTop: 10,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 14,
    flex: 1,
    color: '#333',
  },
  itemQty: {
    fontSize: 12,
    color: '#666',
    flex: 1.2,
    textAlign: 'right',
  },
  itemPrice: {
    fontSize: 12,
    fontWeight: '600',
    color: AppColors.greenBton,
    flex: 1,
    textAlign: 'right',
  },
  header: {
    fontFamily: FontFamily.ROKKIT_BOLD,
    fontSize: 22,
    marginBottom: 18,
    color: '#222',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
    color: '#999',
  },
  reset: {
    fontSize: 16,
    textAlign: 'center',

    color: '#fff',
  },
});
