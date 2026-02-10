import React, { useState } from 'react';
import { useGame } from '../../engine/gameState';
import { stripQuizQuestions } from '../../data/games-data';

const clothingItems = ['👒', '👕', '👖', '🧦', '🩲'];

export default function StripQuiz() {
    const { state, dispatch } = useGame();
    const [round, setRound] = useState(0);
    const [currentTurn, setCurrentTurn] = useState(0);
    const [currentQ, setCurrentQ] = useState(null);
    const [answered, setAnswered] = useState(false);
    const [correct, setCorrect] = useState(null);
    const [clothing, setClothing] = useState([
        [...clothingItems],
        [...clothingItems],
    ]);
    const [gameOver, setGameOver] = useState(false);
    const [showQuestion, setShowQuestion] = useState(false);

    const currentPlayer = currentTurn === 0 ? state.userProfile : state.partnerProfile;
    const otherPlayer = currentTurn === 0 ? state.partnerProfile : state.userProfile;

    const startQuestion = () => {
        const heat = Math.min(Math.floor(round / 4) + 1, 5);
        const available = stripQuizQuestions.filter(q => q.heat === heat);
        const q = available[Math.floor(Math.random() * available.length)] || stripQuizQuestions[0];
        setCurrentQ(q);
        setShowQuestion(true);
        setAnswered(false);
        setCorrect(null);
    };

    const handleAnswer = (isCorrect) => {
        setAnswered(true);
        setCorrect(isCorrect);

        if (!isCorrect) {
            // Remove clothing from answerer
            const newClothing = [...clothing];
            const playerClothes = [...newClothing[currentTurn]];
            if (playerClothes.length > 0) {
                playerClothes.pop();
                newClothing[currentTurn] = playerClothes;
                setClothing(newClothing);
            }

            // Check if someone is out
            if (playerClothes.length === 0) {
                setGameOver(true);
            }
        }
    };

    const nextRound = () => {
        setRound(round + 1);
        setCurrentTurn(currentTurn === 0 ? 1 : 0);
        setShowQuestion(false);
        setCurrentQ(null);
        setAnswered(false);
    };

    return (
        <div className="strip-quiz page-enter">
            <div className="container">
                <div className="strip-quiz__header">
                    <button className="btn btn--ghost" onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'minigames' })}>
                        ← Back
                    </button>
                    <h2 className="strip-quiz__title font-story">🃏 Strip Quiz</h2>
                </div>

                {/* Clothing trackers */}
                <div className="strip-quiz__trackers animate-fade-in-up">
                    <div className={`strip-quiz__tracker ${currentTurn === 0 ? 'strip-quiz__tracker--active' : ''}`}>
                        <span className="strip-quiz__tracker-name">{state.userProfile.name}</span>
                        <div className="strip-quiz__clothing">
                            {clothingItems.map((item, i) => (
                                <span
                                    key={i}
                                    className={`strip-quiz__clothing-item ${i >= clothing[0].length ? 'strip-quiz__clothing-item--removed' : ''}`}
                                >
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className={`strip-quiz__tracker ${currentTurn === 1 ? 'strip-quiz__tracker--active' : ''}`}>
                        <span className="strip-quiz__tracker-name">{state.partnerProfile.name || 'Partner'}</span>
                        <div className="strip-quiz__clothing">
                            {clothingItems.map((item, i) => (
                                <span
                                    key={i}
                                    className={`strip-quiz__clothing-item ${i >= clothing[1].length ? 'strip-quiz__clothing-item--removed' : ''}`}
                                >
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Start question */}
                {!showQuestion && !gameOver && (
                    <div className="strip-quiz__start animate-fade-in-up delay-1">
                        <h3 className="font-story">{currentPlayer.name}'s turn to answer</h3>
                        <p className="strip-quiz__hint">How well do you know {otherPlayer.name}?</p>
                        <p className="strip-quiz__round-label">Round {round + 1} • {'🔥'.repeat(Math.min(Math.floor(round / 4) + 1, 5))}</p>
                        <button className="btn btn--primary btn--full" onClick={startQuestion}>
                            Show Question 🎯
                        </button>
                    </div>
                )}

                {/* Question */}
                {showQuestion && currentQ && !gameOver && (
                    <div className="strip-quiz__question glass-card animate-scale-in">
                        <div className="strip-quiz__q-heat">{'🔥'.repeat(currentQ.heat)}</div>
                        <p className="strip-quiz__q-text font-story">{currentQ.text}</p>

                        {!answered ? (
                            <div className="strip-quiz__answer-btns">
                                <p className="strip-quiz__answer-hint">
                                    {otherPlayer.name} judges: Did {currentPlayer.name} get it right?
                                </p>
                                <button className="btn btn--primary" onClick={() => handleAnswer(true)}>
                                    ✓ Correct!
                                </button>
                                <button className="btn btn--secondary" onClick={() => handleAnswer(false)}>
                                    ✗ Wrong! Strip! 🔥
                                </button>
                            </div>
                        ) : (
                            <div className="strip-quiz__result animate-scale-in">
                                {correct ? (
                                    <div className="strip-quiz__correct">
                                        <span>✨</span>
                                        <p>Correct! Well done, {currentPlayer.name}!</p>
                                    </div>
                                ) : (
                                    <div className="strip-quiz__incorrect">
                                        <span>👗</span>
                                        <p>Wrong! Off it comes, {currentPlayer.name}... 😏</p>
                                    </div>
                                )}
                                <button className="btn btn--primary btn--full" onClick={nextRound} style={{ marginTop: '1rem' }}>
                                    Next Question →
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Game Over */}
                {gameOver && (
                    <div className="strip-quiz__gameover animate-scale-in">
                        <div className="strip-quiz__gameover-emoji">🏆</div>
                        <h2 className="font-story">{clothing[0].length === 0 ? state.userProfile.name : (state.partnerProfile.name || 'Partner')} is out!</h2>
                        <p>Winner gets to choose a dare for the loser... 😈</p>
                        <button className="btn btn--primary btn--full" onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'lobby' })} style={{ marginTop: '1.5rem' }}>
                            Back to Lobby
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
