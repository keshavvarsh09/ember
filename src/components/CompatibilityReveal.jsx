import React, { useState, useEffect } from 'react';
import { useGame } from '../engine/gameState';
import { categories } from '../data/categories';
import Icon from './ui/Icons';
import Avatar from './ui/Avatar';

export default function CompatibilityReveal() {
    const { state, dispatch } = useGame();
    const [phase, setPhase] = useState('loading'); // loading | reveal
    const [progressVal, setProgressVal] = useState(0);
    const { userProfile, partnerProfile, compatibilityScore } = state;

    // Animate loading bar
    useEffect(() => {
        if (phase !== 'loading') return;
        const timer = setInterval(() => {
            setProgressVal(p => {
                if (p >= 100) {
                    clearInterval(timer);
                    setTimeout(() => setPhase('reveal'), 500);
                    return 100;
                }
                return p + 2;
            });
        }, 40);
        return () => clearInterval(timer);
    }, [phase]);

    const matchedPrefs = (userProfile.preferences || []).filter(p =>
        (partnerProfile.preferences || userProfile.preferences || []).includes(p)
    );

    const getCatInfo = (id) => categories?.find(c => c.id === id) || { name: id, emoji: '' };

    const handleContinue = () => {
        dispatch({ type: 'SET_SCREEN', payload: 'lobby' });
    };

    return (
        <div className="screen compatibility-reveal">
            <div className="screen__content" style={{ textAlign: 'center' }}>
                {phase === 'loading' && (
                    <div className="animate-fade-in" style={{ paddingTop: 80 }}>
                        <Icon name="sparkle" size={48} color="#e84393" />
                        <h2 className="screen__title" style={{ marginTop: 24 }}>
                            Calculating your connection...
                        </h2>
                        <div className="progress__ember-bar" style={{ marginTop: 32 }}>
                            <div className="progress__ember-fill" style={{ width: `${progressVal}%` }} />
                        </div>
                        <p className="screen__subtitle">{progressVal}%</p>
                    </div>
                )}

                {phase === 'reveal' && (
                    <div className="animate-scale-in">
                        {/* Score display */}
                        <div style={{ marginTop: 32 }}>
                            <div className="compat__score-ring">
                                <svg viewBox="0 0 120 120" style={{ width: 160, height: 160 }}>
                                    <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                                    <circle
                                        cx="60" cy="60" r="50"
                                        fill="none"
                                        stroke="url(#compatGrad)"
                                        strokeWidth="8"
                                        strokeLinecap="round"
                                        strokeDasharray={`${(compatibilityScore / 100) * 314} 314`}
                                        transform="rotate(-90 60 60)"
                                    />
                                    <defs>
                                        <linearGradient id="compatGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#e84393" />
                                            <stop offset="100%" stopColor="#8b5cf6" />
                                        </linearGradient>
                                    </defs>
                                    <text x="60" y="55" textAnchor="middle" fill="white" fontSize="28" fontWeight="700">
                                        {compatibilityScore}%
                                    </text>
                                    <text x="60" y="75" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11">
                                        compatibility
                                    </text>
                                </svg>
                            </div>
                        </div>

                        <h2 className="screen__title" style={{ marginTop: 16 }}>
                            {compatibilityScore >= 80 ? (
                                <>
                                    <Icon name="heart" size={24} color="#e84393" /> Perfect Match
                                </>
                            ) : compatibilityScore >= 60 ? (
                                <>
                                    <Icon name="flame" size={24} color="#ff6b35" /> Strong Connection
                                </>
                            ) : (
                                <>
                                    <Icon name="sparkle" size={24} color="#8b5cf6" /> Building Something
                                </>
                            )}
                        </h2>

                        {/* Matched interests */}
                        {matchedPrefs.length > 0 && (
                            <div className="glass-card" style={{ marginTop: 24, padding: 16, textAlign: 'left' }}>
                                <h3 style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <Icon name="heart" size={18} color="#e84393" />
                                    Shared Interests ({matchedPrefs.length})
                                </h3>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                    {matchedPrefs.map(p => {
                                        const cat = getCatInfo(p);
                                        return (
                                            <span key={p} className="monopoly__owned-tag">
                                                {cat.emoji} {cat.name}
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Avatars */}
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, marginTop: 24 }}>
                            <div style={{ textAlign: 'center' }}>
                                <Avatar id={userProfile.avatarId} size={56} />
                                <p style={{ marginTop: 4, fontSize: '0.85rem' }}>{userProfile.name}</p>
                            </div>
                            <Icon name="heart" size={24} color="#e84393" />
                            <div style={{ textAlign: 'center' }}>
                                <Avatar id={partnerProfile.avatarId} size={56} />
                                <p style={{ marginTop: 4, fontSize: '0.85rem' }}>{partnerProfile.name || 'Partner'}</p>
                            </div>
                        </div>

                        <button className="btn btn--primary btn--lg" onClick={handleContinue} style={{ width: '100%', marginTop: 32 }}>
                            <Icon name="arrow-right" size={18} />
                            <span>Enter the Lobby</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
