// PlaceDetailsCard Component
const PlaceDetailsCard = () => {
    const [placeData, setPlaceData] = React.useState(null);
    const [isVisible, setIsVisible] = React.useState(false);
    const [isVisited, setIsVisited] = React.useState(false);
    const [showSaveOptions, setShowSaveOptions] = React.useState(false);
    const [savedList, setSavedList] = React.useState(null);
    const [user, setUser] = React.useState(null);

    const saveOptionsRef = React.useRef(null);

    React.useEffect(() => {
        // Initial auth check
        const cachedUser = localStorage.getItem('geoUser');
        if (cachedUser) setUser(JSON.parse(cachedUser));

        // Listen for auth changes
        const handleAuthChange = (e) => {
            setUser(e.detail);
            if (!e.detail) {
                setIsVisible(false);
                setPlaceData(null);
            }
        };
        window.addEventListener('auth-state-changed', handleAuthChange);

        return () => window.removeEventListener('auth-state-changed', handleAuthChange);
    }, []);

    React.useEffect(() => {
        const handlePlaceSelected = async (e) => {
            const data = e.detail;
            setPlaceData(data);
            setIsVisible(true);

            // Check if place is already saved/visited (only if user logged in)
            if (localStorage.getItem('geoUser')) {
                const { isPlaceSaved } = await import('/src/storage.js');
                // Ensure coordinates are numbers for comparison
                const lat = parseFloat(data.lat);
                const lng = parseFloat(data.lng);

                const saved = isPlaceSaved(lat, lng);
                if (saved) {
                    setSavedList(saved.list);
                    setIsVisited(saved.visited);
                } else {
                    setSavedList(null);
                    setIsVisited(false);
                }
            } else {
                setSavedList(null);
                setIsVisited(false);
            }
            setShowSaveOptions(false);
        };

        const handlePlaceDetailsClosed = () => {
            setIsVisible(false);
        };

        window.addEventListener('place-selected', handlePlaceSelected);
        window.addEventListener('place-details-closed', handlePlaceDetailsClosed);

        return () => {
            window.removeEventListener('place-selected', handlePlaceSelected);
            window.removeEventListener('place-details-closed', handlePlaceDetailsClosed);
        };
    }, [user]); // Re-run if user changes

    React.useEffect(() => {
        const handleClickOutside = (e) => {
            if (saveOptionsRef.current && !saveOptionsRef.current.contains(e.target)) {
                setShowSaveOptions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    React.useEffect(() => {
        if (window.lucide) lucide.createIcons();
    }, [placeData, isVisited, savedList, showSaveOptions]);

    const handleClose = () => {
        setIsVisible(false);
        window.dispatchEvent(new CustomEvent('place-details-closed'));
    };

    const checkLogin = () => {
        if (!user) {
            window.dispatchEvent(new CustomEvent('request-login'));
            return false;
        }
        return true;
    };

    const handleVisitedToggle = async () => {
        if (!checkLogin()) return;

        const newStatus = !isVisited;
        setIsVisited(newStatus);

        const { toggleVisited, savePlace, isPlaceSaved } = await import('/src/storage.js');
        const saved = isPlaceSaved(placeData.lat, placeData.lng);

        if (saved) {
            toggleVisited(placeData.lat, placeData.lng);
        } else {
            // Auto-save if marked visited
            savePlace(placeData, 'Want to visit');
            toggleVisited(placeData.lat, placeData.lng);
            setSavedList('Want to visit');
        }
    };

    const handleSaveClick = () => {
        if (!checkLogin()) return;
        setShowSaveOptions(!showSaveOptions);
    };

    const handleSaveToList = async (listName) => {
        if (!checkLogin()) return; // Should be covered by parent, but safety first
        const { savePlace } = await import('/src/storage.js');
        savePlace(placeData, listName);
        setSavedList(listName);
        setShowSaveOptions(false);
    };

    const handleShare = () => {
        const gmapsUrl = `https://www.google.com/maps?q=${placeData.lat},${placeData.lng}`;

        if (navigator.share) {
            navigator.share({
                title: placeData.name || 'Check out this place',
                text: placeData.display_name,
                url: gmapsUrl
            }).catch(console.error);
        } else {
            navigator.clipboard.writeText(gmapsUrl);
            alert('Google Maps link copied to clipboard!');
        }
    };

    if (!placeData) return null;

    const name = placeData.loading ? 'Searching...'
        : placeData.error ? 'Location Info'
            : placeData.name || placeData.display_name?.split(',')[0] || 'Location';

    const address = placeData.display_name || 'Loading address...';

    return (
        <div id="place-details" className={`place-details-card ${isVisible ? 'active' : ''}`}>
            <div className="place-details-content">
                <div className="place-header">
                    <h2 id="place-name"><span className="place-address inline">{"Near "}</span>{name}</h2>
                    <button id="close-details" className="icon-btn-small" onClick={handleClose}>
                        <i data-lucide="x"></i>
                    </button>
                </div>
                <p id="place-address" className="place-address">{address}</p>
                <div className="place-actions">
                    <button
                        className={`action-btn ${isVisited ? 'visited' : ''}`}
                        title="Mark as Visited"
                        onClick={handleVisitedToggle}
                    >
                        <i data-lucide={isVisited ? "check-circle-2" : "check-circle"}></i>
                        <span>Visited</span>
                    </button>

                    <div className="save-container" ref={saveOptionsRef}>
                        <button
                            className={`action-btn ${savedList ? 'saved' : ''}`}
                            title="Save Place"
                            onClick={handleSaveClick}
                        >
                            <i data-lucide="bookmark" fill={savedList ? "currentColor" : "none"}></i>
                            <span>{savedList || 'Save'}</span>
                        </button>

                        {showSaveOptions && (
                            <div className="save-options-dropdown">
                                <button onClick={() => handleSaveToList('Want to visit')}>
                                    <i data-lucide="clock"></i> Want to visit
                                </button>
                                <button onClick={() => handleSaveToList('Bucket list')}>
                                    <i data-lucide="star"></i> Bucket list
                                </button>
                            </div>
                        )}
                    </div>

                    <button className="action-btn" title="Share" onClick={handleShare}>
                        <i data-lucide="share-2"></i>
                        <span>Share</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

window.PlaceDetailsCard = PlaceDetailsCard;
