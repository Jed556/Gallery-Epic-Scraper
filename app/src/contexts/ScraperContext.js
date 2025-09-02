import React, { createContext, useContext, useReducer, useRef } from 'react';
import ScrapingService from '../services/ScrapingService';

// Use ScrapingService as the single scraping solution
const scrapingService = new ScrapingService();

const ScraperContext = createContext();

const initialState = {
    // Configuration
    config: {
        coserId: '', // Start with empty coser ID
        customFilename: '',
        maxPages: 100,
        delayPerPage: 0.8,
        concurrency: 4,
        resolveDownloads: false,
        renderThumbnails: true,
        saveCsv: true,
        saveJson: false,
        saveHtmlReport: true,
        baseUrl: 'https://cosplayjav.pl/coser',
        searchQuery: '',
        tags: '',
        startPage: 1,
        endPage: 10,
        delay: 1000,
        includeImages: true,
        includeVideos: true
    },

    // Scraping state
    isLoading: false,
    progress: 0,
    status: '',
    currentPage: 0,
    totalPages: 0,

    // Results
    coserProfile: null,
    galleryData: [],
    filteredData: [],

    // UI state
    searchQuery: '',
    originFilter: '',
    sortBy: 'default',
    sortDesc: true,

    // Export state
    isExporting: false,
    exportProgress: 0
};

function scraperReducer(state, action) {
    switch (action.type) {
        case 'UPDATE_CONFIG':
            return {
                ...state,
                config: { ...state.config, ...action.payload }
            };

        case 'START_SCRAPING':
            return {
                ...state,
                isLoading: true,
                progress: 0,
                currentPage: 0,
                totalPages: action.payload.totalPages || 0,
                status: 'Starting scraper...',
                galleryData: [],
                filteredData: []
            };

        case 'STOP_SCRAPING':
            return {
                ...state,
                isLoading: false,
                status: 'Scraping stopped by user'
            };

        case 'UPDATE_PROGRESS':
            return {
                ...state,
                progress: action.payload.progress,
                currentPage: action.payload.currentPage || state.currentPage,
                status: action.payload.status || state.status
            };

        case 'ADD_ITEMS':
            const newItems = [...state.galleryData, ...action.payload];
            return {
                ...state,
                galleryData: newItems,
                filteredData: filterAndSortItems(newItems, state.searchQuery, state.originFilter, state.sortBy, state.sortDesc)
            };

        case 'SET_ITEMS_PROGRESSIVE':
            // For progressive loading - replace all items with new array
            return {
                ...state,
                galleryData: action.payload,
                filteredData: filterAndSortItems(action.payload, state.searchQuery, state.originFilter, state.sortBy, state.sortDesc)
            };

        case 'SET_COSER_PROFILE':
            return {
                ...state,
                coserProfile: action.payload
            };

        case 'COMPLETE_SCRAPING':
            return {
                ...state,
                isLoading: false,
                progress: 100,
                status: `Completed! Scraped ${state.galleryData.length} items.`
            };

        case 'ERROR_SCRAPING':
            return {
                ...state,
                isLoading: false,
                status: `Error: ${action.payload}`
            };

        case 'CLEAR_DATA':
            return {
                ...state,
                galleryData: [],
                filteredData: [],
                coserProfile: null,
                progress: 0,
                status: ''
            };

        case 'SET_SEARCH_QUERY':
            return {
                ...state,
                searchQuery: action.payload,
                filteredData: filterAndSortItems(state.galleryData, action.payload, state.originFilter, state.sortBy, state.sortDesc)
            };

        case 'SET_ORIGIN_FILTER':
            return {
                ...state,
                originFilter: action.payload,
                filteredData: filterAndSortItems(state.galleryData, state.searchQuery, action.payload, state.sortBy, state.sortDesc)
            };

        case 'SET_SORT':
            return {
                ...state,
                sortBy: action.payload.sortBy,
                sortDesc: action.payload.sortDesc,
                filteredData: filterAndSortItems(state.galleryData, state.searchQuery, state.originFilter, action.payload.sortBy, action.payload.sortDesc)
            };

        case 'START_EXPORT':
            return {
                ...state,
                isExporting: true,
                exportProgress: 0
            };

        case 'UPDATE_EXPORT_PROGRESS':
            return {
                ...state,
                exportProgress: action.payload
            };

        case 'COMPLETE_EXPORT':
            return {
                ...state,
                isExporting: false,
                exportProgress: 100
            };

        default:
            return state;
    }
}

