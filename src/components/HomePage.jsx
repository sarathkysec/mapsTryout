import React from 'react';
import FloatingSearch from './FloatingSearch.jsx';

const travelCards = [
    {
        emoji: '🗼',
        title: 'Paris, France',
        tag: 'Romantic Getaway',
        desc: 'The City of Light awaits — from the Eiffel Tower to cozy café-lined boulevards.',
        color: '#f59e0b',
    },
    {
        emoji: '🏯',
        title: 'Kyoto, Japan',
        tag: 'Cultural Escape',
        desc: 'Ancient temples, bamboo forests, and cherry blossoms in perfect harmony.',
        color: '#6366f1',
    },
    {
        emoji: '🏖️',
        title: 'Bali, Indonesia',
        tag: 'Tropical Paradise',
        desc: 'Endless rice terraces, surf beaches, and serene Hindu temples await you.',
        color: '#10b981',
    },
    {
        emoji: '🏔️',
        title: 'Patagonia, Argentina',
        tag: 'Wild Adventure',
        desc: 'Glaciers, jagged peaks, and pristine wilderness at the edge of the world.',
        color: '#ef4444',
    },
];

const tips = [
    { icon: '🧳', text: 'Pack light — one carry-on saves hours at airports.' },
    { icon: '🗺️', text: 'Download offline maps before leaving home.' },
    { icon: '💳', text: 'Notify your bank before international trips.' },
    { icon: '📸', text: 'Explore local streets — the best spots are off the beaten path.' },
];

const HomePage = ({ onMenuToggle }) => {
    React.useEffect(() => {
        if (window.lucide) lucide.createIcons();
        // Invalidate Leaflet map size after layout shift
        setTimeout(() => {
            if (window.map) window.map.invalidateSize();
        }, 350);
    }, []);

    return (
        <div className="home-page">
            {/* Search bar pinned over the map */}
            <div className="home-search-wrapper">
                <FloatingSearch onMenuToggle={onMenuToggle} />
            </div>

            {/* Travel Content Section */}
            <div className="home-content">
                <div className="home-section-header">
                    <h2>✈️ Explore the World</h2>
                    <p>Handpicked destinations and travel tips to inspire your next journey.</p>
                </div>

                <div className="travel-cards-grid">
                    {travelCards.map((card, i) => (
                        <div key={i} className="travel-card" style={{ '--card-accent': card.color }}>
                            <div className="travel-card-emoji">{card.emoji}</div>
                            <div className="travel-card-body">
                                <span className="travel-tag">{card.tag}</span>
                                <h3>{card.title}</h3>
                                <p>{card.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="travel-tips-section">
                    <h3>🧭 Travel Tips</h3>
                    <div className="tips-grid">
                        {tips.map((tip, i) => (
                            <div key={i} className="tip-card">
                                <span className="tip-icon">{tip.icon}</span>
                                <span>{tip.text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="home-footer-note">
                    <i data-lucide="map-pin"></i>
                    <span>Tap anywhere on the map above to explore a location.</span>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
