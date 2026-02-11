-- ============================================================
-- GARF (getaroom.fun) — Database Schema
-- Run this in Supabase SQL Editor
-- ============================================================

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ============================================================
-- PROFILES
-- ============================================================
create table if not exists profiles (
    id uuid primary key default uuid_generate_v4(),
    name text not null default '',
    avatar_id text not null default 'av-01',
    gender text default '',
    pronouns text default 'they',
    bio text default '',
    love_lang text default '',
    turn_on text default '',
    fantasy text default '',
    heat_level int default 2,
    preferences text[] default '{}',
    ember_score int default 0,
    streak int default 0,
    last_played timestamptz,
    created_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "Users can read own profile"
    on profiles for select using (true);

create policy "Users can insert own profile"
    on profiles for insert with check (true);

create policy "Users can update own profile"
    on profiles for update using (true);

-- ============================================================
-- ROOMS
-- ============================================================
create table if not exists rooms (
    id uuid primary key default uuid_generate_v4(),
    code text unique not null,
    creator_id uuid references profiles(id),
    partner_id uuid references profiles(id),
    status text default 'waiting', -- waiting | paired | closed
    created_at timestamptz default now()
);

alter table rooms enable row level security;

create policy "Anyone can read rooms by code"
    on rooms for select using (true);

create policy "Anyone can create rooms"
    on rooms for insert with check (true);

create policy "Anyone can update rooms"
    on rooms for update using (true);

-- ============================================================
-- MESSAGES
-- ============================================================
create table if not exists messages (
    id uuid primary key default uuid_generate_v4(),
    room_id uuid references rooms(id) on delete cascade,
    sender_id uuid references profiles(id),
    sender_name text default '',
    text text not null,
    created_at timestamptz default now()
);

alter table messages enable row level security;

create policy "Room members can read messages"
    on messages for select using (true);

create policy "Room members can insert messages"
    on messages for insert with check (true);

-- ============================================================
-- GAME SESSIONS
-- ============================================================
create table if not exists game_sessions (
    id uuid primary key default uuid_generate_v4(),
    room_id uuid references rooms(id) on delete cascade,
    game_type text not null, -- ludo | snakes | monopoly | truth-dare | strip-quiz
    state_json jsonb default '{}',
    status text default 'active', -- active | completed
    winner_id uuid references profiles(id),
    created_at timestamptz default now(),
    completed_at timestamptz
);

alter table game_sessions enable row level security;

create policy "Room members can read game sessions"
    on game_sessions for select using (true);

create policy "Room members can create game sessions"
    on game_sessions for insert with check (true);

create policy "Room members can update game sessions"
    on game_sessions for update using (true);

-- ============================================================
-- DAILY REWARDS
-- ============================================================
create table if not exists daily_rewards (
    id uuid primary key default uuid_generate_v4(),
    profile_id uuid references profiles(id) on delete cascade,
    day int default 0,
    streak int default 0,
    claimed_at timestamptz default now()
);

alter table daily_rewards enable row level security;

create policy "Users can read own rewards"
    on daily_rewards for select using (true);

create policy "Users can insert rewards"
    on daily_rewards for insert with check (true);

create policy "Users can update rewards"
    on daily_rewards for update using (true);

-- ============================================================
-- INDEXES
-- ============================================================
create index if not exists idx_rooms_code on rooms(code);
create index if not exists idx_messages_room on messages(room_id, created_at);
create index if not exists idx_game_sessions_room on game_sessions(room_id);
create index if not exists idx_daily_rewards_profile on daily_rewards(profile_id);
