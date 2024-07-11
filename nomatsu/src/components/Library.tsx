import React, { useState } from 'react';
import {
  Box,
  Grid,
  Image,
  Text,
  VStack,
  Heading,
  useColorModeValue,
  IconButton,
} from '@chakra-ui/react';
import { useLibrary } from '../hooks/useLibrary';
import { DeleteIcon } from '@chakra-ui/icons';
import MangaDetails from './MangaDetails';
import { Manga } from '../types/Manga';

const Library: React.FC = () => {
  const { library, removeFromLibrary } = useLibrary();
  const [selectedManga, setSelectedManga] = useState<Manga | null>(null);
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBgColor = useColorModeValue('white', 'gray.800');

  const handleMangaClick = (manga: Manga) => {
    setSelectedManga(manga);
  };

  const handleClose = () => {
    setSelectedManga(null);
  };

  return (
    <Box height="calc(100vh - 60px)" bg={bgColor} overflowY="auto" p={4}>
      <Heading as="h2" size="xl" mb={6}>
        My Library
      </Heading>
      {library.length === 0 ? (
        <Text>Your library is empty. Add some manga to get started!</Text>
      ) : selectedManga ? (
        <MangaDetails manga={selectedManga} onClose={handleClose} />
      ) : (
        <Grid templateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={6}>
          {library.map((manga) => (
            <Box
              key={manga.id}
              borderWidth={1}
              borderRadius="lg"
              overflow="hidden"
              bg={cardBgColor}
              boxShadow="md"
              onClick={() => handleMangaClick(manga)}
            >
              <Image
                src={manga.coverArt}
                alt={manga.title}
                height="250px"
                width="100%"
                objectFit="cover"
              />
              <VStack p={4} align="start" spacing={2}>
                <Heading as="h3" size="md" noOfLines={2}>
                  {manga.title}
                </Heading>
                <Text fontSize="sm" color="gray.500">
                  {manga.author}
                </Text>
                <IconButton
                  aria-label="Remove from Library"
                  icon={<DeleteIcon />}
                  onClick={() => removeFromLibrary(manga.id)}
                  size="sm"
                  colorScheme="red"
                />
              </VStack>
            </Box>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Library;