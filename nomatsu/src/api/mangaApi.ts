import axios from 'axios';
import {Manga} from '../types/Manga';

export type SortOrder =
    | 'latestUploadedChapter'
    | 'followedCount'
    | 'relevance'
    | 'createdAt'
    | 'updatedAt'
    | 'title';

const API_BASE_URL = '';
const COVER_ART_URL = 'https://uploads.mangadex.org/covers';

const getCoverArt = (mangaId: string, relationships: any[]): string => {
    const coverArt = relationships.find(rel => rel.type === 'cover_art');
    return coverArt?.attributes?.fileName ? `${COVER_ART_URL}/${mangaId}/${coverArt.attributes.fileName}` : '';
};

const getAuthor = (relationships: any[]): string => {
    const author = relationships.find(rel => rel.type === 'author');
    return author?.attributes?.name || 'Unknown';
};

const getLatestChapter = (relationships: any[], language: string): string => {
    const chapters = relationships.filter(rel => rel.type === 'chapter' && rel.attributes.translatedLanguage === language);
    if (chapters.length === 0) return 'N/A';
    const latestChapter = chapters.reduce((latest, current) =>
        parseFloat(current.attributes.chapter) > parseFloat(latest.attributes.chapter) ? current : latest
    );
    return latestChapter.attributes.chapter;
};

const buildParams = (
    offset: number,
    limit: number,
    sortOrder: SortOrder,
    contentRating: string[],
    tags: Record<string, number>,
    publicationStatus: string,
    language: string,
    searchQuery?: string
): URLSearchParams => {
    const params = new URLSearchParams();
    params.append('limit', limit.toString());
    params.append('offset', offset.toString());
    params.append(`order[${sortOrder}]`, sortOrder === 'title' ? 'asc' : 'desc');
    params.append('includes[]', 'cover_art');
    params.append('includes[]', 'author');
    params.append('includes[]', 'chapter');
    contentRating.forEach(rating => params.append('contentRating[]', rating));
    params.append('status[]', publicationStatus);
    params.append('hasAvailableChapters', 'true');
    params.append('availableTranslatedLanguage[]', language);
    Object.entries(tags).forEach(([tagId, value]) => {
        params.append(value === 1 ? 'includedTags[]' : 'excludedTags[]', tagId);
    });
    if (searchQuery) params.append('title', searchQuery);
    return params;
};

export const fetchMangaList = async (
    offset: number,
    limit: number,
    sortOrder: SortOrder,
    contentRating: string[],
    tags: Record<string, number>,
    publicationStatus: string,
    language: string,
    searchQuery?: string
): Promise<Manga[]> => {
    try {
        const params = buildParams(offset, limit, sortOrder, contentRating, tags, publicationStatus, language, searchQuery);
        const response = await axios.get(`${API_BASE_URL}/manga`, {params});
        return response.data.data.map((manga: any) => ({
            id: manga.id,
            title: manga.attributes.title[language] || manga.attributes.title.en || Object.values(manga.attributes.title)[0],
            coverArt: getCoverArt(manga.id, manga.relationships),
            author: getAuthor(manga.relationships),
            genres: manga.attributes.tags
                .filter((tag: any) => tag.attributes.group === 'genre')
                .map((tag: any) => tag.attributes.name[language] || tag.attributes.name.en),
            summary: manga.attributes.description[language] || manga.attributes.description.en,
            rating: manga.attributes.contentRating,
            language,
            latestChapter: getLatestChapter(manga.relationships, language),
        }));
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

export const fetchMangaChapters = async (mangaId: string, language: string): Promise<any[]> => {
    try {
        const params = new URLSearchParams({
            'translatedLanguage[]': language,
            'order[chapter]': 'asc',
            'limit': '500',
        });
        const response = await axios.get(`${API_BASE_URL}/manga/${mangaId}/feed`, {params});
        return response.data.data;
    } catch (error) {
        console.error('Error fetching manga chapters:', error);
        throw new Error('Failed to fetch manga chapters');
    }
};