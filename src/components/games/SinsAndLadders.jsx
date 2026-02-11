import React, { useCallback } from 'react';
import { useGame } from '../../engine/gameState';
import { sendGameEvent } from '../../lib/realtimeManager';
import Icon from '../ui/Icons';
import { snakesSquares, ladders as laddersData } from '../../data/games-data';

// Build lookup maps from ladders data
const SNAKES_MAP = {};
const LADDERS_MAP = {};
if (laddersData) {
    laddersData.forEach(item => {
        if (item.text?.includes('🐍') || item.from > item.to) {
            SNAKES_MAP[item.from] = item.to;
        } else {
            LADDERS_MAP[item.from] = item.to;
        }
    });
}

export default function SinsAndLadders() {
    const { state, dispatch } = useGame();
    const { snakesState, userId, userProfile, partnerProfile } = state;
    const { positions, currentTurn, diceValue, currentSquare, gameOver } = snakesState;

    const playerIndex = currentTurn === 0 ? 0 : 1;
    const isMyTurn = currentTurn === playerIndex;
    const BOARD_SIZE = 36;

    const rollDice = useCallback(() => {
        if (!isMyTurn || gameOver) return;

        const roll = Math.floor(Math.random() * 6) + 1;
        let newPos = Math.min(positions[playerIndex] + roll, BOARD_SIZE - 1);

        // Check for snakes or ladders
        const snakesMap = SNAKES_MAP || {};
        const laddersMap = LADDERS_MAP || {};
        let event = null;
        if (snakesMap[newPos] !== undefined) {
            event = 'snake';
            newPos = snakesMap[newPos];
        } else if (laddersMap[newPos] !== undefined) {
            event = 'ladder';
            newPos = laddersMap[newPos];
        }

        const square = snakesSquares?.[newPos] || { text: `Square ${newPos + 1}`, type: 'sin' };

        const update = {
            diceValue: roll,
            positions: positions.map((p, i) => i === playerIndex ? newPos : p),
            currentSquare: { ...square, event },
            currentTurn: currentTurn === 0 ? 1 : 0,
            gameOver: newPos >= BOARD_SIZE - 1,
        };

        dispatch({ type: 'UPDATE_SNAKES', payload: update });
        sendGameEvent('snakes_move', { update, playerIndex });
    }, [isMyTurn, gameOver, positions, playerIndex, currentTurn]);

    const resetGame = () => {
        dispatch({ type: 'RESET_GAME' });
        sendGameEvent('game_reset', { game: 'snakes' });
        dispatch({ type: 'SET_SCREEN', payload: 'minigames' });
    };

    // Render 6x6 grid
    const renderBoard = () => {
        const cells = [];
        for (let row = 5; row >= 0; row--) {
            const isReversed = row % 2 === 1;
            for (let col = 0; col < 6; col++) {
                const actualCol = isReversed ? 5 - col : col;
                const cellIndex = row * 6 + actualCol;
                const isP1 = positions[0] === cellIndex;
                const isP2 = positions[1] === cellIndex;
                const isSnake = (SNAKES_MAP || {})[cellIndex] !== undefined;
                const isLadder = (LADDERS_MAP || {})[cellIndex] !== undefined;

                cells.push(
                    <div
                        key={cellIndex}
                        className={`snakes__cell ${isP1 ? 'snakes__cell--p1' : ''} ${isP2 ? 'snakes__cell--p2' : ''} ${isSnake ? 'snakes__cell--snake' : ''} ${isLadder ? 'snakes__cell--ladder' : ''}`}
                    >
                        <span className="snakes__cell-num">{cellIndex + 1}</span>
                        {isSnake && <Icon name="arrow-down" size={10} color="#f43f5e" />}
                        {isLadder && <Icon name="arrow-up" size={10} color="#4ade80" />}
                        {isP1 && <div className="ludo__token ludo__token--p1"><Icon name="heart" size={8} /></div>}
                        {isP2 && <div className="ludo__token ludo__token--p2"><Icon name="star" size={8} /></div>}
                    </div>
                );
            }
        }
        return cells;
    };

    return (
        <div className="screen game-screen">
            <div className="screen__content">
                <div className="game__header">
                    <button className="btn btn--icon" onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'minigames' })}>
                        <Icon name="arrow-left" size={20} />
                    </button>
                    <h2 className="game__title">Sins & Ladders</h2>
                    <div className="game__turn-indicator">
                        {isMyTurn ? (
                            <span className="game__your-turn">Your turn</span>
                        ) : (
                            <span className="game__partner-turn">Partner's turn</span>
                        )}
                    </div>
                </div>

                {/* 6x6 Board */}
                <div className="snakes__board">
                    {renderBoard()}
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

                {/* Current square */}
                {currentSquare && (
                    <div className="game__prompt glass-card">
                        {currentSquare.event === 'snake' && (
                            <div className="game__event game__event--snake">
                                <Icon name="arrow-down" size={18} color="#f43f5e" />
                                <span>Slid down a sin!</span>
                            </div>
                        )}
                        {currentSquare.event === 'ladder' && (
                            <div className="game__event game__event--ladder">
                                <Icon name="arrow-up" size={18} color="#4ade80" />
                                <span>Climbed a ladder!</span>
                            </div>
                        )}
                        <p className="game__prompt-text">{currentSquare.text}</p>
                    </div>
                )}

                {/* Scores */}
                <div className="game__scores">
                    <div className="game__score-card">
                        <Icon name="heart" size={16} color="#e84393" />
                        <span>{userProfile.name || 'You'}: {positions[0] + 1}/36</span>
                    </div>
                    <div className="game__score-card">
                        <Icon name="star" size={16} color="#8b5cf6" />
                        <span>{partnerProfile.name || 'Partner'}: {positions[1] + 1}/36</span>
                    </div>
                </div>

                {gameOver && (
                    <div className="game__over glass-card">
                        <Icon name="trophy" size={40} color="#ffd700" />
                        <h3>{positions[0] >= 35 ? userProfile.name : partnerProfile.name} wins!</h3>
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
