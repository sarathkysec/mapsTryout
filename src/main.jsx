import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { createIcons, icons } from 'lucide';
import App from '../Router.jsx';
import './styles/main.scss';
import './app.js';

// Bundle Lucide icons locally so SVGs render offline / on mobile without CDN network dependency
window.lucide = {
    createIcons: (options = {}) => createIcons({ icons, ...options })
};

// Initial icon generation
createIcons({ icons });

const rootElement = document.getElementById('root');
if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <BrowserRouter>
            <App />
        </BrowserRouter>
    );
}

