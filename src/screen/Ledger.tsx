import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  useWindowDimensions,
} from 'react-native';
import {useStocks} from '../hooks/useStock';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import Ionicons from '@react-native-vector-icons/ionicons';
import {useTranslation} from 'react-i18next';
import PageHeader from '../components/PageHeader';
import {formatCurrency} from '../lib/currency_formatter';
import {useCurrency} from '../context/CurrencyContext';
import FontFamily from '../assets/typography';
import {AppColors} from '../constants/colors';

import IncomeSelector from '../components/IncomeSelector';
import {useSaveOrder} from '../hooks/useSaveOrder';
import {useDailyReset} from '../hooks/useReset';

export default function LedgerScreen() {
  const {t} = useTranslation();
  const {stocks, loading, error, fetchStocks} = useStocks();
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const {history, loading: loadOrder, clearHistory, refresh} = useSaveOrder();
  useFocusEffect(
    useCallback(() => {
      fetchStocks();
      setSelectedItems([]);
      refresh();
    }, []),
  );
  useDailyReset();
  const {locale, currencyCode} = useCurrency();

  const filteredStocks = stocks.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  const toggleSelectItem = (item: any) => {
    if (item.stock === 0) {
      return; // Prevent selecting if stock is 0
    }

    const isSelected = selectedItems.find(i => i.id === item.id);
    if (isSelected) {
      setSelectedItems(prev => prev.filter(i => i.id !== item.id));
    } else {
      setSelectedItems(prev => [...prev, item]);
    }
  };

  const isSelected = (item: any) =>
    selectedItems.find(i => i.id === item.id) !== undefined;
  const renderItem = ({item}: {item: any}) => {
    const selected = isSelected(item);
    const isOutOfStock = item.stock === 0;

    return (
      <TouchableOpacity
        style={[
          styles.gridItem,
          selected && styles.selectedItem,
          isOutOfStock && styles.disabledItem,
        ]}
        onPress={() => navigation.navigate('LedgerDetailScreen', {item})}
        disabled={isOutOfStock || selectedItems.length > 0}
        activeOpacity={isOutOfStock ? 1 : 0.2} // prevent press feedback
      >
        {!isOutOfStock && (
          <TouchableOpacity
            style={styles.checkIcon}
            onPress={() => toggleSelectItem(item)}
            activeOpacity={0.8}>
            <Ionicons
              name={selected ? 'checkmark-circle' : 'checkmark-circle-outline'}
              size={22}
              color={selected ? AppColors.greenBton : '#ccc'}
            />
          </TouchableOpacity>
        )}

        <View style={styles.itemImage}>
          <Ionicons name="cube-outline" size={28} color="#5C94FBFF" />
        </View>
        <Text style={styles.itemName} numberOfLines={3}>
          {item.name}
        </Text>
        <Text style={styles.itemStock}>
          {item.stock} {item.units}
        </Text>
        <Text style={styles.itemPrice}>
          {formatCurrency(item.selling_price, locale, currencyCode)}
        </Text>
      </TouchableOpacity>
    );
  };

  const handleFabPress = () => {
    if (selectedItems.length > 0) {
      navigation.navigate('YourCartScreen', {selectedItems});
    } else {
      navigation.navigate('CreateLedger');
    }
  };

  return (
    <View style={styles.container}>
      <PageHeader title={t('home.popUp.ledger')} />

      <View style={styles.searchContainer}>
        <TextInput
          placeholder={t('searchItems')}
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
          placeholderTextColor="#888"
        />
      </View>

      {!loading && !error && filteredStocks.length > 0 && (
        <IncomeSelector
          disabled={selectedItems.length > 0}
          navigation={navigation}
          loading={loading}
          error={error}
          filteredStocks={filteredStocks}
        />
      )}

      {loading && <ActivityIndicator size="large" color="#3478F6" />}
      {error && (
        <Text style={styles.errorText}>
          {t('error', {message: error.message || error})}
        </Text>
      )}
      {!loading && !error && filteredStocks.length === 0 && (
        <Text style={styles.emptyText}>{t('noStocksFound')}</Text>
      )}

      {!loading && !error && filteredStocks.length > 0 && (
        <FlatList
          data={filteredStocks}
          keyExtractor={item => item.id?.toString() || item.name}
          renderItem={renderItem}
          numColumns={3}
          contentContainerStyle={styles.gridContainer}
        />
      )}

      {selectedItems.length > 0 && (
        <View style={styles.fabContainer}>
          <TouchableOpacity
            style={styles.unselectBtn}
            onPress={() => setSelectedItems([])}>
            <Ionicons name="close-circle-outline" size={20} color="white" />
            <Text style={styles.unselectText}>
              {t('unselectAll') || 'Unselect All'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.fab} onPress={handleFabPress}>
            <Ionicons name="cart-outline" size={26} color="white" />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{selectedItems.length}</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}

      {selectedItems.length === 0 && (
        <View style={styles.fabContainer}>
          {history.length > 0 && (
            <View>
              <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('SavedOrdersScreen')}>
                <Ionicons name="bag-handle-sharp" size={30} color="white" />

                {/* Badge */}
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{history.length}</Text>
                </View>
              </TouchableOpacity>
              <View
                style={{
                  backgroundColor: '#dedede',
                  padding: 4,
                  borderRadius: 4,
                }}>
                <Text style={{fontSize: 10, color: '#ED3737FF'}}>
                  {t('unpaid')}
                </Text>
              </View>
            </View>
          )}
          <TouchableOpacity style={styles.fab} onPress={handleFabPress}>
            <Ionicons name="add" size={30} color="white" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  searchInput: {
    backgroundColor: '#F5F7FA',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  checkIcon: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    zIndex: 2,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: {width: 0, height: 1},
    elevation: 2,
  },
  disabledItem: {
    opacity: 0.8,
  },
  gridContainer: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 100,
  },
  fabs: {
    position: 'absolute',
    bottom: 80,
    right: 24,
    backgroundColor: '#3478F6',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 4},
  },
  gridItem: {
    flex: 1,
    margin: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: {width: 0, height: 3},
    elevation: 4,
    minWidth: 100,
    maxWidth: '30%',
  },
  itemImage: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#EAF0FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  itemName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    fontFamily: FontFamily.KAUSHAN_REGULAR,
  },
  itemStock: {
    fontSize: 12,
    color: '#000',
    textAlign: 'center',
    marginTop: 4,
    fontFamily: FontFamily.ROKKIT_BOLD,
  },
  itemPrice: {
    fontSize: 14,
    color: AppColors.greenBton,
    textAlign: 'center',
    marginTop: 4,
    fontFamily: FontFamily.ROKKIT_BOLD,
  },
  errorText: {
    textAlign: 'center',
    color: 'red',
    marginTop: 16,
    fontFamily: FontFamily.ROKKIT_BOLD,
  },
  emptyText: {
    textAlign: 'center',
    color: '#777',
    marginTop: 20,
    fontSize: 16,
    fontFamily: FontFamily.ROKKIT_BOLD,
  },
  unselectText: {
    color: 'white',
    marginLeft: 8,
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: FontFamily.ROKKIT_BOLD,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 70,

    right: 24,
    left: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fab: {
    backgroundColor: '#3478F6',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 4},
  },
  unselectBtn: {
    backgroundColor: '#999',
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 5,
    shadowOffset: {width: 0, height: 3},
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: 'red',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
  },
  selectedItem: {
    backgroundColor: '#F0F3F8',
    borderColor: AppColors.primary,
    borderWidth: 2,
  },
  checkIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 1,
  },
});
