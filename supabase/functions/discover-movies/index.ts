import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const TMDB_API_KEY = Deno.env.get('TMDB_API_KEY')
const TMDB_BASE_URL = 'https://api.themoviedb.org/3'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const url = new URL(req.url)
        const page = url.searchParams.get('page') || '1'
        const sortBy = url.searchParams.get('sort_by') || 'popularity.desc'
        const withGenres = url.searchParams.get('with_genres')
        const year = url.searchParams.get('year')
        const voteAverageGte = url.searchParams.get('vote_average_gte')

        let tmdbUrl = `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&page=${page}&sort_by=${sortBy}&include_adult=false`

        if (withGenres) tmdbUrl += `&with_genres=${withGenres}`
        if (year) tmdbUrl += `&primary_release_year=${year}`
        if (voteAverageGte) tmdbUrl += `&vote_average.gte=${voteAverageGte}`

        const response = await fetch(tmdbUrl)
        const data = await response.json()

        const results = data.results.map((m: any) => ({
            tmdb_id: m.id,
            title: m.title,
            poster_url: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : null,
            release_date: m.release_date,
            vote_average: m.vote_average,
            overview: m.overview
        }))

        return new Response(
            JSON.stringify({
                results,
                total_pages: data.total_pages,
                total_results: data.total_results,
                page: data.page
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        )
    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
    }
})
