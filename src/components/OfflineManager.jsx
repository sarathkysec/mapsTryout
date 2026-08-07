import React from 'react';

function latLngToTile(lat, lng, zoom) {
    const x = Math.floor((lng + 180) / 360 * Math.pow(2, zoom));
    const y = Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom));
    return { x, y };
}

function getTileCountInBounds(bounds, minZ, maxZ) {
    let count = 0;
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();

    for (let z = minZ; z <= maxZ; z++) {
        const tileSW = latLngToTile(sw.lat, sw.lng, z);
        const tileNE = latLngToTile(ne.lat, ne.lng, z);

        const xMin = Math.min(tileSW.x, tileNE.x);
        const xMax = Math.max(tileSW.x, tileNE.x);
        const yMin = Math.min(tileSW.y, tileNE.y);
        const yMax = Math.max(tileSW.y, tileNE.y);

        count += (xMax - xMin + 1) * (yMax - yMin + 1);
    }
    return count;
}

const OfflineManager = () => {
    const [isOnline, setIsOnline] = React.useState(navigator.onLine);
    const [regions, setRegions] = React.useState([]);
    const [regionName, setRegionName] = React.useState('');
    const [estimate, setEstimate] = React.useState({ count: 0, center: [0, 0], zoom: 3, bounds: null });
    const [isDownloading, setIsDownloading] = React.useState(false);
    const [downloadedCount, setDownloadedCount] = React.useState(0);
    const [downloadProgress, setDownloadProgress] = React.useState(0);
    const cancelRef = React.useRef(false);

    React.useEffect(() => {
        const handleStatus = (e) => setIsOnline(e.detail.online);
        window.addEventListener('connection-status-changed', handleStatus);

        const stored = localStorage.getItem('geoatlas-offline-regions');
        if (stored) setRegions(JSON.parse(stored));

        return () => window.removeEventListener('connection-status-changed', handleStatus);
    }, []);

    React.useEffect(() => {
        if (!window.map) return;
        const updateEstimation = () => {
            const map = window.map;
            const bounds = map.getBounds();
            const z = map.getZoom();
            const maxZ = Math.min(z + 2, 16);//map.getMaxZoom() || 20;
            const count = getTileCountInBounds(bounds, z, maxZ);
            setEstimate({
                count,
                bounds: [[bounds.getSouthWest().lat, bounds.getSouthWest().lng], [bounds.getNorthEast().lat, bounds.getNorthEast().lng]],
                center: [map.getCenter().lat, map.getCenter().lng],
                zoom: z,
                maxZ
            });
        };
        updateEstimation();
        window.map.on('moveend', updateEstimation);
        window.map.on('zoomend', updateEstimation);
        return () => {
            if (window.map) {
                window.map.off('moveend', updateEstimation);
                window.map.off('zoomend', updateEstimation);
            }
        };
    }, []);

    const startDownload = async () => {
        setIsDownloading(true);
        setDownloadProgress(0);
        setDownloadedCount(0);
        cancelRef.current = false;

        const bounds = window.map.getBounds();
        const sw = bounds.getSouthWest();
        const ne = bounds.getNorthEast();
        const minZ = estimate.zoom;
        const maxZ = estimate.maxZ;
        const totalTiles = estimate.count;

        try {
            const cache = await caches.open('geoatlas-tiles-v1');
            let successCount = 0;

            for (let z = minZ; z <= maxZ; z++) {
                if (cancelRef.current) break;
                const tileSW = latLngToTile(sw.lat, sw.lng, z);
                const tileNE = latLngToTile(ne.lat, ne.lng, z);

                const xMin = Math.min(tileSW.x, tileNE.x);
                const xMax = Math.max(tileSW.x, tileNE.x);
                const yMin = Math.min(tileSW.y, tileNE.y);
                const yMax = Math.max(tileSW.y, tileNE.y);

                for (let x = xMin; x <= xMax; x++) {
                    if (cancelRef.current) break;
                    for (let y = yMin; y <= yMax; y++) {
                        if (cancelRef.current) break;

                        const urls = [
                            `https://a.basemaps.cartocdn.com/rastertiles/voyager/${z}/${x}/${y}.png`,
                            `https://a.basemaps.cartocdn.com/rastertiles/dark_all/${z}/${x}/${y}.png`
                        ];

                        for (const url of urls) {
                            try {
                                const response = await fetch(url, { mode: 'cors' });
                                if (response.ok) {
                                    await cache.put(url, response);
                                }
                            } catch (e) {
                                console.warn('Tile fetch failed:', e);
                            }
                        }
                        successCount++;
                        setDownloadedCount(successCount);
                        if (totalTiles > 0) {
                            setDownloadProgress(Math.round((successCount / totalTiles) * 100));
                        }
                    }
                }
            }

            if (!cancelRef.current) {
                const newRegion = {
                    id: Date.now().toString(),
                    name: regionName.trim() || `Map Area (${estimate.center[0].toFixed(2)}, ${estimate.center[1].toFixed(2)})`,
                    center: estimate.center,
                    zoom: estimate.zoom,
                    maxZ: estimate.maxZ,
                    bounds: estimate.bounds,
                    tileCount: totalTiles,
                    date: new Date().toLocaleDateString()
                };
                const updated = [...regions, newRegion];
                setRegions(updated);
                localStorage.setItem('geoatlas-offline-regions', JSON.stringify(updated));
                setRegionName('');
            }
        } catch (error) {
            console.error('Download failed:', error);
        } finally {
            setIsDownloading(false);
        }
    };

    const cancelDownload = () => {
        cancelRef.current = true;
        setIsDownloading(false);
    };

    const deleteRegion = async (region) => {
        if (!window.confirm(`Delete "${region.name}" offline data?`)) return;
        try {
            const cache = await caches.open('geoatlas-tiles-v1');
            const keys = await cache.keys();
            for (const request of keys) {
                const url = request.url;
                const match = url.match(/\/voyager\/(\d+)\/(\d+)\/(\d+)/) || url.match(/\/dark_all\/(\d+)\/(\d+)\/(\d+)/);
                if (match) {
                    const z = parseInt(match[1]);
                    const x = parseInt(match[2]);
                    const y = parseInt(match[3]);
                    if (z >= region.zoom && z <= region.maxZ) {
                        const tileSW = latLngToTile(region.bounds[0][0], region.bounds[0][1], z);
                        const tileNE = latLngToTile(region.bounds[1][0], region.bounds[1][1], z);
                        const xMin = Math.min(tileSW.x, tileNE.x);
                        const xMax = Math.max(tileSW.x, tileNE.x);
                        const yMin = Math.min(tileSW.y, tileNE.y);
                        const yMax = Math.max(tileSW.y, tileNE.y);

                        if (x >= xMin && x <= xMax && y >= yMin && y <= yMax) {
                            await cache.delete(request);
                        }
                    }
                }
            }
            const updated = regions.filter(r => r.id !== region.id);
            setRegions(updated);
            localStorage.setItem('geoatlas-offline-regions', JSON.stringify(updated));
        } catch (error) {
            console.error('Delete failed:', error);
        }
    };

    const handleFlyTo = (region) => {
        if (window.flyToLocation) {
            window.flyToLocation(region.center[0], region.center[1], region.zoom);
        }
    };

    React.useEffect(() => {
        if (window.lucide) lucide.createIcons();
    }, [regions, isDownloading, isOnline]);

    return (
        <div className="offline-manager">
            {!isOnline && (
                <div className="offline-badge-alert">
                    <i data-lucide="wifi-off"></i>
                    <span>Currently Offline. Serving cached tiles.</span>
                </div>
            )}

            <div className="download-panel">
                <h4>Download Current View</h4>
                <div className="estimation-info">
                    <p>Zoom Levels: {estimate.zoom} to {estimate.maxZ}</p>
                    <p>Estimated Tiles: <strong>{estimate.count}</strong></p>
                </div>

                {estimate.count > 500 ? (
                    <div className="warning-text">Area too large! Zoom in to enable download.</div>
                ) : (
                    <div className="download-action-form">
                        <input
                            type="text"
                            placeholder="Name this area (e.g., Bengaluru Center)"
                            value={regionName}
                            onChange={(e) => setRegionName(e.target.value)}
                            disabled={isDownloading || !isOnline}
                            className="region-name-input"
                        />
                        {isDownloading ? (
                            <div className="progress-container">
                                <div className="progress-bar">
                                    <div className="progress-fill" style={{ width: `${downloadProgress}%` }}></div>
                                </div>
                                <div className="progress-text">
                                    <span>Downloading: {downloadProgress}% ({downloadedCount}/{estimate.count})</span>
                                    <button onClick={cancelDownload} className="cancel-btn">Cancel</button>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={startDownload}
                                disabled={!isOnline || estimate.count === 0}
                                className="download-btn-submit"
                            >
                                <i data-lucide="download"></i> Download Map Area
                            </button>
                        )}
                    </div>
                )}
            </div>

            <div className="saved-regions-list">
                <h4>Downloaded Regions</h4>
                {regions.length === 0 ? (
                    <p className="no-regions">No offline map areas downloaded yet.</p>
                ) : (
                    regions.map(region => (
                        <div key={region.id} className="region-item-card">
                            <div className="region-meta">
                                <strong>{region.name}</strong>
                                <span>{region.date} • {region.tileCount} tiles</span>
                            </div>
                            <div className="region-actions">
                                <button onClick={() => handleFlyTo(region)} className="action-icon-btn fly-to" title="Show on Map">
                                    <i data-lucide="external-link"></i>
                                </button>
                                <button onClick={() => deleteRegion(region)} className="action-icon-btn delete" title="Delete offline data">
                                    <i data-lucide="trash-2"></i>
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default OfflineManager;
