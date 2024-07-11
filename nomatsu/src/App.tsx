import React, { useState } from 'react';
import './App.css';
import MangaList from './components/MangaList';
import Library from './components/Library';
import SetupWizard from './components/SetupWizard';
import { Box, Flex, IconButton, Spacer, Tooltip, useColorModeValue } from '@chakra-ui/react';
import { SearchIcon, TimeIcon, SettingsIcon } from '@chakra-ui/icons';
import { BiBook } from 'react-icons/bi';
import Logo from './components/Logo';

function App() {
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [currentView, setCurrentView] = useState<'browse' | 'library' | 'history' | 'settings'>('browse');

  const bgColor = useColorModeValue('gray.100', 'gray.700');
  const iconColor = useColorModeValue('gray.800', 'white');

  return (
    <Box className="App" height="100vh" overflowY="auto">
      {!isSetupComplete ? (
        <SetupWizard onComplete={() => setIsSetupComplete(true)} />
      ) : (
        <>
          <Flex as="nav" align="center" justify="space-between" wrap="wrap" padding="1.5rem" bg={bgColor}>
            <Logo />
            <Spacer />
            <Box>
              <Tooltip label="Browse" aria-label="Browse tooltip">
                <IconButton
                  aria-label="Browse"
                  icon={<SearchIcon />}
                  onClick={() => setCurrentView('browse')}
                  mr={2}
                  color={iconColor}
                />
              </Tooltip>
              <Tooltip label="Library" aria-label="Library tooltip">
                <IconButton
                  aria-label="Library"
                  icon={<BiBook />}
                  onClick={() => setCurrentView('library')}
                  mr={2}
                  color={iconColor}
                />
              </Tooltip>
              <Tooltip label="History" aria-label="History tooltip">
                <IconButton
                  aria-label="History"
                  icon={<TimeIcon />}
                  onClick={() => setCurrentView('history')}
                  mr={2}
                  color={iconColor}
                />
              </Tooltip>
              <Tooltip label="Settings" aria-label="Settings tooltip">
                <IconButton
                  aria-label="Settings"
                  icon={<SettingsIcon />}
                  onClick={() => setCurrentView('settings')}
                  color={iconColor}
                />
              </Tooltip>
            </Box>
          </Flex>
          <Box as="main">
            {currentView === 'browse' && <MangaList />}
            {currentView === 'library' && <Library />}
            {/* Add other components for history and settings views */}
          </Box>
        </>
      )}
    </Box>
  );
}

export default App;