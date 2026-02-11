import React from 'react';
import { useGame } from '../engine/gameState';
import { stories } from '../data/stories';
import Icon from './ui/Icons';

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
        <div className="screen story-library">
            <div className="screen__content">
                <div className="game__header">
                    <button className="btn btn--icon" onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'lobby' })}>
                        <Icon name="arrow-left" size={20} />
                    </button>
                    <h2 className="game__title">Story Library</h2>
                </div>

                <p className="screen__subtitle">Choose your adventure. Play it your way.</p>

                <div className="library__grid">
                    {stories.map((story, i) => {
                        const unlocked = isUnlocked(story.id);
                        const completed = isCompleted(story.id);
                        return (
                            <div
                                key={story.id}
                                className={`library__card glass-card ${!unlocked ? 'library__card--locked' : ''} ${completed ? 'library__card--completed' : ''}`}
                                onClick={() => unlocked && handleSelectStory(story)}
                            >
                                {!unlocked && (
                                    <div className="library__card-lock">
                                        <Icon name="lock" size={20} />
                                    </div>
                                )}
                                {completed && (
                                    <div className="library__card-badge">
                                        <Icon name="check-circle" size={14} /> Completed
                                    </div>
                                )}

                                <div className="library__card-icon">
                                    <Icon name="heart" size={28} color={story.color || '#e84393'} />
                                </div>
                                <h3 className="library__card-title">{story.title}</h3>
                                <p className="library__card-subtitle">{story.subtitle}</p>

                                <div className="library__card-meta">
                                    <span className="library__card-duration">
                                        <Icon name="clock" size={12} /> {story.duration}
                                    </span>
                                    <span className="library__card-heat">
                                        {Array.from({ length: story.heat }).map((_, i) => (
                                            <Icon key={i} name="flame" size={12} color="#e84393" />
                                        ))}
                                    </span>
                                </div>

                                <div className="library__card-tags">
                                    {story.tags.map((tag) => (
                                        <span key={tag} className="library__card-tag">#{tag}</span>
                                    ))}
                                </div>

                                {unlocked && (
                                    <div className="library__card-cta">
                                        {completed ? 'Replay' : 'Play'} <Icon name="arrow-right" size={14} />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Coming Soon */}
                <div className="glass-card" style={{ marginTop: 24, padding: 16, textAlign: 'center' }}>
                    <Icon name="moon" size={28} color="rgba(255,255,255,0.3)" />
                    <h3 style={{ marginTop: 8 }}>More stories coming...</h3>
                    <p className="screen__subtitle">New chapters drop every week</p>
                </div>
            </div>
        </div>
    );
}
