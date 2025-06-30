import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from '@react-native-vector-icons/ionicons';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';

type CustomHeaderProps = {
  title?: string;
  titleIconName?: string;
};

export default function PageHeader({title, titleIconName}: CustomHeaderProps) {
  const nav = useNavigation();
  return (
    <SafeAreaView style={{backgroundColor: 'white', height: 70}}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => {
            nav.goBack();
          }}
          style={styles.goBackButton}>
          <Icon name="chevron-back" size={28} color="#000" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          {titleIconName ? (
            <Icon name={titleIconName} size={28} color="#000" />
          ) : (
            <Text style={styles.titleText}>{title}</Text>
          )}
        </View>
        <View style={styles.rightPlaceholder} />
      </View>
    </SafeAreaView>
  );
}

export function PageHeaderWithoutSafe({
  title,
  titleIconName,
}: CustomHeaderProps) {
  const nav = useNavigation();
  return (
    <View style={{backgroundColor: 'white', height: 70}}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => {
            nav.goBack();
          }}
          style={styles.goBackButton}>
          <Icon name="chevron-back" size={28} color="#000" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          {titleIconName ? (
            <Icon name={titleIconName} size={28} color="#000" />
          ) : (
            <Text style={styles.titleText}>{title}</Text>
          )}
        </View>
        <View style={styles.rightPlaceholder} />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  headerContainer: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    justifyContent: 'space-between',
    backgroundColor: 'white',
  },
  goBackButton: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  titleContainer: {
    // flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'black',
  },
  rightPlaceholder: {
    width: 40,
  },
});
