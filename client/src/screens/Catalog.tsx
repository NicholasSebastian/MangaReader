import React, { Component, ContextType, createRef, ComponentType, FC } from "react";
import { StyleSheet, View, Pressable, Text, FlatList } from 'react-native';
import { Theme, useTheme, RouteProp } from "@react-navigation/native";
import { createMaterialTopTabNavigator, MaterialTopTabBarProps, MaterialTopTabNavigationOptions } from "@react-navigation/material-top-tabs";
import { FontAwesome } from "@expo/vector-icons";
import { connectActionSheet, ActionSheetProps } from "@expo/react-native-action-sheet";

import { RootTabScreenProps, Genre, SortOrder, Manga } from '../../types';
import { ScreenType } from "../navigation";
import { width } from "../constants/Dimensions";
import query from "../utils/firestore-manga";

import Context from "../components/Context";
import Grid from "../components/Grid";
import Message, { Loading } from "../components/Message";

const TAB_WIDTH = 110;
const sortOptions: Array<SortOrder> = ["Trending", "Popularity", "Latest", "Favourites", "Score", "Newest"];

const TopTab = createMaterialTopTabNavigator<TopTabParamList>();

const navigatorOptions: MaterialTopTabNavigationOptions = {
  tabBarScrollEnabled: true,
  tabBarItemStyle: { width: TAB_WIDTH }
};

const Catalog: FC<RootTabScreenProps<'Catalog'>> = () => {
  const Page = connectActionSheet(withTheme(CatalogPage));
  return (
    <TopTab.Navigator initialRouteName="All" screenOptions={navigatorOptions}>
      <TopTab.Screen name="All" component={Page} />
      <TopTab.Screen name="Action" component={Page} />
      <TopTab.Screen name="Adventure" component={Page} />
      <TopTab.Screen name="Comedy" component={Page} />
      <TopTab.Screen name="Drama" component={Page} />
      <TopTab.Screen name="Ecchi" component={Page} />
      <TopTab.Screen name="Fantasy" component={Page} />
      <TopTab.Screen name="Horror" component={Page} />
      <TopTab.Screen name="Mahou Shoujo" component={Page} />
      <TopTab.Screen name="Mecha" component={Page} />
      <TopTab.Screen name="Music" component={Page} />
      <TopTab.Screen name="Mystery" component={Page} />
      <TopTab.Screen name="Psychological" component={Page} />
      <TopTab.Screen name="Romance" component={Page} />
      <TopTab.Screen name="Sci-Fi" component={Page} />
      <TopTab.Screen name="Slice of Life" component={Page} />
      <TopTab.Screen name="Sports" component={Page} />
      <TopTab.Screen name="Supernatural" component={Page} />
      <TopTab.Screen name="Thriller" component={Page} />
    </TopTab.Navigator>
  );
}

class CatalogPage extends Component<PageProps, IPageState> {
  listRef: React.RefObject<FlatList<Manga>>;
  declare context: ContextType<typeof Context>;
  static contextType = Context;

  constructor(props: PageProps) {
    super(props);
    this.state = {
      isLoading: false,
      sort: "Popularity"
    };
    this.listRef = createRef();
    this.sortButtonHandler = this.sortButtonHandler.bind(this);
    this.loadMore = this.loadMore.bind(this);
  }

  private sortButtonHandler() {
    const { showActionSheetWithOptions } = this.props;
    showActionSheetWithOptions({ options: sortOptions }, index => {
      if (index === undefined) return;
      const selected = sortOptions[index];
      this.setState({ sort: selected });
      this.listRef.current?.scrollToOffset({ offset: 0, animated: false });
    });
  }

  private async loadMore() {
    const { name } = this.props.route;
    const { isLoading, sort } = this.state;
    const { collection, setCollection } = this.context;

    if (isLoading) return;
    this.setState({ isLoading: true });

    const current = collection[name][sort];
    const startAfter = current ? current[current.length - 1].id : undefined;
    const data = await query(sort, name, startAfter);
    
    const newCollection = [...current, ...data];
    setCollection(prev => { 
      prev[name][sort] = newCollection;
      return prev;
    });

    this.setState({ isLoading: false });
  }

  render() {
    const { route, theme } = this.props;
    const { isLoading, sort } = this.state;
    const { online, collection } = this.context;

    if (!online) {
      return <Message text="You are currently offline." />
    }
    
    const data = collection[route.name][sort];
    if (!data) {
      this.loadMore();
      return <Loading />;
    }
    return (
      <View style={styles.container}>
        <Pressable onPress={this.sortButtonHandler} style={styles.sort}>
          <Text style={[styles.text, { color: theme.colors.text }]}>Sort by: {sort}</Text>
        </Pressable>
        <Grid data={data} mode="author" listRef={this.listRef}
          style={styles.grid} onEndReached={this.loadMore} loading={isLoading} />
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
          <Pressable onPress={() => console.log("Navigate to Search Page")} // TODO
            style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, marginRight: 20 })}>
            <FontAwesome name="search" size={22} color={colors.text} />
          </Pressable>
        )
      })} />
  );
}

function withTheme<P extends object>(Component: ComponentType<P>): FC<P> {
  return (props) => {
    const theme = useTheme();
    return <Component {...props} theme={theme} />
  }
}

export default getCatalogScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  sort: {
    width: width * 0.9,
    alignSelf: "center",
    paddingTop: 12,
    paddingBottom: 8
  },
  text: {
    fontSize: 12,
    fontFamily: "poppins-medium",
    textAlign: "right"
  },
  grid: {
    paddingTop: 10,
    paddingBottom: 40
  }
});

type TopTabParamList = {
  [genre in Genre]: undefined;
};

type PageProps = MaterialTopTabBarProps & ActionSheetProps & RouteProps & ThemeProps;
type RouteProps = { route: RouteProp<TopTabParamList> };
type ThemeProps = { theme: Theme };

interface IPageState {
  isLoading: boolean
  sort: SortOrder
}