import React, { FC } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Theme, useTheme } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { ScreenType } from '../navigation';

const Favourites: FC = () => {
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>Favourites</Text>
    </View>
  );
}

function getFavouritesScreen(Screen: ScreenType, theme: Theme) {
  const { colors } = theme;
  return (
    <Screen name="Favourites" component={Favourites}
      options={{
        tabBarIcon: ({ color }) => (
          <FontAwesome name="heart" color={color} size={24} style={{ marginBottom: -3 }} />
        )
      }} />
  );
}

export default getFavouritesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontFamily: 'poppins-bold',
  }
});
