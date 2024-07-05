import React, { useState, useEffect, useCallback, useRef } from 'react';

interface Manga {
  id: string;
  title: string;
  coverArt: string;
}

const MangaList: React.FC = () => {
  const [mangas, setMangas] = useState<Manga[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [cachedMangas, setCachedMangas] = useState<Record<number, Manga[]>>({});

  const observer = useRef<IntersectionObserver | null>(null);
  const lastMangaElementRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setOffset(prevOffset => prevOffset + 20);
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoading, hasMore]);

  const fetchMangas = useCallback(async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);

    if (cachedMangas[offset]) {
      setMangas(prevMangas => [...prevMangas, ...cachedMangas[offset]]);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`https://api.mangadex.dev/manga?limit=20&offset=${offset}&order[latestUploadedChapter]=desc`);
      const data = await response.json();
      
      const mangaList = await Promise.all(data.data.map(async (manga: any) => {
        const coverResponse = await fetch(`https://api.mangadex.dev/cover?manga[]=${manga.id}`);
        const coverData = await coverResponse.json();
        const coverFilename = coverData.data[0]?.attributes.fileName;
        
        return {
          id: manga.id,
          title: manga.attributes.title.en || Object.values(manga.attributes.title)[0],
          coverArt: coverFilename ? `https://uploads.mangadex.dev/covers/${manga.id}/${coverFilename}` : ''
        };
      }));

      setCachedMangas(prev => ({ ...prev, [offset]: mangaList }));
      setMangas(prevMangas => [...prevMangas, ...mangaList]);
      setHasMore(data.total > offset + mangaList.length);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching manga:', error);
      setError('Failed to fetch manga. Please try again later.');
      setIsLoading(false);
    }
  }, [offset, isLoading, hasMore, cachedMangas]);

  useEffect(() => {
    fetchMangas();
  }, [offset, fetchMangas]);

  if (error) return <div>{error}</div>;

  return (
    <div className="manga-list">
      <h1>Latest Manga</h1>
      <div className="manga-grid">
        {mangas.map((manga, index) => (
          <div 
            key={manga.id} 
            className="manga-item"
            ref={index === mangas.length - 1 ? lastMangaElementRef : null}
          >
            <img src={manga.coverArt} alt={manga.title} />
            <h3>{manga.title}</h3>
          </div>
        ))}
      </div>
      {isLoading && <div>Loading more...</div>}
      {!hasMore && <div>No more manga to load</div>}
    </div>
  );
};

export default MangaList;