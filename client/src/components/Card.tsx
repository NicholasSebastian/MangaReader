import React, { memo, NamedExoticComponent } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity, StyleProp, ViewStyle } from "react-native";
import { useTheme, useNavigation } from "@react-navigation/native";
import { Manga } from "../../types";

// TODO: change design.

const Card: NamedExoticComponent<ICardProps> = memo((props) => {
  const { manga, style, mode, showChapter } = props;
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { english, romaji, native } = manga.title;

  return (
    <TouchableOpacity onPress={() => navigation.navigate("Overview", { manga })} activeOpacity={0.8}>
      <View style={style}>
        <Image source={{ uri: manga.coverImage }} style={styles.image} />
        <View>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
            {english ?? romaji ?? native}
          </Text>
          {showChapter && manga.chapters && manga.chapters[0] && (
            <Text style={styles.subtext} numberOfLines={1}>{manga.chapters[0].name}</Text>
          )}
          <Text style={styles.subtext} numberOfLines={1}>
            {mode === "author" && (
              manga.author ? manga.author : "Unknown Author"
            )}
            {mode === "genre" && (
              manga.genres ? manga.genres.slice(0, 2).join(", ") : "No Genre"
            )}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

export default Card;

const styles = StyleSheet.create({
  image: {
    borderRadius: 10,
    backgroundColor: "#808080",
    aspectRatio: 2 / 3
  },
  title: {
    fontSize: 13,
    fontFamily: "poppins-semibold",
    marginTop: 2
  },
  subtext: {
    color: "#808080",
    fontSize: 11,
    fontFamily: "poppins"
  }
});

interface ICardProps {
  manga: Manga
  style: StyleProp<ViewStyle>
  mode?: SubtextMode
  showChapter?: boolean
}

export type SubtextMode = "author" | "genre";