function filterAndSortItems(items, searchQuery, originFilter, sortBy, sortDesc) {
    let filtered = items.filter(item => {
        const matchesSearch = !searchQuery ||
            item.cosplay?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.origin?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.title?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesOrigin = !originFilter ||
            item.origin?.toLowerCase() === originFilter.toLowerCase();

        return matchesSearch && matchesOrigin;
    });

    if (sortBy !== 'default') {
        filtered.sort((a, b) => {
            let valueA, valueB;

            switch (sortBy) {
                case 'photos':
                    valueA = a.photos || 0;
                    valueB = b.photos || 0;
                    break;
                case 'videos':
                    valueA = a.videos || 0;
                    valueB = b.videos || 0;
                    break;
                case 'views':
                    valueA = a.views || 0;
                    valueB = b.views || 0;
                    break;
                case 'downloads':
                    valueA = a.downloads || 0;
                    valueB = b.downloads || 0;
                    break;
                case 'size':
                    valueA = a.sizeBytes || 0;
                    valueB = b.sizeBytes || 0;
                    break;
                case 'date':
                    valueA = new Date(a.date || 0);
                    valueB = new Date(b.date || 0);
                    break;
                default:
                    return 0;
            }

            const result = valueB - valueA; // Default descending
            return sortDesc ? result : -result;
        });
    }

    return filtered;
}

export function ScraperProvider({ children }) {
    const [state, dispatch] = useReducer(scraperReducer, initialState);
    const abortControllerRef = useRef(null);

    const updateConfig = (newConfig) => {
        dispatch({ type: 'UPDATE_CONFIG', payload: newConfig });
    };

    const startScraping = async () => {
        console.log('Starting scraping with config:', state.config);

        // Validate that coserId is provided
        if (!state.config.coserId || state.config.coserId.trim() === '') {
            console.log('Coser ID validation failed:', state.config.coserId);
            dispatch({ type: 'ERROR_SCRAPING', payload: 'Coser ID is required to start scraping' });
            return;
        }

        // Create new abort controller for this scraping session
        abortControllerRef.current = new AbortController();

        const totalPages = state.config.maxPages || 100;
        dispatch({ type: 'START_SCRAPING', payload: { totalPages } });

        try {
            console.log('🚀 Starting parallel scraping with config:', state.config);
            const callbacks = {
                onProgress: (progress, status, currentPage) => {
                    console.log('Progress update:', { progress, status, currentPage });
                    dispatch({
                        type: 'UPDATE_PROGRESS',
                        payload: { progress, status, currentPage }
                    });
                },
                onItemsFound: (items) => {
                    console.log('📦 Progressive items update:', items.length, 'total items');
                    // Use progressive update for real-time display
                    dispatch({ type: 'SET_ITEMS_PROGRESSIVE', payload: items });
                },
                onProfileFound: (profile) => {
                    console.log('📸 Profile loaded immediately:', profile);
                    dispatch({ type: 'SET_COSER_PROFILE', payload: profile });
                }
            };

            await scrapingService.startScraping(
                state.config,
                callbacks.onProgress,
                callbacks.onProfileFound,
                callbacks.onItemsFound
            );

            console.log('✅ Parallel scraping completed successfully');
            dispatch({ type: 'COMPLETE_SCRAPING' });
        } catch (error) {
            console.error('Scraping error:', error);
            if (error.name === 'AbortError') {
                dispatch({ type: 'STOP_SCRAPING' });
            } else {
                dispatch({ type: 'ERROR_SCRAPING', payload: error.message });
            }
        }
    };

    const stopScraping = () => {
        console.log('Stopping scraping...');

        // Abort the fetch requests
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        // Call the scraping service's abort method
        if (scrapingService && typeof scrapingService.abort === 'function') {
            scrapingService.abort();
        }

        dispatch({ type: 'STOP_SCRAPING' });
    };

    const clearData = () => {
        dispatch({ type: 'CLEAR_DATA' });
    };

    const setSearchQuery = (query) => {
        dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
    };

    const setOriginFilter = (origin) => {
        dispatch({ type: 'SET_ORIGIN_FILTER', payload: origin });
    };

    const setSorting = (sortBy, sortDesc) => {
        dispatch({ type: 'SET_SORT', payload: { sortBy, sortDesc } });
    };

    const exportData = async (format, options = {}) => {
        dispatch({ type: 'START_EXPORT' });

        try {
            const result = await scrapingService.exportData(
                state.filteredData,
                format,
                options,
                (progress) => {
                    dispatch({ type: 'UPDATE_EXPORT_PROGRESS', payload: progress });
                }
            );

            dispatch({ type: 'COMPLETE_EXPORT' });
            return result;
        } catch (error) {
            dispatch({ type: 'ERROR_SCRAPING', payload: `Export failed: ${error.message}` });
            throw error;
        }
    };

    const value = {
        ...state,
        updateConfig,
        startScraping,
        stopScraping,
        clearData,
        setSearchQuery,
        setOriginFilter,
        setSorting,
        exportData,
        dispatch
    };

    return (
        <ScraperContext.Provider value={value}>
            {children}
        </ScraperContext.Provider>
    );
}

export function useScraper() {
    const context = useContext(ScraperContext);
    if (!context) {
        throw new Error('useScraper must be used within a ScraperProvider');
    }
    return context;
}

export { ScraperContext };
