import React from 'react';
import { useGame } from '../engine/gameState';
import Icon, { FilledIcon } from './ui/Icons';

export default function Landing() {
    const { dispatch } = useGame();

    return (
        <div className="screen landing">
            <div className="screen__content">
                <div className="landing__hero">
                    <div className="landing__logo">
                        <Icon name="flame" size={48} color="#e84393" />
                    </div>
                    <h1 className="landing__title">
                        <span className="gradient-text">GARF</span>
                    </h1>
                    <p className="landing__tagline">Get a Room. For Real.</p>
                    <p className="landing__sub">
                        Real-time games, stories & connection for couples
                    </p>
                </div>

                <div className="landing__features">
                    <div className="landing__feature">
                        <Icon name="video" size={20} color="#8b5cf6" />
                        <span>Live Voice & Video</span>
                    </div>
                    <div className="landing__feature">
                        <Icon name="dice" size={20} color="#e84393" />
                        <span>Interactive Games</span>
                    </div>
                    <div className="landing__feature">
                        <Icon name="heart" size={20} color="#ff6b35" />
                        <span>Intimate Stories</span>
                    </div>
                    <div className="landing__feature">
                        <Icon name="chat" size={20} color="#0ea5e9" />
                        <span>Real-Time Chat</span>
                    </div>
                </div>

                <button
                    className="btn btn--primary btn--lg"
                    onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'onboarding' })}
                    style={{ width: '100%', marginTop: 'var(--space-xl)' }}
                >
                    <Icon name="flame" size={20} />
                    <span>Enter GARF</span>
                </button>

                <div className="landing__proof">
                    <div className="landing__proof-item">
                        <span className="landing__proof-number">100%</span>
                        <span className="landing__proof-label">Real-Time</span>
                    </div>
                    <div className="landing__proof-item">
                        <span className="landing__proof-number">5+</span>
                        <span className="landing__proof-label">Games</span>
                    </div>
                    <div className="landing__proof-item">
                        <span className="landing__proof-number">P2P</span>
                        <span className="landing__proof-label">Calls</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
