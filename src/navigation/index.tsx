import React, { FC } from 'react';
import { useColorScheme } from 'react-native';
import { NavigationContainer, useTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { RootStackParamList, RootTabParamList } from '../../types';
import { DefaultTheme, DarkTheme } from '../constants/Colors';
import LinkingConfiguration from './linkingConfiguration';

import getHome from '../screens/Home';
import getCatalog from '../screens/Catalog';
import getFavourites from '../screens/Favourites';
import getRecents from '../screens/Recents';
import getDownloads from '../screens/Downloads';

import Overview from '../screens/Overview';
import Reader from "../screens/Reader";
import Updates from '../screens/Updates';
import Settings from '../screens/Settings';

const Stack = createNativeStackNavigator<RootStackParamList>();
const BottomTab = createBottomTabNavigator<RootTabParamList>();

const RootNavigator: FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Group screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Root" component={BottomTabNavigator} />
        <Stack.Screen name="Overview" component={Overview} />
        <Stack.Screen name="Reader" component={Reader} />
      </Stack.Group>
      <Stack.Group screenOptions={{ presentation: 'modal', headerShown: false }}>
        <Stack.Screen name="Updates" component={Updates} />
        <Stack.Screen name="Settings" component={Settings} />
      </Stack.Group>
    </Stack.Navigator>
  );
}

const BottomTabNavigator: FC = () => {
  const theme = useTheme();

  const HomeScreen = getHome(BottomTab.Screen, theme);
  const CatalogScreen = getCatalog(BottomTab.Screen, theme);
  const FavouritesScreen = getFavourites(BottomTab.Screen, theme);
  const RecentsScreen = getRecents(BottomTab.Screen, theme);
  const DownloadsScreen = getDownloads(BottomTab.Screen, theme);

  return (
    <BottomTab.Navigator initialRouteName="Home"
      screenOptions={{ tabBarActiveTintColor: theme.colors.text }}>
      {HomeScreen}
      {CatalogScreen}
      {FavouritesScreen}
      {RecentsScreen}
      {DownloadsScreen}
    </BottomTab.Navigator>
  );
}

const Navigation: FC = () => {
  const colorScheme = useColorScheme();
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

export default Navigation;

export type ScreenType = typeof BottomTab.Screen;