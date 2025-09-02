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
import { useAnimatedCounter } from '../../hooks/useAnimatedCounter';

// Skeleton component for profile header
function ProfileHeaderSkeleton() {
    return (
        <Paper
            elevation={3}
            sx={{
                borderRadius: '12px',
                overflow: 'hidden',
                bgcolor: 'background.paper',
                boxShadow: 3,
            }}
        >
            {/* Banner skeleton with responsive viewport-based height */}
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

            <Box sx={{ p: 3 }}>
                <Stack direction="row" spacing={2} alignItems="flex-start">
                    <Skeleton variant="circular" width={88} height={88} />

                    <Box sx={{ flex: 1 }}>
                        <Skeleton variant="text" width="25%" height={32} sx={{ mb: 1 }} />
                        <Skeleton variant="text" width="20%" height={20} sx={{ mb: 2 }} />

                        {/* Social links skeleton */}
                        <Stack direction="row" spacing={1} sx={{}}>
                            <Skeleton variant="rounded" width={80} height={24} />
                            <Skeleton variant="rounded" width={90} height={24} />
                        </Stack>
                    </Box>
                </Stack>
            </Box>
        </Paper>
    );
}

// Profile Header that manages its own loading state
function ProfileHeader({ profile, items = [] }) {
    // Animated counter for items (must be called before any early returns)
    const animatedItemCount = useAnimatedCounter(items.length, 800);

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

    // 🎯 If no profile data yet, show skeleton
    if (!profile || !profile.name) {
        return <ProfileHeaderSkeleton />;
    }

    // 📊 Calculate stats from items
    const totalPhotos = items.reduce((sum, item) => sum + (item.photos || 0), 0);
    const totalVideos = items.reduce((sum, item) => sum + (item.videos || 0), 0);
    const totalSize = items.reduce((sum, item) => {
        if (!item.fileSize && !item.size) return sum;
        const sizeStr = item.fileSize || item.size || '';
        const match = sizeStr.match(/([\d.,]+)\s*(KB|MB|GB)\b/i);
        if (!match) return sum;
        const num = parseFloat(match[1].replace(/,/g, ''));
        const unit = match[2].toUpperCase();
        let bytes = 0;
        switch (unit) {
            case 'KB': bytes = num * 1024; break;
            case 'MB': bytes = num * 1024 * 1024; break;
            case 'GB': bytes = num * 1024 * 1024 * 1024; break;
            default: bytes = 0; break;
        }
        return sum + bytes;
    }, 0);

    const formatSize = (bytes) => {
        if (!bytes) return '0 MB';
        const mb = bytes / (1024 * 1024);
        if (mb >= 1024) {
            const gb = mb / 1024;
            return `${gb.toFixed(2)} GB`;
        }
        return `${mb.toFixed(1)} MB`;
    };

    const coserName = profile.name;

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
            {/* Banner Section with responsive viewport-based height */}
            {profile.banner ? (
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
                    }}
                />
            ) : (
                <Box
                    sx={{
                        aspectRatio: '1500/500',
                        width: '100%',
                        maxHeight: '25vh',
                        minHeight: '25vh',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '12px 12px 0 0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Typography variant="h6" color="white" sx={{ opacity: 0.8 }}>
                        {profile.name}
                    </Typography>
                </Box>
            )}

            <Box sx={{ p: 3, position: 'relative' }}>
                <Stack direction="row" spacing={2} alignItems="flex-start">
                    <Avatar
                        src={profile.avatar}
                        sx={{
                            position: 'absolute',
                            top: -78,
                            left: 24,
                            width: 200,
                            height: 200,
                            bgcolor: 'primary.main',
                            boxShadow: 2,
                        }}
                    >
                        {!profile.avatar && <Person sx={{ fontSize: 44 }} />}
                    </Avatar>
                    <Box sx={{ ml: 10 }}> </Box>
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="h5" component="h1" fontWeight={700} gutterBottom>
                            {coserName}
                        </Typography>

                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {animatedItemCount} items • {totalPhotos.toLocaleString()} photos • {totalVideos.toLocaleString()} videos • {formatSize(totalSize)}
                        </Typography>

                        {/* Social Links */}
                        {profile.links && profile.links.length > 0 && (
                            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
                                {profile.links.map((link, index) => (
                                    <Button
                                        key={index}
                                        variant="outlined"
                                        size="small"
                                        startIcon={getSocialIcon(link.url, link.text)}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        sx={{ textTransform: 'none' }}
                                    >
                                        {link.text}
                                    </Button>
                                ))}
                            </Stack>
                        )}
                    </Box>
                </Stack>
            </Box>
        </Paper>
    );
}

export default ProfileHeader;
