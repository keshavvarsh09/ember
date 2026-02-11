import React, { useCallback } from 'react';
import { useGame } from '../../engine/gameState';
import { sendGameEvent } from '../../lib/realtimeManager';
import Icon from '../ui/Icons';
import { monopolyProperties } from '../../data/games-data';

export default function DesireMonopoly() {
    const { state, dispatch } = useGame();
    const { monopolyState, userId, userProfile, partnerProfile } = state;
    const { positions, currentTurn, diceValue, money, ownedProperties, currentCard, inJail, gameOver } = monopolyState;

    const playerIndex = currentTurn === 0 ? 0 : 1;
    const isMyTurn = currentTurn === playerIndex;

    const rollDice = useCallback(() => {
        if (!isMyTurn || gameOver) return;

        const roll = Math.floor(Math.random() * 6) + 1;
        const newPos = (positions[playerIndex] + roll) % 24;
        const prop = monopolyProperties?.[newPos] || { name: `Square ${newPos + 1}`, price: 50, type: 'property', action: 'Draw closer...' };

        const update = {
            diceValue: roll,
            positions: positions.map((p, i) => i === playerIndex ? newPos : p),
            currentCard: prop,
            currentTurn: currentTurn === 0 ? 1 : 0,
        };

        dispatch({ type: 'UPDATE_MONOPOLY', payload: update });
        sendGameEvent('monopoly_move', { update, playerIndex });
    }, [isMyTurn, gameOver, positions, playerIndex, currentTurn, money, ownedProperties]);

    const buyProperty = () => {
        if (!currentCard || !currentCard.price) return;
        const cost = currentCard.price;
        if (money[playerIndex] < cost) return;

        const newMoney = [...money];
        newMoney[playerIndex] -= cost;
        const newOwned = [...ownedProperties];
        newOwned[playerIndex] = [...newOwned[playerIndex], currentCard.name];

        const update = { money: newMoney, ownedProperties: newOwned };
        dispatch({ type: 'UPDATE_MONOPOLY', payload: update });
        sendGameEvent('monopoly_buy', { update, playerIndex, property: currentCard.name });
    };

    const resetGame = () => {
        dispatch({ type: 'RESET_GAME' });
        sendGameEvent('game_reset', { game: 'monopoly' });
        dispatch({ type: 'SET_SCREEN', payload: 'minigames' });
    };

    return (
        <div className="screen game-screen">
            <div className="screen__content">
                <div className="game__header">
                    <button className="btn btn--icon" onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'minigames' })}>
                        <Icon name="arrow-left" size={20} />
                    </button>
                    <h2 className="game__title">Desire Monopoly</h2>
                    <div className="game__turn-indicator">
                        {isMyTurn ? (
                            <span className="game__your-turn">Your turn</span>
                        ) : (
                            <span className="game__partner-turn">Partner's turn</span>
                        )}
                    </div>
                </div>

                {/* Money display */}
                <div className="game__scores" style={{ marginBottom: 16 }}>
                    <div className="game__score-card">
                        <Icon name="heart" size={16} color="#e84393" />
                        <span>{userProfile.name || 'You'}: ${money[0]}</span>
                    </div>
                    <div className="game__score-card">
                        <Icon name="star" size={16} color="#8b5cf6" />
                        <span>{partnerProfile.name || 'Partner'}: ${money[1]}</span>
                    </div>
                </div>

                {/* Board track */}
                <div className="monopoly__track">
                    {Array.from({ length: 24 }).map((_, i) => {
                        const prop = MONOPOLY_PROPERTIES?.[i];
                        const isP1 = positions[0] === i;
                        const isP2 = positions[1] === i;
                        const ownedBy = ownedProperties[0]?.includes(prop?.name) ? 0 : ownedProperties[1]?.includes(prop?.name) ? 1 : -1;

                        return (
                            <div key={i} className={`monopoly__cell ${isP1 ? 'monopoly__cell--p1' : ''} ${isP2 ? 'monopoly__cell--p2' : ''} ${ownedBy === 0 ? 'monopoly__cell--owned-p1' : ownedBy === 1 ? 'monopoly__cell--owned-p2' : ''}`}>
                                <span className="monopoly__cell-name">{prop?.name || i + 1}</span>
                                {prop?.price && <span className="monopoly__cell-price">${prop.price}</span>}
                                {isP1 && <div className="ludo__token ludo__token--p1" style={{ position: 'absolute', top: 2, right: 2 }}><Icon name="heart" size={8} /></div>}
                                {isP2 && <div className="ludo__token ludo__token--p2" style={{ position: 'absolute', bottom: 2, right: 2 }}><Icon name="star" size={8} /></div>}
                            </div>
                        );
                    })}
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

                {/* Current card */}
                {currentCard && (
                    <div className="game__prompt glass-card">
                        <div className="game__prompt-type">
                            <Icon name="cards" size={18} />
                            <span>{currentCard.name}</span>
                            {currentCard.price && <span className="monopoly__price-tag">${currentCard.price}</span>}
                        </div>
                        <p className="game__prompt-text">{currentCard.action}</p>

                        {currentCard.price && isMyTurn && money[playerIndex] >= currentCard.price && (
                            <button className="btn btn--primary btn--sm" onClick={buyProperty} style={{ marginTop: 12 }}>
                                <Icon name="plus" size={14} />
                                <span>Buy for ${currentCard.price}</span>
                            </button>
                        )}
                    </div>
                )}

                {/* Properties owned */}
                <div className="monopoly__owned">
                    <h4>Your Properties</h4>
                    <div className="monopoly__owned-list">
                        {ownedProperties[playerIndex]?.length > 0 ? (
                            ownedProperties[playerIndex].map((p, i) => (
                                <span key={i} className="monopoly__owned-tag">{p}</span>
                            ))
                        ) : (
                            <span style={{ opacity: 0.5 }}>None yet</span>
                        )}
                    </div>
                </div>

                {gameOver && (
                    <div className="game__over glass-card">
                        <Icon name="trophy" size={40} color="#ffd700" />
                        <h3>Game Over!</h3>
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
