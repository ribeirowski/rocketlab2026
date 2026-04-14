import { apiClient } from "./axios"
import type { OrderReview } from "@/types"

export const reviewsApi = {
  byProduct: (productId: string) =>
    apiClient
      .get<OrderReview[]>(`/reviews/product/${productId}`)
      .then((r) => r.data),
}
