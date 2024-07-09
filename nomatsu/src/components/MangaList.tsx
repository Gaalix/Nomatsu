import React, { useCallback, useRef } from 'react';
import { Box, Grid, Image, Text, Button } from '@chakra-ui/react';
import { useMangaList } from '../hooks/useMangaList';
import { SortOrder } from '../api/mangaApi';

const MangaList: React.FC = () => {
  const { mangas, isLoading, error, hasMore, loadMore, sortOrder, changeSortOrder } = useMangaList();

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

  const toggleSortOrder = () => {
    const newSortOrder: SortOrder = sortOrder === 'latest' ? 'popular' : 'latest';
    changeSortOrder(newSortOrder);
  };

  if (error) {
    return <Text color="red.500">{error}</Text>;
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Button onClick={toggleSortOrder}>
          Sort by: {sortOrder === 'latest' ? 'Latest' : 'Popular'}
        </Button>
      </Box>
      <Grid templateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={6}>
        {mangas.map((manga, index) => (
          <Box 
            key={manga.id} 
            textAlign="center"
            ref={index === mangas.length - 1 ? lastMangaElementRef : null}
          >
            <Image src={manga.coverArt} alt={manga.title} objectFit="cover" height="300px" width="100%" borderRadius="md" />
            <Text mt={2} fontWeight="bold">{manga.title}</Text>
          </Box>
        ))}
      </Grid>
      {isLoading && <Text mt={4} textAlign="center">Loading more manga...</Text>}
    </Box>
  );
}

export default MangaList;