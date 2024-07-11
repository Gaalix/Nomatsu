import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  HStack,
  Image,
  Tag,
  useColorModeValue,
  Flex,
  Spinner,
  useToast,
  Grid,
  IconButton,
  Tooltip
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { MangaDetailsProps } from '../types/MangaDetailsProps';
import { fetchMangaChapters } from '../api/mangaApi';
import { useLibrary } from '../hooks/useLibrary';
import MangaReader from './MangaReader';
import Logo from './Logo';

const MangaDetails: React.FC<MangaDetailsProps> = ({ manga, onClose }) => {
  const [chapters, setChapters] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  const { isInLibrary, addToLibrary, removeFromLibrary } = useLibrary();
  const toast = useToast();

  const bgColor = useColorModeValue('white', 'gray.900');
  const textColor = useColorModeValue('gray.800', 'gray.100');
  const cardBgColor = useColorModeValue('gray.100', 'gray.800');
  const hoverBgColor = useColorModeValue('gray.200', 'gray.700');
  const headerBgColor = useColorModeValue('gray.100', 'gray.700');

  useEffect(() => {
    const loadChapters = async () => {
      try {
        const fetchedChapters = await fetchMangaChapters(manga.id, manga.language);
        setChapters(fetchedChapters);
      } catch (error) {
        console.error('Failed to fetch chapters:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadChapters();
    window.scrollTo(0, 0);
  }, [manga.id, manga.language]);

  const toggleLibrary = () => {
    if (isInLibrary(manga.id)) {
      removeFromLibrary(manga.id);
      toast({
        title: "Removed from Library",
        status: "info",
        duration: 2000,
        isClosable: true,
      });
    } else {
      addToLibrary(manga);
      toast({
        title: "Added to Library",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const handleChapterClick = (chapterId: string) => {
    setSelectedChapter(chapterId);
  };

  if (selectedChapter) {
    return (
      <Box position="fixed" top={0} left={0} right={0} bottom={0} zIndex={20}>
        <MangaReader mangaId={manga.id} chapterId={selectedChapter} onClose={() => setSelectedChapter(null)} />
      </Box>
    );
  }

  return (
    <Box bg={bgColor} color={textColor} position="fixed" top={0} left={0} right={0} bottom={0} zIndex={20} overflowY="auto">
      <Flex as="nav" align="center" justify="space-between" padding="0.75rem" bg={headerBgColor}>
        <Logo />
        <Flex>
          <Tooltip label="Back to Manga List" placement="bottom">
            <IconButton
              aria-label="Back to Manga List"
              icon={<ArrowBackIcon />}
              onClick={onClose}
              size="sm"
              variant="ghost"
              mr={2}
            />
          </Tooltip>
        </Flex>
      </Flex>
      <Box p={4}>
        <Flex mb={6} flexDirection={{ base: 'column', md: 'row' }}>
          <Image
            src={manga.coverArt}
            alt={manga.title}
            objectFit="cover"
            width={{ base: '100%', md: '300px' }}
            height={{ base: '400px', md: 'auto' }}
            borderRadius="md"
            mb={{ base: 4, md: 0 }}
            mr={{ md: 6 }}
          />
          <VStack align="start" spacing={4} flex={1}>
            <Heading as="h2" size="xl">
              {manga.title}
            </Heading>
            {manga.author && <Text fontSize="lg" fontStyle="italic">{manga.author}</Text>}
            {manga.genres && manga.genres.length > 0 && (
              <HStack spacing={2} flexWrap="wrap">
                {manga.genres.map((genre) => (
                  <Tag key={genre} colorScheme="blue" borderRadius="full" px={3} py={1} mb={2}>
                    {genre}
                  </Tag>
                ))}
              </HStack>
            )}
            {manga.summary && (
              <Box width="100%">
                <Text fontWeight="bold" mb={2}>
                  Summary:
                </Text>
                <Text textAlign="left">{manga.summary}</Text>
              </Box>
            )}
            <Flex justifyContent="space-between" width="100%" mt={4}>
              <Button
                leftIcon={isInLibrary(manga.id) ? <AiFillHeart /> : <AiOutlineHeart />}
                onClick={toggleLibrary}
                colorScheme={isInLibrary(manga.id) ? "red" : "gray"}
                variant="outline"
              >
                {isInLibrary(manga.id) ? "Remove from Library" : "Add to Library"}
              </Button>
            </Flex>
          </VStack>
        </Flex>

        <Box mt={8}>
          <Heading as="h3" size="lg" mb={4}>
            Chapters
          </Heading>
          {isLoading ? (
            <Flex justifyContent="center" alignItems="center" height="200px">
              <Spinner size="xl" />
            </Flex>
          ) : (
            <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={4}>
              {chapters.map((chapter) => (
                <Box
                  key={chapter.id}
                  p={3}
                  bg={cardBgColor}
                  borderRadius="md"
                  _hover={{ bg: hoverBgColor }}
                  cursor="pointer"
                  onClick={() => handleChapterClick(chapter.id)}
                >
                  <Text fontWeight="bold">
                    Chapter {chapter.attributes.chapter}: {chapter.attributes.title || 'No Title'}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    {new Date(chapter.attributes.publishAt).toLocaleDateString()}
                  </Text>
                </Box>
              ))}
            </Grid>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default MangaDetails;