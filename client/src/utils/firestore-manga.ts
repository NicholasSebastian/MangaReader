import firebase from "firebase";
import "firebase/firestore";
import allSettled, { PromiseResolution } from "promise.allsettled";

import { Manga, Genre, SortOrder } from "../../types";
import { db } from "./firebase";
import { fetchImage } from "./manganato-image";
import { toBase64 } from "./utils";

const PAGINATION = 18;
const collectionRef = db.collection("manga");

// TODO: fix startAfter not working. its always returning the same from the beginning.
// TODO: create indexes in firebase firestore console for the other 'sort order's.

async function query(order: SortOrder, genre?: Genre, startAfter?: string) {
  // Define the query to be filtered to only manga that includes the given genre.
  const hasGenre = genre && genre !== "All";
  let query = hasGenre ? collectionRef.where("genres", "array-contains", genre) : collectionRef;

  // Define the query 'orderBy' by the desired sort order.
  switch (order) {
    case "Trending":
      query = query
      .orderBy("trending", "desc")
      .orderBy("popularity", "desc");
      break;
    case "Popularity":
      query = query.orderBy("popularity", "desc");
      break;
    case "Favourites":
      query = query.orderBy("favourites", "desc");
      break;
    case "Score":
      query = query.orderBy("averageScore", "desc");
      break;
    case "Latest":
      query = query
      .orderBy("lastUpdated.year", "desc")
      .orderBy("lastUpdated.month", "desc")
      .orderBy("lastUpdated.day", "desc")
      .orderBy("popularity", "desc");
      break;
    case "Newest":
      query = query
      .orderBy("startDate.year", "desc")
      .orderBy("startDate.month", "desc")
      .orderBy("startDate.day", "desc")
      .orderBy("popularity", "desc");
      break;
    default:
      query = collectionRef; 
      break;
  }
  
  // Define the query to begin after the given document ID.
  const cursor = startAfter !== undefined ? collectionRef.doc(startAfter) : undefined;
  const paginatedQuery = cursor ? query.startAfter(cursor) : query;

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

export default query;

type Query = firebase.firestore.Query<firebase.firestore.DocumentData>;