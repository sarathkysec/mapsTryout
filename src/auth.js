import { CLIENT_ID } from './config.js';
import { isDark } from './theme.js';

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

function handleCredentialResponse(response) {
    const user = parseJwt(response.credential);
    console.log("User signed in:", user);
    updateUIForUser(user);
}

export function updateUIForUser(user) {
    // Dispatch event for React components
    window.dispatchEvent(new CustomEvent('auth-state-changed', { detail: user }));

    // Legacy DOM updates (kept for backward compatibility)
    const profileInfoStrong = document.querySelector('.profile-info strong');
    const profileInfoSpan = document.querySelector('.profile-info span');
    const profileBtn = document.getElementById('profile-btn');
    const loggedInActions = document.getElementById('logged-in-actions');
    const loggedOutActions = document.getElementById('logged-out-actions');

    if (user) {
        if (profileInfoStrong) profileInfoStrong.textContent = user.name;
        if (profileInfoSpan) profileInfoSpan.textContent = user.email;
        if (profileBtn) profileBtn.innerHTML = `<img src="${user.picture}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;" alt="${user.name}">`;
        if (loggedInActions) loggedInActions.style.display = 'block';
        if (loggedOutActions) loggedOutActions.style.display = 'none';
        localStorage.setItem('geoUser', JSON.stringify(user));
    } else {
        if (profileInfoStrong) profileInfoStrong.textContent = 'Guest User';
        if (profileInfoSpan) profileInfoSpan.textContent = 'Sign in to save places';
        if (profileBtn) profileBtn.innerHTML = '<i data-lucide="user"></i>';
        if (window.lucide) lucide.createIcons();
        if (loggedInActions) loggedInActions.style.display = 'none';
        if (loggedOutActions) loggedOutActions.style.display = 'block';
        localStorage.removeItem('geoUser');
    }
}

export function initGoogleAuth() {
    if (typeof google !== 'undefined' && google.accounts) {
        google.accounts.id.initialize({
            client_id: CLIENT_ID,
            callback: handleCredentialResponse,
            auto_select: false,
            cancel_on_tap_outside: true
        });

        const cachedUser = localStorage.getItem('geoUser');
        if (cachedUser) {
            updateUIForUser(JSON.parse(cachedUser));
        }
    } else {
        setTimeout(initGoogleAuth, 100);
    }
}

export function signOut() {
    if (typeof google !== 'undefined' && google.accounts) {
        google.accounts.id.disableAutoSelect();
    }

    // Clear all user-related storage
    localStorage.removeItem('geoUser');
    localStorage.removeItem('geoAtlas_saved_places');

    updateUIForUser(null);

    // Dispatch events to clear map markers and close details
    window.dispatchEvent(new CustomEvent('saved-places-updated', { detail: [] }));
    window.dispatchEvent(new CustomEvent('place-details-closed'));
}
