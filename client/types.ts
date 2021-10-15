import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Root: NavigatorScreenParams<RootTabParamList> | undefined;
  Overview: { manga: Manga };
  ChapterList: { chapters: Array<any> };
  Reader: { chapterUrl: string };
  Updates: undefined;
  Settings: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  Screen
>;

export type RootTabParamList = {
  Home: undefined;
  Catalog: { sort: SortOrder } | undefined;
  Favourites: undefined;
  Recents: undefined;
  Downloads: undefined;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<RootTabParamList, Screen>,
  NativeStackScreenProps<RootStackParamList>
>;

export type SortOrder = "latest" | "topview" | "newest";

export interface Manga {
  title?: string
  imageSrc?: string
  alternative?: string
  author?: string
  status?: boolean
  genres?: Array<string>
  lastUpdate?: Date
  views?: number
  summary?: string
  chapters?: Array<Chapter>
}

interface Chapter {
  name: string
  chapterUrl: string
}
