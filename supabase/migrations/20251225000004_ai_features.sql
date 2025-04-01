-- Add AI-related fields to user_movies
ALTER TABLE user_movies ADD COLUMN IF NOT EXISTS review_sentiment TEXT;
ALTER TABLE user_movies ADD COLUMN IF NOT EXISTS ai_notes TEXT;

-- Create a table for AI recommendations cache
CREATE TABLE IF NOT EXISTS ai_recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    movie_id UUID REFERENCES movies(id) ON DELETE CASCADE,
    recommendation_reason TEXT,
    score FLOAT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, movie_id)
);

-- Enable RLS
ALTER TABLE ai_recommendations ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own AI recommendations"
    ON ai_recommendations FOR SELECT
    USING (auth.uid() = user_id);

-- Function to get AI-powered movie insights (placeholder for Edge Function logic)
CREATE OR REPLACE FUNCTION get_movie_ai_insights(movie_id UUID)
RETURNS JSONB AS $$
DECLARE
    avg_rating FLOAT;
    total_reviews INT;
    sentiment_summary TEXT;
BEGIN
    SELECT AVG(rating), COUNT(*) INTO avg_rating, total_reviews
    FROM user_movies
    WHERE movie_id = movie_id;

    RETURN jsonb_build_object(
        'average_rating', COALESCE(avg_rating, 0),
        'total_reviews', total_reviews,
        'ai_analysis', 'This movie is trending in your community with a generally positive sentiment.'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
