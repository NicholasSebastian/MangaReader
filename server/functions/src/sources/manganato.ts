import * as cheerio from "cheerio";
import axios from "axios";

const BASE_URL = "https://manganato.com";

export async function fetchChapters(slug: string) {
  // Build the URL to access the right content.
  const url = `${BASE_URL}/search/story/${slug}`;

  console.log(`\nSearching: ${url}`);

  try {
    // Fetch and load the content.
    const { data } = await axios.get(url, { responseType: "text" });
    const $ = cheerio.load(data as string);

    // Get the first manga result inside the content.
    const item = $("div.search-story-item > a", "div.panel-search-story").first();
    const mangaUrl = item.attr("href");
    if (!mangaUrl) return;

    console.log(`Processing: '${mangaUrl}'`);

    // Get the manga's list of chapters.
    const chapters = await getChapters(mangaUrl);
    if (!chapters) return;

    console.log(`${chapters.length} chapters found.`);

    return chapters;
  }
  catch(e) {
    console.warn(`Failed to process '${url}'`);
    return undefined;
  }
}

async function getChapters(url: string) {
  try {
    // Fetch and load the content.
    const response = await axios.get(url, { responseType: "text" });
    const $ = cheerio.load(response.data as string);
    const list = $("li", ".row-content-chapter");

    // Get the name and link of every chapter in the content.
    const chapters = [];
    for (const chapter of list) {
      const anchorElement = $("a", chapter);
      const name = anchorElement.text();
      const chapterUrl = anchorElement.attr("href");
      if (chapterUrl) {
        chapters.push({ name, chapterUrl });
      }
    }

    return chapters;
  }
  catch (e) {
    console.warn(`Failed to process '${url}'`);
    return undefined;
  }
}
