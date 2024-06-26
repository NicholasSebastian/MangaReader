import React, { FC } from 'react';
import { StyleSheet, TouchableHighlight, Text, FlatList } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { RootStackScreenProps } from '../../types';
import { width } from "../constants/Dimensions";

const ChapterList: FC<RootStackScreenProps<'ChapterList'>> = (props) => {
  const { route, navigation } = props;
  const { colors } = useTheme();
  const { chapters } = route.params;

  const openReader = (chapterUrl: string) => {
    navigation.goBack();
    setTimeout(() => navigation.navigate("Reader", { chapterUrl }), 0);
  }

  console.log(chapters);
  return (
    <FlatList data={chapters}
      keyExtractor={(item, index) => index.toString()}
      contentContainerStyle={styles.container}
      renderItem={({ item, index }) => (
        <TouchableHighlight style={styles.element} underlayColor={colors.card}
          onPress={() => openReader(item.chapterUrl)}>
          <Text style={[styles.text, { color: colors.text }]} numberOfLines={1}>
            {item.name}
          </Text>
        </TouchableHighlight>
      )} />
  );
}

export default ChapterList;

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    paddingBottom: 50
  },
  element: {
    paddingVertical: 14,
    paddingHorizontal: width * 0.02,
    width: "94%",
    alignSelf: "center",
    borderRadius: 10
  },
  text: {
    fontFamily: 'poppins'
  }
});
