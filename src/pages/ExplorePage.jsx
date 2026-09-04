import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNativeState } from 'native-state-react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import './ExplorePage.css';

const PLACES = [
    {
        id: 'kiyomizu',
        title: 'Kiyomizu-dera',
        category: 'Culture',
        badge: 'MUST SEE',
        dist: '0.8 km',
        desc: 'Historic temple with sweeping city views and scenic gardens.',
        rating: '4.9',
        lat: 34.9949,
        lng: 135.7850,
        img: '/assets/wanderlust_tokyo.png'
    },
    {
        id: 'tea-ceremony',
        title: 'Traditional Tea Ceremony',
        category: 'Activities',
        badge: 'EXPERIENCE',
        dist: '1.2 km',
        desc: 'Immerse yourself in a historic Japanese ritual.',
        rating: '$$',
        lat: 35.0037,
        lng: 135.7772,
        img: '/assets/amalfi_coast_night.png'
    },
    {
        id: 'arashiyama',
        title: 'Arashiyama Bamboo',
        category: 'Activities',
        badge: 'MUST SEE',
        dist: '3.5 km',
        desc: 'Iconic bamboo forest trail in western Kyoto.',
        rating: '4.8',
        lat: 35.0170,
        lng: 135.6713,
        img: '/assets/wanderlust_roadtrip.png'
    },
    {
        id: 'fushimi-inari',
        title: 'Fushimi Inari Shrine',
        category: 'Culture',
        badge: 'MUST SEE',
        dist: '2.1 km',
        desc: 'Famous shrine with thousands of vermilion torii gates.',
        rating: '4.9',
        lat: 34.9671,
        lng: 135.7727,
        img: '/assets/wanderlust_venice.png'
    }
];

const ExplorePage = () => {
    const navigate = useNavigate();
    const [activeCategory, setActiveCategory] = useNativeState('state.exploreCategory', 'Activities');
    const [favorites, setFavorites] = useNativeState('state.exploreFavorites', []);

    useEffect(() => {
        if (window.lucide) window.lucide.createIcons();

        // Center existing map on Kyoto
        if (window.map) {
            window.map.setView([35.0116, 135.7681], 13);
            setTimeout(() => {
                if (window.map) window.map.invalidateSize();
            }, 300);

            // Render glowing markers on map
            if (window.L && window.markerGroup) {
                window.markerGroup.clearLayers();
                PLACES.forEach(place => {
                    const icon = window.L.divIcon({
                        className: 'wl-explore-marker',
                        html: `<div class="wl-marker-glow"><i data-lucide="${place.category === 'Dining' ? 'utensils' : 'landmark'}" style="width:20px;height:20px"></i></div>`,
                        iconSize: [44, 44],
                        iconAnchor: [22, 22]
                    });
                    const marker = window.L.marker([place.lat, place.lng], { icon });
                    marker.addTo(window.markerGroup);
                });
                if (window.lucide) window.lucide.createIcons();
            }
        }

        return () => {
            if (window.markerGroup) window.markerGroup.clearLayers();
        };
    }, []);

    const toggleFav = (id, e) => {
        e.stopPropagation();
        setFavorites(prev => (prev || []).includes(id) ? (prev || []).filter(item => item !== id) : [...(prev || []), id]);
    };

    const handleCardClick = (place) => {
        if (window.map) {
            window.map.flyTo([place.lat, place.lng], 15, { duration: 1.2 });
        }
    };

    return (
        <div className="wl-explore-page">
            {/* Top section: Header, Search & Category Filters */}
            <div className="wl-explore-top">
                <Header
                    opacity={0.25}
                    avatarUrl="/assets/wanderlust_avatar.png"
                    onAvatarClick={() => navigate('/profile')}
                    onNotificationClick={() => navigate('/playground')}
                />
                <div className="wl-explore-search-row">
                    <div className="wl-explore-search-bar">
                        <i data-lucide="search"></i>
                        <input type="text" placeholder="Search places, activities..." />
                    </div>
                    <button className="wl-explore-filter-btn">
                        <i data-lucide="sliders-horizontal"></i>
                    </button>
                </div>
                <div className="wl-explore-chips">
                    {[
                        { label: 'Activities', icon: 'ticket' },
                        { label: 'Dining', icon: 'utensils' },
                        { label: 'Culture', icon: 'landmark' }
                    ].map(chip => (
                        <button
                            key={chip.label}
                            className={`wl-chip ${activeCategory === chip.label ? 'active' : ''}`}
                            onClick={() => setActiveCategory(chip.label)}
                        >
                            <i data-lucide={chip.icon}></i>
                            <span>{chip.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Bottom section: "What's around you" Carousel & Navigation */}
            <div className="wl-explore-bottom">
                <div className="wl-explore-header-group">
                    <h2 className="wl-explore-title">What's around </h2>
                    <div className="wl-explore-sub">
                        <i data-lucide="navigation" style={{ width: 14, height: 14 }}></i>
                        <span>Near Kyoto City Center</span>
                    </div>
                </div>

                <div className="wl-explore-carousel">
                    {PLACES.map(place => (
                        <div
                            key={place.id}
                            className="wl-explore-card"
                            style={{ backgroundImage: `url(${place.img})` }}
                            onClick={() => handleCardClick(place)}
                        >
                            <button className="wl-card-heart-btn" onClick={(e) => toggleFav(place.id, e)}>
                                <i data-lucide="heart" style={{ fill: (favorites || []).includes(place.id) ? '#ef4444' : 'none', color: (favorites || []).includes(place.id) ? '#ef4444' : '#fff' }}></i>
                            </button>

                            <div className="wl-card-overlay">
                                <div className="wl-card-badges">
                                    <span className="wl-badge-mustsee">{place.badge}</span>
                                    <span className="wl-badge-dist">{place.dist}</span>
                                </div>
                                <h3 className="wl-card-title">{place.title}</h3>
                                <p className="wl-card-desc">{place.desc}</p>
                                <div className="wl-card-footer">
                                    <div className="wl-card-rating">
                                        <i data-lucide="star" style={{ width: 14, height: 14, fill: '#facc15' }}></i>
                                        <span>{place.rating}</span>
                                    </div>
                                    <button className="wl-card-nav-btn" title="Navigate" onClick={(e) => { e.stopPropagation(); handleCardClick(place); }}>
                                        <i data-lucide="arrow-up-right" style={{ width: 18, height: 18 }}></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <BottomNav active="explore" />
        </div>
    );
};

export default ExplorePage;
