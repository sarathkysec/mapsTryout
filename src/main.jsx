import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App.jsx';
import './app.js'; // Initialize map, auth, theme, etc.

const rootElement = document.getElementById('root');
if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(React.createElement(App));
}
