// Dares for Ember – organized by heat level

export const dares = [
    // Heat 1 – Warm
    { id: 'd-w1', text: 'Send your partner a good morning text that would make them blush', heat: 1, category: 'sweet-talk' },
    { id: 'd-w2', text: 'Tell them 3 things about their appearance that drive you crazy', heat: 1, category: 'sweet-talk' },
    { id: 'd-w3', text: 'Write a 2-sentence love note and send it right now', heat: 1, category: 'love-letters' },
    { id: 'd-w4', text: 'Describe your ideal lazy Sunday morning together', heat: 1, category: 'cuddle-time' },
    { id: 'd-w5', text: 'Tell them: what song reminds you of them and why?', heat: 1, category: 'stargazing' },
    { id: 'd-w6', text: 'Share a memory of them that you replay in your head', heat: 1, category: 'sweet-talk' },
    { id: 'd-w7', text: 'Pick a movie scene and say: "That\'s us, but better."', heat: 1, category: 'slow-dance' },
    { id: 'd-w8', text: 'Finish this sentence to them: "When I first saw you, I thought..."', heat: 1, category: 'sweet-talk' },

    // Heat 2 – Flirty
    { id: 'd-f1', text: 'Send them a selfie with a caption that\'s a double entendre', heat: 2, category: 'innuendo' },
    { id: 'd-f2', text: 'Describe what you\'d wear (or not wear) if they were here right now', heat: 2, category: 'teasing' },
    { id: 'd-f3', text: 'Tell them: where\'s your favorite place to be kissed?', heat: 2, category: 'teasing' },
    { id: 'd-f4', text: 'Play 3 rounds of "Would You Rather" — flirty edition', heat: 2, category: 'playful-bets' },
    { id: 'd-f5', text: 'Send a voice note saying something suggestive in your most seductive voice', heat: 2, category: 'innuendo' },
    { id: 'd-f6', text: 'Name one thing about them that makes you lose focus', heat: 2, category: 'teasing' },
    { id: 'd-f7', text: 'If you could freeze one moment with them forever, which would it be?', heat: 2, category: 'massage' },
    { id: 'd-f8', text: 'What\'s one thing they do without realizing that turns you on?', heat: 2, category: 'teasing' },

    // Heat 3 – Steamy
    { id: 'd-s1', text: 'Describe out loud what you want to do to them right now', heat: 3, category: 'dirty-talk' },
    { id: 'd-s2', text: 'Write them a 3-line explicit text message. Don\'t hold back.', heat: 3, category: 'sexting' },
    { id: 'd-s3', text: 'Share one fantasy you\'ve never told anyone', heat: 3, category: 'fantasy-sharing' },
    { id: 'd-s4', text: 'Describe their body — the part you think about most — in vivid detail', heat: 3, category: 'body-worship' },
    { id: 'd-s5', text: 'Tell them exactly what sound you\'d want them to make', heat: 3, category: 'dirty-talk' },
    { id: 'd-s6', text: 'Voice note: whisper something you\'d say in the moment', heat: 3, category: 'dirty-talk' },
    { id: 'd-s7', text: 'Name the one thing they could do right now to drive you insane', heat: 3, category: 'mutual-pleasure' },
    { id: 'd-s8', text: 'If this was your last night alive, what would you do to them?', heat: 3, category: 'fantasy-sharing' },

    // Heat 4 – Hot
    { id: 'd-h1', text: 'Roleplay: You just walked in and found them waiting for you. What happens?', heat: 4, category: 'roleplay' },
    { id: 'd-h2', text: 'Describe a scenario where you\'re completely in control of them', heat: 4, category: 'power-dynamics' },
    { id: 'd-h3', text: 'You have a hotel room for one night together. Describe every hour.', heat: 4, category: 'roleplay' },
    { id: 'd-h4', text: 'Tell them what you\'d do if no one could ever know', heat: 4, category: 'exhibitionism' },
    { id: 'd-h5', text: 'Describe the scene: what you see, hear, smell, feel, taste', heat: 4, category: 'sensory-play' },
    { id: 'd-h6', text: 'Record a 30-second voice note. Just breathing and one sentence.', heat: 4, category: 'dirty-talk' },
    { id: 'd-h7', text: 'Write a scenario where they have to beg for it', heat: 4, category: 'power-dynamics' },
    { id: 'd-h8', text: 'Take turns adding one line to an increasingly explicit story', heat: 4, category: 'fantasy-sharing' },

    // Heat 5 – Inferno
    { id: 'd-i1', text: 'Full scenario: Play out an entire fantasy, start to finish, voice only', heat: 5, category: 'roleplay' },
    { id: 'd-i2', text: 'Domination round: Give them 3 commands. They must obey.', heat: 5, category: 'domination' },
    { id: 'd-i3', text: 'Submission round: Ask them for 3 commands. You must obey.', heat: 5, category: 'submission' },
    { id: 'd-i4', text: 'Describe in excruciating detail what you\'d do with 0 inhibitions', heat: 5, category: 'taboo-fiction' },
    { id: 'd-i5', text: 'The power exchange: Alternate between commanding and surrendering', heat: 5, category: 'power-dynamics' },
    { id: 'd-i6', text: 'Build a scene from scratch: setting, roles, rules, safeword. Then play it.', heat: 5, category: 'edge-play' },
    { id: 'd-i7', text: 'The confessional: Reveal your most forbidden thought about them', heat: 5, category: 'taboo-fiction' },
    { id: 'd-i8', text: 'Write a scene so intense you blush while typing it', heat: 5, category: 'mind-games' },
];

export function getDaresByHeat(heat) {
    return dares.filter((d) => d.heat === heat);
}

export function getRandomDare(maxHeat = 3) {
    const eligible = dares.filter((d) => d.heat <= maxHeat);
    return eligible[Math.floor(Math.random() * eligible.length)];
}

export function getDaresByCategory(categoryId) {
    return dares.filter((d) => d.category === categoryId);
}
