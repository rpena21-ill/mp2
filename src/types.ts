export interface ApodPicture {
  date: string;
  title: string;
  explanation: string;
  url: string;
  hdurl?: string;
  media_type: "image" | "video";
  copyright?: string;
  thumbnail_url?: string;
  alt?: string;
  permalink?: string;
}

export interface DetailNavState {
  dates: string[];
}
