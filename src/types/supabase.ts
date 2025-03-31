export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    username: string | null
                    avatar_url: string | null
                    preferences: Json
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    username?: string | null
                    avatar_url?: string | null
                    preferences?: Json
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    username?: string | null
                    avatar_url?: string | null
                    preferences?: Json
                    created_at?: string
                    updated_at?: string
                }
            }
            movies: {
                Row: {
                    id: string
                    tmdb_id: number
                    title: string
                    poster_url: string | null
                    release_date: string | null
                    genres: string[] | null
                    runtime: number | null
                    overview: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    tmdb_id: number
                    title: string
                    poster_url?: string | null
                    release_date?: string | null
                    genres?: string[] | null
                    runtime?: number | null
                    overview?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    tmdb_id?: number
                    title?: string
                    poster_url?: string | null
                    release_date?: string | null
                    genres?: string[] | null
                    runtime?: number | null
                    overview?: string | null
                    created_at?: string
                }
            }
            watchlists: {
                Row: {
                    id: string
                    user_id: string
                    name: string
                    description: string | null
                    is_public: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    name: string
                    description?: string | null
                    is_public?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    name?: string
                    description?: string | null
                    is_public?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            watchlist_items: {
                Row: {
                    id: string
                    watchlist_id: string
                    movie_id: string
                    added_at: string
                    notes: string | null
                    priority: number
                }
                Insert: {
                    id?: string
                    watchlist_id: string
                    movie_id: string
                    added_at?: string
                    notes?: string | null
                    priority?: number
                }
                Update: {
                    id?: string
                    watchlist_id?: string
                    movie_id?: string
                    added_at?: string
                    notes?: string | null
                    priority?: number
                }
            }
            user_movies: {
                Row: {
                    id: string
                    user_id: string
                    movie_id: string
                    status: 'want_to_watch' | 'watching' | 'watched' | 'dropped'
                    rating: number | null
                    review: string | null
                    watched_at: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    movie_id: string
                    status?: 'want_to_watch' | 'watching' | 'watched' | 'dropped'
                    rating?: number | null
                    review?: string | null
                    watched_at?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    movie_id?: string
                    status?: 'want_to_watch' | 'watching' | 'watched' | 'dropped'
                    rating?: number | null
                    review?: string | null
                    watched_at?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            follows: {
                Row: {
                    follower_id: string
                    following_id: string
                    created_at: string
                }
                Insert: {
                    follower_id: string
                    following_id: string
                    created_at?: string
                }
                Update: {
                    follower_id?: string
                    following_id?: string
                    created_at?: string
                }
            }
            activities: {
                Row: {
                    id: string
                    user_id: string
                    action_type: 'rated' | 'reviewed' | 'added_to_watchlist' | 'started_watching' | 'finished_watching'
                    movie_id: string | null
                    metadata: Json
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    action_type: 'rated' | 'reviewed' | 'added_to_watchlist' | 'started_watching' | 'finished_watching'
                    movie_id?: string | null
                    metadata?: Json
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    action_type?: 'rated' | 'reviewed' | 'added_to_watchlist' | 'started_watching' | 'finished_watching'
                    movie_id?: string | null
                    metadata?: Json
                    created_at?: string
                }
            }
        }
        Views: {
            user_stats: {
                Row: {
                    user_id: string
                    total_movies: number
                    watched_count: number
                    average_rating: number
                    watchlist_count: number
                }
            }
        }
    }
}
