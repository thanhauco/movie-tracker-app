import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { User } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/Tooltip'

interface WatchingNowProps {
    movieId: string
}

export function WatchingNow({ movieId }: WatchingNowProps) {
    const { user } = useAuth()
    const [viewers, setViewers] = useState<any[]>([])

    useEffect(() => {
        if (!user) return

        const channel = supabase.channel(`movie:${movieId}`)

        channel
            .on('presence', { event: 'sync' }, () => {
                const state = channel.presenceState()
                const activeViewers = Object.values(state).flat()
                setViewers(activeViewers)
            })
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    await channel.track({
                        user_id: user.id,
                        username: user.email?.split('@')[0] || 'Anonymous',
                        online_at: new Date().toISOString(),
                    })
                }
            })

        return () => {
            supabase.removeChannel(channel)
        }
    }, [movieId, user])

    if (viewers.length <= 1) return null

    return (
        <div className="flex items-center gap-2 py-2 px-4 bg-primary/5 rounded-full border border-primary/10 w-fit">
            <div className="flex -space-x-2 overflow-hidden">
                {viewers.slice(0, 5).map((viewer, i) => (
                    <div
                        key={i}
                        className="inline-block h-6 w-6 rounded-full ring-2 ring-background bg-muted flex items-center justify-center overflow-hidden"
                        title={viewer.username}
                    >
                        <User className="h-3 w-3 text-muted-foreground" />
                    </div>
                ))}
            </div>
            <span className="text-xs font-medium text-primary">
                {viewers.length} people watching now
            </span>
        </div>
    )
}
