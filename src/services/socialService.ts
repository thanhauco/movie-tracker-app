import { supabase } from '@/lib/supabase'

export const socialService = {
    async followUser(followerId: string, followingId: string) {
        const { data, error } = await (supabase
            .from('follows') as any)
            .insert({
                follower_id: followerId,
                following_id: followingId
            })
            .select()
            .single()

        if (error) throw error
        return data
    },

    async unfollowUser(followerId: string, followingId: string) {
        const { error } = await supabase
            .from('follows')
            .delete()
            .eq('follower_id', followerId)
            .eq('following_id', followingId)

        if (error) throw error
    },

    async isFollowing(followerId: string, followingId: string) {
        const { data, error } = await supabase
            .from('follows')
            .select('*')
            .eq('follower_id', followerId)
            .eq('following_id', followingId)
            .maybeSingle()

        if (error) throw error
        return !!data
    },

    async getFollowers(userId: string) {
        const { data, error } = await (supabase
            .from('follows') as any)
            .select(`
        follower_id,
        profiles!follows_follower_id_fkey (*)
      `)
            .eq('following_id', userId)

        if (error) throw error
        return (data as any[]).map(f => f.profiles)
    },

    async getFollowing(userId: string) {
        const { data, error } = await (supabase
            .from('follows') as any)
            .select(`
        following_id,
        profiles!follows_following_id_fkey (*)
      `)
            .eq('follower_id', userId)

        if (error) throw error
        return (data as any[]).map(f => f.profiles)
    },

    async searchUsers(query: string) {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .ilike('username', `%${query}%`)
            .limit(10)

        if (error) throw error
        return data
    },

    async getGlobalActivity() {
        const { data, error } = await (supabase
            .from('activities') as any)
            .select(`
        *,
        profiles (*),
        movies (*)
      `)
            .order('created_at', { ascending: false })
            .limit(50)

        if (error) throw error
        return data
    }
}
