import * as React from "react"
import { useNavigate } from 'react-router-dom'
import { MovieGrid } from '@/components/movies/MovieGrid'
import { useSearchMovies, useSyncMovie, useDiscoverMovies } from '@/hooks/useMovies'
import { Input } from '@/components/ui/Input'
import { Search, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'
import { useDebounce } from '@/hooks/useDebounce'
import { AddToWatchlistModal } from '@/components/watchlists/AddToWatchlistModal'
import { Movie } from '@/types/movie'
import { MovieFilters } from '@/components/movies/MovieFilters'
import { Button } from '@/components/ui/Button'
import { AIRecommendations } from '@/components/ai/AIRecommendations'

export default function DiscoverPage() {
    const navigate = useNavigate()
    const [searchQuery, setSearchQuery] = React.useState("")
    const [selectedMovie, setSelectedMovie] = React.useState<Movie | null>(null)
    const [filters, setFilters] = React.useState<any>({ page: 1, sort_by: 'popularity.desc' })
    const debouncedSearch = useDebounce(searchQuery, 500)

    const { data: searchResults, isLoading: loadingSearch } = useSearchMovies(debouncedSearch, filters.page)
    const { data: discoverData, isLoading: loadingDiscover } = useDiscoverMovies(filters)
    const { mutateAsync: syncMovie } = useSyncMovie()

    const movies = debouncedSearch ? searchResults?.results : discoverData?.results
    const isLoading = debouncedSearch ? loadingSearch : loadingDiscover
    const totalPages = debouncedSearch ? searchResults?.total_pages : discoverData?.total_pages

    const handleAddClick = async (movie: any) => {
        const syncedMovie = await syncMovie(movie.tmdb_id)
        setSelectedMovie({
            ...syncedMovie,
            id: syncedMovie.id
        })
    }

    const handleInfoClick = async (movie: any) => {
        const syncedMovie = await syncMovie(movie.tmdb_id)
        navigate(`/movies/${syncedMovie.id}`)
    }

    const handlePageChange = (newPage: number) => {
        setFilters({ ...filters, page: newPage })
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <main className="container py-8 space-y-12">
            {!debouncedSearch && filters.page === 1 && <AIRecommendations />}

            <section className="space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">
                            {debouncedSearch ? `Search results for "${debouncedSearch}"` : "Discover Movies"}
                        </h2>
                        <p className="text-muted-foreground">
                            {debouncedSearch
                                ? `Found ${searchResults?.total_results || 0} movies`
                                : "Explore the latest and greatest in cinema."}
                        </p>
                    </div>

                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search movies..."
                            className="pl-10"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value)
                                setFilters({ ...filters, page: 1 })
                            }}
                        />
                    </div>
                </div>

                {!debouncedSearch && (
                    <MovieFilters
                        currentFilters={filters}
                        onFilterChange={setFilters}
                    />
                )}

                {isLoading ? (
                    <div className="flex min-h-[400px] items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <>
                        <MovieGrid
                            movies={movies?.map(m => ({
                                ...m,
                                id: m.tmdb_id.toString()
                            })) || []}
                            onAddClick={handleAddClick}
                            onInfoClick={handleInfoClick}
                        />

                        {/* Pagination */}
                        {totalPages && totalPages > 1 && (
                            <div className="flex items-center justify-center gap-4 pt-8">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    disabled={filters.page <= 1}
                                    onClick={() => handlePageChange(filters.page - 1)}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <span className="text-sm font-medium">
                                    Page {filters.page} of {Math.min(totalPages, 500)}
                                </span>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    disabled={filters.page >= Math.min(totalPages, 500)}
                                    onClick={() => handlePageChange(filters.page + 1)}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </section>

            {selectedMovie && (
                <AddToWatchlistModal
                    movie={selectedMovie}
                    onClose={() => setSelectedMovie(null)}
                />
            )}
        </main>
    )
}
