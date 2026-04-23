import { tileLayer, indiaBorderLayer } from './map.js';
import { DARK_TILES, LIGHT_TILES } from './config.js';

const themeBtn = document.getElementById('theme-toggle');
const savedTheme = localStorage.getItem('geoTheme');
export let isDark = savedTheme ? (savedTheme === 'dark') : (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);

export function toggleTheme() {
    applyTheme(!isDark);
}

export function applyTheme(dark, save = true) {
    isDark = dark;
    document.body.setAttribute('data-theme', isDark ? 'dark' : 'light');

    if (save) {
        localStorage.setItem('geoTheme', isDark ? 'dark' : 'light');
    }

    if (themeBtn) {
        themeBtn.innerHTML = isDark ? '<i data-lucide="sun"></i>' : '<i data-lucide="moon"></i>';
        if (window.lucide) lucide.createIcons();
    }

    if (tileLayer) {
        tileLayer.setUrl(isDark ? DARK_TILES : LIGHT_TILES);
    }

    if (indiaBorderLayer) {
        indiaBorderLayer.setStyle({
            color: isDark ? '#2a2b2e' : '#d4d1c9'
        });
    }

    // Refresh Google Button Theme
    const googleBtnContainer = document.getElementById("google-button-container");
    if (typeof google !== 'undefined' && google.accounts && googleBtnContainer) {
        google.accounts.id.renderButton(
            googleBtnContainer,
            {
                theme: isDark ? "filled_black" : "outline",
                size: "large",
                width: 250,
                shape: "pill"
            }
        );
    }
}

export function initTheme() {
    applyTheme(isDark, false);
    themeBtn?.addEventListener('click', () => {
        applyTheme(!isDark);
    });
}
