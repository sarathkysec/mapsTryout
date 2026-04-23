// Sidebar Component
const Sidebar = ({ isOpen, onClose, onThemeToggle }) => {

    const [view, setView] = React.useState('explore'); // 'explore' or 'saved'
    const [savedPlaces, setSavedPlaces] = React.useState([]);

    const featuredLocations = [
        { name: 'Bengaluru, India', desc: 'Silicon Valley of India', lat: 12.9716, lon: 77.5946 },
        { name: 'Berlin, Germany', desc: 'Capital of Culture', lat: 52.5200, lon: 13.4050 },
        { name: 'Moscow, Russia', desc: 'Historic Red Square', lat: 55.7558, lon: 37.6173 },
        { name: 'Manila, Philippines', desc: 'Pearl of the Orient', lat: 14.5995, lon: 120.9842 }
    ];

    React.useEffect(() => {
        // Initial load
        const loadStyles = async () => {
            const { getSavedPlaces } = await import('/src/storage.js');
            setSavedPlaces(getSavedPlaces());
        };
        loadStyles();

        // Listen for updates
        const handleUpdate = (e) => setSavedPlaces(e.detail);
        window.addEventListener('saved-places-updated', handleUpdate);
        return () => window.removeEventListener('saved-places-updated', handleUpdate);
    }, []);

    const handleLocationClick = (lat, lon, placeData = null) => {
        if (window.flyToLocation) {
            window.flyToLocation(lat, lon);
        }
        if (placeData) {
            window.dispatchEvent(new CustomEvent('place-selected', { detail: placeData }));
        }
        if (window.innerWidth < 768) onClose(); // Close on mobile
    };

    const sidebarRef = React.useRef(null);

    React.useEffect(() => {
        const handleClickOutside = (event) => {
            // If sidebar is open, and click is NOT inside sidebar, and NOT on the menu toggle button
            if (isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target) && !event.target.closest('#menu-toggle')) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    React.useEffect(() => {
        if (window.lucide) lucide.createIcons();
    }, [view, savedPlaces, isOpen]);

    return (
        <aside ref={sidebarRef} className={`info-sidebar ${isOpen ? 'active' : ''}`} id="sidebar">
            <div className="sidebar-header">
                <div className="logo">
                    <i data-lucide="map-pin"></i>
                    <span>GeoAtlas</span>
                </div>
                <button id="close-sidebar" className="icon-btn" onClick={onClose}>
                    <i data-lucide="x"></i>
                </button>
            </div>

            <div className="sidebar-content">
                <div className="user-profile-section">
                    <div className="user-actions-sidebar">
                        <button className="icon-btn" id="theme-toggle" title="Toggle Theme" onClick={onThemeToggle}>
                            <i data-lucide="moon"></i>
                        </button>
                        <button
                            className={`icon-btn ${view === 'saved' ? 'active' : ''}`}
                            title="Saved Places"
                            onClick={() => setView(view === 'saved' ? 'explore' : 'saved')}
                        >
                            <i data-lucide="bookmark" fill={view === 'saved' ? "currentColor" : "none"}></i>
                        </button>
                        <button className="icon-btn" title="Settings">
                            <i data-lucide="settings"></i>
                        </button>
                    </div>
                </div>

                {view === 'explore' ? (
                    <>
                        <div className="welcome-section">
                            <h1>Explore the World</h1>
                            <p>Experience OpenStreetMap with a premium interface. Search, save, and discover new places.</p>
                        </div>

                        <div className="featured-locations">
                            <h3>Featured Locations</h3>
                            {featuredLocations.map((loc, idx) => (
                                <div
                                    key={idx}
                                    className="location-card"
                                    onClick={() => handleLocationClick(loc.lat, loc.lon, {
                                        lat: loc.lat,
                                        lng: loc.lon,
                                        name: loc.name,
                                        display_name: loc.desc
                                    })}
                                >
                                    <div className="location-info">
                                        <strong>{loc.name}</strong>
                                        <span>{loc.desc}</span>
                                    </div>
                                    <i data-lucide="chevron-right"></i>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="saved-places-view">
                        <button className="back-btn" onClick={() => setView('explore')}>
                            <i data-lucide="arrow-left"></i> Back to Explore
                        </button>

                        <h3>Your Saved Places</h3>
                        {savedPlaces.length === 0 ? (
                            <p style={{ marginTop: '20px', textAlign: 'center' }}>No saved places yet. Explore the map to save your favorite spots!</p>
                        ) : (
                            <div className="saved-places-list">
                                {savedPlaces.map((place, idx) => (
                                    <div
                                        key={idx}
                                        className="saved-place-item"
                                        onClick={() => handleLocationClick(place.lat, place.lng, place)}
                                    >
                                        <div className="saved-place-icon">
                                            <i data-lucide={place.list === 'Bucket list' ? 'star' : 'bookmark'}></i>
                                        </div>
                                        <div className="saved-place-info">
                                            <strong>{place.name || place.display_name?.split(',')[0]}</strong>
                                            <span>{place.list} • {place.visited ? 'Visited' : 'Not visited'}</span>
                                        </div>
                                        <i data-lucide="chevron-right"></i>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </aside>
    );
};

window.Sidebar = Sidebar;
