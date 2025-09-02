import axios from 'axios';

const httpClient = axios.create({ timeout: 15000 });
const allowedDomains = ['galleryepic.com'];

export default async function handler(req, res) {
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

        const response = await httpClient.head(url);
        res.status(response.status)
            .set({
                'content-type': response.headers['content-type'] || 'text/plain',
                'content-length': response.headers['content-length'] || '0'
            })
            .end();
    } catch (error) {
        if (error.response) {
            res.status(error.response.status).end();
        } else {
            res.status(503).end();
        }
    }
}
