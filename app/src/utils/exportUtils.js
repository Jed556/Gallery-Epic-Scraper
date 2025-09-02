// Utility functions for exporting gallery data
import { formatBytes, formatCompact } from './numberFormat';

export function exportToCSV(items, filename = 'gallery-data.csv') {
  if (!items.length) return;

  const headers = [
    'ID',
    'Page',
    'Cosplayer',
    'Cosplay',
    'Origin',
    'Photos',
    'Videos',
    'Views',
    'Downloads',
    'Date Created',
    'File Size',
    'Size (Bytes)',
    'Download URL',
    'Detail URL',
    'Thumbnail'
  ];

  const csvContent = [
    headers.join(','),
    ...items.map(item => [
      item.id || '',
      item.page || '',
      `"${(item.cosplayer || '').replace(/"/g, '""')}"`,
      `"${(item.cosplay || '').replace(/"/g, '""')}"`,
      `"${(item.origin || '').replace(/"/g, '""')}"`,
      item.photos || 0,
      item.videos || 0,
      item.views || 0,
      item.downloads || 0,
      `"${(item.dateCreated || '').replace(/"/g, '""')}"`,
      `"${(item.fileSize || '').replace(/"/g, '""')}"`,
      item.sizeBytes || 0,
      `"${(item.downloadUrl || '').replace(/"/g, '""')}"`,
      `"${(item.detailUrl || '').replace(/"/g, '""')}"`,
      `"${(item.thumbnail || '').replace(/"/g, '""')}"`
    ].join(','))
  ].join('\n');

  downloadFile(csvContent, filename, 'text/csv');
}

export function exportToJSON(items, filename = 'gallery-data.json') {
  if (!items.length) return;

  const jsonContent = JSON.stringify(items, null, 2);
  downloadFile(jsonContent, filename, 'application/json');
}

