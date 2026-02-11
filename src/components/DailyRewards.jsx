import React from 'react';
import { useGame } from '../engine/gameState';
import { supabase } from '../lib/supabaseClient';
import Icon from './ui/Icons';

const REWARDS = [
    { day: 1, label: 'Bonus Points', score: 25, icon: 'star' },
    { day: 2, label: 'Free Spin', score: 30, icon: 'wheel' },
    { day: 3, label: 'Dare Token', score: 35, icon: 'flame' },
    { day: 4, label: 'Story Unlock', score: 40, icon: 'heart' },
    { day: 5, label: 'Game Boost', score: 45, icon: 'zap' },
    { day: 6, label: 'Mystery Box', score: 50, icon: 'gift' },
    { day: 7, label: 'Grand Prize', score: 100, icon: 'trophy' },
];

export default function DailyRewards() {
    const { state, dispatch } = useGame();
    const { dailyRewardDay, dailyRewardClaimed, userId } = state;

    const claimReward = async () => {
        if (dailyRewardClaimed) return;

        const currentReward = REWARDS[dailyRewardDay % 7];
        dispatch({ type: 'CLAIM_DAILY_REWARD', payload: { bonus: currentReward.score } });

        // Persist to Supabase
        try {
            await supabase.from('daily_rewards').insert({
                profile_id: userId,
                day: dailyRewardDay + 1,
                streak: dailyRewardDay + 1,
            });
        } catch (e) { /* ignore */ }
    };

    return (
        <div className="screen daily-rewards">
            <div className="screen__content">
                <div className="game__header">
                    <button className="btn btn--icon" onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'lobby' })}>
                        <Icon name="arrow-left" size={20} />
                    </button>
                    <h2 className="game__title">Daily Rewards</h2>
                </div>

                <p className="screen__subtitle" style={{ marginBottom: 24 }}>
                    Day {dailyRewardDay + 1} of 7 — claim your reward!
                </p>

                {/* Reward calendar */}
                <div className="rewards__calendar">
                    {REWARDS.map((reward, i) => {
                        const isClaimed = i < dailyRewardDay;
                        const isCurrent = i === dailyRewardDay;
                        const isLocked = i > dailyRewardDay;

                        return (
                            <div
                                key={i}
                                className={`rewards__day glass-card ${isClaimed ? 'rewards__day--claimed' : ''} ${isCurrent ? 'rewards__day--current' : ''} ${isLocked ? 'rewards__day--locked' : ''}`}
                                onClick={isCurrent && !dailyRewardClaimed ? claimReward : undefined}
                            >
                                <span className="rewards__day-num">Day {reward.day}</span>
                                <div className="rewards__day-icon">
                                    {isClaimed ? (
                                        <Icon name="check-circle" size={28} color="#4ade80" />
                                    ) : isLocked ? (
                                        <Icon name="lock" size={28} color="rgba(255,255,255,0.2)" />
                                    ) : (
                                        <Icon name={reward.icon} size={28} color={isCurrent ? '#e84393' : '#fff'} />
                                    )}
                                </div>
                                <span className="rewards__day-label">{reward.label}</span>
                                <span className="rewards__day-score">+{reward.score}</span>
                            </div>
                        );
                    })}
                </div>

                {/* Claim button */}
                {!dailyRewardClaimed && (
                    <button className="btn btn--primary btn--lg" onClick={claimReward} style={{ width: '100%', marginTop: 24 }}>
                        <Icon name="gift" size={20} />
                        <span>Claim Day {dailyRewardDay + 1} Reward</span>
                    </button>
                )}

                {dailyRewardClaimed && (
                    <div className="game__prompt glass-card" style={{ textAlign: 'center', marginTop: 24 }}>
                        <Icon name="check-circle" size={32} color="#4ade80" />
                        <h3 style={{ marginTop: 8 }}>Claimed!</h3>
                        <p>Come back tomorrow for Day {(dailyRewardDay % 7) + 1}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
