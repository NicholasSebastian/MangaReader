import React, { FC } from 'react';
import { StyleSheet, Text, ScrollView, View, Image, Pressable, useColorScheme } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as WebBrowser from "expo-web-browser";

import { RootStackScreenProps } from '../../types';
import { formatDescription, removeLineBreaks } from '../functions/utils';
import { Manga } from '../functions/manga';

const BUTTON_SIZE = 28;

const Overview: FC<RootStackScreenProps<'Overview'>> = (props) => {
  const { route, navigation } = props;
  const { manga } = route.params;
  const { colors } = useTheme();
  const mode = useColorScheme();

  return (
    <View style={{ flex: 1 }}>
      <Pressable style={styles.back} onPress={navigation.goBack}>
        <FontAwesome name="long-arrow-left" size={20} color={colors.text} />
        <Text style={[styles.backText, { color: colors.text }]}>Back</Text>
      </Pressable>
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.background}>
          <Image source={{ uri: manga.imageSrc }} style={StyleSheet.absoluteFill} />
          <BlurView intensity={60} tint={mode!} style={StyleSheet.absoluteFill} />
          <LinearGradient colors={["transparent", colors.background]} style={StyleSheet.absoluteFill} />
        </View>
        <Image source={{ uri: manga.imageSrc }} style={styles.image} />
        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
            {manga.title}
          </Text>
          <Text style={[styles.subtext, { color: colors.text }]} numberOfLines={1}>
            {removeLineBreaks(manga.author!)}
          </Text>
          <ButtonGroup manga={manga} />
          <Text style={[styles.subtext, { color: colors.text }]} numberOfLines={6}>
            {formatDescription(manga.summary!)}
          </Text>
          <View style={[styles.extra, { backgroundColor: colors.card }]}>
            <Text style={[styles.subtitle, { color: colors.text}]}>
              Alternative Title{"(s)"}
            </Text>
            <Text style={[styles.subtext, { color: colors.text }]}>
              {manga.alternative ?? "None"}
            </Text>
            <Text style={[styles.subtitle, { color: colors.text, marginTop: 20 }]}>
              Genres
            </Text>
            <View style={styles.genreContainer}>
              {manga.genres?.map((genre, index) => (
                <View key={index} style={styles.genre}>
                  <Text style={[styles.subtext, { color: colors.text }]}>
                    {removeLineBreaks(genre)}
                  </Text>
                </View>
              )) ?? "Uncategorized"}
            </View>
            <Text style={[styles.subtitle, { color: colors.text, marginTop: 20 }]}>
              Status
            </Text>
            <Text style={[styles.subtext, { color: colors.text }]}>
              {manga.status ? "Completed" : "On Going"}
            </Text>
          </View>
          {/* TODO: Fetch similar manga, display here. */}
        </View>
      </ScrollView>
      <View style={styles.mainButtonContainer}>
        <LinearGradient colors={["transparent", colors.background]} style={styles.mainButtonBackdrop} />
        <Pressable style={[styles.mainButton, { backgroundColor: colors.primary }]} 
          onPress={() => navigation.navigate("ChapterList", { chapters: manga.chapters! })}>
          <Text style={styles.mainButtonText}>Read Now</Text>
        </Pressable>
      </View>
    </View>
  );
}

const ButtonGroup: FC<{ manga: Manga }> = (props) => {
  const { colors } = useTheme();
  const { manga } = props;

  const openWebpage = () => {
    const query = manga.title?.replaceAll(/\s/g, '+');
    const url = `https://www.google.com/search?q=${query}+manga`;
    WebBrowser.openBrowserAsync(url);
  }

  return (
    <View style={styles.buttonGroup}>
      <Pressable onPress={() => console.log("Add to favourites")} style={styles.button}>
        <FontAwesome name="heart" size={BUTTON_SIZE - 4} color={colors.text} />
        <Text style={[styles.buttonText, { color: colors.text }]}>Favourite</Text>
      </Pressable>
      <Pressable onPress={() => console.log("Share")} style={styles.button}>
        <FontAwesome name="share-alt" size={BUTTON_SIZE} color={colors.text} />
        <Text style={[styles.buttonText, { color: colors.text }]}>Share</Text>
      </Pressable>
      <Pressable onPress={() => console.log("Add to downloads")} style={styles.button}>
        <FontAwesome name="arrow-circle-down" size={BUTTON_SIZE} color={colors.text} />
        <Text style={[styles.buttonText, { color: colors.text }]}>Download</Text>
      </Pressable>
      <Pressable onPress={openWebpage} style={styles.button}>
        <FontAwesome name="search-plus" size={BUTTON_SIZE} color={colors.text} />
        <Text style={[styles.buttonText, { color: colors.text }]}>Lookup</Text>
      </Pressable>
    </View>
  );
}

export default Overview;

const styles = StyleSheet.create({
  background: {
    width: "100%", 
    aspectRatio: 2 / 3,
    position: "absolute"
  },
  image: {
    alignSelf: "center",
    width: 200,
    aspectRatio: 2 / 3,
    borderWidth: 2,
    borderColor: "#fff",
    borderRadius: 10,
    marginTop: 110,
    marginBottom: 50
  },
  content: {
    width: "90%",
    alignSelf: "center",
    paddingBottom: 100
  },
  title: {
    fontSize: 26,
    fontFamily: "poppins-semibold"
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "poppins-medium",
    marginBottom: 5
  },
  subtext: {
    fontSize: 13,
    fontFamily: "poppins"
  },
  extra: {
    marginTop: 20,
    padding: 20,
    borderRadius: 10
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginVertical: 20
  },
  button: {
    alignItems: "center"
  },
  buttonText: {
    fontSize: 10,
    fontFamily: "poppins",
    marginTop: 5
  },
  genreContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  genre: {
    borderColor: "#808080",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4
  },
  mainButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0
  },
  mainButtonBackdrop: {
    ...StyleSheet.absoluteFillObject,
    top: -100
  },
  mainButton: {
    alignSelf: "center",
    marginBottom: 30,
    width: "90%",
    paddingVertical: 15,
    borderRadius: 10
  },
  mainButtonText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "poppins-semibold",
    alignSelf: "center"
  },
  back: {
    position: 'absolute',
    top: 60,
    left: 20,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 1
  },
  backText: {
    fontSize: 14,
    fontFamily: "poppins-medium",
    paddingLeft: 8
  }
});
