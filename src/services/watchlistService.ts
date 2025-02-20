import { supabase } from '@/lib/supabase'

export const watchlistService = {
    async getMyWatchlists() {
        const { data, error } = await supabase
            .from('watchlists')
            .select(`
                *,
                items:watchlist_items(count)
            `)
            .order('created_at', { ascending: false })

        if (error) throw error
        return (data as any[]).map(w => ({
            ...w,
            item_count: w.items[0]?.count || 0
        }))
    },

    async getWatchlistById(id: string) {
        const { data, error } = await supabase
            .from('watchlists')
            .select(`
                *,
                items:watchlist_items(
                    id,
                    notes,
                    priority,
                    movie:movies(*)
                )
            `)
            .eq('id', id)
            .single()

        if (error) throw error
        return data as any
    },

    async createWatchlist(watchlist: { name: string; description?: string; is_public?: boolean }) {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('User not authenticated')

        const { data, error } = await (supabase.from('watchlists') as any).insert({
            ...watchlist,
            user_id: user.id
        }).select().single()

        if (error) throw error
        return data
    },

    async updateWatchlist(id: string, updates: { name?: string; description?: string; is_public?: boolean }) {
        const { data, error } = await (supabase.from('watchlists') as any)
            .update(updates)
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        return data
    },

    async deleteWatchlist(id: string) {
        const { error } = await supabase
            .from('watchlists')
            .delete()
            .eq('id', id)

        if (error) throw error
    },

    async addMovieToWatchlist(watchlistId: string, movieId: string, notes?: string) {
        const { data, error } = await (supabase.from('watchlist_items') as any).insert({
            watchlist_id: watchlistId,
            movie_id: movieId,
            notes
        }).select().single()

        if (error) throw error
        return data
    },

    async removeMovieFromWatchlist(watchlistId: string, movieId: string) {
        const { error } = await supabase
            .from('watchlist_items')
            .delete()
            .eq('watchlist_id', watchlistId)
            .eq('movie_id', movieId)

        if (error) throw error
    },

    async reorderWatchlistItems(watchlistId: string, items: { id: string; priority: number }[]) {
        const { error } = await (supabase.from('watchlist_items') as any).upsert(
            items.map(item => ({
                id: item.id,
                watchlist_id: watchlistId,
                priority: item.priority
            }))
        )

        if (error) throw error
    }
}
