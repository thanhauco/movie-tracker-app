import * as React from "react"
import { useMyWatchlists, useCreateWatchlist } from "@/hooks/useWatchlists"
import { WatchlistCard } from "@/components/watchlists/WatchlistCard"
import { Button } from "@/components/ui/Button"
import { Plus, Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"

export default function WatchlistsPage() {
    const { user } = useAuth()
    const { data: watchlists, isLoading } = useMyWatchlists()
    const { mutate: createWatchlist, isPending: isCreating } = useCreateWatchlist()

    const [showCreate, setShowCreate] = React.useState(false)
    const [name, setName] = React.useState("")
    const [description, setDescription] = React.useState("")

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) return

        createWatchlist({
            name,
            description,
            user_id: user.id,
            is_public: true
        }, {
            onSuccess: () => {
                setShowCreate(false)
                setName("")
                setDescription("")
            }
        })
    }

    if (isLoading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <main className="container py-8 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Watchlists</h1>
                    <p className="text-muted-foreground">Manage and organize your movie collections.</p>
                </div>
                <Button onClick={() => setShowCreate(!showCreate)}>
                    <Plus className="mr-2 h-4 w-4" />
                    New Watchlist
                </Button>
            </div>

            {showCreate && (
                <Card className="max-w-md">
                    <CardHeader>
                        <CardTitle>Create Watchlist</CardTitle>
                        <CardDescription>Give your new collection a name and description.</CardDescription>
                    </CardHeader>
                    <form onSubmit={handleCreate}>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Name</label>
                                <Input
                                    placeholder="e.g., Sci-Fi Favorites"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Description</label>
                                <Input
                                    placeholder="Optional description..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                        </CardContent>
                        <div className="flex justify-end gap-2 p-6 pt-0">
                            <Button variant="ghost" type="button" onClick={() => setShowCreate(false)}>Cancel</Button>
                            <Button type="submit" isLoading={isCreating}>Create</Button>
                        </div>
                    </form>
                </Card>
            )}

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {watchlists?.map((watchlist) => (
                    <WatchlistCard key={watchlist.id} watchlist={watchlist} />
                ))}
                {watchlists?.length === 0 && !showCreate && (
                    <div className="col-span-full flex min-h-[200px] flex-col items-center justify-center rounded-xl border border-dashed text-center p-8">
                        <Film className="h-10 w-10 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium">No watchlists yet</h3>
                        <p className="text-muted-foreground mb-4">Create your first collection to start tracking movies.</p>
                        <Button variant="outline" onClick={() => setShowCreate(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Create Watchlist
                        </Button>
                    </div>
                )}
            </div>
        </main>
    )
}

function Film(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <path d="M7 3v18" />
            <path d="M17 3v18" />
            <path d="M3 7h4" />
            <path d="M3 12h4" />
            <path d="M3 17h4" />
            <path d="M17 7h4" />
            <path d="M17 12h4" />
            <path d="M17 17h4" />
        </svg>
    )
}
