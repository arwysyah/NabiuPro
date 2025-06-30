import {StackActions, useNavigation} from '@react-navigation/native';
import {InteractionManager} from 'react-native';

function useGoBackTwiceAndNavigate() {
  const navigation = useNavigation();

  const goBackTwiceAndNavigate = (targetScreen: string, params = {}) => {
    navigation.dispatch(StackActions.pop(2));

    InteractionManager.runAfterInteractions(() => {
      navigation.navigate(targetScreen, params);
    });
  };

  return goBackTwiceAndNavigate;
}
export {useGoBackTwiceAndNavigate};
