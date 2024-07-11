import React, { useState } from 'react';
import './App.css';
import MangaList from './components/MangaList';
import Library from './components/Library';
import SetupWizard from './components/SetupWizard';
import { Box, Flex, IconButton, Tooltip, useColorModeValue } from '@chakra-ui/react';
import { SearchIcon, TimeIcon, SettingsIcon } from '@chakra-ui/icons';
import { BiBook } from 'react-icons/bi';
import Logo from './components/Logo';

function App() {
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [currentView, setCurrentView] = useState<'browse' | 'library' | 'history' | 'settings'>('library');

  const bgColor = useColorModeValue('gray.100', 'gray.700');
  const iconColor = useColorModeValue('gray.800', 'white');
  const hoverBgColor = useColorModeValue('gray.200', 'gray.600');

  const navItems = [
    { label: 'Library', icon: BiBook, view: 'library' },
    { label: 'Browse', icon: SearchIcon, view: 'browse' },
    { label: 'History', icon: TimeIcon, view: 'history' },
    { label: 'Settings', icon: SettingsIcon, view: 'settings' },
  ];

  return (
    <Box className="App" height="100vh" overflowY="auto">
      {!isSetupComplete ? (
        <SetupWizard onComplete={() => setIsSetupComplete(true)} />
      ) : (
        <>
          <Flex as="nav" align="center" justify="space-between" padding="0.75rem" bg={bgColor}>
            <Logo />
            <Flex>
              {navItems.map(({ label, icon: Icon, view }) => (
                <Tooltip key={view} label={label} aria-label={`${label} tooltip`}>
                  <IconButton
                    aria-label={label}
                    icon={<Icon />}
                    onClick={() => setCurrentView(view as 'browse' | 'library' | 'history' | 'settings')}
                    size="sm"
                    variant="ghost"
                    color={currentView === view ? 'blue.500' : iconColor}
                    _hover={{ bg: hoverBgColor }}
                    mr={2}
                  />
                </Tooltip>
              ))}
            </Flex>
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