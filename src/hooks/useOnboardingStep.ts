import {useForm} from 'react-hook-form';
import {useState} from 'react';
import {onboardingSteps} from '../constants/step';

export type OnboardingFormData = {
  income: string;
  job: string;
  goal: string;
  habit: string;
  savings: string;
};

const TOTAL_STEPS = onboardingSteps.length;

export const useOnboardingForm = () => {
  const form = useForm<OnboardingFormData>({
    defaultValues: {
      income: '',
      job: '',
      goal: '',
      habit: '',
      savings: '',
    },
  });

  const [step, setStep] = useState(0);

  const nextStep = () => {
    const nextStepIndex = step + 1;
    clearStepField(step);
    if (nextStepIndex < TOTAL_STEPS) {
      const nextFieldName = onboardingSteps[nextStepIndex]
        ?.fieldName as keyof OnboardingFormData;

      if (nextFieldName) {
        form.resetField(nextFieldName);
      }

      setStep(nextStepIndex);
    }
  };

  const prevStep = () => {
    clearStepField(step);
    if (step > 0) {
      setStep(prev => prev - 1);
    }
  };

  const skip = () => {
    setStep(TOTAL_STEPS - 1);
  };
  const clearStepField = (step: number) => {
    const fields = ['income', 'job', 'goal', 'habit', 'savings'];
    form.setValue(fields[step], '');
  };

  return {form, step, nextStep, prevStep, skip, TOTAL_STEPS};
};
