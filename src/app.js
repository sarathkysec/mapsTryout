import { initMap, flyToLocation } from './map.js';
import { initTheme } from './theme.js';
import { initGoogleAuth } from './auth.js';
import { loadLocalData } from './search.js';
import { polyfillCountryFlagEmojis } from "country-flag-emoji-polyfill";

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

    polyfillCountryFlagEmojis();

    // Register Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then((reg) => console.log('Service Worker registered successfully:', reg.scope))
            .catch((err) => console.warn('Service Worker registration failed:', err));
        
        // Register Festival Worker from src/workers
        navigator.serviceWorker.register(new URL('./workers/festivalWorker.js', import.meta.url), { type: 'module', scope: '/src/workers/' }).catch(() => {});
    }

    // Start Festival Worker via Worker API on project start
    try {
        new Worker(new URL('./workers/festivalWorker.js', import.meta.url), { type: 'module' });
    } catch (err) {
        // Silent catch
    }

    // Monitor Network Connection Status
    const updateOnlineStatus = () => {
        const isOnline = navigator.onLine;
        document.body.setAttribute('data-connection', isOnline ? 'online' : 'offline');
        window.dispatchEvent(new CustomEvent('connection-status-changed', { detail: { online: isOnline } }));
    };
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    updateOnlineStatus(); // Initial run

    console.log("%c GeoAtlas %c Modern OSM Experience with React ", "background: #6366f1; color: #fff; padding: 5px; border-radius: 5px 0 0 5px;", "background: #f1f5f9; color: #1e293b; padding: 5px; border-radius: 0 5px 5px 0;");
});
