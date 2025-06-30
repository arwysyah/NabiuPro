// import React from 'react';
// import {View, Text, StyleSheet, Dimensions} from 'react-native';
// import dayjs from 'dayjs';
// import DayCell from './DayCell';

// const {width} = Dimensions.get('window');
// const CELL_WIDTH = width / 7;

// const CalendarGrid = ({month}) => {
//   const startOfMonth = month.startOf('month');
//   const endOfMonth = month.endOf('month');
//   const startDay = startOfMonth.day(); // 0 = Sun, 6 = Sat
//   const daysInMonth = month.daysInMonth();

//   const days = [];

//   // 1. Fill previous month's trailing days
//   const prevMonth = month.subtract(1, 'month');
//   const prevMonthDays = prevMonth.daysInMonth();

//   for (let i = startDay - 1; i >= 0; i--) {
//     const date = dayjs(
//       new Date(prevMonth.year(), prevMonth.month(), prevMonthDays - i),
//     );
//     days.push({date, belongsToMonth: false});
//   }

//   // 2. Fill current month's days
//   for (let i = 1; i <= daysInMonth; i++) {
//     const date = dayjs(new Date(month.year(), month.month(), i));
//     days.push({date, belongsToMonth: true});
//   }

//   // 3. Fill next month's leading days to make 42 cells
//   const total = days.length;
//   const nextMonth = month.add(1, 'month');
//   for (let i = 1; days.length < 42; i++) {
//     const date = dayjs(new Date(nextMonth.year(), nextMonth.month(), i));
//     days.push({date, belongsToMonth: false});
//   }

//   return (
//     <View>
//       {/* Weekday headers */}
//       <View style={styles.weekRow}>
//         {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
//           <Text key={day} style={[styles.weekday, {width: CELL_WIDTH}]}>
//             {day}
//           </Text>
//         ))}
//       </View>

//       {/* Calendar rows */}
//       {Array.from({length: 6}).map((_, rowIndex) => (
//         <View key={rowIndex} style={styles.weekRow}>
//           {days
//             .slice(rowIndex * 7, rowIndex * 7 + 7)
//             .map(({date, belongsToMonth}, colIndex) => (
//               <DayCell
//                 key={colIndex}
//                 date={date}
//                 width={CELL_WIDTH}
//                 dimmed={!belongsToMonth}
//               />
//             ))}
//         </View>
//       ))}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   weekRow: {flexDirection: 'row'},
//   weekday: {
//     textAlign: 'center',
//     paddingVertical: 6,
//     fontWeight: '600',
//     borderBottomWidth: 1,
//     borderColor: '#ccc',
//   },
// });

// export default CalendarGrid;
import React, {useState, useCallback} from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import dayjs, {Dayjs} from 'dayjs';
import DayCell from './DayCell';

import {useTranslation} from 'react-i18next';

const {width} = Dimensions.get('window');
const CELL_WIDTH = width / 7;

interface CalendarGridProps {
  month: Dayjs;
  selectedDate?: Dayjs | null;
  onDateSelect?: (date: Dayjs) => void;
  events?: Record<string, string[]>;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({
  month,
  selectedDate,
  onDateSelect,
  events = {},
}) => {
  const [selected, setSelected] = useState<Dayjs | null>(selectedDate ?? null);

  const startOfMonth = month.startOf('month');
  const endOfMonth = month.endOf('month');
  const startDay = startOfMonth.day(); // Sunday = 0
  const daysInMonth = month.daysInMonth();

  const days: {date: Dayjs; belongsToMonth: boolean}[] = [];

  // Prev month trailing days
  const prevMonth = month.subtract(1, 'month');
  const prevMonthDays = prevMonth.daysInMonth();
  const {t} = useTranslation();
  for (let i = startDay - 1; i >= 0; i--) {
    days.push({
      date: dayjs(
        new Date(prevMonth.year(), prevMonth.month(), prevMonthDays - i),
      ),
      belongsToMonth: false,
    });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      date: dayjs(new Date(month.year(), month.month(), i)),
      belongsToMonth: true,
    });
  }

  // Next month leading days to fill 42 cells
  const nextMonth = month.add(1, 'month');
  for (let i = 1; days.length < 35; i++) {
    days.push({
      date: dayjs(new Date(nextMonth.year(), nextMonth.month(), i)),
      belongsToMonth: false,
    });
  }

  const handleSelectDate = useCallback(
    (date: Dayjs) => {
      setSelected(date);
      onDateSelect?.(date);
    },
    [onDateSelect],
  );
  const today = dayjs();

  const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <View>
      {/* Weekday Headers */}

      <View style={styles.weekRow}>
        {WEEKDAYS.map((day, index) => (
          <Text
            key={day}
            style={[
              styles.weekday,
              {width: CELL_WIDTH},
              (index === 0 || index === 6) && styles.weekendText, // Sunday or Saturday
            ]}>
            {t(day)}
          </Text>
        ))}
      </View>

      {/* Calendar weeks */}
      {Array.from({length: 6}).map((_, rowIndex) => (
        <View key={rowIndex} style={styles.weekRow}>
          {days
            .slice(rowIndex * 7, rowIndex * 7 + 7)
            .map(({date, belongsToMonth}, colIndex) => (
              <DayCell
                key={colIndex}
                date={date}
                width={CELL_WIDTH}
                isToday={date.isSame(today, 'day')}
                dimmed={!belongsToMonth}
                isSelected={selected?.isSame(date, 'day')}
                onPress={() => handleSelectDate(date)}
                events={events[date.format('YYYY-MM-DD')] ?? []}
              />
            ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  weekRow: {flexDirection: 'row'},
  weekday: {
    textAlign: 'center',
    paddingVertical: 6,
    fontWeight: '600',
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  weekendText: {
    color: 'red',
  },
});

export default CalendarGrid;
