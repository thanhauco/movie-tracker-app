import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { watchlistService } from '@/services/watchlistService'
import { toast } from 'react-hot-toast'

export function useMyWatchlists() {
    return useQuery({
        queryKey: ['watchlists'],
        queryFn: () => watchlistService.getMyWatchlists(),
    })
}

export function useWatchlist(id: string) {
    return useQuery({
        queryKey: ['watchlists', id],
        queryFn: () => watchlistService.getWatchlistById(id),
        enabled: !!id,
    })
}

export function useCreateWatchlist() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (watchlist: any) => watchlistService.createWatchlist(watchlist),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['watchlists'] })
            toast.success('Watchlist created')
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to create watchlist')
        },
    })
}

export function useAddToWatchlist() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ watchlistId, movieId, notes }: { watchlistId: string, movieId: string, notes?: string }) =>
            watchlistService.addMovieToWatchlist(watchlistId, movieId, notes),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['watchlists'] })
            toast.success('Added to watchlist')
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to add movie to watchlist')
        },
    })
}

export function useRemoveFromWatchlist() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ watchlistId, movieId }: { watchlistId: string, movieId: string }) =>
            watchlistService.removeMovieFromWatchlist(watchlistId, movieId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['watchlists'] })
            queryClient.invalidateQueries({ queryKey: ['watchlists', variables.watchlistId] })
            toast.success('Removed from watchlist')
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to remove movie from watchlist')
        },
    })
}

export function useReorderWatchlistItems() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ watchlistId, items }: { watchlistId: string; items: { id: string; priority: number }[] }) =>
            watchlistService.reorderWatchlistItems(watchlistId, items),
        onMutate: async ({ watchlistId, items }) => {
            await queryClient.cancelQueries({ queryKey: ['watchlists', watchlistId] })
            const previousWatchlist = queryClient.getQueryData(['watchlists', watchlistId])

            queryClient.setQueryData(['watchlists', watchlistId], (old: any) => {
                if (!old) return old
                const newItems = [...old.items].sort((a, b) => {
                    const itemA = items.find(i => i.id === a.id)
                    const itemB = items.find(i => i.id === b.id)
                    if (itemA && itemB) return itemA.priority - itemB.priority
                    return 0
                })
                return { ...old, items: newItems }
            })

            return { previousWatchlist }
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['watchlists', variables.watchlistId] })
        },
        onError: (error: any, variables, context) => {
            if (context?.previousWatchlist) {
                queryClient.setQueryData(['watchlists', variables.watchlistId], context.previousWatchlist)
            }
            toast.error(error.message || 'Failed to reorder items')
        },
    })
}
