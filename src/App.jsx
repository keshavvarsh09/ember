import React from 'react';
import { GameProvider, useGame } from './engine/gameState';
import Landing from './components/Landing';
import Onboarding from './components/Onboarding';
import ProfileSetup from './components/ProfileSetup';
import CompatibilityReveal from './components/CompatibilityReveal';
import GameLobby from './components/GameLobby';
import MoodSelector from './components/MoodSelector';
import StoryEngine from './components/StoryEngine';
import StoryLibrary from './components/StoryLibrary';
import DareChallenge from './components/DareChallenge';
import ProgressDashboard from './components/ProgressDashboard';

function AppRouter() {
    const { state } = useGame();

    const screens = {
        landing: Landing,
        onboarding: Onboarding,
        profile: ProfileSetup,
        compatibility: CompatibilityReveal,
        lobby: GameLobby,
        mood: MoodSelector,
        story: StoryEngine,
        library: StoryLibrary,
        dare: DareChallenge,
        progress: ProgressDashboard,
    };

    const Screen = screens[state.screen] || Landing;

    return (
        <div className="app-wrapper">
            <div className="ambient-bg">
                <div className="ambient-orb ambient-orb--1" />
                <div className="ambient-orb ambient-orb--2" />
                <div className="ambient-orb ambient-orb--3" />
            </div>
            <Screen />
        </div>
    );
}

export default function App() {
    return (
        <GameProvider>
            <AppRouter />
        </GameProvider>
    );
}
