# Gallery Epic Scraper - Modern React App

A modern, responsive React application that replicates the functionality of the Gallery Epic Scraper Jupyter notebook. This app provides a user-friendly interface for scraping cosplayer galleries from GalleryEpic.com with advanced filtering, sorting, and export capabilities.

## Features

### 🎯 Core Functionality
- **Interactive Configuration**: Easy-to-use interface for setting scraping parameters
- **Real-time Progress**: Live progress tracking with status updates
- **Modern UI**: Material Design-inspired interface with smooth animations
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices

### 📊 Gallery Management
- **Advanced Filtering**: Filter by cosplay name, origin, or custom search queries
- **Multi-criteria Sorting**: Sort by photos, videos, views, downloads, or file size
- **Grid Layout**: Beautiful card-based layout with hover effects
- **Thumbnail Support**: Optional thumbnail rendering for visual browsing

### 📁 Export Options
- **CSV Export**: Spreadsheet-compatible format for data analysis
- **JSON Export**: Developer-friendly format for programmatic use
- **HTML Report**: Interactive standalone report with built-in search and filtering

### ⚙️ Configuration Options
- Coser ID targeting
- Page limits and delays
- Download URL resolution
- Thumbnail rendering
- Export format selection
- Custom filename support

## Project Structure

```
app/
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── UI/            # Reusable UI components
│   │   │   ├── Header.js  # Navigation header
│   │   │   ├── Icons.js   # Custom SVG icons
│   │   │   └── LoadingOverlay.js
│   │   ├── Configuration/ # Scraper settings
│   │   │   └── Configuration.js
│   │   └── Gallery/       # Gallery display components
│   │       ├── Gallery.js
│   │       ├── GalleryHeader.js
│   │       ├── GalleryFilters.js
│   │       ├── GalleryGrid.js
│   │       ├── GalleryCard.js
│   │       ├── EmptyState.js
│   │       └── ExportControls.js
│   ├── contexts/          # React Context for state management
│   │   └── ScraperContext.js
│   ├── services/          # Business logic
│   │   └── ScrapingService.js
│   ├── hooks/             # Custom React hooks
│   │   └── useExport.js
│   ├── utils/             # Utility functions
│   │   └── exportUtils.js
│   ├── App.js            # Main application component
│   ├── App.css           # Global styles
│   └── index.js          # React entry point
└── package.json          # Dependencies and scripts
```

## Technologies Used

- **React 19.1.1**: Latest React with modern features
- **Context API**: Global state management
- **Custom Hooks**: Reusable logic patterns
- **CSS Variables**: Modern styling approach
- **Axios**: HTTP client for API requests
- **Custom Icons**: SVG-based icon system

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Navigate to the app directory:
   ```bash
   cd app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
