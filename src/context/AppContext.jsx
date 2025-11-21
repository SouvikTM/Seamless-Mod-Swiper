import React, { createContext, useState, useEffect, useContext } from 'react';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
    // API Keys (Session only)
    const [apiKeys, setApiKeys] = useState({
        nexus: '',
        gemini: ''
    });

    // Game Selection
    const [gameInfo, setGameInfo] = useState({
        game: null, // e.g., 'skyrimse'
        version: null // e.g., '1.6.1170'
    });

    // Mod Data
    const [mods, setMods] = useState([]);
    const [currentModIndex, setCurrentModIndex] = useState(0);

    // User Progress (Persisted)
    const [approvedMods, setApprovedMods] = useState(() => {
        const saved = localStorage.getItem('sms_approved');
        return saved ? JSON.parse(saved) : [];
    });

    const [rejectedMods, setRejectedMods] = useState(() => {
        const saved = localStorage.getItem('sms_rejected');
        return saved ? JSON.parse(saved) : [];
    });

    // Theme
    const [theme, setTheme] = useState('theme-dark');

    // Persistence Effects
    useEffect(() => {
        localStorage.setItem('sms_approved', JSON.stringify(approvedMods));
    }, [approvedMods]);

    useEffect(() => {
        localStorage.setItem('sms_rejected', JSON.stringify(rejectedMods));
    }, [rejectedMods]);

    // Actions
    const setKeys = (nexus, gemini) => {
        setApiKeys({ nexus, gemini });
    };

    const selectGame = (game, version) => {
        setGameInfo({ game, version });
        // Reset mods when game changes? Maybe.
        setMods([]);
        setCurrentModIndex(0);
    };

    const addMods = (newMods) => {
        setMods(prev => [...prev, ...newMods]);
    };

    const processMod = (mod, decision) => {
        if (decision === 'approve') {
            setApprovedMods(prev => [...prev, mod]);
        } else {
            setRejectedMods(prev => [...prev, mod]);
        }
        setCurrentModIndex(prev => prev + 1);
    };

    const resetProgress = () => {
        setApprovedMods([]);
        setRejectedMods([]);
        setCurrentModIndex(0);
        localStorage.removeItem('sms_approved');
        localStorage.removeItem('sms_rejected');
    };

    const toggleTheme = (newTheme) => {
        setTheme(newTheme);
        document.body.className = newTheme;
    };

    // Initialize theme on mount
    useEffect(() => {
        document.body.className = theme;
    }, []);

    const value = {
        apiKeys,
        setKeys,
        gameInfo,
        selectGame,
        mods,
        addMods,
        currentModIndex,
        processMod,
        approvedMods,
        rejectedMods,
        resetProgress,
        theme,
        toggleTheme
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};
