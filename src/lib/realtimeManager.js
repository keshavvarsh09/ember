import { supabase } from './supabaseClient';

/* ============================================================
   GARF Realtime Manager
   Handles Supabase channels, Broadcast, and Presence
   ============================================================ */

let channel = null;
let roomCode = null;

/** Subscribe to a room channel */
export function joinChannel(code, userId, profile, callbacks = {}) {
    if (channel) leaveChannel();
    roomCode = code;

    channel = supabase.channel(`room:${code}`, {
        config: { presence: { key: userId } },
    });

    // Presence — track who's online
    channel.on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        callbacks.onPresenceSync?.(state);
    });

    channel.on('presence', { event: 'join' }, ({ key, newPresences }) => {
        callbacks.onPartnerJoin?.(key, newPresences);
    });

    channel.on('presence', { event: 'leave' }, ({ key }) => {
        callbacks.onPartnerLeave?.(key);
    });

    // Broadcast — game events
    channel.on('broadcast', { event: 'game_event' }, ({ payload }) => {
        callbacks.onGameEvent?.(payload);
    });

    // Broadcast — chat messages
    channel.on('broadcast', { event: 'chat_message' }, ({ payload }) => {
        callbacks.onChatMessage?.(payload);
    });

    // Broadcast — typing indicator
    channel.on('broadcast', { event: 'typing' }, ({ payload }) => {
        callbacks.onTyping?.(payload);
    });

    // Broadcast — WebRTC signaling
    channel.on('broadcast', { event: 'webrtc_signal' }, ({ payload }) => {
        callbacks.onWebRTCSignal?.(payload);
    });

    // Broadcast — call events
    channel.on('broadcast', { event: 'call_event' }, ({ payload }) => {
        callbacks.onCallEvent?.(payload);
    });

    // Broadcast — reactions
    channel.on('broadcast', { event: 'reaction' }, ({ payload }) => {
        callbacks.onReaction?.(payload);
    });

    channel.subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
            await channel.track({
                user_id: userId,
                name: profile.name || 'Anonymous',
                avatar_id: profile.avatar_id || 'av-01',
                online_at: new Date().toISOString(),
            });
            callbacks.onConnected?.();
        }
    });

    return channel;
}

/** Leave the current channel */
export function leaveChannel() {
    if (channel) {
        channel.unsubscribe();
        channel = null;
        roomCode = null;
    }
}

/** Send a game event to the room */
export function sendGameEvent(type, payload) {
    if (!channel) return;
    channel.send({
        type: 'broadcast',
        event: 'game_event',
        payload: { type, ...payload, timestamp: Date.now() },
    });
}

/** Send a chat message via broadcast */
export function sendChatBroadcast(message) {
    if (!channel) return;
    channel.send({
        type: 'broadcast',
        event: 'chat_message',
        payload: message,
    });
}

/** Send typing indicator */
export function sendTyping(userId) {
    if (!channel) return;
    channel.send({
        type: 'broadcast',
        event: 'typing',
        payload: { userId, timestamp: Date.now() },
    });
}

/** Send WebRTC signaling data */
export function sendWebRTCSignal(signalData) {
    if (!channel) return;
    channel.send({
        type: 'broadcast',
        event: 'webrtc_signal',
        payload: signalData,
    });
}

/** Send call event (ring, accept, reject, end) */
export function sendCallEvent(event) {
    if (!channel) return;
    channel.send({
        type: 'broadcast',
        event: 'call_event',
        payload: event,
    });
}

/** Send reaction */
export function sendReaction(reaction) {
    if (!channel) return;
    channel.send({
        type: 'broadcast',
        event: 'reaction',
        payload: reaction,
    });
}

/** Get current channel */
export function getChannel() {
    return channel;
}

/** Get current room code */
export function getRoomCode() {
    return roomCode;
}
