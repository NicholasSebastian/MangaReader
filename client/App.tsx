import React, { FC, useContext, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import NetInfo, { NetInfoChangeHandler, NetInfoSubscription } from "@react-native-community/netinfo";
import * as Font from 'expo-font';

import Collection, { withCollection } from "./src/context/Collection";
import Online from './src/context/Online';
import fonts from './src/constants/Fonts';
import { getTrending, getPopular, getFavourites, getTopRated, getLatest, getNewest } from "./src/utils/firestore";
import { filterObject } from "./src/utils/utils";

import Navigation from './src/navigation';
import SplashScreen from './src/components/SplashScreen';

// TODO: Change this into a Class Component.

const App: FC = () => {
  const { setTrending, setMostViewed, setMostFavourites, setTopRated, setLatest, setNewest } = useContext(Collection);
  const [networkListener, setNetworkListener] = useState<NetInfoSubscription | null>(null);
  const [connectionSuccess, setConnectionSuccess] = useState(true);

  const loadResources = async () => { 
    const { isConnected } = await NetInfo.fetch();
    const load1 = loadFonts();
    
    if (isConnected) {
      const load2 = loadCollection();
      await Promise.all([load1, load2]);
    }
    else {
      await load1;
      const subscription = NetInfo.addEventListener(onOffline);
      setNetworkListener(subscription);
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

  const loadCollection = async () => {
    try {
      const load1 = getTrending().then(setTrending);
      const load2 = getPopular().then(setMostViewed);
      const load3 = getFavourites().then(setMostFavourites);
      const load4 = getTopRated().then(setTopRated);
      const load5 = getLatest().then(setLatest);
      const load6 = getNewest().then(setNewest);

      await Promise.allSettled([load1, load2, load3, load4, load5, load6]);
    }
    catch(e) { 
      setConnectionSuccess(false);
    }
  }

  const isOnline = (networkListener === null);
  return (
    <SplashScreen loadAsync={loadResources}>
      <SafeAreaProvider>
        <Online.Provider value={isOnline && connectionSuccess}>
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
