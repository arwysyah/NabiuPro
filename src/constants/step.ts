import {OnboardingStepProps} from '../types/onboard';

export const onboardingSteps: OnboardingStepProps[] = [
  {
    title: 'What is your total monthly income?',
    subtitle: 'Let us know — enter an amount (0 if none).',
    fieldName: 'income',
    placeholder: 'Write your answer here...',
    image: require('../assets/onboard/onboard_wallet.png'),
  },
  {
    title: 'What is your current job?',
    subtitle: 'Tell us about your primary source of income.',
    fieldName: 'job',
    placeholder: 'Job title or company...',
    image: require('../assets/onboard/onboard_wallet.png'),
  },

  {
    title: "What's your main financial goal?",
    subtitle: 'Saving, investing, or something else?',
    fieldName: 'goal',
    placeholder: 'E.g. Save for a car...',
    image: require('../assets/onboard/onboard_wallet.png'),
  },
  {
    title: 'What habit are you working on?',
    subtitle: 'This helps us personalize your journey.',
    fieldName: 'habit',
    placeholder: 'E.g. Track spending...',
    image: require('../assets/onboard/onboard_wallet.png'),
  },
  {
    title: 'Do you have savings?',
    subtitle: "We'll help you grow them.",
    fieldName: 'savings',
    placeholder: 'Enter savings amount...',
    image: require('../assets/onboard/onboard_wallet.png'),
  },
];
