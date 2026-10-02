import axios from "axios";
import type { ApodPicture } from "../types";

const BASE_URL = "https://science.nasa.gov/wp-json/wp/v2/apod-basic";
const API_KEY = "lFrNUZtPXsnNpSx4YCPLyO6XtVr65Bnfa83LsRVW";

interface RawApodEntry {
  date: string;
  title: string;
  media_type: string;
  explanation: string;
  copyright?: string;
  alt?: string;
  url: string;
  hdurl?: string;
  permalink: string;
  basic_html?: string;
}

function htmlToText(html: string | undefined): string {
  if (!html) return "";
  const doc = new DOMParser().parseFromString(html, "text/html");
  return (doc.body.textContent ?? "").trim();
}

function findVideoUrl(basicHtml: string | undefined): string | undefined {
  if (!basicHtml) return undefined;
  const doc = new DOMParser().parseFromString(basicHtml, "text/html");
  const player = doc.querySelector(
    "iframe[src], video[src], video source[src]",
  );
  const src = player?.getAttribute("src");
  return src ? new URL(src, "https://science.nasa.gov/").href : undefined;
}

function toPicture(raw: RawApodEntry): ApodPicture {
  const isVideo = raw.media_type === "video" || raw.media_type === "iframe";
  const mainText = raw.explanation.split("<br><br>")[0];

  return {
    date: raw.date,
    title: htmlToText(raw.title),
    explanation: htmlToText(mainText).replace(/^Explanation:\s*/, ""),
    media_type: isVideo ? "video" : "image",
    url: isVideo
      ? (findVideoUrl(raw.basic_html) ?? raw.url)
      : (raw.hdurl ?? raw.url),
    hdurl: raw.hdurl,
    copyright:
      htmlToText(raw.copyright).replace(/^Image Credit:\s*/, "") || undefined,
    alt: raw.alt,
    permalink: raw.permalink,
  };
}

function toDateId(date: Date): string {
  const yy = String(date.getFullYear()).slice(2);
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yy}${mm}${dd}`;
}

async function fetchOne(dateId: string): Promise<ApodPicture> {
  const response = await axios.get<RawApodEntry>(`${BASE_URL}/${dateId}`, {
    params: { api_key: API_KEY },
  });
  return toPicture(response.data);
}

async function fetchFromNasa(totalDays: number): Promise<ApodPicture[]> {
  const response = await axios.get<RawApodEntry[]>(BASE_URL, {
    params: { api_key: API_KEY },
  });
  const latest = response.data.map(toPicture);

  const earliest = latest.reduce(
    (min, p) => (p.date < min ? p.date : min),
    latest[0].date,
  );
  if (latest.length === 0) return [];
  const cursor = new Date(`${earliest}T00:00:00`);
  const olderIds: string[] = [];
  for (let i = latest.length; i < totalDays; i++) {
    cursor.setDate(cursor.getDate() - 1);
    olderIds.push(toDateId(cursor));
  }

  const results = await Promise.allSettled(olderIds.map(fetchOne));
  const older = results
    .filter(
      (r): r is PromiseFulfilledResult<ApodPicture> => r.status === "fulfilled",
    )
    .map((r) => r.value);

  return [...latest, ...older].sort((a, b) => a.date.localeCompare(b.date));
}

export async function fetchPictures(totalDays = 150): Promise<ApodPicture[]> {
  const cacheKey = `apod-pictures-${totalDays}`;

  try {
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) return JSON.parse(cached) as ApodPicture[];
  } catch {
    // Storage unavailable or corrupted; fall through and fetch fresh data.
  }

  const pictures = await fetchFromNasa(totalDays);

  try {
    sessionStorage.setItem(cacheKey, JSON.stringify(pictures));
  } catch {
    // Caching is optional; the app still works without it.
  }

  return pictures;
}
