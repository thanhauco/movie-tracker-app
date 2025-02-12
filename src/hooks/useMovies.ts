import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { movieService } from '@/services/movieService'
import { toast } from 'react-hot-toast'

export function useTrendingMovies(page: number = 1) {
    return useQuery({
        queryKey: ['movies', 'trending', page],
        queryFn: () => movieService.getTrending(page),
    })
}

export function useMovie(id: string) {
    return useQuery({
        queryKey: ['movies', id],
        queryFn: () => movieService.getMovieById(id),
        enabled: !!id,
    })
}

export function useSearchMovies(query: string, page: number = 1) {
    return useQuery({
        queryKey: ['movies', 'search', query, page],
        queryFn: () => movieService.searchMovies(query, page),
        enabled: !!query,
    })
}

export function useDiscoverMovies(params: {
    page?: number
    sort_by?: string
    with_genres?: string
    year?: string
    vote_average_gte?: number
}) {
    return useQuery({
        queryKey: ['movies', 'discover', params],
        queryFn: () => movieService.discoverMovies(params),
    })
}

export function useSyncMovie() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (tmdbId: number) => movieService.syncMovie(tmdbId),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['movies'] })
            toast.success(`Added ${data.title} to database`)
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to sync movie')
        },
    })
}
