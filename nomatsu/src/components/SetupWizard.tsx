import React, { useState } from 'react';
import {
  Box,
  Button,
  Heading,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';

interface SetupWizardProps {
  onComplete: () => void;
}

const SetupWizard: React.FC<SetupWizardProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [downloadFolder, setDownloadFolder] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [theme, setTheme] = useState('light');

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

  return (
    <Box maxWidth="500px" margin="0 auto" padding={5}>
      <Heading as="h1" size="xl" mb={6}>Welcome to Nomatsu</Heading>
      <VStack spacing={6} align="stretch">
        {step === 1 && (
          <Box>
            <Heading as="h2" size="lg" mb={4}>Select Download Folder</Heading>
            <Input
              value={downloadFolder}
              onChange={(e) => setDownloadFolder(e.target.value)}
              placeholder="Enter folder path"
              mb={4}
            />
            <Button onClick={() => alert('Open folder dialog')}>Browse</Button>
          </Box>
        )}
        {step === 2 && (
          <Box>
            <Heading as="h2" size="lg" mb={4}>MangaDex Login</Heading>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              mb={4}
            />
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
          </Box>
        )}
        {step === 3 && (
          <Box>
            <Heading as="h2" size="lg" mb={4}>Choose Theme</Heading>
            <RadioGroup onChange={setTheme} value={theme}>
              <Stack direction="row">
                <Radio value="light">Light</Radio>
                <Radio value="dark">Dark</Radio>
              </Stack>
            </RadioGroup>
          </Box>
        )}
      </VStack>
      <Stack direction="row" justifyContent="space-between" mt={6}>
        {step > 1 && <Button onClick={handlePrevious}>Previous</Button>}
        {step < 3 ? (
          <Button onClick={handleNext} ml="auto">Next</Button>
        ) : (
          <Button onClick={handleFinish} ml="auto" colorScheme="green">Finish</Button>
        )}
      </Stack>
    </Box>
  );
};

export default SetupWizard;