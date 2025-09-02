import axios from 'axios';

const httpClient = axios.create({
    timeout: 30000,
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
    }
});

const allowedDomains = ['galleryepic.com'];

export default async function handler(req, res) {
    const { method, query: { url } } = req;

    if (method !== 'GET') {
        res.setHeader('Allow', 'GET');
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    if (!url) {
        return res.status(400).json({ success: false, error: 'URL parameter is required' });
    }

    try {
        const urlObj = new URL(url);
        if (!allowedDomains.some(domain => urlObj.hostname.includes(domain))) {
            return res.status(403).json({ success: false, error: 'Domain not allowed' });
        }

        const response = await httpClient.get(url);

        res.status(200).json({
            success: true,
            html: response.data,
            status: response.status,
            headers: {
                'content-type': response.headers['content-type'],
                'content-length': response.headers['content-length']
            }
        });
    } catch (error) {
        if (error.response) {
            return res.status(error.response.status).json({ success: false, error: error.message, status: error.response.status });
        } else if (error.request) {
            return res.status(503).json({ success: false, error: 'Network error - unable to reach target server' });
        } else {
            return res.status(500).json({ success: false, error: 'Internal server error' });
        }
    }
}
