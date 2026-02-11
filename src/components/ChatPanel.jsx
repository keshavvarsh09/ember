import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../engine/gameState';
import { supabase } from '../lib/supabaseClient';
import { sendChatBroadcast, sendTyping } from '../lib/realtimeManager';
import Icon from './ui/Icons';
import Avatar from './ui/Avatar';

export default function ChatPanel() {
    const { state, dispatch } = useGame();
    const [input, setInput] = useState('');
    const [showEmoji, setShowEmoji] = useState(false);
    const [partnerTyping, setPartnerTyping] = useState(false);
    const messagesEnd = useRef(null);
    const typingTimeout = useRef(null);

    const { userProfile, partnerProfile, chatMessages, userId, roomId } = state;

    // Load message history from Supabase on mount
    useEffect(() => {
        if (!roomId) return;
        const loadMessages = async () => {
            const { data } = await supabase
                .from('messages')
                .select('*')
                .eq('room_id', roomId)
                .order('created_at', { ascending: true })
                .limit(100);

            if (data) {
                dispatch({
                    type: 'LOAD_MESSAGES',
                    payload: data.map(m => ({
                        id: m.id,
                        text: m.text,
                        sender: m.sender_id,
                        senderName: m.sender_name,
                        time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    })),
                });
            }
        };
        loadMessages();
    }, [roomId]);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEnd.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    // Handle typing indicator timeout
    useEffect(() => {
        if (partnerTyping) {
            const t = setTimeout(() => setPartnerTyping(false), 3000);
            return () => clearTimeout(t);
        }
    }, [partnerTyping]);

    // Send message
    const handleSend = async () => {
        if (!input.trim()) return;

        const msg = {
            id: crypto.randomUUID(),
            text: input.trim(),
            sender: userId,
            senderName: userProfile.name,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        // Add to local state immediately
        dispatch({ type: 'ADD_MESSAGE', payload: msg });

        // Broadcast to partner
        sendChatBroadcast(msg);

        // Persist to Supabase
        await supabase.from('messages').insert({
            room_id: roomId,
            sender_id: userId,
            sender_name: userProfile.name,
            text: input.trim(),
        });

        setInput('');
        setShowEmoji(false);
    };

    // Handle typing
    const handleInputChange = (e) => {
        setInput(e.target.value);
        sendTyping(userId);
    };

    // Handle receiving chat messages (called from App level)
    // This component listens via realtimeManager callbacks set up in useRoom

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const QUICK_REPLIES = [
        'Hey babe ❤️', 'Missing you', 'Ready to play?', 'Truth or dare?',
        'Come closer...', 'I dare you...', 'Tell me more', 'You first...',
    ];

    return (
        <div className="chat-panel">
            {/* Header */}
            <div className="chat-panel__header">
                <div className="chat-panel__partner">
                    <button className="btn btn--icon" onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'lobby' })}>
                        <Icon name="arrow-left" size={20} />
                    </button>
                    <Avatar id={partnerProfile.avatarId} size={36} />
                    <div>
                        <span className="chat-panel__partner-name">{partnerProfile.name || 'Partner'}</span>
                        <div className="chat-panel__status">
                            <span className="chat-panel__online-dot" />
                            <span>Online</span>
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn--icon" onClick={() => {
                        dispatch({ type: 'SET_CALL', payload: { active: true, type: 'voice' } });
                        dispatch({ type: 'SET_SCREEN', payload: 'call' });
                    }}>
                        <Icon name="phone" size={20} />
                    </button>
                    <button className="btn btn--icon" onClick={() => {
                        dispatch({ type: 'SET_CALL', payload: { active: true, type: 'video' } });
                        dispatch({ type: 'SET_SCREEN', payload: 'call' });
                    }}>
                        <Icon name="video" size={20} />
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div className="chat-panel__messages">
                {chatMessages.length === 0 ? (
                    <div className="chat-panel__empty">
                        <Icon name="chat" size={48} color="rgba(255,255,255,0.1)" />
                        <span>Start a conversation</span>
                        <span className="chat-panel__empty-hint">Messages are synced in real-time</span>
                    </div>
                ) : (
                    chatMessages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`chat-panel__bubble ${msg.sender === userId ? 'chat-panel__bubble--user' : 'chat-panel__bubble--partner'}`}
                        >
                            <p className="chat-panel__bubble-text">{msg.text}</p>
                            <span className="chat-panel__bubble-time">{msg.time}</span>
                        </div>
                    ))
                )}

                {partnerTyping && (
                    <div className="chat-panel__bubble chat-panel__bubble--partner">
                        <div className="chat-panel__typing">
                            <div className="chat-panel__typing-dot" />
                            <div className="chat-panel__typing-dot" />
                            <div className="chat-panel__typing-dot" />
                        </div>
                    </div>
                )}

                <div ref={messagesEnd} />
            </div>

            {/* Quick replies */}
            <div className="chat-panel__quick-replies">
                {QUICK_REPLIES.map((qr, i) => (
                    <button key={i} className="chat-panel__qr-btn" onClick={() => { setInput(qr); }}>
                        {qr}
                    </button>
                ))}
            </div>

            {/* Emoji picker */}
            {showEmoji && (
                <div className="chat-panel__emoji-picker">
                    {['😏', '🔥', '💕', '😈', '💋', '🥵', '😘', '🤭', '💦', '🌶️', '🫦', '💜', '✨', '😍', '🥰', '👀'].map((e, i) => (
                        <button key={i} className="chat-panel__emoji-option" onClick={() => setInput(v => v + e)}>
                            {e}
                        </button>
                    ))}
                </div>
            )}

            {/* Input bar */}
            <div className="chat-panel__input-bar">
                <button className="chat-panel__emoji-btn" onClick={() => setShowEmoji(!showEmoji)}>
                    <Icon name="emoji" size={20} />
                </button>
                <input
                    className="chat-panel__input"
                    placeholder="Type a message..."
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                />
                <button
                    className={`chat-panel__send-btn ${input.trim() ? 'chat-panel__send-btn--active' : ''}`}
                    onClick={handleSend}
                    disabled={!input.trim()}
                >
                    <Icon name="send" size={18} />
                </button>
            </div>
        </div>
    );
}

// Export handler for incoming messages (used by App-level integration)
export function handleIncomingChat(dispatch, msg, userId) {
    if (msg.sender !== userId) {
        dispatch({ type: 'ADD_MESSAGE', payload: msg });
    }
}

export function handlePartnerTyping(setPartnerTyping, data, userId) {
    if (data.userId !== userId) {
        setPartnerTyping(true);
    }
}
