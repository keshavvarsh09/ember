import React, { useState } from 'react';
import { useGame } from '../engine/gameState';
import { tiers, getCategoriesByTier } from '../data/categories';

const heatLabels = ['', 'Warm 🌸', 'Flirty 🌹', 'Steamy 🔥', 'Hot 💜', 'Inferno 🖤'];

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
        <div className="profile page-enter">
            <div className="container">
                <div className="profile__header">
                    <h2 className="profile__title font-story animate-fade-in-up">
                        What <span className="text-gradient">excites</span> you?
                    </h2>
                    <p className="profile__subtitle animate-fade-in-up delay-1">
                        Select what interests you. Your partner does the same — then we reveal what you share. 🔒 Private until matched.
                    </p>
                </div>

                {/* Tier Tabs */}
                <div className="profile__tiers animate-fade-in-up delay-2">
                    {tiers.map((tier) => (
                        <button
                            key={tier.id}
                            className={`profile__tier-tab ${activeTier === tier.id ? 'profile__tier-tab--active' : ''}`}
                            onClick={() => setActiveTier(tier.id)}
                            style={activeTier === tier.id ? { borderColor: tier.color, color: tier.color } : {}}
                        >
                            <span>{tier.emoji}</span>
                            <span className="profile__tier-name">{tier.name}</span>
                        </button>
                    ))}
                </div>

                {/* Tier Description */}
                <div className="profile__tier-info animate-fade-in" key={activeTier}>
                    <span style={{ color: currentTier.color }}>{currentTier.emoji} {currentTier.name}</span>
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
                                {isSelected && <span className="profile__cat-check">✓</span>}
                            </button>
                        );
                    })}
                </div>

                {/* Heat Level Selector */}
                <div className="profile__heat animate-fade-in-up delay-3">
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
                            <span className={heatLevel >= 1 ? 'active' : ''}>🌸</span>
                            <span className={heatLevel >= 2 ? 'active' : ''}>🌹</span>
                            <span className={heatLevel >= 3 ? 'active' : ''}>🔥</span>
                            <span className={heatLevel >= 4 ? 'active' : ''}>💜</span>
                            <span className={heatLevel >= 5 ? 'active' : ''}>🖤</span>
                        </div>
                        <div className="profile__heat-current" style={{ color: tiers[heatLevel - 1].color }}>
                            {heatLabels[heatLevel]}
                        </div>
                    </div>
                </div>

                {/* Stats & Continue */}
                <div className="profile__footer animate-fade-in-up delay-4">
                    <p className="profile__count">
                        {selectedPrefs.length} interests selected
                    </p>
                    <button
                        className="btn btn--primary btn--large btn--full"
                        onClick={handleContinue}
                        disabled={selectedPrefs.length < 3}
                    >
                        {selectedPrefs.length < 3 ? `Select ${3 - selectedPrefs.length} more…` : 'Reveal Compatibility 💫'}
                    </button>
                </div>
            </div>
        </div>
    );
}
