import * as React from "react"
import { motion } from "framer-motion"
import { Star, Plus, Info } from "lucide-react"
import { Movie } from "@/types/movie"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { cn } from "@/utils/cn"

interface MovieCardProps {
    movie: Movie
    onAddClick?: (movie: Movie) => void
    onInfoClick?: (movie: Movie) => void
    className?: string
}

export function MovieCard({ movie, onAddClick, onInfoClick, className }: MovieCardProps) {
    const year = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
            className={cn(
                "group relative flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:shadow-xl hover:shadow-primary/10",
                className
            )}
        >
            {/* Poster Image */}
            <div className="relative aspect-[2/3] overflow-hidden bg-muted">
                {movie.poster_url ? (
                    <img
                        src={movie.poster_url}
                        alt={movie.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                        No Poster
                    </div>
                )}

                {/* Overlay Actions */}
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-background/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <Button
                        size="icon"
                        variant="secondary"
                        className="h-10 w-10 rounded-full"
                        onClick={() => onAddClick?.(movie)}
                        title="Add to Watchlist"
                    >
                        <Plus className="h-5 w-5" />
                    </Button>
                    <Button
                        size="icon"
                        variant="secondary"
                        className="h-10 w-10 rounded-full"
                        onClick={() => onInfoClick?.(movie)}
                        title="View Details"
                    >
                        <Info className="h-5 w-5" />
                    </Button>
                </div>

                {/* Rating Badge */}
                {movie.vote_average !== undefined && (
                    <div className="absolute left-2 top-2">
                        <Badge variant="secondary" className="flex items-center gap-1 bg-background/80 backdrop-blur-md">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            {movie.vote_average.toFixed(1)}
                        </Badge>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col p-3">
                <h3 className="line-clamp-1 font-bold leading-tight group-hover:text-primary transition-colors">
                    {movie.title}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                    {year}
                </p>
            </div>
        </motion.div>
    )
}
