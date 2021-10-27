import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import { getListing } from "./sources/anilist";
import { fetchChapters } from "./sources/manganato";

const WRITE_LIMIT = 9000;   // Firestore daily free write quota is 20000.
const TIMEOUT = 540;        // Cloud Functions maximum timeout is 9 mins.
const WAIT_TIME = 23 * 60 * 60 * 1000;  // 23 hours.

// No need for serviceAccount credentials since its already set in firebase functions environment.
const app = admin.initializeApp(); 
const db = app.firestore();
db.settings({ ignoreUndefinedProperties: true });

export const refreshCollection = functions
  .runWith({ timeoutSeconds: TIMEOUT })
  .region("asia-southeast2")
  .pubsub.schedule("every day 01:00")
  .timeZone("Asia/Jakarta")
  .onRun(async context => {
    let count = 0;
    const nullTime = admin.firestore.Timestamp.fromMillis(0);
    await getListing(WRITE_LIMIT, async collection => {
      const batch = db.batch(); 
      count++;
      for (const manga of collection) {
        const id = manga.id.toString();
        const mangaRef = db.collection("manga").doc(id);
        manga.serverTimestamp = nullTime;
        delete manga.id;
        batch.set(mangaRef, manga);
      }
      await batch.commit();
      functions.logger.log(`Batch ${count} commited.`);
    })
    .then(status => {
      functions.logger.log(`Database update completed by condition: '${status}'`);
    });
  });

export const refreshChapters = functions
  .runWith({ timeoutSeconds: TIMEOUT })
  .region("asia-southeast2")
  .firestore.document("manga/{id}")
  .onWrite(async (change, context) => {
    const { after } = change;

    // Do nothing on delete.
    if (!after.exists) return;

    const manga = after.data()!;
    const now = admin.firestore.Timestamp.now();

    // Do nothing if already updated today.
    const lastRefresh = manga.serverTimestamp.toMillis();
    if ((now.toMillis() - lastRefresh) < WAIT_TIME) return;

    // Check for new chapters then update the document.
    const titles: Array<string> = Object.values(manga.title);
    const chapterData = await getChapters(titles);
    if (chapterData) {
      const { chapters, lastUpdated } = chapterData;
      return after.ref.update({ 
        chapters, 
        lastUpdated, 
        serverTimestamp: now
      });
    }
    else {
      const { english, romaji, native } = manga.title;
      functions.logger.log(`'${english ?? romaji ?? native}' will be deleted as no chapters can be found.`);
      return after.ref.delete();
    }
  });

async function getChapters(titles: Array<string>) {
  for (const title of titles) {
    if (!title) continue;
    const slug = toSlug(title as string);
    if (!slug || slug.length < 1) continue;

    const chapterData = await fetchChapters(slug);
    if (chapterData) {
      return chapterData;
    }
  }
  return null;
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
