export interface Manga {
  id: string;
  title: string;
  coverArt: string;
  summary?: string;
  author?: string;
  genres?: string[];
}