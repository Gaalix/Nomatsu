import axios from 'axios';
import { Manga } from '../types/Manga';

export const fetchMangaList = async (offset: number, limit: number): Promise<Manga[]> => {
  const { data } = await axios.get(`https://api.mangadex.dev/manga`, {
    params: {
      limit,
      offset,
      order: { latestUploadedChapter: 'desc' },
      includes: ['cover_art']
    }
  });

  return data.data.map((manga: any) => {
    const coverFile = manga.relationships.find((rel: any) => rel.type === 'cover_art')?.attributes?.fileName;
    return {
      id: manga.id,
      title: manga.attributes.title.en || Object.values(manga.attributes.title)[0],
      coverArt: coverFile ? `https://uploads.mangadex.dev/covers/${manga.id}/${coverFile}` : ''
    };
  });
};