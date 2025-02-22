import { Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Lock, Globe, Film } from "lucide-react"

interface WatchlistCardProps {
    watchlist: {
        id: string
        name: string
        description: string | null
        is_public: boolean
        watchlist_items?: { count: number }[]
    }
}

export function WatchlistCard({ watchlist }: WatchlistCardProps) {
    const itemCount = watchlist.watchlist_items?.[0]?.count || 0

    return (
        <Link to={`/watchlists/${watchlist.id}`}>
            <Card className="group h-full transition-all hover:border-primary/50 hover:shadow-md">
                <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                        <CardTitle className="line-clamp-1 text-lg group-hover:text-primary transition-colors">
                            {watchlist.name}
                        </CardTitle>
                        {watchlist.is_public ? (
                            <Globe className="h-4 w-4 text-muted-foreground" />
                        ) : (
                            <Lock className="h-4 w-4 text-muted-foreground" />
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="line-clamp-2 text-sm text-muted-foreground min-h-[2.5rem]">
                        {watchlist.description || "No description provided."}
                    </p>
                    <div className="mt-4 flex items-center gap-2">
                        <Badge variant="secondary" className="flex items-center gap-1">
                            <Film className="h-3 w-3" />
                            {itemCount} {itemCount === 1 ? 'movie' : 'movies'}
                        </Badge>
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}
