import React, { useState } from 'react';
import { Box, Button, Checkbox, Radio, RadioGroup, Stack, Text, VStack, Wrap, WrapItem, Collapse, Select } from '@chakra-ui/react';
import { SortOrder } from '../api/mangaApi';
import { tagGroups, TagGroup, Tag } from '../utils/tags';

interface SortingOptionsProps {
  sortOrder: SortOrder;
  contentRating: string[];
  tags: Record<string, number>;
  publicationStatus: string;
  onSortingChange: (sortOrder: SortOrder, contentRating: string[], tags: Record<string, number>, publicationStatus: string) => void;
  isVisible: boolean;
}

const tagGroupsWithIds: Record<string, TagGroup> = tagGroups;

const sortOrderOptions: { value: SortOrder; label: string }[] = [
  { value: 'latestUploadedChapter', label: 'Latest Uploaded Chapter' },
  { value: 'followedCount', label: 'Most Followed' },
  { value: 'relevance', label: 'Relevance' },
  { value: 'createdAt', label: 'Recently Added' },
  { value: 'updatedAt', label: 'Recently Updated' },
  { value: 'title', label: 'Title' },
];

const SortingOptions: React.FC<SortingOptionsProps> = ({ sortOrder, contentRating, tags, publicationStatus, onSortingChange, isVisible }) => {
  const [localSortOrder, setLocalSortOrder] = useState<SortOrder>(sortOrder);
  const [localContentRating, setLocalContentRating] = useState(contentRating);
  const [localTags, setLocalTags] = useState(tags);
  const [localPublicationStatus, setLocalPublicationStatus] = useState(publicationStatus);

  const handleSortOrderChange = (newSortOrder: SortOrder) => {
    setLocalSortOrder(newSortOrder);
  };

  const handleContentRatingChange = (rating: string) => {
    setLocalContentRating(prevRating =>
      prevRating.includes(rating)
        ? prevRating.filter(r => r !== rating)
        : [...prevRating, rating]
    );
  };

  const handleTagChange = (tagId: string) => {
    setLocalTags(prevTags => {
      const updatedTags = { ...prevTags };
      if (updatedTags[tagId] === 1) {
        delete updatedTags[tagId];
      } else {
        updatedTags[tagId] = 1;
      }
      return updatedTags;
    });
  };

  const handlePublicationStatusChange = (newStatus: string) => {
    setLocalPublicationStatus(newStatus);
  };

  const handleApply = () => {
    onSortingChange(
      localSortOrder,
      localContentRating,
      localTags,
      localPublicationStatus
    );
  };

  return (
    <Collapse in={isVisible} animateOpacity>
      <Box p={4} borderWidth={1} borderRadius="md">
        <VStack align="start" spacing={4}>
          <Box>
            <Text fontWeight="bold" mb={2}>Sort Order</Text>
            <Select value={localSortOrder} onChange={(e) => handleSortOrderChange(e.target.value as SortOrder)}>
              {sortOrderOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </Box>

          <Box>
            <Text fontWeight="bold" mb={2}>Content Rating</Text>
            <Stack direction="row" flexWrap="wrap">
              {['safe', 'suggestive', 'erotica'].map(rating => (
                <Checkbox
                  key={rating}
                  isChecked={localContentRating.includes(rating)}
                  onChange={() => handleContentRatingChange(rating)}
                >
                  {rating.charAt(0).toUpperCase() + rating.slice(1)}
                </Checkbox>
              ))}
            </Stack>
          </Box>

          <Box>
            <Text fontWeight="bold" mb={2}>Tags</Text>
            {Object.entries(tagGroupsWithIds).map(([group, groupTags]) => (
              <Box key={group} mb={4}>
                <Text fontWeight="semibold" mb={2}>{group}</Text>
                <Wrap>
                  {groupTags.map((tag: Tag) => (
                    <WrapItem key={tag.id}>
                      <Button
                        size="sm"
                        colorScheme={localTags[tag.id] === 1 ? 'green' : 'gray'}
                        onClick={() => handleTagChange(tag.id)}
                      >
                        {tag.name}
                      </Button>
                    </WrapItem>
                  ))}
                </Wrap>
              </Box>
            ))}
          </Box>

          <Box>
            <Text fontWeight="bold" mb={2}>Publication Status</Text>
            <RadioGroup onChange={handlePublicationStatusChange} value={localPublicationStatus}>
              <Stack direction="row">
                {['ongoing', 'completed', 'hiatus', 'cancelled'].map(status => (
                  <Radio key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Radio>
                ))}
              </Stack>
            </RadioGroup>
          </Box>

          <Button colorScheme="blue" onClick={handleApply}>Apply Changes</Button>
        </VStack>
      </Box>
    </Collapse>
  );
};

export default SortingOptions;