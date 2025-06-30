import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import FontFamily from '../assets/typography';
import {useTranslation} from 'react-i18next';

const SplashScreen: React.FC = () => {
  // const insets = useSafeAreaInsets();
  const {t} = useTranslation();
  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        resizeMode="contain"
        source={require('../assets/logo.png')}
      />
      <View>
        <Text style={styles.appNameText}>Nabiu</Text>
        <Text style={styles.symbolism}>{t('splash.tagline')}</Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          position: 'absolute',
          bottom: 20,
          paddingBottom: 45,
        }}>
        <Text style={styles.grey}>{t('splash.securedBy')} </Text>
        <Text style={styles.symbolism}>{t('splash.team')}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  logo: {
    height: 120,
    width: 120,
  },
  appNameText: {
    fontSize: 40,
    color: '#5063BF',
    textAlign: 'center',
    fontFamily: FontFamily.SFPro,
  },
  symbolism: {
    fontSize: 12,
    color: '#5063BF',
    fontFamily: FontFamily.SFPro,
  },
  grey: {
    fontSize: 12,
    color: '#878787',
    fontFamily: FontFamily.SFPro,
  },
});

export default SplashScreen;
