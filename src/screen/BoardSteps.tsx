// screens/OnboardingScreen.tsx
import React from 'react';
import {View} from 'react-native';
import {FormProvider} from 'react-hook-form';

import OnboardingStep from '../components/onboarding';
import {useOnboardingForm} from '../hooks/useOnboardingStep';
import {onboardingSteps} from '../constants/step';
import CalculatorInput from '../components/CalculatorInput';

export default function BoardSteps() {
  const {form, step, nextStep, skip, TOTAL_STEPS} = useOnboardingForm();
  const currentStep = onboardingSteps[step];
  const isLastStep = step === TOTAL_STEPS - 1;

  const handleNext = () => {
    if (isLastStep) {
      // Optionally navigate away
    } else {
      nextStep();
    }
  };

  return (
    <FormProvider {...form}>
      <View style={{flex: 1}}>
        <OnboardingStep
          {...currentStep}
          onNext={handleNext}
          onSkip={skip}
          isLastStep={isLastStep}
        />
      </View>
    </FormProvider>
  );
}
