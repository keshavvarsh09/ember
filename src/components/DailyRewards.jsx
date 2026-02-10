import React from 'react';
import { useGame } from '../engine/gameState';
import { dailyRewards } from '../data/games-data';

export default function DailyRewards() {
    const { state, dispatch } = useGame();

    const currentDay = state.dailyRewardDay % 7;
    const canClaim = !state.dailyRewardClaimed;

    // Check if it's a new day
    const isNewDay = () => {
        if (!state.lastRewardDate) return true;
        const last = new Date(state.lastRewardDate).toDateString();
        const today = new Date().toDateString();
        return last !== today;
    };

    const handleClaim = (day) => {
        if (!canClaim || day !== currentDay) return;
        const reward = dailyRewards[day];
        dispatch({ type: 'CLAIM_DAILY_REWARD', payload: { bonus: reward.bonus } });
    };

    return (
        <div className="daily-rewards page-enter">
            <div className="container">
                <button className="btn btn--ghost" onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'lobby' })} style={{ alignSelf: 'flex-start' }}>
                    ← Back
                </button>

                <div className="daily-rewards__header animate-fade-in-up">
                    <h1 className="daily-rewards__title font-story">🎁 Daily Rewards</h1>
                    <p className="daily-rewards__subtitle">Come back every day. The rewards get better.</p>
                    <div className="daily-rewards__streak">
                        🔥 {state.streak} day streak
                    </div>
                </div>

                <div className="daily-rewards__grid animate-fade-in-up delay-1">
                    {dailyRewards.map((reward, i) => {
                        const isClaimed = i < currentDay;
                        const isCurrent = i === currentDay;
                        const isLocked = i > currentDay;

                        return (
                            <button
                                key={i}
                                className={`daily-rewards__card glass-card ${isClaimed ? 'daily-rewards__card--claimed' : ''} ${isCurrent ? 'daily-rewards__card--current' : ''} ${isLocked ? 'daily-rewards__card--locked' : ''}`}
                                onClick={() => handleClaim(i)}
                                disabled={!isCurrent || !canClaim}
                            >
                                <span className="daily-rewards__day">Day {reward.day}</span>
                                <span className="daily-rewards__emoji">{reward.emoji}</span>
                                <span className="daily-rewards__reward-text">{reward.reward}</span>
                                <span className="daily-rewards__bonus">+{reward.bonus} 🔥</span>
                                {isClaimed && <span className="daily-rewards__check">✓</span>}
                                {isCurrent && canClaim && <span className="daily-rewards__claim-badge">CLAIM!</span>}
                                {isLocked && <span className="daily-rewards__lock">🔒</span>}
                            </button>
                        );
                    })}
                </div>

                {!canClaim && (
                    <div className="daily-rewards__claimed-msg animate-fade-in-up delay-2">
                        <p>✨ Today's reward claimed! Come back tomorrow for more.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
