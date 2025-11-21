import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { NexusService } from '../services/NexusService';

const WelcomeScreen = () => {
    const { setKeys } = useApp();
    const [nexusKey, setNexusKey] = useState('');
    const [geminiKey, setGeminiKey] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!nexusKey) {
            setError('Nexus API Key is required.');
            setLoading(false);
            return;
        }

        const isValid = await NexusService.validateKey(nexusKey);
        if (isValid) {
            setKeys(nexusKey, geminiKey);
        } else {
            setError('Invalid Nexus API Key.');
        }
        setLoading(false);
    };

    return (
        <div className="welcome-container" style={{ maxWidth: '500px', margin: '0 auto', padding: '2rem' }}>
            <h1>Seamless Mod Swiper</h1>
            <p>Enter your API keys to begin. Keys are not stored permanently.</p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Nexus Mods API Key</label>
                    <input
                        type="password"
                        value={nexusKey}
                        onChange={(e) => setNexusKey(e.target.value)}
                        placeholder="Paste your Nexus Personal API Key"
                        style={{ width: '100%', padding: '0.5rem' }}
                    />
                    <small style={{ color: 'var(--color-text-muted)' }}>
                        Get it from <a href="https://www.nexusmods.com/users/myaccount?tab=api" target="_blank" rel="noreferrer">Nexus Mods</a>
                    </small>
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Gemini API Key (Optional)</label>
                    <input
                        type="password"
                        value={geminiKey}
                        onChange={(e) => setGeminiKey(e.target.value)}
                        placeholder="Paste your Gemini API Key"
                        style={{ width: '100%', padding: '0.5rem' }}
                    />
                    <small style={{ color: 'var(--color-text-muted)' }}>
                        Required for AI compatibility scoring.
                    </small>
                </div>

                {error && <div style={{ color: 'var(--color-error)' }}>{error}</div>}

                <button type="submit" disabled={loading} style={{ marginTop: '1rem', padding: '1rem' }}>
                    {loading ? 'Validating...' : 'Start Swiping'}
                </button>
            </form>
        </div>
    );
};

export default WelcomeScreen;
