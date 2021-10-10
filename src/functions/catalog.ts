import cheerio, { CheerioAPI } from "cheerio";
import axios from "axios";

export type SortOrder = "latest" | "topview" | "newest";
type Status = "all" | "ongoing" | "complete";

const BASE_URL = "https://m.manganelo.com";

export async function fetchContent(page: number, order: SortOrder, status: Status = "all", search?: string) {
  // Build the URL to access the right content.
  const orderParams = order !== "latest" ? `&orby=${order}` : "";
  const statusParams = status !== "all" ? `&sts=${status}` : "";
  const searchParams = search ? `&keyw=${search}` : "";
  const url = `${BASE_URL}/advanced_search?s=all${statusParams}${orderParams}&page=${page}${searchParams}`;

  // Fetch and load the content.
  const { data } = await axios.get(url, { responseType: "text" });
  let $ = cheerio.load(data);
  
  return $;
}

// Extract the data from the given content.
export function parseContent($: CheerioAPI) {
  const items = $("div.content-genres-item > a", "div.panel-content-genres");
  const urls = items.map((index, item) => $(item).attr("href"));
  return urls.toArray();
}

// Extract the 'trending' data from the content.
export function parseCarousel($: CheerioAPI) {
  const items = $(".item h3 > a", ".owl-carousel");
  const urls = items.map((index, item) => $(item).attr("href"));
  return urls.toArray();
}
