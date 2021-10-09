import React, { memo, NamedExoticComponent } from "react";
import { StyleSheet, View, Text, Image, Pressable, StyleProp, ViewStyle } from "react-native";
import { useTheme } from "@react-navigation/native";
import { Manga } from "../functions/manga";
import { removeLineBreaks, shortenChapterName } from "../functions/utils";

const Card: NamedExoticComponent<ICardProps> = memo((props) => {
  const { manga, style, mode, aspectRatio, showChapter } = props;
  const { colors } = useTheme();

  return (
    <Pressable onPress={() => console.log(`Navigating to Overview with '${manga.title}'`)}>
      <View style={style}>
        <Image source={{ uri: manga.imageSrc }} style={[styles.image, { aspectRatio: aspectRatio || 1 }]} />
        <View>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
            {manga.title}
          </Text>
          {showChapter && manga.chapters && (
            <Text style={styles.subtext}>{shortenChapterName(manga.chapters[0].name)}</Text>
          )}
          <Text style={styles.subtext} numberOfLines={1}>
            {mode === "author" && (
              manga.author ? removeLineBreaks(manga.author) : "Unknown Author"
            )}
            {mode === "genre" && (
              manga.genres ? manga.genres.slice(0, 2).map(removeLineBreaks).join(", ") : "No Genre"
            )}
          </Text>
        </View>
      </View>
    </Pressable>
  );
});

export default Card;

const styles = StyleSheet.create({
  image: {
    borderRadius: 10,
    backgroundColor: "#808080"
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
  aspectRatio?: number
  showChapter?: boolean
}

export type SubtextMode = "author" | "genre";