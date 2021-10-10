import React, { memo, NamedExoticComponent, LegacyRef } from "react";
import { StyleSheet, FlatList, View, StyleProp, ViewStyle } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

import { width } from "../constants/Dimensions";
import { Manga } from "../functions/manga";
import Card, { SubtextMode } from "./Card";

const CARD_SIZE_ESTIMATE = 120;
const CARD_GAP = 8;

const numberOfColumns = Math.round(width / CARD_SIZE_ESTIMATE);
const cardWidth = ((width * 0.9) / numberOfColumns) - CARD_GAP;

const renderer = (item: Manga, index: number, mode?: SubtextMode) => {
  const isFirstRow = index < numberOfColumns;
  const marginTop = isFirstRow ? 0 : (CARD_GAP * 2);
  return (
    <Card key={index} manga={item} mode={mode}
      style={[styles.card, { marginTop }]} />
  );
}

const Grid: NamedExoticComponent<IGridProps> = memo((props) => {
  const { data, mode, rows, style, onEndReached, listRef, loading } = props;
  if (rows) {
    const collection = data.slice(0, rows * numberOfColumns);
    return (
      <View style={[styles.container, styles.grid, style]}>
        {collection.map((item, index) => renderer(item, index, mode))}
      </View>
    );
  }
  else {
    return (
      <FlatList data={data} style={{ flex: 1 }} ref={listRef}
        keyExtractor={(item, index) => index.toString()}
        numColumns={numberOfColumns}
        contentContainerStyle={[styles.container, style]}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        renderItem={({ item, index }) => renderer(item, index, mode)}
        onEndReachedThreshold={0.5} onEndReached={onEndReached}
        ListFooterComponent={loading ? Loading : null}
        ListFooterComponentStyle={styles.loading} />
    );
  }
});

const Loading: NamedExoticComponent = memo(() => {
  // TODO: Spin animation.
  return (
    <FontAwesome name="paperclip" color="#808080" size={25} style={{ marginTop: 20 }} />
  );
});

export default Grid;

const styles = StyleSheet.create({
  container: {
    width: width * 0.9,
    alignSelf: "center"
  },
  grid: { 
    flexDirection: "row", 
    flexWrap: "wrap", 
    justifyContent: "space-between" 
  },
  card: {
    width: cardWidth
  },
  loading: {
    alignItems: "center"
  }
});

interface IGridProps {
  data: Array<Manga>
  mode?: SubtextMode
  rows?: number
  style?: StyleProp<ViewStyle>

  // Specifically for 'rows' = undefined; a.k.a. FlatList.
  onEndReached?: ((info: { distanceFromEnd: number }) => void) | null | undefined
  listRef?: LegacyRef<FlatList<Manga>>
  loading: boolean
}