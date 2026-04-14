import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface StarRatingProps {
  value: number | null
  max?: number
  size?: number
  className?: string
}

export function StarRating({
  value,
  max = 5,
  size = 14,
  className,
}: StarRatingProps) {
  if (value === null)
    return <span className="text-xs text-muted-foreground">Sem avaliação</span>

  return (
    <div
      className={cn("flex items-center gap-0.5", className)}
      aria-label={`${value} de ${max} estrelas`}
    >
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={
            i < Math.round(value)
              ? "fill-amber-400 text-amber-400"
              : "text-muted-foreground/30"
          }
        />
      ))}
      <span className="ml-1 text-xs font-medium tabular-nums">
        {value.toFixed(1)}
      </span>
    </div>
  )
}
