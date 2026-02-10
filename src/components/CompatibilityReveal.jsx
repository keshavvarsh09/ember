import React, { useState, useEffect } from 'react';
import { useGame } from '../engine/gameState';
import { categories } from '../data/categories';

export default function CompatibilityReveal() {
    const { state, dispatch } = useGame();
    const [phase, setPhase] = useState('loading'); // loading | reveal | complete
    const [revealedCount, setRevealedCount] = useState(0);
    const [scoreVisible, setScoreVisible] = useState(false);

    // Simulate partner preferences (in real app, fetched from partner)
    const simulatedPartnerPrefs = ['sweet-talk', 'teasing', 'dirty-talk', 'roleplay', 'fantasy-sharing', 'massage', 'innuendo', 'sensory-play'];

    useEffect(() => {
        // Simulate partner prefs if not already set
        if (state.partnerProfile.preferences.length === 0) {
            dispatch({
                type: 'SET_PARTNER_PROFILE',
                payload: { preferences: simulatedPartnerPrefs },
            });
        }
    }, []);

    useEffect(() => {
        if (phase === 'loading') {
            const timer = setTimeout(() => setPhase('reveal'), 2500);
            return () => clearTimeout(timer);
        }
    }, [phase]);

    const userPrefs = new Set(state.userProfile.preferences);
    const partnerPrefs = new Set(state.partnerProfile.preferences.length > 0 ? state.partnerProfile.preferences : simulatedPartnerPrefs);
    const shared = [...userPrefs].filter((p) => partnerPrefs.has(p));
    const userOnly = [...userPrefs].filter((p) => !partnerPrefs.has(p));
    const partnerOnly = [...partnerPrefs].filter((p) => !userPrefs.has(p));

    const totalUnique = new Set([...userPrefs, ...partnerPrefs]).size;
    const compatScore = totalUnique > 0 ? Math.max(Math.round((shared.length / totalUnique) * 100), 42) : 62;

    useEffect(() => {
        if (phase === 'reveal') {
            const interval = setInterval(() => {
                setRevealedCount((prev) => {
                    if (prev >= shared.length) {
                        clearInterval(interval);
                        setTimeout(() => setScoreVisible(true), 500);
                        return prev;
                    }
                    return prev + 1;
                });
            }, 400);
            return () => clearInterval(interval);
        }
    }, [phase, shared.length]);

    const getCatInfo = (id) => categories.find((c) => c.id === id);

    const handleContinue = () => {
        dispatch({ type: 'SET_SCREEN', payload: 'lobby' });
    };

    return (
        <div className="compat page-enter">
            <div className="container">
                {/* Loading Phase */}
                {phase === 'loading' && (
                    <div className="compat__loading">
                        <div className="compat__loading-icon animate-breathe">💞</div>
                        <h2 className="compat__loading-text font-story animate-fade-in">
                            Comparing your desires...
                        </h2>
                        <div className="compat__loading-bar">
                            <div className="compat__loading-fill" />
                        </div>
                    </div>
                )}

                {/* Reveal Phase */}
                {phase === 'reveal' && (
                    <div className="compat__reveal animate-fade-in">
                        <h2 className="compat__title font-story">
                            You & {state.partnerProfile.name || 'Your Partner'}
                        </h2>

                        {/* Shared interests */}
                        {shared.length > 0 && (
                            <div className="compat__section">
                                <h3 className="compat__section-title">🔥 You Both Want</h3>
                                <div className="compat__items">
                                    {shared.map((id, i) => {
                                        const cat = getCatInfo(id);
                                        if (!cat || i >= revealedCount) return null;
                                        return (
                                            <div key={id} className="compat__item compat__item--shared animate-scale-in">
                                                <span className="compat__item-emoji">{cat.emoji}</span>
                                                <span className="compat__item-name">{cat.name}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Score reveal */}
                        {scoreVisible && (
                            <div className="compat__score-section animate-scale-in">
                                <div className="compat__score-ring">
                                    <svg viewBox="0 0 120 120" className="compat__score-svg">
                                        <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                                        <circle
                                            cx="60" cy="60" r="52"
                                            fill="none"
                                            stroke="url(#scoreGradient)"
                                            strokeWidth="8"
                                            strokeLinecap="round"
                                            strokeDasharray={`${(compatScore / 100) * 327} 327`}
                                            transform="rotate(-90 60 60)"
                                            className="compat__score-circle"
                                        />
                                        <defs>
                                            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" stopColor="#e84393" />
                                                <stop offset="100%" stopColor="#ff6b35" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                    <div className="compat__score-value">{compatScore}%</div>
                                </div>
                                <p className="compat__score-label font-story">
                                    {compatScore > 70 ? '🔥 You two are on fire' : compatScore > 50 ? '✨ Plenty to explore together' : '🌱 The best adventures start with curiosity'}
                                </p>
                            </div>
                        )}

                        {/* Unique interests hints */}
                        {scoreVisible && (userOnly.length > 0 || partnerOnly.length > 0) && (
                            <div className="compat__unique animate-fade-in-up">
                                {userOnly.length > 0 && (
                                    <p className="compat__unique-hint">
                                        💫 You have {userOnly.length} interest{userOnly.length > 1 ? 's' : ''} your partner hasn't explored yet...
                                    </p>
                                )}
                                {partnerOnly.length > 0 && (
                                    <p className="compat__unique-hint">
                                        🌙 They have {partnerOnly.length} interest{partnerOnly.length > 1 ? 's' : ''} waiting for you to discover...
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Continue */}
                        {scoreVisible && (
                            <button className="btn btn--primary btn--large btn--full animate-fade-in-up" onClick={handleContinue} style={{ marginTop: '2rem' }}>
                                Enter the Game 🎮
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
