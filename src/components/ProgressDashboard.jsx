import React from 'react';
import { useGame } from '../engine/gameState';
import Icon from './ui/Icons';
import Avatar from './ui/Avatar';

export default function ProgressDashboard() {
    const { state, dispatch } = useGame();

    const stats = [
        { label: 'Ember Score', value: state.emberScore, icon: 'fire', color: '#ff6b35' },
        { label: 'Day Streak', value: state.streak, icon: 'zap', color: '#fbbf24' },
        { label: 'Stories', value: state.storiesCompleted.length, icon: 'heart', color: '#e84393' },
        { label: 'Compatibility', value: `${state.compatibilityScore}%`, icon: 'sparkle', color: '#8b5cf6' },
    ];

    const milestones = [
        { threshold: 0, label: 'First Spark', icon: 'sparkle', unlocked: state.emberScore >= 0 },
        { threshold: 50, label: 'Warming Up', icon: 'flame', unlocked: state.emberScore >= 50 },
        { threshold: 150, label: 'On Fire', icon: 'fire', unlocked: state.emberScore >= 150 },
        { threshold: 300, label: 'Blazing', icon: 'zap', unlocked: state.emberScore >= 300 },
        { threshold: 500, label: 'Inferno', icon: 'star', unlocked: state.emberScore >= 500 },
        { threshold: 1000, label: 'Supernova', icon: 'trophy', unlocked: state.emberScore >= 1000 },
    ];

    const handleReset = () => {
        localStorage.removeItem('garf-state');
        window.location.reload();
    };

    return (
        <div className="screen progress-dashboard">
            <div className="screen__content">
                <div className="game__header">
                    <button className="btn btn--icon" onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'lobby' })}>
                        <Icon name="arrow-left" size={20} />
                    </button>
                    <h2 className="game__title">Progress</h2>
                </div>

                <h2 className="screen__title">
                    Your <span className="gradient-text">Journey</span>
                </h2>
                <p className="screen__subtitle">
                    {state.userProfile.name} & {state.partnerProfile.name || 'Partner'}
                </p>

                {/* Quick Stats */}
                <div className="progress__stats">
                    {stats.map((stat) => (
                        <div key={stat.label} className="progress__stat glass-card">
                            <Icon name={stat.icon} size={22} color={stat.color} />
                            <span className="progress__stat-value">{stat.value}</span>
                            <span className="progress__stat-label">{stat.label}</span>
                        </div>
                    ))}
                </div>

                {/* Ember Score Progress */}
                <div className="progress__ember glass-card">
                    <h3 className="progress__ember-title">
                        <Icon name="fire" size={18} color="#ff6b35" /> Ember Level
                    </h3>
                    <div className="progress__ember-bar">
                        <div
                            className="progress__ember-fill"
                            style={{ width: `${Math.min((state.emberScore / 1000) * 100, 100)}%` }}
                        />
                    </div>
                    <div className="progress__ember-labels">
                        <span>0</span>
                        <span>1000 <Icon name="fire" size={12} /></span>
                    </div>
                </div>

                {/* Milestones */}
                <div className="progress__milestones">
                    <h3 className="progress__milestones-title">
                        <Icon name="trophy" size={18} /> Milestones
                    </h3>
                    <div className="progress__milestone-list">
                        {milestones.map((m) => (
                            <div
                                key={m.label}
                                className={`progress__milestone ${m.unlocked ? 'progress__milestone--unlocked' : ''}`}
                            >
                                <span className="progress__milestone-icon">
                                    {m.unlocked ? (
                                        <Icon name={m.icon} size={20} color="#ffd700" />
                                    ) : (
                                        <Icon name="lock" size={20} color="rgba(255,255,255,0.2)" />
                                    )}
                                </span>
                                <div className="progress__milestone-info">
                                    <span className="progress__milestone-label">{m.label}</span>
                                    <span className="progress__milestone-threshold">{m.threshold} pts</span>
                                </div>
                                {m.unlocked && <Icon name="check-circle" size={18} color="#4ade80" />}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="progress__actions" style={{ marginTop: 24 }}>
                    <button className="btn btn--secondary" onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'profile' })} style={{ width: '100%' }}>
                        <Icon name="settings" size={16} />
                        <span>Update Preferences</span>
                    </button>
                    <button className="btn btn--ghost" onClick={handleReset} style={{ width: '100%', marginTop: 8, opacity: 0.6 }}>
                        Reset Everything
                    </button>
                </div>
            </div>
        </div>
    );
}
