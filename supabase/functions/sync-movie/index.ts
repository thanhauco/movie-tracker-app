import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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
        const { tmdb_id } = await req.json()

        if (!tmdb_id) {
            return new Response(
                JSON.stringify({ error: 'tmdb_id is required' }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
            )
        }

        // Initialize Supabase client
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        // Check if movie already exists in our DB
        const { data: existingMovie } = await supabaseClient
            .from('movies')
            .select('*')
            .eq('tmdb_id', tmdb_id)
            .maybeSingle()

        if (existingMovie) {
            return new Response(
                JSON.stringify(existingMovie),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
            )
        }

        // Fetch from TMDB
        const response = await fetch(
            `${TMDB_BASE_URL}/movie/${tmdb_id}?api_key=${TMDB_API_KEY}&append_to_response=credits`
        )

        if (!response.ok) {
            throw new Error('Failed to fetch from TMDB')
        }

        const m = await response.json()

        // Insert into our DB
        const { data: newMovie, error: insertError } = await supabaseClient
            .from('movies')
            .insert({
                tmdb_id: m.id,
                title: m.title,
                poster_url: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : null,
                release_date: m.release_date,
                genres: m.genres.map((g: any) => g.name),
                runtime: m.runtime,
                overview: m.overview
            })
            .select()
            .single()

        if (insertError) throw insertError

        return new Response(
            JSON.stringify(newMovie),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        )
    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
    }
})
