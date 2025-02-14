import { Movie } from "@/types/movie"
import { MovieCard } from "./MovieCard"
import { cn } from "@/utils/cn"

interface MovieGridProps {
    movies: Movie[]
    onAddClick?: (movie: Movie) => void
    onInfoClick?: (movie: Movie) => void
    className?: string
}

export function MovieGrid({ movies, onAddClick, onInfoClick, className }: MovieGridProps) {
    if (movies.length === 0) {
        return (
            <div className="flex min-h-[200px] items-center justify-center rounded-xl border border-dashed border-muted text-muted-foreground">
                No movies found.
            </div>
        )
    }

    return (
        <div
            className={cn(
                "grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6",
                className
            )}
        >
            {movies.map((movie) => (
                <MovieCard
                    key={movie.tmdb_id || movie.id}
                    movie={movie}
                    onAddClick={onAddClick}
                    onInfoClick={onInfoClick}
                />
            ))}
        </div>
    )
}
