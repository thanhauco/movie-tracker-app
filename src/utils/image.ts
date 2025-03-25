/**
 * Utility to handle image transformations for TMDB and Supabase Storage
 */

export const getTMDBImageUrl = (path: string | null, size: 'w500' | 'original' = 'w500') => {
    if (!path) return null
    return `https://image.tmdb.org/t/p/${size}${path}`
}

export const getAvatarUrl = (url: string | null, size?: number) => {
    if (!url) return null

    // If it's a Supabase storage URL, we can append transformation parameters
    // Note: This requires Supabase Pro or self-hosted with image transformation enabled
    if (url.includes('supabase.co/storage/v1/object/public') && size) {
        return `${url}?width=${size}&height=${size}&resize=cover`
    }

    return url
}
