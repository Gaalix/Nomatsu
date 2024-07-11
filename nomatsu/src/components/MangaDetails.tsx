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
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { MangaDetailsProps } from '../types/MangaDetailsProps';
import { fetchMangaChapters } from '../api/mangaApi';
import { useLibrary } from '../hooks/useLibrary';
import MangaReader from './MangaReader';

const MangaDetails: React.FC<MangaDetailsProps> = ({ manga, onClose }) => {
  const [chapters, setChapters] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  const { isInLibrary, addToLibrary, removeFromLibrary } = useLibrary();
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const cardBgColor = useColorModeValue('gray.100', 'gray.700');
  const hoverBgColor = useColorModeValue('gray.200', 'gray.600');

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
    <Box bg={bgColor} color={textColor} p={4} borderRadius="lg" boxShadow="xl">
      <Flex mb={6} flexDirection={{ base: 'column', md: 'row' }}>
        <Image
          src={manga.coverArt}
          alt={manga.title}
          objectFit="cover"
          width={{ base: '100%', md: '200px' }}
          height={{ base: '300px', md: 'auto' }}
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
            <Box>
              <Text fontWeight="bold" mb={2}>
                Summary:
              </Text>
              <Text>{manga.summary}</Text>
            </Box>
          )}
        </VStack>
      </Flex>

      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Button leftIcon={<ArrowBackIcon />} onClick={onClose} variant="outline">
          Back
        </Button>
        <Button
          leftIcon={isInLibrary(manga.id) ? <AiFillHeart /> : <AiOutlineHeart />}
          onClick={toggleLibrary}
          colorScheme={isInLibrary(manga.id) ? "red" : "gray"}
          variant="outline"
        >
          {isInLibrary(manga.id) ? "Remove from Library" : "Add to Library"}
        </Button>
      </Flex>

      <Box>
        <Heading as="h3" size="md" mb={4}>
          Chapters
        </Heading>
        {isLoading ? (
          <Flex justifyContent="center" alignItems="center" height="200px">
            <Spinner size="xl" />
          </Flex>
        ) : (
          <VStack spacing={2} align="stretch">
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
                <Flex justifyContent="space-between" alignItems="center">
                  <Text fontWeight="bold">
                    Chapter {chapter.attributes.chapter}: {chapter.attributes.title || 'No Title'}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    {new Date(chapter.attributes.publishAt).toLocaleDateString()}
                  </Text>
                </Flex>
              </Box>
            ))}
          </VStack>
        )}
      </Box>
    </Box>
  );
};

export default MangaDetails;