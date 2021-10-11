import React, { FC } from 'react';
import { StyleSheet, Text, ScrollView } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { RootStackScreenProps } from '../../types';

const ChapterList: FC<RootStackScreenProps<'ChapterList'>> = (props) => {
  const { route, navigation } = props;
  const { colors } = useTheme();
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>Chapter List</Text>
      <Text style={{ color: colors.text }}>{JSON.stringify(route.params.chapters)}</Text>
    </ScrollView>
  );
}

export default ChapterList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20
  },
  title: {
    fontSize: 20,
    fontFamily: 'poppins-bold',
  }
});
