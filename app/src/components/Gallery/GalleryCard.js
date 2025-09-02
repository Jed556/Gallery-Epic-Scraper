import React, { useState, useRef, useEffect } from 'react';
import { formatBytes } from '../../utils/numberFormat';
import { useCounter } from '../../hooks/useCounter';
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
    Storage,
    ImageNotSupported,
    PhotoLibrary,
    Videocam,
} from '@mui/icons-material';

// Dynamic skeleton gallery card
function GalleryCard({ item, isLoading = false, onOriginClick }) {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    const titleRef = useRef(null);
    const [titleOverflow, setTitleOverflow] = useState(false);
    const originRef = useRef(null);
    const [originOverflow, setOriginOverflow] = useState(false);

    // Animated counters (unconditional hook calls with fallbacks)
    const photoCountAnimated = useCounter(item?.photos || 0, 700, true);
    const videoCountAnimated = useCounter(item?.videos || 0, 700, true);
    const viewsAnimated = useCounter(item?.views || 0, 800, true);
    const downloadsAnimated = useCounter(item?.downloads || 0, 800, true);

    const handleImageError = () => {
        setImageError(true);
        setImageLoaded(true); // Consider it "loaded" even if it failed
    };

    const handleImageLoad = () => {
        setImageLoaded(true);
    };

    useEffect(() => {
        if (titleRef.current) {
            const el = titleRef.current;
            const isOverflow = el.scrollWidth > el.clientWidth + 1;
            setTitleOverflow(isOverflow);
        } else {
            setTitleOverflow(false);
        }
    }, [item?.title, item?.cosplay]);

    useEffect(() => {
        if (originRef.current) {
            const labelEl = originRef.current.querySelector('.MuiChip-label');
            if (labelEl) {
                const isOverflow = labelEl.scrollWidth > labelEl.clientWidth + 1;
                setOriginOverflow(isOverflow);
            } else {
                setOriginOverflow(false);
            }
        } else {
            setOriginOverflow(false);
        }
    }, [item?.origin]);

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
            <Box sx={{ position: 'relative', aspectRatio: '934/650', width: '100%', maxHeight: '50vh', minHeight: '45vh' }}>
                {/* Image area */}
                {(!item || !item.thumbnail) ? (
                    <Skeleton variant="rectangular" width="100%" height="100%" />
                ) : (
                    (item.thumbnail || item.image) && !imageError ? (
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
                                transition: 'opacity 0.3s ease-in-out'
                            }}
                        />
                    ) : (
                        <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.100', color: 'grey.500' }}>
                            <ImageNotSupported sx={{ fontSize: 40, mb: 1 }} />
                            <Typography variant="caption">No Image</Typography>
                        </Box>
                    )
                )}

                {/* Media counts overlay chip with icons */}
                <Box sx={{ position: 'absolute', bottom: 6, right: 8, zIndex: 2 }}>
                    {item ? (
                        (() => {
                            const hasPhotos = item.photos > 0;
                            const hasVideos = item.videos > 0;
                            if (!hasPhotos && !hasVideos) return null;
                            return (
                                <Chip
                                    size="small"
                                    aria-label={`Media counts ${hasPhotos ? photoCountAnimated + ' photos' : ''}${hasPhotos && hasVideos ? ' and ' : ''}${hasVideos ? videoCountAnimated + ' videos' : ''}`}
                                    label={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                                            {hasPhotos && (
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                                                    <PhotoLibrary sx={{ fontSize: 14, color: 'inherit' }} />
                                                    <Typography variant="caption" sx={{ fontSize: '0.65rem', fontWeight: 600, lineHeight: 1 }}> {photoCountAnimated}</Typography>
                                                </Box>
                                            )}
                                            {hasVideos && (
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                                                    <Videocam sx={{ fontSize: 14, color: 'inherit' }} />
                                                    <Typography variant="caption" sx={{ fontSize: '0.65rem', fontWeight: 600, lineHeight: 1 }}> {videoCountAnimated}</Typography>
                                                </Box>
                                            )}
                                        </Box>
                                    }
                                    sx={{
                                        bgcolor: 'rgba(0,0,0,0.25)',
                                        color: 'white',
                                        height: 24,
                                        '& .MuiChip-label': { px: 0.75, display: 'flex', alignItems: 'center', py: 0 },
                                        backdropFilter: 'blur(2px)',
                                        transition: 'background-color .25s ease',
                                        '&:hover': {
                                            bgcolor: 'rgba(0,0,0,0.45)'
                                        }
                                    }}
                                />
                            );
                        })()
                    ) : (
                        <Skeleton variant="rounded" width={56} height={24} />
                    )}
                </Box>
            </Box>

            <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', px: 2, pt: 1.25, pb: 2 }}>
                {/* Title */}
                {item && (item.title || item.cosplay) ? (
                    <Typography
                        ref={titleRef}
                        variant="h6"
                        component="h3"
                        noWrap
                        sx={{
                            fontWeight: 600,
                            fontSize: '0.93rem',
                            mb: 0.3,
                            cursor: (item.pageUrl || item.detailUrl || item.url) ? 'pointer' : 'default',
                            '&:hover': (item.pageUrl || item.detailUrl || item.url) ? { color: 'primary.main', textDecoration: 'underline' } : {}
                        }}
                        onClick={() => {
                            if (item.pageUrl || item.detailUrl || item.url) {
                                window.open(item.pageUrl || item.detailUrl || item.url, '_blank', 'noopener,noreferrer');
                            }
                        }}
                    >
                        {titleOverflow ? (
                            <Tooltip title={item.title || item.cosplay || 'Untitled'}>
                                <span>{item.title || item.cosplay || 'Untitled'}</span>
                            </Tooltip>
                        ) : (
                            item.title || item.cosplay || 'Untitled'
                        )}
                    </Typography>
                ) : (
                    <Skeleton variant="text" width="68%" height={22} sx={{ mb: 0.5 }} />
                )}

                {/* Origin (smaller chip) */}
                {item && item.origin ? (
                    originOverflow ? (
                        <Tooltip title={item.origin}>
                            <Chip
                                ref={originRef}
                                label={item.origin}
                                size="small"
                                color="primary"
                                variant="outlined"
                                clickable
                                onClick={() => onOriginClick && onOriginClick(item.origin)}
                                sx={{
                                    alignSelf: 'flex-start',
                                    mb: 0.9,
                                    height: 20,
                                    borderRadius: '10px',
                                    cursor: 'pointer',
                                    maxWidth: 150,
                                    '& .MuiChip-label': {
                                        px: 0.6,
                                        py: 0,
                                        fontSize: '0.63rem',
                                        lineHeight: 1.1,
                                        fontWeight: 600,
                                        maxWidth: 130,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    },
                                    '&:hover': { backgroundColor: 'action.hover', borderColor: 'primary.main' },
                                    transition: 'all 0.2s ease-in-out'
                                }}
                            />
                        </Tooltip>
                    ) : (
                        <Chip
                            ref={originRef}
                            label={item.origin}
                            size="small"
                            color="primary"
                            variant="outlined"
                            clickable
                            onClick={() => onOriginClick && onOriginClick(item.origin)}
                            sx={{
                                alignSelf: 'flex-start',
                                mb: 0.9,
                                height: 20,
                                borderRadius: '10px',
                                cursor: 'pointer',
                                maxWidth: 150,
                                '& .MuiChip-label': {
                                    px: 0.6,
                                    py: 0,
                                    fontSize: '0.63rem',
                                    lineHeight: 1.1,
                                    fontWeight: 600,
                                    maxWidth: 130,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                },
                                '&:hover': { backgroundColor: 'action.hover', borderColor: 'primary.main' },
                                transition: 'all 0.2s ease-in-out'
                            }}
                        />
                    )
                ) : (
                    <Skeleton variant="rounded" width={50} height={16} sx={{ mb: 0.8 }} />
                )}

                {/* Stats lines: first (date, size), second (views, downloads) */}
                <Box sx={{ flex: 1, mb: 2 }}>
                    {item ? (
                        (() => {
                            // Build segments separately
                            const primary = [];
                            const secondary = [];

                            if (item.dateCreated) {
                                primary.push(
                                    <Box key="date" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>{item.dateCreated}</Typography>
                                    </Box>
                                );
                            }

                            if (item.fileSize) {
                                let displaySize = item.fileSize;
                                const sizeMatch = /([\d.,]+)\s*(KB|MB|GB|TB)/i.exec(item.fileSize);
                                if (sizeMatch) {
                                    const val = parseFloat(sizeMatch[1].replace(/,/g, ''));
                                    const unit = sizeMatch[2].toUpperCase();
                                    const multiplier = { KB: 1024, MB: 1024 ** 2, GB: 1024 ** 3, TB: 1024 ** 4 }[unit] || 1;
                                    const bytes = val * multiplier;
                                    displaySize = formatBytes(bytes);
                                }
                                primary.push(
                                    <Box key="size" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <Storage sx={{ fontSize: '0.9rem', opacity: 0.85 }} />
                                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>{displaySize}</Typography>
                                    </Box>
                                );
                            }

                            if (item.views > 0) {
                                secondary.push(
                                    <Box key="views" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <Visibility sx={{ fontSize: '0.9rem', opacity: 0.85 }} />
                                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>{viewsAnimated}</Typography>
                                    </Box>
                                );
                            }

                            if (item.downloads > 0) {
                                secondary.push(
                                    <Box key="downloads" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <Download sx={{ fontSize: '0.9rem', opacity: 0.85 }} />
                                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>{downloadsAnimated}</Typography>
                                    </Box>
                                );
                            }

                            if (!primary.length && !secondary.length) {
                                return <Skeleton variant="text" width="75%" height={14} />;
                            }

                            const renderRow = (arr) => (
                                <Stack direction="row" spacing={0.75} alignItems="center" flexWrap="wrap" sx={{ mb: 0.25 }}>
                                    {arr.map((seg, i) => (
                                        <React.Fragment key={i}>
                                            {i > 0 && (
                                                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem', opacity: 0.6 }}>•</Typography>
                                            )}
                                            {seg}
                                        </React.Fragment>
                                    ))}
                                </Stack>
                            );

                            return (
                                <Stack spacing={0.25} sx={{ lineHeight: 1 }}>
                                    {primary.length > 0 && renderRow(primary)}
                                    {secondary.length > 0 && renderRow(secondary)}
                                </Stack>
                            );
                        })()
                    ) : (
                        <Stack spacing={0.6}>
                            <Skeleton variant="text" width="65%" height={14} />
                            <Skeleton variant="text" width="55%" height={12} />
                        </Stack>
                    )}
                </Box>

                {/* Actions */}
                {item ? (
                    <Stack direction="row" spacing={1} sx={{ mt: 'auto' }}>
                        <Button
                            variant="outlined"
                            startIcon={<Download />}
                            size="small"
                            href={item.downloadUrl || item.pageUrl || item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{ flex: 1, justifyContent: 'flex-start', p: 1.5, textAlign: 'left', fontSize: '0.75rem' }}
                        >
                            Download
                        </Button>
                    </Stack>
                ) : (
                    <Stack direction="row" spacing={1}>
                        <Skeleton variant="rounded" width="70%" height={32} />
                        <Skeleton variant="rounded" width={32} height={32} />
                    </Stack>
                )}
            </CardContent>
        </Card>
    );
}

export default GalleryCard;
