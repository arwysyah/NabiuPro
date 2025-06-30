import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import dayjs, {Dayjs} from 'dayjs';
import {EventData} from './OwnCalendar';
interface DayCellProps {
  date: Dayjs;
  width: number;
  dimmed?: boolean;
  isSelected?: boolean;
  onPress?: () => void;
  events?: EventData[];
  isToday: any;
}

const DayCell: React.FC<DayCellProps> = ({
  date,
  width,
  dimmed = false,
  isSelected = false,
  onPress,
  events = [],
  isToday,
}) => {
  const height = width + 50;
  const cellStyle = [
    styles.cell,
    {width, height},
    dimmed && styles.dimmedCell,
    isSelected && styles.selected,
    isToday && styles.today,
  ];
  const today = dayjs();
  const isPastDate = date.isBefore(today, 'day');

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={onPress}
      disabled={dimmed}
      style={[
        styles.cell,
        {width, height},
        dimmed && styles.dimmedCell,
        isSelected && styles.selectedCell,
        cellStyle,
        isPastDate && {backgroundColor: '#dedede', borderColor: 'white'},
      ]}
      testID={`day-cell-${date.format('YYYY-MM-DD')}`}>
      <Text
        style={[
          styles.dayNumber,
          dimmed && styles.dimmedText,
          (date.day() === 0 || date.day() === 6) && styles.weekendText, // Sunday (0) or Saturday (6)
        ]}>
        {date.date()}
      </Text>
      {/* Show up to 3 events */}
      {events.slice(0, 3).map((event, idx) => {
        const eventEnded =
          dayjs(event.endDate).isBefore(today, 'day') ||
          dayjs(event.endDate).isSame(today, 'day');

        return (
          <View
            key={idx}
            style={[
              styles.event,
              eventEnded && isPastDate && {backgroundColor: 'grey'},
              event.status
                ? {backgroundColor: '#02B94EFF'}
                : {backgroundColor: '#007bff'},
            ]}>
            {/* {eventEnded && isPastDate && (
              <Ionicons
                name={
                  event.succeeded
                    ? 'checkmark-circle-outline'
                    : 'close-circle-outline'
                }
                size={14}
                color={event.succeeded ? 'green' : 'red'}
                style={{marginRight: 4}}
              />
            )} */}
            <Text
              style={styles.eventText}
              numberOfLines={1}
              ellipsizeMode="tail">
              {event.title}
            </Text>
          </View>
        );
      })}

      {events.length > 3 && (
        <Text style={styles.moreText}>+{events.length - 3} more</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cell: {
    borderWidth: 0.5,
    borderColor: '#ddd',
    padding: 4,
    justifyContent: 'flex-start',
  },
  dimmedCell: {
    backgroundColor: '#f8f8f8',
  },
  selectedCell: {
    // backgroundColor: '#cce5ff',
    borderColor: '#0076EBFF',
    borderWidth: 2,
  },
  weekendText: {
    color: 'red',
  },

  selected: {
    // backgroundColor: '#cce5ff',
    borderColor: '#0076EBFF',
    borderWidth: 2,
  },
  dayNumber: {
    fontWeight: '600',
    marginBottom: 2,
    fontSize: 12,
  },
  dimmedText: {
    color: '#bbb',
  },
  event: {
    borderRadius: 3,
    paddingVertical: 2,
    paddingHorizontal: 3,
    marginVertical: 1,
  },
  eventText: {
    fontSize: 10,
    color: '#fff',
  },
  moreText: {
    fontSize: 10,
    color: '#007bff',
    marginTop: 2,
  },
  today: {
    // borderColor: '#007bff',
    borderWidth: 2,

    backgroundColor: 'rgba(66, 132, 245,0.4)',
  },
});

export default DayCell;
