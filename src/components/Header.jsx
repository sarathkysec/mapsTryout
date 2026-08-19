import React, { useEffect } from 'react';
import './Header.css';

const Header = ({
    opacity = 1,
    bgOpacity,
    bg,
    title = "Wanderlust",
    avatarUrl = "/assets/wanderlust_avatar.png",
    onAvatarClick,
    onAddClick,
    onNotificationClick,
    className = ""
}) => {
    useEffect(() => {
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }, []);

    // Support both `opacity` and `bgOpacity` props for background transparency control
    let alpha = 1;
    if (bgOpacity !== undefined) {
        alpha = typeof bgOpacity === 'number' ? bgOpacity : parseFloat(bgOpacity);
    } else if (opacity !== undefined) {
        alpha = typeof opacity === 'number' ? opacity : parseFloat(opacity);
    }

    if (isNaN(alpha)) alpha = 1;

    // Apply background color with configurable opacity
    const headerStyle = {
        backgroundColor: bg ? bg : `rgba(18, 19, 22, ${alpha})`,
        backdropFilter: alpha < 1 ? 'blur(16px)' : 'none',
        WebkitBackdropFilter: alpha < 1 ? 'blur(16px)' : 'none'
    };

    return (
        <header className={`wl-header-component ${className}`} style={headerStyle}>
            <div className="wl-header-left">
                <button
                    type="button"
                    className="wl-avatar-btn"
                    onClick={onAvatarClick}
                    title="Profile"
                    aria-label="Profile"
                >
                    <div className="wl-avatar-ring">
                        <img src={avatarUrl} alt="User Avatar" className="wl-header-avatar" />
                    </div>
                </button>
            </div>

            <div className="wl-header-center">
                <h1 className="wl-header-title">{title}</h1>
            </div>

            <div className="wl-header-right">
                <button
                    type="button"
                    className="wl-header-icon-btn"
                    title="Add"
                    aria-label="Add"
                    onClick={onAddClick}
                >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                </button>
                <button
                    type="button"
                    className="wl-header-icon-btn"
                    title="Notifications"
                    aria-label="Notifications"
                    onClick={onNotificationClick}
                >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                    </svg>
                </button>
            </div>
        </header>
    );
};

export default Header;
