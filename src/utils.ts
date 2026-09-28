import type { ApodPicture } from './types';

export function getImageUrl(picture: ApodPicture): string | undefined {
  return picture.media_type === 'image' ? picture.url : picture.thumbnail_url;
}

export function formatMonth(month: string): string {
  return new Date(`${month}-01T00:00:00`).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
}