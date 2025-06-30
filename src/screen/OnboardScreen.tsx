// import React, {useEffect} from 'react';
// import {View, Text, StyleSheet, Image} from 'react-native';
// import {useTypedNavigation} from '../hooks/useTypedNavigation';
// import {AuthStackParams} from '../types/auth';
// import Button from '../components/Button';
// import {useTranslation} from 'react-i18next';
// import {createDeviceUser} from '../lib/schema';
// import FontFamily from '../assets/typography';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const adUnitId = __DEV__
//   ? TestIds.BANNER
//   : 'ca-app-pub-8396662544871841/7881840898';

// // Replace TestIds.INTERSTITIAL with your real ad unit ID in production
// const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
//   requestNonPersonalizedAdsOnly: true,
// });

// const OnboardScreen = () => {
//   const navigation = useTypedNavigation<AuthStackParams>();
//   const {t} = useTranslation();
//   const handlePres = async () => {
//     try {
//       await createDeviceUser();
//       navigation.navigate('Home');
//     } catch (error) {
//       console.log(error);
//     }
//   };
//   const showAdAndNavigate = async () => {
//     const hasSeenAd = await AsyncStorage.getItem('hasSeenFirstAd');

//     if (!hasSeenAd) {
//       const unsubscribe = interstitial.addAdEventListener(
//         AdEventType.LOADED,
//         () => {
//           interstitial.show();
//         },
//       );

//       const unsubscribeClosed = interstitial.addAdEventListener(
//         AdEventType.CLOSED,
//         async () => {
//           await AsyncStorage.setItem('hasSeenFirstAd', 'true');
//           unsubscribeError();
//           unsubscribeClosed();
//           navigation.navigate('Login');
//         },
//       );

//       const unsubscribeError = interstitial.addAdEventListener(
//         AdEventType.ERROR,
//         () => {
//           unsubscribe();
//           unsubscribeClosed();
//           navigation.navigate('Login');
//         },
//       );

//       interstitial.load();
//       await navigation.navigate('Login');
//     } else {
//       navigation.navigate('Login');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Image
//         style={styles.banner}
//         source={require('../assets/onboard/onboard_wallet.png')}
//         resizeMode="contain"
//       />
//       <View style={styles.bannerContainerText}>
//         <Text style={styles.bannerText}>{t('words')}</Text>
//       </View>

//       <Button label={t('started')} onPress={showAdAndNavigate} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingHorizontal: 15,
//     alignItems: 'center',
//   },
//   banner: {
//     height: '50%',
//     width: '80%',
//   },
//   bannerContainerText: {
//     width: '80%',
//     alignSelf: 'center',
//     marginBottom: 20,
//   },
//   text: {
//     color: '#FFFFFF',
//     fontSize: 14,
//     textAlign: 'center',
//   },
//   buttonStart: {
//     width: 267,
//     height: 51,
//     backgroundColor: '#3E8BFF',
//     alignItems: 'center',
//     alignContent: 'center',
//     alignSelf: 'center',
//     justifyContent: 'center',
//     borderRadius: 25,
//     marginTop: '18.5%',
//     marginBottom: 30,
//   },
//   bannerText: {
//     fontSize: 34,
//     paddingTop: '20%',
//     fontWeight: '400',
//     color: 'black',
//     textAlign: 'center',
//     fontFamily: FontFamily.KAUSHAN_REGULAR,
//   },
// });

// export default OnboardScreen;

import React, {useEffect} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {useTypedNavigation} from '../hooks/useTypedNavigation';
import {AuthStackParams} from '../types/auth';
import Button from '../components/Button';
import {useTranslation} from 'react-i18next';
import {createDeviceUser} from '../lib/schema';
import FontFamily from '../assets/typography';

// const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
//   requestNonPersonalizedAdsOnly: true,
// });

const OnboardScreen = () => {
  const navigation = useTypedNavigation<AuthStackParams>();
  const {t} = useTranslation();

  // useEffect(() => {
  //   const loadAndShowAd = async () => {
  //     const hasSeenAd = await AsyncStorage.getItem('hasSeenFirstAd');
  //     if (hasSeenAd) return;

  //     const onAdLoaded = () => {
  //       interstitial.show();
  //     };

  //     const onAdClosed = async () => {
  //       await AsyncStorage.setItem('hasSeenFirstAd', 'true');
  //       unsubscribeAll();
  //     };

  //     const onAdError = () => {
  //       unsubscribeAll();
  //     };

  //     const unsubscribeLoaded = interstitial.addAdEventListener(
  //       AdEventType.LOADED,
  //       onAdLoaded,
  //     );
  //     const unsubscribeClosed = interstitial.addAdEventListener(
  //       AdEventType.CLOSED,
  //       onAdClosed,
  //     );
  //     const unsubscribeError = interstitial.addAdEventListener(
  //       AdEventType.ERROR,
  //       onAdError,
  //     );

  //     const unsubscribeAll = () => {
  //       unsubscribeLoaded();
  //       unsubscribeClosed();
  //       unsubscribeError();
  //     };

  //     interstitial.load();
  //   };

  //   loadAndShowAd();
  // }, []);

  const handlePres = async () => {
    try {
      await createDeviceUser();
      navigation.navigate('Home');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        style={styles.banner}
        source={require('../assets/onboard/onboard_wallet.png')}
        resizeMode="contain"
      />
      <View style={styles.bannerContainerText}>
        <Text style={styles.bannerText}>{t('words')}</Text>
      </View>

      <Button
        label={t('started')}
        onPress={() => {
          navigation.navigate('Login');
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  banner: {
    height: '50%',
    width: '80%',
  },
  bannerContainerText: {
    width: '80%',
    alignSelf: 'center',
    marginBottom: 20,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
  },
  buttonStart: {
    width: 267,
    height: 51,
    backgroundColor: '#3E8BFF',
    alignItems: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    marginTop: '18.5%',
    marginBottom: 30,
  },
  bannerText: {
    fontSize: 34,
    paddingTop: '20%',
    fontWeight: '400',
    color: 'black',
    textAlign: 'center',
    fontFamily: FontFamily.KAUSHAN_REGULAR,
  },
});

export default OnboardScreen;
