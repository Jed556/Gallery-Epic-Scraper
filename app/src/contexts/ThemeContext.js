import React, { createContext, useContext, useState, useEffect } from 'react';
import { createTheme } from '@mui/material/styles';

const ThemeContext = createContext();

export const useThemeMode = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useThemeMode must be used within a ThemeProvider');
    }
    return context;
};

const getDesignTokens = (mode) => ({
    palette: {
        mode,
        ...(mode === 'light'
            ? {
                // Light mode colors
                primary: {
                    main: '#6750a4',
                    light: '#8571c6',
                    dark: '#533c8c',
                },
                secondary: {
                    main: '#625b71',
                    light: '#8482a0',
                    dark: '#48435e',
                },
                background: {
                    default: '#fef7ff',
                    paper: '#ffffff',
                },
                surface: {
                    main: '#ffffff',
                    variant: '#e7e0ec',
                },
                outline: {
                    main: '#79747e',
                    variant: '#cac4d0',
                },
                onSurface: {
                    main: '#1d1b20',
                    variant: '#49454f',
                },
            }
            : {
                // Dark mode colors
                primary: {
                    main: '#d0bcff',
                    light: '#e6d3ff',
                    dark: '#b8a4e6',
                },
                secondary: {
                    main: '#ccc2dc',
                    light: '#e8d5f0',
                    dark: '#b0a7c0',
                },
                background: {
                    default: '#121212',
                    paper: '#1e1e1e',
                },
                surface: {
                    main: '#1e1e1e',
                    variant: '#2d2d2d',
                },
                outline: {
                    main: '#938f99',
                    variant: '#49454f',
                },
                onSurface: {
                    main: '#e6e0e9',
                    variant: '#cac4d0',
                },
                text: {
                    primary: '#e6e0e9',
                    secondary: '#cac4d0',
                },
                divider: '#49454f',
            }),
    },
    typography: {
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
        ].join(','),
    },
    shape: {
        borderRadius: 12,
    },
    shadows: mode === 'light'
        ? [
            'none',
            '0px 1px 3px 0px rgba(0,0,0,0.08), 0px 1px 2px -1px rgba(0,0,0,0.04)',
            '0px 2px 4px 0px rgba(0,0,0,0.08), 0px 2px 3px -1px rgba(0,0,0,0.04)',
            '0px 3px 6px 0px rgba(0,0,0,0.08), 0px 3px 5px -2px rgba(0,0,0,0.04)',
            '0px 4px 8px 0px rgba(0,0,0,0.08), 0px 4px 6px -2px rgba(0,0,0,0.04)',
            '0px 5px 10px 0px rgba(0,0,0,0.08), 0px 5px 8px -3px rgba(0,0,0,0.04)',
            '0px 6px 12px 0px rgba(0,0,0,0.08), 0px 6px 9px -3px rgba(0,0,0,0.04)',
            '0px 7px 14px 0px rgba(0,0,0,0.08), 0px 7px 11px -4px rgba(0,0,0,0.04)',
            '0px 8px 16px 0px rgba(0,0,0,0.08), 0px 8px 12px -4px rgba(0,0,0,0.04)',
            '0px 9px 18px 0px rgba(0,0,0,0.08), 0px 9px 14px -5px rgba(0,0,0,0.04)',
            '0px 10px 20px 0px rgba(0,0,0,0.08), 0px 10px 15px -5px rgba(0,0,0,0.04)',
            '0px 11px 22px 0px rgba(0,0,0,0.08), 0px 11px 17px -6px rgba(0,0,0,0.04)',
            '0px 12px 24px 0px rgba(0,0,0,0.08), 0px 12px 18px -6px rgba(0,0,0,0.04)',
            '0px 13px 26px 0px rgba(0,0,0,0.08), 0px 13px 20px -7px rgba(0,0,0,0.04)',
            '0px 14px 28px 0px rgba(0,0,0,0.08), 0px 14px 21px -7px rgba(0,0,0,0.04)',
            '0px 15px 30px 0px rgba(0,0,0,0.08), 0px 15px 23px -8px rgba(0,0,0,0.04)',
            '0px 16px 32px 0px rgba(0,0,0,0.08), 0px 16px 24px -8px rgba(0,0,0,0.04)',
            '0px 17px 34px 0px rgba(0,0,0,0.08), 0px 17px 26px -9px rgba(0,0,0,0.04)',
            '0px 18px 36px 0px rgba(0,0,0,0.08), 0px 18px 27px -9px rgba(0,0,0,0.04)',
            '0px 19px 38px 0px rgba(0,0,0,0.08), 0px 19px 29px -10px rgba(0,0,0,0.04)',
            '0px 20px 40px 0px rgba(0,0,0,0.08), 0px 20px 30px -10px rgba(0,0,0,0.04)',
            '0px 21px 42px 0px rgba(0,0,0,0.08), 0px 21px 32px -11px rgba(0,0,0,0.04)',
            '0px 22px 44px 0px rgba(0,0,0,0.08), 0px 22px 33px -11px rgba(0,0,0,0.04)',
            '0px 23px 46px 0px rgba(0,0,0,0.08), 0px 23px 35px -12px rgba(0,0,0,0.04)',
            '0px 24px 48px 0px rgba(0,0,0,0.08), 0px 24px 36px -12px rgba(0,0,0,0.04)',
        ]
        : [
            'none',
            '0px 1px 3px 0px rgba(0,0,0,0.20), 0px 1px 2px -1px rgba(0,0,0,0.12)',
            '0px 2px 4px 0px rgba(0,0,0,0.20), 0px 2px 3px -1px rgba(0,0,0,0.12)',
            '0px 3px 6px 0px rgba(0,0,0,0.20), 0px 3px 5px -2px rgba(0,0,0,0.12)',
            '0px 4px 8px 0px rgba(0,0,0,0.20), 0px 4px 6px -2px rgba(0,0,0,0.12)',
            '0px 5px 10px 0px rgba(0,0,0,0.20), 0px 5px 8px -3px rgba(0,0,0,0.12)',
            '0px 6px 12px 0px rgba(0,0,0,0.20), 0px 6px 9px -3px rgba(0,0,0,0.12)',
            '0px 7px 14px 0px rgba(0,0,0,0.20), 0px 7px 11px -4px rgba(0,0,0,0.12)',
            '0px 8px 16px 0px rgba(0,0,0,0.20), 0px 8px 12px -4px rgba(0,0,0,0.12)',
            '0px 9px 18px 0px rgba(0,0,0,0.20), 0px 9px 14px -5px rgba(0,0,0,0.12)',
            '0px 10px 20px 0px rgba(0,0,0,0.20), 0px 10px 15px -5px rgba(0,0,0,0.12)',
            '0px 11px 22px 0px rgba(0,0,0,0.20), 0px 11px 17px -6px rgba(0,0,0,0.12)',
            '0px 12px 24px 0px rgba(0,0,0,0.20), 0px 12px 18px -6px rgba(0,0,0,0.12)',
            '0px 13px 26px 0px rgba(0,0,0,0.20), 0px 13px 20px -7px rgba(0,0,0,0.12)',
            '0px 14px 28px 0px rgba(0,0,0,0.20), 0px 14px 21px -7px rgba(0,0,0,0.12)',
            '0px 15px 30px 0px rgba(0,0,0,0.20), 0px 15px 23px -8px rgba(0,0,0,0.12)',
            '0px 16px 32px 0px rgba(0,0,0,0.20), 0px 16px 24px -8px rgba(0,0,0,0.12)',
            '0px 17px 34px 0px rgba(0,0,0,0.20), 0px 17px 26px -9px rgba(0,0,0,0.12)',
            '0px 18px 36px 0px rgba(0,0,0,0.20), 0px 18px 27px -9px rgba(0,0,0,0.12)',
            '0px 19px 38px 0px rgba(0,0,0,0.20), 0px 19px 29px -10px rgba(0,0,0,0.12)',
            '0px 20px 40px 0px rgba(0,0,0,0.20), 0px 20px 30px -10px rgba(0,0,0,0.12)',
            '0px 21px 42px 0px rgba(0,0,0,0.20), 0px 21px 32px -11px rgba(0,0,0,0.12)',
            '0px 22px 44px 0px rgba(0,0,0,0.20), 0px 22px 33px -11px rgba(0,0,0,0.12)',
            '0px 23px 46px 0px rgba(0,0,0,0.20), 0px 23px 35px -12px rgba(0,0,0,0.12)',
            '0px 24px 48px 0px rgba(0,0,0,0.20), 0px 24px 36px -12px rgba(0,0,0,0.12)',
        ],
    components: {
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    borderRadius: 0,
                },
            },
        },
        MuiCssBaseline: {
            styleOverrides: {
                html: {
                    colorScheme: mode,
                    // Hide scrollbars while maintaining functionality
                    '& *::-webkit-scrollbar': {
                        width: 0,
                        height: 0,
                    },
                    '& *::-webkit-scrollbar-track': {
                        display: 'none',
                    },
                    '& *::-webkit-scrollbar-thumb': {
                        display: 'none',
                    },
                    // For Firefox
                    scrollbarWidth: 'none',
                },
                body: {
                    // Hide scrollbars for all elements
                    '& *': {
                        scrollbarWidth: 'none', // Firefox
                        msOverflowStyle: 'none', // IE and Edge
                        '&::-webkit-scrollbar': {
                            display: 'none', // Chrome, Safari, Opera
                        },
                    },
                },
            },
        },
    },
});

export const CustomThemeProvider = ({ children }) => {
    const [mode, setMode] = useState(() => {
        // Check localStorage first, then system preference
        const savedMode = localStorage.getItem('theme-mode');
        if (savedMode) {
            return savedMode;
        }
        // Check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    });

    useEffect(() => {
        // Save to localStorage whenever mode changes
        localStorage.setItem('theme-mode', mode);
    }, [mode]);

    const toggleMode = () => {
        setMode(prevMode => prevMode === 'light' ? 'dark' : 'light');
    };

    const theme = React.useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

    const value = {
        mode,
        toggleMode,
        theme,
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeContext;
