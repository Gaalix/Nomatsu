import axios from 'axios';
import { Manga } from '../types/Manga';

export type SortOrder = 'latest' | 'popular';

export const fetchMangaList = async (offset: number, limit: number, sortOrder: SortOrder = 'latest'): Promise<Manga[]> => {
  const orderParam = sortOrder === 'latest' 
    ? { updatedAt: 'desc' } 
    : { followedCount: 'desc' };

  try {
    const { data } = await axios.get(`https://api.mangadex.dev/manga`, {
      params: {
        limit,
        offset,
        order: orderParam,
        includes: ['cover_art'],
        contentRating: ['safe', 'suggestive'],
        hasAvailableChapters: true
      }
    });

    return data.data.map((manga: any) => ({
      id: manga.id,
      title: manga.attributes.title.en || Object.values(manga.attributes.title)[0],
      coverArt: manga.relationships.find((rel: any) => rel.type === 'cover_art')?.attributes?.fileName
        ? `https://uploads.mangadex.org/covers/${manga.id}/${manga.relationships.find((rel: any) => rel.type === 'cover_art').attributes.fileName}`
        : ''
    }));
  } catch (error) {
    console.error('Error fetching manga:', error);
    throw error;
  }
};