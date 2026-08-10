import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { isDark, toggleTheme } from '../theme.js';

const LoginPage = ({ onThemeToggle }) => {
    const [user, setUser] = useState(null);
    const [themeIsDark, setThemeIsDark] = useState(isDark);
    const googleBtnRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const cachedUser = localStorage.getItem('geoUser');
        if (cachedUser) setUser(JSON.parse(cachedUser));

        const handleAuth = (e) => setUser(e.detail);
        window.addEventListener('auth-state-changed', handleAuth);
        return () => window.removeEventListener('auth-state-changed', handleAuth);
    }, []);

    useEffect(() => {
        if (!user) {
            const timer = setTimeout(() => {
                if (typeof google !== 'undefined' && google.accounts && googleBtnRef.current) {
                    googleBtnRef.current.innerHTML = '';
                    try {
                        google.accounts.id.renderButton(googleBtnRef.current, {
                            theme: themeIsDark ? 'filled_black' : 'outline',
                            size: 'large',
                            width: 280,
                            shape: 'pill',
                            text: 'signin_with'
                        });
                    } catch (e) {
                        console.warn('GSI render error:', e);
                    }
                }
            }, 150);
            return () => clearTimeout(timer);
        }
    }, [user, themeIsDark]);

    useEffect(() => {
        if (window.lucide) lucide.createIcons();
    }, [user, themeIsDark]);

    const handleToggleTheme = () => {
        if (onThemeToggle) {
            onThemeToggle();
        } else {
            toggleTheme();
        }
        setThemeIsDark(!themeIsDark);
    };

    const handleSignOut = async () => {
        const { signOut } = await import('../auth.js');
        signOut();
        setUser(null);
    };

    return (
        <div className="login-page-container">

            <header className="login-nav-header">
                <button className="login-nav-btn" onClick={() => navigate('/')}>
                    <i data-lucide="arrow-left"></i>
                    <span>Home</span>
                </button>
                <button className="login-nav-btn" onClick={handleToggleTheme} title="Toggle Theme">
                    <i data-lucide={themeIsDark ? 'sun' : 'moon'}></i>
                </button>
            </header>

            <main className="login-card-wrapper">
                <div className="login-glass-card">
                    <div className="login-brand-header">
                        <div className="login-logo-icon">
                            <i data-lucide="sparkles"></i>
                        </div>
                        <h1>GeoAtlas</h1>
                        <p className="login-tagline">Interactive Maps & Shooting Stars</p>
                    </div>

                    {user ? (
                        <div className="login-user-profile">
                            <img src={user.picture} alt={user.name} className="login-user-avatar" />
                            <h3>{user.name}</h3>
                            <p className="login-user-email">{user.email}</p>

                            <div className="login-actions">
                                <button className="login-action-btn primary" onClick={() => navigate('/map')}>
                                    <i data-lucide="map-pin"></i> Open Map
                                </button>
                                <button className="login-action-btn secondary" onClick={handleSignOut}>
                                    <i data-lucide="log-out"></i> Sign Out
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="login-form-area">
                            <div className="login-subtitle">
                                <h2>Welcome Back</h2>
                                <p>Move pointer across screen for shooting star trail</p>
                            </div>

                            <div className="google-btn-wrapper">
                                <div ref={googleBtnRef} id="login-google-btn-container"></div>
                            </div>

                            <div className="login-divider">
                                <span>or explore as guest</span>
                            </div>

                            <button className="login-action-btn guest" onClick={() => navigate('/map')}>
                                <i data-lucide="compass"></i> Continue to Map
                            </button>
                        </div>
                    )}

                    <div className="login-footer-hint">
                        <i data-lucide="info"></i> Move mouse or drag touch to spawn shooting stars!
                    </div>
                </div>
            </main>
        </div>
    );
};

export default LoginPage;
