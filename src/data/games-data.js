// ==========================================
// LUST LUDO – 40 squares around the board
// ==========================================
export const ludoSquares = [
    { id: 0, type: 'start', text: 'Start! Roll the dice to begin your journey...', heat: 0, color: 'white' },
    { id: 1, type: 'flirt', text: 'Give your partner a genuine compliment about their smile', heat: 1, color: 'green' },
    { id: 2, type: 'tease', text: 'Describe your partner in 3 words that would make them blush', heat: 1, color: 'yellow' },
    { id: 3, type: 'flirt', text: 'Tell them the first thing you noticed about them', heat: 1, color: 'green' },
    { id: 4, type: 'dare', text: 'Send your partner a wink emoji and a one-line flirt', heat: 2, color: 'orange' },
    { id: 5, type: 'jackpot', text: '⭐ JACKPOT: Both whisper something sweet to each other at the same time', heat: 1, color: 'gold' },
    { id: 6, type: 'tease', text: 'What outfit of theirs drives you the most crazy?', heat: 2, color: 'yellow' },
    { id: 7, type: 'flirt', text: 'If you could kiss them anywhere right now, where would it be?', heat: 2, color: 'green' },
    { id: 8, type: 'dare', text: 'Bite your lip and tell them what you\'re thinking', heat: 2, color: 'orange' },
    { id: 9, type: 'tease', text: 'Rate their voice on a scale of 1 to "I need to hear more"', heat: 2, color: 'yellow' },
    { id: 10, type: 'heat', text: 'Describe in detail what you\'d do if you were alone together right now', heat: 3, color: 'red' },
    { id: 11, type: 'flirt', text: 'What part of their body do you think about most?', heat: 2, color: 'green' },
    { id: 12, type: 'dare', text: 'Remove one piece of clothing. Show or tell.', heat: 3, color: 'orange' },
    { id: 13, type: 'fantasy', text: 'Share a fantasy that involves a public place', heat: 3, color: 'purple' },
    { id: 14, type: 'tease', text: 'Whisper (or text) the dirtiest thing you dare', heat: 3, color: 'yellow' },
    { id: 15, type: 'jackpot', text: '⭐ JACKPOT: Both remove a piece of clothing at the same time', heat: 3, color: 'gold' },
    { id: 16, type: 'heat', text: 'Describe a dream you\'ve had about them. Don\'t leave anything out.', heat: 3, color: 'red' },
    { id: 17, type: 'dare', text: 'Send a suggestive voice note — breathing + one sentence', heat: 3, color: 'orange' },
    { id: 18, type: 'fantasy', text: 'If you could roleplay any scenario, what would it be?', heat: 3, color: 'purple' },
    { id: 19, type: 'tease', text: 'What sound would you want them to make right now?', heat: 3, color: 'yellow' },
    { id: 20, type: 'heat', text: 'Describe the last time you couldn\'t stop thinking about them', heat: 4, color: 'red' },
    { id: 21, type: 'dare', text: 'Show them your current expression. No filter.', heat: 3, color: 'orange' },
    { id: 22, type: 'fantasy', text: 'Describe a scenario where one of you is completely in control', heat: 4, color: 'purple' },
    { id: 23, type: 'tease', text: 'What would you do with 0 inhibitions and 1 hour?', heat: 4, color: 'yellow' },
    { id: 24, type: 'dare', text: 'Remove another piece of clothing. You know the rules.', heat: 4, color: 'orange' },
    { id: 25, type: 'jackpot', text: '⭐ JACKPOT: Take turns describing what you\'d do — one sentence each, back and forth', heat: 4, color: 'gold' },
    { id: 26, type: 'heat', text: 'Describe their body from head to toe. Be vivid.', heat: 4, color: 'red' },
    { id: 27, type: 'fantasy', text: 'You wake up next to them. What\s the very first thing you do?', heat: 4, color: 'purple' },
    { id: 28, type: 'dare', text: 'Tell them exactly what you want. No metaphors. Raw.', heat: 4, color: 'orange' },
    { id: 29, type: 'heat', text: 'Write a 3-sentence scenario. Make them squirm.', heat: 4, color: 'red' },
    { id: 30, type: 'fantasy', text: 'Describe a scene where they beg for it. Every detail.', heat: 5, color: 'purple' },
    { id: 31, type: 'dare', text: 'Voice note: describe what they taste like in your imagination', heat: 5, color: 'orange' },
    { id: 32, type: 'heat', text: 'Full scene: start to finish. Leave nothing out.', heat: 5, color: 'red' },
    { id: 33, type: 'dare', text: 'Remove something. You\'re almost at the finish...', heat: 5, color: 'orange' },
    { id: 34, type: 'fantasy', text: 'The forbidden fantasy. The one you\'ve never said aloud. Now.', heat: 5, color: 'purple' },
    { id: 35, type: 'jackpot', text: '⭐ JACKPOT: Both confess the most intense thing you want right now', heat: 5, color: 'gold' },
    { id: 36, type: 'heat', text: 'Dominate or submit? Act it out verbally. Full commitment.', heat: 5, color: 'red' },
    { id: 37, type: 'dare', text: 'The final strip. Whatever\'s left — gone.', heat: 5, color: 'orange' },
    { id: 38, type: 'heat', text: 'You have 60 seconds. Make them lose their mind with words alone.', heat: 5, color: 'red' },
    { id: 39, type: 'finish', text: '🏁 FINISH! You\'ve made it. Now make good on everything you promised...', heat: 5, color: 'gold' },
];

