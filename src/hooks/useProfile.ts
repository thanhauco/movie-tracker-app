import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { profileService } from '@/services/profileService'
import { toast } from 'react-hot-toast'

export function useProfile(userId: string) {
    return useQuery({
        queryKey: ['profile', userId],
        queryFn: () => profileService.getProfile(userId),
        enabled: !!userId,
    })
}

export function useUserStats(userId: string) {
    return useQuery({
        queryKey: ['profile', 'stats', userId],
        queryFn: () => profileService.getUserStats(userId),
        enabled: !!userId,
    })
}

export function useUserActivities(userId: string) {
    return useQuery({
        queryKey: ['profile', 'activities', userId],
        queryFn: () => profileService.getUserActivities(userId),
        enabled: !!userId,
    })
}

export function useUpdateProfile() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ userId, updates }: { userId: string; updates: any }) =>
            profileService.updateProfile(userId, updates),
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({ queryKey: ['profile', data.id] })
            toast.success('Profile updated')
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to update profile')
        },
    })
}

export function useUploadAvatar() {
    return useMutation({
        mutationFn: ({ userId, file }: { userId: string; file: File }) =>
            profileService.uploadAvatar(userId, file),
        onError: (error: any) => {
            toast.error(error.message || 'Failed to upload avatar')
        },
    })
}
