import { apiClient } from "./axios"
import type {
  Product,
  ProductCreate,
  ProductUpdate,
  ProductFilters,
} from "@/types"

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
}
