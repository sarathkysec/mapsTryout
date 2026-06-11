import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import FloatingSearch from './FloatingSearch.jsx';
import Sidebar from './Sidebar.jsx';
import PlaceDetailsCard from './PlaceDetailsCard.jsx';
import CustomControls from './CustomControls.jsx';
import HomePage from './HomePage.jsx';

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
        const page = location.pathname === '/home' ? 'home' : 'map';
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

    const isHome = location.pathname === '/home';

    return (
        <>
            {/* Sidebar — always available */}
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                onThemeToggle={handleThemeToggle}
            />

            {/* Route-based content */}
            <Routes>
                {/* / — full-screen map */}
                <Route path="/" element={
                    <>
                        <FloatingSearch onMenuToggle={() => setSidebarOpen(true)} />
                        <PlaceDetailsCard />
                        <CustomControls />
                    </>
                } />

                {/* /home — half map + travel content */}
                <Route path="/home" element={
                    <HomePage onMenuToggle={() => setSidebarOpen(true)} />
                } />
            </Routes>
        </>
    );
};

export default App;
