import { Star } from "lucide-react"
import { useState } from "react"
import { cn } from "@/utils/cn"

interface StarRatingProps {
    rating: number
    maxRating?: number
    onRatingChange?: (rating: number) => void
    readonly?: boolean
    size?: "sm" | "md" | "lg"
}

export function StarRating({
    rating,
    maxRating = 5,
    onRatingChange,
    readonly = false,
    size = "md"
}: StarRatingProps) {
    const [hoverRating, setHoverRating] = useState<number | null>(null)

    const displayRating = hoverRating !== null ? hoverRating : rating

    const starSizes = {
        sm: "h-4 w-4",
        md: "h-6 w-6",
        lg: "h-8 w-8"
    }

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
        if (readonly) return
        const rect = e.currentTarget.getBoundingClientRect()
        const x = e.clientX - rect.left
        const isHalf = x < rect.width / 2
        setHoverRating(index + (isHalf ? 0.5 : 1))
    }

    const handleClick = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
        if (readonly || !onRatingChange) return
        const rect = e.currentTarget.getBoundingClientRect()
        const x = e.clientX - rect.left
        const isHalf = x < rect.width / 2
        onRatingChange(index + (isHalf ? 0.5 : 1))
    }

    return (
        <div className="flex items-center gap-1" onMouseLeave={() => setHoverRating(null)}>
            {[...Array(maxRating)].map((_, i) => {
                const starValue = i + 1
                const isFull = displayRating >= starValue
                const isHalf = displayRating >= starValue - 0.5 && displayRating < starValue

                return (
                    <div
                        key={i}
                        className={cn(
                            "relative cursor-pointer transition-transform hover:scale-110",
                            readonly && "cursor-default hover:scale-100"
                        )}
                        onMouseMove={(e) => handleMouseMove(e, i)}
                        onClick={(e) => handleClick(e, i)}
                    >
                        <Star
                            className={cn(
                                starSizes[size],
                                "text-muted-foreground/30 transition-colors",
                                isFull && "fill-yellow-400 text-yellow-400",
                                isHalf && "text-yellow-400"
                            )}
                        />
                        {isHalf && (
                            <div className="absolute inset-0 overflow-hidden w-1/2">
                                <Star className={cn(starSizes[size], "fill-yellow-400 text-yellow-400")} />
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    )
}
