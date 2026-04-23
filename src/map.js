import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl,
    iconUrl,
    shadowUrl,
});

import { LIGHT_TILES, DARK_TILES, mapOptions, REVERSE_GEO_API } from './config.js';
import { getSavedPlaces } from './storage.js';

export let map;
export let tileLayer;
export let markerGroup;
export let savedPlacesGroup;
export let indiaBorderLayer;

export function initMap() {
    map = L.map('map', mapOptions);
    window.map = map; // Expose globally for modular access

    tileLayer = L.tileLayer(LIGHT_TILES, {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(map);

    markerGroup = L.layerGroup().addTo(map);
    savedPlacesGroup = L.layerGroup().addTo(map);

    // Initial load of borders and saved places
    loadIndiaBorders();
    renderSavedPlaces();

    // Map Click Listener for Place Details (toggle)
    map.on('click', async (e) => {
        const detailsCard = document.getElementById('place-details');
        if (detailsCard && detailsCard.classList.contains('active')) {
            markerGroup.clearLayers();
            window.dispatchEvent(new CustomEvent('place-details-closed'));
            return;
        }
        
        const { lat, lng } = e.latlng;
        window.dispatchEvent(new CustomEvent('place-selected', {
            detail: { loading: true, lat, lng, display_name: `Coordinates: ${lat.toFixed(4)}, ${lng.toFixed(4)}` }
        }));
        await fetchPlaceDetails(lat, lng);
    });

    // Listen for updates to saved places
    window.addEventListener('saved-places-updated', () => {
        renderSavedPlaces();
    });

    // Listen for place details closed
    window.addEventListener('place-details-closed', () => {
        if (markerGroup) markerGroup.clearLayers();
    });

    // Auto-locate user on load
    autoLocateUser();

    return { map, tileLayer, markerGroup, savedPlacesGroup };
}

function autoLocateUser() {
    const dotIcon = L.divIcon({ className: '', html: '<div class="my-location-dot"></div>', iconSize: [14, 14], iconAnchor: [7, 7] });
    const showDot = (lat, lng, zoom) => {
        if (window._myLocMarker) map.removeLayer(window._myLocMarker);
        map.setView([lat, lng], zoom);
        // window._myLocMarker = L.marker([lat, lng], { icon: dotIcon, interactive: false }).addTo(map);
    };
    const ipFallback = async () => {
        try {
            const res = await fetch('http://ip-api.com/json/?fields=lat,lon');
            const d = await res.json();
            if (d.lat && d.lon) showDot(d.lat, d.lon, 7);
        } catch { /* ignore */ }
    };
    ipFallback();
    // navigator.geolocation.getCurrentPosition(
    //     (pos) => showDot(pos.coords.latitude, pos.coords.longitude, 9),
    //     () => ipFallback(),
    //     { timeout: 5000 }
    // );
}

export function renderSavedPlaces() {
    if (!savedPlacesGroup) return;
    savedPlacesGroup.clearLayers();

    const saved = getSavedPlaces();

    saved.forEach(place => {
        const isVisited = place.visited;
        const listType = place.list; // 'Want to visit' or 'Bucket list'

        let iconType = 'bookmark';
        let iconColor = 'var(--primary)';
        let markerClass = 'saved-marker';

        if (isVisited) {
            iconType = 'check-circle';
            iconColor = '#10b981';
            markerClass += ' visited-marker';
        } else if (listType === 'Bucket list') {
            iconType = 'star';
            iconColor = '#f59e0b';
            markerClass += ' bucket-marker';
        }

        const icon = L.divIcon({
            className: markerClass,
            html: `<div class="marker-pin" style="--marker-color: ${iconColor}">
                    <i data-lucide="${iconType}"></i>
                   </div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 32]
        });

        const marker = L.marker([place.lat, place.lng], { icon })
            .on('click', (e) => {
                L.DomEvent.stopPropagation(e);
                window.dispatchEvent(new CustomEvent('place-selected', { detail: place }));
            });

        marker.addTo(savedPlacesGroup);
    });

    // Refresh icons
    if (window.lucide) lucide.createIcons();
}

async function fetchPlaceDetails(lat, lng) {
    try {
        markerGroup.clearLayers();
        L.marker([lat, lng]).addTo(markerGroup);

        // Usage: https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=...&longitude=...&localityLanguage=en
        const response = await fetch(`${REVERSE_GEO_API}?latitude=${lat}&longitude=${lng}&localityLanguage=en`);

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();

        // BigDataCloud structure is different from Nominatim
        // Construct a display name from available fields
        const components = [
            data.locality,
            data.principalSubdivision,
            data.countryName
        ].filter(Boolean);

        const displayName = components.length > 0 ? components.join(', ') : `Location at ${lat.toFixed(4)}, ${lng.toFixed(4)}`;

        // Normalize data structure for app.js to consume
        const normalizedData = {
            display_name: displayName,
            name: data.locality || data.principalSubdivision || "Unknown Location",
            lat: lat,
            lng: lng,
            address: {
                city: data.locality,
                state: data.principalSubdivision,
                country: data.countryName,
                postcode: data.postcode
            }
        };

        if (data) {
            window.dispatchEvent(new CustomEvent('place-selected', { detail: normalizedData }));
        }
    } catch (err) {
        console.warn("Failed to fetch place details:", err);
        // Dispatch event with error flag so UI can stop "Searching..." state
        window.dispatchEvent(new CustomEvent('place-selected', {
            detail: {
                error: true,
                display_name: `Location at ${lat.toFixed(4)}, ${lng.toFixed(4)}`
            }
        }));
    }
}

async function loadIndiaBorders() {
    try {
        const response = await fetch('/assets/data/india-composite.json');
        const data = await response.json();

        indiaBorderLayer = L.geoJSON(data, {
            style: {
                color: document.body.getAttribute('data-theme') === 'dark' ? '#2a2b2e' : '#d4d1c9',
                weight: 0.8,
                opacity: 1,
                fillOpacity: 0
            }
        }).addTo(map);
    } catch (err) {
        console.warn("Failed to load custom border overlay:", err);
    }
}

export function flyToLocation(lat, lon, zoom = 13, placeData = null) {
    if (!map) return;
    map.flyTo([lat, lon], zoom, { duration: 1.5 });

    if (placeData) {
        markerGroup.clearLayers();
        L.marker([lat, lon]).addTo(markerGroup);
        window.dispatchEvent(new CustomEvent('place-selected', { detail: placeData }));
    } else {
        // Also fetch details for the flown-to location
        fetchPlaceDetails(lat, lon);
    }
}
