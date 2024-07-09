import { useState, useEffect, useCallback, useRef } from 'react';
import { Manga } from '../types/Manga';
import { fetchMangaList, SortOrder } from '../api/mangaApi';

export const useMangaList = () => {
  const [mangas, setMangas] = useState<Manga[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [sortOrder, setSortOrder] = useState<SortOrder>('latest');
  const cachedMangas = useRef<Record<string, Manga[]>>({});
  const lastFetchTime = useRef<number>(0);

  const loadMoreMangas = useCallback(async () => {
    if (isLoading || !hasMore) return;
    
    const now = Date.now();
    if (now - lastFetchTime.current < 1000) {
      console.log('Throttling API call');
      return;
    }
    
    setIsLoading(true);
    lastFetchTime.current = now;

    const cacheKey = `${sortOrder}-${offset}`;
    if (cachedMangas.current[cacheKey]) {
      setMangas(prevMangas => [...prevMangas, ...cachedMangas.current[cacheKey]]);
      setOffset(prevOffset => prevOffset + 20);
      setIsLoading(false);
      return;
    }

    try {
      const mangaList = await fetchMangaList(offset, 20, sortOrder);
      cachedMangas.current[cacheKey] = mangaList;
      setMangas(prevMangas => [...prevMangas, ...mangaList]);
      setOffset(prevOffset => prevOffset + 20);
      setHasMore(mangaList.length === 20);
    } catch (error) {
      console.error('Error in loadMoreMangas:', error);
      setError('Failed to fetch manga. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [offset, isLoading, hasMore, sortOrder]);

  const changeSortOrder = useCallback((newSortOrder: SortOrder) => {
    if (newSortOrder !== sortOrder) {
      setSortOrder(newSortOrder);
      setMangas([]);
      setOffset(0);
      setHasMore(true);
      setIsLoading(false);
      lastFetchTime.current = 0;
    }
  }, [sortOrder]);

  useEffect(() => {
    loadMoreMangas();
  }, [sortOrder]);

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      loadMoreMangas();
    }
  }, [isLoading, hasMore, loadMoreMangas]);

  return { mangas, isLoading, error, hasMore, loadMore, sortOrder, changeSortOrder };
};