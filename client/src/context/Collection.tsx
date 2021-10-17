import React, { FC, ComponentType, createContext, useState, useEffect } from "react";
import { Manga } from "../../types";

// @ts-ignore
const CollectionContext = createContext<ICollectionContext>();

// All data in the app should be global rather than being stored per component.
// This way, redundant fetches can be avoided, and control and access can be shared throughout the app.
export function withCollection<P extends object>(Component: ComponentType<P>): FC<P> {
  return (props) => {
    const [trending, setTrending] = useState<Array<Manga>>([]);
    const [mostViewed, setMostViewed] = useState<Array<Manga>>([]);
    const [mostFavourites, setMostFavourites] = useState<Array<Manga>>([]);
    const [topRated, setTopRated] = useState<Array<Manga>>([]);
    const [latest, setLatest] = useState<Array<Manga>>([]);
    const [newest, setNewest] = useState<Array<Manga>>([]);
  
    return (
      <CollectionContext.Provider value={{
        trending, mostViewed, mostFavourites, topRated, latest, newest,
        setTrending, setMostViewed, setMostFavourites, setTopRated, setLatest, setNewest
      }}>
        <Component {...props} />
      </CollectionContext.Provider>
    );
  }
}

export default CollectionContext;

interface ICollectionContext {
  trending: Array<Manga>
  mostViewed: Array<Manga>
  mostFavourites: Array<Manga>
  topRated: Array<Manga>
  latest: Array<Manga>
  newest: Array<Manga>
  setTrending: React.Dispatch<React.SetStateAction<Manga[]>>
  setMostViewed: React.Dispatch<React.SetStateAction<Manga[]>>
  setMostFavourites: React.Dispatch<React.SetStateAction<Manga[]>>
  setTopRated: React.Dispatch<React.SetStateAction<Manga[]>>
  setLatest: React.Dispatch<React.SetStateAction<Manga[]>>
  setNewest: React.Dispatch<React.SetStateAction<Manga[]>>
}