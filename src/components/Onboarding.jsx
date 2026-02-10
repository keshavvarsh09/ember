import React, { useState } from 'react';
import { useGame } from '../engine/gameState';

function generatePairCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
    return code;
}

const avatars = ['🌙', '⭐', '🔥', '💜', '🌹', '✨', '💎', '🦋', '🌊', '🖤', '💫', '🍷'];
const genderOptions = [
    { id: 'he', label: 'He / Him', emoji: '♂️' },
    { id: 'she', label: 'She / Her', emoji: '♀️' },
    { id: 'they', label: 'They / Them', emoji: '⚧️' },
    { id: 'custom', label: 'Custom', emoji: '✨' },
];
const loveLanguages = [
    { id: 'words', label: 'Words of Affirmation', emoji: '💬' },
    { id: 'touch', label: 'Physical Touch', emoji: '🤲' },
    { id: 'gifts', label: 'Receiving Gifts', emoji: '🎁' },
    { id: 'time', label: 'Quality Time', emoji: '⏰' },
    { id: 'acts', label: 'Acts of Service', emoji: '💝' },
];

export default function Onboarding() {
    const { state, dispatch } = useGame();
    const [step, setStep] = useState(1);
    const [name, setName] = useState(state.userProfile.name || '');
    const [gender, setGender] = useState(state.userProfile.gender || '');
    const [customGender, setCustomGender] = useState('');
    const [avatar, setAvatar] = useState(state.userProfile.avatar || '🌙');
    const [bio, setBio] = useState('');
    const [loveLang, setLoveLang] = useState('');
    const [turnOn, setTurnOn] = useState('');
    const [secretFantasy, setSecretFantasy] = useState('');
    const [mode, setMode] = useState(null);
    const [joinCode, setJoinCode] = useState('');
    const [partnerName, setPartnerName] = useState('');
    const [partnerGender, setPartnerGender] = useState('');
    const [error, setError] = useState('');

    const totalSteps = 7;

    const handleStep1 = () => {
        if (name.trim().length < 2) { setError('Enter at least 2 characters'); return; }
        if (!gender) { setError('Please select your gender'); return; }
        dispatch({
            type: 'SET_USER_PROFILE',
            payload: {
                name: name.trim(),
                gender: gender === 'custom' ? customGender : gender,
                pronouns: gender === 'he' ? 'he' : gender === 'she' ? 'she' : 'they',
            },
        });
        setError('');
        setStep(2);
    };

    const handleStep2 = () => {
        dispatch({ type: 'SET_USER_PROFILE', payload: { avatar } });
        setStep(3);
    };

    const handleStep3 = () => {
        if (!loveLang) { setError('Pick your love language'); return; }
        dispatch({
            type: 'SET_USER_PROFILE',
            payload: { bio, loveLang, turnOn, secretFantasy },
        });
        setError('');
        setStep(4);
    };

    const handleCreateRoom = () => {
        const code = generatePairCode();
        dispatch({ type: 'GENERATE_PAIR_CODE', payload: code });
        setMode('create');
        setStep(5);
    };

    const handleJoinRoom = () => {
        setMode('join');
        setStep(5);
    };

    const handleJoinSubmit = () => {
        if (joinCode.trim().length < 4) { setError('Enter a valid pair code'); return; }
        setError('');
        setStep(6);
    };

    const simulatePartnerJoin = () => {
        setStep(6);
    };

    const handlePartnerSetup = () => {
        dispatch({
            type: 'JOIN_PAIR',
            payload: {
                name: partnerName || 'Your Partner',
                gender: partnerGender,
                pronouns: partnerGender === 'he' ? 'he' : partnerGender === 'she' ? 'she' : 'they',
            },
        });
        dispatch({ type: 'SET_SCREEN', payload: 'profile' });
    };

    return (
        <div className="onboarding page-enter">
            <div className="container">
                {/* Progress dots */}
                <div className="onboarding__progress">
                    {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s) => (
                        <div
                            key={s}
                            className={`onboarding__dot ${s === step ? 'onboarding__dot--active' : ''} ${s < step ? 'onboarding__dot--done' : ''}`}
                        />
                    ))}
                </div>

                {/* Step 1: Name + Gender */}
                {step === 1 && (
                    <div className="onboarding__step animate-fade-in-up">
                        <div className="onboarding__icon">✨</div>
                        <h2 className="onboarding__title font-story">Who are you?</h2>
                        <p className="onboarding__subtitle">Your partner will see this. Make it count.</p>

                        <div className="input-group">
                            <input
                                className="input-field"
                                type="text"
                                placeholder="Your name or nickname..."
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleStep1()}
                                autoFocus
                                maxLength={20}
                            />
                        </div>

                        <div className="onboarding__gender-section">
                            <p className="onboarding__label">I go by...</p>
                            <div className="onboarding__gender-grid">
                                {genderOptions.map((g) => (
                                    <button
                                        key={g.id}
                                        className={`onboarding__gender-pill ${gender === g.id ? 'onboarding__gender-pill--active' : ''}`}
                                        onClick={() => setGender(g.id)}
                                    >
                                        <span>{g.emoji}</span>
                                        <span>{g.label}</span>
                                    </button>
                                ))}
                            </div>
                            {gender === 'custom' && (
                                <input
                                    className="input-field"
                                    type="text"
                                    placeholder="Your pronouns..."
                                    value={customGender}
                                    onChange={(e) => setCustomGender(e.target.value)}
                                    style={{ marginTop: '0.75rem' }}
                                />
                            )}
                        </div>

                        {error && <p className="onboarding__error">{error}</p>}
                        <button className="btn btn--primary btn--full" onClick={handleStep1} style={{ marginTop: '1.5rem' }}>
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
                                    onClick={() => setAvatar(a)}
                                >
                                    {a}
                                </button>
                            ))}
                        </div>
                        <button className="btn btn--primary btn--full" onClick={handleStep2} style={{ marginTop: '1.5rem' }}>
                            Continue
                        </button>
                    </div>
                )}

                {/* Step 3: Descriptive Profile */}
                {step === 3 && (
                    <div className="onboarding__step animate-fade-in-up">
                        <div className="onboarding__icon">🔥</div>
                        <h2 className="onboarding__title font-story">Let's get personal</h2>
                        <p className="onboarding__subtitle">The more you share, the better the experience. Be honest. Be bold.</p>

                        <div className="onboarding__profile-fields">
                            <div className="input-group">
                                <label className="onboarding__field-label">Tell your partner something they don't know...</label>
                                <textarea
                                    className="input-field onboarding__textarea"
                                    placeholder="Something secret, something vulnerable, something real..."
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    maxLength={200}
                                    rows={3}
                                />
                                <span className="onboarding__char-count">{bio.length}/200</span>
                            </div>

                            <div className="input-group">
                                <label className="onboarding__field-label">Your love language</label>
                                <div className="onboarding__love-lang-grid">
                                    {loveLanguages.map((l) => (
                                        <button
                                            key={l.id}
                                            className={`onboarding__love-pill ${loveLang === l.id ? 'onboarding__love-pill--active' : ''}`}
                                            onClick={() => setLoveLang(l.id)}
                                        >
                                            <span>{l.emoji}</span>
                                            <span>{l.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="input-group">
                                <label className="onboarding__field-label">The one thing that drives you wild 🔥</label>
                                <textarea
                                    className="input-field onboarding__textarea"
                                    placeholder="Be specific... what makes you lose your mind?"
                                    value={turnOn}
                                    onChange={(e) => setTurnOn(e.target.value)}
                                    maxLength={150}
                                    rows={2}
                                />
                                <span className="onboarding__char-count">{turnOn.length}/150</span>
                            </div>

                            <div className="input-group">
                                <label className="onboarding__field-label">Whisper a fantasy... just between you two 🌙</label>
                                <textarea
                                    className="input-field onboarding__textarea onboarding__textarea--fantasy"
                                    placeholder="The one you think about at 2am. No judgement. This is your safe space..."
                                    value={secretFantasy}
                                    onChange={(e) => setSecretFantasy(e.target.value)}
                                    maxLength={200}
                                    rows={3}
                                />
                                <span className="onboarding__char-count">{secretFantasy.length}/200</span>
                            </div>
                        </div>

                        {error && <p className="onboarding__error">{error}</p>}
                        <button className="btn btn--primary btn--full" onClick={handleStep3} style={{ marginTop: '1rem' }}>
                            Continue 🔥
                        </button>
                    </div>
                )}

                {/* Step 4: Create or Join */}
                {step === 4 && (
                    <div className="onboarding__step animate-fade-in-up">
                        <div className="onboarding__icon">👥</div>
                        <h2 className="onboarding__title font-story">Connect with your partner</h2>
                        <p className="onboarding__subtitle">This game is for two. Let's bring them in.</p>
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

                {/* Step 5: Code display or entry */}
                {step === 5 && mode === 'create' && (
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

                {step === 5 && mode === 'join' && (
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

                {/* Step 6: Partner connected */}
                {step === 6 && (
                    <div className="onboarding__step animate-fade-in-up">
                        <div className="onboarding__icon">💞</div>
                        <h2 className="onboarding__title font-story">They're here!</h2>
                        <p className="onboarding__subtitle">Tell us about your partner so we can personalize the experience.</p>

                        <div className="input-group">
                            <label className="onboarding__field-label">Partner's name</label>
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

                        <div className="onboarding__gender-section" style={{ marginTop: '1rem' }}>
                            <label className="onboarding__field-label">They go by...</label>
                            <div className="onboarding__gender-grid">
                                {genderOptions.filter(g => g.id !== 'custom').map((g) => (
                                    <button
                                        key={g.id}
                                        className={`onboarding__gender-pill ${partnerGender === g.id ? 'onboarding__gender-pill--active' : ''}`}
                                        onClick={() => setPartnerGender(g.id)}
                                    >
                                        <span>{g.emoji}</span>
                                        <span>{g.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button className="btn btn--primary btn--full" onClick={handlePartnerSetup} style={{ marginTop: '1.5rem' }}>
                            Let's Set Up Your Tastes 🌙
                        </button>
                    </div>
                )}

                {/* Step 7 transitions to ProfileSetup screen */}

                {step > 1 && (
                    <button className="btn btn--ghost" onClick={() => { setStep(step - 1); setError(''); }} style={{ marginTop: '1rem' }}>
                        ← Back
                    </button>
                )}
            </div>
        </div>
    );
}
