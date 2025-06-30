import React, {createContext, useState, useEffect, useContext} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@user_currency';
const STORAGE_LOCALE = '@user_locale';

const currencies = {
  IDR: 'Rp',
  USD: '$',
  EUR: '€',
};

const locales = {
  IDR: 'id-ID',
  USD: 'en-US',
  EUR: 'de-DE', // example for Euro (Germany)
};

const CurrencyContext = createContext({
  currencyCode: 'USD',
  locale: 'en-US',
  setCurrencyCode: (code: string) => {},
  setLocale: (loc: string) => {},
  currencies,
});

export const CurrencyProvider = ({children}) => {
  const [currencyCode, setCurrencyCodeState] = useState('USD');
  const [locale, setLocaleState] = useState('en-US');

  // Load saved currency + locale or init based on language
  useEffect(() => {
    async function loadCurrency() {
      try {
        const savedCurrency = await AsyncStorage.getItem(STORAGE_KEY);
        const savedLocale = await AsyncStorage.getItem(STORAGE_LOCALE);
        if (savedCurrency && currencies[savedCurrency]) {
          setCurrencyCodeState(savedCurrency);
          setLocaleState(savedLocale || locales[savedCurrency]);
        } else {
          // Default init (example: Indonesia)
          setCurrencyCodeState('IDR');
          setLocaleState(locales['IDR']);
        }
      } catch (e) {
        // fallback defaults
        setCurrencyCodeState('USD');
        setLocaleState(locales['USD']);
      }
    }
    loadCurrency();
  }, []);

  const setCurrencyCode = async (newCode: string) => {
    if (!currencies[newCode]) return;
    try {
      await AsyncStorage.setItem(STORAGE_KEY, newCode);
      await AsyncStorage.setItem(STORAGE_LOCALE, locales[newCode]);
      setCurrencyCodeState(newCode);
      setLocaleState(locales[newCode]);
    } catch (e) {
      console.warn('Failed to save currency', e);
    }
  };

  return (
    <CurrencyContext.Provider
      value={{
        currencyCode,
        locale,
        setCurrencyCode,
        setLocale: setLocaleState,
        currencies,
      }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
