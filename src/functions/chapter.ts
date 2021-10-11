import cheerio from "cheerio";
import axios from "axios";
import { mapLimit, AsyncResultIterator } from "async";
import { fetchImage } from "./image";

const MAX_CONCURRENT_FETCHES = 3;

// TODO: catch network errors.

export async function fetchChapter(url: string) {
  try {
    const { data } = await axios.get(url, { responseType: "text" });
    const $ = cheerio.load(data);

    const pages = $("img", ".container-chapter-reader");
    const imageUrls = pages.map((index, page) => $(page).attr("src")).toArray();

    const f: UrlIterator = (url, callback) => fetchImage(url).then(image => callback(null, image as string));
    const images = await mapLimit(imageUrls, MAX_CONCURRENT_FETCHES, f);
    return images;
  }
  catch (e) { throw e; }
}

type UrlIterator = AsyncResultIterator<string, string, Error>