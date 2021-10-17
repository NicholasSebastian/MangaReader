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

export type SortOrder = "popularity" | "favourites" | "score" | "latest" | "newest";

export interface Manga {
  id: number
  title: {
    english: string
    romaji: string
    native: string
  }
  description: string
  status: string
  startDate: Date
  endDate: Date
  coverImage: string
  genres: Array<string>
  synonyms: Array<string>
  averageScore: number
  popularity: number
  trending: number
  favourites: number
  lastUpdated: Date
  isAdult: boolean
  author: string
  externalLinks: Array<Link>
  relations: Array<number>
  recommendations: Array<number>
  chapters: Array<Chapter>
}

interface Date {
  year: number
  month: number
  day: number
}

interface Link {
  url: string
  site: string
}

interface Chapter {
  name: string
  chapterUrl: string
}
