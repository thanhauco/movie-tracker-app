import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { prompt, context } = await req.json()

        // In a real app, you would call OpenAI/Anthropic here.
        // For this demo, we'll simulate an AI response based on the movie context.

        let response = ""
        const lowerPrompt = prompt.toLowerCase()

        if (lowerPrompt.includes("recommend") || lowerPrompt.includes("suggest")) {
            response = "Based on your interest in cinematic masterpieces, I recommend checking out 'Inception' or 'The Shawshank Redemption'. They align with your high ratings for drama and sci-fi."
        } else if (lowerPrompt.includes("hello") || lowerPrompt.includes("hi")) {
            response = "Hello! I'm your Cinematic Assistant. I can help you find movies, analyze your watch history, or give you trivia about your favorite films. What's on your mind today?"
        } else if (context?.movieTitle) {
            response = `Regarding '${context.movieTitle}', it's a fascinating film. Did you know it was praised for its innovative direction and powerful performances? Most users who liked this also enjoyed similar titles in the same genre.`
        } else {
            response = "That's an interesting question! As an AI trained on millions of movie data points, I can tell you that the film industry is constantly evolving. Would you like to explore some trending titles?"
        }

        return new Response(
            JSON.stringify({ response }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})
