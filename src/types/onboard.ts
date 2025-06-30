export type OnboardingStepProps = {
  title: string;
  subtitle: string;
  fieldName: string;
  placeholder: string;
  image: any;
  onNext?: () => void;
  onSkip?: () => void;
  isLastStep?: boolean;
};
