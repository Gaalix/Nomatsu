import React, { useCallback, useRef } from 'react';
import { useMangaList } from '../hooks/useMangaList';

const MangaList: React.FC = () => {
  const { mangas, isLoading, error, hasMore, loadMore } = useMangaList();

  const observer = useRef<IntersectionObserver | null>(null);
  const lastMangaElementRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMore();
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoading, hasMore, loadMore]);

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