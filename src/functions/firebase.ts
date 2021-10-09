import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyABk1eiUwsPmsIHkSNjV1aukbhTebcnE4g",
  authDomain: "mangareader-110900.firebaseapp.com",
  projectId: "mangareader-110900",
  storageBucket: "mangareader-110900.appspot.com",
  messagingSenderId: "38691091256",
  appId: "1:38691091256:web:4328384508d9f62bbb47cd",
  measurementId: "G-N8NHPFRNFN"
};

const app = initializeApp(firebaseConfig);
export default app;

// TODO: firebase firestore for storing 'favourites' and 'subscription' of each account.