// ==========================================
// SINS & LADDERS – 36 squares (6×6 grid)
// ==========================================
export const snakesSquares = [
    { id: 1, text: 'Hold hands (or imagine it)', heat: 1 },
    { id: 2, text: 'Share one thing you love about their personality', heat: 1 },
    { id: 3, text: 'What was your first impression of them?', heat: 1 },
    { id: 4, text: 'Describe your idea of a perfect date night', heat: 1 },
    { id: 5, text: 'Tell them a secret you\'ve never shared', heat: 1 },
    { id: 6, text: 'What song reminds you of them?', heat: 1 },
    { id: 7, text: 'Whisper a compliment about their appearance', heat: 2 },
    { id: 8, text: 'What do you find sexiest about their voice?', heat: 2 },
    { id: 9, text: 'Describe a kiss you want to give them', heat: 2 },
    { id: 10, text: 'If they were here, where would your hands go first?', heat: 2 },
    { id: 11, text: 'Rate: morning intimacy vs. midnight intimacy?', heat: 2 },
    { id: 12, text: 'What scent on them drives you wild?', heat: 2 },
    { id: 13, text: 'Describe what they\'re wearing in your fantasy right now', heat: 3 },
    { id: 14, text: 'What\'s the boldest thing you\'d do in an elevator together?', heat: 3 },
    { id: 15, text: 'Remove one piece of clothing. For the game.', heat: 3 },
    { id: 16, text: 'Describe their most attractive body part in vivid detail', heat: 3 },
    { id: 17, text: 'Voice note: say "I want you" in your most seductive voice', heat: 3 },
    { id: 18, text: 'Share a fantasy that involves a stranger watching', heat: 3 },
    { id: 19, text: 'What would you do with blindfolds and 10 minutes?', heat: 4 },
    { id: 20, text: 'Describe a scene that would make a movie R-rated', heat: 4 },
    { id: 21, text: 'Strip something off. No hesitation.', heat: 4 },
    { id: 22, text: 'What role would you play? What role for them?', heat: 4 },
    { id: 23, text: 'Describe the sounds you want to hear from them', heat: 4 },
    { id: 24, text: 'Write a 3-line explicit message. Send it.', heat: 4 },
    { id: 25, text: 'If you could have them do ONE thing right now, what?', heat: 4 },
    { id: 26, text: 'Describe the scene: lighting, music, what happens', heat: 4 },
    { id: 27, text: 'Full fantasy scenario. Include every detail.', heat: 5 },
    { id: 28, text: 'What\'s the most intense thing you\'ve imagined about them?', heat: 5 },
    { id: 29, text: 'Voice: describe what you\'d do. Be explicit.', heat: 5 },
    { id: 30, text: 'Remove everything except one item. Your choice.', heat: 5 },
    { id: 31, text: 'Dominant or submissive tonight? Prove it with words.', heat: 5 },
    { id: 32, text: 'Describe the buildup. Slow. Every. Second.', heat: 5 },
    { id: 33, text: 'The confession: your most forbidden thought about them', heat: 5 },
    { id: 34, text: 'Write a scene so intense you blush typing it', heat: 5 },
    { id: 35, text: 'Last piece of clothing. Gone. Right now.', heat: 5 },
    { id: 36, text: '🔥 FINALE: Make good on everything. This is the night.', heat: 5 },
];

