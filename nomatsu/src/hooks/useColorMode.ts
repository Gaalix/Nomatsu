import { useColorMode as useChakraColorMode } from '@chakra-ui/react';

export const useColorMode = () => {
  const { colorMode, toggleColorMode } = useChakraColorMode();

  return {
    isDarkMode: colorMode === 'dark',
    toggleColorMode,
  };
};