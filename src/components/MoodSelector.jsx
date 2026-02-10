import React, { useState } from 'react';
import { useGame } from '../engine/gameState';
import { stories, getStoryById } from '../data/stories';

const moods = [
    { id: 'tender', emoji: '🌸', label: 'Tender', desc: 'Soft, romantic, emotional', color: '#ffa07a' },
    { id: 'playful', emoji: '😏', label: 'Playful', desc: 'Fun, teasing, light', color: '#ff6b9d' },
    { id: 'passionate', emoji: '🔥', label: 'Passionate', desc: 'Intense, burning, urgent', color: '#e84393' },
    { id: 'adventurous', emoji: '💜', label: 'Adventurous', desc: 'Bold, exploring, daring', color: '#8b5cf6' },
    { id: 'primal', emoji: '🖤', label: 'Primal', desc: 'Raw, unfiltered, dominant', color: '#ff4757' },
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
    const [partnerMoodSim, setPartnerMoodSim] = useState(null);
    const [phase, setPhase] = useState('select'); // select | waiting | matched

    const handleMoodSelect = (mood) => {
        setSelectedMood(mood);
        dispatch({ type: 'SET_MOOD', payload: mood.id });
    };

    const handleConfirm = () => {
        setPhase('waiting');
        // Simulate partner mood selection
        setTimeout(() => {
            const partnerMood = moods[Math.floor(Math.random() * moods.length)];
            setPartnerMoodSim(partnerMood);
            dispatch({ type: 'SET_PARTNER_MOOD', payload: partnerMood.id });
            setPhase('matched');
        }, 2000);
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
        <div className="mood-select page-enter">
            <div className="container">
                <button className="btn btn--ghost" onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'lobby' })}>
                    ← Back
                </button>

                {phase === 'select' && (
                    <div className="mood-select__content animate-fade-in-up">
                        <h2 className="mood-select__title font-story">
                            What's the <span className="text-gradient">mood</span> tonight?
                        </h2>
                        <p className="mood-select__subtitle">
                            Both of you pick — the game adapts to where you both are.
                        </p>

                        <div className="mood-select__grid">
                            {moods.map((mood, i) => (
                                <button
                                    key={mood.id}
                                    className={`mood-select__card glass-card animate-fade-in-up ${selectedMood?.id === mood.id ? 'mood-select__card--selected' : ''}`}
                                    style={{
                                        animationDelay: `${i * 100}ms`,
                                        borderColor: selectedMood?.id === mood.id ? mood.color : undefined,
                                        boxShadow: selectedMood?.id === mood.id ? `0 0 30px ${mood.color}30` : undefined,
                                    }}
                                    onClick={() => handleMoodSelect(mood)}
                                >
                                    <span className="mood-select__card-emoji">{mood.emoji}</span>
                                    <span className="mood-select__card-label">{mood.label}</span>
                                    <span className="mood-select__card-desc">{mood.desc}</span>
                                </button>
                            ))}
                        </div>

                        {selectedMood && (
                            <button className="btn btn--primary btn--large btn--full animate-fade-in-up" onClick={handleConfirm} style={{ marginTop: '2rem' }}>
                                Lock In My Mood {selectedMood.emoji}
                            </button>
                        )}
                    </div>
                )}

                {phase === 'waiting' && (
                    <div className="mood-select__waiting animate-fade-in">
                        <div className="mood-select__waiting-icon animate-breathe">{selectedMood?.emoji}</div>
                        <h2 className="font-story">Waiting for {state.partnerProfile.name || 'partner'}...</h2>
                        <p className="mood-select__waiting-sub">They're picking their mood</p>
                        <div className="compat__loading-bar">
                            <div className="compat__loading-fill" />
                        </div>
                    </div>
                )}

                {phase === 'matched' && (
                    <div className="mood-select__matched animate-scale-in">
                        <h2 className="font-story mood-select__matched-title">Mood Synced 💫</h2>
                        <div className="mood-select__matched-moods">
                            <div className="mood-select__matched-you">
                                <span className="mood-select__matched-emoji">{selectedMood?.emoji}</span>
                                <span className="mood-select__matched-name">{state.userProfile.name}</span>
                                <span className="mood-select__matched-mood" style={{ color: selectedMood?.color }}>{selectedMood?.label}</span>
                            </div>
                            <div className="mood-select__matched-divider">⚡</div>
                            <div className="mood-select__matched-partner">
                                <span className="mood-select__matched-emoji">{partnerMoodSim?.emoji}</span>
                                <span className="mood-select__matched-name">{state.partnerProfile.name}</span>
                                <span className="mood-select__matched-mood" style={{ color: partnerMoodSim?.color }}>{partnerMoodSim?.label}</span>
                            </div>
                        </div>
                        <button className="btn btn--primary btn--large btn--full animate-pulse-glow" onClick={handleStartStory} style={{ marginTop: '2rem' }}>
                            Begin the Story 📖
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
