import React from 'react';
import { useGame } from '../engine/gameState';
import { getDailySpark } from '../data/daily-sparks';
import { getRandomDare } from '../data/dares';

export default function GameLobby() {
    const { state, dispatch } = useGame();
    const dailySpark = getDailySpark();
    const randomDare = getRandomDare(state.userProfile.heatLevel);

    const navigate = (screen) => dispatch({ type: 'SET_SCREEN', payload: screen });

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

                {/* Communication Bar */}
                <div className="lobby__comms-bar animate-fade-in-up delay-1">
                    <button className="lobby__comm-btn glass-card" onClick={() => navigate('chat')}>
                        <span>💬</span>
                        <span>Chat</span>
                        {state.chatMessages.length > 0 && (
                            <span className="lobby__comm-badge">{state.chatMessages.filter(m => m.from === 'partner').length}</span>
                        )}
                    </button>
                    <button className="lobby__comm-btn glass-card" onClick={() => { dispatch({ type: 'START_CALL', payload: 'voice' }); navigate('call'); }}>
                        <span>📞</span>
                        <span>Voice</span>
                    </button>
                    <button className="lobby__comm-btn glass-card" onClick={() => { dispatch({ type: 'START_CALL', payload: 'video' }); navigate('call'); }}>
                        <span>📹</span>
                        <span>Video</span>
                    </button>
                </div>

                {/* Daily Spark */}
                <div className="lobby__daily glass-card animate-fade-in-up delay-1" onClick={() => navigate('mood')}>
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

                {/* Free Choice Activity Grid */}
                <div className="lobby__modes">
                    <h3 className="lobby__section-title animate-fade-in-up delay-2">What do you want to do? 😏</h3>
                    <div className="lobby__mode-grid">
                        <button className="lobby__mode glass-card animate-fade-in-up delay-2" onClick={() => navigate('mood')}>
                            <span className="lobby__mode-icon">📖</span>
                            <span className="lobby__mode-label">Story Mode</span>
                            <span className="lobby__mode-desc">Interactive narrative</span>
                        </button>
                        <button className="lobby__mode glass-card animate-fade-in-up delay-3" onClick={() => navigate('minigames')}>
                            <span className="lobby__mode-icon">🎲</span>
                            <span className="lobby__mode-label">Board Games</span>
                            <span className="lobby__mode-desc">Ludo, S&L, Monopoly</span>
                        </button>
                        <button className="lobby__mode glass-card animate-fade-in-up delay-3" onClick={() => navigate('dare')}>
                            <span className="lobby__mode-icon">🎯</span>
                            <span className="lobby__mode-label">Quick Dare</span>
                            <span className="lobby__mode-desc">Fast & spicy</span>
                        </button>
                        <button className="lobby__mode glass-card animate-fade-in-up delay-4" onClick={() => navigate('spin')}>
                            <span className="lobby__mode-icon">🎰</span>
                            <span className="lobby__mode-label">Spin Wheel</span>
                            <span className="lobby__mode-desc">Let fate decide</span>
                        </button>
                        <button className="lobby__mode glass-card animate-fade-in-up delay-4" onClick={() => navigate('library')}>
                            <span className="lobby__mode-icon">📚</span>
                            <span className="lobby__mode-label">Story Library</span>
                            <span className="lobby__mode-desc">Browse all stories</span>
                        </button>
                        <button className="lobby__mode glass-card animate-fade-in-up delay-5" onClick={() => navigate('rewards')}>
                            <span className="lobby__mode-icon">🎁</span>
                            <span className="lobby__mode-label">Daily Rewards</span>
                            <span className="lobby__mode-desc">Streak bonuses</span>
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
                    <button className="btn btn--secondary btn--full" onClick={() => navigate('dare')} style={{ marginTop: '1rem' }}>
                        Accept Dare 🎯
                    </button>
                </div>

                {/* Progress Section */}
                <div className="lobby__footer animate-fade-in-up delay-7">
                    <button className="btn btn--ghost" onClick={() => navigate('progress')}>
                        🏆 Our Journey — {state.emberScore} 🔥
                    </button>
                </div>
            </div>
        </div>
    );
}
