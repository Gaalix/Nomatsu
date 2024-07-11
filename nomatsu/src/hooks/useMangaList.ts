import { useState, useEffect, useCallback, useRef } from 'react';
import { Manga } from '../types/Manga';
import { fetchMangaList, SortOrder } from '../api/mangaApi';

export const useMangaList = () => {
  const [mangas, setMangas] = useState<Manga[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [sortOrder, setSortOrder] = useState<SortOrder>('latestUploadedChapter');
  const [contentRating, setContentRating] = useState<string[]>(['safe']);
  const [tags, setTags] = useState<Record<string, number>>({});
  const [publicationStatus, setPublicationStatus] = useState<string>('ongoing');
  const [language, setLanguage] = useState<string>('en');
  const cachedMangas = useRef<Record<string, Manga[]>>({});
  const lastFetchTime = useRef<number>(0);
  const isMounted = useRef(true);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isResetting, setIsResetting] = useState(false);
  const initialLoadTriggered = useRef(false);
  const lastOptions = useRef('');

  useEffect(() => {
    console.log('useMangaList mounted');
    isMounted.current = true;
    return () => {
      console.log('useMangaList unmounted');
      isMounted.current = false;
    };
  }, []);

  const loadMoreMangas = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    setError(null);

    const fetchData = async () => {
      const currentOffset = offset;
      const currentSortOrder = sortOrder;
      const currentContentRating = contentRating;
      const currentTags = tags;
      const currentPublicationStatus = publicationStatus;
      const currentLanguage = language;

      try {
        const newMangas = await fetchMangaList(
          currentOffset,
          20,
          currentSortOrder,
          currentContentRating,
          currentTags,
          currentPublicationStatus,
          currentLanguage
        );

        if (isMounted.current) {
          setMangas(prevMangas => [...prevMangas, ...newMangas]);
          setOffset(prevOffset => prevOffset + 20);
          setHasMore(newMangas.length === 20);
          setError(null);
          setIsFirstLoad(false);
        }
      } catch (error) {
        console.error('Error in loadMoreMangas:', error);
        if (isMounted.current) {
          setError('Failed to fetch manga. Please try adjusting your filters or try again later.');
          setIsFirstLoad(false);
        }
      } finally {
        if (isMounted.current) {
          setIsLoading(false);
          setIsResetting(false);
        }
      }
    };

    fetchData();
  }, [offset, sortOrder, contentRating, tags, publicationStatus, hasMore, isLoading, language]);

  const resetAndLoad = useCallback(() => {
    setIsResetting(true);
    setOffset(0);
    setMangas([]);
    setHasMore(true);
    setError(null);
    setIsFirstLoad(true);
    cachedMangas.current = {}; // Clear the cache

    // Immediately trigger a new fetch
    fetchMangaList(0, 20, sortOrder, contentRating, tags, publicationStatus, language)
      .then((newMangas) => {
        setMangas(newMangas);
        setOffset(20);
        setHasMore(newMangas.length === 20);
        setError(null);
        setIsFirstLoad(false);
      })
      .catch((error) => {
        console.error('Error in resetAndLoad:', error);
        setError('Failed to fetch manga. Please try adjusting your filters or try again later.');
        setIsFirstLoad(false);
      })
      .finally(() => {
        setIsLoading(false);
        setIsResetting(false);
      });
  }, [sortOrder, contentRating, tags, publicationStatus, language]);

  useEffect(() => {
    if (isFirstLoad && !initialLoadTriggered.current) {
      console.log('Initial load effect triggered');
      initialLoadTriggered.current = true;
      loadMoreMangas();
    }
  }, [isFirstLoad, loadMoreMangas]);

  return {
    mangas,
    isLoading,
    isFirstLoad,
    error,
    hasMore,
    loadMore: loadMoreMangas,
    sortOrder,
    setSortOrder,
    contentRating,
    setContentRating,
    tags,
    setTags,
    publicationStatus,
    setPublicationStatus,
    resetAndLoad,
    isResetting,
    language,
    setLanguage
  };
}