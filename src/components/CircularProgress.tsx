import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {AnimatedCircularProgress} from 'react-native-circular-progress';

const CircularProgress = ({progress = 10}: {progress: number}) => {
  return (
    <View style={styles.container}>
      <AnimatedCircularProgress
        size={150}
        width={15}
        fill={progress} // percent
        tintColor="#219FF8FF"
        backgroundColor="#d0f0ff"
        rotation={270}
        lineCap="butt">
        {fill => (
          <View style={styles.textContainer}>
            <Text style={styles.percentageText}>{`${Math.round(fill)}%`}</Text>
            <Text style={styles.labelText}>Progress</Text>
          </View>
        )}
      </AnimatedCircularProgress>
    </View>
  );
};

export default CircularProgress;
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  textContainer: {
    alignItems: 'center',
  },
  percentageText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  labelText: {
    color: '#ffffff',
    fontSize: 16,
  },
});