export const ladders = [
    { from: 3, to: 11, text: '🪜 Escalation! Skip ahead — but remove a piece of clothing' },
    { from: 9, to: 18, text: '🪜 Things are heating up! Describe a fantasy to climb' },
    { from: 14, to: 25, text: '🪜 Big jump! Strip something and share a desire' },
    { from: 20, to: 30, text: '🪜 Almost there! Full confession required to climb' },
];

export const snakes = [
    { from: 16, to: 8, text: '🐍 Cool down: compliment their mind, not their body' },
    { from: 22, to: 13, text: '🐍 Slow down: tell them what you love about your connection' },
    { from: 29, to: 19, text: '🐍 Breathe: share your favorite non-physical memory together' },
    { from: 34, to: 26, text: '🐍 Pause: whisper something genuinely tender' },
];

// ==========================================
// DESIRE MONOPOLY – 24 properties + cards
// ==========================================
export const monopolyProperties = [
    // Cheap properties (50-80 coins)
    { id: 'hands', name: 'Their Hands', price: 50, rent: 20, group: 'gentle', emoji: '🤲', desc: 'Describe what you\'d do with their hands' },
    { id: 'lips', name: 'Their Lips', price: 60, rent: 25, group: 'gentle', emoji: '👄', desc: 'Describe a kiss in extreme detail' },
    { id: 'neck', name: 'Their Neck', price: 70, rent: 30, group: 'gentle', emoji: '💋', desc: 'What would you do to their neck?' },
    { id: 'ears', name: 'Their Ears', price: 60, rent: 25, group: 'gentle', emoji: '👂', desc: 'Whisper something that would give them chills' },
    // Mid-range (100-150)
    { id: 'back', name: 'Their Back', price: 100, rent: 40, group: 'warm', emoji: '🔙', desc: 'Trace a path down their back with words' },
    { id: 'shoulders', name: 'Their Shoulders', price: 100, rent: 40, group: 'warm', emoji: '💪', desc: 'What message would you give them?' },
    { id: 'stomach', name: 'Their Stomach', price: 120, rent: 50, group: 'warm', emoji: '✨', desc: 'Describe kissing their stomach' },
    { id: 'chest', name: 'Their Chest', price: 130, rent: 55, group: 'warm', emoji: '💗', desc: 'What do you want to do to their chest?' },
    // Expensive (180-250)
    { id: 'thighs', name: 'Their Thighs', price: 180, rent: 70, group: 'hot', emoji: '🦵', desc: 'Describe running your hands up their thighs' },
    { id: 'hips', name: 'Their Hips', price: 200, rent: 80, group: 'hot', emoji: '🔥', desc: 'What do their hips make you want to do?' },
    { id: 'inner-thighs', name: 'Their Inner Thighs', price: 220, rent: 90, group: 'fire', emoji: '💜', desc: 'No holding back. Describe it all.' },
    { id: 'everything', name: 'Everything Below', price: 300, rent: 120, group: 'fire', emoji: '🖤', desc: 'You own it all. Describe what happens.' },
];

export const monopolyBoard = [
    { type: 'go', name: 'GO', emoji: '🚀', desc: 'Collect 50 coins as you pass' },
    { type: 'property', propertyId: 'hands' },
    { type: 'property', propertyId: 'lips' },
    { type: 'chance', name: 'Chance', emoji: '❓' },
    { type: 'property', propertyId: 'neck' },
    { type: 'property', propertyId: 'ears' },
    { type: 'community', name: 'Intimacy', emoji: '💝' },
    { type: 'property', propertyId: 'back' },
    { type: 'property', propertyId: 'shoulders' },
    { type: 'jail', name: 'Jail', emoji: '🔒', desc: 'Strip to escape, or skip a turn' },
    { type: 'property', propertyId: 'stomach' },
    { type: 'property', propertyId: 'chest' },
    { type: 'chance', name: 'Chance', emoji: '❓' },
    { type: 'property', propertyId: 'thighs' },
    { type: 'community', name: 'Intimacy', emoji: '💝' },
    { type: 'property', propertyId: 'hips' },
    { type: 'free-parking', name: 'Free Fantasy', emoji: '🌙', desc: 'Both share a fantasy aloud' },
    { type: 'property', propertyId: 'inner-thighs' },
    { type: 'chance', name: 'Chance', emoji: '❓' },
    { type: 'property', propertyId: 'everything' },
    { type: 'community', name: 'Intimacy', emoji: '💝' },
    { type: 'go-to-jail', name: 'Go to Jail', emoji: '🚔', desc: 'Straight to jail!' },
    { type: 'chance', name: 'Chance', emoji: '❓' },
    { type: 'community', name: 'Intimacy', emoji: '💝' },
];

