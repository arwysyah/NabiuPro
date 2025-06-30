import React from 'react';
import {TouchableOpacity, Image, StyleSheet} from 'react-native';

type Props = {
  provider: 'google' | 'facebook';
};

const logos = {
  google: require('@/assets/google.png'),
  facebook: require('@/assets/facebook.png'),
};

const SocialButton = ({provider}: Props) => (
  <TouchableOpacity style={styles.button}>
    <Image source={logos[provider]} style={styles.icon} />
  </TouchableOpacity>
);

export default SocialButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 12,
    marginHorizontal: 10,
    elevation: 3,
  },
  icon: {
    width: 24,
    height: 24,
  },
});
