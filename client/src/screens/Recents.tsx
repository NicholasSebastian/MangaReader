import React, { FC } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Theme, useTheme } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { ScreenType } from '../navigation';

const Recent: FC = () => {
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>Recent</Text>
    </View>
  );
}

function getRecentsScreen(Screen: ScreenType, theme: Theme) {
  const { colors } = theme;
  return (
    <Screen name="Recents" component={Recent}
      options={{
        title: "Recent",
        tabBarIcon: ({ color }) => (
          <FontAwesome name="clock-o" color={color} size={28} style={{ marginBottom: -2 }} />
        )
      }} />
  );
}

export default getRecentsScreen;

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
