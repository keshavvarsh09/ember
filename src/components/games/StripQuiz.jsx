import React, { useState, useCallback } from 'react';
import { useGame } from '../../engine/gameState';
import { sendGameEvent } from '../../lib/realtimeManager';
import Icon from '../ui/Icons';
import { stripQuizQuestions } from '../../data/games-data';

const CLOTHING_ITEMS = [
    { id: 'hat', icon: 'user', label: 'Hat' },
    { id: 'top', icon: 'user', label: 'Top' },
    { id: 'pants', icon: 'user', label: 'Pants' },
    { id: 'socks', icon: 'user', label: 'Socks' },
    { id: 'underwear', icon: 'shield', label: 'Underwear' },
];

export default function StripQuiz() {
    const { state, dispatch } = useGame();
    const { stripQuizState, userId, userProfile, partnerProfile } = state;
    const { round, currentTurn, clothingRemoved } = stripQuizState;
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showResult, setShowResult] = useState(false);

    const playerIndex = currentTurn === 0 ? 0 : 1;
    const isMyTurn = currentTurn === playerIndex;

    const startQuestion = useCallback(() => {
        const questions = stripQuizQuestions || [
            { question: "What's your partner's favorite color?", options: ['Red', 'Blue', 'Purple', 'Black'], correct: 0 },
        ];
        const q = questions[round % questions.length];
        setCurrentQuestion(q);
        setSelectedAnswer(null);
        setShowResult(false);

        sendGameEvent('quiz_question', { question: q, round, playerIndex });
    }, [round, playerIndex]);

    const answerQuestion = (answerIdx) => {
        setSelectedAnswer(answerIdx);
        setShowResult(true);

        const isCorrect = answerIdx === currentQuestion?.correct;
        const newClothing = [...clothingRemoved];
        if (!isCorrect) {
            newClothing[playerIndex] = Math.min(newClothing[playerIndex] + 1, 5);
        }

        const update = {
            round: round + 1,
            currentTurn: currentTurn === 0 ? 1 : 0,
            clothingRemoved: newClothing,
        };

        setTimeout(() => {
            dispatch({ type: 'UPDATE_STRIP_QUIZ', payload: update });
            sendGameEvent('quiz_answer', { update, isCorrect, playerIndex });
            setCurrentQuestion(null);
            setShowResult(false);
        }, 2000);
    };

    const resetGame = () => {
        dispatch({ type: 'RESET_GAME' });
        sendGameEvent('game_reset', { game: 'strip-quiz' });
        dispatch({ type: 'SET_SCREEN', payload: 'minigames' });
    };

    // Game over if someone lost all clothing
    const gameOver = clothingRemoved[0] >= 5 || clothingRemoved[1] >= 5;

    if (gameOver) {
        return (
            <div className="screen game-screen">
                <div className="screen__content" style={{ textAlign: 'center' }}>
                    <Icon name="trophy" size={64} color="#ffd700" />
                    <h2 className="screen__title" style={{ marginTop: 16 }}>Game Over!</h2>
                    <p className="screen__subtitle">
                        {clothingRemoved[0] >= 5 ? partnerProfile.name : userProfile.name} wins!
                    </p>
                    <button className="btn btn--primary" onClick={resetGame} style={{ marginTop: 24 }}>
                        <Icon name="refresh" size={16} />
                        <span>Play Again</span>
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
                    <h2 className="game__title">Strip Quiz</h2>
                    <span className="game__round">Round {round + 1}</span>
                </div>

                {/* Clothing tracker */}
                <div className="game__scores" style={{ marginBottom: 16 }}>
                    <div className="game__score-card">
                        <span>{userProfile.name || 'You'}</span>
                        <div className="quiz__clothing-row">
                            {CLOTHING_ITEMS.map((item, i) => (
                                <div key={item.id} className={`quiz__clothing-item ${i < clothingRemoved[0] ? 'quiz__clothing-item--removed' : ''}`}>
                                    <Icon name={item.icon} size={14} />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="game__score-card">
                        <span>{partnerProfile.name || 'Partner'}</span>
                        <div className="quiz__clothing-row">
                            {CLOTHING_ITEMS.map((item, i) => (
                                <div key={item.id} className={`quiz__clothing-item ${i < clothingRemoved[1] ? 'quiz__clothing-item--removed' : ''}`}>
                                    <Icon name={item.icon} size={14} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Turn indicator */}
                <div className="game__turn-indicator" style={{ textAlign: 'center', marginBottom: 16 }}>
                    {isMyTurn ? (
                        <span className="game__your-turn">Your turn to answer</span>
                    ) : (
                        <span className="game__partner-turn">{partnerProfile.name}'s turn</span>
                    )}
                </div>

                {/* Start question */}
                {!currentQuestion && isMyTurn && (
                    <button className="btn btn--primary btn--lg" onClick={startQuestion} style={{ width: '100%' }}>
                        <Icon name="zap" size={20} />
                        <span>Draw Question</span>
                    </button>
                )}

                {!currentQuestion && !isMyTurn && (
                    <div className="td__waiting">
                        <div className="onboarding__pulse" />
                        <span>Waiting for {partnerProfile.name}...</span>
                    </div>
                )}

                {/* Question display */}
                {currentQuestion && (
                    <div className="game__prompt glass-card">
                        <p className="game__prompt-text">{currentQuestion.question}</p>
                        <div className="quiz__options">
                            {currentQuestion.options?.map((opt, i) => (
                                <button
                                    key={i}
                                    className={`quiz__option ${selectedAnswer === i ? (i === currentQuestion.correct ? 'quiz__option--correct' : 'quiz__option--wrong') : ''}`}
                                    onClick={() => !showResult && answerQuestion(i)}
                                    disabled={showResult}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>

                        {showResult && (
                            <div className={`quiz__result ${selectedAnswer === currentQuestion.correct ? 'quiz__result--correct' : 'quiz__result--wrong'}`}>
                                <Icon name={selectedAnswer === currentQuestion.correct ? 'check-circle' : 'close'} size={20} />
                                <span>
                                    {selectedAnswer === currentQuestion.correct ? 'Correct!' : 'Wrong! Remove one item...'}
                                </span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
