import React from 'react';
import { Box } from '@mui/material';
import { useScraper } from '../../contexts/ScraperContext';
import ProfileHeader from './ProfileHeader';
import GalleryFilters from './GalleryFilters';
import GalleryGrid from './GalleryGrid';
import EmptyState from './EmptyState';

function Gallery() {
    const {
        galleryData,
        filteredData,
        coserProfile,
        isLoading
    } = useScraper();

    // Show empty state when not loading and no data
    if (!isLoading && (!galleryData || galleryData.length === 0)) {
        return <EmptyState />;
    }

    // 🎉 RESPONSIVE RENDERING: Each component handles its own loading state
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {/* Profile Header - shows skeleton if profile not loaded */}
            <ProfileHeader
                profile={coserProfile}
                items={galleryData || []}
            />

            {/* Show filters during loading or when we have data */}
            {(isLoading || (galleryData && galleryData.length > 0)) && (
                <GalleryFilters />
            )}

            {/* Gallery Grid - shows skeleton cards for missing items */}
            <GalleryGrid
                items={filteredData || galleryData || []}
                isLoading={isLoading}
            />
        </Box>
    );
}

export default Gallery;
