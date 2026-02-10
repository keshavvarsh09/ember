import React, { useState, useEffect } from 'react';
import { useGame } from '../engine/gameState';
import { getRandomDare, getDaresByHeat } from '../data/dares';
import { tiers } from '../data/categories';

export default function DareChallenge() {
    const { state, dispatch } = useGame();
    const [currentDare, setCurrentDare] = useState(null);
    const [heatFilter, setHeatFilter] = useState(state.userProfile.heatLevel || 2);
    const [phase, setPhase] = useState('browse'); // browse | active | completed
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        setCurrentDare(getRandomDare(heatFilter));
    }, [heatFilter]);

    useEffect(() => {
        if (phase === 'active' && timeLeft > 0) {
            const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
            return () => clearInterval(timer);
        }
        if (phase === 'active' && timeLeft === 0) {
            setPhase('completed');
        }
    }, [phase, timeLeft]);

    const handleAcceptDare = () => {
        setPhase('active');
        setTimeLeft(60); // 60 second timer for dare
    };

    const handleCompleteDare = () => {
        setPhase('completed');
        dispatch({ type: 'COMPLETE_STORY', payload: { score: currentDare.heat * 15 } });
    };

    const handleNewDare = () => {
        setCurrentDare(getRandomDare(heatFilter));
        setPhase('browse');
    };

    const formatTime = (s) => {
        const mins = Math.floor(s / 60);
        const secs = s % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="dare page-enter">
            <div className="container">
                <button className="btn btn--ghost" onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'lobby' })}>
                    ← Back
                </button>

                <div className="dare__header animate-fade-in-up">
                    <h2 className="dare__title font-story">
                        <span className="text-gradient">Dare</span> Mode 🎯
                    </h2>
                    <p className="dare__subtitle">Accept the dare. Do it. Both of you.</p>
                </div>

                {/* Heat filter */}
                <div className="dare__heat-filter animate-fade-in-up delay-1">
                    <span className="dare__heat-label">Max Heat:</span>
                    <div className="dare__heat-options">
                        {tiers.map((tier) => (
                            <button
                                key={tier.id}
                                className={`dare__heat-btn ${heatFilter >= tier.id ? 'dare__heat-btn--active' : ''}`}
                                style={{ color: heatFilter >= tier.id ? tier.color : undefined }}
                                onClick={() => setHeatFilter(tier.id)}
                            >
                                {tier.emoji}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Browse Phase */}
                {phase === 'browse' && currentDare && (
                    <div className="dare__card glass-card animate-scale-in" key={currentDare.id}>
                        <div className="dare__card-heat">
                            {'🔥'.repeat(currentDare.heat)}
                            <span className="dare__card-heat-label">Heat {currentDare.heat}/5</span>
                        </div>
                        <p className="dare__card-text font-story">{currentDare.text}</p>
                        <div className="dare__card-actions">
                            <button className="btn btn--primary btn--large btn--full" onClick={handleAcceptDare}>
                                Accept Dare 🎯
                            </button>
                            <button className="btn btn--secondary btn--full" onClick={handleNewDare} style={{ marginTop: '0.75rem' }}>
                                Shuffle 🎲
                            </button>
                        </div>
                    </div>
                )}

                {/* Active Phase */}
                {phase === 'active' && currentDare && (
                    <div className="dare__active animate-fade-in">
                        <div className="dare__timer">
                            <svg viewBox="0 0 120 120" className="dare__timer-svg">
                                <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
                                <circle
                                    cx="60" cy="60" r="52"
                                    fill="none"
                                    stroke="url(#timerGradient)"
                                    strokeWidth="6"
                                    strokeLinecap="round"
                                    strokeDasharray={`${(timeLeft / 60) * 327} 327`}
                                    transform="rotate(-90 60 60)"
                                />
                                <defs>
                                    <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#e84393" />
                                        <stop offset="100%" stopColor="#ff6b35" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div className="dare__timer-value">{formatTime(timeLeft)}</div>
                        </div>
                        <p className="dare__active-text font-story">{currentDare.text}</p>
                        <button className="btn btn--primary btn--large btn--full" onClick={handleCompleteDare} style={{ marginTop: '2rem' }}>
                            Done! ✓
                        </button>
                    </div>
                )}

                {/* Completed Phase */}
                {phase === 'completed' && (
                    <div className="dare__completed animate-scale-in">
                        <div className="dare__completed-icon">✨</div>
                        <h3 className="font-story dare__completed-title">Dare Complete!</h3>
                        <p className="dare__completed-score">+{currentDare.heat * 15} 🔥</p>
                        <button className="btn btn--primary btn--full" onClick={handleNewDare} style={{ marginTop: '1.5rem' }}>
                            Another Dare 🎲
                        </button>
                        <button className="btn btn--ghost" onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'lobby' })} style={{ marginTop: '0.5rem' }}>
                            Back to Lobby
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
