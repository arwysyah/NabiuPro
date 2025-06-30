import {useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from 'dayjs';
import {SELL_HISTORY_KEY} from './useSaveOrder';

const LAST_RESET_KEY = 'last_reset_datetime';
const KEYS_TO_RESET = [SELL_HISTORY_KEY]; // your keys
const RESET_HOUR = 23;
const RESET_MINUTE = 58;

export const useDailyReset = () => {
  useEffect(() => {
    const resetIfNeeded = async () => {
      try {
        const now = dayjs();
        const resetTimeToday = dayjs()
          .hour(RESET_HOUR)
          .minute(RESET_MINUTE)
          .second(0);
        const lastResetRaw = await AsyncStorage.getItem(LAST_RESET_KEY);
        const lastReset = lastResetRaw ? dayjs(lastResetRaw) : null;

        const hasPassedResetTime = now.isAfter(resetTimeToday);
        const alreadyResetToday =
          lastReset &&
          lastReset.isAfter(resetTimeToday) &&
          lastReset.isSame(now, 'day');

        if (hasPassedResetTime && !alreadyResetToday) {
          for (const key of KEYS_TO_RESET) {
            await AsyncStorage.removeItem(key);
          }

          await AsyncStorage.setItem(LAST_RESET_KEY, now.toISOString());
          console.log('[Daily Reset] Data cleared after 22:59');
        } else {
          console.log('[Daily Reset] No reset needed');
        }
      } catch (error) {
        console.error('[Daily Reset] Failed:', error);
      }
    };

    resetIfNeeded();
  }, []);
};