export const chanceCards = [
    { text: 'Remove one piece of clothing. No negotiation.', heat: 3 },
    { text: 'Send a voice note: "I need you." Say it like you mean it.', heat: 3 },
    { text: 'Describe what you\'d do if they were in front of you right now.', heat: 4 },
    { text: 'Your partner chooses: truth or dare. You must comply.', heat: 3 },
    { text: 'Kiss the screen (or describe the kiss in excruciating detail).', heat: 2 },
    { text: 'You get 100 bonus coins! But you must dirty talk for 30 seconds.', heat: 4 },
    { text: 'Swap a piece of clothing with your partner (honor system).', heat: 3 },
    { text: 'Advance to "Their Thighs" — if unowned, describe buying it.', heat: 4 },
];

export const communityCards = [
    { text: 'Share the most intimate moment you\'ve had with your partner', heat: 2 },
    { text: 'Tell them one thing that makes you feel safe and desired', heat: 1 },
    { text: 'Describe your love language in action — what does it look like?', heat: 2 },
    { text: 'Confess: what do you think about right before falling asleep?', heat: 3 },
    { text: 'Share a vulnerability. Something real. Then hold the silence.', heat: 2 },
    { text: 'Describe a future together. Not sexy — just real and beautiful.', heat: 1 },
    { text: 'What would you write on a love letter only they would read?', heat: 2 },
    { text: 'Tell them the one thing you\'re most grateful for about them', heat: 1 },
];

// ==========================================
// TRUTH OR DARE – 50 prompts (10 per level)
// ==========================================
export const truthOrDarePrompts = {
    truth: [
        // Heat 1
        { text: 'What was your first impression of me?', heat: 1 },
        { text: 'What\'s your favorite memory of us together?', heat: 1 },
        { text: 'When did you first realize you were attracted to me?', heat: 1 },
        { text: 'What\'s the sweetest dream you\'ve had about us?', heat: 1 },
        { text: 'What pet name secretly makes your heart melt?', heat: 1 },
        // Heat 2
        { text: 'Where is your favorite place to be kissed?', heat: 2 },
        { text: 'What do I do that turns you on without trying?', heat: 2 },
        { text: 'What outfit of mine makes you stare the longest?', heat: 2 },
        { text: 'Have you ever had a dream about us that made you wake up flushed?', heat: 2 },
        { text: 'What body part of mine do you think about most?', heat: 2 },
        // Heat 3
        { text: 'Describe the best kiss we\'ve ever had (or one you imagine)', heat: 3 },
        { text: 'What\'s the boldest text you\'ve wanted to send me?', heat: 3 },
        { text: 'What\'s a fantasy you\'ve never shared with anyone?', heat: 3 },
        { text: 'When\'s the last time you touched yourself thinking about me?', heat: 3 },
        { text: 'What sound do I make that drives you insane?', heat: 3 },
        // Heat 4
        { text: 'Describe in detail what you want to do to me right now', heat: 4 },
        { text: 'What\'s the most explicit thought you\'ve had about us?', heat: 4 },
        { text: 'If you could have me do anything, what would you choose?', heat: 4 },
        { text: 'What position do you think about most?', heat: 4 },
        { text: 'Describe your ultimate scene with me — setting, mood, everything', heat: 4 },
        // Heat 5
        { text: 'Your most forbidden thought about me. No filter.', heat: 5 },
        { text: 'Describe the most intense experience you\'ve ever had or imagined', heat: 5 },
        { text: 'What would you do to me with zero inhibitions?', heat: 5 },
        { text: 'Describe what it feels like when you want me so badly it hurts', heat: 5 },
        { text: 'The one thing you\'ve never asked me to do but desperately want', heat: 5 },
    ],
    dare: [
        // Heat 1
        { text: 'Send a selfie with your most seductive expression', heat: 1 },
        { text: 'Write a 2-line love note and read it aloud', heat: 1 },
        { text: 'Tell me 3 things about my appearance that drive you crazy', heat: 1 },
        { text: 'Do your best "come hither" look on camera', heat: 1 },
        { text: 'Hum the song that reminds you of us', heat: 1 },
        // Heat 2
        { text: 'Bite your lip while looking at the camera for 10 seconds', heat: 2 },
        { text: 'Send a voice note saying something flirty in a whisper', heat: 2 },
        { text: 'Describe what you\'re wearing — slowly', heat: 2 },
        { text: 'Show your collarbone on camera', heat: 2 },
        { text: 'Tell me exactly what you\'d do if I walked through your door', heat: 2 },
        // Heat 3
        { text: 'Remove one piece of clothing on camera', heat: 3 },
        { text: 'Voice note: moan my name. Once. Make it count.', heat: 3 },
        { text: 'Describe undressing me — piece by piece', heat: 3 },
        { text: 'Touch your neck slowly while looking at the camera', heat: 3 },
        { text: 'Write and send the dirtiest text you can manage', heat: 3 },
        // Heat 4
        { text: 'Strip to your underwear. I dare you.', heat: 4 },
        { text: 'Record a 30-second voice note. Just breathing and one filthy sentence.', heat: 4 },
        { text: 'Describe what you\'d do to me in the next 5 minutes', heat: 4 },
        { text: 'Show me your most vulnerable look', heat: 4 },
        { text: 'Roleplay: you just pinned me against the wall. What happens next?', heat: 4 },
        // Heat 5
        { text: 'Everything comes off. Full dare. Own it.', heat: 5 },
        { text: 'Full fantasy roleplay: Start to finish. Voice only.', heat: 5 },
        { text: 'Describe in explicit detail what you\'d do for the next hour', heat: 5 },
        { text: 'Dominate me with words for 60 seconds. Don\'t stop.', heat: 5 },
        { text: 'The ultimate dare: make me unable to think straight with just your voice', heat: 5 },
    ],
};

