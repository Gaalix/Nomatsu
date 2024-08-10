import {useState, useEffect, useCallback, useRef} from 'react';
import {Manga} from '../types/Manga';
import {fetchMangaList, SortOrder} from '../api/mangaApi';
import {debounce} from 'lodash';

const INITIAL_OFFSET = 0;
const INITIAL_LIMIT = 20;
const DEBOUNCE_DELAY = 300;

export const useMangaList = () => {
    const [mangas, setMangas] = useState<Manga[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [offset, setOffset] = useState(INITIAL_OFFSET);
    const [hasMore, setHasMore] = useState(true);
    const [sortOrder, setSortOrder] = useState<SortOrder>('latestUploadedChapter');
    const [contentRating, setContentRating] = useState<string[]>(['safe']);
    const [tags, setTags] = useState<Record<string, number>>({});
    const [publicationStatus, setPublicationStatus] = useState<string>('ongoing');
    const [language, setLanguage] = useState<string>('en');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Manga[]>([]);
    const [isFirstLoad, setIsFirstLoad] = useState(true);
    const [isResetting, setIsResetting] = useState(false);

    const cachedMangas = useRef<Record<string, Manga[]>>({});
    const isMounted = useRef(true);
    const initialLoadTriggered = useRef(false);

    const handleSearch = useCallback(
        debounce(async (query: string) => {
            if (query.length >= 2) {
                try {
                    const results = await fetchMangaList(
                        INITIAL_OFFSET,
                        INITIAL_LIMIT,
                        sortOrder,
                        contentRating,
                        tags,
                        publicationStatus,
                        language,
                        query
                    );
                    setSearchResults(results);
                } catch (error) {
                    console.error('Error searching manga:', error);
                }
            } else {
                setSearchResults([]);
            }
        }, DEBOUNCE_DELAY),
        [sortOrder, contentRating, tags, publicationStatus, language]
    );

    useEffect(() => {
        handleSearch(searchQuery);
    }, [searchQuery, handleSearch]);

    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);

    const fetchAndSetMangas = async (
        currentOffset: number,
        currentSortOrder: SortOrder,
        currentContentRating: string[],
        currentTags: Record<string, number>,
        currentPublicationStatus: string,
        currentLanguage: string
    ) => {
        try {
            const newMangas = await fetchMangaList(
                currentOffset,
                INITIAL_LIMIT,
                currentSortOrder,
                currentContentRating,
                currentTags,
                currentPublicationStatus,
                currentLanguage
            );

            if (isMounted.current) {
                setMangas(prevMangas => [...prevMangas, ...newMangas]);
                setOffset(prevOffset => prevOffset + INITIAL_LIMIT);
                setHasMore(newMangas.length === INITIAL_LIMIT);
                setError(null);
                setIsFirstLoad(false);
            }
        } catch (error) {
            console.error('Error in fetchAndSetMangas:', error);
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

    const loadMoreMangas = useCallback(() => {
        if (isLoading || !hasMore) return;

        setIsLoading(true);
        setError(null);

        fetchAndSetMangas(offset, sortOrder, contentRating, tags, publicationStatus, language);
    }, [offset, sortOrder, contentRating, tags, publicationStatus, hasMore, isLoading, language]);

    const resetAndLoad = useCallback(() => {
        setIsResetting(true);
        setOffset(INITIAL_OFFSET);
        setMangas([]);
        setHasMore(true);
        setError(null);
        setIsFirstLoad(true);
        cachedMangas.current = {}; // Clear the cache

        fetchAndSetMangas(INITIAL_OFFSET, sortOrder, contentRating, tags, publicationStatus, language);
    }, [sortOrder, contentRating, tags, publicationStatus, language]);

    useEffect(() => {
        if (isFirstLoad && !initialLoadTriggered.current) {
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
        setLanguage,
        searchQuery,
        setSearchQuery,
        searchResults
    };
};