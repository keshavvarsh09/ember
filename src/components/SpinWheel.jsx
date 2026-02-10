import React, { useState, useRef } from 'react';
import { useGame } from '../engine/gameState';
import { spinWheelOptions } from '../data/games-data';

export default function SpinWheel() {
    const { state, dispatch } = useGame();
    const [spinning, setSpinning] = useState(false);
    const [result, setResult] = useState(null);
    const [rotation, setRotation] = useState(0);
    const wheelRef = useRef(null);

    const segmentAngle = 360 / spinWheelOptions.length;

    const handleSpin = () => {
        if (spinning) return;
        setSpinning(true);
        setResult(null);

        // Random spin: 3-5 full rotations + random position
        const extraRotations = 3 + Math.floor(Math.random() * 3);
        const randomAngle = Math.floor(Math.random() * 360);
        const totalRotation = rotation + extraRotations * 360 + randomAngle;
        setRotation(totalRotation);

        setTimeout(() => {
            // Calculate which segment it landed on
            const normalizedAngle = totalRotation % 360;
            const segmentIndex = Math.floor((360 - normalizedAngle) / segmentAngle) % spinWheelOptions.length;
            setResult(spinWheelOptions[segmentIndex]);
            setSpinning(false);
            dispatch({ type: 'USE_SPIN', payload: spinWheelOptions[segmentIndex].label });
        }, 4000);
    };

    const handleGo = () => {
        if (result) {
            dispatch({ type: 'SET_SCREEN', payload: result.screen });
        }
    };

    return (
        <div className="spin-wheel page-enter">
            <div className="container">
                <button className="btn btn--ghost" onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'lobby' })} style={{ alignSelf: 'flex-start' }}>
                    ← Back
                </button>

                <div className="spin-wheel__header animate-fade-in-up">
                    <h1 className="spin-wheel__title font-story">🎰 Spin the Wheel</h1>
                    <p className="spin-wheel__subtitle">Let fate decide tonight's adventure...</p>
                </div>

                {/* Wheel */}
                <div className="spin-wheel__container animate-fade-in-up delay-1">
                    <div className="spin-wheel__pointer">▼</div>
                    <div
                        ref={wheelRef}
                        className="spin-wheel__wheel"
                        style={{
                            transform: `rotate(${rotation}deg)`,
                            transition: spinning ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
                        }}
                    >
                        {spinWheelOptions.map((opt, i) => {
                            const angle = i * segmentAngle;
                            return (
                                <div
                                    key={opt.label}
                                    className="spin-wheel__segment"
                                    style={{
                                        '--segment-rotation': `${angle}deg`,
                                        '--segment-color': opt.color,
                                        '--segment-angle': `${segmentAngle}deg`,
                                    }}
                                >
                                    <span className="spin-wheel__segment-content">
                                        <span className="spin-wheel__segment-emoji">{opt.emoji}</span>
                                        <span className="spin-wheel__segment-label">{opt.label}</span>
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Spin button */}
                {!result && (
                    <button
                        className={`spin-wheel__spin-btn btn btn--primary btn--large ${spinning ? 'spin-wheel__spin-btn--spinning' : ''}`}
                        onClick={handleSpin}
                        disabled={spinning}
                    >
                        {spinning ? 'Spinning...' : 'SPIN! 🎲'}
                    </button>
                )}

                {/* Result */}
                {result && (
                    <div className="spin-wheel__result animate-scale-in">
                        <div className="spin-wheel__result-emoji">{result.emoji}</div>
                        <h2 className="spin-wheel__result-title font-story">{result.label}</h2>
                        <p className="spin-wheel__result-desc">Tonight's destiny has spoken!</p>
                        <button className="btn btn--primary btn--full btn--large" onClick={handleGo} style={{ marginTop: '1.5rem' }}>
                            Let's Go! 🔥
                        </button>
                        <button className="btn btn--ghost" onClick={() => { setResult(null); dispatch({ type: 'RESET_SPIN' }); }} style={{ marginTop: '0.5rem' }}>
                            Spin Again
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