// ==========================================
// STRIP QUIZ – 40 questions
// ==========================================
export const stripQuizQuestions = [
    // Round 1 – Easy relationship questions
    { text: 'What is your partner\'s favorite color?', heat: 1, category: 'basics' },
    { text: 'What is your partner\'s middle name?', heat: 1, category: 'basics' },
    { text: 'What is your partner\'s favorite food?', heat: 1, category: 'basics' },
    { text: 'Where did you first meet?', heat: 1, category: 'basics' },
    { text: 'What is your partner\'s biggest fear?', heat: 1, category: 'basics' },
    { text: 'What was your partner\'s childhood dream job?', heat: 1, category: 'basics' },
    { text: 'What is your partner\'s love language?', heat: 1, category: 'basics' },
    { text: 'What is your partner\'s favorite movie?', heat: 1, category: 'basics' },
    // Round 2 – Flirty questions
    { text: 'What\'s your partner\'s favorite place to be kissed?', heat: 2, category: 'flirty' },
    { text: 'What song does your partner say reminds them of you?', heat: 2, category: 'flirty' },
    { text: 'What\'s your partner\'s go-to date night activity?', heat: 2, category: 'flirty' },
    { text: 'Does your partner prefer morning or night intimacy?', heat: 2, category: 'flirty' },
    { text: 'What outfit does your partner want to see you in?', heat: 2, category: 'flirty' },
    { text: 'What body part of yours does your partner stare at most?', heat: 2, category: 'flirty' },
    { text: 'What word does your partner use when they\'re turned on?', heat: 2, category: 'flirty' },
    { text: 'What perfume/cologne drives your partner wild?', heat: 2, category: 'flirty' },
    // Round 3 – Steamy questions
    { text: 'What\'s your partner\'s top fantasy theme?', heat: 3, category: 'steamy' },
    { text: 'Does your partner prefer lights on or off?', heat: 3, category: 'steamy' },
    { text: 'What\'s your partner\'s preferred role: dominant or submissive?', heat: 3, category: 'steamy' },
    { text: 'Where is the riskiest place your partner wants to do it?', heat: 3, category: 'steamy' },
    { text: 'What thing in bed does your partner want more of?', heat: 3, category: 'steamy' },
    { text: 'What\'s your partner\'s favorite time to be intimate?', heat: 3, category: 'steamy' },
    { text: 'What roleplay scenario is your partner most into?', heat: 3, category: 'steamy' },
    { text: 'What texture or material turns your partner on?', heat: 3, category: 'steamy' },
    // Round 4 – Hot questions
    { text: 'What\'s the dirtiest text your partner has sent you?', heat: 4, category: 'hot' },
    { text: 'What position does your partner fantasize about most?', heat: 4, category: 'hot' },
    { text: 'What would your partner do if they had you alone for 1 hour?', heat: 4, category: 'hot' },
    { text: 'Does your partner prefer slow buildup or immediate intensity?', heat: 4, category: 'hot' },
    { text: 'What\'s the one thing your partner secretly craves?', heat: 4, category: 'hot' },
    { text: 'Where does your partner want to be touched right now?', heat: 4, category: 'hot' },
    { text: 'What sound does your partner make when they\'re turned on?', heat: 4, category: 'hot' },
    { text: 'What\'s your partner\'s biggest physical weakness?', heat: 4, category: 'hot' },
    // Round 5 – Inferno
    { text: 'What is your partner\'s number one most intense desire?', heat: 5, category: 'inferno' },
    { text: 'Describe what your partner would do to you right now if they could', heat: 5, category: 'inferno' },
    { text: 'What\'s the most explicit message your partner has ever sent?', heat: 5, category: 'inferno' },
    { text: 'What does your partner want you to do that they\'ve never asked for?', heat: 5, category: 'inferno' },
    { text: 'What happens in your partner\'s most forbidden fantasy?', heat: 5, category: 'inferno' },
    { text: 'What would make your partner completely lose control?', heat: 5, category: 'inferno' },
    { text: 'Describe your partner\'s ideal 10 minutes of pure passion', heat: 5, category: 'inferno' },
    { text: 'What is the one thing that would make tonight unforgettable?', heat: 5, category: 'inferno' },
];

