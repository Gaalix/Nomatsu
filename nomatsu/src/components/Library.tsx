import React, { useState } from 'react';
import {
  Box,
  Grid,
  Image,
  Text,
  VStack,
  Heading,
  useColorModeValue,
  Flex,
} from '@chakra-ui/react';
import { useLibrary } from '../hooks/useLibrary';
import MangaDetails from './MangaDetails';
import { Manga } from '../types/Manga';
import ReactCountryFlag from "react-country-flag";
import { BiBook } from 'react-icons/bi';

const Library: React.FC = () => {
  const { library } = useLibrary();
  const [selectedManga, setSelectedManga] = useState<Manga | null>(null);
  const bgColor = useColorModeValue('white', 'gray.900');
  const textColor = useColorModeValue('gray.800', 'gray.100');
  const cardBgColor = useColorModeValue('white', 'gray.800');

  const handleMangaClick = (manga: Manga) => {
    setSelectedManga(manga);
  };

  const handleClose = () => {
    setSelectedManga(null);
  };

  return (
    <Box height="calc(100vh - 60px)" overflowY="auto" p={4} bg={bgColor}>
      <Heading as="h2" size="xl" mb={6} color={textColor}>
        My Library
      </Heading>
      {library.length === 0 ? (
        <Text color={textColor}>Your library is empty. Add some manga to get started!</Text>
      ) : selectedManga ? (
        <MangaDetails manga={selectedManga} onClose={handleClose} />
      ) : (
        <Grid templateColumns="repeat(3, 1fr)" gap={6}>
          {library.map((manga) => (
            <Box
              key={manga.id}
              onClick={() => handleMangaClick(manga)}
              cursor="pointer"
              borderWidth={1}
              borderRadius="lg"
              overflow="hidden"
              bg={cardBgColor}
              boxShadow="md"
              transition="all 0.2s"
              _hover={{ transform: 'scale(1.02)', boxShadow: 'lg' }}
              position="relative"
            >
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
              <Flex position="relative" height="200px">
                <Image
                  src={manga.coverArt}
                  alt={manga.title}
                  objectFit="cover"
                  width="133px"
                  height="200px"
                />
                <Box p={3} flex={1} display="flex" flexDirection="column">
                  <Heading as="h3" size="sm" noOfLines={2} mb={2} alignSelf="flex-start">
                    {manga.title}
                  </Heading>
                  <VStack align="flex-start" spacing={2} flex={1}>
                    <Text fontSize="sm" color="gray.500">
                      {manga.author}
                    </Text>
                    <Flex alignItems="center">
                      <ReactCountryFlag
                        countryCode={manga.language === 'en' ? 'US' : manga.language.toUpperCase()}
                        svg
                        style={{ width: '1em', height: '1em', marginRight: '0.5em' }}
                      />
                      <Text fontSize="sm">
                        Latest: Ch. {manga.latestChapter}
                      </Text>
                    </Flex>
                  </VStack>
                </Box>
              </Flex>
            </Box>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Library;