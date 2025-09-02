import React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Box,
    Chip,
    CircularProgress,
    Tooltip,
} from '@mui/material';
import {
    Settings as SettingsIcon,
    DarkMode as DarkModeIcon,
    LightMode as LightModeIcon,
    BugReport as BugReportIcon,
} from '@mui/icons-material';
import { useScraper } from '../../contexts/ScraperContext';
import { useThemeMode } from '../../contexts/ThemeContext';
import { useAnimatedCounter } from '../../hooks/useAnimatedCounter';
import Logo from './Logo';

function Header({ sidebarOpen, setSidebarOpen }) {
    const isDevelopment = process.env.NODE_ENV === 'development';
    const { isLoading, galleryData } = useScraper();
    const { mode, toggleMode } = useThemeMode();
    const animatedCount = useAnimatedCounter(galleryData.length, 800);

    return (
        <AppBar
            position="sticky"
            elevation={1}
            sx={{
                bgcolor: 'background.paper',
                color: 'text.primary',
                borderBottom: 1,
                borderColor: 'divider'
            }}
        >
            <Toolbar sx={{ gap: 2 }}>
                <IconButton
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    edge="start"
                    color="inherit"
                    aria-label="open configuration sidebar"
                    sx={{ mr: 1 }}
                >
                    <SettingsIcon />
                </IconButton>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                    <Logo size={32} />
                    <Box>
                        <Typography variant="h6" component="h1" sx={{ fontWeight: 700, mb: -1 }}>
                            Gallery Epic Scraper
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Modern cosplayer gallery scraping tool
                        </Typography>
                    </Box>
                    {isDevelopment && (
                        <Chip
                            icon={<BugReportIcon />}
                            label="Development Mode"
                            size="small"
                            color="warning"
                            variant="outlined"
                            sx={{ ml: 2 }}
                        />
                    )}
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {isLoading && (
                        <Chip
                            icon={<CircularProgress size={16} />}
                            label={`Scraping... ${animatedCount} found`}
                            color="warning"
                            variant="outlined"
                            size="small"
                            sx={{
                                minWidth: '150px',
                                '& .MuiChip-label': {
                                    transition: 'all 0.3s ease-in-out'
                                }
                            }}
                        />
                    )}

                    {galleryData.length > 0 && !isLoading && (
                        <Chip
                            label={`${animatedCount} items found`}
                            color="success"
                            variant="outlined"
                            size="small"
                        />
                    )}

                    <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
                        <IconButton
                            onClick={toggleMode}
                            color="inherit"
                            aria-label="toggle theme"
                        >
                            {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
                        </IconButton>
                    </Tooltip>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default Header;
