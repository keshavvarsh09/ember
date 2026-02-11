import React, { useState, useCallback } from 'react';
import { useGame } from '../../engine/gameState';
import { sendGameEvent } from '../../lib/realtimeManager';
import Icon from '../ui/Icons';
import { truthOrDarePrompts } from '../../data/games-data';

export default function TruthOrDare() {
    const { state, dispatch } = useGame();
    const { truthDareState, userId, userProfile, partnerProfile } = state;
    const { round, currentTurn } = truthDareState;
    const [choice, setChoice] = useState(null); // 'truth' | 'dare'
    const [currentPrompt, setCurrentPrompt] = useState(null);
    const [completed, setCompleted] = useState(false);

    const playerIndex = currentTurn === 0 ? 0 : 1;
    const isMyTurn = currentTurn === playerIndex;
    const MAX_ROUNDS = 10;

    const pickChoice = useCallback((type) => {
        setChoice(type);
        const prompts = type === 'truth' ? truthOrDarePrompts?.truth : truthOrDarePrompts?.dare;
        const allPrompts = prompts || [
            { text: 'What is your deepest desire?', heat: 2 },
            { text: 'Act out your favorite fantasy.', heat: 3 },
        ];
        const prompt = allPrompts[Math.floor(Math.random() * allPrompts.length)];
        setCurrentPrompt(prompt);

        sendGameEvent('td_choice', { type, prompt, round, playerIndex });
    }, [round, playerIndex]);

    const completePrompt = () => {
        setCompleted(true);
        const update = {
            round: round + 1,
            currentTurn: currentTurn === 0 ? 1 : 0,
        };
        dispatch({ type: 'UPDATE_TRUTH_DARE', payload: update });
        sendGameEvent('td_complete', { update });

        setTimeout(() => {
            setChoice(null);
            setCurrentPrompt(null);
            setCompleted(false);
        }, 1500);
    };

    const resetGame = () => {
        dispatch({ type: 'RESET_GAME' });
        sendGameEvent('game_reset', { game: 'truth-dare' });
        dispatch({ type: 'SET_SCREEN', payload: 'minigames' });
    };

    if (round >= MAX_ROUNDS) {
        return (
            <div className="screen game-screen">
                <div className="screen__content" style={{ textAlign: 'center' }}>
                    <Icon name="trophy" size={64} color="#ffd700" />
                    <h2 className="screen__title" style={{ marginTop: 16 }}>Game Complete!</h2>
                    <p className="screen__subtitle">{MAX_ROUNDS} rounds of truth & dare</p>
                    <button className="btn btn--primary" onClick={resetGame} style={{ marginTop: 24 }}>
                        <Icon name="refresh" size={16} />
                        <span>Play Again</span>
                    </button>
                    <button className="btn btn--secondary" onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'minigames' })} style={{ marginTop: 12 }}>
                        Back to Games
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="screen game-screen">
            <div className="screen__content">
                <div className="game__header">
                    <button className="btn btn--icon" onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'minigames' })}>
                        <Icon name="arrow-left" size={20} />
                    </button>
                    <h2 className="game__title">Truth or Dare</h2>
                    <span className="game__round">Round {round + 1}/{MAX_ROUNDS}</span>
                </div>

                {/* Turn display */}
                <div className="td__turn-display">
                    <div className="game__turn-indicator">
                        {isMyTurn ? (
                            <span className="game__your-turn">
                                <Icon name="user" size={16} /> Your turn to choose
                            </span>
                        ) : (
                            <span className="game__partner-turn">
                                <Icon name="users" size={16} /> {partnerProfile.name}'s turn
                            </span>
                        )}
                    </div>
                </div>

                {/* Choice buttons */}
                {!choice && isMyTurn && (
                    <div className="td__choices">
                        <button className="td__choice-btn td__choice-btn--truth" onClick={() => pickChoice('truth')}>
                            <Icon name="eye" size={32} />
                            <span>Truth</span>
                        </button>
                        <button className="td__choice-btn td__choice-btn--dare" onClick={() => pickChoice('dare')}>
                            <Icon name="flame" size={32} />
                            <span>Dare</span>
                        </button>
                    </div>
                )}

                {/* Waiting for partner */}
                {!choice && !isMyTurn && (
                    <div className="td__waiting">
                        <div className="onboarding__pulse" />
                        <span>Waiting for {partnerProfile.name} to choose...</span>
                    </div>
                )}

                {/* Prompt display */}
                {currentPrompt && (
                    <div className={`game__prompt glass-card td__prompt td__prompt--${choice}`}>
                        <div className="game__prompt-type">
                            <Icon name={choice === 'truth' ? 'eye' : 'flame'} size={20} />
                            <span>{choice.toUpperCase()}</span>
                        </div>
                        <p className="game__prompt-text">{currentPrompt.text}</p>

                        {!completed && isMyTurn && (
                            <button className="btn btn--primary" onClick={completePrompt} style={{ marginTop: 16 }}>
                                <Icon name="check" size={16} />
                                <span>Done!</span>
                            </button>
                        )}

                        {completed && (
                            <div className="td__completed">
                                <Icon name="check-circle" size={24} color="#4ade80" />
                                <span>Completed!</span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
