import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { StarRating } from "@/components/atoms/StarRating"
import type { OrderReview } from "@/types"

interface ReviewItemProps {
  review: OrderReview
}

export function ReviewItem({ review }: ReviewItemProps) {
  return (
    <div className="space-y-1 rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <StarRating value={review.rating} />
        {review.comment_at && (
          <span className="text-xs text-muted-foreground">
            {format(new Date(review.comment_at), "d 'de' MMM, yyyy", {
              locale: ptBR,
            })}
          </span>
        )}
      </div>
      {review.comment_title && (
        <p className="text-sm font-medium">{review.comment_title}</p>
      )}
      {review.comment_text && (
        <p className="text-sm text-muted-foreground">{review.comment_text}</p>
      )}
    </div>
  )
}
