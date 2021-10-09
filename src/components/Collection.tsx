import React, { FC, ComponentType, createContext, useState, useEffect } from "react";
import { Manga } from "../functions/manga";

// @ts-ignore
const CollectionContext = createContext<ICollectionContext>();

export function withCollection<P extends object>(Component: ComponentType<P>): FC<P> {
  return (props) => {
    const [trending, setTrending] = useState<Array<Manga>>([]);
    const [mostViewed, setMostViewed] = useState<Array<Manga>>([]);
    const [latest, setLatest] = useState<Array<Manga>>([]);
    const [newest, setNewest] = useState<Array<Manga>>([]);
    const [alphabetical, setAlphabetical] = useState<Array<Manga>>([]);
  
    return (
      <CollectionContext.Provider value={{
        trending, mostViewed, latest, newest, alphabetical,
        setTrending, setMostViewed, setLatest, setNewest, setAlphabetical
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
  latest: Array<Manga>
  newest: Array<Manga>
  alphabetical: Array<Manga>
  setTrending: React.Dispatch<React.SetStateAction<Manga[]>>
  setMostViewed: React.Dispatch<React.SetStateAction<Manga[]>>
  setLatest: React.Dispatch<React.SetStateAction<Manga[]>>
  setNewest: React.Dispatch<React.SetStateAction<Manga[]>>
  setAlphabetical: React.Dispatch<React.SetStateAction<Manga[]>>
}