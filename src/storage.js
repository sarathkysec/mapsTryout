// Storage Management for Saved Places
const STORAGE_KEY = 'geoAtlas_saved_places';

export function getSavedPlaces() {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
}

export function savePlace(place, listName = 'Want to visit') {
    const saved = getSavedPlaces();

    // Check if already saved
    const existingIndex = saved.findIndex(p => p.lat === place.lat && p.lng === place.lng);

    if (existingIndex > -1) {
        // Update existing entry's list
        saved[existingIndex].list = listName;
    } else {
        // Add new entry
        saved.push({
            ...place,
            list: listName,
            savedAt: new Date().toISOString(),
            visited: false
        });
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    window.dispatchEvent(new CustomEvent('saved-places-updated', { detail: saved }));
    return saved;
}

export function removePlace(lat, lng) {
    let saved = getSavedPlaces();
    saved = saved.filter(p => !(p.lat === lat && p.lng === lng));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    window.dispatchEvent(new CustomEvent('saved-places-updated', { detail: saved }));
    return saved;
}

export function toggleVisited(lat, lng) {
    const saved = getSavedPlaces();
    const index = saved.findIndex(p => p.lat === lat && p.lng === lng);

    if (index > -1) {
        saved[index].visited = !saved[index].visited;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
        window.dispatchEvent(new CustomEvent('saved-places-updated', { detail: saved }));
    }
    return saved;
}

export function isPlaceSaved(lat, lng) {
    const saved = getSavedPlaces();
    // Use a small epsilon for float comparison to handle precision issues
    const epsilon = 0.0001;
    return saved.find(p =>
        Math.abs(p.lat - lat) < epsilon &&
        Math.abs(p.lng - lng) < epsilon
    );
}
