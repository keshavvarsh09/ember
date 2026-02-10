import React, { createContext, useContext, useReducer, useEffect } from 'react';

const GameContext = createContext(null);

const initialState = {
    // Navigation
    screen: 'landing',

    // Pairing
    pairCode: null,
    paired: false,

    // Profiles
    userProfile: {
        name: '',
        avatar: '🌙',
        gender: '',
        pronouns: 'they',
        bio: '',
        loveLang: '',
        turnOn: '',
        secretFantasy: '',
        preferences: [],
        heatLevel: 2,
    },
    partnerProfile: {
        name: '',
        avatar: '⭐',
        gender: '',
        pronouns: 'they',
        bio: '',
        loveLang: '',
        turnOn: '',
        secretFantasy: '',
        preferences: [],
        heatLevel: 2,
    },

    // Story state
    currentStory: null,
    currentNode: null,
    storyHistory: [],
    choicesMade: [],
    writingResponses: {},
    mood: null,
    partnerMood: null,

    // Progress (simple, no XP)
    emberScore: 0,
    streak: 0,
    lastPlayed: null,
    storiesCompleted: [],
    unlockedStories: ['midnight-encounter', 'hotel-room', 'the-dare'],
    achievements: [],
    compatibilityScore: 0,

    // Communication
    chatMessages: [],
    callActive: false,
    callType: null, // 'voice' | 'video'

    // Board games
    activeGame: null, // 'ludo' | 'snakes' | 'monopoly' | 'truth-dare' | 'strip-quiz'
    ludoState: {
        positions: [0, 0], // [player, partner]
        currentTurn: 0,
        diceValue: null,
        currentSquare: null,
        gameOver: false,
    },
    snakesState: {
        positions: [0, 0],
        currentTurn: 0,
        diceValue: null,
        currentSquare: null,
        gameOver: false,
    },
    monopolyState: {
        positions: [0, 0],
        currentTurn: 0,
        diceValue: null,
        money: [500, 500],
        ownedProperties: [[], []],
        currentCard: null,
        inJail: [false, false],
        gameOver: false,
    },

    // Quick games
    truthDareState: {
        round: 0,
        currentTurn: 0,
        clothingRemoved: [0, 0],
    },
    stripQuizState: {
        round: 0,
        currentTurn: 0,
        clothing: [
            ['👒', '👕', '👖', '🧦', '🩲'],
            ['👒', '👕', '👖', '🧦', '🩲'],
        ],
    },

    // Spin wheel
    spinAvailable: true,
    lastSpinResult: null,

    // Daily rewards
    dailyRewardDay: 0,
    dailyRewardClaimed: false,
    lastRewardDate: null,

    // Session
    sessionActive: false,
    partnerOnline: false,
    reactions: [],
};

