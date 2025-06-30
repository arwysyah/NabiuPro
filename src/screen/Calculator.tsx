import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
} from 'react-native';
import {useCalculatorLogic} from '../hooks/useCalculator';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {AppColors} from '../constants/colors';
import {useNavigation} from '@react-navigation/native';
import Icon from '@react-native-vector-icons/ionicons';
import BotBottomSheet, {
  BotBottomSheetHandle,
} from '../components/BotBottomSheet';
import {OptionChoice} from '../components/OptionChoice';
import {BotAssistantRef} from '../components/example/botAssistant';
import {useTranslation} from 'react-i18next';
import PageHeader from '../components/PageHeader';
import {BANNERID} from '../utils/bannerId';

// Define button layout
const buttons = [
  ['AC', 'sin', 'cos', 'tan', 'n!'],
  ['7', '8', '9', '+', 'clear'],
  ['4', '5', '6', '–', 'π'],
  ['1', '2', '3', '×', 'M+'],
  ['0', '.', 'EXP', '÷', 'M-'],
  ['±', '∛x', '√x', 'log', 'y√x'],
  ['(', ')', '1/x', '%', '='],
];

const Calculator = () => {
  const {input, result, degreeMode, memory, ans, handlePress} =
    useCalculatorLogic();
  const nav = useNavigation();
  const bottomSheetRef = useRef<BotBottomSheetHandle>(null);
  const botRef = useRef<BotAssistantRef>(null);

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const insets = useSafeAreaInsets();
  const {t} = useTranslation();

  return (
    <View style={styles.container}>
      <PageHeader title={t('home.actions.calculator')} />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.displayContainer}>
          <Text style={styles.inputText}>{input || '0'}</Text>
        </View>

        <View style={styles.resultRow}>
          <Text style={styles.resultText}>{result}</Text>
          {result.length > 0 && (
            <TouchableOpacity
              style={styles.buttonAdd}
              onPress={() => {
                bottomSheetRef?.current?.open();
                setIsSheetOpen(true);
              }}>
              <Icon name="add" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>

        {/* <Text style={styles.statusText}>
          Mode: {degreeMode ? 'Degrees' : 'Radians'} | Ans: {ans} | Mem:{' '}
          {memory}
        </Text> */}

        {buttons.map((row, i) => (
          <View key={i} style={styles.buttonRow}>
            {row.map(btn => (
              <TouchableOpacity
                key={btn}
                disabled={bottomSheetRef?.current?.isOpen()}
                style={[styles.button, btn === '=' && styles.equalsButton]}
                onPress={() => handlePress(btn)}>
                <Text
                  style={btn !== '=' ? styles.buttonText : styles.equalTexts}>
                  {btn}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}

        <BotBottomSheet
          ref={bottomSheetRef}
          onDismiss={() => setIsSheetOpen(false)}>
          <OptionChoice
            options={[
              {label: t('home.popUp.income'), value: 'income', route: 'Income'},
              {
                label: t('home.popUp.expense'),
                value: 'expense',
                route: 'Expense',
              },
              {label: t('home.actions.plan'), value: 'plan', route: 'Plan'},
            ]}
            onSubmit={(value: any) => {
              if (['savings', 'bill', 'debt'].includes(value)) return;
              if (value === 'expense' || value === 'income') {
                nav.navigate('Expenses', {type: value, amount: result});
              } else {
                nav.navigate('CreatePlan', {amount: result});
              }
              bottomSheetRef.current?.close();
              setIsSheetOpen(false);
            }}
            botRef={botRef}
          />
        </BotBottomSheet>
      </ScrollView>

      <View style={{alignSelf: 'center', paddingBottom: insets.bottom}}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFFFF',
    padding: 16,
  },
  scroll: {
    flex: 1,
  },
  header: {
    marginBottom: 10,
  },
  displayContainer: {
    marginVertical: 12,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  inputText: {
    fontSize: 28,
    color: '#333',
    textAlign: 'right',
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 8,
  },
  resultText: {
    fontSize: 24,
    color: '#0CBC06FF',
    textAlign: 'right',
  },
  statusText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'right',
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 18,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  buttonText: {
    fontSize: 18,
    color: '#222',
  },
  equalTexts: {color: 'white', fontSize: 18},
  equalsButton: {
    backgroundColor: AppColors.primary,
  },
  buttonAdd: {
    marginLeft: 12,
    height: 30,
    width: 30,
    borderRadius: 15,
    backgroundColor: AppColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Calculator;
