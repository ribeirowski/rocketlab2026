import { useQuery } from "@tanstack/react-query"
import { ordersApi } from "@/api/orders"

export const useOrders = (params?: { status?: string; limit?: number }) =>
  useQuery({
    queryKey: ["orders", params],
    queryFn: () => ordersApi.list(params),
    staleTime: 1000 * 60 * 5,
  })
