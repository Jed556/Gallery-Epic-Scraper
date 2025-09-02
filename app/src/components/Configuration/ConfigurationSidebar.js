import React, { useState } from 'react';
import {
    Drawer,
    Box,
    Typography,
    TextField,
    FormControlLabel,
    Checkbox,
    Button,
    Chip,
    CircularProgress,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Paper,
    Stack,
    Alert,
} from '@mui/material';
import {
    PlayArrow as PlayIcon,
    Stop as StopIcon,
    Search as SearchIcon,
    SettingsSuggest as ParametersIcon,
    Download as DownloadIcon,
    ExpandMore as ExpandMoreIcon,
    Clear as ClearIcon,
    Description,
    Code,
    Language,
} from '@mui/icons-material';
import { useScraper } from '../../contexts/ScraperContext';
import { useExport } from '../../hooks/useExport';

const ConfigurationSidebar = ({ isOpen, onClose }) => {
    const {
        config,
        updateConfig,
        startScraping,
        stopScraping,
        isLoading,
        galleryData,
        clearData
    } = useScraper();

    const { exportData, canExport } = useExport();

    const [localConfig, setLocalConfig] = useState(config);

    const exportOptions = [
        {
            format: 'csv',
            label: 'Export CSV',
            icon: Description,
            description: 'Spreadsheet format'
        },
        {
            format: 'json',
            label: 'Export JSON',
            icon: Code,
            description: 'Developer format'
        },
        {
            format: 'html',
            label: 'Export HTML',
            icon: Language,
            description: 'Interactive report'
        }
    ];

    // Sync localConfig with global config when config changes
    React.useEffect(() => {
        setLocalConfig(config);
    }, [config]);

    const handleConfigChange = (field, value) => {
        const newConfig = { ...localConfig, [field]: value };
        setLocalConfig(newConfig);
        updateConfig(newConfig);
    };

    const handleStartScraping = () => {
        updateConfig(localConfig);
        startScraping();
    };

    const handleStopScraping = () => {
        stopScraping();
    };

    const handleClearData = () => {
        clearData();
    };

    const drawerContent = (
        <Box sx={{ width: 400, height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            {/* <Box sx={{
                p: 2,
                borderBottom: 1,
                borderColor: 'divider',
                bgcolor: 'background.paper'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <SettingsIcon color="primary" />
                        <Typography variant="h6" fontWeight={600}>
                            Configuration
                        </Typography>
                    </Box>
                    <IconButton onClick={onClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>
            </Box> */}

            {/* Scrollable Content */}
            <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
                {/* Target Configuration */}
                <Accordion defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <SearchIcon fontSize="small" />
                            <Typography variant="subtitle1" fontWeight={600}>Search</Typography>
                        </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField
                                fullWidth
                                label="Coser ID"
                                value={localConfig.coserId || ''}
                                onChange={(e) => handleConfigChange('coserId', e.target.value)}
                                placeholder="e.g., 92"
                                variant="outlined"
                                size="small"
                                helperText="The numeric ID of the cosplayer (required)"
                                required
                            />
                        </Box>
                    </AccordionDetails>
                </Accordion>

                {/* Scraping Configuration */}
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <ParametersIcon fontSize="small" />
                            <Typography variant="subtitle1" fontWeight={600}>Scraping Parameters</Typography>
                        </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField
                                fullWidth
                                label="Max Pages"
                                type="number"
                                inputProps={{ min: 1, max: 1000 }}
                                value={localConfig.maxPages || 100}
                                onChange={(e) => handleConfigChange('maxPages', parseInt(e.target.value) || 100)}
                                variant="outlined"
                                size="small"
                                helperText="Maximum pages to scrape (stops early if no data)"
                            />
                            <TextField
                                fullWidth
                                label="Delay Per Page (seconds)"
                                type="number"
                                inputProps={{ min: 0.1, max: 10, step: 0.1 }}
                                value={localConfig.delayPerPage || 0.8}
                                onChange={(e) => handleConfigChange('delayPerPage', parseFloat(e.target.value) || 0.8)}
                                variant="outlined"
                                size="small"
                                helperText="Delay between page requests"
                            />
                            <TextField
                                fullWidth
                                label="Concurrency"
                                type="number"
                                inputProps={{ min: 1, max: 20 }}
                                value={localConfig.concurrency || 4}
                                onChange={(e) => handleConfigChange('concurrency', parseInt(e.target.value) || 4)}
                                variant="outlined"
                                size="small"
                                helperText="Number of concurrent threads for downloads"
                            />
                        </Box>
                    </AccordionDetails>
                </Accordion>

                {/* Download & Export Options */}
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <DownloadIcon fontSize="small" />
                            <Typography variant="subtitle1" fontWeight={600}>Download & Export</Typography>
                        </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField
                                fullWidth
                                label="Custom Filename"
                                value={localConfig.customFilename || ''}
                                onChange={(e) => handleConfigChange('customFilename', e.target.value)}
                                placeholder="e.g., my_cosplayer_data"
                                variant="outlined"
                                size="small"
                                helperText="Custom filename for exported files (optional)"
                            />

                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={localConfig.resolveDownloads || false}
                                        onChange={(e) => handleConfigChange('resolveDownloads', e.target.checked)}
                                    />
                                }
                                label="Resolve Download URLs"
                                sx={{ mb: 2 }}
                            />

                            <Typography variant="subtitle2" sx={{ mt: 1, fontWeight: 600 }}>
                                Export Data
                            </Typography>

                            {!canExport && (
                                <Alert severity="info" sx={{ mt: 2, fontSize: '0.8rem' }}>
                                    No data available for export. Run the scraper to collect data first.
                                </Alert>
                            )}

                            <Stack spacing={2}>
                                {exportOptions.map(({ format, label, icon: Icon, description }) => (
                                    <Button
                                        key={format}
                                        variant="outlined"
                                        startIcon={<Icon />}
                                        onClick={() => exportData(format)}
                                        disabled={!canExport}
                                        sx={{
                                            justifyContent: 'flex-start',
                                            p: 1.5,
                                            textAlign: 'left',
                                        }}
                                    >
                                        <Box sx={{ ml: 1 }}>
                                            <Typography variant="button" component="div" sx={{ fontSize: '0.8rem' }}>
                                                {label}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary" component="div">
                                                {description}
                                            </Typography>
                                        </Box>
                                    </Button>
                                ))}
                            </Stack>
                        </Box>
                    </AccordionDetails>
                </Accordion>
            </Box>

            {/* Actions Footer */}
            <Paper sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                {/* Status Display */}
                {isLoading && (
                    <Box sx={{ mb: 2 }}>
                        <Chip
                            icon={<CircularProgress size={16} />}
                            label="Scraping in progress..."
                            color="warning"
                            sx={{ width: '100%' }}
                        />
                    </Box>
                )}

                {galleryData.length > 0 && !isLoading && (
                    <Box sx={{ mb: 2 }}>
                        <Chip
                            label={`Found ${galleryData.length} items`}
                            color="success"
                            sx={{ width: '100%' }}
                        />
                    </Box>
                )}

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {!isLoading ? (
                        <Button
                            variant="contained"
                            startIcon={<PlayIcon />}
                            onClick={handleStartScraping}
                            disabled={!localConfig.coserId || localConfig.coserId.trim() === ''}
                            fullWidth
                            size="large"
                        >
                            Start Scraping
                        </Button>
                    ) : (
                        <Button
                            variant="outlined"
                            startIcon={<StopIcon />}
                            onClick={handleStopScraping}
                            fullWidth
                            size="large"
                            color="error"
                        >
                            Stop Scraping
                        </Button>
                    )}

                    {galleryData.length > 0 && (
                        <Button
                            variant="outlined"
                            startIcon={<ClearIcon />}
                            onClick={handleClearData}
                            fullWidth
                        >
                            Clear Results
                        </Button>
                    )}
                </Box>
            </Paper>
        </Box>
    );

    return (
        <>
            {/* Mobile backdrop */}
            <Drawer
                variant="persistent"
                anchor="left"
                open={isOpen}
                sx={{
                    width: isOpen ? 400 : 0,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: 400,
                        boxSizing: 'border-box',
                        top: 64, // Height of AppBar
                        height: 'calc(100vh - 64px)',
                        borderRight: 1,
                        borderColor: 'divider',
                        transition: 'none',
                    },
                }}
            >
                {drawerContent}
            </Drawer>
        </>
    );
};

export default ConfigurationSidebar;
