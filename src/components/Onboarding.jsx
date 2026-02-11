import React, { useState, useEffect } from 'react';
import { useGame } from '../engine/gameState';
import { supabase } from '../lib/supabaseClient';
import useRoom from '../hooks/useRoom';
import Icon from './ui/Icons';
import Avatar, { AvatarPicker } from './ui/Avatar';

const GENDERS = [
    { id: 'he', label: 'He / Him', icon: 'user' },
    { id: 'she', label: 'She / Her', icon: 'user' },
    { id: 'they', label: 'They / Them', icon: 'users' },
    { id: 'custom', label: 'Custom', icon: 'sparkle' },
];

const LOVE_LANGS = [
    { id: 'touch', label: 'Physical Touch' },
    { id: 'words', label: 'Words of Affirmation' },
    { id: 'acts', label: 'Acts of Service' },
    { id: 'gifts', label: 'Receiving Gifts' },
    { id: 'time', label: 'Quality Time' },
];

export default function Onboarding() {
    const { state, dispatch } = useGame();
    const [step, setStep] = useState(0);
    const [name, setName] = useState(state.userProfile.name || '');
    const [gender, setGender] = useState(state.userProfile.gender || '');
    const [customGender, setCustomGender] = useState('');
    const [avatarId, setAvatarId] = useState(state.userProfile.avatarId || 'av-01');
    const [bio, setBio] = useState(state.userProfile.bio || '');
    const [loveLang, setLoveLang] = useState(state.userProfile.loveLang || '');
    const [turnOn, setTurnOn] = useState(state.userProfile.turnOn || '');
    const [fantasy, setFantasy] = useState(state.userProfile.secretFantasy || '');
    const [pairMode, setPairMode] = useState(null);
    const [joinCode, setJoinCode] = useState('');
    const [error, setError] = useState('');
    const [partnerJoined, setPartnerJoined] = useState(false);
    const [partnerData, setPartnerData] = useState(null);

    // Create userId on mount if none
    useEffect(() => {
        if (!state.userId) {
            const id = crypto.randomUUID();
            dispatch({ type: 'SET_USER_ID', payload: id });
        }
    }, []);

    const userId = state.userId || crypto.randomUUID();

    const room = useRoom(userId, {
        name,
        avatar_id: avatarId,
    });

    // Listen for partner events
    useEffect(() => {
        room.on('onPartnerJoin', (partner) => {
            setPartnerJoined(true);
            setPartnerData(partner);
        });

        room.on('onRoomPaired', async (roomData) => {
            if (roomData.partner_id) {
                setPartnerJoined(true);
                // Fetch partner profile
                const { data } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', roomData.partner_id)
                    .single();
                if (data) {
                    setPartnerData(data);
                    dispatch({
                        type: 'SET_PARTNER_PROFILE',
                        payload: {
                            name: data.name,
                            avatarId: data.avatar_id,
                            gender: data.gender,
                            pronouns: data.pronouns,
                            bio: data.bio,
                            loveLang: data.love_lang,
                            turnOn: data.turn_on,
                            secretFantasy: data.fantasy,
                        },
                    });
                }
            }
        });
    }, [room]);

    // Save profile to Supabase
    const saveProfile = async () => {
        const profile = {
            id: userId,
            name,
            avatar_id: avatarId,
            gender: gender === 'custom' ? customGender : gender,
            pronouns: gender === 'he' ? 'he' : gender === 'she' ? 'she' : 'they',
            bio,
            love_lang: loveLang,
            turn_on: turnOn,
            fantasy,
            heat_level: state.userProfile.heatLevel,
            preferences: state.userProfile.preferences,
        };

        const { error: err } = await supabase
            .from('profiles')
            .upsert(profile, { onConflict: 'id' });

        if (err) console.error('Profile save error:', err);

        dispatch({
            type: 'SET_USER_PROFILE',
            payload: {
                name,
                avatarId,
                gender: gender === 'custom' ? customGender : gender,
                pronouns: profile.pronouns,
                bio,
                loveLang: loveLang,
                turnOn,
                secretFantasy: fantasy,
            },
        });
    };

    // Handle room creation
    const handleCreateRoom = async () => {
        await saveProfile();
        const result = await room.createRoom();
        if (result) {
            dispatch({ type: 'SET_ROOM', payload: { roomId: result.roomId, roomCode: result.code } });
            setStep(5);
        }
    };

    // Handle room joining
    const handleJoinRoom = async () => {
        if (joinCode.length < 6) {
            setError('Enter the complete 6-character code');
            return;
        }
        await saveProfile();
        const result = await room.joinRoom(joinCode);
        if (result) {
            dispatch({ type: 'SET_ROOM', payload: { roomId: result.roomId, roomCode: result.code } });

            // Fetch creator profile
            const { data } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', result.creatorId)
                .single();

            if (data) {
                setPartnerData(data);
                setPartnerJoined(true);
                dispatch({
                    type: 'SET_PARTNER_PROFILE',
                    payload: {
                        name: data.name,
                        avatarId: data.avatar_id,
                        gender: data.gender,
                        pronouns: data.pronouns,
                        bio: data.bio,
                        loveLang: data.love_lang,
                        turnOn: data.turn_on,
                        secretFantasy: data.fantasy,
                    },
                });
            }
            setStep(6);
        } else {
            setError(room.error || 'Could not join room');
        }
    };

    // Proceed to lobby
    const goToLobby = () => {
        dispatch({ type: 'SET_CONNECTION_STATUS', payload: 'connected' });
        dispatch({ type: 'SET_PARTNER_ONLINE', payload: true });
        dispatch({ type: 'SET_SCREEN', payload: 'profile' });
    };

    const canProceed = () => {
        switch (step) {
            case 0: return name.trim().length >= 2;
            case 1: return !!avatarId;
            case 2: return gender !== '' && (gender !== 'custom' || customGender.trim());
            case 3: return true; // profile fields optional
            case 4: return pairMode !== null;
            default: return true;
        }
    };

    const nextStep = () => {
        if (step === 4 && pairMode === 'create') {
            handleCreateRoom();
            return;
        }
        setStep(s => s + 1);
    };

    return (
        <div className="screen onboarding">
            <div className="screen__content">
                {/* Progress dots */}
                <div className="onboarding__progress">
                    {[0, 1, 2, 3, 4, 5, 6].map(i => (
                        <div
                            key={i}
                            className={`onboarding__dot ${i === step ? 'onboarding__dot--active' : ''} ${i < step ? 'onboarding__dot--done' : ''}`}
                        />
                    ))}
                </div>

                {/* Step 0: Name */}
                {step === 0 && (
                    <div className="animate-fade-in">
                        <h2 className="screen__title">What should we call you?</h2>
                        <p className="screen__subtitle">Your partner will see this name</p>
                        <input
                            className="input-field"
                            placeholder="Your name..."
                            value={name}
                            onChange={e => setName(e.target.value)}
                            maxLength={20}
                            autoFocus
                        />
                    </div>
                )}

                {/* Step 1: Avatar */}
                {step === 1 && (
                    <div className="animate-fade-in">
                        <h2 className="screen__title">Choose your avatar</h2>
                        <p className="screen__subtitle">Pick the one that feels like you</p>
                        <div style={{ marginTop: 24 }}>
                            <AvatarPicker selected={avatarId} onSelect={setAvatarId} />
                        </div>
                    </div>
                )}

                {/* Step 2: Gender */}
                {step === 2 && (
                    <div className="animate-fade-in">
                        <h2 className="screen__title">How do you identify?</h2>
                        <div className="onboarding__gender-grid" style={{ marginTop: 24 }}>
                            {GENDERS.map(g => (
                                <div
                                    key={g.id}
                                    className={`onboarding__gender-pill ${gender === g.id ? 'onboarding__gender-pill--active' : ''}`}
                                    onClick={() => setGender(g.id)}
                                >
                                    <Icon name={g.icon} size={18} />
                                    <span>{g.label}</span>
                                </div>
                            ))}
                        </div>
                        {gender === 'custom' && (
                            <input
                                className="input-field"
                                placeholder="Your pronouns..."
                                value={customGender}
                                onChange={e => setCustomGender(e.target.value)}
                                style={{ marginTop: 16 }}
                            />
                        )}
                    </div>
                )}

                {/* Step 3: Profile details */}
                {step === 3 && (
                    <div className="animate-fade-in">
                        <h2 className="screen__title">Tell us about you</h2>
                        <p className="screen__subtitle">Optional — share as much as you want</p>
                        <div className="onboarding__profile-fields">
                            <div>
                                <label className="onboarding__field-label">Bio</label>
                                <textarea
                                    className="input-field onboarding__textarea"
                                    placeholder="A few words about yourself..."
                                    value={bio}
                                    onChange={e => setBio(e.target.value)}
                                    maxLength={200}
                                />
                                <span className="onboarding__char-count">{bio.length}/200</span>
                            </div>
                            <div>
                                <label className="onboarding__field-label">Love Language</label>
                                <div className="onboarding__love-lang-grid">
                                    {LOVE_LANGS.map(l => (
                                        <div
                                            key={l.id}
                                            className={`onboarding__love-pill ${loveLang === l.id ? 'onboarding__love-pill--active' : ''}`}
                                            onClick={() => setLoveLang(l.id)}
                                        >
                                            <Icon name="heart" size={14} />
                                            <span>{l.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="onboarding__field-label">What turns you on?</label>
                                <textarea
                                    className="input-field onboarding__textarea"
                                    placeholder="Be honest... this stays between you two"
                                    value={turnOn}
                                    onChange={e => setTurnOn(e.target.value)}
                                    maxLength={200}
                                />
                            </div>
                            <div>
                                <label className="onboarding__field-label">Secret Fantasy</label>
                                <textarea
                                    className="input-field onboarding__textarea onboarding__textarea--fantasy"
                                    placeholder="Something you've never told anyone..."
                                    value={fantasy}
                                    onChange={e => setFantasy(e.target.value)}
                                    maxLength={300}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 4: Create or Join */}
                {step === 4 && (
                    <div className="animate-fade-in">
                        <h2 className="screen__title">Connect with your partner</h2>
                        <p className="screen__subtitle">Create a room or join an existing one</p>
                        <div className="onboarding__pair-options">
                            <div
                                className={`glass-card onboarding__pair-card ${pairMode === 'create' ? 'onboarding__gender-pill--active' : ''}`}
                                onClick={() => setPairMode('create')}
                            >
                                <Icon name="plus" size={32} color="#e84393" />
                                <span className="onboarding__pair-label">Create Room</span>
                                <span className="onboarding__pair-desc">
                                    Get a code to share with your partner
                                </span>
                            </div>
                            <div
                                className={`glass-card onboarding__pair-card ${pairMode === 'join' ? 'onboarding__gender-pill--active' : ''}`}
                                onClick={() => setPairMode('join')}
                            >
                                <Icon name="link" size={32} color="#8b5cf6" />
                                <span className="onboarding__pair-label">Join Room</span>
                                <span className="onboarding__pair-desc">
                                    Enter the code your partner shared
                                </span>
                            </div>
                        </div>

                        {pairMode === 'join' && (
                            <div style={{ marginTop: 24 }}>
                                <input
                                    className="input-field"
                                    placeholder="Enter 6-character code..."
                                    value={joinCode}
                                    onChange={e => setJoinCode(e.target.value.toUpperCase())}
                                    maxLength={6}
                                    style={{ textAlign: 'center', letterSpacing: '0.3em', fontSize: '1.2rem' }}
                                />
                                <button
                                    className="btn btn--primary"
                                    onClick={handleJoinRoom}
                                    disabled={joinCode.length < 6}
                                    style={{ width: '100%', marginTop: 12 }}
                                >
                                    Join Room
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Step 5: Waiting for partner (creator) */}
                {step === 5 && (
                    <div className="animate-fade-in" style={{ textAlign: 'center' }}>
                        <h2 className="screen__title">Share this code</h2>
                        <p className="screen__subtitle">Give this code to your partner</p>

                        <div className="onboarding__code-display">
                            {(room.roomCode || '------').split('').map((char, i) => (
                                <div key={i} className="onboarding__code-char">{char}</div>
                            ))}
                        </div>

                        {!partnerJoined ? (
                            <div className="onboarding__waiting">
                                <div className="onboarding__pulse" />
                                <span>Waiting for partner to join...</span>
                            </div>
                        ) : (
                            <div className="animate-scale-in" style={{ marginTop: 24 }}>
                                <Avatar id={partnerData?.avatar_id || 'av-02'} size={80} />
                                <h3 style={{ marginTop: 12 }}>{partnerData?.name || 'Partner'} joined!</h3>
                                <button className="btn btn--primary" onClick={goToLobby} style={{ marginTop: 16 }}>
                                    <Icon name="arrow-right" size={18} />
                                    <span>Continue Together</span>
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Step 6: Partner connected (joiner) */}
                {step === 6 && (
                    <div className="animate-fade-in" style={{ textAlign: 'center' }}>
                        <div className="animate-scale-in">
                            <Icon name="check-circle" size={64} color="#4ade80" />
                            <h2 className="screen__title" style={{ marginTop: 16 }}>Connected!</h2>
                            <p className="screen__subtitle">You're paired with {partnerData?.name || 'your partner'}</p>
                            {partnerData && (
                                <div style={{ margin: '24px 0' }}>
                                    <Avatar id={partnerData.avatar_id || 'av-02'} size={80} />
                                </div>
                            )}
                            <button className="btn btn--primary" onClick={goToLobby} style={{ marginTop: 16, width: '100%' }}>
                                <Icon name="arrow-right" size={18} />
                                <span>Enter GARF</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* Error message */}
                {error && <p className="onboarding__error">{error}</p>}

                {/* Navigation buttons (steps 0-4) */}
                {step <= 4 && step !== 5 && (
                    <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
                        {step > 0 && (
                            <button className="btn btn--secondary" onClick={() => setStep(s => s - 1)}>
                                <Icon name="arrow-left" size={16} />
                            </button>
                        )}
                        {!(step === 4 && pairMode === 'join') && (
                            <button
                                className="btn btn--primary"
                                onClick={nextStep}
                                disabled={!canProceed()}
                                style={{ flex: 1 }}
                            >
                                {step === 4 && pairMode === 'create' ? 'Create Room' : 'Continue'}
                                <Icon name="arrow-right" size={16} />
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
