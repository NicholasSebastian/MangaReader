import React, { FC } from 'react';
import { StyleSheet, Text, ScrollView, View, Image, 
  Pressable, TouchableOpacity, useColorScheme } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as WebBrowser from "expo-web-browser";

import { RootStackScreenProps, Manga } from '../../types';

const BUTTON_SIZE = 27;

const Overview: FC<RootStackScreenProps<'Overview'>> = (props) => {
  const { route, navigation } = props;
  const { manga } = route.params;
  const { colors } = useTheme();
  const mode = useColorScheme();
  const { english, romaji, native } = manga.title;

  // TODO: divide up into smaller components to make it easier to read.
  return (
    <View style={{ flex: 1 }}>
      <Pressable style={styles.back} onPress={navigation.goBack}>
        <FontAwesome name="long-arrow-left" size={20} color={colors.text} />
        <Text style={[styles.backText, { color: colors.text }]}>Back</Text>
      </Pressable>
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.background}>
          <Image source={{ uri: manga.coverImage }} style={StyleSheet.absoluteFill} />
          <BlurView intensity={60} tint={mode!} style={StyleSheet.absoluteFill} />
          <LinearGradient colors={["transparent", colors.background]} style={StyleSheet.absoluteFill} />
        </View>
        <Image source={{ uri: manga.coverImage }} style={styles.image} />
        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
            {english ?? romaji ?? native}
          </Text>
          <Text style={[styles.subtext, { color: colors.text }]} numberOfLines={1}>
            {manga.author ? manga.author : "Unknown Author"}
          </Text>
          <ButtonGroup manga={manga} />
          <Text style={[styles.subtext, { color: colors.text }]} numberOfLines={6}>
            {manga.description ? manga.description.replace(/<br>/g, '\n') : "No Summary"}
          </Text>
          <View style={[styles.extra, { backgroundColor: colors.card }]}>
            <Text style={[styles.subtitle, { color: colors.text}]}>
              Full Title
            </Text>
            <Text style={[styles.subtext, { color: colors.text }]}>
              {english ?? romaji ?? native ?? "None"}
            </Text>
            <Text style={[styles.subtitle, { color: colors.text, marginTop: 20 }]}>
              Alternative Title{"(s)"}
            </Text>
            <Text style={[styles.subtext, { color: colors.text }]}>
              {manga.synonyms ?? "None"}
            </Text>
            <Text style={[styles.subtitle, { color: colors.text, marginTop: 20 }]}>
              Genres
            </Text>
            <View style={styles.genreContainer}>
              {manga.genres?.map((genre, index) => (
                <View key={index} style={styles.genre}>
                  <Text style={[styles.subtext, { color: colors.text }]}>{genre}</Text>
                </View>
              )) ?? "Uncategorized"}
            </View>
            <Text style={[styles.subtitle, { color: colors.text, marginTop: 20 }]}>
              Status
            </Text>
            <Text style={[styles.subtext, { color: colors.text }]}>
              {manga.status ? "Completed" : "Ongoing"}
            </Text>
          </View>
          {/* TODO: Fetch similar manga, display here. */}
        </View>
      </ScrollView>
      <View style={styles.mainButtonContainer}>
        <LinearGradient colors={["transparent", colors.background]} style={styles.mainButtonBackdrop} />
        <TouchableOpacity style={[styles.mainButton, { backgroundColor: colors.primary }]} activeOpacity={0.9}
          onPress={() => navigation.navigate("ChapterList", { name: manga.title.english, chapters: manga.chapters! })}>
          <Text style={styles.mainButtonText}>Read Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const ButtonGroup: FC<{ manga: Manga }> = (props) => {
  const { colors } = useTheme();
  const { manga } = props;
  const { site, url } = manga.externalLinks[0];

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
      <Pressable onPress={() => WebBrowser.openBrowserAsync(url)} style={styles.button}>
        <FontAwesome name="search-plus" size={BUTTON_SIZE} color={colors.text} />
        <Text style={[styles.buttonText, { color: colors.text }]}>{site}</Text>
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
    paddingBottom: 110
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
    marginTop: 30,
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
    paddingHorizontal: 12,
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
