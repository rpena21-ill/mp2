import axios from "axios";
import type { ApodPicture } from "../types";

const API_KEY = "lFrNUZtPXsnNpSx4YCPLyO6XtVr65Bnfa83LsRVW";
const BASE_URL = "https://api.nasa.gov/planetary/apod";

export async function fetchPictures(startDate: string): Promise<ApodPicture[]> {
  const response = await axios.get<ApodPicture[]>(BASE_URL, {
    params: {
      api_key: API_KEY,
      start_date: startDate,
      thumbs: true,
    },
  });
  return response.data;
}
