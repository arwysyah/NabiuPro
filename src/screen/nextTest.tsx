import React from 'react';
import {View} from 'react-native';
import OnboardScreen from './OnboardScreen';
import OnboardingStep from '../components/onboarding';
import {FormProvider, useForm} from 'react-hook-form';
import BoardSteps from './BoardSteps';

const Next = () => {
  return (
    <View style={{flex: 1}}>
      <BoardSteps />
    </View>
  );
};

export default Next;
