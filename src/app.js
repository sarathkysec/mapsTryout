import { initMap, flyToLocation } from './map.js';
import { initTheme } from './theme.js';
import { initGoogleAuth } from './auth.js';
import { loadLocalData } from './search.js';

// Initialize Components
document.addEventListener('DOMContentLoaded', () => {
    // Expose flyToLocation globally for components
    window.flyToLocation = flyToLocation;
    // Map & Theme
    initMap();
    initTheme();

    // Auth & Data
    initGoogleAuth();

    loadLocalData(); // Pre-load local search data in background

    console.log("%c GeoAtlas %c Modern OSM Experience with React ", "background: #6366f1; color: #fff; padding: 5px; border-radius: 5px 0 0 5px;", "background: #f1f5f9; color: #1e293b; padding: 5px; border-radius: 0 5px 5px 0;");
});
