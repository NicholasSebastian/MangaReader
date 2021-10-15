import React, { FC, useContext, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import NetInfo, { NetInfoChangeHandler, NetInfoSubscription } from "@react-native-community/netinfo";
import * as Font from 'expo-font';

import Navigation from './src/navigation';
import fonts from './src/constants/Fonts';
import Collection, { withCollection } from "./src/context/Collection";
import Online from './src/context/Online';

import { fetchContent, parseCarousel, parseContent } from "";
import { filterObject } from "./src/utils/utils";
import { getCollection } from './src/screens/Catalog';

import SplashScreen from './src/components/SplashScreen';

const App: FC = () => {
  const { setTrending, setMostViewed, setLatest, setNewest } = useContext(Collection);
  const [networkListener, setNetworkListener] = useState<NetInfoSubscription | null>(null);
  const [connectionFailed, setConnectionFailed] = useState(false);

  const loadResources = async () => { 
    const { isConnected } = await NetInfo.fetch();

    const load1 = loadFonts();
    if (!isConnected) {
      await load1;
      const subscription = NetInfo.addEventListener(onOffline);
      setNetworkListener(subscription);
    }
    else {
      const load2 = loadCollection();
      await Promise.all([load1, load2]);
    }
  }

  // NOTE: This function takes roughly 17s on average to execute.
  const loadCollection = async () => {
    try {
      const content = await fetchContent(1, "topview")
      const trendingUrls = parseCarousel(content);
      const mostViewedUrls = parseContent(content);
      
      const load1 = getCollection(trendingUrls).then(setTrending);
      const load2 = getCollection(mostViewedUrls).then(setMostViewed);

      const load3 = fetchContent(1, "latest").then(parseContent).then(getCollection).then(setLatest);
      const load4 = fetchContent(1, "newest").then(parseContent).then(getCollection).then(setNewest);

      await Promise.all([load1, load2, load3, load4]);
    }
    catch(e) { 
      // TODO: Network errors are still not being caught here...
      setConnectionFailed(true);
    }
  }

  const onOffline: NetInfoChangeHandler = ({ isConnected }) => {
    const unsubscribe = networkListener; // renamed.
    if (isConnected) {
      loadCollection();
      unsubscribe!();
      setNetworkListener(null);
    }
  } 

  return (
    <SplashScreen loadAsync={loadResources}>
      <SafeAreaProvider>
        <Online.Provider value={networkListener === null && !connectionFailed}>
          <Navigation />
        </Online.Provider>
      </SafeAreaProvider>
    </SplashScreen>
  );
}

async function loadFonts() {
  const newFonts = filterObject(fonts, font => !Font.isLoaded(font[0]));
  await Font.loadAsync(newFonts);
}

export default withCollection(App);
