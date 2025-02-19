import { useParams, Link } from "react-router-dom"
import { useMovie } from "@/hooks/useMovies"
import { useAuth } from "@/contexts/AuthContext"
import { useUserMovie, useUpdateMovieStatus, useUpdateMovieRating } from "@/hooks/useUserMovies"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Loader2, ArrowLeft, Star, Clock, Calendar, Plus, Share2, Check, Play, Bookmark, Sparkles } from "lucide-react"
import { AddToWatchlistModal } from "@/components/watchlists/AddToWatchlistModal"
import { StarRating } from "@/components/ui/StarRating"
import { WatchingNow } from "@/components/movies/WatchingNow"
import { useState } from "react"
import { Movie } from "@/types/movie"

export default function MovieDetailsPage() {
    const { id } = useParams<{ id: string }>()
    const { user } = useAuth()
    const { data: movie, isLoading, error } = useMovie(id!)
    const { data: userMovie } = useUserMovie(user?.id || "", id!) as any
    const { mutate: updateStatus } = useUpdateMovieStatus()
    const { mutate: updateRating } = useUpdateMovieRating()

    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        )
    }

    if (error || !movie) {
        return (
            <div className="container py-20 text-center space-y-4">
                <h1 className="text-4xl font-bold">Movie not found</h1>
                <p className="text-muted-foreground">We couldn't find the movie you're looking for.</p>
                <Link to="/">
                    <Button variant="outline">Back to Discovery</Button>
                </Link>
            </div>
        )
    }

    const year = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'
    const runtimeHours = movie.runtime ? Math.floor(movie.runtime / 60) : 0
    const runtimeMinutes = movie.runtime ? movie.runtime % 60 : 0

    return (
        <div className="relative min-h-screen pb-20">
            {/* Hero Backdrop */}
            <div className="absolute inset-0 h-[70vh] w-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent z-10" />
                {movie.poster_url && (
                    <img
                        src={movie.poster_url.replace('w500', 'original')}
                        alt=""
                        className="h-full w-full object-cover opacity-30 blur-sm scale-110"
                    />
                )}
            </div>

            <main className="container relative z-20 pt-12 space-y-12">
                <Link
                    to="/"
                    className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Discovery
                </Link>

                <div className="grid gap-12 lg:grid-cols-[350px_1fr]">
                    {/* Poster */}
                    <div className="relative aspect-[2/3] overflow-hidden rounded-2xl shadow-2xl border bg-muted">
                        {movie.poster_url ? (
                            <img
                                src={movie.poster_url}
                                alt={movie.title}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                                No Poster
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <WatchingNow movieId={movie.id} />
                            <div className="flex flex-wrap gap-2">
                                {movie.genres?.map((genre: string) => (
                                    <Badge key={genre} variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                                        {genre}
                                    </Badge>
                                ))}
                            </div>
                            <h1 className="text-5xl font-black tracking-tighter lg:text-7xl">
                                {movie.title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-6 text-lg text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5" />
                                    {year}
                                </div>
                                {movie.runtime && (
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-5 w-5" />
                                        {runtimeHours}h {runtimeMinutes}m
                                    </div>
                                )}
                                {movie.vote_average && (
                                    <div className="flex items-center gap-2 text-yellow-500 font-bold">
                                        <Star className="h-5 w-5 fill-current" />
                                        {movie.vote_average.toFixed(1)}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-8 py-4 border-y border-white/10">
                            {/* Status Selector */}
                            <div className="space-y-3">
                                <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Status</span>
                                <div className="flex gap-2">
                                    {[
                                        { id: 'want_to_watch', label: 'Want to Watch', icon: Bookmark },
                                        { id: 'watching', label: 'Watching', icon: Play },
                                        { id: 'watched', label: 'Watched', icon: Check },
                                    ].map((s) => (
                                        <Button
                                            key={s.id}
                                            variant={userMovie?.status === s.id ? "default" : "outline"}
                                            size="sm"
                                            className="rounded-full gap-2"
                                            onClick={() => updateStatus({ userId: user?.id || "", movieId: movie.id, status: s.id as any })}
                                        >
                                            <s.icon className="h-4 w-4" />
                                            {s.label}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            {/* Rating */}
                            <div className="space-y-3">
                                <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Your Rating</span>
                                <StarRating
                                    rating={userMovie?.rating || 0}
                                    onRatingChange={(rating) => updateRating({ userId: user?.id || "", movieId: movie.id, rating })}
                                    size="lg"
                                />
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <Button size="lg" className="h-14 px-8 text-lg font-bold rounded-full" onClick={() => setSelectedMovie(movie)}>
                                <Plus className="mr-2 h-6 w-6" />
                                Add to Watchlist
                            </Button>
                            <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-bold rounded-full">
                                <Share2 className="mr-2 h-6 w-6" />
                                Share
                            </Button>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold">Overview</h2>
                            <p className="text-xl leading-relaxed text-muted-foreground max-w-3xl">
                                {movie.overview || "No overview available for this movie."}
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 space-y-4 max-w-3xl">
                            <div className="flex items-center gap-2 text-primary">
                                <Sparkles className="h-5 w-5" />
                                <h3 className="font-bold uppercase tracking-widest text-sm">AI Insights</h3>
                            </div>
                            <p className="text-lg text-foreground/80 italic">
                                "This {movie.genres?.[0] || 'film'} is a standout in its category. Based on community sentiment, it offers a {(movie.vote_average || 0) > 7 ? 'highly compelling' : 'unique'} experience that resonates well with fans of {movie.genres?.slice(0, 2).join(' and ') || 'the genre'}."
                            </p>
                            <div className="flex gap-4 pt-2">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-primary">92%</div>
                                    <div className="text-[10px] uppercase tracking-tighter text-muted-foreground">Match Score</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-500">Positive</div>
                                    <div className="text-[10px] uppercase tracking-tighter text-muted-foreground">Sentiment</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {selectedMovie && (
                <AddToWatchlistModal
                    movie={selectedMovie}
                    onClose={() => setSelectedMovie(null)}
                />
            )}
        </div>
    )
}
