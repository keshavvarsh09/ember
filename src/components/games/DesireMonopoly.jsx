import React, { useState } from 'react';
import { useGame } from '../../engine/gameState';
import { monopolyBoard, monopolyProperties, chanceCards, communityCards, rollDice, getRandomChanceCard, getRandomCommunityCard } from '../../data/games-data';

export default function DesireMonopoly() {
    const { state, dispatch } = useGame();
    const [playerPos, setPlayerPos] = useState(0);
    const [partnerPos, setPartnerPos] = useState(0);
    const [money, setMoney] = useState([500, 500]);
    const [owned, setOwned] = useState([[], []]); // [player owned, partner owned]
    const [currentTurn, setCurrentTurn] = useState(0);
    const [diceValue, setDiceValue] = useState(null);
    const [rolling, setRolling] = useState(false);
    const [currentCard, setCurrentCard] = useState(null);
    const [showAction, setShowAction] = useState(false);
    const [actionType, setActionType] = useState(null); // 'buy' | 'rent' | 'chance' | 'community' | 'jail' | 'go'
    const [inJail, setInJail] = useState([false, false]);
    const [jailChoice, setJailChoice] = useState(null);

    const currentPlayer = currentTurn === 0 ? state.userProfile : state.partnerProfile;
    const positions = [playerPos, partnerPos];

    const getPropertyById = (id) => monopolyProperties.find(p => p.id === id);

    const handleRoll = () => {
        if (rolling || showAction) return;

        // Check if in jail
        if (inJail[currentTurn]) {
            setActionType('jail');
            setShowAction(true);
            return;
        }

        setRolling(true);
        setDiceValue(null);

        let rolls = 0;
        const anim = setInterval(() => {
            setDiceValue(Math.floor(Math.random() * 6) + 1);
            rolls++;
            if (rolls > 8) {
                clearInterval(anim);
                const finalRoll = rollDice();
                setDiceValue(finalRoll);
                setRolling(false);

                const currentPos = currentTurn === 0 ? playerPos : partnerPos;
                const newPos = (currentPos + finalRoll) % monopolyBoard.length;

                // Check if passed GO
                if (newPos < currentPos) {
                    const newMoney = [...money];
                    newMoney[currentTurn] += 50;
                    setMoney(newMoney);
                }

                if (currentTurn === 0) setPlayerPos(newPos);
                else setPartnerPos(newPos);

                // Process square
                const square = monopolyBoard[newPos];
                processSquare(square, newPos);
            }
        }, 100);
    };

    const processSquare = (square, pos) => {
        switch (square.type) {
            case 'property': {
                const prop = getPropertyById(square.propertyId);
                const ownerIdx = owned[0].includes(square.propertyId) ? 0 : owned[1].includes(square.propertyId) ? 1 : -1;

                if (ownerIdx === -1) {
                    // Unowned - can buy
                    setCurrentCard({ ...prop, pos });
                    setActionType('buy');
                } else if (ownerIdx !== currentTurn) {
                    // Owned by opponent - pay rent
                    setCurrentCard({ ...prop, owner: ownerIdx });
                    setActionType('rent');
                } else {
                    // Own property
                    setCurrentCard({ ...prop, message: 'You own this. Relax.' });
                    setActionType('own');
                }
                setShowAction(true);
                break;
            }
            case 'chance':
                setCurrentCard(getRandomChanceCard());
                setActionType('chance');
                setShowAction(true);
                break;
            case 'community':
                setCurrentCard(getRandomCommunityCard());
                setActionType('community');
                setShowAction(true);
                break;
            case 'jail':
                // Just visiting
                setCurrentCard({ text: 'Just visiting jail... for now 👀' });
                setActionType('visit');
                setShowAction(true);
                break;
            case 'go-to-jail': {
                const newJail = [...inJail];
                newJail[currentTurn] = true;
                setInJail(newJail);
                setCurrentCard({ text: 'Go to Jail! 🔒 Strip to escape or skip next turn.' });
                setActionType('go-to-jail');
                setShowAction(true);
                break;
            }
            case 'free-parking':
                setCurrentCard({ text: '🌙 Free Fantasy! Both partners share a fantasy aloud. No holding back.' });
                setActionType('fantasy');
                setShowAction(true);
                break;
            case 'go':
                setCurrentCard({ text: '🚀 Passed GO! Collect 50 coins.' });
                setActionType('go');
                setShowAction(true);
                break;
            default:
                endTurn();
        }
    };

    const handleBuy = () => {
        if (money[currentTurn] >= currentCard.price) {
            const newMoney = [...money];
            newMoney[currentTurn] -= currentCard.price;
            setMoney(newMoney);

            const newOwned = [...owned];
            newOwned[currentTurn] = [...newOwned[currentTurn], currentCard.id];
            setOwned(newOwned);
        }
        endTurn();
    };

    const handlePayRent = () => {
        const newMoney = [...money];
        newMoney[currentTurn] -= currentCard.rent;
        newMoney[currentCard.owner] += currentCard.rent;
        setMoney(newMoney);
        endTurn();
    };

    const handleJailEscape = (method) => {
        const newJail = [...inJail];
        newJail[currentTurn] = false;
        setInJail(newJail);
        if (method === 'strip') {
            // Strip to escape
        }
        endTurn();
    };

    const endTurn = () => {
        setShowAction(false);
        setCurrentCard(null);
        setActionType(null);
        setCurrentTurn(currentTurn === 0 ? 1 : 0);
    };

    const diceEmojis = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

    return (
        <div className="monopoly page-enter">
            <div className="container">
                <div className="monopoly__header">
                    <button className="btn btn--ghost" onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'minigames' })}>
                        ← Back
                    </button>
                    <h2 className="monopoly__title font-story">🏘️ Desire Monopoly</h2>
                </div>

                {/* Player stats */}
                <div className="monopoly__players animate-fade-in-up">
                    <div className={`monopoly__player ${currentTurn === 0 ? 'monopoly__player--active' : ''}`}>
                        <span className="monopoly__player-avatar">{state.userProfile.avatar}</span>
                        <span className="monopoly__player-name">{state.userProfile.name}</span>
                        <span className="monopoly__player-money">💰 {money[0]}</span>
                        <span className="monopoly__player-props">{owned[0].length} owned</span>
                    </div>
                    <div className="monopoly__vs">VS</div>
                    <div className={`monopoly__player ${currentTurn === 1 ? 'monopoly__player--active' : ''}`}>
                        <span className="monopoly__player-avatar">{state.partnerProfile.avatar}</span>
                        <span className="monopoly__player-name">{state.partnerProfile.name || 'Partner'}</span>
                        <span className="monopoly__player-money">💰 {money[1]}</span>
                        <span className="monopoly__player-props">{owned[1].length} owned</span>
                    </div>
                </div>

                {/* Board */}
                <div className="monopoly__board animate-fade-in-up delay-1">
                    {monopolyBoard.map((sq, i) => {
                        const prop = sq.type === 'property' ? getPropertyById(sq.propertyId) : null;
                        const isOwned0 = prop && owned[0].includes(prop.id);
                        const isOwned1 = prop && owned[1].includes(prop.id);
                        return (
                            <div
                                key={i}
                                className={`monopoly__cell ${i === playerPos ? 'monopoly__cell--user' : ''} ${i === partnerPos ? 'monopoly__cell--partner' : ''}`}
                            >
                                <span className="monopoly__cell-emoji">{prop ? prop.emoji : sq.emoji}</span>
                                <span className="monopoly__cell-name">{prop ? prop.name : sq.name}</span>
                                {prop && <span className="monopoly__cell-price">💰{prop.price}</span>}
                                {isOwned0 && <span className="monopoly__owned-marker monopoly__owned-marker--user" />}
                                {isOwned1 && <span className="monopoly__owned-marker monopoly__owned-marker--partner" />}
                                {i === playerPos && <span className="monopoly__token">{state.userProfile.avatar}</span>}
                                {i === partnerPos && <span className="monopoly__token">{state.partnerProfile.avatar}</span>}
                            </div>
                        );
                    })}
                </div>

                {/* Dice */}
                {!showAction && (
                    <div className="monopoly__dice-area animate-fade-in-up delay-2">
                        <div className="monopoly__turn-label">
                            {currentPlayer.avatar} {currentPlayer.name}'s turn
                            {inJail[currentTurn] && ' 🔒 (In Jail)'}
                        </div>
                        <button
                            className={`monopoly__dice-btn ${rolling ? 'monopoly__dice-btn--rolling' : ''}`}
                            onClick={handleRoll}
                            disabled={rolling}
                        >
                            {diceValue ? diceEmojis[diceValue - 1] : '🎲'}
                        </button>
                    </div>
                )}

                {/* Action modal */}
                {showAction && currentCard && (
                    <div className="monopoly__action glass-card animate-scale-in">
                        {actionType === 'buy' && (
                            <>
                                <div className="monopoly__action-emoji">{currentCard.emoji}</div>
                                <h3 className="font-story">{currentCard.name}</h3>
                                <p className="monopoly__action-desc">{currentCard.desc}</p>
                                <p className="monopoly__action-price">Price: 💰{currentCard.price} | Rent: 💰{currentCard.rent}</p>
                                <div className="monopoly__action-btns">
                                    <button className="btn btn--primary" onClick={handleBuy} disabled={money[currentTurn] < currentCard.price}>
                                        Buy {currentCard.name} 💰
                                    </button>
                                    <button className="btn btn--ghost" onClick={endTurn}>Pass</button>
                                </div>
                            </>
                        )}
                        {actionType === 'rent' && (
                            <>
                                <div className="monopoly__action-emoji">{currentCard.emoji}</div>
                                <h3 className="font-story">{currentCard.name}</h3>
                                <p className="monopoly__rent-msg">
                                    This belongs to {currentCard.owner === 0 ? state.userProfile.name : state.partnerProfile.name}!
                                    <br />Describe what they'd do to this body part as "rent" payment.
                                </p>
                                <p className="monopoly__action-price">Rent: 💰{currentCard.rent}</p>
                                <button className="btn btn--primary btn--full" onClick={handlePayRent}>
                                    Pay Rent (in words and coins) 🔥
                                </button>
                            </>
                        )}
                        {actionType === 'own' && (
                            <>
                                <div className="monopoly__action-emoji">{currentCard.emoji}</div>
                                <h3 className="font-story">{currentCard.name}</h3>
                                <p>{currentCard.message}</p>
                                <button className="btn btn--primary btn--full" onClick={endTurn}>Continue</button>
                            </>
                        )}
                        {(actionType === 'chance' || actionType === 'community') && (
                            <>
                                <div className="monopoly__action-emoji">{actionType === 'chance' ? '❓' : '💝'}</div>
                                <h3 className="font-story">{actionType === 'chance' ? 'Chance!' : 'Intimacy Card'}</h3>
                                <p className="monopoly__card-text font-story">{currentCard.text}</p>
                                <div className="monopoly__card-heat">{'🔥'.repeat(currentCard.heat)}</div>
                                <button className="btn btn--primary btn--full" onClick={endTurn}>Done ✓</button>
                            </>
                        )}
                        {actionType === 'jail' && (
                            <>
                                <div className="monopoly__action-emoji">🔒</div>
                                <h3 className="font-story">You're in Jail!</h3>
                                <p>Choose your escape method:</p>
                                <div className="monopoly__action-btns">
                                    <button className="btn btn--primary" onClick={() => handleJailEscape('strip')}>
                                        Strip to Escape 🔥
                                    </button>
                                    <button className="btn btn--ghost" onClick={() => handleJailEscape('skip')}>
                                        Skip Turn
                                    </button>
                                </div>
                            </>
                        )}
                        {(actionType === 'go-to-jail' || actionType === 'visit' || actionType === 'fantasy' || actionType === 'go') && (
                            <>
                                <p className="monopoly__card-text font-story">{currentCard.text}</p>
                                <button className="btn btn--primary btn--full" onClick={endTurn}>Continue</button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
