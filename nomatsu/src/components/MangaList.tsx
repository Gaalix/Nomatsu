import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  Flex,
  Grid,
  Image,
  Text,
  Spinner,
  Tooltip,
  IconButton,
  useColorModeValue,
  VStack,
  Heading,
  Input,
  Badge,
  ScaleFade,
  Collapse,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Icon,
} from '@chakra-ui/react';
import { ArrowUpIcon, SearchIcon, StarIcon } from '@chakra-ui/icons';
import { Manga } from '../types/Manga';
import { useMangaList } from '../hooks/useMangaList';
import MangaDetails from './MangaDetails';
import { SortOrder } from '../api/mangaApi';
import { useInView } from 'react-intersection-observer';
import SortingOptions, { languageOptions } from './SortingOptions';
import ReactCountryFlag from "react-country-flag";
import { useLibrary } from '../hooks/useLibrary';
import { BiBook } from 'react-icons/bi';

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
    isResetting,
    language,
    setLanguage
  } = useMangaList();
  const { isInLibrary } = useLibrary();
  const [selectedManga, setSelectedManga] = useState<Manga | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showSortingOptions, setShowSortingOptions] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
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

  const handleSortingChange = (newSortOrder: SortOrder, newContentRating: string[], newTags: Record<string, number>, newPublicationStatus: string, newLanguage: string) => {
    setSortOrder(newSortOrder);
    setContentRating(newContentRating);
    setTags(newTags);
    setPublicationStatus(newPublicationStatus);
    setLanguage(newLanguage);
    setShowSortingOptions(false);
  };

  useEffect(() => {
    resetAndLoad();
  }, [sortOrder, contentRating, tags, publicationStatus, language]);

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

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBgColor = useColorModeValue('white', 'gray.800');

  return (
    <Box height="calc(100vh - 60px)" bg={bgColor}>
      {!selectedManga && (
        <Box mb={2} p={2}>
          <Flex justifyContent="space-between" alignItems="center" mb={2}>
            <Heading size="md">{getSortOrderLabel(sortOrder)}</Heading>
            <Flex>
              <Button onClick={toggleSortingOptions} size="sm" mr={2}>
                {showSortingOptions ? 'Hide Filters' : 'Show Filters'}
              </Button>
              <Input
                placeholder="Search manga..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                width="200px"
                size="sm"
              />
            </Flex>
          </Flex>
          <Modal isOpen={showSortingOptions} onClose={toggleSortingOptions} size="full">
            <ModalOverlay />
            <ModalContent maxWidth="90vw" maxHeight="90vh">
              <ModalHeader>Sorting Options</ModalHeader>
              <ModalCloseButton />
              <ModalBody overflowY="auto">
                <SortingOptions
                  sortOrder={sortOrder}
                  contentRating={contentRating}
                  tags={tags}
                  publicationStatus={publicationStatus}
                  language={language}
                  onSortingChange={handleSortingChange}
                  isVisible={showSortingOptions}
                />
              </ModalBody>
            </ModalContent>
          </Modal>
        </Box>
      )}
      <Box ref={listRef} height="100%" overflowY="auto">
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
              <Grid templateColumns="repeat(3, 1fr)" gap={4} p={2}>
                {mangas.map((manga, index) => (
                  <ScaleFade in={true} key={manga.id}>
                    <Box
                      onClick={() => handleMangaClick(manga)}
                      cursor="pointer"
                      borderWidth={1}
                      borderRadius="lg"
                      overflow="hidden"
                      bg={cardBgColor}
                      boxShadow="md"
                      transition="all 0.2s"
                      _hover={{ transform: 'scale(1.02)', boxShadow: 'lg' }}
                      ref={index === mangas.length - 1 ? lastMangaElementRef : null}
                      borderColor={isInLibrary(manga.id) ? 'blue.500' : 'transparent'}
                      position="relative"
                    >
                      {isInLibrary(manga.id) && (
                        <Box
                          position="absolute"
                          top={2}
                          left={2}
                          bg="blue.500"
                          color="white"
                          borderRadius="full"
                          p={1}
                        >
                          <BiBook />
                        </Box>
                      )}
                      <Flex position="relative" height="150px">
                        <Image
                          src={manga.coverArt}
                          alt={manga.title}
                          objectFit="cover"
                          width="100px"
                          height="150px"
                        />
                        <Box p={2} flex={1} display="flex" flexDirection="column">
                          <Heading as="h3" size="sm" noOfLines={2} mb={2} alignSelf="flex-start">
                            {manga.title}
                          </Heading>
                          <VStack align="flex-start" spacing={1} flex={1}>
                            <Text fontSize="xs" color="gray.500">
                              {manga.author}
                            </Text>
                            <Flex alignItems="center">
                              <ReactCountryFlag
                                countryCode={manga.language === 'en' ? 'US' : manga.language.toUpperCase()}
                                svg
                                style={{ width: '1em', height: '1em', marginRight: '0.5em' }}
                              />
                              <Text fontSize="xs">
                                Latest: Ch. {manga.latestChapter}
                              </Text>
                            </Flex>
                          </VStack>
                        </Box>
                      </Flex>
                    </Box>
                  </ScaleFade>
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
              listRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </Tooltip>
      )}
    </Box>
  );
};

const getSortOrderLabel = (sortOrder: SortOrder): string => {
  switch (sortOrder) {
    case 'latestUploadedChapter':
      return 'Latest Uploads';
    case 'followedCount':
      return 'Most Popular';
    case 'relevance':
      return 'Relevant Manga';
    case 'createdAt':
      return 'Recently Added';
    case 'updatedAt':
      return 'Recently Updated';
    case 'title':
      return 'Manga by Title';
    default:
      return 'Manga List';
  }
};

export default MangaList;