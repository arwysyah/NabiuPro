// LanguageContext.tsx
import React, {createContext, useState, useContext} from 'react';
import i18n from '../lib/translation';

const LanguageContext = createContext({
  language: 'en',
  setLanguage: (lang: string) => {},
});

export const LanguageProvider = ({children}: any) => {
  const [language, setLanguage] = useState('en');

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    setLanguage(lang);
  };

  return (
    <LanguageContext.Provider value={{language, setLanguage: changeLanguage}}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
