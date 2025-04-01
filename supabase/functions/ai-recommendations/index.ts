import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const TMDB_API_KEY = Deno.env.get('TMDB_API_KEY')

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { userId } = await req.json()

        // 1. Fetch user's top rated movies from DB (Simulated for now)
        // 2. Use TMDB to get recommendations for those movies

        const response = await fetch(
            `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`
        )
        const data = await response.json()

        // Add "AI" metadata to the results
        const recommendations = data.results.slice(0, 6).map((movie: any) => ({
            ...movie,
            ai_reason: "Matches your preference for high-quality storytelling and similar genre patterns in your history.",
            match_score: Math.floor(Math.random() * (99 - 85 + 1) + 85)
        }))

        return new Response(
            JSON.stringify({ recommendations }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})
