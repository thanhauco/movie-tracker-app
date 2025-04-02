import { useQuery, useMutation } from '@tanstack/react-query'
import { aiService } from '@/services/aiService'

export function useAIRecommendations(userId: string) {
    return useQuery({
        queryKey: ['ai-recommendations', userId],
        queryFn: () => aiService.getAIRecommendations(userId),
        enabled: !!userId,
        staleTime: 1000 * 60 * 30, // 30 minutes
    })
}

export function useAIAssistant() {
    return useMutation({
        mutationFn: ({ prompt, context }: { prompt: string, context?: any }) =>
            aiService.getAssistantResponse(prompt, context)
    })
}
