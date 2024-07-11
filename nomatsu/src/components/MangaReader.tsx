import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Flex,
  Text,
  IconButton,
  useColorModeValue,
} from '@chakra-ui/react';
import { ChevronLeftIcon, ArrowBackIcon } from '@chakra-ui/icons';
import axios from 'axios';

interface MangaReaderProps {
  mangaId: string;
  chapterId: string;
  onClose: () => void;
}

const MangaReader: React.FC<MangaReaderProps> = ({ mangaId, chapterId, onClose }) => {
  const [pages, setPages] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [chapterInfo, setChapterInfo] = useState<any>(null);
  const [showMenu, setShowMenu] = useState(true);
  const readerRef = useRef<HTMLDivElement>(null);
  const lastScrollTop = useRef(0);

  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');

  useEffect(() => {
    const fetchChapterPages = async () => {
      try {
        const response = await axios.get(`https://api.mangadex.org/at-home/server/${chapterId}`);
        const baseUrl = response.data.baseUrl;
        const chapterHash = response.data.chapter.hash;
        const pageFilenames = response.data.chapter.data;
        const pageUrls = pageFilenames.map((filename: string) => 
          `${baseUrl}/data/${chapterHash}/${filename}`
        );
        setPages(pageUrls);
        setChapterInfo(response.data.chapter);
      } catch (error) {
        console.error('Error fetching chapter pages:', error);
      }
    };

    fetchChapterPages();
  }, [chapterId]);

  const handleScroll = () => {
    if (readerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = readerRef.current;
      const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
      const currentPage = Math.floor((pages.length * progress) / 100);
      setCurrentPage(currentPage);

      // Show/hide menu based on scroll direction
      if (scrollTop > lastScrollTop.current) {
        setShowMenu(false);
      } else {
        setShowMenu(true);
      }
      lastScrollTop.current = scrollTop;
    }
  };

  return (
    <Box height="100vh" width="100vw" bg={bgColor} position="relative">
      <Flex
        position="fixed"
        top={0}
        left={0}
        right={0}
        p={4}
        bg={bgColor}
        justifyContent="space-between"
        alignItems="center"
        zIndex={10}
        transform={showMenu ? 'translateY(0)' : 'translateY(-100%)'}
        transition="transform 0.3s ease-in-out"
      >
        <IconButton
          aria-label="Back"
          icon={<ArrowBackIcon />}
          onClick={onClose}
        />
        <Text color={textColor}>
          Chapter {chapterInfo?.chapter} - Page {currentPage + 1} of {pages.length}
        </Text>
        <IconButton
          aria-label="Previous Chapter"
          icon={<ChevronLeftIcon />}
          onClick={() => {/* Implement previous chapter logic */}}
        />
      </Flex>

      <Box
        ref={readerRef}
        height="100vh"
        overflowY="auto"
        overflowX="hidden"
        css={{
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(0,0,0,0.2)',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: 'rgba(0,0,0,0.3)',
          },
        }}
        onScroll={handleScroll}
      >
        {pages.map((pageUrl, index) => (
          <Box key={index} width="100%" display="flex" justifyContent="center" position="relative">
            <img 
              src={pageUrl} 
              alt={`Page ${index + 1}`} 
              style={{ 
                maxWidth: '100%', 
                height: 'auto', 
                display: 'block',
                margin: '0 auto'
              }} 
            />
          </Box>
        ))}
      </Box>

      <Box
        position="fixed"
        bottom={0}
        left={0}
        right={0}
        height="4px"
        bg="blue.500"
        width={`${((currentPage + 1) / pages.length) * 100}%`}
      />
    </Box>
  );
};

export default MangaReader;