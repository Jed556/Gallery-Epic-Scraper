import React, { useState } from 'react';
import {
    Card,
    CardMedia,
    CardContent,
    Typography,
    Box,
    Stack,
    Chip,
    Button,
    Skeleton,
    Tooltip,
} from '@mui/material';
import {
    Download,
    Visibility,
    PhotoLibrary,
    Storage,
    Videocam,
    CalendarToday,
    ImageNotSupported,
} from '@mui/icons-material';

// Skeleton component for gallery card
function GalleryCardSkeleton() {
    return (
        <Card
            sx={{
                borderRadius: '12px',
                overflow: 'hidden',
                height: '100%',
                boxShadow: 2,
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                    boxShadow: 6,
                    transform: 'scale(1.01)',
                },
            }}
        >
            {/* Image skeleton with responsive viewport-based height */}
            <Skeleton
                variant="rectangular"
                sx={{
                    aspectRatio: '934/650',
                    width: '100%',
                    maxHeight: '50vh',
                    minHeight: '45vh',
                    borderRadius: '12px 12px 0 0'
                }}
            />

            <CardContent sx={{ p: 2 }}>
                {/* Title skeleton */}
                <Skeleton variant="text" width="80%" height={24} sx={{ mb: 1 }} />

                {/* Origin skeleton */}
                <Skeleton variant="rounded" width={60} height={20} sx={{ mb: 1.5 }} />

                {/* Stats skeleton */}
                <Stack spacing={1} sx={{ mb: 2 }}>
                    <Skeleton variant="text" width="90%" height={16} />
                    <Skeleton variant="text" width="70%" height={16} />
                    <Skeleton variant="text" width="85%" height={16} />
                </Stack>

                {/* Action buttons skeleton */}
                <Stack direction="row" spacing={1}>
                    <Skeleton variant="rounded" width="70%" height={32} />
                    <Skeleton variant="rounded" width={32} height={32} />
                </Stack>
            </CardContent>
        </Card>
    );
}

