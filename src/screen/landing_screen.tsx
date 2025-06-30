// PPhForm.tsx
import React, {useState} from 'react';
import {View, Text, TextInput, Button, ScrollView} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import NumberInput from '../components/Input';
import KeyboardInput from '../components/KeyboardInput';
const PTKP = {
  'TK/0': 54000000,
  'TK/1': 58500000,
  'TK/2': 63000000,
  'TK/3': 67500000,
  'K/0': 58500000,
  'K/1': 63000000,
  'K/2': 67500000,
  'K/3': 72000000,
};

const taxBrackets = [
  {max: 60000000, rate: 0.05},
  {max: 250000000, rate: 0.15},
  {max: 500000000, rate: 0.25},
  {max: 5000000000, rate: 0.3},
  {max: Infinity, rate: 0.35},
];

function calculateTax(pkp) {
  let tax = 0;
  let remainingPKP = pkp;
  let prevMax = 0;

  for (const bracket of taxBrackets) {
    const taxable = Math.min(bracket.max - prevMax, remainingPKP);
    if (taxable <= 0) break;
    tax += taxable * bracket.rate;
    remainingPKP -= taxable;
    prevMax = bracket.max;
  }
  return Math.floor(tax);
}

export default function LandingScreen() {
  const [method, setMethod] = useState('gross');
  const [status, setStatus] = useState('TK/0');
  const [basicSalary, setBasicSalary] = useState('10000000');
  const [bonus, setBonus] = useState('0');

  const gross = parseFloat(basicSalary) + 54000 + 400000;
  const grossYearly = gross * 12 + parseFloat(bonus);

  const positionCost = Math.min(grossYearly * 0.05, 6000000);
  const jht = parseFloat(basicSalary) * 0.02 * 12;
  const jp = parseFloat(basicSalary) * 0.01 * 12;

  const nettoYearly = grossYearly - positionCost - jht - jp;
  const ptkp = PTKP[status];
  const pkp = Math.max(0, Math.floor(nettoYearly / 1000) * 1000 - ptkp);
  const taxYearly = calculateTax(pkp);
  const taxMonthly = Math.floor(taxYearly / 12);

  return (
    <View>
      <KeyboardInput />
    </View>
  );
}
