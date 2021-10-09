import React, { FC, useState, useContext } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Font from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import AppLoading from "expo-app-loading";
import { mapLimit, AsyncResultIterator } from "async";

import Collection, { withCollection } from "./src/components/Collection";
import { fetchContent, parseCarousel, parseContent } from "./src/functions/catalog";
import { fetchManga, Manga } from "./src/functions/manga";
import Navigation from './src/navigation';
import fonts from './src/constants/Fonts';

const MAX_CONCURRENT_FETCHES = 4;

async function getCollection(urls: Array<string>) {
  const f: UrlIterator = (url, callback) => fetchManga(url).then(manga => callback(null, manga));
  const collection = await mapLimit(urls, MAX_CONCURRENT_FETCHES, f);
  return collection;
}

const App: FC = () => {
  const { setTrending, setMostViewed, setLatest, setNewest, setAlphabetical } = useContext(Collection);
  const [isLoading, setLoading] = useState(true);

  if (isLoading) {
    return (
      <AppLoading   
        onFinish={() => setLoading(false)}
        onError={console.warn}
        startAsync={async () => {   // NOTE: It takes on average, 19s for the app to load.
          const start = Date.now(); // TODO: Only load trending and most viewed here, lazy load the rest later.

          const content = await fetchContent(1, "topview")
          const trendingUrls = parseCarousel(content);
          const mostViewedUrls = parseContent(content);
          
          const load1 = getCollection(trendingUrls).then(setTrending);
          const load2 = getCollection(mostViewedUrls).then(setMostViewed);

          const load3 = fetchContent(1, "latest").then(parseContent).then(getCollection).then(setLatest);
          const load4 = fetchContent(1, "newest").then(parseContent).then(getCollection).then(setNewest);
          const load5 = fetchContent(1, "az").then(parseContent).then(getCollection).then(setAlphabetical);
          
          const load6 = Font.loadAsync(fonts);

          await Promise.all([load1, load2, load3, load4, load5, load6]);
          
          const end = Date.now();
          console.log(`Load time: ${(end - start) / 1000}s`);
        }} />
    );
  }
  return (
    <SafeAreaProvider>
      <StatusBar />
      <Navigation />
    </SafeAreaProvider>
  );
}

export default withCollection(App);

type UrlIterator = AsyncResultIterator<string, Manga, Error>
