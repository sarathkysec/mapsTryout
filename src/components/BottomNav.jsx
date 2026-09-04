import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const BottomNav = ({ active }) => {
    const navigate = useNavigate();
    const location = useLocation();

    // Determine current active tab
    const currentTab = active || (
        location.pathname === '/' ? 'home' :
            location.pathname === '/profile' ? 'profile' :
                (location.pathname === '/explore' || location.pathname === '/map') ? 'explore' : ''
    );

    useEffect(() => {
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }, [currentTab]);

    return (
        <nav className="wl-bottom-nav">
            <button
                className={`wl-nav-item ${currentTab === 'home' ? 'active' : ''}`}
                onClick={() => navigate('/')}
            >
                {currentTab === 'home' ? (
                    <div className="wl-nav-active-pill">
                        <i data-lucide="home"></i>
                    </div>
                ) : (
                    <i data-lucide="home"></i>
                )}
                <span>Home</span>
            </button>

            <button
                className={`wl-nav-item ${currentTab === 'explore' ? 'active' : ''}`}
                onClick={() => navigate('/explore')}
            >
                {currentTab === 'explore' ? (
                    <div className="wl-nav-active-pill">
                        <i data-lucide="compass"></i>
                    </div>
                ) : (
                    <i data-lucide="compass"></i>
                )}
                <span>Explore</span>
            </button>

            <button
                className={`wl-nav-item ${currentTab === 'plan' ? 'active' : ''}`}
                onClick={() => navigate('/map')}
            >
                {currentTab === 'plan' ? (
                    <div className="wl-nav-active-pill">
                        <i data-lucide="calendar"></i>
                    </div>
                ) : (
                    <i data-lucide="calendar"></i>
                )}
                <span>Plan</span>
            </button>

            <button
                className={`wl-nav-item ${currentTab === 'profile' ? 'active' : ''}`}
                onClick={() => navigate('/profile')}
            >
                {currentTab === 'profile' ? (
                    <div className="wl-nav-active-pill">
                        <i data-lucide="user"></i>
                    </div>
                ) : (
                    <i data-lucide="user"></i>
                )}
                <span>Profile</span>
            </button>
        </nav>
    );
};

export default BottomNav;
