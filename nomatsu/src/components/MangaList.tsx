import React, {useState, useRef, useEffect} from 'react';
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
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react';
import {ArrowUpIcon} from '@chakra-ui/icons';
import {Manga} from '../types/Manga';
import {useMangaList} from '../hooks/useMangaList';
import MangaDetails from './MangaDetails';
import {SortOrder} from '../api/mangaApi';
import {useInView} from 'react-intersection-observer';
import SortingOptions from './SortingOptions';
import ReactCountryFlag from "react-country-flag";
import {useLibrary} from '../hooks/useLibrary';
import {BiBook} from 'react-icons/bi';

const INITIAL_SCROLL_POSITION = 0;
const SCROLL_TOP_THRESHOLD = 300;

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
        setLanguage,
        searchQuery,
        setSearchQuery,
        searchResults,
    } = useMangaList();
    const {isInLibrary} = useLibrary();
    const [selectedManga, setSelectedManga] = useState<Manga | null>(null);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [showSortingOptions, setShowSortingOptions] = useState(false);
    const listRef = useRef<HTMLDivElement>(null);
    const [scrollPosition, setScrollPosition] = useState(INITIAL_SCROLL_POSITION);

    const {ref: lastMangaElementRef, inView} = useInView({
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
                listRef.current?.scrollTo({top: scrollPosition, behavior: 'auto'});
            }, 0);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            if (listRef.current) {
                setShowScrollTop(listRef.current.scrollTop > SCROLL_TOP_THRESHOLD);
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

    const bgColor = useColorModeValue('white', 'gray.900');
    const textColor = useColorModeValue('gray.800', 'gray.100');
    const cardBgColor = useColorModeValue('white', 'gray.800');

    return (
        <Box bg={bgColor} color={textColor} p={4}>
            <Flex justifyContent="space-between" alignItems="center" mb={4}>
                <Heading size="lg">{getSortOrderLabel(sortOrder)}</Heading>
                <Flex>
                    <Button onClick={toggleSortingOptions} colorScheme="blue" mr={2}>
                        Filters
                    </Button>
                    <Input
                        placeholder="Search manga..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        width="200px"
                    />
                </Flex>
            </Flex>

            {isFirstLoad || isResetting ? (
                <Flex direction="column" alignItems="center" justifyContent="center" height="50vh">
                    <Spinner size="xl"/>
                    <Text mt={2}>{isResetting ? "Resetting manga list..." : "Loading manga..."}</Text>
                </Flex>
            ) : error ? (
                <Flex direction="column" alignItems="center" justifyContent="center" height="50vh">
                    <Text color="red.500" mb={4}>{error}</Text>
                    <Button onClick={() => resetAndLoad()} colorScheme="blue">
                        Try Again
                    </Button>
                </Flex>
            ) : mangas.length > 0 ? (
                <Grid templateColumns="repeat(3, 1fr)" gap={6}>
                    {(searchQuery.length >= 2 ? searchResults : mangas).map((manga, index) => (
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
                            _hover={{transform: 'scale(1.02)', boxShadow: 'lg'}}
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
                                    <BiBook/>
                                </Box>
                            )}
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
                                                style={{width: '1em', height: '1em', marginRight: '0.5em'}}
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
            ) : (
                <Text mt={4} textAlign="center">No manga found. Try adjusting your filters.</Text>
            )}
            {isLoading && (
                <Flex justifyContent="center" mt={4}>
                    <Spinner size="md"/>
                    <Text ml={2}>Loading more manga...</Text>
                </Flex>
            )}
            {!isLoading && !hasMore && (
                <Text mt={4} textAlign="center">No more manga to load.</Text>
            )}

            {selectedManga && (
                <MangaDetails manga={selectedManga} onClose={handleClose}/>
            )}

            <Modal isOpen={showSortingOptions} onClose={toggleSortingOptions} size="xl">
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>Sorting Options</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
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

            {showScrollTop && (
                <Tooltip label="Scroll to top" placement="left">
                    <IconButton
                        aria-label="Scroll to top"
                        icon={<ArrowUpIcon/>}
                        position="fixed"
                        bottom="20px"
                        right="20px"
                        colorScheme="blue"
                        onClick={() => {
                            window.scrollTo({top: 0, behavior: 'smooth'});
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