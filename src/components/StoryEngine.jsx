import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../engine/gameState';
import { getStoryNode } from '../data/stories';
import { sendGameEvent } from '../lib/realtimeManager';
import Icon from './ui/Icons';
import Avatar from './ui/Avatar';

const reactionIcons = ['flame', 'heart', 'zap', 'star', 'sparkle', 'eye', 'fire', 'target'];

export default function StoryEngine() {
    const { state, dispatch } = useGame();
    const [textRevealed, setTextRevealed] = useState(false);
    const [revealedChars, setRevealedChars] = useState(0);
    const [choiceMade, setChoiceMade] = useState(false);
    const [showDare, setShowDare] = useState(false);
    const [dareCompleted, setDareCompleted] = useState(false);
    const [showReactions, setShowReactions] = useState(false);
    const [partnerReaction, setPartnerReaction] = useState(null);
    const [writingInput, setWritingInput] = useState('');
    const [writingSubmitted, setWritingSubmitted] = useState(false);
    const [timedRemaining, setTimedRemaining] = useState(null);
    const [partnerTurnWaiting, setPartnerTurnWaiting] = useState(false);
    const textRef = useRef(null);
    const containerRef = useRef(null);
    const timerRef = useRef(null);

    const story = state.currentStory;
    const node = story ? getStoryNode(story, state.currentNode) : null;

    // Text reveal animation
    useEffect(() => {
        if (!node) return;
        setTextRevealed(false);
        setRevealedChars(0);
        setChoiceMade(false);
        setShowDare(false);
        setDareCompleted(false);
        setShowReactions(false);
        setPartnerReaction(null);
        setWritingInput('');
        setWritingSubmitted(false);
        setTimedRemaining(null);
        setPartnerTurnWaiting(false);

        const text = node.text || '';
        const speed = 15;
        let i = 0;
        const interval = setInterval(() => {
            i += 3;
            setRevealedChars(i);
            if (i >= text.length) {
                clearInterval(interval);
                setTextRevealed(true);
                if (node.dare) {
                    setTimeout(() => setShowDare(true), 600);
                }
                // Start timed choice countdown
                if (node.timed && node.choices) {
                    setTimedRemaining(node.timerSeconds || 15);
                }
                // Partner turn simulation
                if (node.partnerTurn) {
                    setPartnerTurnWaiting(true);
                    setTimeout(() => {
                        setPartnerTurnWaiting(false);
                        // Auto-choose for partner
                        if (node.choices && node.choices.length > 0) {
                            const rndChoice = node.choices[Math.floor(Math.random() * node.choices.length)];
                            handleChoice(rndChoice);
                        }
                    }, 3000 + Math.random() * 3000);
                }
            }
        }, speed);

        if (containerRef.current) {
            containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }

        return () => clearInterval(interval);
    }, [node?.id]);

    // Timed choice countdown
    useEffect(() => {
        if (timedRemaining === null || timedRemaining <= 0) return;
        timerRef.current = setTimeout(() => {
            setTimedRemaining(timedRemaining - 1);
        }, 1000);
        return () => clearTimeout(timerRef.current);
    }, [timedRemaining]);

    // Auto-pick when timer expires
    useEffect(() => {
        if (timedRemaining === 0 && !choiceMade && node?.choices) {
            const randomChoice = node.choices[Math.floor(Math.random() * node.choices.length)];
            handleChoice(randomChoice);
        }
    }, [timedRemaining]);

    // Simulate partner reaction
    useEffect(() => {
        if (textRevealed && !partnerReaction) {
            const delay = 2000 + Math.random() * 3000;
            const timer = setTimeout(() => {
                const icon = reactionIcons[Math.floor(Math.random() * reactionIcons.length)];
                setPartnerReaction(icon);
                setTimeout(() => setPartnerReaction(null), 3000);
            }, delay);
            return () => clearTimeout(timer);
        }
    }, [textRevealed]);

    if (!story || !node) {
        return (
            <div className="story-engine page-enter">
                <div className="container">
                    <p>No story loaded.</p>
                    <button className="btn btn--primary" onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'lobby' })}>
                        Back to Lobby
                    </button>
                </div>
            </div>
        );
    }

    const handleChoice = (choice) => {
        setChoiceMade(true);
        setTimedRemaining(null);
        setTimeout(() => {
            if (choice.nextNode) {
                dispatch({
                    type: 'MAKE_CHOICE',
                    payload: { nextNode: choice.nextNode, choice: choice.id },
                });
            }
        }, 500);
    };

    const handleEnding = () => {
        dispatch({
            type: 'COMPLETE_STORY',
            payload: { score: node.ending?.score || 50 },
        });
    };

    const handleReaction = (emoji) => {
        dispatch({ type: 'ADD_REACTION', payload: { emoji, from: 'user', time: Date.now() } });
        setShowReactions(false);
    };

    const handleWritingSubmit = () => {
        if (!writingInput.trim()) return;
        dispatch({
            type: 'SAVE_WRITING_RESPONSE',
            payload: { nodeId: node.id, text: writingInput.trim() },
        });
        setWritingSubmitted(true);
    };

    const displayText = (node.text || '').substring(0, revealedChars);
    const isEnding = node.type === 'ending';
    const isWritingPrompt = node.writingPrompt;
    const isDetailRequest = node.detailRequest;
    const timedPercentage = timedRemaining !== null ? (timedRemaining / (node.timerSeconds || 15)) * 100 : 100;

    return (
        <div className="story-engine page-enter" ref={containerRef}>
            {/* Partner presence */}
            <div className="story-engine__presence">
                <div className="story-engine__partner-dot" />
                <span>{state.partnerProfile.name} is reading with you</span>
            </div>

            {/* Partner floating reaction */}
            {partnerReaction && (
                <div className="story-engine__partner-reaction animate-scale-in">
                    <span className="story-engine__pr-emoji"><Icon name={partnerReaction} size={24} /></span>
                    <span className="story-engine__pr-name">{state.partnerProfile.name}</span>
                </div>
            )}

            <div className="container">
                {/* Header */}
                <div className="story-engine__header">
                    <button className="btn btn--ghost" onClick={() => {
                        dispatch({ type: 'END_SESSION' });
                        dispatch({ type: 'SET_SCREEN', payload: 'lobby' });
                    }}><Icon name="close" size={18} /></button>
                    <div className="story-engine__story-title">
                        <Icon name="heart" size={18} />
                        <span>{story.title}</span>
                    </div>
                    <button className="btn btn--ghost btn--icon" onClick={() => setShowReactions(!showReactions)}>
                        <Icon name="heart" size={18} color="#e84393" />
                    </button>
                </div>

                {/* Progress bar */}
                <div className="story-engine__progress">
                    <div
                        className="story-engine__progress-fill"
                        style={{ width: `${(state.storyHistory.length / Object.keys(story.nodes).length) * 100}%` }}
                    />
                </div>

                {/* Story text */}
                <div className="story-engine__text-container" ref={textRef}>
                    <div className="story-engine__text font-story">
                        {displayText.split('\n').map((paragraph, i) => (
                            <p key={i} className="story-engine__paragraph">{paragraph}</p>
                        ))}
                        {!textRevealed && <span className="story-engine__cursor">|</span>}
                    </div>
                </div>

                {/* Timed choice countdown */}
                {timedRemaining !== null && timedRemaining > 0 && (
                    <div className="story-engine__timer animate-fade-in-up">
                        <div className="story-engine__timer-ring">
                            <svg viewBox="0 0 100 100" className="story-engine__timer-svg">
                                <circle cx="50" cy="50" r="45" className="story-engine__timer-bg" />
                                <circle
                                    cx="50" cy="50" r="45"
                                    className="story-engine__timer-fill"
                                    style={{
                                        strokeDasharray: `${2 * Math.PI * 45}`,
                                        strokeDashoffset: `${2 * Math.PI * 45 * (1 - timedPercentage / 100)}`,
                                    }}
                                />
                            </svg>
                            <span className="story-engine__timer-number">{timedRemaining}</span>
                        </div>
                        <span className="story-engine__timer-label">Choose before time runs out!</span>
                    </div>
                )}

                {/* Partner turn waiting */}
                {partnerTurnWaiting && (
                    <div className="story-engine__partner-turn glass-card animate-scale-in">
                        <div className="story-engine__pt-avatar"><Avatar id={state.partnerProfile.avatarId} size={32} /></div>
                        <p className="font-story">{state.partnerProfile.name} is deciding...</p>
                        <div className="story-engine__pt-dots">
                            <span className="story-engine__pt-dot" />
                            <span className="story-engine__pt-dot" />
                            <span className="story-engine__pt-dot" />
                        </div>
                    </div>
                )}

                {/* Writing prompt */}
                {textRevealed && isWritingPrompt && !writingSubmitted && (
                    <div className="story-engine__writing glass-card animate-fade-in-up">
                        <div className="story-engine__writing-label"><Icon name="edit" size={16} /> Your Turn to Write</div>
                        <p className="story-engine__writing-prompt font-story">{node.writingPrompt}</p>
                        <textarea
                            className="story-engine__writing-input"
                            placeholder="Be descriptive... what happens next?"
                            value={writingInput}
                            onChange={(e) => setWritingInput(e.target.value)}
                            maxLength={node.maxLength || 300}
                            rows={4}
                        />
                        <div className="story-engine__writing-footer">
                            <span className="story-engine__writing-count">{writingInput.length}/{node.maxLength || 300}</span>
                            <button className="btn btn--primary" onClick={handleWritingSubmit} disabled={!writingInput.trim()}>
                                <Icon name="check" size={14} /> Submit
                            </button>
                        </div>
                    </div>
                )}

                {/* Writing submitted */}
                {writingSubmitted && (
                    <div className="story-engine__writing-done glass-card animate-scale-in">
                        <p className="font-story">"{writingInput}"</p>
                        <p className="story-engine__writing-reaction">
                            {state.partnerProfile.name} loved that. <Icon name="flame" size={14} color="#e84393" />
                        </p>
                    </div>
                )}

                {/* Detail request */}
                {textRevealed && isDetailRequest && !writingSubmitted && (
                    <div className="story-engine__detail glass-card animate-fade-in-up">
                        <div className="story-engine__detail-label"><Icon name="eye" size={16} /> Be Specific</div>
                        <p className="story-engine__detail-prompt font-story">{node.detailRequest}</p>
                        {node.senses && (
                            <div className="story-engine__senses">
                                {node.senses.map(s => (
                                    <span key={s} className="story-engine__sense-tag">
                                        {s === 'see' ? <Icon name="eye" size={12} /> : s === 'hear' ? <Icon name="mic" size={12} /> : s === 'feel' ? <Icon name="heart" size={12} /> : s === 'smell' ? <Icon name="sparkle" size={12} /> : <Icon name="flame" size={12} />} {s}
                                    </span>
                                ))}
                            </div>
                        )}
                        <textarea
                            className="story-engine__writing-input"
                            placeholder="Describe in vivid detail..."
                            value={writingInput}
                            onChange={(e) => setWritingInput(e.target.value)}
                            maxLength={300}
                            rows={4}
                        />
                        <button className="btn btn--primary btn--full" onClick={handleWritingSubmit} disabled={!writingInput.trim()}>
                            Share with {state.partnerProfile.name} <Icon name="check" size={14} />
                        </button>
                    </div>
                )}

                {/* Dare card */}
                {showDare && node.dare && (
                    <div className="story-engine__dare glass-card animate-scale-in">
                        <div className="story-engine__dare-header">{Array.from({ length: node.dare.heat }).map((_, i) => <Icon key={i} name="flame" size={14} color="#e84393" />)} DARE</div>
                        <p className="story-engine__dare-text font-story">{node.dare.text}</p>
                        {!dareCompleted ? (
                            <div className="story-engine__dare-actions">
                                <button className="btn btn--primary" onClick={() => setDareCompleted(true)}><Icon name="check" size={14} /> Done</button>
                                <button className="btn btn--ghost" onClick={() => setDareCompleted(true)}>Skip</button>
                            </div>
                        ) : (
                            <div className="story-engine__dare-complete animate-scale-in"><Icon name="sparkle" size={18} color="#ffd700" /> Nice!</div>
                        )}
                    </div>
                )}

                {/* Choices */}
                {textRevealed && !isEnding && node.choices && !partnerTurnWaiting &&
                    (!node.dare || dareCompleted || !showDare) &&
                    (!isWritingPrompt || writingSubmitted) &&
                    (!isDetailRequest || writingSubmitted) && (
                        <div className="story-engine__choices">
                            {node.choices.map((choice, i) => (
                                <button
                                    key={choice.id}
                                    className={`story-engine__choice glass-card animate-fade-in-up ${choiceMade ? 'story-engine__choice--fading' : ''}`}
                                    style={{ animationDelay: `${i * 150}ms` }}
                                    onClick={() => handleChoice(choice)}
                                    disabled={choiceMade}
                                >
                                    <span className="story-engine__choice-text">{choice.text}</span>
                                    <span className="story-engine__choice-tag">{choice.tag}</span>
                                </button>
                            ))}
                        </div>
                    )}

                {/* Ending */}
                {isEnding && textRevealed && (
                    <div className="story-engine__ending animate-scale-in">
                        {node.ending && (
                            <>
                                <h2 className="story-engine__ending-title font-story">{node.ending.title}</h2>
                                <p className="story-engine__ending-subtitle">{node.ending.subtitle}</p>
                                <div className="story-engine__ending-score">+{node.ending.score} <Icon name="fire" size={16} color="#ff6b35" /></div>
                            </>
                        )}
                        <button className="btn btn--primary btn--large btn--full" onClick={handleEnding} style={{ marginTop: '2rem' }}>
                            <Icon name="sparkle" size={16} /> Complete Story
                        </button>
                    </div>
                )}
            </div>

            {/* Reaction bar */}
            {showReactions && (
                <div className="story-engine__reaction-bar animate-fade-in-up">
                    {reactionIcons.map((iconName) => (
                        <button key={iconName} className="story-engine__reaction-btn" onClick={() => handleReaction(iconName)}>
                            <Icon name={iconName} size={22} />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
