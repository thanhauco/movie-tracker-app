import { useAuth } from "@/contexts/AuthContext"
import { useProfile, useUserStats, useUserActivities } from "@/hooks/useProfile"
import { useFollowStatus, useFollowUser, useUnfollowUser } from "@/hooks/useSocial"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Loader2, User, Film, Star, List, Clock, Settings, UserPlus, UserMinus, Plus, Trophy, Medal, Zap } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useParams } from "react-router-dom"
import { useState } from "react"
import { EditProfileModal } from "@/components/profile/EditProfileModal"
import { cn } from "@/utils/cn"

export default function ProfilePage() {
    const { id } = useParams<{ id: string }>()
    const { user: currentUser } = useAuth()
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)

    // If no ID is provided, we're looking at our own profile
    const userId = id || currentUser?.id || ""
    const isOwnProfile = userId === currentUser?.id

    const { data: profile, isLoading: loadingProfile } = useProfile(userId) as any
    const { data: stats, isLoading: loadingStats } = useUserStats(userId)
    const { data: activities, isLoading: loadingActivities } = useUserActivities(userId)

    const { data: isFollowing } = useFollowStatus(currentUser?.id || "", userId)
    const { mutate: follow } = useFollowUser()
    const { mutate: unfollow } = useUnfollowUser()

    if (loadingProfile || loadingStats) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!profile) {
        return (
            <div className="container py-20 text-center">
                <h2 className="text-2xl font-bold">User not found</h2>
            </div>
        )
    }

    return (
        <main className="container py-8 space-y-8">
            {/* Profile Header */}
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-6">
                    <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20 overflow-hidden">
                        {profile.avatar_url ? (
                            <img src={profile.avatar_url} alt={profile.username || ""} className="h-full w-full object-cover" />
                        ) : (
                            <User className="h-12 w-12 text-primary" />
                        )}
                    </div>
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight">{profile.username || "Anonymous User"}</h1>
                        {isOwnProfile && <p className="text-muted-foreground">{currentUser?.email}</p>}
                        <div className="flex items-center gap-4 py-1">
                            <div className="flex items-center gap-1.5">
                                <span className="font-bold">{stats?.followers_count || 0}</span>
                                <span className="text-sm text-muted-foreground">Followers</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="font-bold">{stats?.following_count || 0}</span>
                                <span className="text-sm text-muted-foreground">Following</span>
                            </div>
                        </div>
                        <div className="flex gap-2 pt-1">
                            <Badge variant="secondary">Member since {new Date(profile.created_at).getFullYear()}</Badge>
                            <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/20">Level {profile.level || 1}</Badge>
                        </div>
                        <div className="w-full max-w-xs pt-3 space-y-1.5">
                            <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
                                <span>XP Progress</span>
                                <span>{profile.xp || 0} / 1000 XP</span>
                            </div>
                            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary transition-all duration-500"
                                    style={{ width: `${((profile.xp || 0) % 1000) / 10}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    {isOwnProfile ? (
                        <Button variant="outline" onClick={() => setIsEditModalOpen(true)}>
                            <Settings className="mr-2 h-4 w-4" />
                            Edit Profile
                        </Button>
                    ) : (
                        currentUser && (
                            <Button
                                variant={isFollowing ? "outline" : "default"}
                                onClick={() => isFollowing
                                    ? unfollow({ followerId: currentUser.id, followingId: userId })
                                    : follow({ followerId: currentUser.id, followingId: userId })
                                }
                            >
                                {isFollowing ? (
                                    <><UserMinus className="mr-2 h-4 w-4" /> Unfollow</>
                                ) : (
                                    <><UserPlus className="mr-2 h-4 w-4" /> Follow</>
                                )}
                            </Button>
                        )
                    )}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Movies</CardTitle>
                        <Film className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.total_movies || 0}</div>
                        <p className="text-xs text-muted-foreground">Movies in database</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Watched</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.watched_count || 0}</div>
                        <p className="text-xs text-muted-foreground">Completed movies</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
                        <Star className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.average_rating?.toFixed(1) || "0.0"}</div>
                        <p className="text-xs text-muted-foreground">Across all rated movies</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Watchlists</CardTitle>
                        <List className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.watchlist_count || 0}</div>
                        <p className="text-xs text-muted-foreground">Custom collections</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
                {/* Recent Activity */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold">Recent Activity</h2>
                    <Card>
                        <CardContent className="p-0">
                            {loadingActivities ? (
                                <div className="flex justify-center py-8">
                                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                </div>
                            ) : activities && activities.length > 0 ? (
                                <div className="divide-y">
                                    {activities.map((activity: any) => (
                                        <div key={activity.id} className="flex items-start gap-4 p-4">
                                            <div className="mt-1 h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                                                <ActivityIcon type={activity.action_type} />
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <p className="text-sm">
                                                    <span className="font-medium">{isOwnProfile ? "You" : profile.username}</span>{" "}
                                                    {formatAction(activity.action_type)}{" "}
                                                    <span className="font-medium text-primary">
                                                        {activity.movies?.title || "a movie"}
                                                    </span>
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <Clock className="h-10 w-10 text-muted-foreground mb-4" />
                                    <p className="text-muted-foreground">No recent activity found.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar / Preferences */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold">{isOwnProfile ? "Preferences" : "About"}</h2>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">{isOwnProfile ? "Account Settings" : "User Info"}</CardTitle>
                            <CardDescription>
                                {isOwnProfile ? "Manage your account preferences." : "Public information about this user."}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Public Profile</span>
                                <Badge>Active</Badge>
                            </div>
                            {isOwnProfile && (
                                <>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">Email Notifications</span>
                                        <Badge variant="outline">Disabled</Badge>
                                    </div>
                                    <div className="w-full pt-2 border-t">
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">Watch Time</p>
                                        <p className="text-sm font-medium">
                                            {Math.floor(((stats as any)?.total_runtime_minutes || 0) / 60)}h {((stats as any)?.total_runtime_minutes || 0) % 60}m
                                        </p>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Trophy className="h-5 w-5 text-yellow-500" />
                                Achievements
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[
                                { name: 'Cinephile Beginner', icon: Medal, color: 'text-blue-500' },
                                { name: 'Critic in the Making', icon: Zap, color: 'text-yellow-500' },
                                { name: 'Curator', icon: Star, color: 'text-purple-500' },
                            ].map((achievement, i) => (
                                <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
                                    <div className={cn("p-2 rounded-full bg-background", achievement.color)}>
                                        <achievement.icon className="h-4 w-4" />
                                    </div>
                                    <span className="text-sm font-medium">{achievement.name}</span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {isOwnProfile && (
                <EditProfileModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    profile={profile}
                />
            )}
        </main>
    )
}

function ActivityIcon({ type }: { type: string }) {
    switch (type) {
        case 'rated': return <Star className="h-4 w-4 text-yellow-500" />
        case 'reviewed': return <Settings className="h-4 w-4 text-blue-500" />
        case 'added_to_watchlist': return <Plus className="h-4 w-4 text-green-500" />
        default: return <Clock className="h-4 w-4 text-muted-foreground" />
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
