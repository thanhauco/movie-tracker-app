import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Star, Clock, Trash2, GripVertical } from 'lucide-react'
import { Link } from 'react-router-dom'

interface SortableMovieItemProps {
    item: any
    onRemove: (movieId: string) => void
}

export function SortableMovieItem({ item, onRemove }: SortableMovieItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: item.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 'auto',
        opacity: isDragging ? 0.5 : 1,
    }

    const movie = item.movie

    return (
        <div ref={setNodeRef} style={style}>
            <Card className="overflow-hidden group hover:border-primary/50 transition-colors">
                <CardContent className="p-0 flex items-center">
                    <div
                        {...attributes}
                        {...listeners}
                        className="px-3 py-8 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-primary transition-colors"
                    >
                        <GripVertical className="h-5 w-5" />
                    </div>

                    <Link to={`/movies/${movie.id}`} className="flex-1 flex items-center gap-4 p-4 pl-0">
                        <div className="h-20 w-14 shrink-0 overflow-hidden rounded-md border bg-muted">
                            {movie.poster_url ? (
                                <img src={movie.poster_url} alt="" className="h-full w-full object-cover" />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-[10px] text-muted-foreground">No Poster</div>
                            )}
                        </div>

                        <div className="flex-1 min-w-0 space-y-1">
                            <h3 className="font-bold truncate group-hover:text-primary transition-colors">{movie.title}</h3>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                {movie.release_date && (
                                    <span>{new Date(movie.release_date).getFullYear()}</span>
                                )}
                                {movie.runtime && (
                                    <span className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {movie.runtime}m
                                    </span>
                                )}
                                {movie.vote_average && (
                                    <span className="flex items-center gap-1 text-yellow-500 font-medium">
                                        <Star className="h-3 w-3 fill-current" />
                                        {movie.vote_average.toFixed(1)}
                                    </span>
                                )}
                            </div>
                            {item.notes && (
                                <p className="text-xs text-muted-foreground italic line-clamp-1">"{item.notes}"</p>
                            )}
                        </div>
                    </Link>

                    <div className="px-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-destructive transition-colors"
                            onClick={() => onRemove(movie.id)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
