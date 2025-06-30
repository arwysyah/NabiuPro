import {useNavigation, NavigationProp} from '@react-navigation/native';

export function useTypedNavigation<
  Nav extends Record<string, object | undefined>,
>() {
  return useNavigation<NavigationProp<Nav>>();
}
