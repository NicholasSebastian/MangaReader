import React, { Component, ContextType } from "react";
import { StyleSheet, View, Pressable } from 'react-native';
import { Theme } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";

import { RootTabScreenProps } from '../../types';
import { ScreenType } from "../navigation";

import { SortOrder } from "../functions/catalog";
import { Manga } from "../functions/manga";
import Collection from "../components/Collection";
import Grid from "../components/Grid";

class Catalog extends Component<RootTabScreenProps<'Catalog'>, ISearchState> {
  declare context: ContextType<typeof Collection>;
  static contextType = Collection;

  private viewsPage = 1;
  private updatesPage = 1;
  private newestPage = 1;
  private alphabeticalPage = 1;

  constructor(props: RootTabScreenProps<'Catalog'>) {
    super(props);
    this.state = {
      sortBy: "topview",
      loading: false,
    };
    this.loadMore = this.loadMore.bind(this);
  }

  private loadMore() {
    if (this.state.loading) return;

    // here
  }

  render() {
    const { mostViewed, latest, newest, alphabetical } = this.context;

    let data: Array<Manga>;
    switch (this.state.sortBy) {
      case "latest":
        data = latest; break;
      case "newest":
        data = newest; break;
      case "az":
        data = alphabetical; break;
      default:
        data = mostViewed; break;
    }

    return (
      <View style={styles.container}>
        {/* Search and Sort here */}
        <Grid data={data} mode="author" style={styles.list} onEndReached={this.loadMore} />
      </View>
    );
  }
}

function getCatalogScreen(Screen: ScreenType, theme: Theme) {
  const { colors } = theme;
  return (
    <Screen name="Catalog" component={Catalog}
      options={({ navigation }: RootTabScreenProps<'Catalog'>) => ({
        title: "Discover",
        tabBarIcon: ({ color }) => (
          <FontAwesome name="compass" color={color} size={28} style={{ marginBottom: -3 }} />
        ),
        headerRight: () => (
          <Pressable onPress={() => console.log("Navigate to Search Page")}
            style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, marginRight: 20 })}>
            <FontAwesome name="search" size={22} color={colors.text} />
          </Pressable>
        )
      })} />
  );
}

export default getCatalogScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // borderWidth: 1,
    // borderColor: 'yellow'
  },
  list: {
    paddingTop: 20,
    paddingBottom: 40
  }
});

interface ISearchState {
  sortBy: SortOrder
  loading: boolean
}