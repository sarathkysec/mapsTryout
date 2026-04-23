// Main App Component
const App = () => {
    const [sidebarOpen, setSidebarOpen] = React.useState(false);

    React.useEffect(() => {
        // Initialize Lucide icons after React renders
        if (window.lucide) {
            lucide.createIcons();
        }
    });

    const handleThemeToggle = async () => {
        const { toggleTheme } = await import('/src/theme.js');
        toggleTheme();
        // Re-render icons after theme change
        setTimeout(() => {
            if (window.lucide) lucide.createIcons();
        }, 100);
    };

    return (
        <>
            <FloatingSearch
                onMenuToggle={() => setSidebarOpen(true)}
            />

            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                onThemeToggle={handleThemeToggle}
            />

            <PlaceDetailsCard />

            <CustomControls />
        </>
    );
};

window.App = App;
