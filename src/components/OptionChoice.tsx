import React from 'react';
import {Controller, useForm} from 'react-hook-form';
import {View} from 'react-native';
import {Radio} from './Radio'; // assumes you have a Radio component

type Option = {
  label: string;
  value: string;
  route: string;
};

type FormValues = {
  answer: string;
};

type OptionChoiceProps = {
  options: Option[];
  onSubmit?: (value: string) => void;
  botRef?: React.Ref<any>;
  initialValue?: string; // ✅ Optional initial value
};

export const OptionChoice: React.FC<OptionChoiceProps> = ({
  options,
  onSubmit,
  botRef,
  initialValue = '', // ✅ Default to empty string if not provided
}) => {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<FormValues>({
    defaultValues: {answer: initialValue}, // ✅ Use initialValue here
    mode: 'onTouched',
  });

  const handleSelection = (data: FormValues) => {
    const selectedValue = data.answer;
    onSubmit?.(selectedValue);
    botRef?.current?.close();
  };

  return (
    <View style={{flex: 1}}>
      <Controller
        control={control}
        name="answer"
        rules={{required: true}}
        render={({field}) => (
          <Radio
            value={field.value}
            onChange={value => {
              field.onChange(value);
              handleSubmit(handleSelection)();
            }}
            options={options}
            label=""
          />
        )}
      />
    </View>
  );
};
