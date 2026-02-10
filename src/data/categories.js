// Interest / Kink Taxonomy for Ember
// Organized into 5 tiers of escalating intensity

export const tiers = [
    { id: 1, name: 'Romantic', emoji: '🌸', color: '#ffa07a', description: 'Sweet & tender' },
    { id: 2, name: 'Flirty', emoji: '🌹', color: '#ff6b9d', description: 'Playful & teasing' },
    { id: 3, name: 'Steamy', emoji: '🔥', color: '#e84393', description: 'Getting hot' },
    { id: 4, name: 'Adventurous', emoji: '💜', color: '#8b5cf6', description: 'Pushing boundaries' },
    { id: 5, name: 'Intense', emoji: '🖤', color: '#ff4757', description: 'No holding back' },
];

export const categories = [
    // Tier 1 – Romantic
    { id: 'sweet-talk', name: 'Sweet Talk', tier: 1, emoji: '💬', description: 'Whispered compliments & affirmations' },
    { id: 'love-letters', name: 'Love Letters', tier: 1, emoji: '💌', description: 'Written expressions of desire' },
    { id: 'slow-dance', name: 'Slow Dance', tier: 1, emoji: '💃', description: 'Intimate movement together' },
    { id: 'cuddle-time', name: 'Cuddle Time', tier: 1, emoji: '🤗', description: 'Warmth, closeness, comfort' },
    { id: 'stargazing', name: 'Stargazing', tier: 1, emoji: '🌙', description: 'Deep talks under open skies' },
    { id: 'breakfast-bed', name: 'Breakfast in Bed', tier: 1, emoji: '☕', description: 'Morning intimacy rituals' },

    // Tier 2 – Flirty
    { id: 'teasing', name: 'Teasing', tier: 2, emoji: '😏', description: 'Playful provocation' },
    { id: 'innuendo', name: 'Innuendo', tier: 2, emoji: '🍒', description: 'Double meanings & suggestive talk' },
    { id: 'strip-games', name: 'Strip Games', tier: 2, emoji: '🃏', description: 'Games with sexy stakes' },
    { id: 'massage', name: 'Sensual Massage', tier: 2, emoji: '🫳', description: 'Touch that builds tension' },
    { id: 'playful-bets', name: 'Playful Bets', tier: 2, emoji: '🎲', description: 'Winner takes all' },
    { id: 'photo-exchange', name: 'Selfie Exchange', tier: 2, emoji: '📸', description: 'Sharing yourself visually' },

    // Tier 3 – Steamy
    { id: 'dirty-talk', name: 'Dirty Talk', tier: 3, emoji: '🗣️', description: 'Verbal escalation' },
    { id: 'sexting', name: 'Sexting Prompts', tier: 3, emoji: '📱', description: 'Written desire, explicit' },
    { id: 'fantasy-sharing', name: 'Fantasy Sharing', tier: 3, emoji: '💭', description: 'Reveal your deepest wants' },
    { id: 'body-worship', name: 'Body Worship', tier: 3, emoji: '🙏', description: 'Adoring every inch' },
    { id: 'sensory-play', name: 'Sensory Play', tier: 3, emoji: '🧊', description: 'Ice, silk, feathers, heat' },
    { id: 'mutual-pleasure', name: 'Mutual Pleasure', tier: 3, emoji: '🤝', description: 'Together in sync' },

    // Tier 4 – Adventurous
    { id: 'roleplay', name: 'Roleplay', tier: 4, emoji: '🎭', description: 'Become someone else' },
    { id: 'power-dynamics', name: 'Power Dynamics', tier: 4, emoji: '👑', description: 'Who leads, who follows' },
    { id: 'exhibitionism', name: 'Exhibitionism Fantasy', tier: 4, emoji: '🪟', description: 'The thrill of being seen' },
    { id: 'restraint', name: 'Light Restraint', tier: 4, emoji: '🎀', description: 'Tied up in trust' },
    { id: 'public-fantasy', name: 'Public Fantasy', tier: 4, emoji: '🏙️', description: 'The risk of getting caught' },
    { id: 'costume-play', name: 'Costume Play', tier: 4, emoji: '👗', description: 'Dress to undress' },

    // Tier 5 – Intense
    { id: 'domination', name: 'Domination', tier: 5, emoji: '⛓️', description: 'Taking complete control' },
    { id: 'submission', name: 'Submission', tier: 5, emoji: '🧎', description: 'Giving complete control' },
    { id: 'edge-play', name: 'Edge Play', tier: 5, emoji: '⚡', description: 'Dancing on the line' },
    { id: 'taboo-fiction', name: 'Taboo Fiction', tier: 5, emoji: '🚫', description: 'Safe exploration of the forbidden' },
    { id: 'sensation-extreme', name: 'Extreme Sensation', tier: 5, emoji: '🌊', description: 'Overwhelming the senses' },
    { id: 'mind-games', name: 'Mind Games', tier: 5, emoji: '🧠', description: 'Psychological intensity' },
];

export function getCategoriesByTier(tierId) {
    return categories.filter((c) => c.tier === tierId);
}

export function getTierInfo(tierId) {
    return tiers.find((t) => t.id === tierId);
}

export function getSharedInterests(prefs1, prefs2) {
    const set1 = new Set(prefs1);
    return prefs2.filter((p) => set1.has(p));
}
