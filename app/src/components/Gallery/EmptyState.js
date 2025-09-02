import React from 'react';
import { Box, Typography, Paper, Stack } from '@mui/material';
import { PlayArrow, Search, Settings } from '@mui/icons-material';

function EmptyState() {
    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1,
                pointerEvents: 'none', // Allow clicks to pass through the background
                '& > *': {
                    pointerEvents: 'auto' // Re-enable clicks on the content
                }
            }}
        >
            <Paper
                sx={{
                    p: 6,
                    textAlign: 'center',
                    maxWidth: 400,
                    bgcolor: 'background.paper'
                }}
                elevation={2}
            >
                <Search sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />

                <Typography variant="h5" gutterBottom fontWeight={600}>
                    No Gallery Data
                </Typography>

                <Typography variant="body1" color="text.secondary" paragraph>
                    Start by configuring the scraper settings and running a scraping session
                    to see gallery items here.
                </Typography>

                <Stack spacing={2} sx={{ mt: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
                        <Settings fontSize="small" />
                        <Typography variant="body2">Configure scraper parameters</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
                        <PlayArrow fontSize="small" />
                        <Typography variant="body2">Start scraping process</Typography>
                    </Box>
                </Stack>
            </Paper>
        </Box>
    );
}

export default EmptyState;
