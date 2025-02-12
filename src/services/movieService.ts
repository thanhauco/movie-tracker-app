import { supabase } from '@/lib/supabase'
import { Movie, MovieSearchResult } from '@/types/movie'

export const movieService = {
    /**
     * Search for movies using the TMDB proxy edge function
     */
    async searchMovies(query: string, page: number = 1): Promise<{
        results: MovieSearchResult[]
        total_pages: number
        total_results: number
        page: number
    }> {
        const { data, error } = await supabase.functions.invoke(`search-movies?query=${encodeURIComponent(query)}&page=${page}`, {
            method: 'GET',
        })

        if (error) throw error
        return data
    },

    /**
     * Sync a movie from TMDB to our database using the sync-movie edge function
     */
    async syncMovie(tmdbId: number): Promise<Movie> {
        const { data, error } = await supabase.functions.invoke('sync-movie', {
            body: { tmdb_id: tmdbId },
        })

        if (error) throw error
        return data
    },

    /**
     * Discover movies with filters
     */
    async discoverMovies(params: {
        page?: number
        sort_by?: string
        with_genres?: string
        year?: string
        vote_average_gte?: number
    }): Promise<{
        results: MovieSearchResult[]
        total_pages: number
        total_results: number
        page: number
    }> {
        const queryParams = new URLSearchParams()
        if (params.page) queryParams.append('page', params.page.toString())
        if (params.sort_by) queryParams.append('sort_by', params.sort_by)
        if (params.with_genres) queryParams.append('with_genres', params.with_genres)
        if (params.year) queryParams.append('year', params.year)
        if (params.vote_average_gte) queryParams.append('vote_average_gte', params.vote_average_gte.toString())

        const { data, error } = await supabase.functions.invoke(`discover-movies?${queryParams.toString()}`, {
            method: 'GET',
        })

        if (error) throw error
        return data
    },

    /**
     * Get trending movies using the discover endpoint
     */
    async getTrending(page: number = 1): Promise<MovieSearchResult[]> {
        const { results } = await this.discoverMovies({ page, sort_by: 'popularity.desc' })
        return results
    },

    /**
     * Get movie details from our database
     */
    async getMovieById(id: string): Promise<Movie | null> {
        const { data, error } = await supabase
            .from('movies')
            .select('*')
            .eq('id', id)
            .single()

        if (error) return null
        return data
    }
}
