import { apiClient } from "./axios"

export interface Order {
  order_id: string
  consumer_id: string
  status: string
  order_purchase_timestamp: string | null
  order_delivered_timestamp: string | null
  delivery_time_days: number | null
  on_time_delivery: string | null
}

export interface OrderStats {
  total: number
  by_status: { status: string; count: number }[]
  by_month: { month: string; count: number }[]
}

export const ordersApi = {
  list: (params?: { status?: string; skip?: number; limit?: number }) =>
    apiClient.get<Order[]>("/orders/", { params }).then((r) => r.data),

  getStats: () =>
    apiClient.get<OrderStats>("/orders/stats/summary").then((r) => r.data),
}
