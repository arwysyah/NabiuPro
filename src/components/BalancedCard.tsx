import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  GestureResponderEvent,
} from 'react-native';
import FontFamily from '../assets/typography';

type BalanceCardProps = {
  label?: string;
  balance: string;
  income: string;
  spend: string;
  date: string;
  logoUrl?: string;
  onPress?: (event: GestureResponderEvent) => void;
};

const BalanceCard: React.FC<BalanceCardProps> = ({
  label = 'Current Balance',
  balance,
  income,
  spend,
  date,
  logoUrl = 'https://img.icons8.com/color/48/mastercard-logo.png',
  onPress,
}) => {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.balanceLabel}>{label}</Text>
        <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.amount}>{balance}</Text>
      <View style={styles.row}>
        <Text style={styles.income}>↑ {income}</Text>
        <Text style={styles.spend}>↓ {spend}</Text>
      </View>
      <Text style={styles.date}>{date}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#2B50EC',
    borderRadius: 20,
    padding: 20,
    margin: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  balanceLabel: {
    color: 'white',
    fontSize: 16,
    fontFamily: FontFamily.KAUSHAN_REGULAR,
  },
  logo: {
    width: 40,
    height: 40,
  },
  amount: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 10,
    fontFamily: FontFamily.ROKKIT_BOLD,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  income: {
    color: '#00FFA3',
  },
  spend: {
    color: '#FF6B6B',
  },
  date: {
    color: 'white',
    textAlign: 'right',
    marginTop: 12,
  },
});

export default BalanceCard;
