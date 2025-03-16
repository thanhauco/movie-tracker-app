import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { socialService } from '@/services/socialService'
import { toast } from 'react-hot-toast'

export function useFollowStatus(followerId: string, followingId: string) {
    return useQuery({
        queryKey: ['social', 'follow-status', followerId, followingId],
        queryFn: () => socialService.isFollowing(followerId, followingId),
        enabled: !!followerId && !!followingId,
    })
}

export function useFollowUser() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ followerId, followingId }: { followerId: string; followingId: string }) =>
            socialService.followUser(followerId, followingId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['social', 'follow-status', variables.followerId, variables.followingId] })
            queryClient.invalidateQueries({ queryKey: ['profile', 'stats', variables.followingId] })
            toast.success('Following user')
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to follow user')
        },
    })
}

export function useUnfollowUser() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ followerId, followingId }: { followerId: string; followingId: string }) =>
            socialService.unfollowUser(followerId, followingId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['social', 'follow-status', variables.followerId, variables.followingId] })
            queryClient.invalidateQueries({ queryKey: ['profile', 'stats', variables.followingId] })
            toast.success('Unfollowed user')
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to unfollow user')
        },
    })
}

export function useUserSearch(query: string) {
    return useQuery({
        queryKey: ['social', 'search', query],
        queryFn: () => socialService.searchUsers(query),
        enabled: query.length >= 2,
    })
}

export function useGlobalActivity() {
    return useQuery({
        queryKey: ['social', 'global-activity'],
        queryFn: () => socialService.getGlobalActivity(),
    })
}
