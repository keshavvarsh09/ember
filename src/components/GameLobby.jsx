import React from 'react';
import { useGame } from '../engine/gameState';
import Icon from './ui/Icons';
import Avatar from './ui/Avatar';

export default function GameLobby() {
    const { state, dispatch } = useGame();
    const { userProfile, partnerProfile, partnerOnline, emberScore, streak, chatMessages, roomCode } = state;
    const unread = chatMessages.filter(m => m.sender !== state.userId).length;

    const activities = [
        { id: 'chat', label: 'Chat', icon: 'chat', desc: 'Send messages', color: '#0ea5e9', badge: unread },
        { id: 'call', label: 'Voice Call', icon: 'phone', desc: 'Talk live', color: '#8b5cf6' },
        { id: 'video-call', label: 'Video Call', icon: 'video', desc: 'Face to face', color: '#e84393' },
        { id: 'minigames', label: 'Games', icon: 'dice', desc: '5 games to play', color: '#ff6b35' },
        { id: 'library', label: 'Stories', icon: 'heart', desc: 'Intimate narratives', color: '#f43f5e' },
        { id: 'spin', label: 'Spin', icon: 'wheel', desc: 'Win rewards', color: '#10b981' },
        { id: 'rewards', label: 'Daily', icon: 'gift', desc: 'Claim today', color: '#fbbf24' },
        { id: 'progress', label: 'Progress', icon: 'trophy', desc: 'Your journey', color: '#7c3aed' },
    ];

    const handleActivity = (id) => {
        if (id === 'video-call') {
            dispatch({ type: 'SET_CALL', payload: { active: true, type: 'video' } });
            dispatch({ type: 'SET_SCREEN', payload: 'call' });
        } else if (id === 'call') {
            dispatch({ type: 'SET_CALL', payload: { active: true, type: 'voice' } });
            dispatch({ type: 'SET_SCREEN', payload: 'call' });
        } else {
            dispatch({ type: 'SET_SCREEN', payload: id });
        }
    };

    return (
        <div className="screen lobby">
            <div className="screen__content">
                {/* Header */}
                <div className="lobby__header">
                    <div className="lobby__brand">
                        <Icon name="flame" size={24} color="#e84393" />
                        <span className="gradient-text" style={{ fontSize: '1.2rem', fontWeight: 700 }}>GARF</span>
                    </div>
                    <div className="lobby__room-code">
                        <Icon name="link" size={14} />
                        <span>{roomCode || '—'}</span>
                    </div>
                </div>

                {/* Partner status */}
                <div className="lobby__partner glass-card">
                    <div className="lobby__partner-info">
                        <div className="lobby__avatars">
                            <Avatar id={userProfile.avatarId} size={48} />
                            <div className="lobby__avatar-connector">
                                <Icon name="heart" size={16} color="#e84393" />
                            </div>
                            <div style={{ position: 'relative' }}>
                                <Avatar id={partnerProfile.avatarId} size={48} />
                                <span className={`lobby__status-dot ${partnerOnline ? 'lobby__status-dot--online' : ''}`} />
                            </div>
                        </div>
                        <div>
                            <h3 className="lobby__partner-name">{partnerProfile.name || 'Partner'}</h3>
                            <span className={`lobby__status ${partnerOnline ? 'lobby__status--online' : ''}`}>
                                {partnerOnline ? 'Online now' : 'Offline'}
                            </span>
                        </div>
                    </div>
                    <div className="lobby__stats">
                        <div className="lobby__stat">
                            <Icon name="fire" size={16} color="#ff6b35" />
                            <span>{emberScore}</span>
                        </div>
                        <div className="lobby__stat">
                            <Icon name="zap" size={16} color="#fbbf24" />
                            <span>{streak} day{streak !== 1 ? 's' : ''}</span>
                        </div>
                    </div>
                </div>

                {/* Activity grid */}
                <div className="lobby__grid">
                    {activities.map(act => (
                        <div key={act.id} className="lobby__activity glass-card" onClick={() => handleActivity(act.id)}>
                            <div className="lobby__activity-icon" style={{ background: `${act.color}22`, color: act.color }}>
                                <Icon name={act.icon} size={22} color={act.color} />
                            </div>
                            <span className="lobby__activity-label">{act.label}</span>
                            <span className="lobby__activity-desc">{act.desc}</span>
                            {act.badge > 0 && (
                                <span className="lobby__badge">{act.badge}</span>
                            )}
                        </div>
                    ))}
                </div>

                {/* Quick actions */}
                <div className="lobby__actions">
                    <button className="btn btn--secondary btn--sm" onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'mood' })}>
                        <Icon name="sparkle" size={16} />
                        <span>Set Mood</span>
                    </button>
                    <button className="btn btn--secondary btn--sm" onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'dare' })}>
                        <Icon name="flame" size={16} />
                        <span>Quick Dare</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
