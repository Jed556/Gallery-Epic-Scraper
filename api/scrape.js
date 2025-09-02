// Serverless scrape function (no axios dependency). Uses fetch with custom headers.
const allowedDomains = ['galleryepic.com'];

module.exports = async (req, res) => {
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

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 30000);
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'DNT': '1',
                'Upgrade-Insecure-Requests': '1'
            },
            signal: controller.signal
        });
        clearTimeout(timeout);

        const html = await response.text();

        return res.status(200).json({
            success: true,
            html,
            status: response.status,
            headers: {
                'content-type': response.headers.get('content-type') || 'text/html'
            }
        });
    } catch (error) {
        if (error.name === 'AbortError') {
            return res.status(504).json({ success: false, error: 'Upstream timeout' });
        }
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
};
