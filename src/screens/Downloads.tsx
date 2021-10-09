import React, { FC } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Theme, useTheme } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { ScreenType } from '../navigation';

const Downloads: FC = () => {
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>Downloads</Text>
    </View>
  );
}

function getDownloadsScreen(Screen: ScreenType, theme: Theme) {
  const { colors } = theme;
  return (
    <Screen name="Downloads" component={Downloads}
      options={{
        tabBarIcon: ({ color }) => (
          <FontAwesome name="download" color={color} size={27} style={{ marginBottom: -7 }} />
        )
      }} />
  );
}

export default getDownloadsScreen;

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
