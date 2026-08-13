import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNativeState } from 'native-state-react';
import PacificMap from '../components/PacificMap';

const PlaygroundPage = () => {
    const navigate = useNavigate();
    const [counter, setCounter] = useNativeState('state.playgroundCounter', 0);
    const [testInput, setTestInput] = useState('');
    const [activeTab, setActiveTab] = useState('components');

    useEffect(() => {
        if (window.lucide) window.lucide.createIcons();
    }, [activeTab]);

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 9999,
            background: '#0f172a',
            color: '#f8fafc',
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch'
        }}>
            <div style={{
                maxWidth: '480px',
                margin: '0 auto',
                padding: '16px 16px 40px 16px',
                boxSizing: 'border-box'
            }}>
                {/* Top Navigation */}
                <header style={{
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'space-between',
                    paddingBottom: '14px',
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    marginBottom: '16px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <button
                            onClick={() => navigate('/')}
                            style={{
                                background: 'rgba(255,255,255,0.12)',
                                border: 'none',
                                color: '#fff',
                                padding: '8px 12px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                fontSize: '0.9rem'
                            }}
                        >
                            <i data-lucide="arrow-left"></i> Home
                        </button>
                        <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 600 }}>🧪 Component Sandbox</h2>
                    </div>
                </header>

                {/* Tab Switcher */}
                <div style={{
                    display: 'flex',
                    background: 'rgba(255,255,255,0.06)',
                    borderRadius: '10px',
                    padding: '4px',
                    marginBottom: '16px'
                }}>
                    <button
                        onClick={() => setActiveTab('components')}
                        style={{
                            flex: 1,
                            padding: '10px',
                            border: 'none',
                            borderRadius: '8px',
                            background: activeTab === 'components' ? '#3b82f6' : 'transparent',
                            color: '#fff',
                            fontWeight: 600,
                            cursor: 'pointer'
                        }}
                    >
                        Components
                    </button>
                    <button
                        onClick={() => setActiveTab('state')}
                        style={{
                            flex: 1,
                            padding: '10px',
                            border: 'none',
                            borderRadius: '8px',
                            background: activeTab === 'state' ? '#3b82f6' : 'transparent',
                            color: '#fff',
                            fontWeight: 600,
                            cursor: 'pointer'
                        }}
                    >
                        State Sandbox
                    </button>
                </div>

                {/* Components Tab */}
                {activeTab === 'components' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <PacificMap />
                        <div style={{
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '12px',
                            padding: '16px'
                        }}>
                            <h4 style={{ margin: '0 0 10px 0' }}>Input Field Test</h4>
                            <input
                                type="text"
                                placeholder="Type something..."
                                value={testInput}
                                onChange={(e) => setTestInput(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '10px 12px',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    background: 'rgba(0,0,0,0.3)',
                                    color: '#fff',
                                    boxSizing: 'border-box'
                                }}
                            />
                            {testInput && (
                                <p style={{ margin: '8px 0 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>
                                    Output: <strong>{testInput}</strong>
                                </p>
                            )}
                        </div>

                        <div style={{
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '12px',
                            padding: '16px'
                        }}>
                            <h4 style={{ margin: '0 0 10px 0' }}>Action Buttons</h4>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button style={{ flex: 1, padding: '10px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600 }}>
                                    Primary Action
                                </button>
                                <button style={{ flex: 1, padding: '10px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600 }}>
                                    Secondary Action
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* State Sandbox Tab */}
                {activeTab === 'state' && (
                    <div style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        padding: '16px'
                    }}>
                        <h4 style={{ margin: '0 0 8px 0' }}>useNativeState Counter</h4>
                        <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '0 0 14px 0' }}>
                            Key: <code>state.playgroundCounter</code>
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <button
                                onClick={() => setCounter(counter - 1)}
                                style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1.2rem', cursor: 'pointer' }}
                            >
                                -
                            </button>
                            <span style={{ fontSize: '1.4rem', fontWeight: 700 }}>{counter}</span>
                            <button
                                onClick={() => setCounter(counter + 1)}
                                style={{ width: '40px', height: '40px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1.2rem', cursor: 'pointer' }}
                            >
                                +
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlaygroundPage;
