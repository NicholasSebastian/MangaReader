import React, { FC, ComponentType, createContext, useState } from "react";
import { Manga, Genre, SortOrder } from "../../types";

// @ts-ignore
const AppContext = createContext<IAppContext>();

// Some data in the app should be global rather than being stored per component.
// This way, redundant fetches can be avoided, and control and access can be shared throughout the app.
export function withContext<P extends object>(Component: ComponentType<P>): FC<P> {
  return (props) => {
    const [collection, setCollection] = useState<Collection>(emptyCollection);
    const [online, setOnline] = useState<boolean>(false);
  
    return (
      <AppContext.Provider value={{ collection, setCollection, online, setOnline }}>
        <Component {...props} />
      </AppContext.Provider>
    );
  }
}

export default AppContext;

// This looks retarded.
const emptyCollection: Collection = {
  All: { Trending: [], Popularity: [], Favourites: [], Score: [], Latest: [], Newest: [] },
  Action: { Trending: [], Popularity: [], Favourites: [], Score: [], Latest: [], Newest: [] },
  Adventure: { Trending: [], Popularity: [], Favourites: [], Score: [], Latest: [], Newest: [] },
  Comedy: { Trending: [], Popularity: [], Favourites: [], Score: [], Latest: [], Newest: [] },
  Drama: { Trending: [], Popularity: [], Favourites: [], Score: [], Latest: [], Newest: [] },
  Ecchi: { Trending: [], Popularity: [], Favourites: [], Score: [], Latest: [], Newest: [] },
  Fantasy: { Trending: [], Popularity: [], Favourites: [], Score: [], Latest: [], Newest: [] },
  Horror: { Trending: [], Popularity: [], Favourites: [], Score: [], Latest: [], Newest: [] },
  "Mahou Shoujo": { Trending: [], Popularity: [], Favourites: [], Score: [], Latest: [], Newest: [] },
  Mecha: { Trending: [], Popularity: [], Favourites: [], Score: [], Latest: [], Newest: [] },
  Music: { Trending: [], Popularity: [], Favourites: [], Score: [], Latest: [], Newest: [] },
  Mystery: { Trending: [], Popularity: [], Favourites: [], Score: [], Latest: [], Newest: [] },
  Psychological: { Trending: [], Popularity: [], Favourites: [], Score: [], Latest: [], Newest: [] },
  Romance: { Trending: [], Popularity: [], Favourites: [], Score: [], Latest: [], Newest: [] },
  "Sci-Fi": { Trending: [], Popularity: [], Favourites: [], Score: [], Latest: [], Newest: [] },
  "Slice of Life": { Trending: [], Popularity: [], Favourites: [], Score: [], Latest: [], Newest: [] },
  Sports: { Trending: [], Popularity: [], Favourites: [], Score: [], Latest: [], Newest: [] },
  Supernatural: { Trending: [], Popularity: [], Favourites: [], Score: [], Latest: [], Newest: [] },
  Thriller: { Trending: [], Popularity: [], Favourites: [], Score: [], Latest: [], Newest: [] }
};

interface IAppContext {
  collection: Collection
  online: boolean
  setCollection: React.Dispatch<React.SetStateAction<Collection>>
  setOnline: React.Dispatch<React.SetStateAction<boolean>>
}

type Collection = {
  [key in Genre]: SortGroups
}

type SortGroups = { 
  [key in SortOrder]: Array<Manga> 
}