// Gallery Card that manages its own loading state
function GalleryCard({ item, isLoading = false, onOriginClick }) {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    // 🎯 If still loading or no item data, show skeleton
    if (isLoading || !item || (!item.title && !item.cosplay)) {
        return <GalleryCardSkeleton />;
    }

    const handleImageError = () => {
        setImageError(true);
        setImageLoaded(true); // Consider it "loaded" even if it failed
    };

    const handleImageLoad = () => {
        setImageLoaded(true);
    };

    // 🎉 Render real gallery card
    return (
        <Card
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                borderRadius: '12px',
                overflow: 'hidden',
                '&:hover': {
                    transform: 'scale(1.01)',
                    boxShadow: 6,
                }
            }}
        >
            {/* Image with loading state - responsive viewport-based height */}
            <Box sx={{
                position: 'relative',
                aspectRatio: '934/650',
                width: '100%',
                maxHeight: '50vh',
                minHeight: '45vh'
            }}>
                {/* Show skeleton while image is loading */}
                {!imageLoaded && (
                    <Skeleton
                        variant="rectangular"
                        width="100%"
                        height="100%"
                        sx={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }}
                    />
                )}

                {/* Actual image or fallback */}
                {(item.thumbnail || item.image) && !imageError ? (
                    <CardMedia
                        component="img"
                        image={item.thumbnail || item.image}
                        alt={item.title || item.cosplay}
                        onError={handleImageError}
                        onLoad={handleImageLoad}
                        sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            opacity: imageLoaded ? 1 : 0,
                            transition: 'opacity 0.3s ease-in-out',
                        }}
                    />
                ) : (
                    <Box
                        sx={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: 'grey.100',
                            color: 'grey.500',
                        }}
                    >
                        <ImageNotSupported sx={{ fontSize: 40, mb: 1 }} />
                        <Typography variant="caption">No Image</Typography>
                    </Box>
                )}

                {/* Media count overlay */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        display: 'flex',
                        gap: 0.5,
                    }}
                >
                    {item.photos > 0 && (
                        <Chip
                            icon={<PhotoLibrary />}
                            label={item.photos}
                            size="small"
                            sx={{
                                bgcolor: 'rgba(0,0,0,0.7)',
                                color: 'white',
                                '& .MuiChip-icon': { color: 'white' }
                            }}
                        />
                    )}
                    {item.videos > 0 && (
                        <Chip
                            icon={<Videocam />}
                            label={item.videos}
                            size="small"
                            sx={{
                                bgcolor: 'rgba(0,0,0,0.7)',
                                color: 'white',
                                '& .MuiChip-icon': { color: 'white' }
                            }}
                        />
                    )}
                </Box>
            </Box>

            <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
                {/* Title and Origin */}

                <Typography
                    variant="h6"
                    component="h3"
                    gutterBottom
                    noWrap
                    sx={{
                        fontWeight: 600,
                        fontSize: '1rem',
                        cursor: (item.pageUrl || item.detailUrl || item.url) ? 'pointer' : 'default',
                        '&:hover': (item.pageUrl || item.detailUrl || item.url) ? {
                            color: 'primary.main',
                            textDecoration: 'underline'
                        } : {}
                    }}
                    onClick={() => {
                        if (item.pageUrl || item.detailUrl || item.url) {
                            window.open(item.pageUrl || item.detailUrl || item.url, '_blank', 'noopener,noreferrer');
                        }
                    }}
                >
                    <Tooltip title='View Details'>
                        {item.title || item.cosplay || 'Untitled'}
                    </Tooltip>
                </Typography>

                {item.origin && (
                    <Chip
                        label={item.origin}
                        size="small"
                        color="primary"
                        variant="outlined"
                        clickable
                        onClick={() => onOriginClick && onOriginClick(item.origin)}
                        sx={{
                            alignSelf: 'flex-start',
                            mb: 1.5,
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                            '&:hover': {
                                backgroundColor: 'action.hover',
                                borderColor: 'primary.main',
                            },
                            transition: 'all 0.2s ease-in-out'
                        }}
                    />
                )}

                {/* Comprehensive Stats Section */}
                <Box sx={{ flex: 1, mb: 2 }}>
                    {/* Primary Stats Line */}
                    <Box sx={{ mb: 1.5 }}>
                        <Stack direction="row" spacing={0.5} alignItems="center" flexWrap="wrap">
                            {item.dateCreated && (
                                <>
                                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                                        {item.dateCreated}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" sx={{ mx: 0.5 }}>•</Typography>
                                </>
                            )}

                            {(item.views > 0 || item.downloads > 0 || item.fileSize) && (
                                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                                    {item.views > 0 && `${item.views.toLocaleString()} views`}
                                    {item.views > 0 && item.downloads > 0 && ' • '}
                                    {item.downloads > 0 && `${item.downloads.toLocaleString()} dl`}
                                    {(item.views > 0 || item.downloads > 0) && item.fileSize && ' • '}
                                    {item.fileSize && `${item.fileSize}`}
                                </Typography>
                            )}
                        </Stack>
                    </Box>

                    {/* Secondary Stats - Individual detailed items */}
                    <Stack spacing={0.5}>
                        {/* Photos and Videos count in a compact format */}
                        {(item.photos > 0 || item.videos > 0) && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <PhotoLibrary fontSize="small" color="action" sx={{ fontSize: '1rem' }} />
                                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                                        {item.photos || 0}P
                                    </Typography>
                                </Box>
                                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                                    /
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <Videocam fontSize="small" color="action" sx={{ fontSize: '1rem' }} />
                                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                                        {item.videos || 0}V
                                    </Typography>
                                </Box>
                            </Box>
                        )}

                        {/* Individual stat lines for better readability */}
                        {item.views > 0 && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Visibility fontSize="small" color="action" sx={{ fontSize: '1rem' }} />
                                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                                    {item.views.toLocaleString()} views
                                </Typography>
                            </Box>
                        )}

                        {item.downloads > 0 && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Download fontSize="small" color="action" sx={{ fontSize: '1rem' }} />
                                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                                    {item.downloads.toLocaleString()} downloads
                                </Typography>
                            </Box>
                        )}

                        {item.fileSize && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Storage fontSize="small" color="action" sx={{ fontSize: '1rem' }} />
                                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                                    {item.fileSize}
                                </Typography>
                            </Box>
                        )}

                        {item.dateCreated && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <CalendarToday fontSize="small" color="action" sx={{ fontSize: '1rem' }} />
                                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                                    {item.dateCreated}
                                </Typography>
                            </Box>
                        )}
                    </Stack>
                </Box>

                {/* Actions */}
                <Stack direction="row" spacing={1} sx={{ mt: 'auto' }}>
                    <Button
                        variant="outlined"
                        startIcon={<Download />}
                        size="small"
                        href={item.downloadUrl || item.pageUrl || item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                            flex: 1,
                            justifyContent: 'flex-start',
                            p: 1.5,
                            textAlign: 'left',
                            fontSize: '0.75rem',
                        }}
                    >
                        Download
                    </Button>
                </Stack>
            </CardContent>
        </Card>
    );
}

export default GalleryCard;
