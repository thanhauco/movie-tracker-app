import { useGlobalActivity, useUserSearch } from "@/hooks/useSocial"
import { Card, CardContent } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Loader2, User, Star, Plus, Play, Check, Clock, Search } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { useDebounce } from "@/hooks/useDebounce"
import { supabase } from "@/lib/supabase"
import { useQueryClient } from "@tanstack/react-query"

export default function ActivityPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const debouncedSearch = useDebounce(searchQuery, 500)
    const queryClient = useQueryClient()

    const { data: activities, isLoading: loadingActivities } = useGlobalActivity()
    const { data: userResults, isLoading: loadingUsers } = useUserSearch(debouncedSearch)

    useEffect(() => {
        const channel = supabase
            .channel('public:activities')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'activities' },
                () => {
                    queryClient.invalidateQueries({ queryKey: ['social', 'global-activity'] })
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [queryClient])

    return (
        <main className="container py-8 space-y-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight">Community</h1>
                    <p className="text-muted-foreground">See what other movie buffs are watching and rating.</p>
                </div>

                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search users..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />

                    {debouncedSearch.length >= 2 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-card border rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                            {loadingUsers ? (
                                <div className="p-4 flex justify-center">
                                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                                </div>
                            ) : userResults && userResults.length > 0 ? (
                                <div className="divide-y">
                                    {userResults.map((user: any) => (
                                        <Link
                                            key={user.id}
                                            to={`/profile/${user.id}`}
                                            className="flex items-center gap-3 p-3 hover:bg-muted transition-colors"
                                            onClick={() => setSearchQuery("")}
                                        >
                                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 overflow-hidden">
                                                {user.avatar_url ? (
                                                    <img src={user.avatar_url} alt="" className="h-full w-full object-cover" />
                                                ) : (
                                                    <User className="h-4 w-4 text-primary" />
                                                )}
                                            </div>
                                            <span className="font-medium">{user.username || "Anonymous"}</span>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-4 text-center text-sm text-muted-foreground">
                                    No users found
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="max-w-3xl mx-auto space-y-4">
                {loadingActivities ? (
                    <div className="flex min-h-[400px] items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : activities && activities.length > 0 ? (
                    activities.map((activity: any) => (
                        <Card key={activity.id} className="overflow-hidden hover:border-primary/50 transition-colors">
                            <CardContent className="p-6">
                                <div className="flex gap-4">
                                    {/* Avatar */}
                                    <Link to={`/profile/${activity.user_id}`} className="shrink-0">
                                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 overflow-hidden">
                                            {activity.profiles?.avatar_url ? (
                                                <img src={activity.profiles.avatar_url} alt="" className="h-full w-full object-cover" />
                                            ) : (
                                                <User className="h-6 w-6 text-primary" />
                                            )}
                                        </div>
                                    </Link>

                                    {/* Content */}
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="space-y-1">
                                                <p className="text-sm leading-none">
                                                    <Link to={`/profile/${activity.user_id}`} className="font-bold hover:text-primary transition-colors">
                                                        {activity.profiles?.username || "Anonymous"}
                                                    </Link>
                                                    <span className="text-muted-foreground mx-1.5">
                                                        {formatAction(activity.action_type)}
                                                    </span>
                                                    {activity.movies && (
                                                        <Link to={`/movies/${activity.movies.id}`} className="font-bold text-primary hover:underline">
                                                            {activity.movies.title}
                                                        </Link>
                                                    )}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                                                </p>
                                            </div>
                                            <div className="mt-1">
                                                <ActivityIcon type={activity.action_type} />
                                            </div>
                                        </div>

                                        {activity.action_type === 'rated' && activity.metadata?.rating && (
                                            <div className="flex gap-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`h-4 w-4 ${i < activity.metadata.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/20"}`}
                                                    />
                                                ))}
                                            </div>
                                        )}

                                        {activity.movies?.poster_url && (
                                            <Link to={`/movies/${activity.movies.id}`} className="block mt-4 group">
                                                <div className="relative aspect-video rounded-lg overflow-hidden border bg-muted">
                                                    <img
                                                        src={activity.movies.poster_url.replace('w500', 'original')}
                                                        alt=""
                                                        className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <div className="bg-background/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-sm font-medium">
                                                            View Movie Details
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="text-center py-20 border-2 border-dashed rounded-2xl">
                        <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium">No activity yet</h3>
                        <p className="text-muted-foreground">Be the first to rate or add a movie!</p>
                    </div>
                )}
            </div>
        </main>
    )
}

function ActivityIcon({ type }: { type: string }) {
    switch (type) {
        case 'rated': return <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
        case 'added_to_watchlist': return <Plus className="h-5 w-5 text-green-500" />
        case 'started_watching': return <Play className="h-5 w-5 text-blue-500 fill-blue-500" />
        case 'finished_watching': return <Check className="h-5 w-5 text-primary" />
        default: return <Clock className="h-5 w-5 text-muted-foreground" />
    }
}

function formatAction(type: string) {
    switch (type) {
        case 'rated': return 'rated'
        case 'reviewed': return 'reviewed'
        case 'added_to_watchlist': return 'added'
        case 'started_watching': return 'started watching'
        case 'finished_watching': return 'finished watching'
        default: return 'interacted with'
    }
}
