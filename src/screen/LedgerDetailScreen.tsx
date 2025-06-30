import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Pressable,
  Alert,
} from 'react-native';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import Ionicons from '@react-native-vector-icons/ionicons';
import {formatCurrency} from '../lib/currency_formatter';
import {useCurrency} from '../context/CurrencyContext';
import {useTranslation} from 'react-i18next';
import PageHeader from '../components/PageHeader';
import FontFamily from '../assets/typography';
import CalculatorBottomSheet, {
  CalculatorSheetRef,
} from '../components/CalculatorBottomSheet';
import {
  deleteStock,
  insertIntoSell,
  updateStock,
} from '../lib/db/queries.stock';
import {BotAssistant} from '../components/NobiPopUp';
import {BotAssistantRef} from '../components/example/botAssistant';
import {AppColors} from '../constants/colors';
import {insertTransaction} from '../lib/schema';
import dayjs from 'dayjs';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type LedgerItem = {
  id?: string;
  name: string;
  unit: string;
  stock: number;
  purchase_price: number;
  selling_price: string;
  purchaseDate: string;
  note: string;
};

type RouteParams = {
  LedgerDetailScreen: {
    item: LedgerItem;
  };
};

export default function LedgerDetailScreen() {
  const nav = useNavigation();
  const route = useRoute<RouteProp<RouteParams, 'LedgerDetailScreen'>>();
  const {item} = route.params;
  const {t} = useTranslation();
  const {currencyCode, locale} = useCurrency();
  const insets = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);
  const [quantity, setQuantity] = useState('1');
  const [price, setPrice] = useState(item.selling_price.toString());
  const amount = parseFloat(quantity) * parseFloat(price || '0');
  const calculatorRef = useRef<CalculatorSheetRef>(null);
  const [value, setValue] = useState('');
  const [errorMessage, setErrorMessage] = useState(false);
  const botRef = useRef<BotAssistantRef>(null);
  const handleSale = () => {
    // Handle the sale logic here (e.g. update stock, create sale entry)
    setErrorMessage(false);
    setModalVisible(false);
    calculatorRef?.current?.open();
  };
  useEffect(() => {
    setErrorMessage(false);
  }, []);

  const selling = async () => {
    try {
      const response = await updateStock({
        id: Number(item.id),
        name: item.name,
        unit: item.unit,
        stock: Number(item.stock) - Number(quantity),
        sellingPrice: Number(item.selling_price),
        purchasePrice: item.purchase_price,
        purchaseDate: item.purchaseDate,
        note: item.note,
      });
      if (response) {
        botRef?.current?.openPopup();
        await insertIntoSell({
          name: item.name,
          unit: item.unit,
          stock: Number(quantity),
          sellingPrice: Number(item.selling_price),
          purchasePrice: item.purchase_price,
          purchaseDate: dayjs().format('YYYY-MM-DD'),
          totalPaid: amount.toString(),
          idStock: item?.id ?? '',
          note: item.note,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  const isSoldOut = item.stock === 0;

  const deleteStockById = async (id: number) => {
    const res = await deleteStock(id);
    if (res) {
      nav.goBack();
    }
  };
  const handleDelete = id => {
    Alert.alert(
      t('delete_confirmation_title') || 'Delete',
      t('delete_confirmation_message_stock') ||
        'Are you sure you want to delete this transaction?',
      [
        {text: t('plan.cancel') || 'Cancel', style: 'cancel'},
        {
          text: t('detail.delete') || 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteStockById(id);

            // TODO: Add your API or DB delete call here
          },
        },
      ],
    );
  };
  return (
    <View style={styles.container}>
      <PageHeader title={t('ledgerDetail')} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.label}>{t('productTitle')}</Text>
          <Text style={styles.value}>{item.name.toString()}</Text>

          <Text style={styles.label}>{t('ledger.quantity')}</Text>
          <Text style={styles.value}>
            {item.stock} {item.unit}
          </Text>

          <Text style={styles.label}>{t('purchasePrice')}</Text>
          <Text style={styles.value}>
            {formatCurrency(item.purchase_price, locale, currencyCode)}
          </Text>
          <Text style={styles.label}>{t('ledger.sellingPrice')}</Text>
          <Text style={styles.value}>
            {formatCurrency(item.selling_price, locale, currencyCode)}
          </Text>

          <Text style={styles.label}>{t('note')}</Text>
          <Text style={styles.value}>
            {item.note.length > 0 ? item.note : t('noNote')}
          </Text>
          <View
            style={{flexDirection: 'row', justifyContent: 'flex-end', top: 10}}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() =>
                nav.navigate('CreateLedger', {
                  existingStock: item,
                })
              }>
              <Ionicons name="create-outline" size={20} color="#fff" />
              <Text style={styles.editText}>{t('edit')}</Text>
            </TouchableOpacity>
            <View style={{width: 10}} />
            <TouchableOpacity
              style={[styles.editButton, {backgroundColor: '#EF4444'}]}
              onPress={() => {
                handleDelete(Number(item.id));
                // Optional: confirmation dialog
                // if (confirm('Are you sure you want to delete this item?')) {
                //   deleteStockById(Number(item.id))
                //     .then(() => nav.goBack())
                //     .catch(err => console.error('Delete error', err));
                // }
              }}>
              <Ionicons name="trash-outline" size={20} color="#fff" />
              <Text style={styles.editText}>{t('detail.delete')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* <TouchableOpacity
          style={styles.editButton}
          onPress={() =>
            nav.navigate('CreateLedgerNoteForm', {
              initialData: item,
            })
          }>
          <Ionicons name="create-outline" size={20} color="#fff" />
          <Text style={styles.editText}>{t('edit')}</Text>
        </TouchableOpacity> */}
      </ScrollView>
      <TouchableOpacity
        disabled={isSoldOut || modalVisible}
        style={
          isSoldOut || modalVisible ? styles.doneButton : styles.saleButton
        }
        onPress={() => {
          setErrorMessage(false);
          setModalVisible(true);
        }}>
        <Ionicons name="pricetag-outline" size={20} color="#fff" />
        <Text style={styles.saleText}>
          {isSoldOut ? t('soldOut') : t('sale')}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        disabled={isSoldOut || modalVisible}
        style={
          isSoldOut || modalVisible ? styles.doneButton : styles.saleButton
        }
        onPress={() => {
          setErrorMessage(false);
          setModalVisible(true);
        }}>
        <Ionicons name="pricetag-outline" size={20} color="#fff" />
        <Text style={styles.saleText}>
          {isSoldOut ? t('soldOut') : t('sale')}
        </Text>
      </TouchableOpacity>
      {insets.bottom > 10 && <View style={{height: insets.bottom}} />}
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{t('sellProduct')}</Text>
            <Text style={styles.label}>{t('productTitle')}</Text>
            <Text style={[styles.value, {fontFamily: FontFamily.ROKKIT_BOLD}]}>
              {item.name.toString()}
            </Text>
            <Text style={styles.modalLabel}>{t('ledger.quantity')}</Text>
            <View style={styles.quantityRow}>
              <Pressable
                style={styles.qtyButton}
                onPress={() =>
                  setQuantity(prev =>
                    Math.max(1, parseInt(prev || '1') - 1).toString(),
                  )
                }>
                <Text style={styles.qtyButtonText}>−</Text>
              </Pressable>
              <TextInput
                style={styles.qtyInput}
                keyboardType="numeric"
                value={quantity}
                onChangeText={text => setQuantity(text.replace(/[^0-9]/g, ''))}
              />
              <Pressable
                style={styles.qtyButton}
                onPress={() =>
                  setQuantity(prev => {
                    const current = parseInt(prev || '1', 10);
                    return Math.min(item.stock, current + 1).toString();
                  })
                }>
                <Text style={styles.qtyButtonText}>+</Text>
              </Pressable>
            </View>

            <Text style={styles.modalLabel}>{t('ledger.sellingPrice')}</Text>
            <TouchableOpacity style={[styles.modalInput]}>
              <Text>
                {formatCurrency(item.selling_price, locale, currencyCode)}
              </Text>
            </TouchableOpacity>
            <Text style={styles.modalLabel}>{t('total')}</Text>
            <Text style={styles.modalAmount}>
              {formatCurrency(amount || 0, locale, currencyCode)}
            </Text>
            {errorMessage && (
              <Text style={styles.errorMessage}>{t('notEnoughMoney')}</Text>
            )}
            <View style={styles.modalActions}>
              <Pressable
                style={styles.cancelBtn}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelText}>{t('cancel')}</Text>
              </Pressable>
              <Pressable style={styles.confirmBtn} onPress={handleSale}>
                <Text style={styles.confirmText}>{t('pay')}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      <BotAssistant
        ref={botRef}
        label={t('confirmBack')}
        onPress={async () => {
          const todayFormatted = dayjs().format('DD/MM/YYYY');
          const transactionPayload = {
            title: 'dailyIncome',

            categoryId: '11',
            type: 'income',
            amount: amount,
            date: todayFormatted,
            category: 'Salary',
            subcategory: 'Commission',
            note: '',
          };

          const response = await insertTransaction(transactionPayload);
        }}
        content={`${t('confirmation_message_sell_title')}\n\n${
          Number(value) - Number(amount) !== 0
            ? t('giveChange', {
                amount: formatCurrency(
                  Number(value) - Number(amount),
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
        total={formatCurrency(amount, locale, currencyCode)}
        ref={calculatorRef}
        onSubmit={val => {
          try {
            if (Number(val) < amount) {
              setModalVisible(true);
              setValue('0');
              setErrorMessage(true);
            } else {
              setValue(val);
              selling();
              // setModalVisible(false);
            }
          } catch (error) {
            console.log('ERROR', error);
          }

          calculatorRef.current?.close();
        }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
  },
  label: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 12,
    fontFamily: FontFamily.ROKKIT_BOLD,
  },
  value: {
    fontSize: 16,
    color: '#111827',
    marginTop: 4,
    fontFamily: FontFamily.ROKKIT_BOLD,
  },
  saleButton: {
    position: 'absolute',
    bottom: 30,
    left: 24,
    right: 24,
    backgroundColor: AppColors.action,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 16,
    shadowColor: AppColors.action,
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
    marginBottom: 35,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#618BF5FF', // or any color you prefer
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    alignSelf: 'flex-end',
    marginBottom: 12,
  },

  editText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 8,
    fontFamily: FontFamily.ROKKIT_BOLD,
  },

  doneButton: {
    position: 'absolute',
    bottom: 30,
    left: 24,
    right: 24,
    backgroundColor: '#D3D3D3FF',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 16,
    shadowColor: '#A8A8A8FF',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
    marginBottom: 35,
  },
  saleText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: FontFamily.ROKKIT_BOLD,
    marginLeft: 6,
  },

  // Modal Styling
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '92%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 18,
    color: '#111827',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: FontFamily.ROKKIT_BOLD,
  },
  modalLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 16,
    fontFamily: FontFamily.ROKKIT_BOLD,
  },
  modalInput: {
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginTop: 8,
  },
  modalAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginTop: 10,
    fontFamily: FontFamily.ROKKIT_BOLD,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 24,
    gap: 12,
    alignSelf: 'center',
  },
  cancelBtn: {
    backgroundColor: '#E5E7EB',

    borderRadius: 12,
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    color: '#374151',
    fontWeight: '600',
    fontFamily: FontFamily.ROKKIT_BOLD,
  },
  confirmBtn: {
    backgroundColor: AppColors.action,
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 12,
  },
  confirmText: {
    color: '#fff',
    fontWeight: '600',
    fontFamily: FontFamily.ROKKIT_BOLD,
  },

  // Quantity controls
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 10,
  },
  qtyButton: {
    width: 44,
    height: 44,
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  qtyButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    fontFamily: FontFamily.ROKKIT_BOLD,
  },
  qtyInput: {
    flex: 1,
    height: 44,
    borderBottomWidth: 1,
    borderColor: '#D1D5DB',
    textAlign: 'center',
    fontSize: 16,
    fontFamily: FontFamily.ROKKIT_BOLD,
    color: '#111827',
  },

  header: {
    paddingTop: 52,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    fontFamily: FontFamily.ROKKIT_BOLD,
  },

  errorMessage: {
    color: '#E72424FF',
    fontFamily: FontFamily.ROKKIT_BOLD,
    fontSize: 12,
    textAlign: 'center',
  },
});
