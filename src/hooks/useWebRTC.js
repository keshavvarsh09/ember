import { useState, useEffect, useCallback, useRef } from 'react';
import * as rtc from '../lib/webrtcManager';
import { sendWebRTCSignal, sendCallEvent } from '../lib/realtimeManager';

/* ============================================================
   useWebRTC — React hook for voice/video calls
   Uses Supabase Broadcast for signaling
   ============================================================ */

export default function useWebRTC(userId) {
    const [callState, setCallState] = useState('idle'); // idle | ringing | connecting | connected | ended
    const [callType, setCallType] = useState(null); // 'voice' | 'video'
    const [isMuted, setIsMuted] = useState(false);
    const [isCameraOff, setIsCameraOff] = useState(false);
    const [callDuration, setCallDuration] = useState(0);
    const [error, setError] = useState(null);

    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const timerRef = useRef(null);
    const isInitiator = useRef(false);

    // Attach stream to video element
    const attachStream = useCallback((stream, ref) => {
        if (ref.current && stream) {
            ref.current.srcObject = stream;
        }
    }, []);

    // Start a call (initiator)
    const startCall = useCallback(async (type = 'voice') => {
        try {
            setCallState('ringing');
            setCallType(type);
            setError(null);
            isInitiator.current = true;

            // Notify partner
            sendCallEvent({ type: 'ring', callType: type, from: userId });

            // Create peer
            rtc.createPeer(
                (candidate) => sendWebRTCSignal({ type: 'ice', candidate, from: userId }),
                (stream) => {
                    attachStream(stream, remoteVideoRef);
                    setCallState('connected');
                    startTimer();
                },
                (state) => {
                    if (state === 'disconnected' || state === 'failed') endCall();
                }
            );

            // Get local media
            const stream = await rtc.getLocalStream(type);
            attachStream(stream, localVideoRef);

        } catch (err) {
            setError('Could not access microphone/camera');
            setCallState('idle');
        }
    }, [userId]);

    // Accept an incoming call
    const acceptCall = useCallback(async (type = 'voice') => {
        try {
            setCallState('connecting');
            setCallType(type);
            isInitiator.current = false;

            // Notify caller
            sendCallEvent({ type: 'accept', from: userId });

            // Create peer
            rtc.createPeer(
                (candidate) => sendWebRTCSignal({ type: 'ice', candidate, from: userId }),
                (stream) => {
                    attachStream(stream, remoteVideoRef);
                    setCallState('connected');
                    startTimer();
                },
                (state) => {
                    if (state === 'disconnected' || state === 'failed') endCall();
                }
            );

            // Get local media
            const stream = await rtc.getLocalStream(type);
            attachStream(stream, localVideoRef);

        } catch (err) {
            setError('Could not access microphone/camera');
            setCallState('idle');
        }
    }, [userId]);

    // Handle WebRTC signaling messages from partner
    const handleSignal = useCallback(async (signal) => {
        if (signal.from === userId) return; // Ignore own signals

        try {
            if (signal.type === 'offer') {
                const answer = await rtc.handleOffer(signal.sdp);
                sendWebRTCSignal({ type: 'answer', sdp: answer, from: userId });
            } else if (signal.type === 'answer') {
                await rtc.handleAnswer(signal.sdp);
            } else if (signal.type === 'ice') {
                await rtc.addIceCandidate(signal.candidate);
            }
        } catch (err) {
            console.error('GARF WebRTC signal error:', err);
        }
    }, [userId]);

    // Handle call events from partner
    const handleCallEvent = useCallback(async (event) => {
        if (event.from === userId) return;

        switch (event.type) {
            case 'ring':
                setCallState('ringing');
                setCallType(event.callType);
                break;
            case 'accept':
                // Partner accepted, create and send offer
                setCallState('connecting');
                try {
                    const offer = await rtc.createOffer();
                    sendWebRTCSignal({ type: 'offer', sdp: offer, from: userId });
                } catch (err) {
                    console.error('GARF: Failed to create offer:', err);
                }
                break;
            case 'reject':
            case 'end':
                endCall();
                break;
        }
    }, [userId]);

    // End call
    const endCall = useCallback(() => {
        setCallState('ended');
        sendCallEvent({ type: 'end', from: userId });
        rtc.closePeer();
        stopTimer();

        setTimeout(() => {
            setCallState('idle');
            setCallType(null);
            setCallDuration(0);
            setIsMuted(false);
            setIsCameraOff(false);
        }, 2000);
    }, [userId]);

    // Reject incoming call
    const rejectCall = useCallback(() => {
        sendCallEvent({ type: 'reject', from: userId });
        setCallState('idle');
        setCallType(null);
    }, [userId]);

    // Toggle mute
    const toggleMute = useCallback(() => {
        const muted = rtc.toggleMute();
        setIsMuted(muted);
    }, []);

    // Toggle camera
    const toggleCamera = useCallback(() => {
        const off = rtc.toggleCamera();
        setIsCameraOff(off);
    }, []);

    // Timer
    const startTimer = () => {
        timerRef.current = setInterval(() => {
            setCallDuration(d => d + 1);
        }, 1000);
    };

    const stopTimer = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    };

    // Format duration
    const formatDuration = (secs) => {
        const m = Math.floor(secs / 60).toString().padStart(2, '0');
        const s = (secs % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    // Cleanup
    useEffect(() => {
        return () => {
            rtc.closePeer();
            stopTimer();
        };
    }, []);

    return {
        callState,
        callType,
        isMuted,
        isCameraOff,
        callDuration,
        formattedDuration: formatDuration(callDuration),
        error,
        localVideoRef,
        remoteVideoRef,
        startCall,
        acceptCall,
        rejectCall,
        endCall,
        toggleMute,
        toggleCamera,
        handleSignal,
        handleCallEvent,
    };
}
