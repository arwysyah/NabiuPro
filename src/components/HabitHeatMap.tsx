import React, {useMemo, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Vibration,
} from 'react-native';
import dayjs from 'dayjs';
import {Picker} from '@react-native-picker/picker';
import HabitEditModal from './HabitEditModal';

dayjs.extend(require('dayjs/plugin/weekday'));

const generateDaysForYear = (year: number) => {
  const days = [];
  let date = dayjs(`${year}-01-01`);
  const end = dayjs(`${year}-12-31`);
  while (date.isBefore(end) || date.isSame(end)) {
    days.push(date);
    date = date.add(1, 'day');
  }
  return days;
};

const habitColors = {
  workout: ['#0e4429', '#006d32', '#26a641', '#39d353'],
  read: ['#1b1f23', '#384147', '#596770', '#7f8c8d'],
};

const getColor = (habitType: string, count: number) => {
  const shades = habitColors[habitType] || habitColors['workout'];
  if (count >= 5) return shades[3];
  if (count >= 3) return shades[2];
  if (count >= 1) return shades[1];
  return 'rgba(200, 200, 200, 0.2)'; // very light grey for "less"
};

type Props = {
  habitData: Record<string, Record<string, number>>;
};

const HabitHeatmap: React.FC<Props> = ({habitData}) => {
  const [year, setYear] = useState(dayjs().year());
  const days = useMemo(() => generateDaysForYear(year), [year]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedHabit, setSelectedHabit] = useState('workout');

  const weeks = useMemo(() => {
    const byWeek: dayjs.Dayjs[][] = [];
    let currentWeek: dayjs.Dayjs[] = [];

    days.forEach((date, i) => {
      if (currentWeek.length === 7 || (i === 0 && date.day() !== 0)) {
        byWeek.push(currentWeek);
        currentWeek = [];
      }
      currentWeek.push(date);
    });

    if (currentWeek.length > 0) {
      byWeek.push(currentWeek);
    }

    return byWeek;
  }, [days]);

  const handlePressDay = (dateStr: string) => {
    Vibration.vibrate(30);
    setSelectedDate(dateStr);
  };

  const onSaveHabit = (count: number) => {
    if (!selectedDate) return;
    habitData[selectedDate] = {
      ...(habitData[selectedDate] || {}),
      [selectedHabit]: count,
    };
    setSelectedDate(null);
  };

  return (
    <View>
      {/* Year Picker */}
      <Picker
        selectedValue={year}
        onValueChange={itemValue => setYear(itemValue)}
        style={{marginVertical: 10}}>
        {[2023, 2024, 2025].map(y => (
          <Picker.Item key={y} label={`${y}`} value={y} />
        ))}
      </Picker>

      {/* Habit Type Selector */}
      <Picker
        selectedValue={selectedHabit}
        onValueChange={setSelectedHabit}
        style={{marginVertical: 5}}>
        {Object.keys(habitColors).map(habit => (
          <Picker.Item key={habit} label={habit} value={habit} />
        ))}
      </Picker>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.container}>
          {weeks.map((week, wi) => (
            <View key={wi} style={styles.column}>
              {[...Array(7)].map((_, di) => {
                const day = week[di];
                const dateStr = day?.format('YYYY-MM-DD');
                const count = habitData[dateStr]?.[selectedHabit] || 0;

                return (
                  <Pressable
                    key={di}
                    onPress={() => handlePressDay(dateStr)}
                    style={[
                      styles.box,
                      {
                        backgroundColor: getColor(selectedHabit, count),
                      },
                    ]}
                  />
                );
              })}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Legend */}
      <View style={styles.legendContainer}>
        <Text style={styles.legendLabel}>Less</Text>
        {habitColors[selectedHabit].map((color, index) => (
          <View
            key={index}
            style={[styles.legendBox, {backgroundColor: color}]}
          />
        ))}
        <Text style={styles.legendLabel}>More</Text>
      </View>

      {/* Modal */}
      <HabitEditModal
        visible={!!selectedDate}
        date={selectedDate}
        habitType={selectedHabit}
        onClose={() => setSelectedDate(null)}
        onSave={onSaveHabit}
        currentCount={
          selectedDate ? habitData[selectedDate]?.[selectedHabit] || 0 : 0
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 8,
  },
  column: {
    marginHorizontal: 1,
    flexDirection: 'column',
  },
  box: {
    width: 16,
    height: 16,
    marginVertical: 1,
    borderRadius: 3,
  },
  legendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
    gap: 4,
    justifyContent: 'center',
  },
  legendLabel: {
    fontSize: 12,
    color: '#aaa',
    marginHorizontal: 4,
  },
  legendBox: {
    width: 16,
    height: 16,
    borderRadius: 3,
    marginHorizontal: 2,
  },
});

export default HabitHeatmap;
