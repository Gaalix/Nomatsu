import React from 'react';
import { Box, Text, Flex, useColorModeValue } from '@chakra-ui/react';

const Logo: React.FC = () => {
  const textColor = useColorModeValue('gray.800', 'white');
  const borderColor = useColorModeValue('blue.400', 'blue.200');

  return (
    <Flex align="center">
      <Box
        as="span"
        fontWeight="extrabold"
        fontSize="2xl"
        bgGradient="linear(to-r, blue.400, teal.500)"
        bgClip="text"
        border="2px solid"
        borderColor={borderColor}
        borderRadius="full"
        p={1}
        mr={2}
      >
        N
      </Box>
      <Text fontSize="xl" fontWeight="bold" letterSpacing="wider" color={textColor}>
        omatsu
      </Text>
    </Flex>
  );
};

export default Logo;