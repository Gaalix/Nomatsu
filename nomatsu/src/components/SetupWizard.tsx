import React, { useState } from 'react';
import {
  Box,
  Button,
  Heading,
  Input,
  Radio,
  RadioGroup,
  Stack,
  VStack,
  Text,
  Flex,
  useColorModeValue,
  SlideFade,
} from '@chakra-ui/react';
import { ArrowForwardIcon, ArrowBackIcon } from '@chakra-ui/icons';
import { useColorMode } from '../hooks/useColorMode';

interface SetupWizardProps {
  onComplete: () => void;
}

const SetupWizard: React.FC<SetupWizardProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [downloadFolder, setDownloadFolder] = useState('');
  const { isDarkMode, toggleColorMode } = useColorMode();

  const handleNext = () => {
    setStep(step + 1);
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  const handleFinish = () => {
    console.log('Setup complete');
    onComplete();
  };

  const bgColor = useColorModeValue('blue.50', 'blue.900');
  const textColor = useColorModeValue('blue.800', 'blue.100');
  const cardBgColor = useColorModeValue('white', 'gray.800');

  const Logo = () => (
    <Flex align="center" mb={8} justify="center">
      <Box
        as="span"
        fontWeight="extrabold"
        fontSize="4xl"
        bgGradient="linear(to-r, blue.400, teal.500)"
        bgClip="text"
        border="4px solid"
        borderColor="blue.400"
        borderRadius="full"
        p={2}
        mr={2}
      >
        N
      </Box>
      <Text fontSize="3xl" fontWeight="bold" letterSpacing="wider">
        omatsu
      </Text>
    </Flex>
  );

  return (
    <Box
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      bg={bgColor}
      color={textColor}
    >
      <Box maxWidth="500px" width="100%" p={8} borderRadius="lg" boxShadow="xl" bg={cardBgColor}>
        <Logo />
        <SlideFade in={true} offsetY="20px">
          {step === 1 && (
            <VStack spacing={6} align="stretch">
              <Heading as="h2" size="lg" mb={4} textAlign="center">Choose Theme</Heading>
              <RadioGroup onChange={toggleColorMode} value={isDarkMode ? 'dark' : 'light'}>
                <Stack direction="row" spacing={8} justify="center">
                  <Radio value="light">Light</Radio>
                  <Radio value="dark">Dark</Radio>
                </Stack>
              </RadioGroup>
            </VStack>
          )}
          {step === 2 && (
            <VStack spacing={6} align="stretch">
              <Heading as="h2" size="lg" mb={4} textAlign="center">MangaDex Login</Heading>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
              />
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
            </VStack>
          )}
          {step === 3 && (
            <VStack spacing={6} align="stretch">
              <Heading as="h2" size="lg" mb={4} textAlign="center">Select Download Folder</Heading>
              <Input
                value={downloadFolder}
                onChange={(e) => setDownloadFolder(e.target.value)}
                placeholder="Enter folder path"
              />
              <Button onClick={() => alert('Open folder dialog')} colorScheme="blue">Browse</Button>
            </VStack>
          )}
        </SlideFade>
        <Flex justifyContent="space-between" mt={8}>
          {step > 1 && (
            <Button leftIcon={<ArrowBackIcon />} onClick={handlePrevious} variant="outline">
              Previous
            </Button>
          )}
          {step < 3 ? (
            <Button rightIcon={<ArrowForwardIcon />} onClick={handleNext} ml="auto" colorScheme="blue">
              Next
            </Button>
          ) : (
            <Button onClick={handleFinish} ml="auto" colorScheme="green">
              Finish
            </Button>
          )}
        </Flex>
      </Box>
    </Box>
  );
};

export default SetupWizard;