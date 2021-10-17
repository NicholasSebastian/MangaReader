import firebase from "firebase";
import "firebase/firestore";
import { Manga } from "../../types";

const PAGINATION = 18;

firebase.initializeApp({
  apiKey: "AIzaSyABk1eiUwsPmsIHkSNjV1aukbhTebcnE4g",
  authDomain: "mangareader-110900.firebaseapp.com",
  projectId: "mangareader-110900",
  storageBucket: "mangareader-110900.appspot.com",
  messagingSenderId: "38691091256",
  appId: "1:38691091256:web:4328384508d9f62bbb47cd",
  measurementId: "G-N8NHPFRNFN"
});

const db = firebase.firestore();
const collectionRef = db.collection("manga");

export async function getTrending(startAfter?: any) {
  const query = collectionRef
    .orderBy("trending", "desc")
    .orderBy("popularity", "desc")
    .limit(PAGINATION);
  
  return queryToCollection(query, startAfter);
}

export async function getPopular(startAfter?: any) {
  const query = collectionRef
    .orderBy("popularity", "desc")
    .limit(PAGINATION);
  
  return queryToCollection(query, startAfter);
}

export async function getFavourites(startAfter?: any) {
  const query = collectionRef
    .orderBy("favourites", "desc")
    .limit(PAGINATION);
  
  return queryToCollection(query, startAfter);
}

export async function getTopRated(startAfter?: any) {
  const query = collectionRef
    .orderBy("averageScore", "desc")
    .limit(PAGINATION);
  
  return queryToCollection(query, startAfter);
}

export async function getLatest(startAfter?: any) {
  const query = collectionRef
    .orderBy("lastUpdated.year", "desc")
    .orderBy("lastUpdated.month", "desc")
    .orderBy("lastUpdated.day", "desc")
    .orderBy("popularity", "desc")
    .limit(PAGINATION);
  
  return queryToCollection(query, startAfter);
}

export async function getNewest(startAfter?: any) {
  const query = collectionRef
    .orderBy("startDate.year", "desc")
    .orderBy("startDate.month", "desc")
    .orderBy("startDate.day", "desc")
    .orderBy("popularity", "desc")
    .limit(PAGINATION);
  
  return queryToCollection(query, startAfter);
}

async function queryToCollection(query: Query, startAfter?: any) {
  const paginatedQuery = startAfter ? query.startAfter(startAfter) : query;
  const snapshot = await paginatedQuery.get();

  const collection = snapshot.docs.map(doc => doc.data());
  return collection as Array<Manga>;
}

type Query = firebase.firestore.Query<firebase.firestore.DocumentData>;
