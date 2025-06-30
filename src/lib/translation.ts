import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RNLocalize from 'react-native-localize';

import en from '../locales/en/translation.json';
import id from '../locales/id/translation.json';

const LANG_KEY = 'user-language';

const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: async (callback: (lang: string) => void) => {
    try {
      const storedLang = await AsyncStorage.getItem(LANG_KEY);
      if (storedLang) return callback(storedLang);

      const bestLang = RNLocalize.findBestLanguageTag(['en', 'id']);
      return callback(bestLang?.languageTag ?? 'en');
    } catch (e) {
      return callback('en');
    }
  },
  init: () => {},
  cacheUserLanguage: async (lang: string) => {
    await AsyncStorage.setItem(LANG_KEY, lang);
  },
};

i18n
  .use(languageDetector as any)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    resources: {
      en: {translation: en},
      id: {translation: id},
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
