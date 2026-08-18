import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNativeState } from 'native-state-react';
import PacificMap from '../components/PacificMap';
import Loader from '../components/Loader';
import ShinyText from '../components/ShinyText';
import SplashCursor from '../components/SplashCursor';
import GlassSurface from '../components/GlassSurface';

const PlaygroundPage = () => {
    const navigate = useNavigate();
    const [counter, setCounter] = useNativeState('state.playgroundCounter', 0);
    const [testInput, setTestInput] = useState('');
    const [activeTab, setActiveTab] = useState('components');
    const [customSize, setCustomSize] = useState(60);
    const [showOverlay, setShowOverlay] = useState(false);
    const [shinyInput, setShinyInput] = useState('✨ Shiny Text Effect');
    const [shinySpeed, setShinySpeed] = useState(2);
    const [shinyYoyo, setShinyYoyo] = useState(false);
    const [showSplash, setShowSplash] = useState(true);

    useEffect(() => {
        if (window.lucide) window.lucide.createIcons();
    }, [activeTab]);

    const sizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];

    return (
        <div style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', zIndex: 9999, background: 'url("https://img.magnific.com/premium-vector/abstract-element-light-background-digital-tech_991099-13.jpg?semt=ais_test_b&w=740&q=80")', color: '#f8fafc', overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
            {showSplash && <SplashCursor auto={true} />}
            {showOverlay && (
                <div onClick={() => setShowOverlay(false)} style={{ cursor: 'pointer' }}>
                    <Loader overlay glass label="Click anywhere to close overlay loader" size="xl" />
                </div>
            )}
            <div style={{ maxWidth: '480px', margin: '0 auto', padding: '16px 16px 40px 16px', boxSizing: 'border-box' }}>
                <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '14px', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <button onClick={() => navigate('/')} style={{ background: 'rgba(255,255,255,0.12)', border: 'none', color: '#fff', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}>
                            <i data-lucide="arrow-left"></i> Home
                        </button>
                        <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 600 }}>🧪 Component Sandbox</h2>
                    </div>
                </header>

                <div style={{ display: 'flex', background: 'rgba(255,255,255,0.06)', borderRadius: '10px', padding: '4px', marginBottom: '16px' }}>
                    <button onClick={() => setActiveTab('components')} style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '8px', background: activeTab === 'components' ? '#3b82f6' : 'transparent', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>
                        Components
                    </button>
                    <button onClick={() => setActiveTab('state')} style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '8px', background: activeTab === 'state' ? '#3b82f6' : 'transparent', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>
                        State Sandbox
                    </button>
                </div>

                {activeTab === 'components' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {/* Globe Loader Showcase */}
                        <GlassSurface style={{ border: '1px solid rgb(255 255 255 / 20%)' }} width="100%" height="auto" borderRadius={16}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                <h4 style={{ margin: 0 }}>🌍 Animated Globe Loader</h4>
                                <button onClick={() => setShowOverlay(true)} style={{ background: '#3b82f6', border: 'none', color: '#fff', padding: '6px 12px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>
                                    Test Overlay
                                </button>
                            </div>

                            <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '0 0 12px 0' }}>Preset Sizes:</p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-around', gap: '12px', background: 'rgba(0,0,0,0.25)', padding: '14px', borderRadius: '10px', marginBottom: '14px' }}>
                                {sizes.map((s) => (
                                    <div key={s} style={{ textAlign: 'center' }}>
                                        <Loader size={s} />
                                        <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block', marginTop: '4px' }}>{s}</span>
                                    </div>
                                ))}
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ fontSize: '0.8rem', color: '#94a3b8', minWidth: '75px' }}>Custom ({customSize}px):</span>
                                <input type="range" min="16" max="180" value={customSize} onChange={(e) => setCustomSize(Number(e.target.value))} style={{ flex: 1 }} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '12px' }}>
                                <Loader size={customSize} label={`Custom ${customSize}px`} />
                            </div>
                        </GlassSurface>

                        <GlassSurface style={{ border: '1px solid rgb(255 255 255 / 20%)' }} width="100%" height="auto" borderRadius={16}>
                            <PacificMap />
                        </GlassSurface>

                        {/* ShinyText Showcase Card */}
                        <GlassSurface style={{ border: '1px solid rgb(255 255 255 / 20%)' }} width="100%" height="auto" borderRadius={16}>
                            <h4 style={{ margin: '0 0 12px 0' }}>✨ ShinyText Effect (React Bits)</h4>
                            <div style={{ background: 'rgba(0,0,0,0.4)', padding: '20px', borderRadius: '10px', textAlign: 'center', marginBottom: '14px', fontSize: '1.4rem', fontWeight: 700 }}>
                                <ShinyText text={shinyInput || '✨ Shiny Text'} speed={shinySpeed} yoyo={shinyYoyo} pauseOnHover={true} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <input
                                    type="text"
                                    value={shinyInput}
                                    onChange={(e) => setShinyInput(e.target.value)}
                                    placeholder="Enter custom text..."
                                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.3)', color: '#fff', fontSize: '0.85rem', boxSizing: 'border-box' }}
                                />
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', color: '#94a3b8' }}>
                                    <span>Speed: {shinySpeed}s</span>
                                    <input type="range" min="0.5" max="5" step="0.5" value={shinySpeed} onChange={(e) => setShinySpeed(Number(e.target.value))} style={{ width: '120px' }} />
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#94a3b8' }}>
                                    <input type="checkbox" id="shiny-yoyo" checked={shinyYoyo} onChange={(e) => setShinyYoyo(e.target.checked)} />
                                    <label htmlFor="shiny-yoyo" style={{ cursor: 'pointer' }}>Yoyo Effect (reverse animation loop)</label>
                                </div>
                            </div>
                        </GlassSurface>

                        {/* SplashCursor Showcase Card */}
                        <GlassSurface style={{ border: '1px solid rgb(255 255 255 / 20%)' }} width="100%" height="auto" borderRadius={16}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h4 style={{ margin: 0 }}>💧 SplashCursor (React Bits)</h4>
                                <button
                                    onClick={() => setShowSplash(!showSplash)}
                                    style={{
                                        background: showSplash ? '#ef4444' : '#3b82f6',
                                        border: 'none',
                                        color: '#fff',
                                        padding: '8px 14px',
                                        borderRadius: '8px',
                                        fontSize: '0.8rem',
                                        fontWeight: 600,
                                        cursor: 'pointer'
                                    }}
                                >
                                    {showSplash ? 'Disable Fluid' : 'Enable Fluid'}
                                </button>
                            </div>
                            <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '8px 0 0 0' }}>
                                {showSplash ? '✨ Move your pointer or swipe on screen to see WebGL fluid splats!' : 'Click Enable Fluid to activate full-screen WebGL fluid interaction.'}
                            </p>
                        </GlassSurface>

                        <GlassSurface style={{ border: '1px solid rgb(255 255 255 / 20%)' }} width="100%" height="auto" borderRadius={16}>
                            <h4 style={{ margin: '0 0 10px 0' }}>Input Field Test</h4>
                            <input type="text" placeholder="Type something..." value={testInput} onChange={(e) => setTestInput(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.3)', color: '#fff', boxSizing: 'border-box' }} />
                            {testInput && <p style={{ margin: '8px 0 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>Output: <strong>{testInput}</strong></p>}
                        </GlassSurface>
                    </div>
                )}

                {activeTab === 'state' && (
                    <GlassSurface style={{ border: '1px solid rgb(255 255 255 / 20%)' }} width="100%" height="auto" borderRadius={16}>
                        <h4 style={{ margin: '0 0 8px 0' }}>useNativeState Counter</h4>
                        <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '0 0 14px 0' }}>Key: <code>state.playgroundCounter</code></p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <button onClick={() => setCounter(counter - 1)} style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1.2rem', cursor: 'pointer' }}>-</button>
                            <span style={{ fontSize: '1.4rem', fontWeight: 700 }}>{counter}</span>
                            <button onClick={() => setCounter(counter + 1)} style={{ width: '40px', height: '40px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1.2rem', cursor: 'pointer' }}>+</button>
                        </div>
                    </GlassSurface>
                )}
            </div>
        </div>
    );
};

export default PlaygroundPage;
