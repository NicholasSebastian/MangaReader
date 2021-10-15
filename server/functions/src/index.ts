import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import { getListing } from "./sources/anilist";
import { fetchChapters } from "./sources/manganato";

// Firestore daily free write quota is 20000.
const WRITE_LIMIT = 19000;

// No need for serviceAccount credentials since its already set in firebase functions environment.
const app = admin.initializeApp(); 
const db = app.firestore();
db.settings({ ignoreUndefinedProperties: true });

export const scheduledRefresh = functions
  .region("asia-southeast2")
  .pubsub.schedule("0 1 * * *") // Runs at 1:00AM every day.
  .timeZone("Asia/Jakarta")
  .onRun(async context => {
    let batch: FirebaseFirestore.WriteBatch;
    matchAniListToManganato(
      () => { batch = db.batch(); },
      (manga) => {
        console.log(`Setting object with ID: ${manga.id}`);
        const mangaRef = db.collection("manga").doc(manga.id.toString());
        delete manga.id;
        batch.set(mangaRef, manga);
      },
      async () => {
        await batch.commit();
        console.log("Database has been updated.");
      }
    );
    return null;
  });

function matchAniListToManganato (onStart: () => void, onData: (data: any) => void, onEnd: () => Promise<void>) {
  // Fetch manga from anilist's API.
  getListing(WRITE_LIMIT, async collection => {
    onStart();
    for (const item of collection) {
      // Get the manga's chapters from manganato.
      for (const title of [...Object.values(item.title)]) {
        if (!title) continue;
        const slug = toSlug(title as string);
        if (!slug || slug.length < 1) continue;
        const chapters = await fetchChapters(slug);
        if (chapters) {
          // Concatenate the chapters onto the manga data.
          const manga = Object.assign(item, { chapters });
          onData(manga);
          break;
        }
      }
    }
    await onEnd();
  });
}

function toSlug (title: string) {
  return title
  .trim()
  .toLowerCase()
  .replace(/'|\[|\]/g, '')  // remove special characters.
  .replace(/\W/g, '_')      // convert non-alphanumerics into underscores.
  .replace(/_+/g, '_')      // convert multiple consecutive underscores into one.
  .replace(/^_+|_+$/g, ''); // remove underscores at the beginning and end.
}