function gameReducer(state, action) {
    switch (action.type) {
        case 'SET_SCREEN':
            return { ...state, screen: action.payload };

        case 'SET_USER_PROFILE':
            return {
                ...state,
                userProfile: { ...state.userProfile, ...action.payload },
            };

        case 'SET_PARTNER_PROFILE':
            return {
                ...state,
                partnerProfile: { ...state.partnerProfile, ...action.payload },
                paired: true,
            };

        case 'GENERATE_PAIR_CODE':
            return { ...state, pairCode: action.payload };

        case 'JOIN_PAIR':
            return {
                ...state,
                paired: true,
                partnerProfile: {
                    ...state.partnerProfile,
                    name: action.payload.name || 'Your Partner',
                    avatar: action.payload.avatar || '⭐',
                    gender: action.payload.gender || '',
                    pronouns: action.payload.pronouns || 'they',
                    bio: action.payload.bio || '',
                    loveLang: action.payload.loveLang || '',
                    turnOn: action.payload.turnOn || '',
                    secretFantasy: action.payload.secretFantasy || '',
                    preferences: action.payload.preferences || [],
                    heatLevel: action.payload.heatLevel || 2,
                },
                partnerOnline: true,
            };

        case 'ADD_PREFERENCE':
            return {
                ...state,
                userProfile: {
                    ...state.userProfile,
                    preferences: state.userProfile.preferences.includes(action.payload)
                        ? state.userProfile.preferences.filter((p) => p !== action.payload)
                        : [...state.userProfile.preferences, action.payload],
                },
            };

        case 'SET_HEAT_LEVEL':
            return {
                ...state,
                userProfile: { ...state.userProfile, heatLevel: action.payload },
            };

        case 'SET_MOOD':
            return { ...state, mood: action.payload };

        case 'SET_PARTNER_MOOD':
            return { ...state, partnerMood: action.payload };

        // Story actions
        case 'START_STORY':
            return {
                ...state,
                currentStory: action.payload.story,
                currentNode: action.payload.startNode,
                storyHistory: [action.payload.startNode],
                choicesMade: [],
                writingResponses: {},
                sessionActive: true,
                screen: 'story',
            };

        case 'MAKE_CHOICE':
            return {
                ...state,
                currentNode: action.payload.nextNode,
                storyHistory: [...state.storyHistory, action.payload.nextNode],
                choicesMade: [...state.choicesMade, action.payload.choice],
            };

        case 'SAVE_WRITING_RESPONSE':
            return {
                ...state,
                writingResponses: {
                    ...state.writingResponses,
                    [action.payload.nodeId]: action.payload.text,
                },
            };

        case 'ADD_REACTION':
            return {
                ...state,
                reactions: [...state.reactions, action.payload],
            };

        case 'CLEAR_REACTIONS':
            return { ...state, reactions: [] };

        case 'COMPLETE_STORY':
            return {
                ...state,
                sessionActive: false,
                storiesCompleted: [...state.storiesCompleted, state.currentStory?.id],
                emberScore: state.emberScore + (action.payload?.score || 50),
                streak: state.streak + 1,
                lastPlayed: new Date().toISOString(),
                screen: 'lobby',
            };

        case 'END_SESSION':
            return {
                ...state,
                sessionActive: false,
                currentStory: null,
                currentNode: null,
            };

        case 'CALCULATE_COMPATIBILITY': {
            const userPrefs = new Set(state.userProfile.preferences);
            const partnerPrefs = new Set(state.partnerProfile.preferences);
            const shared = [...userPrefs].filter((p) => partnerPrefs.has(p));
            const total = new Set([...userPrefs, ...partnerPrefs]).size;
            const score = total > 0 ? Math.round((shared.length / total) * 100) : 0;
            return { ...state, compatibilityScore: Math.max(score, 42) };
        }

        // Chat actions
        case 'SEND_MESSAGE':
            return {
                ...state,
                chatMessages: [...state.chatMessages, action.payload],
            };

        case 'CLEAR_CHAT':
            return { ...state, chatMessages: [] };

        // Call actions
        case 'START_CALL':
            return { ...state, callActive: true, callType: action.payload };

        case 'END_CALL':
            return { ...state, callActive: false, callType: null };

        // Board game actions
        case 'SET_ACTIVE_GAME':
            return { ...state, activeGame: action.payload };

        case 'UPDATE_LUDO':
            return { ...state, ludoState: { ...state.ludoState, ...action.payload } };

        case 'UPDATE_SNAKES':
            return { ...state, snakesState: { ...state.snakesState, ...action.payload } };

        case 'UPDATE_MONOPOLY':
            return { ...state, monopolyState: { ...state.monopolyState, ...action.payload } };

        case 'UPDATE_TRUTH_DARE':
            return { ...state, truthDareState: { ...state.truthDareState, ...action.payload } };

        case 'UPDATE_STRIP_QUIZ':
            return { ...state, stripQuizState: { ...state.stripQuizState, ...action.payload } };

        case 'RESET_GAME':
            return {
                ...state,
                activeGame: null,
                ludoState: initialState.ludoState,
                snakesState: initialState.snakesState,
                monopolyState: initialState.monopolyState,
                truthDareState: initialState.truthDareState,
                stripQuizState: initialState.stripQuizState,
            };

        // Spin wheel
        case 'USE_SPIN':
            return { ...state, spinAvailable: false, lastSpinResult: action.payload };

        case 'RESET_SPIN':
            return { ...state, spinAvailable: true, lastSpinResult: null };

        // Daily rewards
        case 'CLAIM_DAILY_REWARD':
            return {
                ...state,
                dailyRewardClaimed: true,
                dailyRewardDay: state.dailyRewardDay + 1,
                lastRewardDate: new Date().toISOString(),
                emberScore: state.emberScore + (action.payload?.bonus || 25),
            };

        case 'RESET_DAILY':
            return { ...state, dailyRewardClaimed: false };

        case 'ADD_EMBER_SCORE':
            return { ...state, emberScore: state.emberScore + action.payload };

        case 'LOAD_STATE':
            return { ...state, ...action.payload };

        default:
            return state;
    }
}

export function GameProvider({ children }) {
    const [state, dispatch] = useReducer(gameReducer, initialState, (init) => {
        try {
            const saved = localStorage.getItem('ember-state');
            if (saved) {
                const parsed = JSON.parse(saved);
                return { ...init, ...parsed };
            }
        } catch (e) { /* ignore */ }
        return init;
    });

    useEffect(() => {
        try {
            const { reactions, ...saveable } = state;
            localStorage.setItem('ember-state', JSON.stringify(saveable));
        } catch (e) { /* ignore */ }
    }, [state]);

    return (
        <GameContext.Provider value={{ state, dispatch }}>
            {children}
        </GameContext.Provider>
    );
}

export function useGame() {
    const ctx = useContext(GameContext);
    if (!ctx) throw new Error('useGame must be used within GameProvider');
    return ctx;
}

export default GameContext;
