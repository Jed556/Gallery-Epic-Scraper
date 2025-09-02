// Utility to format large numbers into rounded compact form.
// Rules:
//  < 10,000 -> plain with commas
//  >= 10,000 & < 1,000,000 -> e.g. 12.3K (one decimal if needed)
//  >= 1,000,000 & < 1,000,000,000 -> e.g. 4.5M
//  >= 1,000,000,000 -> e.g. 7.8B (extend if needed for T)
export function formatCompact(num) {
    if (num == null) return '';
    if (num < 10000) return num.toLocaleString();
    const units = [
        { value: 1e9, suffix: 'B' },
        { value: 1e6, suffix: 'M' },
        { value: 1e3, suffix: 'K' },
    ];
    for (const u of units) {
        if (num >= u.value * 10) { // ensure at least 10K, 10M, 10B style rounding threshold
            const val = num / u.value;
            // Keep one decimal only if it adds meaning (e.g., 12.3K but 12K if .0)
            const rounded = val >= 100 ? Math.round(val) : Math.round(val * 10) / 10;
            return rounded % 1 === 0 ? `${rounded.toLocaleString()}${u.suffix}` : `${rounded}${u.suffix}`;
        }
    }
    // Fallback should not happen, but return with commas
    return num.toLocaleString();
}

export function formatWithLabel(num, label) {
    const compact = formatCompact(num);
    return label ? `${compact} ${label}` : compact;
}

// Format raw bytes into human-readable (B, KB, MB, GB, TB) with one decimal where useful.
// Previous implementation skipped the 'B' unit which caused an off-by-one (e.g. 600 MB showing as 600 GB).
export function formatBytes(bytes) {
    if (bytes == null || isNaN(bytes)) return '';
    if (bytes < 0) return '';
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let value = bytes;
    let i = 0;
    while (value >= 1024 && i < units.length - 1) {
        value /= 1024;
        i++;
    }
    const rounded = value >= 100 ? Math.round(value) : Math.round(value * 10) / 10;
    return `${rounded}${Number.isInteger(rounded) ? '' : ''} ${units[i]}`;
}
