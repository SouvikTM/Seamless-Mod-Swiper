import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { NexusService } from '../services/NexusService';

const GAMES = [
    { id: 'skyrimspecialedition', name: 'Skyrim Special Edition', nexusId: 1704 },
    { id: 'fallout4', name: 'Fallout 4', nexusId: 1151 }
];

const VERSIONS = {
    'skyrimspecialedition': ['1.6.1170', '1.6.640', '1.5.97'],
    'fallout4': ['1.10.984', '1.10.163']
};

const GameSelector = () => {
    const { apiKeys, selectGame, toggleTheme } = useApp();
    const [selectedGameId, setSelectedGameId] = useState(GAMES[0].id);
    const [selectedVersion, setSelectedVersion] = useState(VERSIONS[GAMES[0].id][0]);
    const [loading, setLoading] = useState(false);

    const handleGameChange = (e) => {
        const gameId = e.target.value;
        setSelectedGameId(gameId);
        setSelectedVersion(VERSIONS[gameId][0]);

        // Update theme
        if (gameId === 'skyrimspecialedition') toggleTheme('theme-skyrim');
        else if (gameId === 'fallout4') toggleTheme('theme-fallout');
    };

    const handleStart = async () => {
        setLoading(true);
        const game = GAMES.find(g => g.id === selectedGameId);

        // Fetch mods here or just set game and let parent fetch?
        // Let's just set game info and let App or SwipeDeck trigger fetch
        selectGame(game.id, selectedVersion);

        setLoading(false);
    };

    return (
        <div className="game-selector" style={{ maxWidth: '500px', margin: '0 auto', padding: '2rem', textAlign: 'center' }}>
            <h2>Select Game & Version</h2>

            <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Game</label>
                <select
                    value={selectedGameId}
                    onChange={handleGameChange}
                    style={{ width: '100%', padding: '0.5rem' }}
                >
                    {GAMES.map(g => (
                        <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                </select>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Game Version</label>
                <select
                    value={selectedVersion}
                    onChange={(e) => setSelectedVersion(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem' }}
                >
                    {VERSIONS[selectedGameId].map(v => (
                        <option key={v} value={v}>{v}</option>
                    ))}
                </select>
            </div>

            <button onClick={handleStart} disabled={loading} style={{ padding: '1rem 2rem' }}>
                Load Mods
            </button>
        </div>
    );
};

export default GameSelector;
