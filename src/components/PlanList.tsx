import React from 'react';
import {FlatList, Text, TouchableOpacity, View, StyleSheet} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import dayjs from 'dayjs';
import {useNavigation} from '@react-navigation/native';
import {useCurrency} from '../context/CurrencyContext';
import {formatCurrency} from '../lib/currency_formatter';
import {useTranslation} from 'react-i18next';
import FontFamily from '../assets/typography';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isSameOrBefore);
interface Plan {
  id: string;
  title: string;
  amount: number;
  note?: string;
  startDate: string;
  endDate: string;
  isDone?: boolean;
}

interface Props {
  plans: Plan[];
  planHasDoneList: {id: number; date: string; amount: number}[];
  onPressCheckMark: (plan: Plan) => void;
  selectedDate: string;
}

const PlanList: React.FC<Props> = ({
  plans,
  onPressCheckMark,
  planHasDoneList,
  selectedDate,
}) => {
  const navigation = useNavigation();
  const {currencyCode, locale} = useCurrency();
  const {t} = useTranslation();
  return (
    <FlatList
      data={plans}
      keyExtractor={item => String(item.id)}
      contentContainerStyle={{paddingBottom: 16}}
      ListEmptyComponent={
        <Text
          style={{
            fontFamily: FontFamily.ROKKIT_BOLD,
            fontSize: 18,
            color: 'grey',
          }}>
          {t('noPlansToday')}
        </Text>
      }
      renderItem={({item}) => {
        const isDone = planHasDoneList.some(
          done =>
            done.id === item.id &&
            done.date === dayjs(selectedDate).format('YYYY-MM-DD'),
        );

        return (
          <View style={styles.cardWrapper}>
            <View style={styles.planCard}>
              <View style={styles.planHeader}>
                <Text style={styles.planTitle}>{item.title}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    isDone ? styles.done : styles.notDone,
                  ]}>
                  <Text style={styles.statusText}>
                    {isDone ? t('done') : t('notFinished')}
                  </Text>
                </View>
              </View>

              <View style={styles.amountContainer}>
                <Ionicons name="cash-outline" size={16} color="#27ae60" />
                <Text style={styles.planAmount}>
                  {formatCurrency(item.amount, locale, currencyCode)}
                </Text>
              </View>

              {item.note ? (
                <View style={styles.noteContainer}>
                  <Ionicons
                    name="document-text-outline"
                    size={14}
                    color="#555"
                  />
                  <Text style={styles.planNote}>{item.note}</Text>
                </View>
              ) : (
                <View style={styles.noteContainer}>
                  <Ionicons
                    name="document-text-outline"
                    size={14}
                    color="#555"
                  />
                  <Text style={styles.planNote}>{t('noNote')}</Text>
                </View>
              )}

              <View style={styles.planRangeContainer}>
                <Ionicons name="calendar-outline" size={14} color="#888" />
                <Text style={styles.planRange}>
                  {dayjs(item.startDate).format('MMM D')}
                </Text>
                <Text style={styles.planRangeSeparator}>—</Text>
                <Text style={styles.planRange}>
                  {dayjs(item.endDate).format('MMM D')}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.arrowIconContainer}
                onPress={() =>
                  navigation.navigate('PlanDetail', {
                    plan: item,
                    planHasDone: planHasDoneList,
                  })
                }
                activeOpacity={0.7}>
                <Ionicons
                  name="chevron-forward-outline"
                  size={24}
                  color="#888"
                />
              </TouchableOpacity>
            </View>

            {dayjs(selectedDate)?.isSameOrBefore(dayjs(), 'day') && (
              <TouchableOpacity
                style={styles.checkmarkButton}
                disabled={isDone}
                onPress={() => onPressCheckMark(item)}
                activeOpacity={0.7}>
                <Ionicons
                  name="checkmark-circle"
                  size={36}
                  color={isDone ? '#27ae60' : '#ccc'}
                />
              </TouchableOpacity>
            )}
          </View>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    marginBottom: 24,
    position: 'relative',
  },
  planCard: {
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
    position: 'relative',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  planTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#2c3e50',
    flex: 1,
    flexWrap: 'wrap',
    paddingRight: 40,
  },
  statusBadge: {
    position: 'absolute',
    top: -15,
    right: -14,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 2,
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },

  done: {
    backgroundColor: '#d4edda',
  },
  notDone: {
    backgroundColor: '#fdecea',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  planAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#27ae60',
    marginLeft: 8,
  },
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  planNote: {
    fontSize: 14,
    color: '#555',
    fontStyle: 'italic',
  },
  planRangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  planRange: {
    fontSize: 13,
    color: '#888',
    fontWeight: '500',
  },
  planRangeSeparator: {
    marginHorizontal: 6,
    fontSize: 14,
    color: '#aaa',
  },
  arrowIconContainer: {
    position: 'absolute',
    right: 12,
    top: '60%',
    // marginTop: -12,
  },
  checkmarkButton: {
    position: 'absolute',
    bottom: -18,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    padding: 2,
  },
});

export default PlanList;
