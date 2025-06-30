// src/navigation/RootNavigator.tsx

import React, {useEffect, useState} from 'react';
import SplashScreen from '../screen/SplashScreen';
import AppStack from './Stack/AppStack';
import AuthStack from './Stack/AuthStack';

import {useUserQuery} from '../hooks/useUserQueryDb';

export default function RootNavigator() {
  const [delayComplete, setDelayComplete] = useState(false);
  const {user: userDb, loading: loadingDb, error: errorDb} = useUserQuery();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDelayComplete(true);
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  if (!delayComplete) {
    return <SplashScreen />;
  }

  return userDb ? <AppStack /> : <AuthStack />;
}
