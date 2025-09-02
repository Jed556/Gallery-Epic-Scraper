# Gallery Epic Scraper Backend

A backend proxy server to handle CORS issues when scraping Gallery Epic.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Start the server:
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

## API Endpoints

### GET /health
Health check endpoint.

**Response:**
```json
{
  "status": "OK",
  "message": "Gallery Epic Scraper Backend is running"
}
```

### GET /api/scrape?url=<URL>
Proxy endpoint for scraping pages.

**Parameters:**
- `url` (required): The URL to scrape

**Response:**
```json
{
  "success": true,
  "html": "...",
  "status": 200,
  "headers": {
    "content-type": "text/html",
    "content-length": "12345"
  }
}
```

### HEAD /api/check?url=<URL>
Check if a URL exists without downloading the full content.

**Parameters:**
- `url` (required): The URL to check

## Security

- Only allows scraping from galleryepic.com domain
- CORS configured for localhost:3000
- Request timeout set to 30 seconds
- Proper error handling

## Usage with React App

Update your ScrapingService to use this backend:

```javascript
const BACKEND_URL = 'http://localhost:3001';

async function fetchPage(url) {
  const response = await fetch(`${BACKEND_URL}/api/scrape?url=${encodeURIComponent(url)}`);
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error);
  }
  
  return data.html;
}
```
