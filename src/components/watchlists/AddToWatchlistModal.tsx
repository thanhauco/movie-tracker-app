import { useMyWatchlists, useAddToWatchlist } from "@/hooks/useWatchlists"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Loader2, Plus } from "lucide-react"
import { Movie } from "@/types/movie"

interface AddToWatchlistModalProps {
    movie: Movie
    onClose: () => void
}

export function AddToWatchlistModal({ movie, onClose }: AddToWatchlistModalProps) {
    const { data: watchlists, isLoading } = useMyWatchlists()
    const { mutate: addToWatchlist, isPending } = useAddToWatchlist()

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
            <Card className="w-full max-w-md shadow-2xl">
                <CardHeader>
                    <CardTitle>Add to Watchlist</CardTitle>
                    <p className="text-sm text-muted-foreground">Select a list for "{movie.title}"</p>
                </CardHeader>
                <CardContent className="space-y-4">
                    {isLoading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2">
                            {watchlists?.map((watchlist) => (
                                <button
                                    key={watchlist.id}
                                    className="flex w-full items-center justify-between rounded-lg border p-3 text-left transition-colors hover:bg-muted"
                                    onClick={() => {
                                        addToWatchlist({ watchlistId: watchlist.id, movieId: movie.id }, {
                                            onSuccess: () => onClose()
                                        })
                                    }}
                                    disabled={isPending}
                                >
                                    <span className="font-medium">{watchlist.name}</span>
                                    <Plus className="h-4 w-4 text-muted-foreground" />
                                </button>
                            ))}
                            {watchlists?.length === 0 && (
                                <p className="text-center py-4 text-sm text-muted-foreground">
                                    You don't have any watchlists yet.
                                </p>
                            )}
                        </div>
                    )}
                    <div className="flex justify-end pt-2">
                        <Button variant="ghost" onClick={onClose}>Cancel</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
