import React from 'react';
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
  Spacer,
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { MangaDetailsProps } from '../types/MangaDetailsProps';

const MangaDetails: React.FC<MangaDetailsProps> = ({ manga, onClose }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');

  return (
    <Box bg={bgColor} color={textColor} p={8} borderRadius="lg" boxShadow="xl">
      <Flex>
        <Box width="300px" mr={8}>
          <Image
            src={manga.coverArt}
            alt={manga.title}
            objectFit="cover"
            width="100%"
            height="auto"
            borderRadius="md"
          />
        </Box>
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
      <Flex mt={6} justifyContent="space-between" alignItems="center">
        <Button leftIcon={<ArrowBackIcon />} onClick={onClose} variant="outline">
          Back
        </Button>
        <HStack spacing={4}>
          <Button colorScheme="blue">Read</Button>
          <Button colorScheme="green">Add to Library</Button>
        </HStack>
      </Flex>
    </Box>
  );
};

export default MangaDetails;