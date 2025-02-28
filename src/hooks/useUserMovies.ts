import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userMovieService } from '@/services/userMovieService'
import { toast } from 'react-hot-toast'
import { Database } from '@/types/supabase'

type Status = Database['public']['Tables']['user_movies']['Row']['status']

export function useUserMovie(userId: string, movieId: string) {
    return useQuery({
        queryKey: ['user_movies', userId, movieId],
        queryFn: () => userMovieService.getUserMovie(userId, movieId),
        enabled: !!userId && !!movieId,
    })
}

export function useUpdateMovieStatus() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ userId, movieId, status }: { userId: string; movieId: string; status: Status }) =>
            userMovieService.updateStatus(userId, movieId, status),
        onMutate: async (newStatus) => {
            // Cancel any outgoing refetches
            await queryClient.cancelQueries({ queryKey: ['user_movies', newStatus.userId, newStatus.movieId] })

            // Snapshot the previous value
            const previousUserMovie = queryClient.getQueryData(['user_movies', newStatus.userId, newStatus.movieId])

            // Optimistically update to the new value
            queryClient.setQueryData(['user_movies', newStatus.userId, newStatus.movieId], (old: any) => ({
                ...old,
                status: newStatus.status,
            }))

            return { previousUserMovie }
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['user_movies', variables.userId, variables.movieId] })
            queryClient.invalidateQueries({ queryKey: ['profile', 'stats', variables.userId] })
            queryClient.invalidateQueries({ queryKey: ['profile', 'activities', variables.userId] })
            toast.success(`Status updated to ${variables.status.replace('_', ' ')}`)
        },
        onError: (error: any, variables, context) => {
            // Rollback to the previous value
            if (context?.previousUserMovie) {
                queryClient.setQueryData(
                    ['user_movies', variables.userId, variables.movieId],
                    context.previousUserMovie
                )
            }
            toast.error(error.message || 'Failed to update status')
        },
    })
}

export function useUpdateMovieRating() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ userId, movieId, rating }: { userId: string; movieId: string; rating: number }) =>
            userMovieService.updateRating(userId, movieId, rating),
        onMutate: async (newRating) => {
            // Cancel any outgoing refetches
            await queryClient.cancelQueries({ queryKey: ['user_movies', newRating.userId, newRating.movieId] })

            // Snapshot the previous value
            const previousUserMovie = queryClient.getQueryData(['user_movies', newRating.userId, newRating.movieId])

            // Optimistically update to the new value
            queryClient.setQueryData(['user_movies', newRating.userId, newRating.movieId], (old: any) => ({
                ...old,
                rating: newRating.rating,
            }))

            return { previousUserMovie }
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['user_movies', variables.userId, variables.movieId] })
            queryClient.invalidateQueries({ queryKey: ['profile', 'stats', variables.userId] })
            queryClient.invalidateQueries({ queryKey: ['profile', 'activities', variables.userId] })
            toast.success(`Rated ${variables.rating} stars`)
        },
        onError: (error: any, variables, context) => {
            // Rollback to the previous value
            if (context?.previousUserMovie) {
                queryClient.setQueryData(
                    ['user_movies', variables.userId, variables.movieId],
                    context.previousUserMovie
                )
            }
            toast.error(error.message || 'Failed to update rating')
        },
    })
}
