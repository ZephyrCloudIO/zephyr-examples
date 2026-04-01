import {useNavigation, useRoute} from '@react-navigation/native';

// TODO: Remove this hack
// This is a hack to refresh the bottom bar on demand
export const useRefreshBottomBar = () => {
  const route = useRoute();
  const navigation = useNavigation();

  // @ts-ignore
  return () => navigation.navigate(route.name, route.params);
};
