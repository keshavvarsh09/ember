import React, { useState, useEffect } from 'react';
import { useGame } from '../engine/gameState';

export default function CallPanel() {
    const { state, dispatch } = useGame();
    const [callState, setCallState] = useState('ringing'); // ringing | connected | ended
    const [callMode, setCallMode] = useState(state.callType || 'voice'); // voice | video
    const [muted, setMuted] = useState(false);
    const [speakerOn, setSpeakerOn] = useState(false);
    const [cameraOff, setCameraOff] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);

    // Simulate connection after 3 seconds
    useEffect(() => {
        if (callState === 'ringing') {
            const timer = setTimeout(() => setCallState('connected'), 3000);
            return () => clearTimeout(timer);
        }
    }, [callState]);

    // Call timer
    useEffect(() => {
        if (callState !== 'connected') return;
        const interval = setInterval(() => setElapsedTime((t) => t + 1), 1000);
        return () => clearInterval(interval);
    }, [callState]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const handleEndCall = () => {
        setCallState('ended');
        setTimeout(() => {
            dispatch({ type: 'END_CALL' });
            dispatch({ type: 'SET_SCREEN', payload: 'lobby' });
        }, 1000);
    };

    const toggleMode = () => {
        setCallMode(callMode === 'voice' ? 'video' : 'voice');
    };

    return (
        <div className={`call-panel ${callMode === 'video' ? 'call-panel--video' : ''}`}>
            {/* Video background (simulated) */}
            {callMode === 'video' && (
                <div className="call-panel__video-bg">
                    <div className="call-panel__video-placeholder">
                        <span className="call-panel__video-avatar">{state.partnerProfile.avatar}</span>
                        {cameraOff && <div className="call-panel__camera-off">Camera Off</div>}
                    </div>
                    {/* Self-view PiP */}
                    <div className="call-panel__pip">
                        <span className="call-panel__pip-avatar">{state.userProfile.avatar}</span>
                    </div>
                </div>
            )}

            {/* Voice mode - avatar display */}
            {callMode === 'voice' && (
                <div className="call-panel__voice-display">
                    <div className={`call-panel__avatar-ring ${callState === 'connected' ? 'call-panel__avatar-ring--active' : ''}`}>
                        <div className="call-panel__avatar-ring-inner">
                            <span className="call-panel__partner-avatar">{state.partnerProfile.avatar}</span>
                        </div>
                    </div>
                    <h2 className="call-panel__partner-name font-story">{state.partnerProfile.name || 'Partner'}</h2>

                    {callState === 'ringing' && (
                        <p className="call-panel__status call-panel__status--ringing">
                            <span className="call-panel__ring-anim">📞</span> Calling...
                        </p>
                    )}
                    {callState === 'connected' && (
                        <p className="call-panel__status call-panel__status--connected">
                            {formatTime(elapsedTime)}
                        </p>
                    )}
                    {callState === 'ended' && (
                        <p className="call-panel__status call-panel__status--ended">Call ended</p>
                    )}
                </div>
            )}

            {/* Coming Soon Banner */}
            <div className="call-panel__coming-soon glass-card">
                <span>🚧</span>
                <span>Real-time calls coming soon! This is a preview of the UI.</span>
            </div>

            {/* Controls */}
            {callState !== 'ended' && (
                <div className="call-panel__controls">
                    <button
                        className={`call-panel__control-btn ${muted ? 'call-panel__control-btn--active' : ''}`}
                        onClick={() => setMuted(!muted)}
                    >
                        <span>{muted ? '🔇' : '🎤'}</span>
                        <span className="call-panel__control-label">{muted ? 'Unmute' : 'Mute'}</span>
                    </button>

                    {callMode === 'voice' && (
                        <button
                            className={`call-panel__control-btn ${speakerOn ? 'call-panel__control-btn--active' : ''}`}
                            onClick={() => setSpeakerOn(!speakerOn)}
                        >
                            <span>{speakerOn ? '🔊' : '🔈'}</span>
                            <span className="call-panel__control-label">Speaker</span>
                        </button>
                    )}

                    {callMode === 'video' && (
                        <button
                            className={`call-panel__control-btn ${cameraOff ? 'call-panel__control-btn--active' : ''}`}
                            onClick={() => setCameraOff(!cameraOff)}
                        >
                            <span>{cameraOff ? '📷' : '📸'}</span>
                            <span className="call-panel__control-label">Camera</span>
                        </button>
                    )}

                    <button className="call-panel__control-btn" onClick={toggleMode}>
                        <span>{callMode === 'voice' ? '📹' : '📞'}</span>
                        <span className="call-panel__control-label">{callMode === 'voice' ? 'Video' : 'Voice'}</span>
                    </button>

                    <button className="call-panel__control-btn call-panel__control-btn--end" onClick={handleEndCall}>
                        <span>📵</span>
                        <span className="call-panel__control-label">End</span>
                    </button>
                </div>
            )}

            {/* Back button if ended */}
            {callState === 'ended' && (
                <button className="btn btn--primary" onClick={() => { dispatch({ type: 'END_CALL' }); dispatch({ type: 'SET_SCREEN', payload: 'lobby' }); }}
                    style={{ marginTop: '2rem' }}>
                    Back to Lobby
                </button>
            )}
        </div>
    );
}
