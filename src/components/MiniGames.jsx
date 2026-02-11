import React from 'react';
import { useGame } from '../engine/gameState';
import Icon from './ui/Icons';

const GAMES = [
    { id: 'ludo', label: 'Lust Ludo', desc: '40-square board with intimate prompts', icon: 'board', color: '#e84393', screen: 'ludo' },
    { id: 'snakes', label: 'Sins & Ladders', desc: '6×6 grid with sins and rewards', icon: 'arrow-up', color: '#8b5cf6', screen: 'snakes' },
    { id: 'monopoly', label: 'Desire Monopoly', desc: 'Buy body-part properties', icon: 'cards', color: '#ff6b35', screen: 'monopoly' },
    { id: 'truth-dare', label: 'Truth or Dare', desc: '10 rounds of escalation', icon: 'flame', color: '#f43f5e', screen: 'truth-dare' },
    { id: 'strip-quiz', label: 'Strip Quiz', desc: 'Answer wrong, lose an item', icon: 'zap', color: '#0ea5e9', screen: 'strip-quiz' },
];

export default function MiniGames() {
    const { dispatch } = useGame();

    return (
        <div className="screen minigames">
            <div className="screen__content">
                <div className="game__header">
                    <button className="btn btn--icon" onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'lobby' })}>
                        <Icon name="arrow-left" size={20} />
                    </button>
                    <h2 className="game__title">Games</h2>
                </div>

                <p className="screen__subtitle" style={{ marginBottom: 24 }}>
                    All games sync in real-time with your partner
                </p>

                <div className="minigames__list">
                    {GAMES.map(game => (
                        <div
                            key={game.id}
                            className="minigames__card glass-card"
                            onClick={() => {
                                dispatch({ type: 'SET_ACTIVE_GAME', payload: game.id });
                                dispatch({ type: 'SET_SCREEN', payload: game.screen });
                            }}
                        >
                            <div className="minigames__card-icon" style={{ background: `${game.color}22`, color: game.color }}>
                                <Icon name={game.icon} size={28} color={game.color} />
                            </div>
                            <div className="minigames__card-info">
                                <h3 className="minigames__card-title">{game.label}</h3>
                                <p className="minigames__card-desc">{game.desc}</p>
                            </div>
                            <Icon name="arrow-right" size={18} style={{ opacity: 0.5 }} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
