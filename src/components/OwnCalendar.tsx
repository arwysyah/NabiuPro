import React, {useState, useCallback} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import dayjs, {Dayjs} from 'dayjs';
import CalendarGrid from './CalendarGrid';
import {useTranslation} from 'react-i18next';
import {AppColors} from '../constants/colors';
import FontFamily from '../assets/typography';

// ✅ Define SafeIcon at the top
let Icon: any = null;
try {
  Icon = require('@react-native-vector-icons/ionicons').default;
} catch (e) {
  Icon = null;
}

type IconProps = {
  name: string;
  size?: number;
  color?: string;
};

export const SafeIcon = ({name, size = 24, color = 'black'}: IconProps) => {
  if (!Icon) {
    return <Text>🔲</Text>; // Or return null
  }
  return <Icon name={name} size={size} color={color} />;
};

// ✅ Now define Calendar component
type EventStatus = 'done' | 'pending';

export interface EventData {
  title: string;
  status?: EventStatus;
}
export interface CalendarProps {
  initialMonth?: Dayjs;

  events: Record<string, EventData[]>;
  onDateSelect?: (date: Dayjs) => void;
  style?: object;
  headerStyle?: object;
  monthLabelStyle?: object;
  navTextStyle?: object;
}

const Calendar: React.FC<CalendarProps> = ({
  initialMonth,
  events = {},
  onDateSelect,
  style,
  headerStyle,
  monthLabelStyle,
  navTextStyle,
}) => {
  const [month, setMonth] = useState<Dayjs>(initialMonth ?? dayjs());

  const goToPrev = useCallback(
    () => setMonth(prev => prev.subtract(1, 'month')),
    [],
  );
  const goToNext = useCallback(
    () => setMonth(prev => prev.add(1, 'month')),
    [],
  );

  const {t} = useTranslation();
  return (
    <View style={[styles.container, style]}>
      <View style={[styles.header, headerStyle]}>
        <TouchableOpacity onPress={goToPrev} testID="prev-month-button">
          {/* <SafeIcon name="chevron-back" /> */}
          <Text
            style={[
              navTextStyle,
              {color: AppColors.action, fontFamily: FontFamily.ROKKIT_BOLD},
            ]}>
            {t('calendar.prev')}
          </Text>
        </TouchableOpacity>

        <Text style={[styles.monthLabel, monthLabelStyle]}>
          {month.format('MMMM YYYY')}
        </Text>

        <TouchableOpacity onPress={goToNext} testID="next-month-button">
          {/* <SafeIcon name="chevron-forward" /> */}
          <Text
            style={[
              navTextStyle,
              {color: AppColors.action, fontFamily: FontFamily.ROKKIT_BOLD},
            ]}>
            {t('calendar.next')}
          </Text>
        </TouchableOpacity>
      </View>

      <CalendarGrid
        month={month}
        selectedDate={null}
        onDateSelect={onDateSelect}
        events={events}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, paddingTop: 10},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  monthLabel: {fontSize: 20, fontWeight: 'bold'},
  nav: {fontSize: 20},
});

export default Calendar;
