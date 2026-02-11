import React, { useState, useEffect } from 'react';
import { useGame } from '../engine/gameState';
import { getRandomDare, getDaresByHeat } from '../data/dares';
import { tiers } from '../data/categories';
import { sendGameEvent } from '../lib/realtimeManager';
import Icon from './ui/Icons';

const heatIcons = ['', 'heart', 'flame', 'fire', 'zap', 'star'];

export default function DareChallenge() {
    const { state, dispatch } = useGame();
    const [currentDare, setCurrentDare] = useState(null);
    const [heatFilter, setHeatFilter] = useState(state.userProfile.heatLevel || 2);
    const [phase, setPhase] = useState('browse');
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
        setTimeLeft(60);
        sendGameEvent('dare_accepted', { dare: currentDare, from: state.userId });
    };

    const handleCompleteDare = () => {
        setPhase('completed');
        dispatch({ type: 'COMPLETE_STORY', payload: { score: currentDare.heat * 15 } });
        sendGameEvent('dare_completed', { dare: currentDare, from: state.userId });
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
        <div className="screen dare-challenge">
            <div className="screen__content">
                <div className="game__header">
                    <button className="btn btn--icon" onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'lobby' })}>
                        <Icon name="arrow-left" size={20} />
                    </button>
                    <h2 className="game__title">
                        <Icon name="target" size={20} /> Dare Mode
                    </h2>
                </div>

                <p className="screen__subtitle">Accept the dare. Do it. Both of you.</p>

                {/* Heat filter */}
                <div className="dare__heat-filter">
                    <span className="dare__heat-label">Max Heat:</span>
                    <div className="dare__heat-options">
                        {tiers.map((tier) => (
                            <button
                                key={tier.id}
                                className={`dare__heat-btn ${heatFilter >= tier.id ? 'dare__heat-btn--active' : ''}`}
                                style={{ color: heatFilter >= tier.id ? tier.color : undefined }}
                                onClick={() => setHeatFilter(tier.id)}
                            >
                                <Icon name={heatIcons[tier.id] || 'heart'} size={16} />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Browse Phase */}
                {phase === 'browse' && currentDare && (
                    <div className="game__prompt glass-card animate-scale-in" key={currentDare.id}>
                        <div className="game__prompt-type">
                            {Array.from({ length: currentDare.heat }).map((_, i) => (
                                <Icon key={i} name="flame" size={16} color="#e84393" />
                            ))}
                            <span>Heat {currentDare.heat}/5</span>
                        </div>
                        <p className="game__prompt-text">{currentDare.text}</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
                            <button className="btn btn--primary" onClick={handleAcceptDare}>
                                <Icon name="target" size={16} />
                                <span>Accept Dare</span>
                            </button>
                            <button className="btn btn--secondary" onClick={handleNewDare}>
                                <Icon name="dice" size={16} />
                                <span>Shuffle</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* Active Phase */}
                {phase === 'active' && currentDare && (
                    <div className="animate-fade-in" style={{ textAlign: 'center' }}>
                        <div className="dare__timer" style={{ marginTop: 32 }}>
                            <svg viewBox="0 0 120 120" style={{ width: 140, height: 140 }}>
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
                        <p className="game__prompt-text" style={{ marginTop: 16 }}>{currentDare.text}</p>
                        <button className="btn btn--primary" onClick={handleCompleteDare} style={{ marginTop: 24 }}>
                            <Icon name="check" size={16} />
                            <span>Done!</span>
                        </button>
                    </div>
                )}

                {/* Completed Phase */}
                {phase === 'completed' && (
                    <div className="animate-scale-in" style={{ textAlign: 'center', marginTop: 48 }}>
                        <Icon name="sparkle" size={48} color="#ffd700" />
                        <h3 style={{ marginTop: 16 }}>Dare Complete!</h3>
                        <p className="game__prompt-text">
                            +{currentDare.heat * 15} <Icon name="fire" size={16} color="#ff6b35" />
                        </p>
                        <button className="btn btn--primary" onClick={handleNewDare} style={{ marginTop: 24 }}>
                            <Icon name="dice" size={16} />
                            <span>Another Dare</span>
                        </button>
                        <button className="btn btn--secondary" onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'lobby' })} style={{ marginTop: 12 }}>
                            Back to Lobby
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
