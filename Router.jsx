import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import FloatingSearch from './src/components/FloatingSearch.jsx';
import Sidebar from './src/components/Sidebar.jsx';
import PlaceDetailsCard from './src/components/PlaceDetailsCard.jsx';
import CustomControls from './src/components/CustomControls.jsx';
import HomePage from './src/pages/HomePage.jsx';
import LoginPage from './src/pages/LoginPage.jsx';

const App = () => {
    const [sidebarOpen, setSidebarOpen] = React.useState(false);
    const location = useLocation();

    React.useEffect(() => {
        if (window.lucide) lucide.createIcons();
    });

    // Drive #map size via CSS based on current route
    React.useEffect(() => {
        const appEl = document.getElementById('app');
        if (!appEl) return;
        const page = location.pathname === '/map' ? 'map' : (location.pathname === '/login' ? 'login' : 'home');
        appEl.setAttribute('data-page', page);
        setTimeout(() => {
            if (window.map) window.map.invalidateSize();
        }, 400);
    }, [location.pathname]);

    const handleThemeToggle = async () => {
        const { toggleTheme } = await import('/src/theme.js');
        toggleTheme();
        setTimeout(() => { if (window.lucide) lucide.createIcons(); }, 100);
    };

    return (
        <>
            {/* Sidebar — hidden on login page */}
            {location.pathname !== '/login' && (
                <Sidebar
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                    onThemeToggle={handleThemeToggle}
                />
            )}

            {/* Route-based content */}
            <Routes>
                {/* / — homepage with mini map */}
                <Route path="/" element={
                    <HomePage onMenuToggle={() => setSidebarOpen(true)} />
                } />

                {/* /login — login page with Three.js shooting star background */}
                <Route path="/login" element={
                    <LoginPage onThemeToggle={handleThemeToggle} />
                } />

                {/* /map — full-screen map */}
                <Route path="/map" element={
                    <>
                        <FloatingSearch onMenuToggle={() => setSidebarOpen(true)} />
                        <PlaceDetailsCard />
                        <CustomControls />
                    </>
                } />
            </Routes>
        </>
    );
};

export default App;
