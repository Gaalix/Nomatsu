import { Manga } from './Manga';

export interface MangaDetailsProps {
  manga: Manga;
  onClose: () => void;
}