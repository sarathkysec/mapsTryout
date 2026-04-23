import React from 'react';
import L from 'leaflet';

const CustomControls = () => {

    const handleZoomIn = () => {
        if (window.map) {
            window.map.zoomIn();
        }
    };

    const handleZoomOut = () => {
        if (window.map) {
            window.map.zoomOut();
        }
    };

    const dotIcon = L.divIcon({ className: '', html: '<div class="my-location-dot"></div>', iconSize: [14, 14], iconAnchor: [7, 7] });

    const showDot = (lat, lng, zoom) => {
        if (window._myLocMarker) window.map.removeLayer(window._myLocMarker);
        window.map.setView([lat, lng], zoom);
        window._myLocMarker = L.marker([lat, lng], { icon: dotIcon, interactive: false }).addTo(window.map);
    };

    const locateViaIP = async () => {
        try {
            const res = await fetch('http://ip-api.com/json/?fields=lat,lon,city');
            const data = await res.json();
            if (data.lat && data.lon) showDot(data.lat, data.lon, 13);
        } catch { /* silently fail */ }
    };

    const handleLocateMe = () => {
        if (!window.map) return;
        if (!navigator.geolocation) return locateViaIP();
        navigator.geolocation.getCurrentPosition(
            (pos) => showDot(pos.coords.latitude, pos.coords.longitude, 16),
            () => locateViaIP(),
            { timeout: 5000 }
        );
    };

    return (
        <div className="custom-controls">
            <button className="control-btn" id="zoom-in" title="Zoom In" onClick={handleZoomIn}>
                <i data-lucide="plus"></i>
            </button>
            <button className="control-btn" id="zoom-out" title="Zoom Out" onClick={handleZoomOut}>
                <i data-lucide="minus"></i>
            </button>
            <button className="control-btn" id="locate-me" title="My Location" onClick={handleLocateMe}>
                <i data-lucide="navigation"></i>
            </button>
        </div>
    );
};

export default CustomControls;
