import React from 'react';
import { useGame } from '../engine/gameState';

export default function ProgressDashboard() {
    const { state, dispatch } = useGame();

    const stats = [
        { label: 'Ember Score', value: state.emberScore, icon: '🔥' },
        { label: 'Day Streak', value: state.streak, icon: '📅' },
        { label: 'Stories Completed', value: state.storiesCompleted.length, icon: '📖' },
        { label: 'Compatibility', value: `${state.compatibilityScore}%`, icon: '💞' },
    ];

    const milestones = [
        { threshold: 0, label: 'First Spark', emoji: '✨', unlocked: state.emberScore >= 0 },
        { threshold: 50, label: 'Warming Up', emoji: '🌡️', unlocked: state.emberScore >= 50 },
        { threshold: 150, label: 'On Fire', emoji: '🔥', unlocked: state.emberScore >= 150 },
        { threshold: 300, label: 'Blazing', emoji: '💥', unlocked: state.emberScore >= 300 },
        { threshold: 500, label: 'Inferno', emoji: '🌋', unlocked: state.emberScore >= 500 },
        { threshold: 1000, label: 'Supernova', emoji: '💫', unlocked: state.emberScore >= 1000 },
    ];

    const handleReset = () => {
        localStorage.removeItem('ember-state');
        window.location.reload();
    };

    return (
        <div className="progress page-enter">
            <div className="container">
                <button className="btn btn--ghost" onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'lobby' })}>
                    ← Back
                </button>

                <div className="progress__header animate-fade-in-up">
                    <h2 className="progress__title font-story">
                        Your <span className="text-gradient">Journey</span>
                    </h2>
                    <p className="progress__subtitle">
                        {state.userProfile.name} & {state.partnerProfile.name || 'Partner'}
                    </p>
                </div>

                {/* Quick Stats */}
                <div className="progress__stats animate-fade-in-up delay-1">
                    {stats.map((stat, i) => (
                        <div key={stat.label} className="progress__stat glass-card" style={{ animationDelay: `${i * 100}ms` }}>
                            <span className="progress__stat-icon">{stat.icon}</span>
                            <span className="progress__stat-value">{stat.value}</span>
                            <span className="progress__stat-label">{stat.label}</span>
                        </div>
                    ))}
                </div>

                {/* Ember Score Progress */}
                <div className="progress__ember glass-card animate-fade-in-up delay-3">
                    <h3 className="progress__ember-title">Ember Level</h3>
                    <div className="progress__ember-bar">
                        <div
                            className="progress__ember-fill"
                            style={{ width: `${Math.min((state.emberScore / 1000) * 100, 100)}%` }}
                        />
                    </div>
                    <div className="progress__ember-labels">
                        <span>0</span>
                        <span>1000 🔥</span>
                    </div>
                </div>

                {/* Milestones */}
                <div className="progress__milestones animate-fade-in-up delay-4">
                    <h3 className="progress__milestones-title">Milestones</h3>
                    <div className="progress__milestone-list">
                        {milestones.map((m, i) => (
                            <div
                                key={m.label}
                                className={`progress__milestone ${m.unlocked ? 'progress__milestone--unlocked' : ''}`}
                            >
                                <span className="progress__milestone-emoji">{m.unlocked ? m.emoji : '🔒'}</span>
                                <div className="progress__milestone-info">
                                    <span className="progress__milestone-label">{m.label}</span>
                                    <span className="progress__milestone-threshold">{m.threshold} pts</span>
                                </div>
                                {m.unlocked && <span className="progress__milestone-check">✓</span>}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="progress__actions animate-fade-in-up delay-5">
                    <button className="btn btn--secondary btn--full" onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'profile' })}>
                        Update Preferences 🎨
                    </button>
                    <button className="btn btn--ghost btn--full" onClick={handleReset} style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>
                        Reset Everything
                    </button>
                </div>
            </div>
        </div>
    );
}
