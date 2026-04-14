import { useQuery } from "@tanstack/react-query"
import { reviewsApi } from "@/api/reviews"

export const useProductReviews = (productId: string) =>
  useQuery({
    queryKey: ["reviews", "product", productId],
    queryFn: () => reviewsApi.byProduct(productId),
    enabled: !!productId,
  })
