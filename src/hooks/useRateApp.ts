// hooks/useRateApp.ts
import {useCallback, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Rate, {AndroidMarket} from 'react-native-rate';

const HAS_RATED_KEY = 'hasRatedsAppsNabiu';

export const useRateApp = () => {
  const [hasRated, setHasRated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkRatedStatus = async () => {
      const value = await AsyncStorage.getItem(HAS_RATED_KEY);
      setHasRated(value === 'true');
    };
    checkRatedStatus();
  }, []);

  const requestReview = useCallback(async () => {
    // if (hasRated) return;

    const options: any = {
      //   AppleAppID: '1234567890', // Replace with your Apple App ID if needed
      GooglePackageName: 'com.nabiupro.tracker', // Your actual Android package name
      preferredAndroidMarket: AndroidMarket.Google,
      preferInApp: true,
      openAppStoreIfInAppFails: true,
    };

    Rate.rate(options, async success => {
      if (success) {
        await AsyncStorage.setItem(HAS_RATED_KEY, 'true');
        setHasRated(true);
      }
    });
  }, [hasRated]);

  return {hasRated, requestReview};
};
