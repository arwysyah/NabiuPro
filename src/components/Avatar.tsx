import {StyleSheet, Text, View} from 'react-native';
import FontFamily from '../assets/typography';
import {AppColors} from '../constants/colors';

export const CustomAvatar = ({uri, textSize = 40}: any) => {
  const initials = uri ? uri.charAt(0).toUpperCase() : 'U';

  return (
    <View style={styles.customAvatarContainer}>
      <Text style={[styles.customInitialsText, {fontSize: textSize}]}>
        {initials}
      </Text>
    </View>
  );
};
const styles = StyleSheet.create({
  customAvatarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
    backgroundColor: AppColors.action,
    height: 80,
    width: 80,
    marginRight: 10,
    opacity: 0.8,
  },
  customInitialsText: {
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: FontFamily.KAUSHAN_REGULAR,
  },
});
