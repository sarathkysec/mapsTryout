import React from 'react';
import ProfileMenu from './ProfileMenu.jsx';

const FloatingSearch = ({ onSearchChange, onSearchClick, onMenuToggle }) => {
    const [searchQuery, setSearchQuery] = React.useState('');
    const [searchResults, setSearchResults] = React.useState([]);
    const [showDropdown, setShowDropdown] = React.useState(false);
    const [showProfileMenu, setShowProfileMenu] = React.useState(false);

    const searchInputRef = React.useRef(null);
    const searchDropdownRef = React.useRef(null);
    const profileMenuRef = React.useRef(null);

    React.useEffect(() => {
        // Handle click outside to close dropdowns
        const handleClickOutside = (e) => {
            if (searchDropdownRef.current &&
                !searchDropdownRef.current.contains(e.target) &&
                !searchInputRef.current?.contains(e.target)) {
                setShowDropdown(false);
            }
            if (profileMenuRef.current &&
                !profileMenuRef.current.contains(e.target)) {
                setShowProfileMenu(false);
            }
        };

        const handleRequestLogin = () => {
            // Use setTimeout to avoid race condition with handleClickOutside
            setTimeout(() => {
                setShowProfileMenu(true);
            }, 10);
        };

        document.addEventListener('click', handleClickOutside);
        window.addEventListener('request-login', handleRequestLogin);

        return () => {
            document.removeEventListener('click', handleClickOutside);
            window.removeEventListener('request-login', handleRequestLogin);
        };
    }, []);

    const handleSearchInput = async (e) => {
        const value = e.target.value;
        setSearchQuery(value);

        if (value.trim()) {
            // Import and call search function
            const { performSearch } = await import('/src/search.js');
            performSearch(value, null, null, (results) => {
                setSearchResults(results);
                setShowDropdown(results.length > 0);
            });
        } else {
            setSearchResults([]);
            setShowDropdown(false);
        }
    };

    const handleResultClick = (result) => {
        const placeData = {
            lat: result.lat,
            lng: result.lon,
            display_name: result.display_name,
            name: result.display_name.split(',')[0],
            address: result.details?.address,
            type: result.type
        };

        if (window.flyToLocation) {
            window.flyToLocation(parseFloat(result.lat), parseFloat(result.lon), 13, placeData);
        }

        window._placeCardOpen = true; // Sync toggle state 
        setShowDropdown(false);
        setSearchQuery(result.display_name); // Optional: update input
    };

    return (
        <div className="floating-search">
            <button id="menu-toggle" className="search-icon-btn" title="Menu" onClick={onMenuToggle}>
                <i data-lucide="menu"></i>
            </button>

            <input
                ref={searchInputRef}
                type="text"
                id="search-input"
                placeholder="Search GeoAtlas"
                value={searchQuery}
                onChange={handleSearchInput}
            />

            {showDropdown && (
                <div ref={searchDropdownRef} id="search-dropdown" className="search-dropdown active">
                    {searchResults.map((result, index) => (
                        <div
                            key={index}
                            className="search-result-item"
                            onClick={() => handleResultClick(result)}
                        >
                            <strong>{result.display_name.split(',')[0]}</strong>
                            <span>{result.display_name.split(',').slice(1).join(', ')}</span>
                        </div>
                    ))}
                </div>
            )}

            <div className="search-actions">
                <button id="search-btn" className="search-icon-btn" title="Search">
                    <i data-lucide="search"></i>
                </button>
                <div className="divider"></div>
                {/* <button className="search-icon-btn directions-btn" title="Directions">
                    <i data-lucide="navigation-2"></i>
                </button>
                <div className="divider"></div> */}

                <ProfileMenu
                    showMenu={showProfileMenu}
                    onToggle={() => setShowProfileMenu(!showProfileMenu)}
                    containerRef={profileMenuRef}
                />
            </div>
        </div>
    );
};

export default FloatingSearch;