// ==========================================
// SPIN WHEEL OPTIONS
// ==========================================
export const spinWheelOptions = [
    { label: 'Story Mode', emoji: '📖', screen: 'mood', color: '#e84393' },
    { label: 'Quick Dare', emoji: '🎯', screen: 'dare', color: '#6c5ce7' },
    { label: 'Lust Ludo', emoji: '🎲', screen: 'ludo', color: '#fd79a8' },
    { label: 'Sins & Ladders', emoji: '🐍', screen: 'snakes', color: '#a29bfe' },
    { label: 'Desire Monopoly', emoji: '🏘️', screen: 'monopoly', color: '#ff6b6b' },
    { label: 'Truth or Dare', emoji: '🔥', screen: 'truth-dare', color: '#f8a5c2' },
    { label: 'Strip Quiz', emoji: '🃏', screen: 'strip-quiz', color: '#e17055' },
    { label: 'Daily Spark', emoji: '✨', screen: 'mood', color: '#ffeaa7' },
];

// ==========================================
// DAILY REWARDS
// ==========================================
export const dailyRewards = [
    { day: 1, reward: 'Bonus Dare Unlocked', emoji: '🎁', bonus: 25 },
    { day: 2, reward: 'Extra Spin', emoji: '🎰', bonus: 25 },
    { day: 3, reward: 'Mystery Fantasy Prompt', emoji: '💭', bonus: 50 },
    { day: 4, reward: 'Double Score Day', emoji: '⚡', bonus: 50 },
    { day: 5, reward: 'Exclusive Dare Pack', emoji: '🔥', bonus: 75 },
    { day: 6, reward: 'Partner Surprise Card', emoji: '💝', bonus: 75 },
    { day: 7, reward: '🌟 Exclusive Story Unlocked!', emoji: '⭐', bonus: 150 },
];

// Helper functions
export function getRandomChanceCard() {
    return chanceCards[Math.floor(Math.random() * chanceCards.length)];
}

export function getRandomCommunityCard() {
    return communityCards[Math.floor(Math.random() * communityCards.length)];
}

export function getTruthsByHeat(heat) {
    return truthOrDarePrompts.truth.filter(t => t.heat <= heat);
}

export function getDaresByHeat(heat) {
    return truthOrDarePrompts.dare.filter(d => d.heat <= heat);
}

export function getQuizByRound(round) {
    const heats = [1, 2, 3, 4, 5];
    const heat = heats[Math.min(round, heats.length - 1)];
    return stripQuizQuestions.filter(q => q.heat === heat);
}

export function rollDice() {
    return Math.floor(Math.random() * 6) + 1;
}
