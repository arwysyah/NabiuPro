import React, {useEffect, useRef} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {LineChart} from 'react-native-gifted-charts';
// import RecentTransactions from './example/recent';

const Chart = ({
  title = 'Expenses Trends',
  data = [],
  maxValue = 5000,
  focusOnToday = true,
}) => {
  const spacing = 40;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <LineChart
        showDataPointLabelOnFocus
        scrollToIndex={data.length > 10 ? data.length - 1 : 0}
        data={data}
        curved
        areaChart
        hideRules
        showScrollIndicator
        color="#00CFFF"
        startFillColor="#00CFFF"
        endFillColor="#00CFFF"
        startOpacity={0.3}
        endOpacity={0}
        thickness={3}
        hideDataPoints
        yAxisLabelWidth={40}
        noOfSections={5}
        yAxisLabelPrefix="$"
        yAxisColor="transparent"
        xAxisColor="transparent"
        yAxisTextStyle={styles.axisText}
        xAxisLabelTextStyle={styles.axisText}
        spacing={spacing}
        initialSpacing={0}
        maxValue={maxValue}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 20,
    backgroundColor: '#fff',
    margin: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#222',
  },
  axisText: {
    color: '#999',
    fontSize: 12,
  },
});

export default Chart;
