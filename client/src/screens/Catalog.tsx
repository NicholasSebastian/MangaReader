import React, { Component, ContextType, createRef } from "react";
import { StyleSheet, View, Pressable, FlatList } from 'react-native';
import { Theme } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import { AsyncResultIterator, mapLimit } from "async";

import { RootTabScreenProps, Manga, SortOrder } from '../../types';
import { ScreenType } from "../navigation";
import Collection from "../context/Collection";
import Online from '../context/Online';

import { fetchContent, parseContent } from "../../functions/src/sources/manganelo/catalog";
import { fetchManga } from "";

import Grid from "../components/Grid";
import SlidingOption from "../components/SlidingOption";
import Message from "../components/Message";

const MAX_CONCURRENT_FETCHES = 4;

export async function getCollection(urls: Array<string>) {
  const f: UrlIterator = (url, callback) => fetchManga(url).then(manga => callback(null, manga));
  const collection = await mapLimit(urls, MAX_CONCURRENT_FETCHES, f);
  return collection;
}

class Catalog extends Component<RootTabScreenProps<'Catalog'>, ISearchState> {
  declare context: ContextType<typeof Collection>;
  listRef: React.RefObject<FlatList<Manga>>;

  private viewsPage = 1;
  private updatesPage = 1;
  private newestPage = 1;

  static contextType = Collection;

  constructor(props: RootTabScreenProps<'Catalog'>) {
    super(props);
    this.state = {
      sortBy: "topview",
      loading: false,
    };
    this.listRef = createRef();
    this.loadMore = this.loadMore.bind(this);
    this.handleSortChange = this.handleSortChange.bind(this);
  }

  private loadMore() {
    if (this.state.loading) return;

    this.setState({ loading: true });
    const { mostViewed, latest, newest, setMostViewed, setLatest, setNewest } = this.context;

    let currentPage: number;
    switch (this.state.sortBy) {
      case "latest":
        currentPage = this.updatesPage; break;
      case "newest":
        currentPage = this.newestPage; break;
      default:
        currentPage = this.viewsPage; break;
    }

    fetchContent(currentPage + 1, this.state.sortBy)
    .then(parseContent)
    .then(getCollection)
    .then(collection => {
      switch (this.state.sortBy) {
        case "latest":
          setLatest([...latest, ...collection]); 
          this.updatesPage = currentPage + 1;
          break;
        case "newest":
          setNewest([...newest, ...collection]); 
          this.newestPage = currentPage + 1;
          break;
        default:
          setMostViewed([...mostViewed, ...collection]);
          this.viewsPage = currentPage + 1;
          break;
      }
    })
    .finally(() => this.setState({ loading: false }));
  }

  private handleSortChange(index: number) {
    const sortMapping: Array<SortOrder> = ["topview", "latest", "newest"];
    this.setState({ sortBy: sortMapping[index] });
    this.listRef.current?.scrollToOffset({ offset: 0, animated: false });
  }

  render() {
    const { mostViewed, latest, newest } = this.context;
    const { sortBy, loading } = this.state;
    const { params } = this.props.route;
    
    const sortMapping: Array<SortOrder> = ["topview", "latest", "newest"];
    const overrideSortBy = params && sortMapping.indexOf(params.sort);

    let data: Array<Manga>;
    switch (sortBy) {
      case "latest":
        data = latest; break;
      case "newest":
        data = newest; break;
      default:
        data = mostViewed; break;
    }

    return (
      <Online.Consumer>
        {isConnected => 
          isConnected ? (
            <View style={styles.container}>
              <SlidingOption options={["Popular", "Updated", "Newest"]} override={overrideSortBy}
                style={styles.options} onIndexChange={this.handleSortChange} />
              <Grid data={data} mode="author" listRef={this.listRef}
                style={styles.grid} onEndReached={this.loadMore} loading={loading} />
            </View>
          ) : (
            <Message text="You are currently offline." />
          )}
      </Online.Consumer>
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
    flex: 1
  },
  grid: {
    paddingTop: 10,
    paddingBottom: 40
  },
  options: {
    marginTop: 20,
    marginBottom: 10
  }
});

interface ISearchState {
  sortBy: SortOrder
  loading: boolean
}

type UrlIterator = AsyncResultIterator<string, Manga, Error>