export function exportToHTML(items, profile, config, filename = 'gallery-report.html') {
  if (!items.length) return;

  const totalPhotos = items.reduce((sum, item) => sum + (item.photos || 0), 0);
  const totalVideos = items.reduce((sum, item) => sum + (item.videos || 0), 0);
  const totalSize = items.reduce((sum, item) => sum + (item.sizeBytes || 0), 0);

  const headerPhotos = formatCompact(totalPhotos);
  const headerVideos = formatCompact(totalVideos);
  const headerSize = formatBytes(totalSize);

  const origins = [...new Set(items.map(item => item.origin).filter(Boolean))].sort();
  const originOptions = origins.map(origin =>
    `<option value="${escapeHtml(origin)}">${escapeHtml(origin)}</option>`
  ).join('');

  const cardsHtml = items.map(item => `
    <article class="card" data-name="${escapeHtml(item.cosplay?.toLowerCase() || '')}" 
             data-origin="${escapeHtml(item.origin?.toLowerCase() || '')}" 
             data-photos="${item.photos || 0}" 
             data-videos="${item.videos || 0}"
             data-views="${item.views || 0}" 
             data-downloads="${item.downloads || 0}" 
             data-size-mb="${(item.sizeBytes || 0) / (1024 * 1024)}">
      <div class="thumb">
        ${config.renderThumbnails && item.thumbnail ?
      `<img src="${escapeHtml(item.thumbnail)}" loading="lazy" alt="${escapeHtml(item.cosplay || '')}">` :
      '<div class="no-thumb">No image</div>'
    }
        <div class="overlay">${item.photos || 0}P / ${item.videos || 0}V</div>
      </div>
      <div class="meta">
        <div class="title">${escapeHtml(item.cosplay || '')}</div>
        <div class="subtitle">${escapeHtml(item.origin || '')}</div>
  <div class="stats">${escapeHtml(item.dateCreated || '')} • ${formatCompact(item.views || 0)} views • ${formatCompact(item.downloads || 0)} dl${item.fileSize ? ` • ${escapeHtml(item.fileSize)}` : ''}</div>
        <div class="actions">
          <a class="btn" href="${escapeHtml(item.downloadUrl || '')}" target="_blank" rel="noopener">Download</a>
          ${item.detailUrl ? `<a class="link" href="${escapeHtml(item.detailUrl)}" target="_blank" rel="noopener">Detail</a>` : ''}
        </div>
      </div>
    </article>
  `).join('\n');

  const htmlContent = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Gallery Epic Scraper Report</title>
  <style>
    :root {
      --bg: #f5f7fb; --surface: #ffffff; --muted: #6b7280; --accent: #6750A4; --accent-2: #03a87c;
      --text: #111827; --shadow: 0 6px 18px rgba(2,6,23,0.12); --radius: 12px;
    }
    * { box-sizing: border-box; }
    html, body { height: 100%; margin: 0; font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; background: var(--bg); color: var(--text); }
    .container { max-width: 1200px; margin: 20px auto; padding: 18px; }
    .header-card { background: linear-gradient(135deg, var(--surface), #fbfbff); border-radius: var(--radius); overflow: hidden; box-shadow: var(--shadow); display: flex; gap: 16px; align-items: center; padding: 18px; }
    .profile { display: flex; gap: 12px; align-items: center; flex: 1; }
    .headline { display: flex; flex-direction: column; gap: 6px; }
    .headline .name { font-weight: 700; font-size: 18px; }
    .headline .meta { color: var(--muted); font-size: 13px; }
    .controls { display: flex; gap: 8px; align-items: center; }
    .input, select { padding: 10px; border-radius: 10px; border: 1px solid rgba(2,6,23,0.06); background: #fff; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 14px; margin-top: 18px; }
    .card { background: var(--surface); border-radius: 10px; overflow: hidden; box-shadow: var(--shadow); display: flex; flex-direction: column; transition: transform .12s; min-height: 200px; }
    .card:hover { transform: translateY(-6px); }
    .thumb { position: relative; aspect-ratio: 3/4; background: #eee; display: flex; align-items: center; justify-content: center; }
    .thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
    .no-thumb { padding: 18px; color: var(--muted); }
    .overlay { position: absolute; right: 8px; bottom: 8px; background: rgba(0,0,0,0.6); color: #fff; padding: 6px 8px; border-radius: 8px; font-weight: 700; font-size: 12px; }
    .meta { padding: 12px; display: flex; flex-direction: column; gap: 8px; flex: 1; }
    .title { font-weight: 600; font-size: 15px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .subtitle { font-size: 13px; color: var(--muted); }
    .stats { font-size: 13px; color: var(--muted); }
    .actions { display: flex; gap: 8px; flex-wrap: wrap; margin-top: auto; }
    .btn { background: linear-gradient(90deg, var(--accent), var(--accent-2)); color: white; padding: 8px 10px; border-radius: 10px; text-decoration: none; font-weight: 600; }
    .link { color: var(--muted); text-decoration: none; padding: 8px; border-radius: 8px; border: 1px solid transparent; background: transparent; }
    .toolbar { display: flex; gap: 8px; align-items: center; margin-top: 12px; }
    .toggle { padding: 8px; border-radius: 8px; border: 1px solid rgba(2,6,23,0.06); background: #fff; cursor: pointer; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header-card">
      <div class="profile">
        <div class="headline">
          <div class="name">${escapeHtml(profile?.name || 'Gallery Epic Scraper')}</div>
          <div class="meta">Scraped ${items.length} items • ${headerPhotos} photos • ${headerVideos} videos • ${headerSize}</div>
        </div>
        <div style="flex:1"></div>
        <div class="toolbar">
          <input id="search" class="input" placeholder="Search cosplay or origin" />
          <select id="originFilter" class="input">
            <option value="">All origins</option>
            ${originOptions}
          </select>
          <select id="sortBy" class="input">
            <option value="default">Sort: Default</option>
            <option value="photos">Photos</option>
            <option value="videos">Videos</option>
            <option value="views">Views</option>
            <option value="downloads">Downloads</option>
            <option value="size">Size</option>
          </select>
          <button id="sortDir" class="toggle" title="Toggle ascending/descending">↓</button>
        </div>
      </div>
    </div>
    
    <section class="grid" id="cards">
      ${cardsHtml}
    </section>
  </div>

  <script>
    const cardsRoot = document.getElementById('cards');
    const search = document.getElementById('search');
    const originFilter = document.getElementById('originFilter');
    const sortBy = document.getElementById('sortBy');
    const sortDirBtn = document.getElementById('sortDir');

    let sortDesc = true;
    function updateSortDirUI() { sortDirBtn.textContent = sortDesc ? '↓' : '↑'; }

    function nodesArray() { return Array.from(cardsRoot.querySelectorAll('.card')); }
    function normalize(s) { return (s || '').toString().toLowerCase(); }

    function filterAndSort() {
      const q = normalize(search.value);
      const origin = normalize(originFilter.value);
      let nodes = nodesArray();
      nodes.forEach(n => {
        const name = normalize(n.dataset.name || '');
        const o = normalize(n.dataset.origin || '');
        const matches = (q === '' || name.includes(q) || o.includes(q)) && (origin === '' || o === origin);
        n.style.display = matches ? '' : 'none';
      });
      nodes = nodes.filter(n => n.style.display !== 'none');
      const key = sortBy.value;
      const desc = sortDesc ? -1 : 1;
      function val(n, k) {
        if (k === 'photos') return parseFloat(n.dataset.photos || 0);
        if (k === 'videos') return parseFloat(n.dataset.videos || 0);
        if (k === 'views') return parseFloat(n.dataset.views || 0);
        if (k === 'downloads') return parseFloat(n.dataset.downloads || 0);
        if (k === 'size') return parseFloat(n.dataset.sizeMb || 0);
        return 0;
      }
      if (key !== 'default') {
        nodes.sort((a, b) => desc * (val(b, key) - val(a, key)));
      }
      nodes.forEach(n => cardsRoot.appendChild(n));
    }

    search.addEventListener('input', filterAndSort);
    originFilter.addEventListener('change', filterAndSort);
    sortBy.addEventListener('change', filterAndSort);
    sortDirBtn.addEventListener('click', () => {
      sortDesc = !sortDesc;
      updateSortDirUI();
      filterAndSort();
    });

    updateSortDirUI();
    filterAndSort();
  </script>
</body>
</html>`;

  downloadFile(htmlContent, filename, 'text/html');
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function generateFilename(config, extension) {
  const base = config.customFilename || `galleryepic_coser_${config.coserId}`;
  const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
  return `${base}_${timestamp}.${extension}`;
}
