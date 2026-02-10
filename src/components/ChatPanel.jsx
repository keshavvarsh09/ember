import React, { useState, useRef, useEffect } from 'react';
import { useGame } from '../engine/gameState';

const quickReplies = ['😍', '🔥', 'Tell me more...', 'Your turn', 'I dare you', '💋'];
const partnerAutoReplies = [
    'Mmm, keep going... 😏',
    'You\'re making me blush 🙈',
    'I can\'t stop thinking about you 💭',
    'Tell me something I don\'t know about you...',
    'Your turn. Make it good. 🔥',
    'I wish you were here right now...',
    'That made my heart race 💓',
    'You\'re dangerous with words 😏',
];

export default function ChatPanel() {
    const { state, dispatch } = useGame();
    const [message, setMessage] = useState('');
    const [showEmoji, setShowEmoji] = useState(false);
    const [typing, setTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [state.chatMessages]);

    const sendMessage = (text) => {
        if (!text.trim()) return;
        const msg = {
            id: Date.now(),
            from: 'user',
            text: text.trim(),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        dispatch({ type: 'SEND_MESSAGE', payload: msg });
        setMessage('');
        setShowEmoji(false);

        // Simulate partner typing + reply
        setTyping(true);
        const delay = 1500 + Math.random() * 2500;
        setTimeout(() => {
            setTyping(false);
            const replyText = partnerAutoReplies[Math.floor(Math.random() * partnerAutoReplies.length)];
            const reply = {
                id: Date.now() + 1,
                from: 'partner',
                text: replyText,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
            dispatch({ type: 'SEND_MESSAGE', payload: reply });
        }, delay);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage(message);
        }
    };

    return (
        <div className="chat-panel page-enter">
            {/* Header */}
            <div className="chat-panel__header">
                <button className="btn btn--ghost" onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'lobby' })}>
                    ← Back
                </button>
                <div className="chat-panel__partner">
                    <span className="chat-panel__partner-avatar">{state.partnerProfile.avatar}</span>
                    <div>
                        <span className="chat-panel__partner-name">{state.partnerProfile.name || 'Partner'}</span>
                        <span className="chat-panel__status">
                            <span className="chat-panel__online-dot" />
                            Online
                        </span>
                    </div>
                </div>
                <button className="btn btn--ghost btn--icon" onClick={() => dispatch({ type: 'SET_SCREEN', payload: 'call' })}>
                    📞
                </button>
            </div>

            {/* Messages */}
            <div className="chat-panel__messages">
                {state.chatMessages.length === 0 && (
                    <div className="chat-panel__empty">
                        <div className="chat-panel__empty-icon">💬</div>
                        <p>Start a conversation...</p>
                        <p className="chat-panel__empty-hint">Say something sweet. Or spicy. Your call. 🔥</p>
                    </div>
                )}
                {state.chatMessages.map((msg) => (
                    <div key={msg.id} className={`chat-panel__bubble ${msg.from === 'user' ? 'chat-panel__bubble--user' : 'chat-panel__bubble--partner'}`}>
                        <div className="chat-panel__bubble-text">{msg.text}</div>
                        <div className="chat-panel__bubble-time">{msg.time}</div>
                    </div>
                ))}
                {typing && (
                    <div className="chat-panel__bubble chat-panel__bubble--partner">
                        <div className="chat-panel__typing">
                            <span className="chat-panel__typing-dot" />
                            <span className="chat-panel__typing-dot" />
                            <span className="chat-panel__typing-dot" />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Quick replies */}
            <div className="chat-panel__quick-replies">
                {quickReplies.map((qr) => (
                    <button key={qr} className="chat-panel__qr-btn" onClick={() => sendMessage(qr)}>
                        {qr}
                    </button>
                ))}
            </div>

            {/* Input */}
            <div className="chat-panel__input-bar">
                <button className="chat-panel__emoji-btn" onClick={() => setShowEmoji(!showEmoji)}>
                    😊
                </button>
                <input
                    ref={inputRef}
                    className="chat-panel__input"
                    type="text"
                    placeholder="Type something..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <button
                    className={`chat-panel__send-btn ${message.trim() ? 'chat-panel__send-btn--active' : ''}`}
                    onClick={() => sendMessage(message)}
                    disabled={!message.trim()}
                >
                    ➤
                </button>
            </div>

            {/* Emoji picker */}
            {showEmoji && (
                <div className="chat-panel__emoji-picker animate-fade-in-up">
                    {['❤️', '🔥', '😍', '🥵', '💋', '😏', '💜', '🫣', '⚡', '💦', '👅', '🌶️', '🍑', '🍒', '💫', '🖤'].map((e) => (
                        <button key={e} className="chat-panel__emoji-option" onClick={() => sendMessage(e)}>
                            {e}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
