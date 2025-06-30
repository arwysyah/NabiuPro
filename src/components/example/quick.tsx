import React, {useRef, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
  ScrollView,
} from 'react-native';
import Icon from '@react-native-vector-icons/ionicons';
import FontFamily from '../../assets/typography';
import {useFocusEffect} from '@react-navigation/native';

type ActionItem = {
  icon: string;
  label: string;
  screen: string;
  onPress: () => void;
};

type QuickActionButtonsProps = {
  actions: ActionItem[];
};

const ITEM_SPACING = 12;
const ITEM_WIDTH = 64;

const QuickActionButtons: React.FC<QuickActionButtonsProps> = ({actions}) => {
  const scrollRef = useRef<ScrollView>(null);
  useFocusEffect(
    React.useCallback(() => {
      scrollRef.current?.scrollTo({x: 0, animated: false});
    }, []),
  );

  return (
    <View style={styles.wrapper}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}>
        {actions.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={item.onPress}
            style={[
              styles.item,
              {marginRight: index === actions.length - 1 ? 0 : ITEM_SPACING},
            ]}>
            <View style={styles.iconWrapper}>
              <Icon name={item.icon} size={24} color="#3185EBFF" />
            </View>
            <Text style={styles.label} numberOfLines={1}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: 'white',
    marginLeft: 12,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  item: {
    width: ITEM_WIDTH,
    alignItems: 'center',
  },
  iconWrapper: {
    backgroundColor: '#E8F1FD',
    padding: 10,
    borderRadius: 999,
    marginBottom: 6,
  },
  label: {
    fontSize: Platform.OS === 'android' ? 13 : 12,
    fontFamily: FontFamily.ROKKIT_BOLD,
    color: '#333',
    textAlign: 'center',
  },
});

export default QuickActionButtons;
