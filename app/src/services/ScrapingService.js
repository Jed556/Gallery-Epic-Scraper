class ScrapingService {
    constructor() {
        // Use relative path in production (same origin). Fallback to env or localhost for dev.
        const isBrowser = typeof window !== 'undefined';
        const origin = isBrowser ? window.location.origin : '';
        this.BACKEND_URL = process.env.REACT_APP_BACKEND_URL || origin || 'http://localhost:3001';
        this.BASE_URL = 'https://galleryepic.com';
        this.isAborted = false;
        this.seen = new Set();
        this.cosplayerName = null;
        this.sessionId = null;
    }

    abort() {
        this.isAborted = true;

        // Also notify the backend to abort any ongoing requests
        if (this.sessionId) {
            fetch(`${this.BACKEND_URL}/api/abort`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ sessionId: this.sessionId }),
            }).catch(error => {
                console.error('Failed to notify backend of abort:', error);
            });
        }
    }

    async delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Fetch HTML content through backend proxy
    async fetchPage(url) {
        const response = await fetch(`${this.BACKEND_URL}/api/scrape?url=${encodeURIComponent(url)}`);
        const data = await response.json();

        if (!data.success) {
            throw new Error(data.error || `HTTP ${response.status}`);
        }

        return data.html;
    }

    parseSize(sizeStr) {
        if (!sizeStr) return null;

        const match = sizeStr.match(/([\d.,]+)\s*(KB|MB|GB)\b/i);
        if (!match) return null;

        const num = parseFloat(match[1].replace(',', ''));
        const unit = match[2].toUpperCase();

        switch (unit) {
            case 'KB': return num * 1024;
            case 'MB': return num * 1024 * 1024;
            case 'GB': return num * 1024 * 1024 * 1024;
            default: return null;
        }
    }

    formatSize(bytes) {
        if (!bytes) return '';

        const mb = bytes / (1024 * 1024);
        if (mb >= 1024) {
            const gb = mb / 1024;
            return `${gb.toFixed(2)} GB`;
        }
        return `${mb.toFixed(1)} MB`;
    }

    normalizeSizeText(sizeStr) {
        if (!sizeStr) return null;

        const cleanStr = sizeStr.replace(/\s+/g, ' ').trim();
        const match = cleanStr.match(/([\d.,]+)\s*(KB|MB|GB)\b/i);

        if (!match) return cleanStr;

        const num = match[1].replace(',', '');
        const unit = match[2].toUpperCase();

        try {
            if (num.includes('.')) {
                const numf = parseFloat(num);
                return numf >= 1 ? `${numf.toFixed(2)} ${unit}` : `${numf} ${unit}`;
            } else {
                return `${parseInt(parseFloat(num))} ${unit}`;
            }
        } catch {
            return `${num} ${unit}`;
        }
    }

    async parseDetailPage(detailUrl) {
        let views = null, downloads = null, createdDate = null, fileSize = null;

        try {
            const html = await this.fetchPage(detailUrl);
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // Stats block parsing
            const statsBlock = doc.querySelector('div.flex.space-x-4.mt-4.mb-6');
            if (statsBlock) {
                const paragraphs = statsBlock.querySelectorAll('p');
                if (paragraphs.length > 0) {
                    createdDate = paragraphs[0].textContent.trim();

                    for (let i = 1; i < paragraphs.length; i++) {
                        const txt = paragraphs[i].textContent.trim();

                        const viewsMatch = txt.match(/([\d,]+)\s*views?/i);
                        const downloadsMatch = txt.match(/([\d,]+)\s*downloads?/i);

                        if (viewsMatch) {
                            try {
                                views = parseInt(viewsMatch[1].replace(/,/g, ''));
                            } catch {
                                views = null;
                            }
                        }

                        if (downloadsMatch) {
                            try {
                                downloads = parseInt(downloadsMatch[1].replace(/,/g, ''));
                            } catch {
                                downloads = null;
                            }
                        }
                    }
                }
            }

            // File size parsing
            const sizePattern = /[\d.,]+\s*(KB|MB|GB)\b/i;

            const headerDivs = Array.from(doc.querySelectorAll('div')).filter(div => {
                const classList = Array.from(div.classList);
                return ['flex', 'justify-between', 'items-center'].every(cls => classList.includes(cls));
            });

            for (const headerDiv of headerDivs) {
                const pTags = headerDiv.querySelectorAll('p');
                if (pTags.length > 0) {
                    let sizeText = null;
                    if (pTags.length >= 2) {
                        const candidate = pTags[1].textContent.trim();
                        if (sizePattern.test(candidate)) {
                            sizeText = candidate;
                        }
                    }

                    if (!sizeText) {
                        for (const p of pTags) {
                            const text = p.textContent.trim();
                            if (sizePattern.test(text)) {
                                sizeText = text;
                                break;
                            }
                        }
                    }

                    if (sizeText) {
                        fileSize = this.normalizeSizeText(sizeText);
                        break;
                    }
                }
            }

            if (!fileSize) {
                const allParagraphs = doc.querySelectorAll('p');
                for (const p of allParagraphs) {
                    const text = p.textContent.trim();
                    if (sizePattern.test(text)) {
                        fileSize = this.normalizeSizeText(text);
                        break;
                    }
                }
            }

            return { views, downloads, createdDate, fileSize };

        } catch (error) {
            console.log(`Detail parse error (${detailUrl}): ${error.message}`);
            return { views, downloads, createdDate, fileSize };
        }
    }

    /**
     * Fallback: parse download page ( /en/download/cosplay/:id ) for file size only.
     * The size often appears in a container: <div class="flex justify-between items-center px-4 py-2"><p>[Name] [18P - 31MB] Title</p><p>31 MB</p></div>
     */
    async parseDownloadPageForSize(downloadUrl) {
        try {
            const html = await this.fetchPage(downloadUrl);
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            const sizePattern = /([\d.,]+)\s*(KB|MB|GB)\b/i;
            let fileSize = null;

            // 1. Look for the flex header container with justify-between items-center
            const headerDivs = Array.from(doc.querySelectorAll('div')).filter(div => {
                const cl = Array.from(div.classList);
                return ['flex', 'justify-between', 'items-center'].every(cls => cl.includes(cls));
            });

            for (const div of headerDivs) {
                const pTags = div.querySelectorAll('p');
                if (pTags.length) {
                    // (a) Second p tag commonly holds just the size
                    if (pTags.length > 1) {
                        const candidate = pTags[1].textContent.trim();
                        const m = candidate.match(sizePattern);
                        if (m) {
                            fileSize = this.normalizeSizeText(candidate);
                            break;
                        }
                    }
                    // (b) Bracket pattern inside first p: [18P - 31MB]
                    const firstTxt = pTags[0].textContent.trim();
                    const bracketMatch = firstTxt.match(/\[([^\]]*?)([\d.,]+)\s*(KB|MB|GB)\]/i);
                    if (!fileSize && bracketMatch) {
                        fileSize = this.normalizeSizeText(`${bracketMatch[2]} ${bracketMatch[3]}`);
                        break;
                    }
                    // (c) Scan all p tags
                    if (!fileSize) {
                        for (const p of pTags) {
                            const txt = p.textContent.trim();
                            const m2 = txt.match(sizePattern);
                            if (m2) {
                                fileSize = this.normalizeSizeText(txt);
                                break;
                            }
                        }
                        if (fileSize) break;
                    }
                }
            }

            if (!fileSize) {
                // Global fallback
                const allP = doc.querySelectorAll('p');
                for (const p of allP) {
                    const txt = p.textContent.trim();
                    if (sizePattern.test(txt)) {
                        fileSize = this.normalizeSizeText(txt);
                        break;
                    }
                }
            }

            return fileSize;
        } catch (e) {
            console.log(`Download page size parse error (${downloadUrl}): ${e.message}`);
            return null;
        }
    }

    async scrapePage(coserId, page, onProgress) {
        const pageUrl = `${this.BASE_URL}/en/coser/${coserId}/${page}`;
        const items = [];

        try {
            const html = await this.fetchPage(pageUrl);
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // Check for 404 or empty page
            const title = doc.title.toLowerCase();
            if (title.includes('404') || title.includes('not found')) {
                console.log(`Page ${page} returned 404. Stopping.`);
                return { items, shouldStop: true };
            }

            // Get cosplayer name
            if (this.cosplayerName === null) {
                const h4 = doc.querySelector('h4.scroll-m-20');
                if (h4) {
                    this.cosplayerName = h4.textContent.trim();
                }
            }

            // Find item containers
            const containers = doc.querySelectorAll('div.space-y-3.relative');
            if (containers.length === 0) {
                console.log(`No item containers on page ${page}. Stopping early.`);
                return { items, shouldStop: true };
            }

            for (const container of containers) {
                const downloadLink = container.querySelector('a[href^="/en/download/cosplay/"]');
                const mainLink = container.querySelector('a[href^="/en/cosplay/"]');

                if (!downloadLink) continue;

                const href = downloadLink.getAttribute('href')?.trim();
                if (!href) continue;

                const fullDownload = new URL(href, this.BASE_URL).href;
                const downloadId = href.replace(/\/$/, '').split('/').pop();
                const key = `${downloadId}-${fullDownload}`;

                if (this.seen.has(key)) continue;
                this.seen.add(key);

                // Extract item data
                let cosplayName = "";
                if (mainLink) {
                    const h3 = mainLink.querySelector('h3');
                    if (h3) {
                        cosplayName = h3.textContent.trim();
                    }
                }
                if (!cosplayName) {
                    const h3 = container.querySelector('h3');
                    if (h3) {
                        cosplayName = h3.textContent.trim();
                    }
                }

                // Photos & Videos
                let photos = null;
                let videos = null;
                const paragraphs = container.querySelectorAll('p');
                for (const p of paragraphs) {
                    const txt = p.textContent.trim();
                    if (!txt) continue;

                    const photosMatch = txt.match(/([\d,]+)\s*[Pp]\b/);
                    const videosMatch = txt.match(/([\d,]+)\s*[Vv]\b/);

                    if (photosMatch) {
                        try {
                            photos = parseInt(photosMatch[1].replace(/,/g, ''));
                        } catch {
                            photos = null;
                        }
                    }

                    if (videosMatch) {
                        try {
                            videos = parseInt(videosMatch[1].replace(/,/g, ''));
                        } catch {
                            videos = null;
                        }
                    }
                }

                const photosVal = photos !== null ? photos : 0;
                const videosVal = videos !== null ? videos : 0;

                // Origin
                let origin = "";
                const originP = container.querySelector('p.text-muted-foreground');
                if (originP) {
                    origin = originP.textContent.trim();
                }

                // Thumbnail & Detail URL
                let thumbnail = "";
                let detailUrl = "";
                if (mainLink) {
                    const detailHref = mainLink.getAttribute('href')?.trim();
                    if (detailHref) {
                        detailUrl = new URL(detailHref, this.BASE_URL).href;
                    }

                    const img = mainLink.querySelector('img');
                    if (img) {
                        const src = img.getAttribute('src') || img.getAttribute('data-src') || '';
                        if (src) {
                            thumbnail = new URL(src, this.BASE_URL).href;
                        }
                    }
                } else {
                    const img = container.querySelector('img');
                    if (img) {
                        const src = img.getAttribute('src') || '';
                        if (src) {
                            thumbnail = new URL(src, this.BASE_URL).href;
                        }
                    }
                }

                // Get detail page data
                let views = null;
                let downloads = null;
                let createdDate = null;
                let fileSize = null;

                if (detailUrl) {
                    const detailData = await this.parseDetailPage(detailUrl);
                    views = detailData.views;
                    downloads = detailData.downloads;
                    createdDate = detailData.createdDate;
                    fileSize = detailData.fileSize;

                    await this.delay(350);
                }

                // Fallback: fetch download page if size still missing
                if (!fileSize && downloadLink) {
                    try {
                        const downloadSize = await this.parseDownloadPageForSize(fullDownload);
                        if (downloadSize) fileSize = downloadSize;
                        await this.delay(250);
                    } catch (e) {
                        console.log(`Fallback size fetch failed: ${e.message}`);
                    }
                }

                items.push({
                    page: page,
                    cosplayer: this.cosplayerName || "",
                    cosplay: cosplayName || "",
                    origin: origin || "",
                    photos: photosVal,
                    videos: videosVal,
                    views: views || 0,
                    downloads: downloads || 0,
                    dateCreated: createdDate || "",
                    fileSize: fileSize || "",
                    downloadId: downloadId,
                    downloadUrl: fullDownload,
                    thumbnail: thumbnail || "",
                    detailUrl: detailUrl || ""
                });
            }

            return { items, shouldStop: false };

        } catch (error) {
            console.log(`Request error on page ${page}: ${error.message}. Stopping.`);
            return { items, shouldStop: true };
        }
    }

    async scrapeCoserProfile(coserId) {
        const profile = {
            name: '',
            avatar: '',
            banner: '',
            links: [],
            profileUrl: `${this.BASE_URL}/en/coser/${coserId}/1`
        };

        try {
            const html = await this.fetchPage(profile.profileUrl);
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            const nameElement = doc.querySelector('h4.scroll-m-20') || doc.querySelector('h4');
            if (nameElement) {
                profile.name = nameElement.textContent.trim();
                this.cosplayerName = profile.name;
            }

            const avatarImg = doc.querySelector('img[variant="avatar"]') || doc.querySelector('img.avatar');
            if (avatarImg) {
                profile.avatar = avatarImg.src;
            }

            const bannerImg = doc.querySelector('img[variant="banner"]') || doc.querySelector('img.banner');
            if (bannerImg) {
                profile.banner = bannerImg.src;
            }

            const linkElements = doc.querySelectorAll('a[href*="http"]');
            linkElements.forEach(link => {
                const href = link.href;
                if (!href.includes('galleryepic.com')) {
                    profile.links.push({
                        url: href,
                        text: link.textContent.trim()
                    });
                }
            });

            return {
                name: profile.name || `Cosplayer ${coserId}`,
                avatar: profile.avatar,
                banner: profile.banner,
                links: profile.links,
                profileUrl: profile.profileUrl
            };

        } catch (error) {
            console.log(`Profile fetch error: ${error.message}`);
            return {
                name: `Cosplayer ${coserId}`,
                avatar: '',
                banner: '',
                links: [],
                profileUrl: profile.profileUrl
            };
        }
    }

    async scrapePages(config, onProgress, onItemsUpdate = null) {
        const { coserId, maxPages, delayPerPage } = config;

        let allItems = [];
        this.seen.clear();
        this.cosplayerName = null;

        for (let page = 1; page <= maxPages && !this.isAborted; page++) {
            onProgress({
                progress: (page / maxPages) * 100,
                status: `Scraping page ${page}/${maxPages}...`
            });

            const { items, shouldStop } = await this.scrapePage(coserId, page, onProgress);

            if (shouldStop) {
                break;
            }

            // 🚀 PROGRESSIVE LOADING: Update items immediately after each page
            if (items.length > 0) {
                allItems.push(...items);

                // Send progressive update if callback provided
                if (onItemsUpdate) {
                    console.log(`📦 Page ${page} loaded with ${items.length} items! Total: ${allItems.length}`);
                    onItemsUpdate([...allItems]); // Send copy of current items
                }
            }

            if (page < maxPages && !this.isAborted) {
                await this.delay(delayPerPage * 1000);
            }
        }

        console.log(`Scraped ${allItems.length} items for coser ${coserId} - cosplayer: ${this.cosplayerName}`);
        return allItems;
    }

    async startScraping(config, onProgress, onCoserProfile, onItemsUpdate) {
        try {
            this.isAborted = false;
            this.sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

            console.log(`🚀 Starting backend scraping session: ${this.sessionId}`);

            // 🚀 PARALLEL LOADING: Start both profile and page scraping simultaneously
            onProgress({ progress: 5, status: 'Starting parallel data loading...' });

            // Start profile loading immediately (don't await)
            const profilePromise = this.scrapeCoserProfile(config.coserId)
                .then(profile => {
                    console.log('📸 Profile loaded!', profile);
                    onCoserProfile(profile);
                    onProgress({ progress: 15, status: 'Profile loaded! Starting page scraping...' });
                    return profile;
                })
                .catch(error => {
                    console.error('Profile loading failed:', error);
                    // Don't fail the whole operation, just use fallback profile
                    const fallbackProfile = {
                        name: `Cosplayer ${config.coserId}`,
                        avatar: '',
                        banner: '',
                        links: [],
                        profileUrl: `${this.BASE_URL}/en/coser/${config.coserId}/1`
                    };
                    onCoserProfile(fallbackProfile);
                    return fallbackProfile;
                });

            // Start page scraping with progressive updates
            onProgress({ progress: 10, status: 'Starting page scraping...' });
            const items = await this.scrapePages(config, (progress) => {
                onProgress({
                    progress: 15 + (progress * 0.85), // Leave 15% for profile, use 85% for pages
                    status: progress.status
                });
            }, onItemsUpdate); // Pass progressive update callback

            // Wait for profile to complete if it hasn't already
            await profilePromise;

            onProgress({
                progress: 100,
                status: `Completed! Scraped ${items.length} items for coser ${config.coserId} - cosplayer: ${this.cosplayerName || 'Unknown'}`
            });

            return items;

        } catch (error) {
            throw new Error(`Scraping failed: ${error.message}`);
        }
    }
}

export default ScrapingService;
