import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isConfigured = supabaseUrl && supabaseAnonKey && supabaseAnonKey !== 'YOUR_ANON_KEY_HERE';

if (!isConfigured) {
    console.warn('GARF: Missing or invalid Supabase credentials. App running in offline/demo mode.');
}

let client;

try {
    if (isConfigured) {
        client = createClient(supabaseUrl, supabaseAnonKey);
    } else {
        // Mock client to prevent white-screen crash
        // Mock client helper for chaining
        const createMockBuilder = () => {
            const builder = {
                select: () => builder,
                insert: () => builder,
                update: () => builder,
                eq: () => builder,
                single: async () => ({ data: null, error: { message: 'Offline mode: No Supabase credentials in .env' } }),
                then: (resolve) => resolve({ data: null, error: { message: 'Offline mode' } }), // Make it awaitable
            };
            return builder;
        };

        client = {
            from: () => createMockBuilder(),
            channel: () => ({
                on: () => ({ subscribe: () => { } }),
                subscribe: () => { },
                send: () => { },
                track: () => { },
                unsubscribe: () => { },
            }),
            removeChannel: () => { },
        };
    }
} catch (e) {
    console.error('GARF: Fatal Supabase init error:', e);
    client = null;
}

export const supabase = client;
