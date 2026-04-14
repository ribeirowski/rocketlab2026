import { apiClient } from "./axios"
import type {
  Product,
  ProductCreate,
  ProductUpdate,
  ProductFilters,
} from "@/types"

export interface TopProduct {
  product_id: string
  product_name: string
  sales: number
  revenue: number
}

export interface MonthlySale {
  month: string
  sales: number
  revenue: number
}

export interface ProductStats {
  total_products: number
  total_sales: number
  total_revenue: number
  avg_rating_global: number | null
  top_products: TopProduct[]
  monthly_sales: MonthlySale[]
}

export const productsApi = {
  list: (filters?: ProductFilters) =>
    apiClient
      .get<Product[]>("/products/", { params: filters })
      .then((r) => r.data),

  get: (id: string) =>
    apiClient.get<Product>(`/products/${id}`).then((r) => r.data),

  create: (data: ProductCreate) =>
    apiClient.post<Product>("/products/", data).then((r) => r.data),

  update: (id: string, data: ProductUpdate) =>
    apiClient.patch<Product>(`/products/${id}`, data).then((r) => r.data),

  delete: (id: string) =>
    apiClient.delete(`/products/${id}`).then((r) => r.data),

  getStats: () =>
    apiClient.get<ProductStats>("/products/stats/summary").then((r) => r.data),
}
