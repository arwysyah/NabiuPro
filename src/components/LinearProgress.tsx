import React from 'react';
import {View, StyleSheet, Image, ScrollView, Text} from 'react-native';

type LinearProgressBarProps = {
  progress: number;
  segments: number[];
  rankIcons: any[];
  height?: number;
  activeColor?: string;
  inactiveColor?: string;
  iconSize?: number;
  segmentWidth?: number;
};

export default function LinearProgressBar({
  progress,
  segments,
  rankIcons,
  height = 12,
  activeColor = '#007bff',
  inactiveColor = '#e0e0e0',
  iconSize = 24,
  segmentWidth = 100,
}: LinearProgressBarProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}>
      {segments.map((segmentMax, index) => {
        const segmentStart = index === 0 ? 0 : segments[index - 1];
        const segmentEnd = segmentMax;

        let fillRatio = 0;
        if (progress >= segmentEnd) {
          fillRatio = 1;
        } else if (progress > segmentStart) {
          fillRatio = (progress - segmentStart) / (segmentEnd - segmentStart);
        }

        const isCurrentSegment =
          progress >= segmentStart && progress <= segmentEnd;

        return (
          <View key={index} style={styles.item}>
            <View
              style={[
                styles.segmentBar,
                {
                  width: segmentWidth,
                  height,
                  backgroundColor: inactiveColor,
                  borderRadius: 6,
                },
              ]}>
              <View
                style={{
                  width: `${fillRatio * 100}%`,
                  height: '100%',
                  backgroundColor: activeColor,
                  borderTopLeftRadius: 6,
                  borderBottomLeftRadius: 6,
                  borderTopRightRadius: fillRatio === 1 ? 6 : 0,
                  borderBottomRightRadius: fillRatio === 1 ? 6 : 0,
                }}
              />
              {/* Progress Text */}
              {isCurrentSegment && (
                <View style={styles.labelContainer}>
                  <Text style={styles.label}>
                    {progress} / {segmentEnd}
                  </Text>
                </View>
              )}
            </View>

            {/* Icon */}
            {rankIcons[index] && (
              <View style={styles.iconWrapper}>
                <Image
                  source={rankIcons[index]}
                  style={{
                    width: iconSize,
                    height: iconSize,
                    resizeMode: 'contain',
                  }}
                />
              </View>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    height: 40, // Increased to allow room for label
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    position: 'relative',
  },
  segmentBar: {
    overflow: 'hidden',
    justifyContent: 'center',
  },
  labelContainer: {
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  label: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  iconWrapper: {
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
