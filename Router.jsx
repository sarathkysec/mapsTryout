import React, { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useNativeState } from 'native-state-react';
import HomePage from './src/pages/HomePage.jsx';
import Loader from './src/components/Loader.jsx';


import BackButtonHandler from './src/components/BackButtonHandler.jsx';

const Sidebar = lazy(() => import('./src/components/Sidebar.jsx'));
const FloatingSearch = lazy(() => import('./src/components/FloatingSearch.jsx'));
const PlaceDetailsCard = lazy(() => import('./src/components/PlaceDetailsCard.jsx'));
const CustomControls = lazy(() => import('./src/components/CustomControls.jsx'));
const LoginPage = lazy(() => import('./src/pages/LoginPage.jsx'));
const PlaygroundPage = lazy(() => import('./src/pages/PlaygroundPage.jsx'));

const App = () => {
    const [sidebarOpen, setSidebarOpen] = useNativeState('state.sidebarOpen', false);
    const location = useLocation();

    React.useEffect(() => {
        if (window.lucide) lucide.createIcons();
    });

    // Drive #map size via CSS based on current route
    React.useEffect(() => {
        const appEl = document.getElementById('app');
        if (!appEl) return;
        const page = location.pathname === '/map' ? 'map' : (location.pathname === '/login' ? 'login' : (location.pathname === '/playground' ? 'playground' : 'home'));
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
        <Suspense fallback={<Loader size='2xl' />}>
            <BackButtonHandler />
            {/* Sidebar — hidden on login and playground pages */}
            {location.pathname !== '/login' && location.pathname !== '/playground' && (
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

                {/* /playground — component test sandbox */}
                <Route path="/playground" element={<PlaygroundPage />} />

                {/* /map — full-screen map */}
                <Route path="/map" element={
                    <>
                        <FloatingSearch onMenuToggle={() => setSidebarOpen(true)} />
                        <PlaceDetailsCard />
                        <CustomControls />
                    </>
                } />
            </Routes>
        </Suspense>
    );
};

export default App;
