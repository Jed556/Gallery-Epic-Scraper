import React from 'react';
import {
    Paper,
    Box,
    TextField,
    FormControl,
    Select,
    MenuItem,
    InputLabel,
    IconButton,
    InputAdornment,
    Grid,
} from '@mui/material';
import {
    Search as SearchIcon,
    FilterList as FilterIcon,
    SwapVert as SwapVertIcon,
} from '@mui/icons-material';
import { useScraper } from '../../contexts/ScraperContext';

function GalleryFilters() {
    const {
        searchQuery,
        originFilter,
        sortBy,
        sortDesc,
        galleryData,
        setSearchQuery,
        setOriginFilter,
        setSorting
    } = useScraper();

    // Get unique origins for filter dropdown
    const origins = [...new Set(galleryData.map(item => item.origin).filter(Boolean))].sort();

    const handleSearchChange = (value) => {
        setSearchQuery(value);
    };

    const handleOriginChange = (value) => {
        setOriginFilter(value);
    };

    const handleSortChange = (newSortBy) => {
        setSorting(newSortBy, sortDesc);
    };

    const toggleSortDirection = () => {
        setSorting(sortBy, !sortDesc);
    };

    return (
        <Paper
            sx={{
                p: 2,
                position: 'sticky',
                top: -7, // Add more space from top when sticking
                zIndex: 1000,
                backgroundColor: 'background.paper',
                borderRadius: 1,
                boxShadow: (theme) => theme.shadows[3],
                // Ensure it stays above other content
                backdropFilter: 'blur(8px)',
                border: '1px solid',
                borderColor: 'divider',
            }}
            elevation={1}
        >
            <Grid container spacing={2} alignItems="center">
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Search cosplay names or origins..."
                        value={searchQuery}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                        size="small"
                    />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                    <FormControl fullWidth size="small">
                        <InputLabel id="origin-filter-label">Origin</InputLabel>
                        <Select
                            labelId="origin-filter-label"
                            value={originFilter}
                            label="Origin Filter"
                            onChange={(e) => handleOriginChange(e.target.value)}
                            startAdornment={<FilterIcon sx={{ mr: 1, color: 'action.active' }} />}
                        >
                            <MenuItem value="">All</MenuItem>
                            {origins.map(origin => (
                                <MenuItem key={origin} value={origin}>
                                    {origin}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <FormControl fullWidth size="small">
                            <InputLabel id="sort-by-label">Sort By</InputLabel>
                            <Select
                                labelId="sort-by-label"
                                value={sortBy}
                                label="Sort By"
                                onChange={(e) => handleSortChange(e.target.value)}
                            >
                                <MenuItem value="default">Default</MenuItem>
                                <MenuItem value="photos">Photos</MenuItem>
                                <MenuItem value="videos">Videos</MenuItem>
                                <MenuItem value="views">Views</MenuItem>
                                <MenuItem value="downloads">Downloads</MenuItem>
                                <MenuItem value="size">File Size</MenuItem>
                                <MenuItem value="date">Date</MenuItem>
                            </Select>
                        </FormControl>

                        <IconButton
                            onClick={toggleSortDirection}
                            title={`Sort ${sortDesc ? 'Ascending' : 'Descending'}`}
                            sx={{
                                transform: sortDesc ? 'rotate(0deg)' : 'rotate(180deg)',
                                transition: 'transform 0.3s ease',
                            }}
                        >
                            <SwapVertIcon />
                        </IconButton>
                    </Box>
                </Grid>
            </Grid>
        </Paper>
    );
}

export default GalleryFilters;
