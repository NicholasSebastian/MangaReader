import { LinkingOptions } from '@react-navigation/native';
import * as Linking from 'expo-linking';
import { RootStackParamList } from '../../types';

// https://reactnavigation.org/docs/deep-linking/
// https://reactnavigation.org/docs/configuring-links/

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.makeUrl('/')],
  config: {
    screens: {
      // TODO: implement so that links can point to specific manga pages.
    },
  },
};

export default linking;
