import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';

const BalanceCard = () => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.balanceLabel}>Current Balance</Text>
        <Image
          source={{uri: 'https://img.icons8.com/color/48/mastercard-logo.png'}}
          style={styles.logo}
        />
      </View>
      <Text style={styles.amount}>$5,750.20</Text>
      <View style={styles.row}>
        <Text style={styles.income}>↑ $101,080.00</Text>
        <Text style={styles.spend}>↓ $56,510.34</Text>
      </View>
      <Text style={styles.date}>09/25</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#2B50EC',
    borderRadius: 20,
    padding: 20,
    margin: 16,
  },
  header: {flexDirection: 'row', justifyContent: 'space-between'},
  balanceLabel: {color: 'white', fontSize: 16},
  logo: {width: 40, height: 40},
  amount: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  row: {flexDirection: 'row', justifyContent: 'space-between', marginTop: 8},
  income: {color: '#00FFA3'},
  spend: {color: '#FF6B6B'},
  date: {color: 'white', textAlign: 'right', marginTop: 12},
});

export default BalanceCard;
