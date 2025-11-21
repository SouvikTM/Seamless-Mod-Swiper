import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { NexusService } from '../services/NexusService';
import { GeminiService } from '../services/GeminiService';
import { ScoringEngine } from '../services/ScoringEngine';
import ModCard from './ModCard';

const SwipeDeck = () => {
    const { apiKeys, gameInfo, mods, addMods, currentModIndex, processMod } = useApp();
    const [loading, setLoading] = useState(false);
    const [currentScores, setCurrentScores] = useState(null);
    const [dragX, setDragX] = useState(0);

    // Fetch mods if empty
    useEffect(() => {
        if (mods.length === 0 && !loading) {
            loadMoreMods();
        }
    }, [mods.length]);

    // Calculate scores for current mod
    useEffect(() => {
        const mod = mods[currentModIndex];
        if (mod) {
            calculateScores(mod);
        }
    }, [currentModIndex, mods]);

    const loadMoreMods = async () => {
        setLoading(true);
        const newMods = await NexusService.fetchMods(apiKeys.nexus, gameInfo.game);
        addMods(newMods);
        setLoading(false);
    };

    const calculateScores = async (mod) => {
        // Logic Score (Instant)
        const logic = ScoringEngine.calculateLogicScore(mod, gameInfo.game, gameInfo.version);

        // AI Score (Async)
        // Set initial loading state for AI
        setCurrentScores({ logic, ai: { score: '...', reasoning: 'Analyzing...' } });

        const ai = await GeminiService.evaluateCompatibility(apiKeys.gemini, mod, gameInfo.version);
        setCurrentScores({ logic, ai });
    };

    const handleSwipe = (direction) => {
        const mod = mods[currentModIndex];
        if (!mod) return;

        processMod(mod, direction === 'right' ? 'approve' : 'reject');
        setDragX(0);
    };

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'a' || e.key === 'ArrowLeft') handleSwipe('left');
            if (e.key === 'b' || e.key === 'ArrowRight') handleSwipe('right');
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentModIndex, mods]); // Re-bind when index changes to ensure fresh state

    if (mods.length === 0 && loading) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>Loading Mods...</div>;
    }

    if (currentModIndex >= mods.length) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>No more mods! <button onClick={loadMoreMods}>Load More</button></div>;
    }

    const currentMod = mods[currentModIndex];
    const nextMod = mods[currentModIndex + 1];

    return (
        <div className="swipe-deck" style={{
            position: 'relative',
            width: '100%',
            maxWidth: '600px',
            height: '80vh',
            margin: '0 auto',
            perspective: '1000px'
        }}>
            {/* Next Card Preview (Behind) */}
            {nextMod && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    transform: 'scale(0.95) translateY(20px)',
                    opacity: 0.5,
                    zIndex: 1,
                    pointerEvents: 'none'
                }}>
                    <ModCard
                        mod={nextMod}
                        logicScore={{ score: '?', signals: [] }}
                        aiScore={{ score: '?', reasoning: 'Pending...' }}
                    />
                </div>
            )}

            {/* Current Card */}
            {currentMod && currentScores && (
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        zIndex: 2,
                        transform: `translateX(${dragX}px) rotate(${dragX * 0.05}deg)`,
                        transition: dragX === 0 ? 'transform 0.3s' : 'none',
                        cursor: 'grab'
                    }}
                    onMouseDown={(e) => {
                        const startX = e.clientX;
                        const handleMouseMove = (moveEvent) => {
                            setDragX(moveEvent.clientX - startX);
                        };
                        const handleMouseUp = (upEvent) => {
                            const endX = upEvent.clientX;
                            const diff = endX - startX;
                            if (Math.abs(diff) > 100) {
                                handleSwipe(diff > 0 ? 'right' : 'left');
                            } else {
                                setDragX(0);
                            }
                            window.removeEventListener('mousemove', handleMouseMove);
                            window.removeEventListener('mouseup', handleMouseUp);
                        };
                        window.addEventListener('mousemove', handleMouseMove);
                        window.addEventListener('mouseup', handleMouseUp);
                    }}
                >
                    <ModCard
                        mod={currentMod}
                        logicScore={currentScores.logic}
                        aiScore={currentScores.ai}
                    />

                    {/* Swipe Indicators */}
                    {dragX > 50 && (
                        <div style={{
                            position: 'absolute',
                            top: '2rem',
                            left: '2rem',
                            border: '4px solid var(--color-success)',
                            color: 'var(--color-success)',
                            padding: '0.5rem 1rem',
                            fontSize: '2rem',
                            fontWeight: 'bold',
                            transform: 'rotate(-15deg)',
                            borderRadius: '8px'
                        }}>
                            APPROVE
                        </div>
                    )}
                    {dragX < -50 && (
                        <div style={{
                            position: 'absolute',
                            top: '2rem',
                            right: '2rem',
                            border: '4px solid var(--color-error)',
                            color: 'var(--color-error)',
                            padding: '0.5rem 1rem',
                            fontSize: '2rem',
                            fontWeight: 'bold',
                            transform: 'rotate(15deg)',
                            borderRadius: '8px'
                        }}>
                            REJECT
                        </div>
                    )}
                </div>
            )}

            {/* Controls */}
            <div style={{
                position: 'absolute',
                bottom: '-80px',
                left: 0,
                right: 0,
                display: 'flex',
                justifyContent: 'center',
                gap: '2rem'
            }}>
                <button
                    onClick={() => handleSwipe('left')}
                    style={{
                        background: 'var(--color-error)',
                        color: 'white',
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        fontSize: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    ✕
                </button>
                <button
                    onClick={() => handleSwipe('right')}
                    style={{
                        background: 'var(--color-success)',
                        color: 'white',
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        fontSize: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    ✓
                </button>
            </div>
        </div>
    );
};

export default SwipeDeck;
