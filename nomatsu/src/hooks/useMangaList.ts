import { useState, useEffect, useCallback, useRef } from 'react';
import { Manga } from '../types/Manga';
import { fetchMangaList } from '../api/mangaApi';

export const useMangaList = () => {
  const [mangas, setMangas] = useState<Manga[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [cachedMangas, setCachedMangas] = useState<Record<number, Manga[]>>({});
  const initialFetchDone = useRef(false);

  const loadMoreMangas = useCallback(async () => {
    if (isLoading || !hasMore || cachedMangas[offset]) return;
    setIsLoading(true);

    try {
      const mangaList = await fetchMangaList(offset, 20);
      setCachedMangas(prev => ({ ...prev, [offset]: mangaList }));
      setMangas(prevMangas => [...prevMangas, ...mangaList]);
      setHasMore(mangaList.length === 20);
    } catch (error) {
      console.error('Error fetching manga:', error);
      setError('Failed to fetch manga. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [offset, isLoading, hasMore, cachedMangas]);

  useEffect(() => {
    if (!initialFetchDone.current) {
      loadMoreMangas();
      initialFetchDone.current = true;
    }
  }, []);

  useEffect(() => {
    if (initialFetchDone.current && offset > 0) {
      loadMoreMangas();
    }
  }, [offset, loadMoreMangas]);

  const loadMore = () => setOffset(prevOffset => prevOffset + 20);

  return { mangas, isLoading, error, hasMore, loadMore };
};