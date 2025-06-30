import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import dayjs from 'dayjs';

import {formatCurrency} from '../lib/currency_formatter';
import FontFamily from '../assets/typography';
import {useCurrency} from '../context/CurrencyContext';
import {AppColors} from '../constants/colors';

import PageHeader from '../components/PageHeader';
import Icon from '@react-native-vector-icons/ionicons';
import CalculatorBottomSheet, {
  CalculatorSheetRef,
} from '../components/CalculatorBottomSheet';

import {insertIntoSell, updateStock} from '../lib/db/queries.stock';
import {insertTransaction} from '../lib/schema';
import {BotAssistant} from '../components/NobiPopUp';
import {BotAssistantRef} from '../components/example/botAssistant';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {SELL_HISTORY_KEY, useSaveOrder} from '../hooks/useSaveOrder';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
export default function YourCartScreen() {
  const {t} = useTranslation();
  const route = useRoute();
  const navigation = useNavigation();
  const {selectedItems, isEdit, id} = route.params as {
    selectedItems: any[];
    isEdit?: boolean;
    id?: string;
  };
  const insets = useSafeAreaInsets();
  const {removeById} = useSaveOrder();
  const {locale, currencyCode} = useCurrency();
  const [saveTitle, setSaveTitle] = useState('');
  const [showTitlePrompt, setShowTitlePrompt] = useState(false);

  const [cartItems, setCartItems] = useState(
    selectedItems.map(item => ({
      ...item,
      quantity: item.quantity ?? 1,
      errorMessage: '',
    })),
  );
  const [value, setValue] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const calculatorRef = useRef<CalculatorSheetRef>(null);
  const botRef = useRef<BotAssistantRef>(null);
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.quantity * item.selling_price,
    0,
  );

  const handleQuantityChange = (id: string, delta: number) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id
          ? {
              ...item,
              quantity: Math.max(
                1,
                Math.min(item.stock, item.quantity + delta),
              ),
              errorMessage: '',
            }
          : item,
      ),
    );
  };

  const handleDelete = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const handleManualQuantityChange = (id: string, text: string) => {
    const parsed = parseInt(text.replace(/[^0-9]/g, ''), 10);
    if (!isNaN(parsed)) {
      setCartItems(prev =>
        prev.map(item =>
          item.id === id
            ? {
                ...item,
                quantity: Math.max(1, Math.min(item.stock, parsed)),
                errorMessage: '',
              }
            : item,
        ),
      );
    }
  };

  const renderCartItem = ({item}: {item: any}) => {
    const total = item.quantity * item.selling_price;

    return (
      <View style={styles.card}>
        <Text style={styles.productName}>{item.name}</Text>

        <Text style={styles.label}>{t('ledger.quantity')}</Text>
        <View style={styles.quantityRow}>
          <Pressable
            style={styles.qtyButton}
            onPress={() => {
              if (!isEdit) {
                handleQuantityChange(item.id, -1);
              }
            }}>
            <Text style={styles.qtyButtonText}>−</Text>
          </Pressable>

          <TextInput
            style={styles.qtyInput}
            keyboardType="numeric"
            value={item.quantity.toString()}
            onChangeText={text => {
              if (!isEdit) {
                handleManualQuantityChange(item.id, text);
              }
            }}
          />

          <Pressable
            style={styles.qtyButton}
            onPress={() => {
              if (!isEdit) {
                handleQuantityChange(item.id, 1);
              }
            }}>
            <Text style={styles.qtyButtonText}>+</Text>
          </Pressable>
        </View>

        <Text style={styles.label}>{t('ledger.sellingPrice')}</Text>
        <View style={styles.readOnlyBox}>
          <Text>
            {formatCurrency(item.selling_price, locale, currencyCode)}
          </Text>
        </View>

        <Text style={styles.label}>{t('total')}</Text>
        <Text style={styles.totalAmount}>
          {formatCurrency(total, locale, currencyCode)}
        </Text>

        {!isEdit && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => {
              if (!isEdit) {
                handleDelete(item.id);
              }
            }}>
            <Icon name="trash-outline" size={18} color="#fff" />
            <Text style={styles.deleteButtonText}>{t('delete')}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const selling = async () => {
    try {
      for (const item of cartItems) {
        if (item.quantity > item.stock) {
          setCartItems(prev =>
            prev.map(i =>
              i.id === item.id ? {...i, errorMessage: t('notEnoughStock')} : i,
            ),
          );
          return;
        }

        const updatedStock = item.stock - item.quantity;
        const res = await updateStock({
          id: item.id,
          name: item.name,
          unit: item.unit,
          stock: updatedStock,
          sellingPrice: item.selling_price,
          purchasePrice: item.purchase_price,
          purchaseDate: item.purchaseDate,
          note: item.note,
        });

        if (res) {
          await insertIntoSell({
            name: item.name,
            unit: item.unit,
            stock: item.quantity,
            sellingPrice: item.selling_price,
            purchasePrice: item.purchase_price,
            purchaseDate: dayjs().format('YYYY-MM-DD'),
            totalPaid: (item.quantity * item.selling_price).toString(),
            idStock: item.id,
            note: item.note,
          });
        }
        if (id) {
          await removeById(id);
        }
        botRef?.current?.openPopup();
      }
    } catch (error) {
      console.error('Selling Error:', error);
      Alert.alert(t('error'), t('unexpectedError'));
    }
  };

  const handleSaveWithTitle = async () => {
    if (!saveTitle.trim()) {
      Alert.alert(t('error'), t('titleRequired'));
      return;
    }

    try {
      const existingData = await AsyncStorage.getItem(SELL_HISTORY_KEY);
      const history = existingData ? JSON.parse(existingData) : [];

      const newEntry = {
        id: Date.now(), // Unique ID
        title: saveTitle.trim(),
        date: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        items: cartItems,
      };

      history.push(newEntry);

      await AsyncStorage.setItem(SELL_HISTORY_KEY, JSON.stringify(history));
      Alert.alert(
        t('success'),
        t('orderSavedTemporarily'),
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ],
        {cancelable: false},
      );
    } catch (error) {
      console.error('Save Error:', error);
      Alert.alert(t('error'), t('unexpectedError'));
    }
  };
  return (
    <View style={{flex: 1, backgroundColor: '#fff', marginBottom: 40}}>
      <PageHeader title={t('sellProduct')} />

      <FlatList
        data={cartItems}
        keyExtractor={item => item.id.toString()}
        renderItem={renderCartItem}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 120 + insets.bottom,
        }}
        showsVerticalScrollIndicator={false}
      />
      <Modal visible={showTitlePrompt}>
        <View style={{backgroundColor: 'white', padding: 20, borderRadius: 10}}>
          <Text style={{fontSize: 16, marginBottom: 10}}>
            {t('enterTitle')}
          </Text>
          <TextInput
            value={saveTitle}
            onChangeText={setSaveTitle}
            placeholder={t('titlePlaceHolder')}
            placeholderTextColor={'#D4D4D4FF'}
            style={{
              borderWidth: 1,
              borderColor: '#ccc',
              padding: 10,
              marginBottom: 20,
              borderRadius: 8,
            }}
          />
          <TouchableOpacity
            style={styles.sellButton}
            onPress={() => {
              handleSaveWithTitle();
              setShowTitlePrompt(false);
              setSaveTitle('');
            }}>
            <Text style={styles.sellButtonText}>{t('saveOrder')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setShowTitlePrompt(false)}
            style={[styles.saveButton, {backgroundColor: '#aaa'}]}>
            <Text style={styles.sellButtonText}>{t('cancel')}</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <View style={styles.footer}>
        <View style={styles.footerRow}>
          <Text style={styles.footerLabel}>{t('total')}</Text>
          <Text style={styles.footerAmount}>
            {formatCurrency(totalAmount, locale, currencyCode)}
          </Text>
        </View>
        {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
        <TouchableOpacity
          style={styles.sellButton}
          onPress={() => {
            setErrorMessage(false);
            calculatorRef.current?.open();
          }}>
          <Icon
            name="pricetag"
            size={18}
            color="#fff"
            style={{marginRight: 8}}
          />
          <Text style={styles.sellButtonText}>{t('sale')}</Text>
        </TouchableOpacity>
        {!isEdit && (
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => {
              setShowTitlePrompt(true);
            }}>
            <Icon
              name="pricetag"
              size={18}
              color="#fff"
              style={{marginRight: 8}}
            />
            <Text style={styles.sellButtonText}>{t('saveOrder')}</Text>
          </TouchableOpacity>
        )}
      </View>
      <BotAssistant
        ref={botRef}
        label={t('confirmBack')}
        onPress={async () => {
          const todayFormatted = dayjs().format('DD/MM/YYYY');
          const transactionPayload = {
            title: 'dailyIncome',

            categoryId: '11',
            type: 'income',
            amount: totalAmount,
            date: todayFormatted,
            category: 'Salary',
            subcategory: 'Commission',
            note: '',
          };

          const response = await insertTransaction(transactionPayload);
        }}
        content={`${t('confirmation_message_sell_title')}\n\n${
          Number(value) - Number(totalAmount) !== 0
            ? t('giveChange', {
                amount: formatCurrency(
                  Number(value) - Number(totalAmount),
                  locale,
                  currencyCode,
                ),
              })
            : ''
        }`}
        label2={t('putBack')}
        propWidth={-130}
        propHeight={-120}
      />
      <CalculatorBottomSheet
        total={formatCurrency(totalAmount, locale, currencyCode)}
        ref={calculatorRef}
        onSubmit={val => {
          const numVal = Number(val);
          if (numVal < totalAmount) {
            setValue('0');
            setErrorMessage(t('notEnoughMoney'));
            return;
          }

          setValue(val);
          selling();
          calculatorRef.current?.close();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: {width: 0, height: 3},
    shadowRadius: 6,
    elevation: 2,
  },
  productName: {
    fontSize: 15,
    fontFamily: FontFamily.ROKKIT_BOLD,
    color: '#222',
  },
  label: {
    fontSize: 13,
    color: '#666',
    marginTop: 10,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  qtyButton: {
    width: 36,
    height: 36,
    backgroundColor: '#eee',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  qtyInput: {
    width: 60,
    height: 36,
    marginHorizontal: 8,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    textAlign: 'center',
    fontSize: 14,
  },
  readOnlyBox: {
    backgroundColor: '#f2f2f2',
    padding: 10,
    borderRadius: 6,
    marginTop: 4,
  },
  totalAmount: {
    fontSize: 16,
    fontFamily: FontFamily.ROKKIT_BOLD,
    color: AppColors.greenBton,
    marginTop: 4,
  },
  errorText: {
    color: '#d9534f',
    marginTop: 6,
    fontSize: 12,
  },
  deleteButton: {
    backgroundColor: '#D9534F',
    marginTop: 10,
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    marginLeft: 6,
    fontWeight: '600',
    fontSize: 13,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopColor: '#eee',
    borderTopWidth: 1,
    padding: 16,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  footerLabel: {
    fontSize: 16,
    fontFamily: FontFamily.ROKKIT_BOLD,
    color: '#333',
  },
  footerAmount: {
    fontSize: 18,
    fontFamily: FontFamily.ROKKIT_BOLD,
    color: AppColors.greenBton,
  },
  sellButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.primary,
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 5,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.greenBton,
    paddingVertical: 10,
    borderRadius: 10,
  },
  sellButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: FontFamily.ROKKIT_BOLD,
  },
});
