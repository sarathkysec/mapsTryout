// Festival Worker
// Reads docs/festivals.json at project start without performing any UI or output actions.

async function readFestivalsData() {
    try {
        const response = await fetch('/docs/festivals.json');
        if (response.ok) {
            const data = await response.json();
            // Data is read here as requested (no action taken)
            const _data = data;
        }
    } catch (err) {
        // Silent catch: just read, don't show or do anything
    }
}

// Execute immediately when worker starts
readFestivalsData();

// Service worker event handlers if registered as a Service Worker
if (typeof self !== 'undefined' && 'addEventListener' in self) {
    self.addEventListener('install', (event) => {
        if (typeof self.skipWaiting === 'function') {
            self.skipWaiting();
        }
        event.waitUntil(readFestivalsData());
    });

    self.addEventListener('activate', (event) => {
        if (typeof self.clients !== 'undefined' && typeof self.clients.claim === 'function') {
            event.waitUntil(self.clients.claim());
        }
    });
}
