import React, { FC, useContext } from 'react';
import { StyleSheet, ScrollView, View, Pressable, Image, Text } from 'react-native';
import { useTheme, Theme } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';

import { RootTabScreenProps } from '../../types';
import { ScreenType } from '../navigation';
import { width } from '../constants/Dimensions';
import Collection from "../context/Collection";
import Online from '../context/Online';

import Heading from '../components/Heading';
import Carousel from "../components/Carousel";
import Grid from '../components/Grid';
import HorizontalList from '../components/HorizontalList';
import Message from '../components/Message';

const Home: FC<RootTabScreenProps<'Home'>> = (props) => {
  const { trending, mostViewed, latest, newest } = useContext(Collection);
  const isConnected = useContext(Online);
  const { colors } = useTheme();
  const { navigation } = props;

  if (!isConnected) {
    return <Message text="You are currently offline." />;
  }
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.section}>
        <Heading title="Now Trending" description="See what everyone's been reading" />
        <Carousel data={trending} />
      </View>
      {/* TODO: Continue Reading */}
      <View style={styles.section}>
        <Heading title="Most Popular Manga" description="Guaranteed to be interesting"
          onMore={() => navigation.navigate("Catalog", { sort: "topview" })} />
        <Grid data={mostViewed} mode="genre" rows={2} />
      </View>
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Heading title="Updated Manga" description="Don't miss this week's update"
          onMore={() => navigation.navigate("Catalog", { sort: "latest" })} />
        <HorizontalList data={latest} mode="genre" showChapters />
      </View>
      <View style={styles.section}>
        <Heading title="New Releases!" description="Read our latest recommendations"
          onMore={() => navigation.navigate("Catalog", { sort: "newest" })} />
        <HorizontalList data={newest} mode="genre" />
      </View>
    </ScrollView>
  );
}

function getHomeScreen(Screen: ScreenType, theme: Theme) {
  const { colors } = theme;
  return (
    <Screen name="Home" component={Home}
      options={({ navigation }: RootTabScreenProps<'Home'>) => ({
        headerTitle: "",
        tabBarIcon: ({ color }) => (
          <FontAwesome name="home" color={color} size={28} style={{ marginBottom: -3 }} />
        ),
        headerLeft: () => (
          <Image source={require("../assets/images/logo.png")} style={{ 
            marginLeft: width * 0.05, tintColor: colors.text, height: 20, aspectRatio: 7 
          }} />
        ),
        headerRight: () => (
          <View style={{ marginRight: width * 0.05, flexDirection: "row", alignItems: "center" }}>
            <Pressable onPress={() => navigation.navigate('Updates')}
              style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, marginRight: 15 })}>
              <FontAwesome name="bell" size={22} color={colors.text} />
            </Pressable>
            <Pressable onPress={() => navigation.navigate('Settings')}
              style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}>
              <FontAwesome name="gear" size={25} color={colors.text} />
            </Pressable>
          </View>
        )
    })} />
  );
}

export default getHomeScreen;

const styles = StyleSheet.create({
  container: { 
    paddingBottom: 10 
  },
  section: {
    paddingVertical: 30
  }
});