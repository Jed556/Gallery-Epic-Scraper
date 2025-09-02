const allowedDomains = ['galleryepic.com'];

module.exports = async (req, res) => {
    const { method, query: { url } } = req;
    if (method !== 'HEAD' && method !== 'GET') {
        res.setHeader('Allow', 'HEAD, GET');
        return res.status(405).end();
    }
    if (!url) return res.status(400).end();
    try {
        const urlObj = new URL(url);
        if (!allowedDomains.some(domain => urlObj.hostname.includes(domain))) {
            return res.status(403).end();
        }
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000);
        const headResp = await fetch(url, { method: 'HEAD', signal: controller.signal });
        clearTimeout(timeout);
        res.status(headResp.status).end();
    } catch (e) {
        res.status(503).end();
    }
};
