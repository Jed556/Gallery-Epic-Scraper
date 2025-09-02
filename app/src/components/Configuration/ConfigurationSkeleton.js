import React from 'react';
import {
    Box,
    Paper,
    Skeleton,
    Stack,
    Divider,
} from '@mui/material';

// Skeleton for configuration form fields
function ConfigurationSkeleton() {
    return (
        <Box sx={{ p: 2 }}>
            {/* Header skeleton */}
            <Box sx={{ mb: 3 }}>
                <Skeleton variant="text" height={32} width="70%" animation="wave" sx={{ mb: 1 }} />
                <Skeleton variant="text" height={20} width="90%" animation="wave" />
            </Box>

            {/* Form sections skeleton */}
            <Stack spacing={3}>
                {/* Target Configuration */}
                <Paper sx={{ p: 2, border: '1px solid', borderColor: 'divider' }}>
                    <Skeleton variant="text" height={24} width="60%" animation="wave" sx={{ mb: 2 }} />
                    <Stack spacing={2}>
                        <Skeleton variant="rounded" height={40} animation="wave" />
                        <Skeleton variant="rounded" height={40} animation="wave" />
                    </Stack>
                </Paper>

                {/* Scraping Parameters */}
                <Paper sx={{ p: 2, border: '1px solid', borderColor: 'divider' }}>
                    <Skeleton variant="text" height={24} width="70%" animation="wave" sx={{ mb: 2 }} />
                    <Stack spacing={2}>
                        <Skeleton variant="rounded" height={40} animation="wave" />
                        <Skeleton variant="rounded" height={40} animation="wave" />
                        <Skeleton variant="rounded" height={40} animation="wave" />
                    </Stack>
                </Paper>

                {/* Download & Export Options */}
                <Paper sx={{ p: 2, border: '1px solid', borderColor: 'divider' }}>
                    <Skeleton variant="text" height={24} width="80%" animation="wave" sx={{ mb: 2 }} />
                    <Stack spacing={1}>
                        <Skeleton variant="text" height={20} width="60%" animation="wave" />
                        <Skeleton variant="text" height={20} width="55%" animation="wave" />
                        <Skeleton variant="text" height={20} width="45%" animation="wave" />
                        <Skeleton variant="text" height={20} width="50%" animation="wave" />
                        <Skeleton variant="text" height={20} width="65%" animation="wave" />
                        <Skeleton variant="text" height={20} width="70%" animation="wave" />
                    </Stack>
                </Paper>
            </Stack>

            <Divider sx={{ my: 3 }} />

            {/* Status and actions skeleton */}
            <Stack spacing={2}>
                <Skeleton variant="rounded" height={32} animation="wave" />
                <Skeleton variant="rounded" height={48} animation="wave" />
                <Skeleton variant="rounded" height={36} animation="wave" />
            </Stack>
        </Box>
    );
}

export default ConfigurationSkeleton;
