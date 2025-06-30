/* eslint-disable react-native/no-inline-styles */
import React, {useState, useMemo} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Calendar from '../components/OwnCalendar';
import Icon from '@react-native-vector-icons/ionicons';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDayOff} from '../hooks/useDayOff';
import dayjs from 'dayjs';
import {useTranslation} from 'react-i18next';
import FontFamily from '../assets/typography';
import PageHeader from '../components/PageHeader';

const CalendarScreen = () => {
  const navigation = useNavigation();
  const {holiday, loading} = useDayOff();
  const [selectedDate, setSelectedDate] = useState('');

  // Generate events for the Calendar
  const calendarEvents = useMemo(() => {
    const result: Record<string, any[]> = {};
    (holiday ?? []).forEach((item, index) => {
      const dateKey = dayjs(item.tanggal).format('YYYY-MM-DD');
      if (!result[dateKey]) result[dateKey] = [];
      result[dateKey].push({
        id: index + 1,
        title: item.keterangan,
        status: item.is_cuti,
      });
    });
    return result;
  }, [holiday]);

  const filteredEvents = useMemo(() => {
    if (!selectedDate) return [];

    // Convert selectedDate to just YYYY-MM-DD format for comparison
    const selectedDateFormatted = dayjs(selectedDate).format('YYYY-MM-DD');

    return (holiday ?? []).filter(item => {
      const eventDateFormatted = dayjs(item.tanggal).format('YYYY-MM-DD');
      return eventDateFormatted === selectedDateFormatted;
    });
  }, [selectedDate, holiday]);

  const {t} = useTranslation();
  const insets = useSafeAreaInsets();
  return (
    <>
      <PageHeader title={t('holiday')} />

      <ScrollView style={styles.container}>
        {/* Header */}

        {/* Calendar Component */}
        <Calendar
          events={calendarEvents}
          onDateSelect={val => setSelectedDate(val)} // format: 'YYYY-MM-DD'
        />

        {/* Loading state */}
        {loading ? (
          <ActivityIndicator
            size="large"
            color="gray"
            style={{marginTop: 20}}
          />
        ) : (
          <>
            <View
              style={{
                backgroundColor: 'rgba(0,0,0,0.3)',
                paddingHorizontal: 10,
                paddingVertical: 3,
                marginHorizontal: 10,
                borderRadius: 2,
                top: 4,
              }}>
              <Text
                style={{
                  color: '#2114D9FF',
                  fontFamily: FontFamily.ROKKIT_BOLD,
                  fontSize: 10,
                }}>
                {t('exclusiveCalendar')}
              </Text>
            </View>
            <Text style={styles.selectedLabel}>
              {selectedDate
                ? dayjs(selectedDate).format('dddd, DD MMMM YYYY')
                : t('selectDate')}
            </Text>

            {/* Events List */}
            <FlatList
              data={filteredEvents}
              keyExtractor={(item, index) => `${item.tanggal}-${index}`}
              contentContainerStyle={[
                styles.listContainer,
                {paddingBottom: insets.bottom + 5},
              ]}
              ListEmptyComponent={
                <Text style={styles.emptyText}>{t('noEvent')}</Text>
              }
              renderItem={({item}) => (
                <View
                  style={[
                    styles.eventCard,
                    {
                      backgroundColor: item.is_cuti ? '#FFF0F0' : '#F0F7FF',
                      borderLeftColor: item.is_cuti ? '#FF6B6B' : '#3B82F6',
                    },
                  ]}>
                  <Text style={styles.eventTitle}>{item.keterangan}</Text>
                  <Text style={styles.eventType}>
                    {item.is_cuti ? t('leave') : t('nationalHoliday')}
                  </Text>
                </View>
              )}
            />
          </>
        )}
      </ScrollView>
    </>
  );
};

export default CalendarScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  selectedLabel: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    color: '#444',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },
  eventCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 5,
    backgroundColor: '#F9F9F9',
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  eventType: {
    marginTop: 4,
    color: '#666',
    fontSize: 14,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 24,
    color: '#aaa',
    fontStyle: 'italic',
  },
});
