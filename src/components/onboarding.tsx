import React from 'react';
import {View, Text, TextInput, Image, StyleSheet} from 'react-native';
import {Controller, useFormContext} from 'react-hook-form';
import {OnboardingStepProps} from '../types/onboard';
import Button from './Button';
import CalculatorField from './CalculatorInput';

export default function OnboardingStep({
  title,
  subtitle,
  fieldName,
  placeholder,
  image,
  onNext,
  onSkip,
  isLastStep,
}: OnboardingStepProps) {
  const {control} = useFormContext();

  return (
    <View style={styles.container}>
      <Image source={image} style={styles.image} resizeMode="contain" />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      <CalculatorField
        placeholder="Enter your monthly income"
        name={fieldName}
      />

      <View style={{alignItems: 'center'}}>
        <Button label={isLastStep ? 'Finish' : 'Next'} onPress={onNext} />
      </View>
      {!isLastStep && (
        <Text onPress={onSkip} style={styles.skip}>
          Skip
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  image: {width: 260, height: 220, alignSelf: 'center', marginBottom: 32},
  title: {
    fontSize: 28,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: 'rgba(239, 241, 243,1)',
  },
  error: {color: 'red'},
  skip: {textAlign: 'center', color: '#888', marginTop: 20},
});
