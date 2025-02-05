-- Materialized view for popular movies (based on watchlist additions and ratings)
CREATE MATERIALIZED VIEW popular_movies AS
SELECT 
    m.id,
    m.title,
    m.poster_url,
    COUNT(DISTINCT wi.id) as watchlist_count,
    AVG(um.rating) as average_rating,
    COUNT(DISTINCT um.id) as rating_count
FROM movies m
LEFT JOIN watchlist_items wi ON m.id = wi.movie_id
LEFT JOIN user_movies um ON m.id = um.movie_id
GROUP BY m.id, m.title, m.poster_url
ORDER BY watchlist_count DESC, average_rating DESC;

CREATE UNIQUE INDEX idx_popular_movies_id ON popular_movies(id);

-- Function to refresh popular movies
CREATE OR REPLACE FUNCTION refresh_popular_movies()
RETURNS trigger AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY popular_movies;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- RPC for cleaning up unused movies
CREATE OR REPLACE FUNCTION cleanup_unused_movies()
RETURNS void AS $$
BEGIN
    DELETE FROM movies
    WHERE id NOT IN (SELECT movie_id FROM watchlist_items)
    AND id NOT IN (SELECT movie_id FROM user_movies)
    AND created_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- View for user stats
CREATE OR REPLACE VIEW user_stats AS
SELECT 
    user_id,
    COUNT(*) FILTER (WHERE status = 'watched') as movies_watched,
    SUM(m.runtime) FILTER (WHERE status = 'watched') as total_runtime_minutes,
    AVG(rating) as average_rating,
    (
        SELECT genre 
        FROM (
            SELECT unnest(m2.genres) as genre, COUNT(*) as count
            FROM user_movies um2
            JOIN movies m2 ON um2.movie_id = m2.id
            WHERE um2.user_id = um.user_id AND um2.status = 'watched'
            GROUP BY genre
            ORDER BY count DESC
            LIMIT 1
        ) t
    ) as favorite_genre
FROM user_movies um
JOIN movies m ON um.movie_id = m.id
GROUP BY user_id;
