import React, { useCallback } from 'react';
import { useGame } from '../../engine/gameState';
import { sendGameEvent } from '../../lib/realtimeManager';
import Icon from '../ui/Icons';
import { ludoSquares } from '../../data/games-data';

export default function LustLudo() {
    const { state, dispatch } = useGame();
    const { ludoState, userId, userProfile, partnerProfile } = state;
    const { positions, currentTurn, diceValue, currentSquare, gameOver } = ludoState;

    // Player index: creator = 0, joiner = 1
    const playerIndex = state.roomId ? (currentTurn === 0 ? 0 : 1) : 0;
    const isMyTurn = currentTurn === playerIndex;

    const rollDice = useCallback(() => {
        if (!isMyTurn || gameOver) return;

        const roll = Math.floor(Math.random() * 6) + 1;
        const newPos = Math.min(positions[playerIndex] + roll, 39);
        const square = ludoSquares?.[newPos] || { text: `Square ${newPos + 1}`, type: 'truth' };

        const update = {
            diceValue: roll,
            positions: positions.map((p, i) => i === playerIndex ? newPos : p),
            currentSquare: square,
            currentTurn: currentTurn === 0 ? 1 : 0,
            gameOver: newPos >= 39,
        };

        dispatch({ type: 'UPDATE_LUDO', payload: update });

        // Broadcast to partner
        sendGameEvent('ludo_move', {
            diceValue: roll,
            playerIndex,
            newPos,
            square,
            update,
        });
    }, [isMyTurn, gameOver, positions, playerIndex, currentTurn]);

    const resetGame = () => {
        dispatch({ type: 'RESET_GAME' });
        sendGameEvent('game_reset', { game: 'ludo' });
        dispatch({ type: 'SET_SCREEN', payload: 'minigames' });
    };

    return (
        <div className="screen game-screen">
            <div className="screen__content">
                <div className="game__header">
                    <button className="btn btn--icon" onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'minigames' })}>
                        <Icon name="arrow-left" size={20} />
                    </button>
                    <h2 className="game__title">Lust Ludo</h2>
                    <div className="game__turn-indicator">
                        {isMyTurn ? (
                            <span className="game__your-turn">Your turn</span>
                        ) : (
                            <span className="game__partner-turn">Partner's turn</span>
                        )}
                    </div>
                </div>

                {/* Board visualization */}
                <div className="game__board ludo__board">
                    <div className="ludo__track">
                        {Array.from({ length: 40 }).map((_, i) => {
                            const isP1 = positions[0] === i;
                            const isP2 = positions[1] === i;
                            return (
                                <div key={i} className={`ludo__square ${isP1 ? 'ludo__square--p1' : ''} ${isP2 ? 'ludo__square--p2' : ''}`}>
                                    <span className="ludo__square-num">{i + 1}</span>
                                    {isP1 && <div className="ludo__token ludo__token--p1"><Icon name="heart" size={12} /></div>}
                                    {isP2 && <div className="ludo__token ludo__token--p2"><Icon name="star" size={12} /></div>}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Dice */}
                <div className="game__dice-area">
                    <button
                        className={`game__dice-btn ${isMyTurn ? 'game__dice-btn--active' : ''}`}
                        onClick={rollDice}
                        disabled={!isMyTurn || gameOver}
                    >
                        <Icon name="dice" size={28} />
                        <span>{diceValue || '?'}</span>
                    </button>
                </div>

                {/* Current square prompt */}
                {currentSquare && (
                    <div className="game__prompt glass-card">
                        <div className="game__prompt-type">
                            <Icon name={currentSquare.type === 'dare' ? 'flame' : 'target'} size={18} />
                            <span>{currentSquare.type?.toUpperCase() || 'PROMPT'}</span>
                        </div>
                        <p className="game__prompt-text">{currentSquare.text}</p>
                    </div>
                )}

                {/* Score */}
                <div className="game__scores">
                    <div className="game__score-card">
                        <Icon name="heart" size={16} color="#e84393" />
                        <span>{userProfile.name || 'You'}: {positions[0]}/40</span>
                    </div>
                    <div className="game__score-card">
                        <Icon name="star" size={16} color="#8b5cf6" />
                        <span>{partnerProfile.name || 'Partner'}: {positions[1]}/40</span>
                    </div>
                </div>

                {/* Game over */}
                {gameOver && (
                    <div className="game__over glass-card">
                        <Icon name="trophy" size={40} color="#ffd700" />
                        <h3>{positions[0] >= 39 ? userProfile.name : partnerProfile.name} wins!</h3>
                        <button className="btn btn--primary" onClick={resetGame}>
                            <Icon name="refresh" size={16} />
                            <span>Play Again</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
