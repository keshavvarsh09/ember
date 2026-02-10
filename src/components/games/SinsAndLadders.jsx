import React, { useState } from 'react';
import { useGame } from '../../engine/gameState';
import { snakesSquares, ladders, snakes, rollDice } from '../../data/games-data';

export default function SinsAndLadders() {
    const { state, dispatch } = useGame();
    const [playerPos, setPlayerPos] = useState(0);
    const [partnerPos, setPartnerPos] = useState(0);
    const [currentTurn, setCurrentTurn] = useState(0);
    const [diceValue, setDiceValue] = useState(null);
    const [rolling, setRolling] = useState(false);
    const [activeSquare, setActiveSquare] = useState(null);
    const [specialEvent, setSpecialEvent] = useState(null); // ladder or snake
    const [showPrompt, setShowPrompt] = useState(false);
    const [gameOver, setGameOver] = useState(false);

    const currentPlayer = currentTurn === 0 ? state.userProfile : state.partnerProfile;

    const checkLadderOrSnake = (pos) => {
        const ladder = ladders.find(l => l.from === pos);
        if (ladder) return { type: 'ladder', ...ladder };
        const snake = snakes.find(s => s.from === pos);
        if (snake) return { type: 'snake', ...snake };
        return null;
    };

    const handleRoll = () => {
        if (rolling || showPrompt) return;
        setRolling(true);
        setDiceValue(null);
        setSpecialEvent(null);

        let rolls = 0;
        const anim = setInterval(() => {
            setDiceValue(Math.floor(Math.random() * 6) + 1);
            rolls++;
            if (rolls > 8) {
                clearInterval(anim);
                const finalRoll = rollDice();
                setDiceValue(finalRoll);
                setRolling(false);

                const currentPos = currentTurn === 0 ? playerPos : partnerPos;
                let newPos = Math.min(currentPos + finalRoll, 36);

                // Check for ladder or snake
                const event = checkLadderOrSnake(newPos);
                if (event) {
                    setSpecialEvent(event);
                    newPos = event.to;
                }

                if (currentTurn === 0) setPlayerPos(newPos);
                else setPartnerPos(newPos);

                // Get square content
                const square = snakesSquares.find(s => s.id === newPos);
                setActiveSquare(square || { id: newPos, text: 'Keep going...', heat: 1 });
                setShowPrompt(true);

                if (newPos >= 36) setGameOver(true);
            }
        }, 100);
    };

    const handlePromptDone = () => {
        setShowPrompt(false);
        setActiveSquare(null);
        setSpecialEvent(null);
        if (!gameOver) {
            setCurrentTurn(currentTurn === 0 ? 1 : 0);
        }
    };

    const diceEmojis = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

    // Build 6x6 grid (bottom-left to top-right, snaking)
    const buildGrid = () => {
        const grid = [];
        for (let row = 5; row >= 0; row--) {
            const rowCells = [];
            for (let col = 0; col < 6; col++) {
                const idx = row % 2 === 0 ? row * 6 + col + 1 : row * 6 + (5 - col) + 1;
                rowCells.push(idx);
            }
            grid.push(rowCells);
        }
        return grid;
    };

    const grid = buildGrid();

    const getSquareHeat = (id) => {
        const sq = snakesSquares.find(s => s.id === id);
        return sq ? sq.heat : 1;
    };

    const heatColors = {
        1: '#00b894', 2: '#fdcb6e', 3: '#e17055', 4: '#d63031', 5: '#6c5ce7',
    };

    const hasLadder = (id) => ladders.some(l => l.from === id);
    const hasSnake = (id) => snakes.some(s => s.from === id);

    return (
        <div className="snakes page-enter">
            <div className="container">
                <div className="snakes__header">
                    <button className="btn btn--ghost" onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'minigames' })}>
                        ← Back
                    </button>
                    <h2 className="snakes__title font-story">🐍 Sins & Ladders</h2>
                </div>

                {/* Players */}
                <div className="snakes__players animate-fade-in-up">
                    <div className={`snakes__player ${currentTurn === 0 ? 'snakes__player--active' : ''}`}>
                        <span>{state.userProfile.avatar}</span>
                        <span>{state.userProfile.name}</span>
                    </div>
                    <div className="snakes__vs">VS</div>
                    <div className={`snakes__player ${currentTurn === 1 ? 'snakes__player--active' : ''}`}>
                        <span>{state.partnerProfile.avatar}</span>
                        <span>{state.partnerProfile.name || 'Partner'}</span>
                    </div>
                </div>

                {/* Board */}
                <div className="snakes__board animate-fade-in-up delay-1">
                    {grid.map((row, ri) => (
                        <div key={ri} className="snakes__row">
                            {row.map((cellId) => (
                                <div
                                    key={cellId}
                                    className={`snakes__cell ${cellId === playerPos ? 'snakes__cell--user' : ''} ${cellId === partnerPos ? 'snakes__cell--partner' : ''} ${cellId === activeSquare?.id && showPrompt ? 'snakes__cell--active' : ''}`}
                                    style={{ '--cell-color': heatColors[getSquareHeat(cellId)] }}
                                >
                                    <span className="snakes__cell-num">{cellId}</span>
                                    {hasLadder(cellId) && <span className="snakes__ladder-icon">🪜</span>}
                                    {hasSnake(cellId) && <span className="snakes__snake-icon">🐍</span>}
                                    {cellId === playerPos && <span className="snakes__token">{state.userProfile.avatar}</span>}
                                    {cellId === partnerPos && <span className="snakes__token">{state.partnerProfile.avatar}</span>}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                {/* Dice */}
                {!gameOver && (
                    <div className="snakes__dice-area animate-fade-in-up delay-2">
                        <div className="snakes__turn-label">
                            {currentPlayer.avatar} {currentPlayer.name}'s turn
                        </div>
                        <button
                            className={`snakes__dice-btn ${rolling ? 'snakes__dice-btn--rolling' : ''}`}
                            onClick={handleRoll}
                            disabled={rolling || showPrompt}
                        >
                            {diceValue ? diceEmojis[diceValue - 1] : '🎲'}
                        </button>
                    </div>
                )}

                {/* Prompt */}
                {showPrompt && activeSquare && (
                    <div className="snakes__prompt glass-card animate-scale-in">
                        {specialEvent && (
                            <div className={`snakes__event ${specialEvent.type === 'ladder' ? 'snakes__event--ladder' : 'snakes__event--snake'}`}>
                                {specialEvent.type === 'ladder' ? '🪜' : '🐍'} {specialEvent.text}
                            </div>
                        )}
                        <div className="snakes__prompt-heat">
                            {'🔥'.repeat(activeSquare.heat)}
                        </div>
                        <p className="snakes__prompt-text font-story">{activeSquare.text}</p>
                        <button className="btn btn--primary btn--full" onClick={handlePromptDone}>
                            Done ✓
                        </button>
                    </div>
                )}

                {/* Game Over */}
                {gameOver && !showPrompt && (
                    <div className="snakes__gameover animate-scale-in">
                        <div className="snakes__gameover-emoji">🔥</div>
                        <h2 className="font-story">{currentPlayer.name} reached the top!</h2>
                        <p>The finale awaits...</p>
                        <button className="btn btn--primary btn--full" onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'lobby' })} style={{ marginTop: '1.5rem' }}>
                            Back to Lobby
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
