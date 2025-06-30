import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useForm} from 'react-hook-form';
// import InputField from '../components/inputField';
// import PasswordField from '../components/passwordField';
import type {SignInFormData} from '../types/form';
import {SignInSchema} from '../utils/validationSchema';
import {yupResolver} from '@hookform/resolvers/yup';
import {Image} from 'react-native';
import Button from '../components/Button';
import {useTypedNavigation} from '../hooks/useTypedNavigation';
import type {AuthStackParams} from '../types/auth';
import {createDeviceUser} from '../lib/schema';
import {useTranslation} from 'react-i18next';
import FontFamily from '../assets/typography';
// import {BotAssistant} from '../components/NobiPopUp';
import {CommonActions} from '@react-navigation/native';

const SignInScreen = () => {
  const {
    control,
    handleSubmit,
    // watch,
    formState: {errors},
    resetField: resetForm,
  } = useForm<SignInFormData>({
    resolver: yupResolver(SignInSchema),
  });

  // const onSubmit = (data: SignInFormData) => {};
  const nav = useTypedNavigation<AuthStackParams>();
  // const handleGotoRegister = () => {
  //   nav.navigate('Register');
  //   resetForm();
  // };
  const handlePres = async () => {
    try {
      await createDeviceUser();
      nav.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'Main'}],
        }),
      );
    } catch (error) {
      console.log(error);
    }
  };

  const {t} = useTranslation();
  return (
    <View style={styles.container}>
      <Image
        style={styles.banner}
        source={require('../assets/onboard/onboard.png')}
        resizeMode="contain"
      />
      {/* <BotAssistant></BotAssistant> */}
      <View style={styles.bannerContainerText}>
        <Text style={styles.bannerText}>
          {t('transaction.botMessageLogin')}
        </Text>
      </View>
      <Button label={t('started')} onPress={handlePres} />
    </View>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
  banner: {
    height: '60%',
    width: '100%',
  },
  bannerContainerText: {
    width: '80%',
    alignSelf: 'center',
    marginBottom: 20,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
  },
  buttonStart: {
    width: '100%',
    height: 51,
    backgroundColor: '#3E8BFF',
    alignItems: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    marginTop: '18.5%',
    marginBottom: 30,
  },
  bannerText: {
    fontSize: 34,
    // paddingTop: '20%',
    fontWeight: '400',
    color: 'black',
    textAlign: 'center',
    fontFamily: FontFamily.KAUSHAN_REGULAR,
  },
});
