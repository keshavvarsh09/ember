import React, { useState } from 'react';
import { useGame } from '../engine/gameState';
import { stories, getStoryById } from '../data/stories';
import { sendGameEvent } from '../lib/realtimeManager';
import Icon from './ui/Icons';

const moods = [
    { id: 'tender', icon: 'heart', label: 'Tender', desc: 'Soft, romantic, emotional', color: '#ffa07a' },
    { id: 'playful', icon: 'sparkle', label: 'Playful', desc: 'Fun, teasing, light', color: '#ff6b9d' },
    { id: 'passionate', icon: 'flame', label: 'Passionate', desc: 'Intense, burning, urgent', color: '#e84393' },
    { id: 'adventurous', icon: 'zap', label: 'Adventurous', desc: 'Bold, exploring, daring', color: '#8b5cf6' },
    { id: 'primal', icon: 'fire', label: 'Primal', desc: 'Raw, unfiltered, dominant', color: '#ff4757' },
];

const moodToStory = {
    tender: 'midnight-encounter',
    playful: 'the-dare',
    passionate: 'hotel-room',
    adventurous: 'the-dare',
    primal: 'hotel-room',
};

export default function MoodSelector() {
    const { state, dispatch } = useGame();
    const [selectedMood, setSelectedMood] = useState(null);
    const [partnerMood, setPartnerMood] = useState(null);
    const [phase, setPhase] = useState('select');

    const handleMoodSelect = (mood) => {
        setSelectedMood(mood);
        dispatch({ type: 'SET_MOOD', payload: mood.id });
    };

    const handleConfirm = () => {
        setPhase('waiting');
        // Broadcast mood to partner
        sendGameEvent('mood_select', { mood: selectedMood, from: state.userId });

        // Wait for partner mood (or timeout with simulated)
        setTimeout(() => {
            if (!partnerMood) {
                const pm = moods[Math.floor(Math.random() * moods.length)];
                setPartnerMood(pm);
                dispatch({ type: 'SET_PARTNER_MOOD', payload: pm.id });
            }
            setPhase('matched');
        }, 3000);
    };

    const handleStartStory = () => {
        const storyId = moodToStory[selectedMood?.id] || 'midnight-encounter';
        const story = getStoryById(storyId);
        if (story) {
            dispatch({
                type: 'START_STORY',
                payload: { story, startNode: 'start' },
            });
        }
    };

    return (
        <div className="screen mood-selector">
            <div className="screen__content">
                <div className="game__header">
                    <button className="btn btn--icon" onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'lobby' })}>
                        <Icon name="arrow-left" size={20} />
                    </button>
                    <h2 className="game__title">Set the Mood</h2>
                </div>

                {phase === 'select' && (
                    <div className="animate-fade-in">
                        <h2 className="screen__title">
                            What's the <span className="gradient-text">mood</span> tonight?
                        </h2>
                        <p className="screen__subtitle">
                            Both of you pick — the game adapts to where you both are.
                        </p>

                        <div className="mood-select__grid">
                            {moods.map((mood, i) => (
                                <button
                                    key={mood.id}
                                    className={`mood-select__card glass-card ${selectedMood?.id === mood.id ? 'mood-select__card--selected' : ''}`}
                                    style={{
                                        borderColor: selectedMood?.id === mood.id ? mood.color : undefined,
                                        boxShadow: selectedMood?.id === mood.id ? `0 0 30px ${mood.color}30` : undefined,
                                    }}
                                    onClick={() => handleMoodSelect(mood)}
                                >
                                    <Icon name={mood.icon} size={28} color={mood.color} />
                                    <span className="mood-select__card-label">{mood.label}</span>
                                    <span className="mood-select__card-desc">{mood.desc}</span>
                                </button>
                            ))}
                        </div>

                        {selectedMood && (
                            <button className="btn btn--primary btn--lg" onClick={handleConfirm} style={{ width: '100%', marginTop: 24 }}>
                                <Icon name={selectedMood.icon} size={18} />
                                <span>Lock In My Mood</span>
                            </button>
                        )}
                    </div>
                )}

                {phase === 'waiting' && (
                    <div className="animate-fade-in" style={{ textAlign: 'center' }}>
                        <div style={{ margin: '48px 0', padding: 24 }}>
                            <Icon name={selectedMood?.icon} size={64} color={selectedMood?.color} />
                        </div>
                        <h2>Waiting for {state.partnerProfile.name || 'partner'}...</h2>
                        <p className="screen__subtitle">They're picking their mood</p>
                        <div className="onboarding__pulse" style={{ margin: '24px auto' }} />
                    </div>
                )}

                {phase === 'matched' && (
                    <div className="animate-scale-in" style={{ textAlign: 'center' }}>
                        <h2 className="screen__title">
                            <Icon name="sparkle" size={24} /> Mood Synced
                        </h2>
                        <div className="mood-select__matched-moods">
                            <div className="mood-select__matched-you">
                                <Icon name={selectedMood?.icon} size={40} color={selectedMood?.color} />
                                <span>{state.userProfile.name}</span>
                                <span style={{ color: selectedMood?.color }}>{selectedMood?.label}</span>
                            </div>
                            <div className="mood-select__matched-divider">
                                <Icon name="zap" size={20} color="#fbbf24" />
                            </div>
                            <div className="mood-select__matched-partner">
                                <Icon name={partnerMood?.icon || 'heart'} size={40} color={partnerMood?.color} />
                                <span>{state.partnerProfile.name}</span>
                                <span style={{ color: partnerMood?.color }}>{partnerMood?.label}</span>
                            </div>
                        </div>
                        <button className="btn btn--primary btn--lg" onClick={handleStartStory} style={{ width: '100%', marginTop: 24 }}>
                            <Icon name="heart" size={18} />
                            <span>Begin the Story</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
