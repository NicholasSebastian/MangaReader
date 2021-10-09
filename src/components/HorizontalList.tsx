import React, { memo, NamedExoticComponent } from "react";
import { StyleSheet, FlatList } from "react-native";
import { width } from "../constants/Dimensions";
import { Manga } from "../functions/manga";
import Card, { SubtextMode } from "./Card";

const CARD_SIZE = 110;
const LIST_GAP = 12;
const WIDE_RATIO = 1.4;

const List: NamedExoticComponent<IListProps> = memo((props) => {
  const { data, wide, mode, showChapters } = props;
  const width = wide ? (CARD_SIZE * WIDE_RATIO) : CARD_SIZE;
  const aspectRatio = wide && { aspectRatio: WIDE_RATIO };

  return (
    <FlatList data={data} horizontal 
      showsHorizontalScrollIndicator={false}
      keyExtractor={(_, index) => index.toString()}
      contentContainerStyle={styles.container}
      renderItem={({ item, index }) => {
        const marginLeft = index > 0 ? LIST_GAP : 0;
        return (
          <Card manga={item} mode={mode} style={{ width, marginLeft }} 
            {...aspectRatio} showChapter={showChapters} />
        );
      }} />
  );
});

export default List;

const styles = StyleSheet.create({
  container: { 
    paddingHorizontal: width * 0.05 
  }
});

interface IListProps {
  data: Array<Manga>
  mode?: SubtextMode
  wide?: boolean,
  showChapters?: boolean
}