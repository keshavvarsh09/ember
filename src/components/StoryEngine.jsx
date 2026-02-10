import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../engine/gameState';
import { getStoryNode } from '../data/stories';

const reactionEmojis = ['🔥', '😍', '🥵', '💜', '😏', '🫣', '💋', '⚡'];

export default function StoryEngine() {
    const { state, dispatch } = useGame();
    const [textRevealed, setTextRevealed] = useState(false);
    const [revealedChars, setRevealedChars] = useState(0);
    const [choiceMade, setChoiceMade] = useState(false);
    const [showDare, setShowDare] = useState(false);
    const [dareCompleted, setDareCompleted] = useState(false);
    const [showReactions, setShowReactions] = useState(false);
    const [partnerReaction, setPartnerReaction] = useState(null);
    const textRef = useRef(null);
    const containerRef = useRef(null);

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

        const text = node.text || '';
        const speed = 15; // ms per character
        let i = 0;
        const interval = setInterval(() => {
            i += 3;
            setRevealedChars(i);
            if (i >= text.length) {
                clearInterval(interval);
                setTextRevealed(true);
                // Show dare after text if present
                if (node.dare) {
                    setTimeout(() => setShowDare(true), 600);
                }
            }
        }, speed);

        // Scroll to top
        if (containerRef.current) {
            containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }

        return () => clearInterval(interval);
    }, [node?.id]);

    // Simulate partner reaction
    useEffect(() => {
        if (textRevealed && !partnerReaction) {
            const delay = 2000 + Math.random() * 3000;
            const timer = setTimeout(() => {
                const emoji = reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)];
                setPartnerReaction(emoji);
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

    const displayText = (node.text || '').substring(0, revealedChars);
    const isEnding = node.type === 'ending';

    return (
        <div className="story-engine page-enter" ref={containerRef}>
            {/* Partner presence indicator */}
            <div className="story-engine__presence">
                <div className="story-engine__partner-dot" />
                <span>{state.partnerProfile.name} is reading with you</span>
            </div>

            {/* Partner floating reaction */}
            {partnerReaction && (
                <div className="story-engine__partner-reaction animate-scale-in">
                    <span className="story-engine__pr-emoji">{partnerReaction}</span>
                    <span className="story-engine__pr-name">{state.partnerProfile.name}</span>
                </div>
            )}

            <div className="container">
                {/* Story header */}
                <div className="story-engine__header">
                    <button className="btn btn--ghost" onClick={() => {
                        dispatch({ type: 'END_SESSION' });
                        dispatch({ type: 'SET_SCREEN', payload: 'lobby' });
                    }}>
                        ✕
                    </button>
                    <div className="story-engine__story-title">
                        <span>{story.emoji}</span>
                        <span>{story.title}</span>
                    </div>
                    <button className="btn btn--ghost btn--icon" onClick={() => setShowReactions(!showReactions)}>
                        ❤️
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
                            <p key={i} className="story-engine__paragraph">
                                {paragraph}
                            </p>
                        ))}
                        {!textRevealed && <span className="story-engine__cursor">|</span>}
                    </div>
                </div>

                {/* Dare card */}
                {showDare && node.dare && (
                    <div className="story-engine__dare glass-card animate-scale-in">
                        <div className="story-engine__dare-header">
                            {'🔥'.repeat(node.dare.heat)} DARE
                        </div>
                        <p className="story-engine__dare-text font-story">{node.dare.text}</p>
                        {!dareCompleted ? (
                            <div className="story-engine__dare-actions">
                                <button className="btn btn--primary" onClick={() => setDareCompleted(true)}>
                                    Done ✓
                                </button>
                                <button className="btn btn--ghost" onClick={() => setDareCompleted(true)}>
                                    Skip
                                </button>
                            </div>
                        ) : (
                            <div className="story-engine__dare-complete animate-scale-in">
                                ✨ Nice!
                            </div>
                        )}
                    </div>
                )}

                {/* Choices */}
                {textRevealed && !isEnding && node.choices && (!node.dare || dareCompleted || !showDare) && (
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
                                <div className="story-engine__ending-score">
                                    +{node.ending.score} 🔥
                                </div>
                            </>
                        )}
                        {showDare && node.dare && (
                            <div className="story-engine__dare glass-card" style={{ marginTop: '1.5rem' }}>
                                <div className="story-engine__dare-header">
                                    {'🔥'.repeat(node.dare.heat)} FINAL DARE
                                </div>
                                <p className="story-engine__dare-text font-story">{node.dare.text}</p>
                            </div>
                        )}
                        <button className="btn btn--primary btn--large btn--full" onClick={handleEnding} style={{ marginTop: '2rem' }}>
                            Complete Story ✨
                        </button>
                    </div>
                )}
            </div>

            {/* Reaction bar */}
            {showReactions && (
                <div className="story-engine__reaction-bar animate-fade-in-up">
                    {reactionEmojis.map((emoji) => (
                        <button key={emoji} className="story-engine__reaction-btn" onClick={() => handleReaction(emoji)}>
                            {emoji}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
