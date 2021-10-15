import * as cheerio from "cheerio";
import axios from "axios";

export async function getPages(url: string) {
  try {
    // Fetch and load the content.
    const { data } = await axios.get(url, { responseType: "text" });
    const $ = cheerio.load(data as string);

    // Get the number of images and the source of the first image in the content.
    const pages = $("img", ".container-chapter-reader");
    const pageSrc = pages.first().attr("src");
    const numberOfPages = pages.length;
    if (!pageSrc) return;

    const info: PageDetail = { pageSrc, numberOfPages };
    return info;
  }
  catch (e) {
    console.warn(`Failed to process '${url}'`);
    return undefined;
  }
}

interface PageDetail {
  pageSrc: string;
  numberOfPages: number;
}
