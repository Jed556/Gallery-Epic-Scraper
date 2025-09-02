import React from 'react';
import { Grid, Box, Typography, LinearProgress, Stack, Chip, CircularProgress } from '@mui/material';
import GalleryCard from './GalleryCard';
import { useScraper } from '../../contexts/ScraperContext';
import { useAnimatedCounter } from '../../hooks/useAnimatedCounter';

function GalleryGrid({ items = [], isLoading = false }) {
    const { setOriginFilter } = useScraper();
    const animatedItemCount = useAnimatedCounter(items.length, 600);

    // If we have no items and not loading, show empty state
    if (!isLoading && items.length === 0) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '40vh',
                    textAlign: 'center',
                    color: 'text.secondary',
                }}
            >
                <Typography variant="h6" gutterBottom>
                    No items to display
                </Typography>
                <Typography variant="body2">
                    Start scraping to see gallery content
                </Typography>
            </Box>
        );
    }

    // Calculate skeleton cards needed when loading
    const skeletonCount = isLoading && items.length === 0 ? 4 : 0;

    return (
        <Box>
            {/* Gallery Grid */}
            <Grid container spacing={3}>
                {/* Real items */}
                {items.map((item, index) => (
                    <Grid key={item.id || item.url || index} size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
                        <GalleryCard
                            item={item}
                            isLoading={false}
                            onOriginClick={setOriginFilter}
                        />
                    </Grid>
                ))}

                {/* Skeleton cards for initial loading */}
                {Array.from({ length: skeletonCount }, (_, index) => (
                    <Grid key={`skeleton-${index}`} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                        <GalleryCard
                            item={null}
                            isLoading={true}
                        />
                    </Grid>
                ))}
            </Grid>

            {/* Loading progress indicator */}
            {isLoading && items.length > 0 && (
                <Box sx={{ my: 3 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                            Loading more items...
                        </Typography>
                        <Chip
                            icon={<CircularProgress size={16} />}
                            label={`${animatedItemCount} loaded`}
                            size="small"
                            color="primary"
                            variant="outlined"
                        />
                    </Stack>
                    <LinearProgress sx={{ borderRadius: 1 }} />
                </Box>
            )}
        </Box>
    );
}

export default GalleryGrid;
