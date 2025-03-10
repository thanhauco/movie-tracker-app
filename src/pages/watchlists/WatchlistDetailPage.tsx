import { useParams, Link } from "react-router-dom"
import { useWatchlist, useRemoveFromWatchlist, useReorderWatchlistItems } from "@/hooks/useWatchlists"
import { Button } from "@/components/ui/Button"
import { Loader2, ArrowLeft, Share2, ListFilter, Plus, LayoutGrid, List as ListIcon, Users } from "lucide-react"
import { useState, useMemo } from "react"
import { toast } from "react-hot-toast"
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core'
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { SortableMovieItem } from "@/components/watchlists/SortableMovieItem"

export default function WatchlistDetailPage() {
    const { id } = useParams<{ id: string }>()
    const { data: watchlist, isLoading } = useWatchlist(id!)
    const { mutate: removeFromWatchlist } = useRemoveFromWatchlist()
    const { mutate: reorderItems } = useReorderWatchlistItems()

    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    const sortedItems = useMemo(() => {
        if (!watchlist?.items) return []
        return [...watchlist.items].sort((a, b) => (a.priority || 0) - (b.priority || 0))
    }, [watchlist?.items])

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event

        if (over && active.id !== over.id) {
            const oldIndex = sortedItems.findIndex((item) => item.id === active.id)
            const newIndex = sortedItems.findIndex((item) => item.id === over.id)

            const newItems = arrayMove(sortedItems, oldIndex, newIndex)

            // Update priorities
            const updates = newItems.map((item, index) => ({
                id: item.id,
                priority: index
            }))

            reorderItems({ watchlistId: id!, items: updates })
        }
    }

    const handleShare = () => {
        const url = window.location.href
        navigator.clipboard.writeText(url)
        toast.success('Link copied to clipboard!')
    }

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        )
    }

    if (!watchlist) {
        return (
            <div className="container py-20 text-center space-y-4">
                <h1 className="text-4xl font-bold">Watchlist not found</h1>
                <Link to="/watchlists">
                    <Button variant="outline">Back to Watchlists</Button>
                </Link>
            </div>
        )
    }

    return (
        <main className="container py-8 space-y-8">
            <div className="space-y-4">
                <Link
                    to="/watchlists"
                    className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Watchlists
                </Link>

                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div className="space-y-1">
                        <h1 className="text-4xl font-black tracking-tight">{watchlist.name}</h1>
                        <p className="text-lg text-muted-foreground">{watchlist.description || "No description provided."}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex -space-x-2 overflow-hidden">
                            {[1, 2].map((i) => (
                                <div key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-background bg-muted flex items-center justify-center">
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                </div>
                            ))}
                            <Button variant="outline" size="icon" className="h-8 w-8 rounded-full border-dashed">
                                <Plus className="h-3 w-3" />
                            </Button>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="rounded-full" onClick={handleShare}>
                                <Share2 className="mr-2 h-4 w-4" />
                                Share
                            </Button>
                            <Button size="sm" className="rounded-full">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Movie
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-muted-foreground">
                        {watchlist.items?.length || 0} Movies
                    </span>
                </div>
                <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
                    <Button
                        variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                        size="sm"
                        className="h-8 px-2"
                        onClick={() => setViewMode('list')}
                    >
                        <ListIcon className="h-4 w-4" />
                    </Button>
                    <Button
                        variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                        size="sm"
                        className="h-8 px-2"
                        onClick={() => setViewMode('grid')}
                    >
                        <LayoutGrid className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {watchlist.items && watchlist.items.length > 0 ? (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                    modifiers={[restrictToVerticalAxis]}
                >
                    <SortableContext
                        items={sortedItems.map(i => i.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="space-y-3 max-w-4xl">
                            {sortedItems.map((item: any) => (
                                <SortableMovieItem
                                    key={item.id}
                                    item={item}
                                    onRemove={(movieId) => removeFromWatchlist({ watchlistId: id!, movieId })}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed rounded-2xl">
                    <ListFilter className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-bold">Your watchlist is empty</h3>
                    <p className="text-muted-foreground mb-6">Start adding movies to build your collection.</p>
                    <Link to="/">
                        <Button>Discover Movies</Button>
                    </Link>
                </div>
            )}
        </main>
    )
}
