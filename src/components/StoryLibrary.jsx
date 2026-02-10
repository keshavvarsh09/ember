import React from 'react';
import { useGame } from '../engine/gameState';
import { stories } from '../data/stories';

export default function StoryLibrary() {
    const { state, dispatch } = useGame();

    const handleSelectStory = (story) => {
        dispatch({
            type: 'START_STORY',
            payload: { story, startNode: 'start' },
        });
    };

    const isCompleted = (id) => state.storiesCompleted.includes(id);
    const isUnlocked = (id) => state.unlockedStories.includes(id);

    return (
        <div className="library page-enter">
            <div className="container">
                <button className="btn btn--ghost" onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'lobby' })}>
                    ← Back
                </button>

                <div className="library__header animate-fade-in-up">
                    <h2 className="library__title font-story">
                        Story <span className="text-gradient">Library</span>
                    </h2>
                    <p className="library__subtitle">Choose your adventure. Play it your way.</p>
                </div>

                <div className="library__grid">
                    {stories.map((story, i) => {
                        const unlocked = isUnlocked(story.id);
                        const completed = isCompleted(story.id);
                        return (
                            <div
                                key={story.id}
                                className={`library__card glass-card animate-fade-in-up ${!unlocked ? 'library__card--locked' : ''} ${completed ? 'library__card--completed' : ''}`}
                                style={{ animationDelay: `${i * 100}ms` }}
                                onClick={() => unlocked && handleSelectStory(story)}
                            >
                                {!unlocked && <div className="library__card-lock">🔒</div>}
                                {completed && <div className="library__card-badge">✓ Completed</div>}

                                <div className="library__card-emoji">{story.emoji}</div>
                                <h3 className="library__card-title font-story">{story.title}</h3>
                                <p className="library__card-subtitle">{story.subtitle}</p>

                                <div className="library__card-meta">
                                    <span className="library__card-duration">⏱ {story.duration}</span>
                                    <span className="library__card-heat">{'🔥'.repeat(story.heat)}</span>
                                </div>

                                <div className="library__card-tags">
                                    {story.tags.map((tag) => (
                                        <span key={tag} className="library__card-tag">#{tag}</span>
                                    ))}
                                </div>

                                {unlocked && (
                                    <div className="library__card-cta">
                                        {completed ? 'Replay →' : 'Play →'}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Coming Soon */}
                <div className="library__coming glass-card animate-fade-in-up delay-5">
                    <span className="library__coming-icon">🌙</span>
                    <h3 className="font-story">More stories coming...</h3>
                    <p>New chapters drop every week. Your preferences shape what we write next.</p>
                </div>
            </div>
        </div>
    );
}
