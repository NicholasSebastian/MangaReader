import firebase from "firebase";
import "firebase/firestore";
import allSettled, { PromiseResolution } from "promise.allsettled";

import { Manga, Genre, SortOrder } from "../../types";
import { db } from "./firebase";
import { fetchImage } from "./manganato-image";
import { toBase64 } from "./utils";

const PAGINATION = 18;
const collectionRef = db.collection("manga");

async function query(order: SortOrder, genre?: Genre, startAfter?: string) {
  const query = getQueryByGenre(collectionRef, genre);
  const sortedQuery = sortQuery(query, order);
  const paginatedQuery = await paginateQuery(sortedQuery, startAfter);

  // Limit the number of results to receive and get the data.
  const snapshot = await paginatedQuery.limit(PAGINATION).get();

  // Fetch the cover image of each manga.
  const collection = snapshot.docs.map(async doc => {
    const manga = doc.data() as Manga;
    const id = doc.id;
    const base64 = await fetchImage(manga.coverImage).then(toBase64);
    return { ...manga, id, coverImage: base64 } as Manga;
  });

  // Return the manga with cover images.
  const results = await allSettled(collection);
  const success = results.filter(result => result.status === "fulfilled");
  return success.map(result => (result as PromiseResolution<Manga>).value);
}

function getQueryByGenre(collection: Collection, genre: Genre | undefined) {
  if (genre && genre !== "All") {
    return collection.where("genres", "array-contains", genre);
  }
  return collectionRef;
}

function sortQuery(query: Query, order: SortOrder) {
  switch (order) {
    case "Trending":
      return query
      .orderBy("trending", "desc")
      .orderBy("popularity", "desc");
    case "Popularity":
      return query
      .orderBy("popularity", "desc");
    case "Favourites":
      return query
      .orderBy("favourites", "desc");
    case "Score":
      return query
      .orderBy("averageScore", "desc");
    case "Latest":
      return query
      .orderBy("lastUpdated.year", "desc")
      .orderBy("lastUpdated.month", "desc")
      .orderBy("lastUpdated.day", "desc")
      .orderBy("popularity", "desc");
    case "Newest":
      return query
      .orderBy("startDate.year", "desc")
      .orderBy("startDate.month", "desc")
      .orderBy("startDate.day", "desc")
      .orderBy("popularity", "desc");
  }
}

async function paginateQuery(query: Query, startAfter: string | undefined) {
  if (startAfter && startAfter.length > 0) {
    const cursor = await collectionRef.doc(startAfter).get();
    return query.startAfter(cursor);
  }
  return query;
}

export default query;

type Query = firebase.firestore.Query<firebase.firestore.DocumentData>;
type Collection = firebase.firestore.CollectionReference<firebase.firestore.DocumentData>;