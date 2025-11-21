import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StorageService } from '../services/StorageService';

const SettingsMenu = () => {
    const { approvedMods, rejectedMods, resetProgress, theme, toggleTheme, setKeys, selectGame } = useApp();
    const [isOpen, setIsOpen] = useState(false);

    const handleExport = () => {
        StorageService.exportApproved(approvedMods);
    };

    const handleReset = () => {
        if (window.confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
            resetProgress();
        }
    };

    const handleLogout = () => {
        setKeys('', '');
        selectGame(null, null);
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    zIndex: 100,
                    background: 'rgba(0,0,0,0.5)',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.2)'
                }}
            >
                ⚙️
            </button>
        );
    }

    return (
        <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            width: '300px',
            background: 'var(--color-surface)',
            borderLeft: '1px solid var(--color-border)',
            padding: '2rem',
            zIndex: 100,
            boxShadow: '-5px 0 20px rgba(0,0,0,0.5)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0 }}>Settings</h2>
                <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', fontSize: '1.5rem' }}>✕</button>
            </div>

            <div>
                <h3>Export</h3>
                <p style={{ fontSize: '0.9rem', color: '#aaa' }}>
                    Approved: {approvedMods.length} | Rejected: {rejectedMods.length}
                </p>
                <button onClick={handleExport} style={{ width: '100%', marginTop: '0.5rem' }}>
                    Download Approved List (.txt)
                </button>
            </div>

            <div>
                <h3>Theme</h3>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                        onClick={() => toggleTheme('theme-skyrim')}
                        style={{ flex: 1, border: theme === 'theme-skyrim' ? '2px solid var(--color-primary)' : 'none' }}
                    >
                        Skyrim
                    </button>
                    <button
                        onClick={() => toggleTheme('theme-fallout')}
                        style={{ flex: 1, border: theme === 'theme-fallout' ? '2px solid var(--color-primary)' : 'none' }}
                    >
                        Fallout
                    </button>
                </div>
                <button
                    onClick={() => toggleTheme('theme-dark')}
                    style={{ width: '100%', marginTop: '0.5rem', border: theme === 'theme-dark' ? '2px solid var(--color-primary)' : 'none' }}
                >
                    Simple Dark
                </button>
            </div>

            <div style={{ marginTop: 'auto' }}>
                <button onClick={handleReset} style={{ width: '100%', background: 'var(--color-error)', color: 'white', marginBottom: '1rem' }}>
                    Reset Progress
                </button>
                <button onClick={handleLogout} style={{ width: '100%', background: 'transparent', border: '1px solid var(--color-border)' }}>
                    Exit / Change Keys
                </button>
            </div>
        </div>
    );
};

export default SettingsMenu;
