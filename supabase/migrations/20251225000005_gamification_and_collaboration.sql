-- Gamification: XP and Levels
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS xp INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1;

-- Achievements Table
CREATE TABLE IF NOT EXISTS achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    icon_url TEXT,
    xp_reward INTEGER DEFAULT 100,
    criteria_type TEXT NOT NULL, -- 'movies_watched', 'ratings_given', 'watchlists_created'
    criteria_value INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Achievements
CREATE TABLE IF NOT EXISTS user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
    earned_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

-- Collaborative Watchlists
CREATE TABLE IF NOT EXISTS watchlist_collaborators (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    watchlist_id UUID REFERENCES watchlists(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'editor', -- 'editor', 'viewer'
    invited_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(watchlist_id, user_id)
);

-- Enable RLS
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE watchlist_collaborators ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Achievements are public" ON achievements FOR SELECT USING (true);
CREATE POLICY "Users can view their own achievements" ON user_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Collaborators can view their watchlists" ON watchlist_collaborators FOR SELECT USING (auth.uid() = user_id);

-- Seed some achievements
INSERT INTO achievements (name, description, criteria_type, criteria_value, xp_reward) VALUES
('Cinephile Beginner', 'Watch 10 movies', 'movies_watched', 10, 500),
('Critic in the Making', 'Rate 20 movies', 'ratings_given', 20, 1000),
('Curator', 'Create 5 watchlists', 'watchlists_created', 5, 750)
ON CONFLICT DO NOTHING;
