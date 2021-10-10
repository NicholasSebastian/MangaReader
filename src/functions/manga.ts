import cheerio, { CheerioAPI } from "cheerio";
import axios from "axios";
import { fetchImage } from "./image";
import { monthToIndex } from "./utils";

export async function fetchManga(url: string) {
  const response = await axios.get(url, { responseType: "text" });
  const $ = cheerio.load(response.data);
  
  const data: Manga = {};

  parseTitle($!, data);
  parseDetails($!, data);
  parseSummary($!, data);
  parseChapters($!, data);
  
  await parseImage($!, data);

  return data;
}

function parseTitle($: CheerioAPI, data: Manga) {
  const title = $("h1", ".panel-story-info").text();
  if (title) {
    data.title = title;
  }
}

async function parseImage($: CheerioAPI, data: Manga) {
  const imageSrc = $("img", ".info-image").attr("src");
  if (imageSrc) {
    data.imageSrc = await fetchImage(imageSrc) as string;
  }
}

function parseDetails($: CheerioAPI, data: Manga) {
  const details = $("tr", ".variations-tableInfo");
  for (const detail of details) {
    const label = $(".table-label", detail).text().toLowerCase();
    const value = $(".table-value", detail).text();

    if (label.match(/alternative/)) {
      data.alternative = value;
    }
    else if (label.match(/author/)) {
      data.author = value;
    }
    else if (label.match(/status/)) {
      data.status = value.toLowerCase() === "completed";
    }
    else if (label.match(/genres/)) {
      data.genres = value.split(' - ').map(tag => tag.replace(/\\n/, ''));
    }
    else if (label.match(/updated/)) {
      const smatch = value.match(/(\w+)\s*(\d+)\s*,\s*(\d+)/);
      const year = parseInt(smatch![3]!) + 2000;
      const month = monthToIndex(smatch![1]!);
      const day = parseInt(smatch![2]!);
      data.lastUpdate = new Date(year, month, day);
    }
    else if (label.match(/view/)) {
      data.views = parseInt(value.replace(/,/, ''));
    }
  }
}

function parseSummary($: CheerioAPI, data: Manga) {
  const summary = $(".panel-story-info-description").text();
  if (!summary.match(/summary is updating/)) {
    data.summary = summary;
  }
}

function parseChapters($: CheerioAPI, data: Manga) {
  data.chapters = [];
  const list = $("li", ".row-content-chapter");
  for (const chapter of list) {
    const anchorElement = $("a", chapter);
    const name = anchorElement.text();
    const chapterUrl = anchorElement.attr("href");
    if (chapterUrl) {
      data.chapters.push({ name, chapterUrl });
    }
  }
}

export interface Manga {
  title?: string
  imageSrc?: string
  alternative?: string
  author?: string
  status?: boolean
  genres?: Array<string>
  lastUpdate?: Date
  views?: number
  summary?: string
  chapters?: Array<Chapter>
}

interface Chapter {
  name: string
  chapterUrl: string
}