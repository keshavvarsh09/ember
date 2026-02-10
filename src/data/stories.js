// Interactive branching stories for Ember
// Each story is a graph of nodes with choices leading to other nodes.

export const stories = [
    {
        id: 'midnight-encounter',
        title: 'Midnight Encounter',
        subtitle: 'Two strangers. One bar. Infinite possibilities.',
        emoji: '🌙',
        heat: 3,
        duration: '8-12 min',
        tags: ['strangers', 'tension', 'first-meeting'],
        thumbnail: 'A dimly lit cocktail bar, amber light, two empty glasses',
        unlocked: true,
        nodes: {
            start: {
                id: 'start',
                text: `The bar is almost empty. Just you, the bartender polishing glasses, and the low hum of jazz floating through amber light.\n\nThen the door opens.\n\nSomeone walks in — and something shifts in the air. They don't look around the room. They look at *you*. Just for a second. Then they slide onto the stool two seats away and order something dark.\n\nThe bartender sets it down. The stranger takes a sip without breaking their quiet composure. But you notice their eyes drift back to you. A half-smile. Gone before you're sure it was real.`,
                type: 'narrative',
                choices: [
                    { id: 'c1a', text: 'Hold their gaze. Let the silence speak.', nextNode: 'eye-contact', tag: 'bold' },
                    { id: 'c1b', text: 'Slide your drink closer to them. Casual.', nextNode: 'closer', tag: 'playful' },
                    { id: 'c1c', text: '"That looks strong. Bad day or good night?"', nextNode: 'conversation', tag: 'flirty' },
                ],
            },
            'eye-contact': {
                id: 'eye-contact',
                text: `You hold their gaze. Two seconds. Three. The kind of silence that hums.\n\nThey don't look away. Instead, they tilt their head — just slightly — like they're reading something written on your skin.\n\n"You don't blink much, do you?" they say. Low voice. Almost private.\n\nThe bartender moves to the other end, suddenly very interested in inventory. It's just the two of you now, and the jazz, and the way the light turns everything golden.`,
                type: 'narrative',
                choices: [
                    { id: 'c2a', text: '"Only when there\'s something worth staring at."', nextNode: 'flirt-escalate', tag: 'bold' },
                    { id: 'c2b', text: 'Smile slowly. Let them come to you.', nextNode: 'magnetic-pull', tag: 'mysterious' },
                ],
            },
            closer: {
                id: 'closer',
                text: `You slide your glass along the bar. Not all the way. Just enough to close the distance between one seat and the next.\n\nThey glance at your glass, then at you. A real smile this time. They mirror the move — their glass now inches from yours.\n\n"Are we doing a thing?" they ask, one eyebrow raised.\n\n"We might be," you say.\n\nThe bartender refills both your drinks without being asked. Professional wingman.`,
                type: 'narrative',
                choices: [
                    { id: 'c2c', text: '"What kind of thing were you hoping for?"', nextNode: 'flirt-escalate', tag: 'direct' },
                    { id: 'c2d', text: 'Clink your glass against theirs. "To strangers."', nextNode: 'toast-moment', tag: 'charming' },
                ],
            },
            conversation: {
                id: 'conversation',
                text: `They turn to face you fully. The half-smile is back, but it's closer to a whole one now.\n\n"Good night," they say. "Getting better by the minute."\n\nThey extend a hand — not to shake. Just resting it on the bar between you. An open invitation.\n\n"I wasn't going to come out tonight," they continue. "Glad the universe had other plans."`,
                type: 'narrative',
                choices: [
                    { id: 'c2e', text: 'Touch their hand. Light. Electric.', nextNode: 'first-touch', tag: 'tender' },
                    { id: 'c2f', text: '"The universe? Or your outfit?"', nextNode: 'flirt-escalate', tag: 'witty' },
                ],
            },
            'flirt-escalate': {
                id: 'flirt-escalate',
                text: `They laugh — a real one. Not performance, not politeness. Something genuine that makes you want to hear it again.\n\n"You're dangerous," they say. But they lean closer.\n\nYou can smell them now. Something warm — cedar, vanilla, a hint of smoke. The kind of scent that makes you want to press your face into their neck and breathe.\n\nThe distance between you shrinks to something charged. Their knee brushes yours under the bar. Neither of you moves away.`,
                type: 'narrative',
                dare: {
                    text: '🔥 DARE: Tell your partner the first thing you noticed about them that made your heart race.',
                    heat: 2,
                },
                choices: [
                    { id: 'c3a', text: '"Let\'s get out of here."', nextNode: 'leave-together', tag: 'decisive' },
                    { id: 'c3b', text: '"Tell me something real. Not your name. Something real."', nextNode: 'deep-reveal', tag: 'intimate' },
                ],
            },
            'magnetic-pull': {
                id: 'magnetic-pull',
                text: `Your silence works like gravity.\n\nThey pick up their glass, stand, and take the seat right next to you. Close enough that your shoulders almost touch.\n\n"I never do this," they say quietly. "But you've got this... pull."\n\nThe word *pull* hangs in the air like smoke. You feel it too — something magnetic, inevitable. Like two comets on the same orbit.\n\nTheir hand rests next to yours on the bar. Pinky finger almost touching. Almost.`,
                type: 'narrative',
                choices: [
                    { id: 'c3c', text: 'Close the gap. Touch their finger with yours.', nextNode: 'first-touch', tag: 'tender' },
                    { id: 'c3d', text: '"Then don\'t resist it."', nextNode: 'leave-together', tag: 'bold' },
                ],
            },
            'toast-moment': {
                id: 'toast-moment',
                text: `The glasses clink — a small, intimate sound in the quiet bar.\n\n"To strangers," they echo. Then after a sip: "Though I have a feeling we won't be strangers for long."\n\nYou talk. Really talk. Not the usual small talk — you skip all of that. They tell you about the dream they had last week that they can't stop thinking about. You tell them about the song that makes your chest ache every time.\n\nAn hour passes like a minute. The bartender's started wiping down tables. You both notice, and neither wants to acknowledge what it means.`,
                type: 'narrative',
                choices: [
                    { id: 'c3e', text: '"Walk with me? The night\'s too good to end."', nextNode: 'leave-together', tag: 'romantic' },
                    { id: 'c3f', text: '"When was the last time you kissed a stranger?"', nextNode: 'kiss-question', tag: 'daring' },
                ],
            },
            'first-touch': {
                id: 'first-touch',
                text: `Your fingers touch.\n\nIt's barely anything — the lightest brush of skin against skin. But the shock of it travels up your arm and settles somewhere behind your ribs.\n\nThey inhale. You see it — the way their chest rises, the way their lips part just a fraction.\n\nNeither of you pulls away.\n\nInstead, their pinky hooks around yours. A tiny, secret gesture. The kind of thing no one else in the world would notice. But to you, right now, it's everything.`,
                type: 'narrative',
                dare: {
                    text: '🔥 DARE: Send your partner a voice note right now. Just say "I want you." Nothing else.',
                    heat: 3,
                },
                choices: [
                    { id: 'c4a', text: 'Turn their hand over. Trace a line on their palm.', nextNode: 'palm-reading', tag: 'sensual' },
                    { id: 'c4b', text: '"Your place or mine?" (say it like a joke — mean it like a promise)', nextNode: 'leave-together', tag: 'bold' },
                ],
            },
            'deep-reveal': {
                id: 'deep-reveal',
                text: `They look at you for a long moment. Deciding.\n\nThen: "I'm terrified of being ordinary. Of living a whole life and never once being someone's fever dream."\n\nThe honesty of it hits you in the chest. This stranger just handed you something raw and true.\n\nThe bar feels smaller now. Warmer. Like the walls have leaned in to listen.\n\n"Your turn," they whisper.`,
                type: 'narrative',
                dare: {
                    text: '🔥 DARE: Share with your partner one secret desire you\'ve never told anyone.',
                    heat: 3,
                },
                choices: [
                    { id: 'c4c', text: 'Tell them your truth. The real one.', nextNode: 'vulnerability', tag: 'deep' },
                    { id: 'c4d', text: 'Lean in close and whisper: "You\'re already someone\'s."', nextNode: 'leave-together', tag: 'intense' },
                ],
            },
            'kiss-question': {
                id: 'kiss-question',
                text: `They set their glass down slowly.\n\n"Are you asking... or offering?"\n\nThe question electrifies the space between you. The bartender has disappeared entirely. It's just you, them, and a decision that feels like standing at the edge of a cliff with a beautiful view.\n\nTheir eyes drop to your lips. Just for a heartbeat. But you catch it.`,
                type: 'narrative',
                choices: [
                    { id: 'c4e', text: '"Both." (And close the distance.)', nextNode: 'the-kiss', tag: 'decisive' },
                    { id: 'c4f', text: '"I don\'t kiss strangers. But I\'d make an exception."', nextNode: 'the-kiss', tag: 'playful' },
                ],
            },
            'palm-reading': {
                id: 'palm-reading',
                text: `You turn their hand gently. They let you.\n\nYou trace your fingertip along their palm — the heart line, curving deep and long. Your touch is barely there, but you can feel them respond. A tremor. A held breath.\n\n"What do you see?" they murmur.\n\n"A long night," you say. "With someone who makes you forget what time means."\n\nTheir fingers close around yours. Warm. Certain.\n\n"Then let's make time irrelevant."`,
                type: 'narrative',
                choices: [
                    { id: 'c5a', text: 'Stand up together. Leave without looking back.', nextNode: 'leave-together', tag: 'decisive' },
                ],
            },
            vulnerability: {
                id: 'vulnerability',
                text: `You tell them. The thing you don't tell people. The want that lives in the quiet part of your chest.\n\nThey listen without moving. Without judging. And when you finish, they reach out and press their palm flat against your chest.\n\n"I can feel your heartbeat," they say. "It's racing."\n\nIt is.\n\n"Mine too," they add. And they take your hand and place it over their heart. You feel it — hammering. Matching yours beat for beat.\n\nTwo hearts. Two strangers. One frequency.`,
                type: 'narrative',
                dare: {
                    text: '🔥 DARE: Put your hand on your chest. Tell your partner what your heartbeat feels like right now.',
                    heat: 2,
                },
                choices: [
                    { id: 'c5b', text: '"Come with me. Please."', nextNode: 'leave-together', tag: 'vulnerable' },
                ],
            },
            'the-kiss': {
                id: 'the-kiss',
                text: `The distance between you collapses.\n\nIt starts slow — testing, tasting. Their lips are warm and taste like whiskey and possibility. Your hand finds the back of their neck. Their fingers grip the fabric of your shirt.\n\nThe kiss deepens. It's the kind of kiss that rewrites your evening, your week, your definition of what it means to want someone.\n\nWhen you finally pull apart, you're both breathing differently.\n\n"Well," they say, voice rough. "That answered that question."`,
                type: 'narrative',
                choices: [
                    { id: 'c6a', text: '"That was just the preview."', nextNode: 'leave-together', tag: 'confident' },
                ],
            },
            'leave-together': {
                id: 'leave-together',
                text: `You step out into the night together.\n\nThe air is cool against your skin — a relief after the heat of the bar. The street is empty. Lamplight paints everything in gold and shadow.\n\nThey walk close to you. Not touching. But the gap between your bodies is charged — every inch of it alive.\n\n"Where are we going?" they ask.\n\n"Wherever this takes us."\n\nThey stop walking. Turn to face you. In the lamplight, they look like something out of a dream — all soft edges and sharp desire.\n\n"I like the sound of that," they say.\n\nAnd the night is just beginning.`,
                type: 'ending',
                ending: {
                    title: '✨ To Be Continued...',
                    subtitle: 'The night stretches ahead, full of possibility.',
                    score: 100,
                    unlocks: ['hotel-room'],
                },
                dare: {
                    text: '🔥 FINAL DARE: Tell your partner one thing you want to do to them that you\'ve been thinking about all day. Be specific.',
                    heat: 4,
                },
            },
        },
    },
    {
        id: 'hotel-room',
        title: 'Room 614',
        subtitle: 'The key card. The door. No rules tonight.',
        emoji: '🏨',
        heat: 4,
        duration: '10-15 min',
        tags: ['hotel', 'anticipation', 'escalation'],
        thumbnail: 'A hotel hallway, moody lighting, room number glowing',
        unlocked: true,
        nodes: {
            start: {
                id: 'start',
                text: `The elevator doors close. It's just the two of you.\n\nSix floors up. That's all. But the air in this small metal box has compressed into something thick and electric.\n\nThey're standing on the other side. Watching you in the mirrored wall. You can see them studying the back of your neck, your shoulders, the line of your jaw.\n\nFloor two. Three.\n\nNeither of you speaks. The silence says everything.\n\nFloor four.\n\nTheir hand moves. Slowly. Reaching for yours.`,
                type: 'narrative',
                choices: [
                    { id: 'h1a', text: 'Take their hand. Interlock fingers. Squeeze.', nextNode: 'elevator-touch', tag: 'tender' },
                    { id: 'h1b', text: 'Pin them against the elevator wall.', nextNode: 'elevator-intense', tag: 'dominant' },
                    { id: 'h1c', text: 'Hit the stop button between floors.', nextNode: 'elevator-stop', tag: 'daring' },
                ],
            },
            'elevator-touch': {
                id: 'elevator-touch',
                text: `Your fingers intertwine. Such a simple thing, but the way they grip your hand — tight, like you might disappear — makes your breath catch.\n\nFloor five.\n\nThey step closer. You feel the warmth of their body before any part of them touches you. Proximity as foreplay.\n\n"I've been thinking about this all night," they whisper. Their lips are close to your ear. You can feel each word as breath on your skin.\n\nFloor six. The doors open.\n\nThe hallway stretches ahead. Dim. Quiet. Private.\n\nRoom 614 is at the end.`,
                type: 'narrative',
                choices: [
                    { id: 'h2a', text: 'Walk there slowly. Build every second.', nextNode: 'hallway-slow', tag: 'patient' },
                    { id: 'h2b', text: 'Pull them down the hallway. Can\'t wait.', nextNode: 'hallway-rush', tag: 'urgent' },
                ],
            },
            'elevator-intense': {
                id: 'elevator-intense',
                text: `You close the distance in one step. Your hand finds the mirror behind them. They're pressed between cold glass and the heat of you.\n\nTheir eyes widen — surprised, thrilled. Their hands come up to your chest. Not pushing away. Pulling closer.\n\n"We're in an elevator," they breathe.\n\n"I noticed."\n\nTheir lips part. An invitation you don't need twice.`,
                type: 'narrative',
                dare: {
                    text: '🔥 DARE: Describe to your partner exactly how you\'d pin them. In detail.',
                    heat: 4,
                },
                choices: [
                    { id: 'h2c', text: 'Kiss them until the doors open at floor 6.', nextNode: 'hallway-rush', tag: 'passionate' },
                ],
            },
            'elevator-stop': {
                id: 'elevator-stop',
                text: `Your hand hits the emergency stop between floors. The elevator jolts. Stops. The light flickers once.\n\n"Did you just—" they start.\n\n"I need one more minute before we get to that room," you say. "Because once we're inside, I'm not going to be able to think clearly."\n\nThey stare at you. The overhead light buzzes faintly. Somewhere, an alarm might be sounding. Neither of you cares.\n\n"What did you want to say?" they ask. Voice barely above a whisper.\n\n"I wanted to say that you are the most magnetic person I've ever met. And I want you to know that before—" you gesture vaguely toward floor six "—before that."\n\nThey cross the elevator in one step and kiss you so hard the world tilts.`,
                type: 'narrative',
                dare: {
                    text: '🔥 DARE: Text your partner three words that describe how they make you feel right now.',
                    heat: 3,
                },
                choices: [
                    { id: 'h2d', text: 'Release the stop button. Floor 6. Room 614.', nextNode: 'hallway-rush', tag: 'ready' },
                ],
            },
            'hallway-slow': {
                id: 'hallway-slow',
                text: `You walk the hallway like a slow dance. Side by side. Shoulders brushing.\n\nThey stop at 612. Turn to you. "Not yet," they say, and press their back against the wall. Their eyes travel down your body — slowly, deliberately — and back up.\n\n"I want to remember this part," they say. "The part where everything is about to happen."\n\nYou stand in front of them. Not touching. Just looking. The anticipation is its own kind of pleasure — a drawn bow, a held breath, a match against the striking surface.\n\n614 is two doors away.`,
                type: 'narrative',
                choices: [
                    { id: 'h3a', text: '"The anticipation is going to k*ll me."', nextNode: 'the-door', tag: 'honest' },
                    { id: 'h3b', text: 'Trace a finger along their collarbone. "One more second."', nextNode: 'the-door', tag: 'sensual' },
                ],
            },
            'hallway-rush': {
                id: 'hallway-rush',
                text: `You move through the hallway with purpose. Maybe they're pulling you. Maybe you're pulling them. The distinction has blurred.\n\n614. There it is.\n\nYou fumble with the key card. It blinks red. They laugh — warm, real — and take it from your hand. Their fingers brush yours. The contact, after everything, makes your skin tingle.\n\nGreen light.\n\nClick.\n\nThe door is open.`,
                type: 'narrative',
                choices: [
                    { id: 'h3c', text: 'Step inside first. Lead them in.', nextNode: 'the-room', tag: 'leading' },
                    { id: 'h3d', text: 'Let them enter first. Watch them from behind.', nextNode: 'the-room', tag: 'admiring' },
                ],
            },
            'the-door': {
                id: 'the-door',
                text: `You stand in front of 614.\n\nThe key card feels heavy in your hand. Loaded. Like a trigger.\n\nThey lean against the doorframe and watch you. Patient. Present. Their mouth curves.\n\n"Once we go in," they say, "I don't want to be polite. I don't want to be careful. I want—"\n\nThey don't finish.\n\nYou swipe the card.\n\nGreen.\n\nClick.`,
                type: 'narrative',
                choices: [
                    { id: 'h4a', text: 'Push the door open. Pull them inside.', nextNode: 'the-room', tag: 'decisive' },
                ],
            },
            'the-room': {
                id: 'the-room',
                text: `The door closes behind you with a soft click that sounds like a starting gun.\n\nThe room is dark except for the city lights pouring through floor-to-ceiling windows. Everything is blue and silver and shadow.\n\nNeither of you reaches for the light switch.\n\nThey stand by the window. Silhouetted. The city spreads out behind them like a secret only you two know.\n\n"Come here," they say.\n\nTwo words. The way they say them — low, certain, wanting — makes the room feel ten degrees warmer.\n\nYou go to them. Of course you go to them.`,
                type: 'ending',
                ending: {
                    title: '🔥 The Night Unfolds...',
                    subtitle: 'What happens in Room 614 is yours to imagine — and create.',
                    score: 150,
                    unlocks: ['the-dare'],
                },
                dare: {
                    text: '🔥 FINAL DARE: You are now in your own "Room 614." Describe to your partner exactly what happens next. Take turns. One sentence each. Don\'t hold back.',
                    heat: 5,
                },
            },
        },
    },
    {
        id: 'the-dare',
        title: 'The Dare',
        subtitle: 'They dared you. You accepted. Game on.',
        emoji: '🎯',
        heat: 3,
        duration: '6-10 min',
        tags: ['dare', 'escalation', 'game-within-a-game'],
        thumbnail: 'Playing cards scattered on silk sheets, candlelight',
        unlocked: true,
        nodes: {
            start: {
                id: 'start',
                text: `"Let's play a game," they say, settling into the couch like a cat who knows it owns the house.\n\nYou raise an eyebrow. "What kind of game?"\n\n"The escalating kind." They shuffle an invisible deck. "We take turns. Each round, the dare gets... bigger. First person to back down loses."\n\n"And what does the winner get?"\n\nThey lean forward. The collar of their shirt shifts. You notice.\n\n"The winner," they say slowly, "gets to make one request. Any request. And the loser has to say yes."`,
                type: 'narrative',
                choices: [
                    { id: 'd1a', text: '"I never lose. Deal."', nextNode: 'round-1', tag: 'competitive' },
                    { id: 'd1b', text: '"That sounds... dangerous. I\'m in."', nextNode: 'round-1', tag: 'intrigued' },
                ],
            },
            'round-1': {
                id: 'round-1',
                text: `**ROUND 1**\n\nThey go first.\n\n"I dare you to look me in the eyes for 30 seconds. No talking. No laughing. No looking away."\n\nSimple, right? You lock eyes.\n\nBut 30 seconds of unbroken eye contact with someone you're attracted to is not simple. It's an archaeological dig. You see the flecks of amber in their iris. The way their pupils dilate. The micro-expressions — amusement, curiosity, desire — that flicker across their face like weather.\n\nTwenty-five. Twenty-six.\n\nYour heart is hammering.\n\nThirty.\n\n"Your turn," they breathe.`,
                type: 'narrative',
                dare: {
                    text: '🔥 REAL DARE: Do this RIGHT NOW with your partner. Video call. 30 seconds of eye contact. No words. Report back: what did you see?',
                    heat: 2,
                },
                choices: [
                    { id: 'd2a', text: '"Describe the last dream you had about someone. In detail."', nextNode: 'round-2-intimate', tag: 'intimate' },
                    { id: 'd2b', text: '"Send me a photo right now. Whatever you look like. No posing."', nextNode: 'round-2-raw', tag: 'authentic' },
                ],
            },
            'round-2-intimate': {
                id: 'round-2-intimate',
                text: `**ROUND 2**\n\nThey take a breath. Then they tell you about the dream. And it's... vivid. The kind of dream that leaves you overheated when you wake up, reaching for someone who isn't there.\n\nThey describe it without flinching. The setting. The sensation. The person — who may or may not look a lot like you.\n\nWhen they finish, the room is very quiet.\n\n"Your turn," you say. Your voice sounds different. Rougher.\n\nThey think for a moment. Then:`,
                type: 'narrative',
                choices: [
                    { id: 'd3a', text: 'Accept their dare. Whatever it is.', nextNode: 'round-3', tag: 'brave' },
                ],
            },
            'round-2-raw': {
                id: 'round-2-raw',
                text: `**ROUND 2**\n\nYou wait. Your phone buzzes. You open it.\n\nThe photo is unfiltered. Unposed. They're looking into the camera like it's a window into your room. Hair imperfect. Eyes honest. \n\nIt's the most attractive image you've ever received. Because it's *real*. No performance. Just them, as they are, at this exact moment.\n\nYou stare at it longer than you should.\n\n"Like what you see?" they ask.\n\n"You have no idea."\n\n"Good. My turn."`,
                type: 'narrative',
                dare: {
                    text: '🔥 REAL DARE: Send your partner an unfiltered, no-posing selfie right now. Just as you are.',
                    heat: 2,
                },
                choices: [
                    { id: 'd3b', text: 'Accept their dare. Bring it on.', nextNode: 'round-3', tag: 'brave' },
                ],
            },
            'round-3': {
                id: 'round-3',
                text: `**ROUND 3**\n\n"I dare you," they say, their voice dropping to that frequency that makes your spine tingle, "to tell me exactly what you want to do to me right now. Don't be vague. Don't be poetic. Be *specific*."\n\nThe dare lands like a lit match on dry wood.\n\nYou could back down. Say it's too much. Laugh it off.\n\nBut that look in their eyes — the one that's half challenge, half invitation — makes you want to burn.`,
                type: 'narrative',
                dare: {
                    text: '🔥 REAL DARE: This is your dare too. Tell your partner exactly what you want. Voice note. Be specific. Be brave.',
                    heat: 4,
                },
                choices: [
                    { id: 'd4a', text: 'Tell them. Every. Single. Detail.', nextNode: 'round-4', tag: 'explicit' },
                    { id: 'd4b', text: '"I\'ll tell you... but only in person."', nextNode: 'the-promise', tag: 'teasing' },
                ],
            },
            'round-4': {
                id: 'round-4',
                text: `**ROUND 4**\n\nYou told them. Specifically. In detail. Without wavering.\n\nThe silence that follows is thunderous.\n\nThen: "Nobody has ever said that to me before."\n\nPause.\n\n"I liked it. A lot."\n\nAnother pause. Longer.\n\n"My turn. And this one... this one you can't do through a screen."\n\nThey lean forward.\n\n"I dare you to make good on what you just said. The next time we're in the same room. First thing. No hesitation. That's my dare."`,
                type: 'ending',
                ending: {
                    title: '🎯 Game. Set. Not yet match.',
                    subtitle: 'The dare is set. The anticipation begins. And anticipation is half the pleasure.',
                    score: 120,
                    unlocks: [],
                },
                dare: {
                    text: '🔥 FINAL DARE: Set an actual dare with your partner for the next time you see each other. Write it down. Both agree to it. The countdown starts now.',
                    heat: 4,
                },
            },
            'the-promise': {
                id: 'the-promise',
                text: `"In person?" they repeat.\n\n"In person."\n\n"Is that a promise?"\n\n"That's a guarantee."\n\nThey exhale — shaky, excited. You can hear the smile in their voice even if you can't see it. The game has transcended the screen. It's in the real world now, living in the space between the next time you see each other.\n\n"Then let me make you a guarantee too," they say. And what they describe... what they promise to do when you're finally in the same room...\n\nLet's just say you won't be sleeping tonight. Not because of insomnia. Because of anticipation.`,
                type: 'ending',
                ending: {
                    title: '💫 The Promise',
                    subtitle: 'Some games don\'t end when you stop playing. Some games are just the beginning.',
                    score: 130,
                    unlocks: [],
                },
                dare: {
                    text: '🔥 FINAL DARE: Make each other a real promise. Something you\'ll do the next time you\'re together. Both of you. Write it down somewhere only you can see it.',
                    heat: 3,
                },
            },
        },
    },
];

export function getStoryById(id) {
    return stories.find((s) => s.id === id);
}

export function getStoryNode(story, nodeId) {
    return story?.nodes?.[nodeId] || null;
}

export function getAvailableStories(unlockedIds) {
    return stories.filter((s) => unlockedIds.includes(s.id));
}
