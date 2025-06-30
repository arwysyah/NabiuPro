import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import {PieChart} from 'react-native-gifted-charts';
import PageHeader from '../components/PageHeader';
import {useCurrency} from '../context/CurrencyContext';
import {formatCurrency} from '../lib/currency_formatter';
import {usePlansByParentId} from '../hooks/usePlanByDateId';
import {useTranslation} from 'react-i18next';
import FontFamily from '../assets/typography';
import dayjs from 'dayjs';
import {generateTicketPlanHtml} from '../utils/generatePlan';
import Share from 'react-native-share';
import RNHTMLtoPDF from 'react-native-html-to-pdf';

import Netinfo from '@react-native-community/netinfo';
const PlanDetail = ({route}) => {
  const {plan} = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');

  const {currencyCode, locale} = useCurrency();
  const startDate = new Date(plan.startDate);
  const endDate = new Date(plan.endDate);
  const diffInMs = endDate.getTime() - startDate.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24)) + 1;
  const totalAmount = plan.amount * diffInDays;
  const {plans, loading, error, refresh} = usePlansByParentId(plan.id);
  const {t} = useTranslation();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  useEffect(() => {
    const unsubscribe = Netinfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => unsubscribe();
  }, []);
  const paidAmount =
    plans.length > 0 ? plans.reduce((acc, rec) => acc + rec.amount, 0) : 0;

  const remainingAmount = totalAmount - paidAmount;
  const {i18n} = useTranslation();
  const currentLang = i18n.language; // e.g., 'id' or 'en'

  dayjs.locale(currentLang === 'id' ? 'id' : 'en');
  const pieData = [
    {
      value: paidAmount,
      color: '#27ae60', // green
      text: t('paids'),
    },
    {
      value: remainingAmount,
      color: '#3C94E7FF', // red
      text: t('remains'),
    },
  ];
  async function genPdf() {
    setIsGenerating(true);
    const html = generateTicketPlanHtml({
      username: usernameInput || 'Anonymous',
      handle: dayjs().format('DD MMM YYYY'),
      achieveAmount: totalAmount,
      savedAmount: paidAmount,
      progressPercent: Math.floor((paidAmount / totalAmount) * 100),
      locale: locale,
      ticketNumber: 'NAB-' + Math.floor(100000 + Math.random() * 900000),
      currencyCode: currencyCode,
      t: id => {
        const map = {
          'ticket.title': t('ticket.title'),
          'ticket.subTitle': t('ticket.subTitle'),
          'ticket.saved': t('ticket.saved'),
          'ticket.target': t('ticket.target'),
          'ticket.issuedBy': t('ticket.issuedBy'),
          'ticket.item': plan.title,
        };
        return map[id] || id;
      },
    });

    const options = {
      html,
      fileName:
        t('home.actions.plan') +
        plan.title +
        Math.floor(Date.now() / 1000).toString(),
      directory: 'Documents',
    };

    try {
      const file = await RNHTMLtoPDF.convert(options);
      if (file.filePath) {
        await Share.open({
          url: `file://${file.filePath}`,
          type: 'application/pdf',
          title: t('actions.plan') + plan.title,
        });
      }
    } catch (err) {
      console.log('PDF generation or sharing failed:', err);
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <>
      <PageHeader />
      <ScrollView style={styles.container}>
        <Text style={styles.title}>{plan.title}</Text>

        <View style={styles.section}>
          <Ionicons name="cash-outline" size={16} color="#27ae60" />
          <Text style={styles.text}>
            {formatCurrency(plan.amount, locale, currencyCode)} /{' '}
            {formatCurrency(totalAmount, locale, currencyCode)}
          </Text>
        </View>
        {isGenerating && (
          <Modal transparent animationType="fade">
            <View style={styles.loadingOverlay}>
              <View style={styles.loadingBox}>
                <Text style={styles.loadingText}>
                  {t('generating') || 'Generating PDF...'}
                </Text>
              </View>
            </View>
          </Modal>
        )}

        <View style={styles.section}>
          <Ionicons name="calendar-outline" size={16} color="#888" />
          <Text style={styles.text}>
            {dayjs(startDate).format('DD MMMM YYYY')} –{' '}
            {dayjs(endDate).format('DD MMMM YYYY')}
          </Text>
        </View>

        <PieChart
          data={pieData}
          donut
          radius={90}
          innerRadius={40}
          showText
          textColor="white"
          //   showExternalLabels
          centerLabelComponent={() => (
            <Text style={{fontSize: 12, textAlign: 'center'}}>
              {totalAmount > 0
                ? `${((paidAmount / totalAmount) * 100).toFixed(1)}% Paid`
                : '0% Paid'}
            </Text>
          )}
          textSize={12}
          //   centerLabelComponent={() => (
          //     <Text style={{fontSize: 12, textAlign: 'center'}}>
          //       {((paidAmount / totalAmount) * 100).toFixed(1)}% Paid
          //     </Text>
          //   )}
        />
        <View style={styles.amountSummary}>
          <View style={styles.amountRow}>
            <Text style={styles.label}>{t('shouldPaid')}</Text>
            <Text style={styles.label}>
              {formatCurrency(totalAmount, locale, currencyCode)}
            </Text>
          </View>
          <View style={styles.amountRow}>
            <Text style={styles.label}>{t('paid')}</Text>
            <Text style={styles.amountPaid}>
              {formatCurrency(paidAmount, locale, currencyCode)}
            </Text>
          </View>
          <View style={styles.amountRow}>
            <Text style={styles.label}>{t('remaining')}</Text>
            <Text style={styles.amountRemaining}>
              {formatCurrency(remainingAmount, locale, currencyCode)}
            </Text>
          </View>
        </View>

        {plan.note ? (
          <View style={styles.section}>
            <Ionicons name="document-text-outline" size={16} color="#555" />
            <Text style={styles.note}>{plan.note}</Text>
          </View>
        ) : (
          <View style={styles.section}>
            <Ionicons name="document-text-outline" size={16} color="#555" />
            <Text style={styles.note}>{t('noNote')}</Text>
          </View>
        )}
        <Pressable
          onPress={() => setModalVisible(true)}
          style={({pressed}) => [
            styles.downloadButton,
            pressed && {opacity: 0.85, transform: [{scale: 0.98}]},
          ]}>
          <Text style={styles.downloadButtonText}>{t('downloadPDF')}</Text>
        </Pressable>
        <Modal
          transparent
          visible={modalVisible}
          animationType="fade"
          onRequestClose={() => {
            setUsernameInput('');
            setModalVisible(false);
          }}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              {/* Close Button */}
              <Pressable
                style={styles.modalCloseButton}
                onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={22} color="#333" />
              </Pressable>

              <Text style={styles.modalTitle}>
                {t('yourname') || 'Your Name'}
              </Text>
              <TextInput
                style={styles.modalInput}
                value={usernameInput}
                onChangeText={setUsernameInput}
                placeholder={t('enterYourName') || 'Enter your name'}
              />
              <Pressable
                style={styles.modalButton}
                onPress={async () => {
                  if (usernameInput.length > 2) {
                    if (!isConnected) {
                      Alert.alert(
                        t('network_error_title') || 'No Internet Connection',
                        t('network_error_message') ||
                          'Please check your connection and try again.',
                      );
                      return;
                    }
                    setModalVisible(false);

                    genPdf();

                    setUsernameInput('');
                    return;
                  }

                  setModalVisible(false);
                }}>
                <Text style={styles.modalButtonText}>OK</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {padding: 16, backgroundColor: 'white', flex: 1},
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: '#2c3e50',
    fontFamily: FontFamily.ROKKIT_BOLD,
  },
  loadingOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingBox: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: FontFamily.ROKKIT_BOLD,
  },

  downloadButton: {
    backgroundColor: '#6890DFFF',
    marginHorizontal: 16,
    marginTop: 12,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  downloadButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: FontFamily.ROKKIT_BOLD,
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    fontFamily: FontFamily.ROKKIT_BOLD,
  },
  note: {
    fontSize: 15,
    color: '#555',
    fontStyle: 'italic',
    fontFamily: FontFamily.ROKKIT_BOLD,
  },
  amountSummary: {
    marginTop: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    color: '#555',
    fontWeight: '500',
    fontFamily: FontFamily.ROKKIT_BOLD,
  },
  amountPaid: {
    fontSize: 16,
    fontWeight: '600',
    color: '#27ae60',
  },
  amountRemaining: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e74c3c',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
    padding: 4,
  },

  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
    fontFamily: FontFamily.ROKKIT_BOLD,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    width: '100%',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    fontFamily: FontFamily.ROKKIT_BOLD,
  },
  modalButton: {
    backgroundColor: '#6890DFFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: FontFamily.ROKKIT_BOLD,
  },
});

export default PlanDetail;
