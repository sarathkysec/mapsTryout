import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import SplashCursor from '../components/SplashCursor';
import BottomNav from '../components/BottomNav';
import { StatusBar } from '@capacitor/status-bar';

const HomePage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if (window.lucide) {
            window.lucide.createIcons();
        }
        const initStatusBar = async () => {
            try {
                await StatusBar.show();
                await StatusBar.setOverlaysWebView({ overlay: false });
                await StatusBar.setBackgroundColor({ color: '#0b0d10' });
            } catch (err) {
                // Ignore on non-native environments
            }
        };
        initStatusBar();
    }, []);

    const bgStyle = {
        background: 'linear-gradient(180deg, rgb(11 13 16 / 65%) 0%, rgba(11, 13, 16, 0.88) 100%),url(/assets/home/im' + (Math.floor(Math.random() * 4) + 1) + '.jpg) center / cover no-repeat fixed #0b0d10'
    };

    return (
        <div className="wl-page" style={bgStyle}>
            <Header
                opacity={0.55}
                avatarUrl="/assets/profile_avatar.jpg"
                onAvatarClick={() => navigate('/profile')}
                onNotificationClick={() => navigate('/playground')}
            />
            <SplashCursor styles={{ 'z-index': 0 }} auto={false} />
            <div className="wl-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                {/* Search Bar */}
                <div className="wl-search-bar">
                    <i data-lucide="search" className="wl-search-icon"></i>
                    <input type="text" placeholder="Where to?" className="wl-search-input" />
                </div>

                {/* Travel Stats */}
                <div className="wl-card wl-glass-card wl-stats-card">
                    <div className="wl-stats-left">
                        <div className="wl-icon-circle wl-green-circle">
                            <i data-lucide="plane"></i>
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
                        <div className="wl-dispatches-left">
                            <div className="wl-card wl-dispatch-card" style={{ backgroundImage: `url('/assets/wanderlust_roadtrip.png')` }}>
                                <div className="wl-dispatch-overlay">
                                    <span className="wl-badge-tag">STORY</span>
                                    <h3 className="wl-dispatch-title">The Ultimate West Coast Road Trip</h3>
                                </div>
                            </div>
                            <div className="wl-card wl-dispatch-card" style={{ backgroundImage: `url('/assets/wanderlust_roadtrip.png')` }}>
                                <div className="wl-dispatch-overlay">
                                    <span className="wl-badge-tag">STORY</span>
                                    <h3 className="wl-dispatch-title">The Ultimate West Coast Road Trip</h3>
                                </div>
                            </div>
                        </div>
                        <div className="wl-card wl-dispatch-card wl-dispatch-tall" style={{ backgroundImage: `url('/assets/wanderlust_tokyo.png')` }}>
                            <div className="wl-dispatch-overlay">
                                <span className="wl-badge-tag">VIDEO</span>
                                <div className="wl-play-btn">
                                    <i data-lucide="play"></i>
                                </div>
                                <div>
                                    <h3 className="wl-dispatch-title">A Taste of Tokyo: Street Food Guide</h3>
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
                                <i data-lucide="footprints"></i>
                            </div>
                            <span>Adventure</span>
                        </div>
                        <div className="wl-card wl-glass-card wl-explore-card" onClick={() => navigate('/map')}>
                            <div className="wl-category-circle wl-blue">
                                <i data-lucide="flower-2"></i>
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
                                <i data-lucide="home"></i>
                            </div>
                            <span>Culture</span>
                        </div>
                    </div>
                </section>

            </div>

            <BottomNav active="home" />
        </div>
    );
};

export default HomePage;
