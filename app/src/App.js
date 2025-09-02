import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import { ScraperProvider } from './contexts/ScraperContext';
import { CustomThemeProvider, useThemeMode } from './contexts/ThemeContext';
import Header from './components/UI/Header';
import ConfigurationSidebar from './components/Configuration/ConfigurationSidebar';
import Gallery from './components/Gallery/Gallery';

function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { theme } = useThemeMode();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ScraperProvider>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Header
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
          <Box sx={{ display: 'flex', flex: 1 }}>
            <ConfigurationSidebar
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
            />
            <Box
              component="main"
              sx={{
                flex: 1,
                p: 3,
                // Remove the large left margin that was causing centering issues
                width: '100%',
                height: 'calc(100vh - 104px)', // Set explicit height for proper sticky behavior
                overflow: 'auto',
                // Add smooth transition for sidebar open/close
                transition: (theme) => theme.transitions.create(['height', 'width'], {
                  easing: theme.transitions.easing.easeInOut,
                  duration: theme.transitions.duration.standard,
                }),
              }}
            >
              <Gallery />
            </Box>
          </Box>
        </Box>
      </ScraperProvider>
    </ThemeProvider>
  );
}

function App() {
  return (
    <CustomThemeProvider>
      <AppContent />
    </CustomThemeProvider>
  );
}

export default App;
