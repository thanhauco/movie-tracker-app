import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Badge } from "@/components/ui/Badge"
import { Filter } from "lucide-react"
import { useState } from "react"
import { cn } from "@/utils/cn"

const GENRES = [
    { id: '28', name: 'Action' },
    { id: '12', name: 'Adventure' },
    { id: '16', name: 'Animation' },
    { id: '35', name: 'Comedy' },
    { id: '80', name: 'Crime' },
    { id: '18', name: 'Drama' },
    { id: '14', name: 'Fantasy' },
    { id: '27', name: 'Horror' },
    { id: '878', name: 'Sci-Fi' },
    { id: '53', name: 'Thriller' },
]

const SORT_OPTIONS = [
    { id: 'popularity.desc', name: 'Most Popular' },
    { id: 'release_date.desc', name: 'Newest' },
    { id: 'vote_average.desc', name: 'Top Rated' },
    { id: 'revenue.desc', name: 'Box Office' },
]

interface MovieFiltersProps {
    onFilterChange: (filters: any) => void
    currentFilters: any
}

export function MovieFilters({ onFilterChange, currentFilters }: MovieFiltersProps) {
    const [isOpen, setIsOpen] = useState(false)

    const toggleGenre = (genreId: string) => {
        const genres = currentFilters.with_genres?.split(',') || []
        const newGenres = genres.includes(genreId)
            ? genres.filter((id: string) => id !== genreId)
            : [...genres, genreId]

        onFilterChange({
            ...currentFilters,
            with_genres: newGenres.join(','),
            page: 1
        })
    }

    const clearFilters = () => {
        onFilterChange({ page: 1 })
    }

    const hasFilters = Object.keys(currentFilters).length > 1 // more than just page

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsOpen(!isOpen)}
                    className="gap-2"
                    aria-expanded={isOpen}
                    aria-controls="movie-filters-panel"
                >
                    <Filter className="h-4 w-4" />
                    Filters
                    {hasFilters && (
                        <Badge variant="secondary" className="ml-1 px-1 h-5 min-w-[20px] flex items-center justify-center">
                            {Object.keys(currentFilters).length - 1}
                        </Badge>
                    )}
                </Button>

                {hasFilters && (
                    <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
                        Clear All
                    </Button>
                )}
            </div>

            {isOpen && (
                <div
                    id="movie-filters-panel"
                    className="p-6 rounded-xl border bg-card/50 backdrop-blur-sm space-y-8 animate-in fade-in slide-in-from-top-4 duration-300"
                    role="group"
                    aria-label="Movie discovery filters"
                >
                    {/* Sort By */}
                    <div className="space-y-3" role="group" aria-labelledby="sort-by-label">
                        <h4 id="sort-by-label" className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Sort By</h4>
                        <div className="flex flex-wrap gap-2">
                            {SORT_OPTIONS.map((opt) => (
                                <Button
                                    key={opt.id}
                                    variant={currentFilters.sort_by === opt.id ? "default" : "outline"}
                                    size="sm"
                                    className="rounded-full"
                                    onClick={() => onFilterChange({ ...currentFilters, sort_by: opt.id, page: 1 })}
                                    aria-pressed={currentFilters.sort_by === opt.id}
                                >
                                    {opt.name}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Genres */}
                    <div className="space-y-3" role="group" aria-labelledby="genres-label">
                        <h4 id="genres-label" className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Genres</h4>
                        <div className="flex flex-wrap gap-2">
                            {GENRES.map((genre) => {
                                const isSelected = currentFilters.with_genres?.split(',').includes(genre.id)
                                return (
                                    <Badge
                                        key={genre.id}
                                        variant={isSelected ? "default" : "outline"}
                                        className={cn(
                                            "px-3 py-1 cursor-pointer transition-all hover:border-primary",
                                            isSelected ? "bg-primary text-primary-foreground" : "bg-transparent text-muted-foreground"
                                        )}
                                        onClick={() => toggleGenre(genre.id)}
                                        role="checkbox"
                                        aria-checked={isSelected}
                                        tabIndex={0}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault()
                                                toggleGenre(genre.id)
                                            }
                                        }}
                                    >
                                        {genre.name}
                                    </Badge>
                                )
                            })}
                        </div>
                    </div>

                    {/* Year & Rating */}
                    <div className="grid gap-6 sm:grid-cols-2">
                        <div className="space-y-3">
                            <h4 id="year-label" className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Release Year</h4>
                            <Input
                                type="number"
                                placeholder="e.g. 2024"
                                value={currentFilters.year || ''}
                                onChange={(e) => onFilterChange({ ...currentFilters, year: e.target.value, page: 1 })}
                                className="max-w-[120px]"
                                aria-labelledby="year-label"
                            />
                        </div>
                        <div className="space-y-3">
                            <h4 id="rating-label" className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Min Rating</h4>
                            <div className="flex items-center gap-4">
                                <input
                                    type="range"
                                    min="0"
                                    max="9"
                                    step="1"
                                    value={currentFilters.vote_average_gte || 0}
                                    onChange={(e) => onFilterChange({ ...currentFilters, vote_average_gte: e.target.value, page: 1 })}
                                    className="flex-1 accent-primary"
                                    aria-labelledby="rating-label"
                                />
                                <span className="font-bold text-primary w-8" aria-live="polite">{currentFilters.vote_average_gte || 0}+</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
