import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Icon from '@react-native-vector-icons/ionicons';
import FontFamily from '../assets/typography';

type IncomeType = 'monthly' | 'daily';

interface IncomeSelectorProps {
  navigation: NativeStackNavigationProp<any, any>;
  loading: boolean;
  error: string | null;
  filteredStocks: any[];
  disabled: boolean;
}

const IncomeSelector: React.FC<IncomeSelectorProps> = ({
  navigation,
  loading,
  error,
  filteredStocks,
  disabled,
}) => {
  const {t} = useTranslation();
  const [incomeType, setIncomeType] = useState<IncomeType>('daily');
  const [open, setOpen] = useState(false); // custom dropdown toggle

  const handleSelect = (type: IncomeType) => {
    setIncomeType(type);
    setOpen(false);
    if (type === 'monthly') {
      navigation.navigate('MonthlyIncomeRecap');
    } else {
      navigation.navigate('DailyIncomeRecap');
    }
  };

  return (
    <>
      {!loading && !error && filteredStocks.length > 0 && (
        <View style={styles.incomeContainer}>
          <TouchableOpacity
            disabled={disabled}
            style={styles.sectionRight}
            onPress={() => setOpen(!open)}>
            <Text style={styles.sectionTitleRight}>
              {t(
                incomeType === 'monthly'
                  ? 'insightMonthly.title'
                  : 'insightDaily.title',
              )}
            </Text>
            <Icon name="chevron-forward" size={20} color="#727272FF" />
          </TouchableOpacity>

          {open && (
            <View style={styles.dropdownList}>
              {(['daily', 'monthly'] as IncomeType[]).map(type => (
                <Pressable
                  key={type}
                  onPress={() => handleSelect(type)}
                  style={[
                    styles.dropdownItem,
                    incomeType === type && styles.dropdownItemActive,
                  ]}>
                  <Text
                    style={[
                      styles.dropdownItemText,
                      incomeType === type && styles.dropdownItemTextActive,
                    ]}>
                    {t(
                      type === 'monthly'
                        ? 'insightMonthly.title'
                        : 'insightDaily.title',
                    )}
                  </Text>
                  <Icon
                    name="chevron-forward"
                    size={20}
                    color={incomeType === type ? '#FFFFFF' : '#727272FF'}
                  />
                </Pressable>
              ))}
            </View>
          )}
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: '#F4F4F4',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CCC',
    minWidth: 160,
  },

  dropdownContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  selectedText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  incomeContainer: {
    alignItems: 'flex-end',
    position: 'relative', // container needs to be relatively positioned
  },
  dropdownList: {
    position: 'absolute', // make it float
    top: 50, // adjust based on dropdown height
    right: 0,
    backgroundColor: '#FFF',
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: {width: 0, height: 2},
    borderWidth: 1,
    borderColor: '#CCC',
    zIndex: 10, // ensure it stacks above
    width: 160, // match dropdown width
  },
  sectionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    marginTop: 16,
    gap: 6, // or use marginLeft in Text for spacing
  },

  sectionTitleRight: {
    fontSize: 20,
    fontWeight: '600',
    fontFamily: FontFamily.ROKKIT_BOLD,
    marginVertical: 8,
    color: '#727272FF',
  },
  section: {paddingHorizontal: 16},
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    flexDirection: 'row',
    marginRight: 4,
  },
  dropdownItemActive: {
    backgroundColor: '#4E80DCFF',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333',
  },
  dropdownItemTextActive: {
    color: '#FFF',
    fontWeight: '600',
  },
});

export default IncomeSelector;
