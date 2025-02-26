import { supabase } from '@/lib/supabase'
import { Database } from '@/types/supabase'

type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export const profileService = {
    async getProfile(id: string) {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', id)
            .single()

        if (error) throw error
        return data
    },

    async updateProfile(id: string, updates: ProfileUpdate) {
        const { data, error } = await (supabase
            .from('profiles') as any)
            .update(updates)
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        return data
    },

    async getUserStats(userId: string) {
        const [statsRes, followersRes, followingRes] = await Promise.all([
            supabase.from('user_stats').select('*').eq('user_id', userId).maybeSingle(),
            supabase.from('follows').select('*', { count: 'exact', head: true }).eq('following_id', userId),
            supabase.from('follows').select('*', { count: 'exact', head: true }).eq('follower_id', userId)
        ])

        const stats = statsRes.data || {
            user_id: userId,
            total_movies: 0,
            watched_count: 0,
            average_rating: 0,
            watchlist_count: 0
        }

        return {
            ...stats,
            followers_count: followersRes.count || 0,
            following_count: followingRes.count || 0
        }
    },

    async getUserActivities(userId: string) {
        const { data, error } = await supabase
            .from('activities')
            .select(`
        *,
        movies (*)
      `)
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(10)

        if (error) throw error
        return data
    },

    async uploadAvatar(userId: string, file: File) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${userId}-${Math.random()}.${fileExt}`
        const filePath = `avatars/${fileName}`

        const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, file)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
            .from('avatars')
            .getPublicUrl(filePath)

        return publicUrl
    }
}
