import React from 'react';
import { useGame } from '../engine/gameState';
import { getDailySpark } from '../data/daily-sparks';
import { getRandomDare } from '../data/dares';

export default function GameLobby() {
    const { state, dispatch } = useGame();
    const dailySpark = getDailySpark();
    const randomDare = getRandomDare(state.userProfile.heatLevel);

    const handleStartStory = () => {
        dispatch({ type: 'SET_SCREEN', payload: 'mood' });
    };

    const handleLibrary = () => {
        dispatch({ type: 'SET_SCREEN', payload: 'library' });
    };

    const handleDare = () => {
        dispatch({ type: 'SET_SCREEN', payload: 'dare' });
    };

    const handleProgress = () => {
        dispatch({ type: 'SET_SCREEN', payload: 'progress' });
    };

    return (
        <div className="lobby page-enter">
            <div className="container">
                {/* Header */}
                <div className="lobby__header animate-fade-in-up">
                    <div className="lobby__greeting">
                        <span className="lobby__avatar">{state.userProfile.avatar}</span>
                        <div>
                            <h2 className="lobby__name">Hey, {state.userProfile.name} 🔥</h2>
                            <p className="lobby__partner-status">
                                <span className="lobby__online-dot" />
                                {state.partnerProfile.name || 'Partner'} is here
                            </p>
                        </div>
                    </div>
                    <div className="lobby__streak">
                        <span className="lobby__streak-flame">🔥</span>
                        <span className="lobby__streak-count">{state.streak}</span>
                    </div>
                </div>

                {/* Daily Spark Card */}
                <div className="lobby__daily glass-card animate-fade-in-up delay-1" onClick={handleStartStory}>
                    <div className="lobby__daily-badge">✨ TODAY'S SPARK</div>
                    <div className="lobby__daily-content">
                        <span className="lobby__daily-emoji">{dailySpark.emoji}</span>
                        <h3 className="lobby__daily-title font-story">{dailySpark.title}</h3>
                        <p className="lobby__daily-desc">{dailySpark.description}</p>
                        <div className="lobby__daily-meta">
                            <span className="lobby__daily-duration">⏱ {dailySpark.duration}</span>
                            <span className="lobby__daily-heat">{'🔥'.repeat(dailySpark.heat)}</span>
                        </div>
                    </div>
                    <div className="lobby__daily-cta">Tap to Play →</div>
                </div>

                {/* Game Modes */}
                <div className="lobby__modes">
                    <h3 className="lobby__section-title animate-fade-in-up delay-2">Play Tonight</h3>
                    <div className="lobby__mode-grid">
                        <button className="lobby__mode glass-card animate-fade-in-up delay-2" onClick={handleStartStory}>
                            <span className="lobby__mode-icon">📖</span>
                            <span className="lobby__mode-label">Story Mode</span>
                            <span className="lobby__mode-desc">Interactive narrative</span>
                        </button>
                        <button className="lobby__mode glass-card animate-fade-in-up delay-3" onClick={handleDare}>
                            <span className="lobby__mode-icon">🎯</span>
                            <span className="lobby__mode-label">Quick Dare</span>
                            <span className="lobby__mode-desc">Fast & spicy</span>
                        </button>
                        <button className="lobby__mode glass-card animate-fade-in-up delay-4" onClick={handleLibrary}>
                            <span className="lobby__mode-icon">📚</span>
                            <span className="lobby__mode-label">Story Library</span>
                            <span className="lobby__mode-desc">Browse all stories</span>
                        </button>
                        <button className="lobby__mode glass-card animate-fade-in-up delay-5" onClick={handleProgress}>
                            <span className="lobby__mode-icon">🏆</span>
                            <span className="lobby__mode-label">Our Journey</span>
                            <span className="lobby__mode-desc">Stats & progress</span>
                        </button>
                    </div>
                </div>

                {/* Quick Dare Preview */}
                <div className="lobby__quick-dare glass-card animate-fade-in-up delay-6">
                    <div className="lobby__qd-header">
                        <span>⚡ Quick Dare</span>
                        <span className="lobby__qd-heat">{'🔥'.repeat(randomDare.heat)}</span>
                    </div>
                    <p className="lobby__qd-text font-story">{randomDare.text}</p>
                    <button className="btn btn--secondary btn--full" onClick={handleDare} style={{ marginTop: '1rem' }}>
                        Accept Dare 🎯
                    </button>
                </div>

                {/* Ember Score */}
                <div className="lobby__ember-score animate-fade-in-up delay-7">
                    <div className="lobby__es-label">Ember Score</div>
                    <div className="lobby__es-bar">
                        <div
                            className="lobby__es-fill"
                            style={{ width: `${Math.min((state.emberScore / 500) * 100, 100)}%` }}
                        />
                    </div>
                    <div className="lobby__es-value">{state.emberScore} 🔥</div>
                </div>
            </div>
        </div>
    );
}
