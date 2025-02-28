import { supabase } from '@/lib/supabase'

export const userMovieService = {
    async getUserMovie(userId: string, movieId: string) {
        const { data, error } = await supabase
            .from('user_movies')
            .select('*')
            .eq('user_id', userId)
            .eq('movie_id', movieId)
            .maybeSingle()

        if (error) throw error
        return data
    },

    async updateStatus(userId: string, movieId: string, status: 'want_to_watch' | 'watching' | 'watched' | 'dropped') {
        const { data, error } = await supabase
            .from('user_movies')
            .upsert({
                user_id: userId,
                movie_id: movieId,
                status,
                updated_at: new Date().toISOString()
            } as any)
            .select()
            .single()

        if (error) throw error

        // Log activity
        await this.logActivity(userId, movieId, status === 'watching' ? 'started_watching' : status === 'watched' ? 'finished_watching' : 'added_to_watchlist')

        return data
    },

    async updateRating(userId: string, movieId: string, rating: number) {
        const { data, error } = await supabase
            .from('user_movies')
            .upsert({
                user_id: userId,
                movie_id: movieId,
                rating,
                updated_at: new Date().toISOString()
            } as any)
            .select()
            .single()

        if (error) throw error

        // Log activity
        await this.logActivity(userId, movieId, 'rated', { rating })

        return data
    },

    async logActivity(userId: string, movieId: string, actionType: string, metadata: any = {}) {
        await (supabase.from('activities') as any).insert({
            user_id: userId,
            movie_id: movieId,
            action_type: actionType as any,
            metadata
        })
    }
}
