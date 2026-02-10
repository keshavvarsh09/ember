import React, { useState } from 'react';
import { useGame } from '../engine/gameState';

function generatePairCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
    return code;
}

const avatars = ['🌙', '⭐', '🔥', '💜', '🌹', '✨', '💎', '🦋', '🌊', '🖤', '💫', '🍷'];

export default function Onboarding() {
    const { state, dispatch } = useGame();
    const [step, setStep] = useState(1); // 1: name, 2: avatar, 3: create/join, 4: pair code, 5: partner setup
    const [name, setName] = useState(state.userProfile.name || '');
    const [avatar, setAvatar] = useState(state.userProfile.avatar || '🌙');
    const [mode, setMode] = useState(null); // 'create' | 'join'
    const [joinCode, setJoinCode] = useState('');
    const [partnerName, setPartnerName] = useState('');
    const [error, setError] = useState('');

    const handleNameSubmit = () => {
        if (name.trim().length < 2) {
            setError('Enter at least 2 characters');
            return;
        }
        dispatch({ type: 'SET_USER_PROFILE', payload: { name: name.trim() } });
        setError('');
        setStep(2);
    };

    const handleAvatarSelect = (a) => {
        setAvatar(a);
        dispatch({ type: 'SET_USER_PROFILE', payload: { avatar: a } });
    };

    const handleCreateRoom = () => {
        const code = generatePairCode();
        dispatch({ type: 'GENERATE_PAIR_CODE', payload: code });
        setMode('create');
        setStep(4);
    };

    const handleJoinRoom = () => {
        setMode('join');
        setStep(4);
    };

    const handleJoinSubmit = () => {
        if (joinCode.trim().length < 4) {
            setError('Enter a valid pair code');
            return;
        }
        setError('');
        setStep(5);
    };

    const handlePartnerSetup = () => {
        dispatch({
            type: 'JOIN_PAIR',
            payload: { name: partnerName || 'Your Partner', preferences: [], heatLevel: 2 },
        });
        dispatch({ type: 'SET_SCREEN', payload: 'profile' });
    };

    const simulatePartnerJoin = () => {
        setStep(5);
    };

    return (
        <div className="onboarding page-enter">
            <div className="container">
                {/* Progress dots */}
                <div className="onboarding__progress">
                    {[1, 2, 3, 4, 5].map((s) => (
                        <div
                            key={s}
                            className={`onboarding__dot ${s === step ? 'onboarding__dot--active' : ''} ${s < step ? 'onboarding__dot--done' : ''}`}
                        />
                    ))}
                </div>

                {/* Step 1: Name */}
                {step === 1 && (
                    <div className="onboarding__step animate-fade-in-up">
                        <div className="onboarding__icon">✨</div>
                        <h2 className="onboarding__title font-story">What should we call you?</h2>
                        <p className="onboarding__subtitle">Your partner will see this name.</p>
                        <div className="input-group">
                            <input
                                className="input-field"
                                type="text"
                                placeholder="Your name or nickname..."
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleNameSubmit()}
                                autoFocus
                                maxLength={20}
                            />
                        </div>
                        {error && <p className="onboarding__error">{error}</p>}
                        <button className="btn btn--primary btn--full" onClick={handleNameSubmit} style={{ marginTop: '1.5rem' }}>
                            Continue
                        </button>
                    </div>
                )}

                {/* Step 2: Avatar */}
                {step === 2 && (
                    <div className="onboarding__step animate-fade-in-up">
                        <div className="onboarding__icon">{avatar}</div>
                        <h2 className="onboarding__title font-story">Pick your vibe</h2>
                        <p className="onboarding__subtitle">Choose an avatar that feels like you tonight.</p>
                        <div className="onboarding__avatar-grid">
                            {avatars.map((a) => (
                                <button
                                    key={a}
                                    className={`onboarding__avatar-btn ${a === avatar ? 'onboarding__avatar-btn--selected' : ''}`}
                                    onClick={() => handleAvatarSelect(a)}
                                >
                                    {a}
                                </button>
                            ))}
                        </div>
                        <button className="btn btn--primary btn--full" onClick={() => setStep(3)} style={{ marginTop: '1.5rem' }}>
                            Continue
                        </button>
                    </div>
                )}

                {/* Step 3: Create or Join */}
                {step === 3 && (
                    <div className="onboarding__step animate-fade-in-up">
                        <div className="onboarding__icon">👥</div>
                        <h2 className="onboarding__title font-story">Connect with your partner</h2>
                        <p className="onboarding__subtitle">Play together. That's the whole point.</p>
                        <div className="onboarding__pair-options">
                            <button className="glass-card onboarding__pair-card" onClick={handleCreateRoom}>
                                <span className="onboarding__pair-icon">🔗</span>
                                <span className="onboarding__pair-label">Create a Room</span>
                                <span className="onboarding__pair-desc">Generate a code for your partner</span>
                            </button>
                            <button className="glass-card onboarding__pair-card" onClick={handleJoinRoom}>
                                <span className="onboarding__pair-icon">🎟️</span>
                                <span className="onboarding__pair-label">Join a Room</span>
                                <span className="onboarding__pair-desc">Enter your partner's code</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 4: Code display or entry */}
                {step === 4 && mode === 'create' && (
                    <div className="onboarding__step animate-fade-in-up">
                        <div className="onboarding__icon">🔗</div>
                        <h2 className="onboarding__title font-story">Your Room Code</h2>
                        <p className="onboarding__subtitle">Share this with your partner</p>
                        <div className="onboarding__code-display">
                            {state.pairCode?.split('').map((c, i) => (
                                <span key={i} className="onboarding__code-char animate-scale-in" style={{ animationDelay: `${i * 100}ms` }}>
                                    {c}
                                </span>
                            ))}
                        </div>
                        <div className="onboarding__waiting">
                            <div className="onboarding__pulse" />
                            <span>Waiting for partner to join...</span>
                        </div>
                        <button className="btn btn--secondary btn--full" onClick={simulatePartnerJoin} style={{ marginTop: '1.5rem' }}>
                            Partner Joined ✓ (Demo)
                        </button>
                    </div>
                )}

                {step === 4 && mode === 'join' && (
                    <div className="onboarding__step animate-fade-in-up">
                        <div className="onboarding__icon">🎟️</div>
                        <h2 className="onboarding__title font-story">Enter Room Code</h2>
                        <p className="onboarding__subtitle">The code your partner shared with you</p>
                        <div className="input-group">
                            <input
                                className="input-field onboarding__code-input"
                                type="text"
                                placeholder="XXXXXX"
                                value={joinCode}
                                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                                maxLength={6}
                                autoFocus
                                style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.3em', fontWeight: 700 }}
                            />
                        </div>
                        {error && <p className="onboarding__error">{error}</p>}
                        <button className="btn btn--primary btn--full" onClick={handleJoinSubmit} style={{ marginTop: '1.5rem' }}>
                            Join Room 🔥
                        </button>
                    </div>
                )}

                {/* Step 5: Partner name (demo) */}
                {step === 5 && (
                    <div className="onboarding__step animate-fade-in-up">
                        <div className="onboarding__icon">💞</div>
                        <h2 className="onboarding__title font-story">Connected!</h2>
                        <p className="onboarding__subtitle">What's your partner's name?</p>
                        <div className="input-group">
                            <input
                                className="input-field"
                                type="text"
                                placeholder="Their name or nickname..."
                                value={partnerName}
                                onChange={(e) => setPartnerName(e.target.value)}
                                autoFocus
                                maxLength={20}
                            />
                        </div>
                        <button className="btn btn--primary btn--full" onClick={handlePartnerSetup} style={{ marginTop: '1.5rem' }}>
                            Let's Set Up Your Tastes 🌙
                        </button>
                    </div>
                )}

                {step > 1 && (
                    <button className="btn btn--ghost" onClick={() => setStep(step - 1)} style={{ marginTop: '1rem' }}>
                        ← Back
                    </button>
                )}
            </div>
        </div>
    );
}
