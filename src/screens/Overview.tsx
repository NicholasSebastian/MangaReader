import React, { FC } from 'react';
import { StyleSheet, Text, ScrollView, View, Image, Pressable, useColorScheme } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { RootStackScreenProps } from '../../types';
import { formatDescription, removeLineBreaks } from '../functions/utils';

const Overview: FC<RootStackScreenProps<'Overview'>> = (props) => {
  const { route, navigation } = props;
  const { manga } = route.params;
  const { colors } = useTheme();
  const mode = useColorScheme();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.background}>
        <Image source={{ uri: manga.imageSrc }} style={StyleSheet.absoluteFill} />
        <BlurView intensity={60} tint={mode!} style={StyleSheet.absoluteFill} />
        <LinearGradient colors={["transparent", colors.background]} style={StyleSheet.absoluteFill} />
      </View>
      <Pressable onPress={() => console.log("Go Back") /* TODO: this is not getting triggered */}>
        <View style={styles.back}>
          <FontAwesome name="long-arrow-left" size={20} color={colors.text} />
          <Text style={[styles.backText, { color: colors.text }]}>Back</Text>
        </View>
      </Pressable>
      <Image source={{ uri: manga.imageSrc }} style={styles.image} />
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
          {manga.title}
        </Text>
        <Text style={[styles.subtext, { color: colors.text }]} numberOfLines={1}>
          {removeLineBreaks(manga.author!)}
        </Text>
        <ButtonGroup />
        {/* TODO: "views", "genres", "alternatives", "status" */}
        <Text style={[styles.summary, { color: colors.text }]} numberOfLines={6}>
          {formatDescription(manga.summary!)}
        </Text>
        <Pressable onPress={() => console.log("Show chapters list")}>
          <View style={[styles.mainButton, { backgroundColor: colors.primary }]}>
            <Text style={[styles.mainButtonText, { color: colors.text }]}>Read Now</Text>
          </View>
        </Pressable>
        {/* TODO: Fetch similar manga, display here. */}
      </View>
    </ScrollView>
  );
}

const ButtonGroup: FC = () => {
  const { colors } = useTheme();
  return (
    <View style={styles.buttonGroup}>
      <Pressable onPress={() => console.log("Add to favourites")} style={styles.button}>
        <FontAwesome name="heart" size={26} color={colors.text} />
        <Text style={[styles.buttonText, { color: colors.text }]}>Favourite</Text>
      </Pressable>
      <Pressable onPress={() => console.log("Share")} style={styles.button}>
        <FontAwesome name="share-alt" size={30} color={colors.text} />
        <Text style={[styles.buttonText, { color: colors.text }]}>Share</Text>
      </Pressable>
      <Pressable onPress={() => console.log("Add to downloads")} style={styles.button}>
        <FontAwesome name="arrow-circle-down" size={30} color={colors.text} />
        <Text style={[styles.buttonText, { color: colors.text }]}>Download</Text>
      </Pressable>
      <Pressable onPress={() => console.log("See on MyAnimeList")} style={styles.button}>
        <FontAwesome name="search-plus" size={30} color={colors.text} />
        <Text style={[styles.buttonText, { color: colors.text }]}>Lookup</Text>
      </Pressable>
    </View>
  );
}

export default Overview;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
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
    alignSelf: "center"
  },
  title: {
    fontSize: 26,
    fontFamily: "poppins-semibold"
  },
  subtext: {
    fontFamily: "poppins"
  },
  summary: {
    fontSize: 13,
    fontFamily: "poppins",
    marginBottom: 20
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
  mainButton: {
    alignSelf: "flex-start",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 100
  },
  mainButtonText: {
    fontSize: 13,
    fontFamily: "poppins-medium"
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
