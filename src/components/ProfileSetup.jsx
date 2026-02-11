import React, { useState } from 'react';
import { useGame } from '../engine/gameState';
import { tiers, getCategoriesByTier } from '../data/categories';
import Icon from './ui/Icons';
import Avatar from './ui/Avatar';

const heatIcons = ['', 'heart', 'flame', 'fire', 'zap', 'star'];
const heatLabels = ['', 'Warm', 'Flirty', 'Steamy', 'Hot', 'Inferno'];

export default function ProfileSetup() {
    const { state, dispatch } = useGame();
    const [activeTier, setActiveTier] = useState(1);
    const [heatLevel, setHeatLevel] = useState(state.userProfile.heatLevel || 2);

    const selectedPrefs = state.userProfile.preferences;

    const togglePref = (id) => {
        dispatch({ type: 'ADD_PREFERENCE', payload: id });
    };

    const handleContinue = () => {
        dispatch({ type: 'SET_HEAT_LEVEL', payload: heatLevel });
        dispatch({ type: 'CALCULATE_COMPATIBILITY' });
        dispatch({ type: 'SET_SCREEN', payload: 'compatibility' });
    };

    const tierCategories = getCategoriesByTier(activeTier);
    const currentTier = tiers.find((t) => t.id === activeTier);

    return (
        <div className="screen profile-setup">
            <div className="screen__content">
                <div className="game__header">
                    <button className="btn btn--icon" onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'lobby' })}>
                        <Icon name="arrow-left" size={20} />
                    </button>
                    <h2 className="game__title">Preferences</h2>
                </div>

                <h2 className="screen__title">
                    What <span className="gradient-text">excites</span> you?
                </h2>
                <p className="screen__subtitle">
                    Select what interests you. Your partner does the same — then we reveal what you share.
                </p>

                {/* Tier Tabs */}
                <div className="profile__tiers">
                    {tiers.map((tier) => (
                        <button
                            key={tier.id}
                            className={`profile__tier-tab ${activeTier === tier.id ? 'profile__tier-tab--active' : ''}`}
                            onClick={() => setActiveTier(tier.id)}
                            style={activeTier === tier.id ? { borderColor: tier.color, color: tier.color } : {}}
                        >
                            <Icon name={heatIcons[tier.id] || 'heart'} size={16} />
                            <span className="profile__tier-name">{tier.name}</span>
                        </button>
                    ))}
                </div>

                {/* Tier Description */}
                <div className="profile__tier-info" key={activeTier}>
                    <span style={{ color: currentTier.color }}>
                        <Icon name={heatIcons[currentTier.id] || 'heart'} size={14} color={currentTier.color} />
                        {' '}{currentTier.name}
                    </span>
                    <span className="profile__tier-desc"> — {currentTier.description}</span>
                </div>

                {/* Category Grid */}
                <div className="profile__categories" key={`cats-${activeTier}`}>
                    {tierCategories.map((cat, i) => {
                        const isSelected = selectedPrefs.includes(cat.id);
                        return (
                            <button
                                key={cat.id}
                                className={`profile__category animate-fade-in-up ${isSelected ? 'profile__category--selected' : ''}`}
                                style={{
                                    animationDelay: `${i * 60}ms`,
                                    borderColor: isSelected ? currentTier.color : undefined,
                                    background: isSelected ? `${currentTier.color}15` : undefined,
                                }}
                                onClick={() => togglePref(cat.id)}
                            >
                                <span className="profile__cat-emoji">{cat.emoji}</span>
                                <span className="profile__cat-name">{cat.name}</span>
                                <span className="profile__cat-desc">{cat.description}</span>
                                {isSelected && <span className="profile__cat-check"><Icon name="check" size={14} /></span>}
                            </button>
                        );
                    })}
                </div>

                {/* Heat Level Selector */}
                <div className="profile__heat">
                    <h3 className="profile__heat-title">Your comfort zone</h3>
                    <p className="profile__heat-desc">How far do you want stories to go?</p>
                    <div className="profile__heat-slider">
                        <input
                            type="range"
                            min="1"
                            max="5"
                            value={heatLevel}
                            onChange={(e) => setHeatLevel(Number(e.target.value))}
                            className="profile__heat-range"
                        />
                        <div className="profile__heat-labels">
                            {[1, 2, 3, 4, 5].map(h => (
                                <span key={h} className={heatLevel >= h ? 'active' : ''}>
                                    <Icon name={heatIcons[h]} size={16} />
                                </span>
                            ))}
                        </div>
                        <div className="profile__heat-current" style={{ color: tiers[heatLevel - 1]?.color }}>
                            <Icon name={heatIcons[heatLevel]} size={16} />
                            <span>{heatLabels[heatLevel]}</span>
                        </div>
                    </div>
                </div>

                {/* Stats & Continue */}
                <div className="profile__footer">
                    <p className="profile__count">
                        {selectedPrefs.length} interests selected
                    </p>
                    <button
                        className="btn btn--primary btn--lg"
                        onClick={handleContinue}
                        disabled={selectedPrefs.length < 3}
                        style={{ width: '100%' }}
                    >
                        {selectedPrefs.length < 3 ? `Select ${3 - selectedPrefs.length} more...` : (
                            <>
                                <Icon name="sparkle" size={16} />
                                <span>Reveal Compatibility</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
