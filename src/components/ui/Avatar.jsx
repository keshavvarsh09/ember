import React from 'react';

/* ============================================================
   GARF Avatar System — 12 Detailed SVG Avatars
   Usage: <Avatar id="av-01" size={64} />
   ============================================================ */

const avatarData = {
    'av-01': { label: 'Luna', bg: '#8b5cf6', hair: '#2d1b69', skin: '#f4c2a0', accent: '#e84393' },
    'av-02': { label: 'Blaze', bg: '#e84393', hair: '#1a1028', skin: '#d4956b', accent: '#ff6b35' },
    'av-03': { label: 'Nova', bg: '#ff6b35', hair: '#4a1942', skin: '#f8d5b8', accent: '#8b5cf6' },
    'av-04': { label: 'Storm', bg: '#0ea5e9', hair: '#0a0612', skin: '#c68642', accent: '#e84393' },
    'av-05': { label: 'Ember', bg: '#f43f5e', hair: '#3d1c0a', skin: '#f4c2a0', accent: '#ff6b35' },
    'av-06': { label: 'Sage', bg: '#10b981', hair: '#1a1028', skin: '#8d5524', accent: '#8b5cf6' },
    'av-07': { label: 'Frost', bg: '#6366f1', hair: '#e0e0e0', skin: '#f8d5b8', accent: '#0ea5e9' },
    'av-08': { label: 'Crimson', bg: '#dc2626', hair: '#8b0000', skin: '#d4956b', accent: '#ff6b35' },
    'av-09': { label: 'Willow', bg: '#8b5cf6', hair: '#654321', skin: '#f4c2a0', accent: '#10b981' },
    'av-10': { label: 'Ash', bg: '#64748b', hair: '#2c2c2c', skin: '#c68642', accent: '#e84393' },
    'av-11': { label: 'Phoenix', bg: '#f97316', hair: '#4a0e0e', skin: '#f8d5b8', accent: '#f43f5e' },
    'av-12': { label: 'Dusk', bg: '#7c3aed', hair: '#1a0633', skin: '#8d5524', accent: '#e84393' },
};

function AvatarSVG({ bg, hair, skin, accent, size }) {
    const r = size / 2;
    return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Background circle */}
            <circle cx="50" cy="50" r="50" fill={bg} opacity="0.2" />
            <circle cx="50" cy="50" r="46" fill={bg} opacity="0.1" stroke={accent} strokeWidth="1.5" />

            {/* Neck */}
            <rect x="40" y="65" width="20" height="15" rx="5" fill={skin} />

            {/* Face */}
            <ellipse cx="50" cy="48" rx="22" ry="26" fill={skin} />

            {/* Hair — swept back style */}
            <path d="M28 42c0-16 10-28 22-28s22 12 22 28c0 2-1 4-2 5 1-14-8-25-20-25S30 33 31 47c-1-1-3-3-3-5z" fill={hair} />
            {/* Side hair */}
            <path d="M28 42c-1 6 0 12 2 16-2-4-3-10-2-16z" fill={hair} opacity="0.7" />
            <path d="M72 42c1 6 0 12-2 16 2-4 3-10 2-16z" fill={hair} opacity="0.7" />

            {/* Eyes */}
            <ellipse cx="40" cy="46" rx="3.5" ry="4" fill="white" />
            <ellipse cx="60" cy="46" rx="3.5" ry="4" fill="white" />
            <circle cx="40.5" cy="46.5" r="2" fill="#1a1028" />
            <circle cx="60.5" cy="46.5" r="2" fill="#1a1028" />
            {/* Eye highlight */}
            <circle cx="41.5" cy="45.5" r="0.8" fill="white" />
            <circle cx="61.5" cy="45.5" r="0.8" fill="white" />

            {/* Eyebrows */}
            <path d="M35 40c2-2 5-3 8-2" stroke={hair} strokeWidth="1.5" strokeLinecap="round" fill="none" />
            <path d="M57 38c3-1 6 0 8 2" stroke={hair} strokeWidth="1.5" strokeLinecap="round" fill="none" />

            {/* Nose */}
            <path d="M48 52c1 2 3 2 4 0" stroke={hair} strokeWidth="0.8" strokeLinecap="round" fill="none" opacity="0.4" />

            {/* Mouth — slight smile */}
            <path d="M42 58c3 4 13 4 16 0" stroke={accent} strokeWidth="1.5" strokeLinecap="round" fill="none" />

            {/* Blush */}
            <ellipse cx="35" cy="55" rx="4" ry="2.5" fill={accent} opacity="0.15" />
            <ellipse cx="65" cy="55" rx="4" ry="2.5" fill={accent} opacity="0.15" />

            {/* Shoulder hint */}
            <path d="M30 80c0-5 8-10 20-10s20 5 20 10" fill={accent} opacity="0.15" />
        </svg>
    );
}

export default function Avatar({ id = 'av-01', size = 64, className = '', onClick }) {
    const data = avatarData[id] || avatarData['av-01'];

    return (
        <div
            className={`avatar ${className}`}
            onClick={onClick}
            style={{
                width: size,
                height: size,
                borderRadius: '50%',
                overflow: 'hidden',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: onClick ? 'pointer' : 'default',
                flexShrink: 0,
            }}
        >
            <AvatarSVG {...data} size={size} />
        </div>
    );
}

export function AvatarPicker({ selected, onSelect, size = 56 }) {
    return (
        <div className="avatar-picker" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 12,
            justifyItems: 'center',
        }}>
            {Object.entries(avatarData).map(([id, data]) => (
                <div
                    key={id}
                    onClick={() => onSelect(id)}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 4,
                        cursor: 'pointer',
                        opacity: selected === id ? 1 : 0.6,
                        transform: selected === id ? 'scale(1.1)' : 'scale(1)',
                        transition: 'all 0.2s',
                        border: selected === id ? `2px solid ${data.accent}` : '2px solid transparent',
                        borderRadius: 16,
                        padding: 6,
                    }}
                >
                    <Avatar id={id} size={size} />
                    <span style={{
                        fontSize: 10,
                        color: selected === id ? data.accent : '#999',
                        fontWeight: 600,
                    }}>{data.label}</span>
                </div>
            ))}
        </div>
    );
}

export { avatarData };
