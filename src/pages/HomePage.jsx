import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }, []);

    return (
        <div className="wl-page">
            {/* Header */}
            <header className="wl-header">
                <img src="/assets/wanderlust_avatar.png" alt="Profile" className="wl-avatar" />
                <h1 className="wl-title">Wanderlust</h1>
                <button className="wl-icon-btn" title="Notifications">
                    <i data-lucide="bell"></i>
                </button>
            </header>

            {/* Search Bar */}
            <div className="wl-search-bar">
                <i data-lucide="search" className="wl-search-icon"></i>
                <input type="text" placeholder="Where to?" className="wl-search-input" />
            </div>

            {/* Travel Stats */}
            <div className="wl-card wl-glass-card wl-stats-card">
                <div className="wl-stats-left">
                    <div className="wl-icon-circle wl-green-circle">
                        <i data-lucide="send"></i>
                    </div>
                    <div>
                        <div className="wl-card-heading">Travel Stats</div>
                        <div className="wl-card-sub">Level 5 Explorer</div>
                    </div>
                </div>
                <div className="wl-stats-right">
                    <span className="wl-stats-num">12</span>
                    <span className="wl-stats-lbl">COUNTRIES</span>
                </div>
            </div>

            {/* Travel Memories */}
            <div className="wl-card wl-memories-card" onClick={() => navigate('/map')}>
                <div className="wl-memories-top">
                    <div className="wl-memories-icon">
                        <i data-lucide="camera"></i>
                    </div>
                    <button className="wl-icon-btn-ghost">
                        <i data-lucide="external-link"></i>
                    </button>
                </div>
                <h2 className="wl-memories-title">Travel Memories</h2>
                <p className="wl-memories-sub">View your latest uploads</p>
            </div>

            {/* Friends' Travels */}
            <section className="wl-section">
                <div className="wl-section-title">
                    <i data-lucide="users"></i>
                    <span>Friends' Travels</span>
                </div>
                <div className="wl-scroll-row">
                    <div className="wl-card wl-glass-card wl-friend-card">
                        <div className="wl-friend-header">
                            <img src="/assets/wanderlust_avatar.png" alt="Alex" className="wl-friend-avatar" />
                            <span>Alex visited</span>
                        </div>
                        <div className="wl-friend-img-box">
                            <img src="/assets/wanderlust_paris.png" alt="Paris" className="wl-friend-img" />
                            <span className="wl-img-pill">Paris, France</span>
                        </div>
                    </div>
                    <div className="wl-card wl-glass-card wl-friend-card">
                        <div className="wl-friend-header">
                            <img src="/assets/wanderlust_avatar.png" alt="Sarah" className="wl-friend-avatar" />
                            <span>Sarah visited</span>
                        </div>
                        <div className="wl-friend-img-box">
                            <img src="/assets/wanderlust_venice.png" alt="Venice" className="wl-friend-img" />
                            <span className="wl-img-pill">Venice, Italy</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Travel Dispatches */}
            <section className="wl-section">
                <div className="wl-section-title">
                    <i data-lucide="file-text"></i>
                    <span>Travel Dispatches</span>
                </div>
                <div className="wl-dispatches-grid">
                    <div className="wl-card wl-dispatch-card" style={{ backgroundImage: `url('/assets/wanderlust_roadtrip.png')` }}>
                        <div className="wl-dispatch-overlay">
                            <span className="wl-badge-tag">STORY</span>
                            <h3 className="wl-dispatch-title">The Ultimate West Coast Road Trip</h3>
                        </div>
                    </div>
                    <div className="wl-card wl-dispatch-card wl-dispatch-tall" style={{ backgroundImage: `url('/assets/wanderlust_tokyo.png')` }}>
                        <div className="wl-dispatch-overlay">
                            <span className="wl-badge-tag">VIDEO EXPERIENCE</span>
                            <div className="wl-play-btn">
                                <i data-lucide="play"></i>
                            </div>
                            <div>
                                <h3 className="wl-dispatch-title">A Taste of Tokyo: Street Food Guide</h3>
                                <p className="wl-dispatch-desc">Join us as we explore the bustling alleys of Shinjuku and sample the best local...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Explore More */}
            <section className="wl-section">
                <div className="wl-section-title">
                    <i data-lucide="compass"></i>
                    <span>Explore More</span>
                </div>
                <div className="wl-explore-grid">
                    <div className="wl-card wl-glass-card wl-explore-card" onClick={() => navigate('/map')}>
                        <div className="wl-category-circle wl-amber">
                            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="13.5" cy="4" r="2" />
                                <path d="m9 20 2.5-7 2.5 3 2.5-3" />
                                <path d="M7 10.5 10 9l3.5 1.5L16 9" />
                                <path d="M17 12v9" />
                            </svg>
                        </div>
                        <span>Adventure</span>
                    </div>
                    <div className="wl-card wl-glass-card wl-explore-card" onClick={() => navigate('/map')}>
                        <div className="wl-category-circle wl-blue">
                            <i data-lucide="leaf"></i>
                        </div>
                        <span>Wellness</span>
                    </div>
                    <div className="wl-card wl-glass-card wl-explore-card" onClick={() => navigate('/map')}>
                        <div className="wl-category-circle wl-green">
                            <i data-lucide="utensils"></i>
                        </div>
                        <span>Culinary</span>
                    </div>
                    <div className="wl-card wl-glass-card wl-explore-card" onClick={() => navigate('/map')}>
                        <div className="wl-category-circle wl-red">
                            <i data-lucide="landmark"></i>
                        </div>
                        <span>Culture</span>
                    </div>
                </div>
            </section>

            {/* Bottom Nav Bar */}
            <nav className="wl-bottom-nav">
                <button className="wl-nav-item active">
                    <i data-lucide="home"></i>
                    <span>Home</span>
                </button>
                <button className="wl-nav-item" onClick={() => navigate('/map')}>
                    <i data-lucide="compass"></i>
                    <span>Explore</span>
                </button>
                <button className="wl-nav-item" onClick={() => navigate('/map')}>
                    <i data-lucide="calendar"></i>
                    <span>Plan</span>
                </button>
                <button className="wl-nav-item" onClick={() => navigate('/login')}>
                    <i data-lucide="user"></i>
                    <span>Profile</span>
                </button>
            </nav>
        </div>
    );
};

export default HomePage;


