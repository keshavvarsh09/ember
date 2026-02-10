import React, { useState } from 'react';
import { useGame } from '../../engine/gameState';
import { truthOrDarePrompts } from '../../data/games-data';

export default function TruthOrDare() {
    const { state, dispatch } = useGame();
    const [round, setRound] = useState(0);
    const [currentTurn, setCurrentTurn] = useState(0);
    const [choice, setChoice] = useState(null); // 'truth' | 'dare'
    const [currentPrompt, setCurrentPrompt] = useState(null);
    const [revealed, setRevealed] = useState(false);
    const [clothingRemoved, setClothingRemoved] = useState([0, 0]);
    const [skipped, setSkipped] = useState(false);
    const [gameOver, setGameOver] = useState(false);

    const currentPlayer = currentTurn === 0 ? state.userProfile : state.partnerProfile;
    const heatLevel = Math.min(Math.floor(round / 2) + 1, 5);
    const heatLabels = ['', 'Warm 😊', 'Flirty 😏', 'Steamy 🥵', 'Hot 🔥', 'Inferno 💜'];
    const totalRounds = 10;

    const handleChoice = (type) => {
        setChoice(type);
        const prompts = type === 'truth' ? truthOrDarePrompts.truth : truthOrDarePrompts.dare;
        const filtered = prompts.filter(p => p.heat === heatLevel);
        const prompt = filtered[Math.floor(Math.random() * filtered.length)] || prompts[0];
        setCurrentPrompt(prompt);
        setRevealed(false);
        setSkipped(false);
        setTimeout(() => setRevealed(true), 800);
    };

    const handleDone = () => {
        const nextRound = round + 1;
        if (nextRound >= totalRounds) {
            setGameOver(true);
        } else {
            setRound(nextRound);
            setCurrentTurn(currentTurn === 0 ? 1 : 0);
            setChoice(null);
            setCurrentPrompt(null);
            setRevealed(false);
        }
    };

    const handleSkip = () => {
        // Skip costs a clothing item
        const newClothing = [...clothingRemoved];
        newClothing[currentTurn]++;
        setClothingRemoved(newClothing);
        setSkipped(true);
    };

    return (
        <div className="truth-dare page-enter">
            <div className="container">
                <div className="truth-dare__header">
                    <button className="btn btn--ghost" onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'minigames' })}>
                        ← Back
                    </button>
                    <h2 className="truth-dare__title font-story">🔥 Truth or Dare</h2>
                </div>

                {/* Round indicator */}
                <div className="truth-dare__round animate-fade-in-up">
                    <div className="truth-dare__round-bar">
                        <div className="truth-dare__round-fill" style={{ width: `${(round / totalRounds) * 100}%` }} />
                    </div>
                    <div className="truth-dare__round-info">
                        <span>Round {round + 1}/{totalRounds}</span>
                        <span className="truth-dare__heat-label">{heatLabels[heatLevel]}</span>
                    </div>
                </div>

                {/* Players */}
                <div className="truth-dare__players animate-fade-in-up">
                    <div className={`truth-dare__player ${currentTurn === 0 ? 'truth-dare__player--active' : ''}`}>
                        <span>{state.userProfile.avatar}</span>
                        <span>{state.userProfile.name}</span>
                        {clothingRemoved[0] > 0 && <span className="truth-dare__stripped">-{clothingRemoved[0]} 👗</span>}
                    </div>
                    <div className={`truth-dare__player ${currentTurn === 1 ? 'truth-dare__player--active' : ''}`}>
                        <span>{state.partnerProfile.avatar}</span>
                        <span>{state.partnerProfile.name || 'Partner'}</span>
                        {clothingRemoved[1] > 0 && <span className="truth-dare__stripped">-{clothingRemoved[1]} 👗</span>}
                    </div>
                </div>

                {/* Choice */}
                {!choice && !gameOver && (
                    <div className="truth-dare__choice animate-fade-in-up delay-1">
                        <h3 className="font-story">{currentPlayer.name}, choose:</h3>
                        <div className="truth-dare__choice-btns">
                            <button className="truth-dare__choice-btn truth-dare__choice-btn--truth glass-card" onClick={() => handleChoice('truth')}>
                                <span className="truth-dare__choice-emoji">💬</span>
                                <span className="truth-dare__choice-label">Truth</span>
                            </button>
                            <button className="truth-dare__choice-btn truth-dare__choice-btn--dare glass-card" onClick={() => handleChoice('dare')}>
                                <span className="truth-dare__choice-emoji">⚡</span>
                                <span className="truth-dare__choice-label">Dare</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* Prompt */}
                {choice && currentPrompt && !gameOver && (
                    <div className="truth-dare__prompt glass-card animate-scale-in">
                        <div className="truth-dare__prompt-type">
                            {choice === 'truth' ? '💬 TRUTH' : '⚡ DARE'} {'🔥'.repeat(heatLevel)}
                        </div>
                        {revealed ? (
                            <>
                                <p className="truth-dare__prompt-text font-story">{currentPrompt.text}</p>
                                {!skipped ? (
                                    <div className="truth-dare__prompt-actions">
                                        <button className="btn btn--primary btn--full" onClick={handleDone}>
                                            Done ✓
                                        </button>
                                        <button className="btn btn--ghost" onClick={handleSkip}>
                                            Skip (costs clothing 👗)
                                        </button>
                                    </div>
                                ) : (
                                    <div className="truth-dare__skipped animate-scale-in">
                                        <p>Skipped! Remove a piece of clothing. 😏</p>
                                        <button className="btn btn--primary btn--full" onClick={handleDone}>
                                            Done
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="truth-dare__revealing">
                                <div className="truth-dare__card-flip">?</div>
                            </div>
                        )}
                    </div>
                )}

                {/* Game Over */}
                {gameOver && (
                    <div className="truth-dare__gameover animate-scale-in">
                        <div className="truth-dare__gameover-emoji">🔥</div>
                        <h2 className="font-story">All rounds complete!</h2>
                        <p>How much clothing is left? 😏</p>
                        <div className="truth-dare__final-score">
                            <span>{state.userProfile.name}: -{clothingRemoved[0]} items</span>
                            <span>{state.partnerProfile.name || 'Partner'}: -{clothingRemoved[1]} items</span>
                        </div>
                        <button className="btn btn--primary btn--full" onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'lobby' })} style={{ marginTop: '1.5rem' }}>
                            Back to Lobby 🔥
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
