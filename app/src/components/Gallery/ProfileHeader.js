import React from 'react';
import {
    Paper,
    Typography,
    Avatar,
    Box,
    Stack,
    Button,
    CardMedia,
    Skeleton,
} from '@mui/material';
import {
    Person,
    Twitter,
    Instagram,
    Facebook,
    YouTube,
    LinkedIn,
    GitHub,
    Language,
    Reddit,
    Pinterest,
    Telegram,
    WhatsApp,
    Public,
    Link,
    AccountCircle,
} from '@mui/icons-material';
import { useCounter } from '../../hooks/useCounter';
import { formatBytes } from '../../utils/numberFormat';

// Dynamic skeleton approach: always render layout; skeletons appear where data missing.
function ProfileHeader({ profile, items = [] }) {
    const isProfileLoading = !profile || !profile.name; // granular loading flag
    const animatedItemCount = useCounter(items.length, 800); // existing animated total cosplays

    // Function to get appropriate social media icon
    const getSocialIcon = (url, text) => {
        const lowerUrl = url.toLowerCase();
        const lowerText = text.toLowerCase();

        // Social Media Platforms
        if (lowerUrl.includes('twitter.com') || lowerUrl.includes('x.com') || lowerText.includes('twitter')) {
            return <Twitter />;
        }
        if (lowerUrl.includes('instagram.com') || lowerText.includes('instagram')) {
            return <Instagram />;
        }
        if (lowerUrl.includes('facebook.com') || lowerText.includes('facebook')) {
            return <Facebook />;
        }
        if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be') || lowerText.includes('youtube')) {
            return <YouTube />;
        }
        if (lowerUrl.includes('linkedin.com') || lowerText.includes('linkedin')) {
            return <LinkedIn />;
        }
        if (lowerUrl.includes('github.com') || lowerText.includes('github')) {
            return <GitHub />;
        }
        if (lowerUrl.includes('reddit.com') || lowerText.includes('reddit')) {
            return <Reddit />;
        }
        if (lowerUrl.includes('pinterest.com') || lowerText.includes('pinterest')) {
            return <Pinterest />;
        }
        if (lowerUrl.includes('t.me') || lowerUrl.includes('telegram') || lowerText.includes('telegram')) {
            return <Telegram />;
        }
        if (lowerUrl.includes('whatsapp.com') || lowerUrl.includes('wa.me') || lowerText.includes('whatsapp')) {
            return <WhatsApp />;
        }

        // Asian Social Media Platforms (using generic icons since MUI doesn't have specific ones)
        if (lowerUrl.includes('weibo.com') || lowerText.includes('weibo')) {
            return <Public />; // Use Public icon for Weibo
        }
        if (lowerUrl.includes('bilibili.com') || lowerText.includes('bilibili')) {
            return <AccountCircle />; // Use AccountCircle for Bilibili
        }
        if (lowerUrl.includes('pixiv.net') || lowerText.includes('pixiv')) {
            return <AccountCircle />; // Use AccountCircle for Pixiv
        }
        if (lowerUrl.includes('fanbox.cc') || lowerText.includes('fanbox')) {
            return <AccountCircle />; // Use AccountCircle for Fanbox
        }

        // Generic website/link
        if (lowerUrl.includes('http') || lowerUrl.includes('www.')) {
            return <Language />;
        }

        // Default fallback
        return <Link />;
    };

    // 📊 Calculate stats only if items exist
    const totalPhotos = items.length ? items.reduce((sum, item) => sum + (item.photos || 0), 0) : 0;
    const totalVideos = items.length ? items.reduce((sum, item) => sum + (item.videos || 0), 0) : 0;
    const totalSize = items.length ? items.reduce((sum, item) => {
        if (!item || (!item.fileSize && !item.size)) return sum;
        const sizeStr = item.fileSize || item.size || '';
        const match = sizeStr.match(/([\d.,]+)\s*(KB|MB|GB)\b/i);
        if (!match) return sum;
        const num = parseFloat(match[1].replace(/,/g, ''));
        const unit = match[2].toUpperCase();
        const map = { KB: 1024, MB: 1024 ** 2, GB: 1024 ** 3 };
        return sum + (num * (map[unit] || 0));
    }, 0) : 0;

    // Animated counters for each stat (only run when totals > 0)
    // Always call hooks unconditionally to satisfy Rules of Hooks
    const animatedPhotosCompact = useCounter(totalPhotos, 800, true);
    const animatedVideosCompact = useCounter(totalVideos, 800, true);
    const animatedBytes = useCounter(totalSize, 800); // raw bytes
    const formattedPhotos = totalPhotos ? animatedPhotosCompact : null;
    const formattedVideos = totalVideos ? animatedVideosCompact : null;
    const formattedSize = totalSize ? formatBytes(animatedBytes) : null;

    const totalViews = items.length ? items.reduce((sum, item) => sum + (item.views || 0), 0) : 0;
    const totalDownloads = items.length ? items.reduce((sum, item) => sum + (item.downloads || 0), 0) : 0;
    const animatedViewsCompact = useCounter(totalViews, 900, true);
    const animatedDownloadsCompact = useCounter(totalDownloads, 900, true);
    const formattedViews = totalViews ? animatedViewsCompact : null;
    const formattedDownloads = totalDownloads ? animatedDownloadsCompact : null;

    const coserName = profile?.name;

    // 🎉 Render real profile header
    return (
        <Paper
            elevation={3}
            sx={{
                borderRadius: '12px',
                overflow: 'hidden',
                bgcolor: 'background.paper',
                boxShadow: 3,
                transition: 'all 0.3s ease-in-out', // Smooth transition from skeleton
            }}
        >
            {/* Banner + Overlapping Avatar Wrapper */}
            <Box sx={{ position: 'relative' }}>
                {/* Banner (image or skeleton) */}
                {profile?.banner ? (
                    <CardMedia
                        component="img"
                        image={profile.banner}
                        alt="Profile Banner"
                        sx={{
                            aspectRatio: '1500/500',
                            width: '100%',
                            maxHeight: '40vh',
                            minHeight: '40vh',
                            objectFit: 'cover',
                            borderRadius: '12px 12px 0 0',
                            opacity: isProfileLoading ? 0 : 1,
                            transition: 'opacity .3s ease'
                        }}
                    />
                ) : (
                    <Skeleton
                        variant="rectangular"
                        sx={{
                            aspectRatio: '1500/500',
                            width: '100%',
                            maxHeight: '40vh',
                            minHeight: '40vh',
                            borderRadius: '12px 12px 0 0'
                        }}
                    />
                )}

                {/* Overlapping Avatar (absolute) */}
                {profile?.avatar ? (
                    <Avatar
                        src={profile.avatar}
                        sx={{
                            position: 'absolute',
                            left: { xs: '50%', sm: 32 },
                            bottom: { xs: -70, sm: -94, md: -108 },
                            transform: { xs: 'translateX(-50%)', sm: 'none' },
                            width: { xs: 140, sm: 195, md: 215 },
                            height: { xs: 140, sm: 195, md: 215 },
                            bgcolor: 'primary.main',
                            boxShadow: 8,
                            border: '5px solid',
                            borderColor: 'background.paper',
                            zIndex: 2,
                            transition: 'width .25s ease, height .25s ease, bottom .25s ease',
                        }}
                    >
                        {!profile.avatar && <Person sx={{ fontSize: 44 }} />}
                    </Avatar>
                ) : (
                    <Skeleton
                        variant="circular"
                        sx={{
                            position: 'absolute',
                            left: { xs: '50%', sm: 32 },
                            bottom: { xs: -70, sm: -94, md: -108 },
                            transform: { xs: 'translateX(-50%)', sm: 'none' },
                            width: { xs: 140, sm: 195, md: 215 },
                            height: { xs: 140, sm: 195, md: 215 },
                            zIndex: 2,
                            border: '5px solid',
                            borderColor: 'background.paper',
                        }}
                    />
                )}
            </Box>

            {/* Content Section under overlapping avatar */}
            <Box
                sx={{
                    px: 3,
                    // Equal vertical padding top/bottom
                    pt: { xs: 3, sm: 3, md: 3 },
                    pb: { xs: 3, sm: 3, md: 3 },
                    position: 'relative',
                }}
            >
                <Box
                    sx={{
                        pl: { xs: 0, sm: '230px', md: '255px' },
                        textAlign: { xs: 'center', sm: 'left' },
                        transition: 'padding-left .25s ease',
                        // pr: { xs: 0, sm: 14 }, // reserve space so text doesn't run under social buttons

                    }}
                >
                    {/* Name */}
                    {coserName ? (
                        <Typography
                            variant="h5"
                            component="h1"
                            fontWeight={700}
                            gutterBottom
                            sx={{ lineHeight: 1.2 }}
                        >
                            {coserName}
                        </Typography>
                    ) : (
                        <Skeleton variant="text" width="25%" height={36} sx={{ mb: 1 }} />
                    )}

                    {/* Primary stats line */}
                    {(formattedPhotos && formattedVideos && formattedSize) ? (
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ lineHeight: 1.4, mt: 0.75, mb: (totalViews > 0 || totalDownloads > 0) ? 0.25 : 0 }}
                        >
                            {animatedItemCount} cosplays • {formattedPhotos} photos • {formattedVideos} videos • {formattedSize}
                        </Typography>
                    ) : (
                        <Skeleton variant="text" width="35%" height={20} sx={{ mt: 1, mb: 0.5 }} />
                    )}

                    {/* Views / Downloads */}
                    {(totalViews > 0 || totalDownloads > 0) ? (
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ lineHeight: 1.4, mt: 0.25, mb: 0 }}
                        >
                            {totalViews > 0 && `${formattedViews} views`}
                            {totalViews > 0 && totalDownloads > 0 && ' • '}
                            {totalDownloads > 0 && `${formattedDownloads} downloads`}
                        </Typography>
                    ) : (
                        <Skeleton variant="text" width="28%" height={18} sx={{ mt: 0.5 }} />
                    )}

                </Box>
                {/* Social Links: below details on xs & sm; bottom-right overlay from md up */}
                {(profile?.links && profile.links.length > 0) ? (
                    <Stack
                        direction="row"
                        spacing={1}
                        flexWrap="wrap"
                        sx={{
                            gap: 1,
                            mt: { xs: 1.5, md: 0 },
                            justifyContent: { xs: 'flex-start', sm: 'flex-start', md: 'flex-end' },
                            position: { xs: 'static', md: 'absolute' },
                            right: { md: 24 },
                            bottom: { md: 16 },
                        }}
                    >
                        {profile.links.map((link, index) => (
                            <Button
                                key={index}
                                variant="outlined"
                                size="small"
                                startIcon={getSocialIcon(link.url, link.text)}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{ textTransform: 'none', maxWidth: '100%' }}
                            >
                                {link.text}
                            </Button>
                        ))}
                    </Stack>
                ) : (
                    <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
                        <Skeleton variant="rounded" width={80} height={28} />
                        <Skeleton variant="rounded" width={100} height={28} />
                    </Stack>
                )}
            </Box>
        </Paper>
    );
}

export default ProfileHeader;
