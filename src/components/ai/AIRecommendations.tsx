import { useAIRecommendations } from "@/hooks/useAI"
import { useAuth } from "@/contexts/AuthContext"
import { MovieCard } from "@/components/movies/MovieCard"
import { Sparkles, Loader2 } from "lucide-react"

export function AIRecommendations() {
    const { user } = useAuth()
    const { data: recommendations, isLoading } = useAIRecommendations(user?.id || "")

    if (!user) return null
    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!recommendations || recommendations.length === 0) return null

    return (
        <section className="space-y-6">
            <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                    <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">AI Recommendations</h2>
                    <p className="text-sm text-muted-foreground">Personalized picks based on your unique taste</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {recommendations.map((movie: any) => (
                    <div key={movie.id} className="relative group">
                        <MovieCard movie={{
                            id: movie.id,
                            title: movie.title,
                            poster_path: movie.poster_path,
                            release_date: movie.release_date,
                            vote_average: movie.vote_average
                        }} />
                        <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="bg-primary/90 text-white text-[10px] font-bold px-2 py-1 rounded-full backdrop-blur-sm">
                                {movie.match_score}% Match
                            </div>
                        </div>
                        <div className="mt-2 hidden group-hover:block animate-in fade-in slide-in-from-top-1 duration-200">
                            <p className="text-[10px] text-muted-foreground leading-tight italic">
                                "{movie.ai_reason}"
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
