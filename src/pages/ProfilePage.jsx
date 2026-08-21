import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import SplashCursor from '../components/SplashCursor';
import ProfileMap from '../components/ProfileMap';
import BottomNav from '../components/BottomNav';
import { StatusBar } from '@capacitor/status-bar';

const ProfilePage = () => {
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
        background: 'linear-gradient(180deg, rgb(11 13 16 / 65%) 0%, rgba(11, 13, 16, 0.88) 100%), url(/assets/home/im1.jpg) center / cover no-repeat fixed #0b0d10'
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

            <div className="wl-body wl-profile-body">

                {/* Main Profile Header Card */}
                <div className="wl-card wl-glass-card wl-profile-main-card">
                    <div className="wl-profile-avatar-wrapper">
                        <img src="/assets/profile_avatar.jpg" alt="James Ibrahim" className="wl-profile-avatar-img" />
                    </div>
                    <h2 className="wl-profile-name">James Ibrahim</h2>
                    <span className="wl-profile-handle">@jbrahim</span>

                    <div className="wl-profile-meta">
                        <div className="wl-profile-meta-item">
                            <i data-lucide="map-pin"></i>
                            <span>Uminkl, Dney</span>
                        </div>
                        <div className="wl-profile-meta-item">
                            <i data-lucide="anchor"></i>
                            <span>Joined on Feb 11, 2024</span>
                        </div>
                    </div>
                </div>

                {/* 2-Column Grid: Budget Backpacking + Facebook */}
                {/* <div className="wl-profile-grid-2">
                    <div className="wl-card wl-glass-card wl-profile-info-card">
                        <div className="wl-profile-card-top">
                            <div className="wl-email-circle">
                                <i data-lucide="radar"></i>
                            </div>
                            <i data-lucide="arrow-up-right" className="wl-arrow-icon"></i>
                        </div>
                        <div className="wl-profile-info-text">
                            <div className="wl-profile-text-title">Budget backpacking</div>
                            <div className="wl-profile-text-sub">Adventure & activities</div>
                        </div>
                    </div>

                    <div className="wl-card wl-glass-card wl-profile-info-card">
                        <div className="wl-profile-card-top">
                            <div className="wl-fb-circle">
                                <i data-lucide="facebook"></i>
                            </div>
                            <i data-lucide="arrow-up-right" className="wl-arrow-icon"></i>
                        </div>
                        <div className="wl-profile-info-text">
                            <div className="wl-profile-text-title">Facebook</div>
                            <div className="wl-profile-text-sub">@m_aqsam</div>
                        </div>
                    </div>
                </div> */}

                {/* Middle Row: Pillar + World Map */}
                <div className="wl-profile-map-row">
                    <div className="wl-card wl-glass-card wl-profile-pillar">
                        Places:
                        Countries:
                        Wishlist:
                    </div>
                    <div className="wl-card wl-glass-card wl-profile-map-card">
                        <ProfileMap />
                    </div>
                </div>

                {/* List Card + Thumbnails Row */}
                <div className="wl-profile-list-row">
                    <div className="wl-card wl-profile-list-card" style={{ backgroundImage: `url('/assets/profile_list_bg.jpg')` }}>
                        <div className="wl-profile-list-overlay">
                            <div className="wl-profile-card-top">
                                <div className="wl-list-circle">
                                    <i data-lucide="notebook-pen"></i>
                                </div>
                                <i data-lucide="arrow-up-right" className="wl-arrow-icon"></i>
                            </div>
                            <h3 className="wl-profile-list-header">List</h3>
                            <ol className="wl-profile-ol">
                                <li>See the Northern Lights in a glass igloo.</li>
                                <li>Ride in a hot air balloon at sunrise.</li>
                                <li>Hike a famous trail like the Inca Trail to Machu Picchu.</li>
                            </ol>
                        </div>
                    </div>

                    <div className="wl-profile-thumb-stack">
                        <div className="wl-card wl-profile-thumb-card" style={{ backgroundImage: `url('/assets/profile_vietnam.jpg')` }}>
                            <span className="wl-thumb-pill">Vietnam</span>
                        </div>
                        <div className="wl-card wl-profile-thumb-card" style={{ backgroundImage: `url('/assets/profile_nepal.jpg')` }}>
                            <span className="wl-thumb-pill">Nepal</span>
                        </div>
                    </div>
                </div>

                {/* Instagram Card */}
                <div className="wl-card wl-glass-card wl-profile-info-card wl-profile-insta-card">
                    <div className="wl-profile-card-top">
                        <div style={{ width: 1 }}></div>
                        <i data-lucide="arrow-up-right" className="wl-arrow-icon"></i>
                    </div>
                    <div className="wl-profile-info-text">
                        <div className="wl-profile-text-title">Instagram</div>
                        <div className="wl-profile-text-sub">@dev.aqsam</div>
                    </div>
                </div>

            </div>

            <BottomNav active="profile" />
        </div>
    );
};

export default ProfilePage;
