import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { productsApi } from "@/api/products"
import type { ProductCreate, ProductUpdate, ProductFilters } from "@/types"

export const PRODUCT_KEYS = {
  all: ["products"] as const,
  list: (f: ProductFilters) => ["products", "list", f] as const,
  detail: (id: string) => ["products", "detail", id] as const,
  stats: ["products", "stats"] as const,
}

export const useProducts = (filters: ProductFilters = {}) =>
  useQuery({
    queryKey: PRODUCT_KEYS.list(filters),
    queryFn: () => productsApi.list(filters),
  })

export const useProduct = (id: string) =>
  useQuery({
    queryKey: PRODUCT_KEYS.detail(id),
    queryFn: () => productsApi.get(id),
    enabled: !!id,
  })

export const useProductStats = () =>
  useQuery({
    queryKey: PRODUCT_KEYS.stats,
    queryFn: () => productsApi.getStats(),
    staleTime: 1000 * 60 * 5,
  })

export const useCreateProduct = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: ProductCreate) => productsApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: PRODUCT_KEYS.all }),
  })
}

export const useUpdateProduct = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ProductUpdate }) =>
      productsApi.update(id, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: PRODUCT_KEYS.detail(id) })
      qc.invalidateQueries({ queryKey: PRODUCT_KEYS.all })
    },
  })
}

export const useDeleteProduct = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => productsApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: PRODUCT_KEYS.all }),
  })
}
