const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Configure CORS to allow requests from your React app
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true
}));

app.use(express.json());

// Configure axios with proper headers to mimic a real browser
const httpClient = axios.create({
    timeout: 30000,
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
    }
});

// Track active scraping sessions
const activeSessions = new Map();

// Abort scraping session endpoint
app.post('/api/abort', (req, res) => {
    try {
        const { sessionId } = req.body;

        if (sessionId && activeSessions.has(sessionId)) {
            const session = activeSessions.get(sessionId);
            session.aborted = true;
            activeSessions.delete(sessionId);
            console.log(`Aborted scraping session: ${sessionId}`);
        }

        res.json({ success: true, message: 'Scraping session aborted' });
    } catch (error) {
        console.error('Error aborting session:', error);
        res.status(500).json({ success: false, error: 'Failed to abort session' });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Gallery Epic Scraper Backend is running' });
});

// Proxy endpoint for scraping Gallery Epic pages
app.get('/api/scrape', async (req, res) => {
    try {
        const { url } = req.query;

        if (!url) {
            return res.status(400).json({ error: 'URL parameter is required' });
        }

        // Validate that we're only scraping allowed domains
        const allowedDomains = ['galleryepic.com'];
        const urlObj = new URL(url);

        if (!allowedDomains.some(domain => urlObj.hostname.includes(domain))) {
            return res.status(403).json({ error: 'Domain not allowed' });
        }

        console.log(`Scraping: ${url}`);

        const response = await httpClient.get(url);

        // Return the HTML content
        res.json({
            success: true,
            html: response.data,
            status: response.status,
            headers: {
                'content-type': response.headers['content-type'],
                'content-length': response.headers['content-length']
            }
        });

    } catch (error) {
        console.error('Scraping error:', error.message);

        if (error.response) {
            // Server responded with error status
            res.status(error.response.status).json({
                success: false,
                error: error.message,
                status: error.response.status
            });
        } else if (error.request) {
            // Network error
            res.status(503).json({
                success: false,
                error: 'Network error - unable to reach target server'
            });
        } else {
            // Other error
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }
});

// Proxy endpoint for checking if a URL exists (HEAD request)
app.head('/api/check', async (req, res) => {
    try {
        const { url } = req.query;

        if (!url) {
            return res.status(400).end();
        }

        const urlObj = new URL(url);
        const allowedDomains = ['galleryepic.com'];

        if (!allowedDomains.some(domain => urlObj.hostname.includes(domain))) {
            return res.status(403).end();
        }

        const response = await httpClient.head(url);

        res.status(response.status).set({
            'content-type': response.headers['content-type'],
            'content-length': response.headers['content-length']
        }).end();

    } catch (error) {
        if (error.response) {
            res.status(error.response.status).end();
        } else {
            res.status(503).end();
        }
    }
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found'
    });
});

app.listen(PORT, () => {
    console.log(`Gallery Epic Scraper Backend is running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log(`Scrape endpoint: http://localhost:${PORT}/api/scrape?url=<URL>`);
});

module.exports = app;
