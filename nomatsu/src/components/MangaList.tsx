import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Box, Button, Grid, Image, Text, Spinner, Tooltip, IconButton, useColorModeValue, VStack, Heading, Flex } from '@chakra-ui/react';
import { ArrowUpIcon } from '@chakra-ui/icons';
import { Manga } from '../types/Manga';
import { useMangaList } from '../hooks/useMangaList';
import MangaDetails from './MangaDetails';
import SortingOptions from './SortingOptions';
import { SortOrder } from '../api/mangaApi';
import { useInView } from 'react-intersection-observer';

const MangaList: React.FC = () => {
  const { 
    mangas, 
    isLoading, 
    isFirstLoad, 
    error, 
    hasMore, 
    loadMore, 
    sortOrder, 
    setSortOrder, 
    contentRating, 
    setContentRating, 
    tags, 
    setTags, 
    publicationStatus, 
    setPublicationStatus, 
    resetAndLoad,
    isResetting
  } = useMangaList();

  const [selectedManga, setSelectedManga] = useState<Manga | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showSortingOptions, setShowSortingOptions] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  const { ref: lastMangaElementRef, inView } = useInView({
    threshold: 0.5,
  });

  useEffect(() => {
    if (inView && !isLoading && hasMore) {
      loadMore();
    }
  }, [inView, isLoading, hasMore, loadMore]);

  const handleSortingChange = (newSortOrder: SortOrder, newContentRating: string[], newTags: Record<string, number>, newPublicationStatus: string) => {
    setSortOrder(newSortOrder);
    setContentRating(newContentRating);
    setTags(newTags);
    setPublicationStatus(newPublicationStatus);
    setShowSortingOptions(false);
  };

  useEffect(() => {
    resetAndLoad();
  }, [sortOrder, contentRating, tags, publicationStatus]);

  const toggleSortingOptions = () => setShowSortingOptions(!showSortingOptions);

  const handleMangaClick = (manga: Manga) => {
    if (listRef.current) {
      setScrollPosition(listRef.current.scrollTop);
    }
    setSelectedManga(manga);
  };

  const handleClose = () => {
    setSelectedManga(null);
    if (listRef.current) {
      setTimeout(() => {
        listRef.current?.scrollTo({ top: scrollPosition, behavior: 'auto' });
      }, 0);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (listRef.current) {
        setShowScrollTop(listRef.current.scrollTop > 300);
      }
    };

    const currentListRef = listRef.current;
    if (currentListRef) {
      currentListRef.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (currentListRef) {
        currentListRef.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  return (
    <Box height="calc(100vh - 60px)">
      {!selectedManga && (
        <Box mb={4}>
          <Button onClick={toggleSortingOptions}>
            {showSortingOptions ? 'Hide Sorting Options' : 'Show Sorting Options'}
          </Button>
          <Box maxHeight="400px" overflowY="auto">
            <SortingOptions
              sortOrder={sortOrder}
              contentRating={contentRating}
              tags={tags}
              publicationStatus={publicationStatus}
              onSortingChange={handleSortingChange}
              isVisible={showSortingOptions}
            />
          </Box>
        </Box>
      )}
      <Box ref={listRef} height={selectedManga ? "100%" : "calc(100% - 60px)"}>
        {selectedManga ? (
          <MangaDetails manga={selectedManga} onClose={handleClose} />
        ) : (
          <>
            {isFirstLoad || isResetting ? (
              <Box textAlign="center" mt={4}>
                <Spinner size="xl" />
                <Text mt={2}>{isResetting ? "Resetting manga list..." : "Loading manga..."}</Text>
              </Box>
            ) : error ? (
              <Box textAlign="center" mt={4}>
                <Text color="red.500" mb={4}>{error}</Text>
                <Button onClick={() => resetAndLoad()} colorScheme="blue">
                  Try Again
                </Button>
              </Box>
            ) : mangas.length > 0 ? (
              <Grid templateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={6} mt={4}>
                {mangas.map((manga, index) => (
                  <Box 
                    key={manga.id} 
                    onClick={() => handleMangaClick(manga)}
                    cursor="pointer"
                    transition="transform 0.2s"
                    _hover={{ transform: 'scale(1.05)' }}
                    height="350px"
                    display="flex"
                    flexDirection="column"
                    ref={index === mangas.length - 1 ? lastMangaElementRef : null}
                  >
                    <Image 
                      src={manga.coverArt} 
                      alt={manga.title} 
                      objectFit="cover" 
                      height="280px" 
                      width="100%" 
                      borderRadius="md" 
                    />
                    <Box mt={2} height="70px" overflow="hidden">
                      <Heading as="h3" size="sm" noOfLines={2}>
                        {manga.title}
                      </Heading>
                    </Box>
                  </Box>
                ))}
              </Grid>
            ) : (
              <Text mt={4} textAlign="center">No manga found. Try adjusting your filters.</Text>
            )}
            {isLoading && (
              <Box textAlign="center" mt={4}>
                <Spinner size="md" />
                <Text mt={2}>Loading more manga...</Text>
              </Box>
            )}
            {!isLoading && !hasMore && (
              <Text mt={4} textAlign="center">No more manga to load.</Text>
            )}
          </>
        )}
      </Box>
      {showScrollTop && (
        <Tooltip label="Scroll to top" placement="left">
          <IconButton
            aria-label="Scroll to top"
            icon={<ArrowUpIcon />}
            position="fixed"
            bottom="20px"
            right="20px"
            colorScheme="blue"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </Tooltip>
      )}
    </Box>
  );
};

export default MangaList;