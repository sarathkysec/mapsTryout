import { flyToLocation } from './map.js';
import { SEARCH_API, REVERSE_GEO_API } from './config.js';

let localData = {
    cities: [],
    landmarks: [],
    loaded: false
};

export async function loadLocalData() {
    if (localData.loaded) return;

    try {
        const [citiesRes, touristRes] = await Promise.all([
            fetch('/assets/data/ne_110m_populated_places.json'),
            fetch('/assets/data/tourist_places.json')
        ]);
        
        const citiesGeoJson = await citiesRes.json();
        const touristPlaces = await touristRes.json();

        localData.cities = citiesGeoJson.features || [];
        localData.landmarks = touristPlaces;

        localData.loaded = true;
    } catch (error) {
        console.warn('Failed to load local search data:', error);
    }
}

function searchLocalData(query) {
    if (!localData.loaded) return [];

    const normalizedQuery = query.toLowerCase().trim();
    if (normalizedQuery.length < 2) return [];

    const results = [];

    // Search Landmarks
    localData.landmarks.forEach(place => {
        if (place.name.toLowerCase().includes(normalizedQuery) ||
            place.city.toLowerCase().includes(normalizedQuery)) {

            results.push({
                display_name: `${place.name}, ${place.city}, ${place.country}`,
                lat: place.lat,
                lon: place.lng,
                type: place.type,
                isLocal: true,
                details: {
                    address: {
                        attraction: place.name,
                        city: place.city,
                        country: place.country
                    }
                }
            });
        }
    });

    // Search Cities
    localData.cities.forEach(feature => {
        const props = feature.properties;
        const name = props.NAME || props.NAME_EN;
        const region = props.ADM1NAME;
        const country = props.ADM0NAME;

        if (name && name.toLowerCase().includes(normalizedQuery)) {
            const [lon, lat] = feature.geometry.coordinates;

            results.push({
                display_name: `${name}, ${region ? region + ', ' : ''}${country}`,
                lat: lat,
                lon: lon,
                type: 'City',
                isLocal: true,
                details: {
                    address: {
                        city: name,
                        state: region,
                        country: country
                    }
                }
            });
        }
    });

    return results.slice(0, 5);
}

// Global debouncing timer
let debounceTimer;

export async function performSearch(query, searchBtn, dropdown, callback) {
    if (!query) {
        if (dropdown) {
            dropdown.innerHTML = '';
            dropdown.classList.remove('active');
        }
        if (callback) callback([]);
        return;
    }

    // Lazy load data
    await loadLocalData();

    const localResults = searchLocalData(query);

    if (localResults.length > 0) {
        if (dropdown) displayResults(localResults, dropdown);
        if (callback) callback(localResults);
        return;
    }

    // Debounce API calls for external search
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
        // Show searching state only if we really go to network
        if (dropdown) {
            dropdown.innerHTML = '<div style="padding:12px; color:var(--text-muted)">Searching...</div>';
            dropdown.classList.add('active');
        }

        try {
            // Photon API: https://photon.komoot.io/api/?q=berlin&limit=5
            const response = await fetch(`${SEARCH_API}?q=${encodeURIComponent(query)}&limit=5`);

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();

            // Normalize Photon GeoJSON to our result format
            const normalizedResults = data.features.map(feature => {
                const props = feature.properties;
                const name = props.name;
                const extra = [props.city, props.state, props.country].filter(Boolean).join(', ');

                return {
                    display_name: `${name}, ${extra}`,
                    lat: feature.geometry.coordinates[1],
                    lon: feature.geometry.coordinates[0],
                    type: props.osm_value || 'location',
                    isLocal: false,
                    details: {
                        address: {
                            city: props.city,
                            state: props.state,
                            country: props.country,
                            postcode: props.postcode
                        }
                    }
                };
            });

            if (dropdown) displayResults(normalizedResults, dropdown);
            if (callback) callback(normalizedResults);
        } catch (error) {
            console.error("Search failed:", error);
            if (dropdown) {
                dropdown.innerHTML = '<div style="padding:12px; color:#ef4444">No results found (Network Error).</div>';
            }
            if (callback) callback([]);
        }
    }, 500); // 500ms debounce
}

function displayResults(results, container) {
    container.innerHTML = '';

    if (results.length === 0) {
        container.innerHTML = '<div style="padding:12px; color:var(--text-muted)">No results found.</div>';
        return;
    }

    container.classList.add('active');

    results.forEach(result => {
        const div = document.createElement('div');
        div.className = 'search-result-item';

        const badge = result.isLocal ? `<span style="font-size: 0.7em; background: var(--primary); color: white; padding: 2px 4px; border-radius: 4px; margin-left: auto;">Offline</span>` : '';

        div.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
                <div>
                    <strong>${result.display_name.split(',')[0]}</strong>
                    <br>
                    <span style="font-size: 0.85em; opacity: 0.8;">${result.display_name.split(',').slice(1).join(',')}</span>
                </div>
                ${badge}
            </div>
        `;

        div.addEventListener('click', async () => {
            const lat = parseFloat(result.lat);
            const lon = parseFloat(result.lon);
            
            // Pass the full result data to prevent reverse-geocoding overwrite
            const placeData = {
                lat: lat,
                lng: lon,
                display_name: result.display_name,
                name: result.display_name.split(',')[0],
                address: result.details?.address,
                type: result.type
            };
            
            flyToLocation(lat, lon, 15, placeData);

            // Hide dropdown
            container.classList.remove('active');
            container.innerHTML = '';

            // For Photon results, we already have good data in `result`
            // But we can optionally fetch more details if needed. 
            // For now, let's use what we have to be fast.

            window.dispatchEvent(new CustomEvent('place-selected', {
                detail: {
                    lat: lat,
                    lng: lon, // normalize to lng
                    display_name: result.display_name,
                    name: result.display_name.split(',')[0],
                    address: result.details?.address,
                    type: result.type
                }
            }));
        });
        container.appendChild(div);
    });
}
