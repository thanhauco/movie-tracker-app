export interface Movie {
    id: string
    tmdb_id: number
    title: string
    poster_url: string | null
    release_date: string | null
    genres?: string[]
    runtime?: number
    overview?: string
    vote_average?: number
}

export interface MovieSearchResult {
    tmdb_id: number
    title: string
    poster_url: string | null
    release_date: string | null
    vote_average: number
}
