import React from 'react';
import { useGame } from '../engine/gameState';

const games = [
    { id: 'ludo', screen: 'ludo', title: 'Lust Ludo', emoji: '🎲', desc: 'Roll the dice. Every square dares you deeper.', color: '#e84393', heat: '🔥🔥🔥' },
    { id: 'snakes', screen: 'snakes', title: 'Sins & Ladders', emoji: '🐍', desc: 'Climb ladders of desire. Slide back to sweetness.', color: '#6c5ce7', heat: '🔥🔥🔥' },
    { id: 'monopoly', screen: 'monopoly', title: 'Desire Monopoly', emoji: '🏘️', desc: 'Buy body parts. Collect rent in pleasure.', color: '#fd79a8', heat: '🔥🔥🔥🔥' },
    { id: 'truth-dare', screen: 'truth-dare', title: 'Truth or Dare', emoji: '🔥', desc: '5 rounds. Each one hotter than the last.', color: '#ff6b6b', heat: '🔥🔥' },
    { id: 'strip-quiz', screen: 'strip-quiz', title: 'Strip Quiz', emoji: '🃏', desc: 'Wrong answer? Lose a layer.', color: '#e17055', heat: '🔥🔥🔥' },
];

export default function MiniGames() {
    const { dispatch } = useGame();

    return (
        <div className="minigames page-enter">
            <div className="container">
                <button className="btn btn--ghost" onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'lobby' })} style={{ alignSelf: 'flex-start' }}>
                    ← Back
                </button>

                <div className="minigames__header animate-fade-in-up">
                    <h1 className="minigames__title font-story">Pick Your Game</h1>
                    <p className="minigames__subtitle">Every game leads somewhere... 😏</p>
                </div>

                <div className="minigames__grid">
                    {games.map((game, i) => (
                        <button
                            key={game.id}
                            className="minigames__card glass-card animate-fade-in-up"
                            style={{ animationDelay: `${i * 100}ms`, '--card-accent': game.color }}
                            onClick={() => dispatch({ type: 'SET_SCREEN', payload: game.screen })}
                        >
                            <div className="minigames__card-emoji">{game.emoji}</div>
                            <h3 className="minigames__card-title">{game.title}</h3>
                            <p className="minigames__card-desc">{game.desc}</p>
                            <div className="minigames__card-heat">{game.heat}</div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
