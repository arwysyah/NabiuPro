import {createNativeStackNavigator} from '@react-navigation/native-stack';

import SignUpScreen from '../../screen/RegisterScreen';
import SignInScreen from '../../screen/LoginScreen';
import OnboardScreen from '../../screen/OnboardScreen';
import AppStack from './AppStack';

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="Onboard">
      <Stack.Screen name="Login" component={SignInScreen} />
      <Stack.Screen name="Register" component={SignUpScreen} />
      <Stack.Screen name="Onboard" component={OnboardScreen} />
      <Stack.Screen name="Main" component={AppStack} />
    </Stack.Navigator>
  );
}
