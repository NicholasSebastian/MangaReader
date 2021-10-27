import React, { memo, NamedExoticComponent } from "react";
import { StyleSheet, FlatList } from "react-native";
import { Manga } from "../../types";
import { width } from "../constants/Dimensions";
import Card, { SubtextMode } from "./Card";

const LIST_GAP = 12;
const CARD_WIDTH = 110;

const List: NamedExoticComponent<IListProps> = memo((props) => {
  const { data, mode, showChapters } = props;

  return (
    <FlatList data={data} horizontal 
      showsHorizontalScrollIndicator={false}
      keyExtractor={(_, index) => index.toString()}
      contentContainerStyle={styles.container}
      renderItem={({ item, index }) => {
        const marginLeft = index > 0 ? LIST_GAP : 0;
        return (
          <Card manga={item} mode={mode} style={{ width: CARD_WIDTH, marginLeft }} 
            showChapter={showChapters} />
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
  showChapters?: boolean
}