import React, { Component, ContextType } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import NetInfo from "@react-native-community/netinfo";
import * as Font from 'expo-font';
import { ActionSheetProvider } from "@expo/react-native-action-sheet";

import Context, { withContext } from "./src/components/Context";
import fonts from './src/constants/Fonts';
import query from "./src/utils/firestore-manga";
import { filterObject } from "./src/utils/utils";

import Navigation from './src/navigation';
import SplashScreen from './src/components/SplashScreen';

class App extends Component {
  declare context: ContextType<typeof Context>;
  static contextType = Context;

  constructor(props: {}) {
    super(props);
    this.loadResources = this.loadResources.bind(this);
    this.loadCollection = this.loadCollection.bind(this);
    this.loadFonts = this.loadFonts.bind(this);
  }

  private async loadResources() { 
    const { isConnected } = await NetInfo.fetch();
    const load1 = this.loadFonts();
    
    if (isConnected) {
      const load2 = this.loadCollection();
      await Promise.all([load1, load2]);
    }
    else {
      await load1;
      const unsubscribe = NetInfo.addEventListener(
        networkState => {
        if (networkState.isConnected) {
          this.loadCollection();
          unsubscribe();
        }
      });
    }
  }

  private async loadCollection() {
    const { setCollection, setOnline } = this.context;
    const addToCollection = (data: object) => setCollection(prev => ({ ...prev, All: { ...prev.All, ...data } }));

    const load1 = query('Trending').then(Trending => addToCollection({ Trending }));
    const load2 = query('Popularity').then(Popularity => addToCollection({ Popularity }));
    const load3 = query('Favourites').then(Favourites => addToCollection({ Favourites }));
    const load4 = query('Score').then(Score => addToCollection({ Score }));
    const load5 = query('Latest').then(Latest => addToCollection({ Latest }));
    const load6 = query('Newest').then(Newest => addToCollection({ Newest }));

    await Promise.all([load1, load2, load3, load4, load5, load6]);
    setOnline(true);
  }

  private async loadFonts() {
    const unloadedFonts = filterObject(fonts, font => !Font.isLoaded(font[0]));
    await Font.loadAsync(unloadedFonts);
  }

  render() {
    return (
      <SplashScreen loadAsync={this.loadResources}>
        <SafeAreaProvider>
          <ActionSheetProvider>
            <Navigation />
          </ActionSheetProvider>
        </SafeAreaProvider>
      </SplashScreen>
    );
  }
}

export default withContext(App);
