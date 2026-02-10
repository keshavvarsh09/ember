import React, { useState } from 'react';
import { useGame } from '../../engine/gameState';
import { ludoSquares, rollDice } from '../../data/games-data';

const squareColors = {
    start: '#555', flirt: '#00b894', tease: '#fdcb6e', dare: '#e17055',
    heat: '#d63031', fantasy: '#6c5ce7', jackpot: '#f9ca24', finish: '#f9ca24',
    white: '#555',
};

export default function LustLudo() {
    const { state, dispatch } = useGame();
    const [playerPos, setPlayerPos] = useState(0);
    const [partnerPos, setPartnerPos] = useState(0);
    const [currentTurn, setCurrentTurn] = useState(0); // 0 = user, 1 = partner
    const [diceValue, setDiceValue] = useState(null);
    const [rolling, setRolling] = useState(false);
    const [activeSquare, setActiveSquare] = useState(null);
    const [showPrompt, setShowPrompt] = useState(false);
    const [gameOver, setGameOver] = useState(false);

    const currentPlayer = currentTurn === 0 ? state.userProfile : state.partnerProfile;
    const positions = [playerPos, partnerPos];

    const handleRoll = () => {
        if (rolling || showPrompt) return;
        setRolling(true);
        setDiceValue(null);

        // Dice animation
        let rolls = 0;
        const anim = setInterval(() => {
            setDiceValue(Math.floor(Math.random() * 6) + 1);
            rolls++;
            if (rolls > 8) {
                clearInterval(anim);
                const finalRoll = rollDice();
                setDiceValue(finalRoll);
                setRolling(false);

                // Move player
                const currentPos = currentTurn === 0 ? playerPos : partnerPos;
                let newPos = Math.min(currentPos + finalRoll, 39);

                if (currentTurn === 0) setPlayerPos(newPos);
                else setPartnerPos(newPos);

                // Show square prompt
                const square = ludoSquares[newPos];
                setActiveSquare(square);
                setShowPrompt(true);

                if (newPos >= 39) setGameOver(true);
            }
        }, 100);
    };

    const handlePromptDone = () => {
        setShowPrompt(false);
        setActiveSquare(null);
        if (!gameOver) {
            setCurrentTurn(currentTurn === 0 ? 1 : 0);
        }
    };

    // Simulate partner roll
    const handlePartnerRoll = () => {
        handleRoll();
    };

    const diceEmojis = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

    return (
        <div className="ludo page-enter">
            <div className="container">
                <div className="ludo__header">
                    <button className="btn btn--ghost" onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'minigames' })}>
                        ← Back
                    </button>
                    <h2 className="ludo__title font-story">🎲 Lust Ludo</h2>
                </div>

                {/* Player indicators */}
                <div className="ludo__players animate-fade-in-up">
                    <div className={`ludo__player ${currentTurn === 0 ? 'ludo__player--active' : ''}`}>
                        <span className="ludo__player-avatar">{state.userProfile.avatar}</span>
                        <span className="ludo__player-name">{state.userProfile.name}</span>
                        <span className="ludo__player-pos">Sq. {playerPos}</span>
                    </div>
                    <div className="ludo__vs">VS</div>
                    <div className={`ludo__player ${currentTurn === 1 ? 'ludo__player--active' : ''}`}>
                        <span className="ludo__player-avatar">{state.partnerProfile.avatar}</span>
                        <span className="ludo__player-name">{state.partnerProfile.name || 'Partner'}</span>
                        <span className="ludo__player-pos">Sq. {partnerPos}</span>
                    </div>
                </div>

                {/* Board (visual track) */}
                <div className="ludo__board animate-fade-in-up delay-1">
                    {ludoSquares.map((sq) => {
                        const isUser = sq.id === playerPos;
                        const isPartner = sq.id === partnerPos;
                        return (
                            <div
                                key={sq.id}
                                className={`ludo__square ${isUser ? 'ludo__square--user' : ''} ${isPartner ? 'ludo__square--partner' : ''} ${sq.id === activeSquare?.id && showPrompt ? 'ludo__square--active' : ''}`}
                                style={{ '--sq-color': squareColors[sq.type] || squareColors[sq.color] || '#555' }}
                                title={sq.text}
                            >
                                <span className="ludo__square-num">{sq.id}</span>
                                {isUser && <span className="ludo__token ludo__token--user">{state.userProfile.avatar}</span>}
                                {isPartner && <span className="ludo__token ludo__token--partner">{state.partnerProfile.avatar}</span>}
                            </div>
                        );
                    })}
                </div>

                {/* Dice */}
                {!gameOver && (
                    <div className="ludo__dice-area animate-fade-in-up delay-2">
                        <div className="ludo__turn-label">
                            {currentPlayer.avatar} {currentPlayer.name}'s turn
                        </div>
                        <button
                            className={`ludo__dice-btn ${rolling ? 'ludo__dice-btn--rolling' : ''}`}
                            onClick={currentTurn === 0 ? handleRoll : handlePartnerRoll}
                            disabled={rolling || showPrompt}
                        >
                            {diceValue ? diceEmojis[diceValue - 1] : '🎲'}
                        </button>
                        {diceValue && !rolling && <div className="ludo__dice-value">Rolled a {diceValue}!</div>}
                    </div>
                )}

                {/* Square prompt */}
                {showPrompt && activeSquare && (
                    <div className="ludo__prompt glass-card animate-scale-in">
                        <div className="ludo__prompt-type" style={{ color: squareColors[activeSquare.type] }}>
                            {activeSquare.type.toUpperCase()} {'🔥'.repeat(activeSquare.heat)}
                        </div>
                        <p className="ludo__prompt-text font-story">{activeSquare.text}</p>
                        {playerPos === partnerPos && playerPos > 0 && currentTurn === 0 && (
                            <div className="ludo__bonus-dare">
                                ⚡ You landed on {state.partnerProfile.name}'s square! They must do a bonus dare!
                            </div>
                        )}
                        <button className="btn btn--primary btn--full" onClick={handlePromptDone}>
                            Done ✓
                        </button>
                    </div>
                )}

                {/* Game over */}
                {gameOver && !showPrompt && (
                    <div className="ludo__gameover animate-scale-in">
                        <div className="ludo__gameover-emoji">🏆</div>
                        <h2 className="font-story">{currentPlayer.name} finished first!</h2>
                        <p>But let's be honest... you both won tonight. 😏</p>
                        <button className="btn btn--primary btn--full" onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'lobby' })} style={{ marginTop: '1.5rem' }}>
                            Back to Lobby 🔥
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
