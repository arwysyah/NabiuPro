import React from 'react';
import {Controller, useForm} from 'react-hook-form';
import {View} from 'react-native';
import {Radio} from './Radio';

import {useNavigation} from '@react-navigation/native';

type FormValues = {
  answers: 'Yes' | 'No';
};

const answers = [
  {label: 'Yes', value: 'Yes'},
  {label: 'No', value: 'No'},
];

export const Answers = ({ref, outerRef}: any) => {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<FormValues>({
    defaultValues: {answers: undefined},
    mode: 'onTouched',
  });

  const nav = useNavigation();

  const onSubmit = (data: FormValues) => {
    if (data) {
      outerRef?.current?.close();
      nav.navigate('Next');
    }
  };

  return (
    <View style={{flex: 1}}>
      <Controller
        control={control}
        name="answers"
        rules={{required: true}}
        render={({field}) => (
          <Radio
            value={field.value}
            onChange={value => {
              field.onChange(value);
              handleSubmit(onSubmit)();
            }}
            options={answers}
            label={''}
          />
        )}
      />
    </View>
  );
};
