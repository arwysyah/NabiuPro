import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SplashScreen from '../SplashScreen';
import OnboardScreen from '../OnboardScreen';

const Stack = createNativeStackNavigator();

function OnboardStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="LandingScreen"
        component={OnboardScreen}
        options={{
          title: '',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="SplashScreen"
        component={SplashScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
export default OnboardStack;
