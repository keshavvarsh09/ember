import React, { useEffect, useRef } from 'react';
import { useGame } from '../engine/gameState';
import useWebRTC from '../hooks/useWebRTC';
import Icon from './ui/Icons';
import Avatar from './ui/Avatar';

export default function CallPanel() {
    const { state, dispatch } = useGame();
    const { partnerProfile, userId, callType } = state;

    const webrtc = useWebRTC(userId);
    const localVideoEl = useRef(null);
    const remoteVideoEl = useRef(null);

    // Start call on mount based on callType
    useEffect(() => {
        if (callType && webrtc.callState === 'idle') {
            webrtc.startCall(callType);
        }
    }, [callType]);

    // Bind video refs
    useEffect(() => {
        if (localVideoEl.current) webrtc.localVideoRef.current = localVideoEl.current;
        if (remoteVideoEl.current) webrtc.remoteVideoRef.current = remoteVideoEl.current;
    }, []);

    const handleEnd = () => {
        webrtc.endCall();
        setTimeout(() => {
            dispatch({ type: 'SET_CALL', payload: { active: false, type: null } });
            dispatch({ type: 'SET_SCREEN', payload: 'lobby' });
        }, 1500);
    };

    const goBack = () => {
        webrtc.endCall();
        dispatch({ type: 'SET_CALL', payload: { active: false, type: null } });
        dispatch({ type: 'SET_SCREEN', payload: 'lobby' });
    };

    const isVideo = callType === 'video';

    return (
        <div className={`call-panel ${isVideo ? 'call-panel--video' : ''}`}>
            {/* Video mode */}
            {isVideo && (
                <>
                    <div className="call-panel__video-bg">
                        <video
                            ref={remoteVideoEl}
                            autoPlay
                            playsInline
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        {webrtc.callState !== 'connected' && (
                            <div className="call-panel__video-placeholder">
                                <Avatar id={partnerProfile.avatarId} size={120} />
                                <span className="call-panel__camera-off">
                                    {webrtc.callState === 'ringing' ? 'Calling...' : 'Connecting...'}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* PiP self-view */}
                    <div className="call-panel__pip">
                        <video
                            ref={localVideoEl}
                            autoPlay
                            playsInline
                            muted
                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }}
                        />
                    </div>
                </>
            )}

            {/* Voice mode */}
            {!isVideo && (
                <div className="call-panel__voice-display">
                    <div className={`call-panel__avatar-ring ${webrtc.callState === 'connected' ? 'call-panel__avatar-ring--active' : ''}`}>
                        <div className="call-panel__avatar-ring-inner">
                            <Avatar id={partnerProfile.avatarId} size={100} />
                        </div>
                    </div>

                    <h2 className="call-panel__partner-name">{partnerProfile.name || 'Partner'}</h2>

                    {webrtc.callState === 'ringing' && (
                        <p className="call-panel__status call-panel__status--ringing">
                            <Icon name="phone" size={16} /> Calling...
                        </p>
                    )}
                    {webrtc.callState === 'connecting' && (
                        <p className="call-panel__status call-panel__status--ringing">
                            Connecting...
                        </p>
                    )}
                    {webrtc.callState === 'connected' && (
                        <p className="call-panel__status call-panel__status--connected">
                            {webrtc.formattedDuration}
                        </p>
                    )}
                    {webrtc.callState === 'ended' && (
                        <p className="call-panel__status call-panel__status--ended">Call ended</p>
                    )}

                    {/* Audio element for voice call remote stream */}
                    <audio ref={remoteVideoEl} autoPlay />
                </div>
            )}

            {/* Error */}
            {webrtc.error && (
                <div className="call-panel__coming-soon">
                    <Icon name="shield" size={16} />
                    <span>{webrtc.error}</span>
                </div>
            )}

            {/* Controls */}
            <div className="call-panel__controls">
                <button
                    className={`call-panel__control-btn ${webrtc.isMuted ? 'call-panel__control-btn--active' : ''}`}
                    onClick={webrtc.toggleMute}
                >
                    <Icon name={webrtc.isMuted ? 'mic-off' : 'mic'} size={22} />
                    <span className="call-panel__control-label">
                        {webrtc.isMuted ? 'Unmute' : 'Mute'}
                    </span>
                </button>

                {isVideo && (
                    <button
                        className={`call-panel__control-btn ${webrtc.isCameraOff ? 'call-panel__control-btn--active' : ''}`}
                        onClick={webrtc.toggleCamera}
                    >
                        <Icon name={webrtc.isCameraOff ? 'video-off' : 'video'} size={22} />
                        <span className="call-panel__control-label">
                            {webrtc.isCameraOff ? 'Camera On' : 'Camera Off'}
                        </span>
                    </button>
                )}

                <button
                    className={`call-panel__control-btn ${!webrtc.isMuted ? 'call-panel__control-btn--active' : ''}`}
                    onClick={() => { }}
                >
                    <Icon name="speaker" size={22} />
                    <span className="call-panel__control-label">Speaker</span>
                </button>

                <button className="call-panel__control-btn call-panel__control-btn--end" onClick={handleEnd}>
                    <Icon name="phone-off" size={22} />
                    <span className="call-panel__control-label">End</span>
                </button>
            </div>

            {/* Back button */}
            {(webrtc.callState === 'idle' || webrtc.callState === 'ended') && (
                <button className="btn btn--secondary" onClick={goBack} style={{ marginTop: 24 }}>
                    <Icon name="arrow-left" size={16} />
                    <span>Back to Lobby</span>
                </button>
            )}
        </div>
    );
}
