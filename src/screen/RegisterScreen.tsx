import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useForm} from 'react-hook-form';
import InputField from '../components/inputField';
import PasswordField from '../components/passwordField';
// import SocialButton from '../components/socialButton';
import {SignUpFormData} from '../types/form';
import {SignUpSchema} from '../utils/validationSchema';
import {yupResolver} from '@hookform/resolvers/yup';
import {Image} from 'react-native';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {AuthStackParams} from '../types/auth';
import Button from '../components/Button';
// import {useRegister} from '../hooks/useRegister';
import {useTranslation} from 'react-i18next';

const SignUpScreen = () => {
  const {
    control,
    handleSubmit,
    watch,
    formState: {errors},
  } = useForm<SignUpFormData>({
    resolver: yupResolver(SignUpSchema),
  });

  const navigation = useNavigation<NavigationProp<AuthStackParams>>();
  // const {register, isLoading, errorResponse} = useRegister();

  const onSubmit = async (data: SignUpFormData) => {
    // const success = await register(data);
    // if (success && !isLoading && errorResponse === '') {
    //   navigation.navigate('Home');
    // }
  };
  const gotoLogin = () => {
    navigation.goBack();
  };
  const {t} = useTranslation();

  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        resizeMode="contain"
        source={require('../assets/logo.png')}
      />
      <Text style={styles.title}>{t('register.title')}</Text>

      <InputField
        name="name"
        control={control}
        placeholder="Full Name"
        keyboardType="email-address"
        autoCapitalize="none"
        error={errors.name?.message}
      />

      <InputField
        name="email"
        control={control}
        placeholder="Email Address"
        keyboardType="email-address"
        autoCapitalize="none"
        error={errors.email?.message}
      />

      <PasswordField
        name="password"
        control={control}
        placeholder="Password"
        error={errors.password?.message}
      />

      <PasswordField
        name="confirmPassword"
        control={control}
        placeholder="Confirm Password"
        error={errors.confirmPassword?.message}
        matchPassword={watch('password')}
      />

      <View style={{alignItems: 'center'}}>
        <Button label="Register" onPress={handleSubmit(onSubmit)} />
      </View>
      <Text style={styles.orText}>or</Text>

      <View style={styles.socials}>
        {/* <SocialButton provider="google" />
        <SocialButton provider="facebook" /> */}
      </View>

      <Text style={styles.loginText}>
        {t('login.desc')}
        <Text onPress={gotoLogin} style={styles.loginLink}>
          {t('login.title')}
        </Text>
      </Text>
    </View>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {padding: 24, flex: 1, justifyContent: 'center'},
  title: {fontSize: 32, fontWeight: 'bold', marginBottom: 20},
  button: {
    backgroundColor: '#367BF5',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {color: '#fff', fontWeight: 'bold'},
  orText: {textAlign: 'center', marginVertical: 16},
  socials: {flexDirection: 'row', justifyContent: 'center', gap: 20},
  loginText: {marginTop: 20, textAlign: 'center'},
  loginLink: {color: '#367BF5', fontWeight: '500'},
  logo: {
    height: 120,
    width: 120,
  },
});
