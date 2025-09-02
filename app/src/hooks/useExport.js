import { useScraper } from '../contexts/ScraperContext';

export function useExport() {
    const { filteredData, exportData: contextExportData } = useScraper();

    const exportData = async (format) => {
        if (filteredData.length === 0) {
            alert('No data to export. Please run the scraper first.');
            return;
        }

        try {
            const result = await contextExportData(format);

            // Create download link
            const url = window.URL.createObjectURL(result.blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = result.filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

        } catch (error) {
            alert(`Export failed: ${error.message}`);
        }
    };

    return {
        exportData,
        canExport: filteredData.length > 0
    };
}
