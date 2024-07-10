import axios from 'axios';
import { Manga } from '../types/Manga';

export type SortOrder = 
  | 'latestUploadedChapter'
  | 'followedCount'
  | 'relevance'
  | 'createdAt'
  | 'updatedAt'
  | 'title';

const API_BASE_URL = 'https://api.mangadex.dev';

const getCoverArt = (mangaId: string, relationships: any[]): string => {
  const coverArt = relationships.find(rel => rel.type === 'cover_art');
  if (coverArt && coverArt.attributes && coverArt.attributes.fileName) {
    const url = `https://uploads.mangadex.org/covers/${mangaId}/${coverArt.attributes.fileName}`;
    return url;
  }
  console.log('Cover art not found or invalid');
  return '';
};

const getAuthor = (relationships: any[]): string => {
  const author = relationships.find(rel => rel.type === 'author');
  return author && author.attributes ? author.attributes.name : 'Unknown';
};

export const fetchMangaList = async (
  offset: number,
  limit: number,
  sortOrder: SortOrder,
  contentRating: string[],
  tags: Record<string, number>,
  publicationStatus: string
): Promise<Manga[]> => {
  try {
    const params = new URLSearchParams();
    params.append('limit', limit.toString());
    params.append('offset', offset.toString());
    
    switch (sortOrder) {
      case 'latestUploadedChapter':
        params.append('order[latestUploadedChapter]', 'desc');
        break;
      case 'followedCount':
        params.append('order[followedCount]', 'desc');
        break;
      case 'relevance':
        params.append('order[relevance]', 'desc');
        break;
      case 'createdAt':
        params.append('order[createdAt]', 'desc');
        break;
      case 'updatedAt':
        params.append('order[updatedAt]', 'desc');
        break;
      case 'title':
        params.append('order[title]', 'asc');
        break;
      default:
        params.append('order[updatedAt]', 'desc');
    }

    params.append('includes[]', 'cover_art');
    params.append('includes[]', 'author');
    contentRating.forEach(rating => params.append('contentRating[]', rating));
    params.append('status[]', publicationStatus);
    params.append('hasAvailableChapters', 'true');

    // Handle tags
    Object.entries(tags).forEach(([tagId, value]) => {
      if (value === 1) {
        params.append('includedTags[]', tagId);
      } else if (value === 2) {
        params.append('excludedTags[]', tagId);
      }
    });

    const response = await axios.get(`${API_BASE_URL}/manga`, { params });
    

    return response.data.data.map((manga: any) => {
      const mangaData = {
        id: manga.id,
        title: manga.attributes.title.en || Object.values(manga.attributes.title)[0],
        coverArt: getCoverArt(manga.id, manga.relationships),
        author: getAuthor(manga.relationships),
        genres: manga.attributes.tags
          .filter((tag: any) => tag.attributes.group === 'genre')
          .map((tag: any) => tag.attributes.name.en),
        summary: manga.attributes.description.en,
      };
      return mangaData;
    });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error('Error fetching manga:', error.response.status, error.response.data);
      throw new Error(`Failed to fetch manga: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
    } else {
      console.error('Error fetching manga:', error);
      throw new Error('Failed to fetch manga: Unknown error');
    }
  }
};