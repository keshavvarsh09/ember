import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import * as rt from '../lib/realtimeManager';

/* ============================================================
   useRoom — React hook for real-time room management
   ============================================================ */

export default function useRoom(userId, userProfile) {
    const [roomId, setRoomId] = useState(null);
    const [roomCode, setRoomCode] = useState(null);
    const [partner, setPartner] = useState(null);
    const [partnerOnline, setPartnerOnline] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState('disconnected'); // disconnected | connecting | connected
    const [error, setError] = useState(null);
    const callbacksRef = useRef({});

    // Register event callbacks
    const on = useCallback((event, callback) => {
        callbacksRef.current[event] = callback;
    }, []);

    // Generate unique 6-char room code
    const generateCode = () => {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let code = '';
        for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
        return code;
    };

    // Create a new room
    const createRoom = useCallback(async () => {
        if (!userId) return;
        setConnectionStatus('connecting');
        setError(null);

        try {
            const code = generateCode();
            const { data, error: err } = await supabase
                .from('rooms')
                .insert({ code, creator_id: userId, status: 'waiting' })
                .select()
                .single();

            if (err) throw err;

            setRoomId(data.id);
            setRoomCode(code);

            // Subscribe to channel
            rt.joinChannel(code, userId, userProfile, {
                onConnected: () => setConnectionStatus('connected'),
                onPresenceSync: (state) => {
                    const users = Object.keys(state);
                    const partnerKey = users.find(k => k !== userId);
                    setPartnerOnline(!!partnerKey);
                    if (partnerKey && state[partnerKey]?.[0]) {
                        const p = state[partnerKey][0];
                        setPartner(p);
                        callbacksRef.current.onPartnerJoin?.(p);
                    }
                },
                onPartnerJoin: (key, presences) => {
                    if (key !== userId && presences?.[0]) {
                        setPartner(presences[0]);
                        setPartnerOnline(true);
                        callbacksRef.current.onPartnerJoin?.(presences[0]);
                    }
                },
                onPartnerLeave: (key) => {
                    if (key !== userId) {
                        setPartnerOnline(false);
                        callbacksRef.current.onPartnerLeave?.();
                    }
                },
                onGameEvent: (payload) => callbacksRef.current.onGameEvent?.(payload),
                onChatMessage: (payload) => callbacksRef.current.onChatMessage?.(payload),
                onTyping: (payload) => callbacksRef.current.onTyping?.(payload),
                onWebRTCSignal: (payload) => callbacksRef.current.onWebRTCSignal?.(payload),
                onCallEvent: (payload) => callbacksRef.current.onCallEvent?.(payload),
                onReaction: (payload) => callbacksRef.current.onReaction?.(payload),
            });

            // Listen for partner joining via DB change
            const sub = supabase
                .channel(`room-update:${data.id}`)
                .on('postgres_changes', {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'rooms',
                    filter: `id=eq.${data.id}`,
                }, (payload) => {
                    if (payload.new.partner_id && payload.new.status === 'paired') {
                        callbacksRef.current.onRoomPaired?.(payload.new);
                    }
                })
                .subscribe();

            return { code, roomId: data.id };
        } catch (err) {
            setError(err.message);
            setConnectionStatus('disconnected');
            return null;
        }
    }, [userId, userProfile]);

    // Join an existing room
    const joinRoom = useCallback(async (code) => {
        if (!userId) return;
        setConnectionStatus('connecting');
        setError(null);

        try {
            // Find the room
            const { data: room, error: findErr } = await supabase
                .from('rooms')
                .select('*')
                .eq('code', code.toUpperCase())
                .eq('status', 'waiting')
                .single();

            if (findErr || !room) {
                setError('Room not found or already paired');
                setConnectionStatus('disconnected');
                return null;
            }

            // Update room with partner
            const { error: updateErr } = await supabase
                .from('rooms')
                .update({ partner_id: userId, status: 'paired' })
                .eq('id', room.id);

            if (updateErr) throw updateErr;

            setRoomId(room.id);
            setRoomCode(code.toUpperCase());

            // Subscribe to channel
            rt.joinChannel(code.toUpperCase(), userId, userProfile, {
                onConnected: () => setConnectionStatus('connected'),
                onPresenceSync: (state) => {
                    const users = Object.keys(state);
                    const partnerKey = users.find(k => k !== userId);
                    setPartnerOnline(!!partnerKey);
                    if (partnerKey && state[partnerKey]?.[0]) {
                        setPartner(state[partnerKey][0]);
                        callbacksRef.current.onPartnerJoin?.(state[partnerKey][0]);
                    }
                },
                onPartnerJoin: (key, presences) => {
                    if (key !== userId && presences?.[0]) {
                        setPartner(presences[0]);
                        setPartnerOnline(true);
                        callbacksRef.current.onPartnerJoin?.(presences[0]);
                    }
                },
                onPartnerLeave: (key) => {
                    if (key !== userId) {
                        setPartnerOnline(false);
                        callbacksRef.current.onPartnerLeave?.();
                    }
                },
                onGameEvent: (payload) => callbacksRef.current.onGameEvent?.(payload),
                onChatMessage: (payload) => callbacksRef.current.onChatMessage?.(payload),
                onTyping: (payload) => callbacksRef.current.onTyping?.(payload),
                onWebRTCSignal: (payload) => callbacksRef.current.onWebRTCSignal?.(payload),
                onCallEvent: (payload) => callbacksRef.current.onCallEvent?.(payload),
                onReaction: (payload) => callbacksRef.current.onReaction?.(payload),
            });

            return { code: code.toUpperCase(), roomId: room.id, creatorId: room.creator_id };
        } catch (err) {
            setError(err.message);
            setConnectionStatus('disconnected');
            return null;
        }
    }, [userId, userProfile]);

    // Disconnect
    const disconnect = useCallback(() => {
        rt.leaveChannel();
        setConnectionStatus('disconnected');
        setPartnerOnline(false);
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => rt.leaveChannel();
    }, []);

    return {
        roomId,
        roomCode,
        partner,
        partnerOnline,
        connectionStatus,
        error,
        createRoom,
        joinRoom,
        disconnect,
        on,
        sendGameEvent: rt.sendGameEvent,
        sendChat: rt.sendChatBroadcast,
        sendTyping: () => rt.sendTyping(userId),
        sendReaction: rt.sendReaction,
    };
}
