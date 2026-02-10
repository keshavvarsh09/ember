// Daily Sparks – Quick 2-5 min micro-scenarios for daily play

export const dailySparks = [
    {
        id: 'ds-1',
        title: 'Two Truths & A Desire',
        emoji: '🎭',
        heat: 2,
        description: 'Tell two truths and one desire. Your partner guesses which is the desire.',
        prompt: 'Share three statements about yourself — two are things you\'ve actually done, one is something you *want* to do with your partner. They guess which is the desire. Then swap.',
        duration: '3 min',
    },
    {
        id: 'ds-2',
        title: 'The Playlist',
        emoji: '🎵',
        heat: 1,
        description: 'Build a 3-song intimacy playlist together.',
        prompt: 'Each of you picks 3 songs:\n\n1. A song for "the first look across the room"\n2. A song for "the slow approach"\n3. A song for "when the door closes"\n\nShare your picks and explain why. Create your shared Ember playlist.',
        duration: '5 min',
    },
    {
        id: 'ds-3',
        title: 'Finish My Sentence',
        emoji: '✍️',
        heat: 3,
        description: 'Start a sentence. Your partner finishes it. Escalate.',
        prompt: 'Take turns. One person starts a sentence, the other finishes it. Start innocent, end... not.\n\nStarters:\n• "When I think about you at 2am, I..."\n• "If you were here right now, I would..."\n• "The thing about you that makes me weak is..."\n• "Tonight, I dare you to..."',
        duration: '4 min',
    },
    {
        id: 'ds-4',
        title: 'The Movie Scene',
        emoji: '🎬',
        heat: 2,
        description: 'Cast yourselves in a movie. What genre? What scene?',
        prompt: 'You\'re both in a movie. Together, decide:\n\n1. What genre? (thriller, romance, noir, fantasy)\n2. What\'s the setting? (rooftop, train, beach at night, library)\n3. Describe THE scene — the one everyone talks about. The one that made the audience hold their breath.\n\nBe specific. Be cinematic.',
        duration: '5 min',
    },
    {
        id: 'ds-5',
        title: 'Rate & Reveal',
        emoji: '🌡️',
        heat: 3,
        description: 'Rate scenarios 1-10. Find out what lights you both up.',
        prompt: 'Both of you rate these scenarios 1-10 (privately first, then reveal):\n\n• Morning sex vs. midnight sex\n• Slow & gentle vs. fast & intense\n• In silence vs. very vocal\n• Lights on vs. lights off\n• Planned night vs. spontaneous\n\nCompare answers. The mismatches are the interesting part.',
        duration: '3 min',
    },
    {
        id: 'ds-6',
        title: 'The Time Machine',
        emoji: '⏰',
        heat: 2,
        description: 'You get one hour together, anywhere, anytime. What happens?',
        prompt: 'You have a time machine. One hour. Anywhere in the world, any time period, just the two of you. No consequences, no rules.\n\nEach of you describes:\n• Where/when do you go?\n• What are you wearing?\n• What happens in that hour?\n\nBe as detailed as you want.',
        duration: '4 min',
    },
    {
        id: 'ds-7',
        title: 'The Whisper Game',
        emoji: '🤫',
        heat: 4,
        description: 'Exchange voice notes. Whisper only.',
        prompt: 'Rules: Voice notes only. Whispering only.\n\nTake turns sending whispered voice notes to each other. Start with a compliment. Then a confession. Then a desire. Then a dare.\n\nThere\'s something about a whisper that bypasses everything rational and goes straight to the spine.',
        duration: '5 min',
    },
    {
        id: 'ds-8',
        title: 'The Menu',
        emoji: '📋',
        heat: 3,
        description: 'Design your fantasy evening like a restaurant menu.',
        prompt: 'Create a "menu" for your ideal evening together:\n\n🥂 APPETIZER (how it starts)\n🍝 FIRST COURSE (the buildup)\n🥩 MAIN COURSE (the main event)\n🍰 DESSERT (how it ends)\n🥃 NIGHTCAP (what happens after)\n\nBe creative. Be specific. This menu has no calorie limits.',
        duration: '4 min',
    },
    {
        id: 'ds-9',
        title: '5 Senses',
        emoji: '👁️',
        heat: 3,
        description: 'Describe your partner using only the five senses.',
        prompt: 'Describe your partner (or what you imagine) using each sense:\n\n👁️ SIGHT: What part of them catches your eye first?\n👂 SOUND: What sound of theirs lives in your head?\n👃 SMELL: What do they smell like (or what scent would you choose)?\n👅 TASTE: Describe a kiss with them.\n🖐️ TOUCH: Where do your hands go first?\n\nTake turns. Be vivid.',
        duration: '4 min',
    },
    {
        id: 'ds-10',
        title: 'The Auction',
        emoji: '🔨',
        heat: 2,
        description: 'Bid on experiences with fantasy currency.',
        prompt: 'You each have 100 Ember Coins. Bid on these experiences:\n\n• A 10-minute full body massage from your partner\n• They cook you dinner wearing only an apron\n• A slow dance in the living room at midnight\n• They read erotica to you out loud\n• They do anything you whisper in their ear\n• Wake up to them next to you\n\nHighest bidder wins each item. Choose wisely.',
        duration: '3 min',
    },
];

export function getDailySpark(dayOffset = 0) {
    const today = new Date();
    const dayOfYear = Math.floor(
        (today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24)
    );
    const index = (dayOfYear + dayOffset) % dailySparks.length;
    return dailySparks[index];
}

export function getRandomSpark() {
    return dailySparks[Math.floor(Math.random() * dailySparks.length)];
}
