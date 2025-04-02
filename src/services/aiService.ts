import { supabase } from '@/lib/supabase'

export const aiService = {
    async getAssistantResponse(prompt: string, context?: any) {
        const { data, error } = await supabase.functions.invoke('ai-assistant', {
            body: { prompt, context }
        })

        if (error) throw error
        return data.response
    },

    async getAIRecommendations(userId: string) {
        const { data, error } = await supabase.functions.invoke('ai-recommendations', {
            body: { userId }
        })

        if (error) throw error
        return data.recommendations
    },

    async analyzeSentiment(review: string) {
        // This would call an Edge Function, but for demo we'll do simple logic
        const positiveWords = ['great', 'amazing', 'love', 'excellent', 'best', 'masterpiece']
        const negativeWords = ['bad', 'boring', 'awful', 'worst', 'waste', 'disappointing']

        const lowerReview = review.toLowerCase()
        let score = 0

        positiveWords.forEach(word => { if (lowerReview.includes(word)) score++ })
        negativeWords.forEach(word => { if (lowerReview.includes(word)) score-- })

        if (score > 0) return 'positive'
        if (score < 0) return 'negative'
        return 'neutral'
    }
}
