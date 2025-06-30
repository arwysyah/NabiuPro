import dayjs from 'dayjs';
import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useCallback,
} from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {Calendar, DateData} from 'react-native-calendars';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
dayjs.extend(isSameOrBefore);
export type CalendarModalRef = {
  open: () => void;
  close: () => void;
};

type Props = {
  title?: string;
  mode: 'single' | 'range';
  date?: string;
  startDate?: string;
  endDate?: string;
  rangeType?: 'daily' | 'monthly' | 'yearly';
  onChange: (value: string | {startDate?: string; endDate?: string}) => void;
  btnCloseLabel?: string;
};

const SCREEN_WIDTH = Dimensions.get('window').width;

export const CalendarModal = forwardRef<CalendarModalRef, Props>(
  (
    {
      title = 'Select Date',
      mode,
      date,
      startDate,
      endDate,
      rangeType = 'daily',
      onChange,
      btnCloseLabel = 'Close',
    },
    ref,
  ) => {
    const [open, setOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string | undefined>();
    const [range, setRange] = useState<{startDate?: string; endDate?: string}>(
      {},
    );

    useImperativeHandle(ref, () => ({
      open: () => {
        setSelectedDate(date);
        setRange({startDate, endDate});
        setOpen(true);
      },
      close: () => setOpen(false),
    }));

    const handleSelectDate = useCallback(
      (day: DateData) => {
        const selected = dayjs(day.dateString).format('YYYY-MM-DD');

        if (rangeType === 'monthly') {
          const startStr = selected;
          const endStr = dayjs(selected)
            .add(1, 'month')
            .subtract(1, 'day')
            .format('YYYY-MM-DD');
          setRange({startDate: startStr, endDate: endStr});
          onChange({startDate: startStr, endDate: endStr});
          setOpen(false);
          return;
        }

        if (rangeType === 'yearly') {
          const startStr = selected;
          const endStr = dayjs(selected)
            .add(1, 'year')
            .subtract(1, 'day')
            .format('YYYY-MM-DD');
          setRange({startDate: startStr, endDate: endStr});
          onChange({startDate: startStr, endDate: endStr});
          setOpen(false);
          return;
        }

        // Daily range or single
        if (mode === 'single') {
          setSelectedDate(selected);
          onChange(selected);
          setOpen(false);
        } else {
          if (!range.startDate || (range.startDate && range.endDate)) {
            setRange({startDate: selected});
            onChange({startDate: selected});
          } else {
            const newStart = dayjs(range.startDate);
            const newEnd = dayjs(selected);
            const startStr = newStart.isBefore(newEnd)
              ? newStart.format('YYYY-MM-DD')
              : newEnd.format('YYYY-MM-DD');
            const endStr = newStart.isBefore(newEnd)
              ? newEnd.format('YYYY-MM-DD')
              : newStart.format('YYYY-MM-DD');

            setRange({startDate: startStr, endDate: endStr});
            onChange({startDate: startStr, endDate: endStr});
            setOpen(false);
          }
        }
      },
      [mode, range, rangeType, onChange],
    );

    const getMarkedDates = () => {
      const marks: {[date: string]: any} = {};

      if (mode === 'single' && selectedDate) {
        marks[selectedDate] = {
          selected: true,
          selectedColor: '#00adf5',
        };
      }

      if (range.startDate && range.endDate) {
        const start = dayjs(range.startDate);
        const end = dayjs(range.endDate);
        let current = start.clone();

        while (current.isSameOrBefore(end, 'day')) {
          const dateStr = current.format('YYYY-MM-DD');
          marks[dateStr] = {
            startingDay: dateStr === range.startDate,
            endingDay: dateStr === range.endDate,
            color: '#00adf5',
            textColor: 'white',
          };
          current = current.add(1, 'day');
        }
      } else if (range.startDate) {
        marks[range.startDate] = {
          startingDay: true,
          endingDay: true,
          color: '#00adf5',
          textColor: 'white',
        };
      }

      return marks;
    };
    const today = dayjs().format('YYYY-MM-DD');
    return (
      <Modal visible={open} transparent animationType="slide">
        <View style={styles.modal}>
          <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>

            <Calendar
              onDayPress={handleSelectDate}
              markedDates={getMarkedDates()}
              markingType={mode === 'range' ? 'period' : 'simple'}
              theme={{
                todayTextColor: '#00adf5',
                selectedDayTextColor: 'white',
                arrowColor: '#00adf5',
                textDayFontWeight: '500',
                textMonthFontWeight: 'bold',
              }}
              enableSwipeMonths
              minDate={today}
            />

            <TouchableOpacity
              style={styles.button}
              onPress={() => setOpen(false)}>
              <Text style={styles.buttonText}>{btnCloseLabel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  },
);

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    backgroundColor: '#00000080',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    width: SCREEN_WIDTH * 0.9,
    elevation: 8,
  },
  title: {
    fontSize: 18,
    marginBottom: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button: {
    marginTop: 16,
    backgroundColor: '#00adf5',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});
