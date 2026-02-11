import React, { useState } from 'react';
import { useGame } from '../engine/gameState';
import Icon from './ui/Icons';

const WHEEL_ITEMS = [
    { label: 'Kiss Session', color: '#e84393', score: 30 },
    { label: 'Massage', color: '#8b5cf6', score: 25 },
    { label: 'Truth Round', color: '#ff6b35', score: 20 },
    { label: 'Dare Challenge', color: '#f43f5e', score: 35 },
    { label: 'Compliment', color: '#0ea5e9', score: 15 },
    { label: 'Dance Together', color: '#10b981', score: 20 },
    { label: 'Story Time', color: '#7c3aed', score: 25 },
    { label: 'Wildcard', color: '#f97316', score: 50 },
];

export default function SpinWheel() {
    const { state, dispatch } = useGame();
    const [spinning, setSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [result, setResult] = useState(state.lastSpinResult);
    const { spinAvailable } = state;

    const handleSpin = () => {
        if (spinning || !spinAvailable) return;

        setSpinning(true);
        setResult(null);

        const randomAngle = 1440 + Math.floor(Math.random() * 360);
        setRotation(prev => prev + randomAngle);

        const finalAngle = randomAngle % 360;
        const segmentSize = 360 / WHEEL_ITEMS.length;
        const winIndex = Math.floor((360 - finalAngle + segmentSize / 2) % 360 / segmentSize);
        const winner = WHEEL_ITEMS[winIndex % WHEEL_ITEMS.length];

        setTimeout(() => {
            setSpinning(false);
            setResult(winner);
            dispatch({ type: 'USE_SPIN', payload: winner });
            dispatch({ type: 'ADD_EMBER_SCORE', payload: winner.score });
        }, 4000);
    };

    return (
        <div className="screen spin-wheel">
            <div className="screen__content">
                <div className="game__header">
                    <button className="btn btn--icon" onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'lobby' })}>
                        <Icon name="arrow-left" size={20} />
                    </button>
                    <h2 className="game__title">Spin Wheel</h2>
                </div>

                {/* Wheel */}
                <div className="spin__container">
                    <div className="spin__pointer">
                        <Icon name="arrow-down" size={24} color="#e84393" />
                    </div>
                    <div
                        className="spin__wheel"
                        style={{
                            transform: `rotate(${rotation}deg)`,
                            transition: spinning ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
                        }}
                    >
                        {WHEEL_ITEMS.map((item, i) => {
                            const angle = (360 / WHEEL_ITEMS.length) * i;
                            return (
                                <div
                                    key={i}
                                    className="spin__segment"
                                    style={{
                                        transform: `rotate(${angle}deg)`,
                                        borderColor: `${item.color} transparent transparent transparent`,
                                    }}
                                >
                                    <span
                                        className="spin__segment-label"
                                        style={{ transform: `rotate(${360 / WHEEL_ITEMS.length / 2}deg)` }}
                                    >
                                        {item.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Spin button */}
                <button
                    className={`btn btn--primary btn--lg ${!spinAvailable ? 'btn--disabled' : ''}`}
                    onClick={handleSpin}
                    disabled={spinning || !spinAvailable}
                    style={{ width: '100%', marginTop: 24 }}
                >
                    <Icon name="wheel" size={20} />
                    <span>{spinning ? 'Spinning...' : !spinAvailable ? 'Already Spun' : 'Spin!'}</span>
                </button>

                {/* Result */}
                {result && (
                    <div className="game__prompt glass-card" style={{ marginTop: 24, textAlign: 'center' }}>
                        <Icon name="trophy" size={32} color={result.color} />
                        <h3 style={{ marginTop: 8 }}>{result.label}</h3>
                        <p className="game__prompt-text">+{result.score} ember points!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
