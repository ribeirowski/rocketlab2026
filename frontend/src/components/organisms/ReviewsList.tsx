import { useProductReviews } from "@/hooks/useReviews"
import { ReviewItem } from "@/components/molecules/ReviewItem"
import { Skeleton } from "@/components/ui/skeleton"

interface ReviewsListProps {
  productId: string
}

export function ReviewsList({ productId }: ReviewsListProps) {
  const { data: reviews, isLoading } = useProductReviews(productId)

  if (isLoading)
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    )

  if (!reviews?.length)
    return (
      <div className="py-12 text-center text-muted-foreground">
        <p className="text-sm">Nenhuma avaliação ainda.</p>
      </div>
    )

  return (
    <div className="space-y-3">
      {reviews.map((review) => (
        <ReviewItem key={review.review_id} review={review} />
      ))}
    </div>
  )
}
