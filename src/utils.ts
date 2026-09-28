import type { ApodPicture } from "./types";

export function getYouTubeThumbnail(url: string): string | undefined {
  const match = url.match(/youtube\.com\/embed\/([\w-]+)/);
  return match
    ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`
    : undefined;
}

export function getImageUrl(picture: ApodPicture): string | undefined {
  if (picture.media_type === "image") return picture.url;
  return picture.thumbnail_url ?? getYouTubeThumbnail(picture.url);
}

export function formatMonth(month: string): string {
  return new Date(`${month}-01T00:00:00`).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export function isVideoFile(url: string): boolean {
  return /\.(mp4|webm|ogg)$/i.test(url);
}
