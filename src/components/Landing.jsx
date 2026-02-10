import React, { useState, useEffect } from 'react';
import { useGame } from '../engine/gameState';

const embers = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 4 + Math.random() * 4,
    size: 3 + Math.random() * 6,
}));

export default function Landing() {
    const { dispatch } = useGame();
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        setTimeout(() => setLoaded(true), 100);
    }, []);

    return (
        <div className="landing" style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.8s ease' }}>
            {/* Floating embers */}
            <div className="landing__embers">
                {embers.map((e) => (
                    <div
                        key={e.id}
                        className="landing__ember-particle"
                        style={{
                            left: `${e.left}%`,
                            animationDelay: `${e.delay}s`,
                            animationDuration: `${e.duration}s`,
                            width: `${e.size}px`,
                            height: `${e.size}px`,
                        }}
                    />
                ))}
            </div>

            <div className="container landing__content">
                {/* Logo & Hero */}
                <div className="landing__hero">
                    <div className="landing__flame animate-heartbeat">🔥</div>
                    <h1 className="landing__title">
                        <span className="text-gradient">Ember</span>
                    </h1>
                    <p className="landing__tagline font-story">
                        The game that makes your partner<br />
                        <em>miss you more</em> every night.
                    </p>
                </div>

                {/* Features */}
                <div className="landing__features">
                    <div className="landing__feature animate-fade-in-up delay-2">
                        <span className="landing__feature-icon">📖</span>
                        <span>Interactive Stories</span>
                    </div>
                    <div className="landing__feature animate-fade-in-up delay-3">
                        <span className="landing__feature-icon">🎮</span>
                        <span>Play Together</span>
                    </div>
                    <div className="landing__feature animate-fade-in-up delay-4">
                        <span className="landing__feature-icon">🔥</span>
                        <span>5 Heat Levels</span>
                    </div>
                    <div className="landing__feature animate-fade-in-up delay-5">
                        <span className="landing__feature-icon">🌙</span>
                        <span>Daily Sparks</span>
                    </div>
                </div>

                {/* CTAs */}
                <div className="landing__cta-group animate-fade-in-up delay-6">
                    <button
                        className="btn btn--primary btn--large btn--full"
                        onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'onboarding' })}
                    >
                        Start Playing 🔥
                    </button>
                    <p className="landing__privacy">
                        🔒 Private. Encrypted. Just you two.
                    </p>
                </div>

                {/* Social proof */}
                <div className="landing__proof animate-fade-in-up delay-7">
                    <div className="landing__proof-item">
                        <span className="landing__proof-number">50K+</span>
                        <span className="landing__proof-label">Couples Playing</span>
                    </div>
                    <div className="landing__proof-divider" />
                    <div className="landing__proof-item">
                        <span className="landing__proof-number">4.9★</span>
                        <span className="landing__proof-label">Average Rating</span>
                    </div>
                    <div className="landing__proof-divider" />
                    <div className="landing__proof-item">
                        <span className="landing__proof-number">∞</span>
                        <span className="landing__proof-label">Stories to Tell</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
