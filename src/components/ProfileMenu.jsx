// ProfileMenu Component
const ProfileMenu = ({ showMenu, onToggle, menuRef, containerRef }) => {
    const [user, setUser] = React.useState(null);
    const googleBtnRef = React.useRef(null);

    React.useEffect(() => {
        // Check for cached user
        const cachedUser = localStorage.getItem('geoUser');
        if (cachedUser) {
            setUser(JSON.parse(cachedUser));
        }

        // Listen for auth changes
        window.addEventListener('auth-state-changed', (e) => {
            setUser(e.detail);
        });
    }, []);

    React.useEffect(() => {
        // Re-render Google button when menu opens
        if (showMenu && !user) {
            // Short timeout to ensure ref is populated and visible
            setTimeout(() => {
                const hasGoogle = typeof google !== 'undefined' && google.accounts;
                const hasContainer = googleBtnRef.current;

                if (hasGoogle && hasContainer) {
                    // Check if already rendered to avoid duplicates/errors
                    if (googleBtnRef.current.children.length === 0) {
                        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
                        try {
                            google.accounts.id.renderButton(googleBtnRef.current, {
                                theme: isDark ? "filled_black" : "outline",
                                size: "large",
                                width: 250,
                                shape: "pill"
                            });
                        } catch (e) {
                            console.warn('GSI render error:', e);
                        }
                    }
                } else {
                    console.log('GSI not ready or container missing');
                }
            }, 100); // Increased timeout slightly for safety
        }
    }, [showMenu, user]);

    const handleSignOut = async () => {
        const { signOut } = await import('/src/auth.js');
        signOut();
        setUser(null);
        onToggle();
    };

    return (
        <div ref={containerRef} className="profile-container">
            <button id="profile-btn" className="profile-btn" title="Account" onClick={onToggle}>
                {user ? (
                        <div key="user-avatar" style={{ width: '100%', height: '100%' }}>
                            <img
                                src={user.picture}
                                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                                alt={user.name}
                            />
                        </div>
                    ) : (
                        <div key="guest-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <i data-lucide="user"></i>
                        </div>
                    )}
                </button>

            {showMenu && (
                <div ref={menuRef} id="profile-menu" className="profile-menu active">
                    <div className="profile-menu-header">
                        <i data-lucide="user-circle" className="large-icon"></i>
                        <div className="profile-info">
                            <strong>{user ? user.name : 'Guest User'}</strong>
                            <span>{user ? user.email : 'Sign in to save places'}</span>
                        </div>
                    </div>
                    <div className="profile-menu-items">
                        {user ? (
                            <div id="logged-in-actions" style={{ width: '100%' }}>
                                <button className="menu-item-btn" onClick={handleSignOut}>
                                    <i data-lucide="log-out"></i>
                                    <span>Sign Out</span>
                                </button>
                            </div>
                        ) : (
                            <div id="logged-out-actions">
                                <div ref={googleBtnRef} id="google-button-container"></div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

window.ProfileMenu = ProfileMenu;
