import { ProductCard } from "@/components/molecules/ProductCard"
import { Skeleton } from "@/components/ui/skeleton"
import { useProducts } from "@/hooks/useProducts"
import { Package } from "lucide-react"

interface ProductGridProps {
  search?: string
  category?: string
}

export function ProductGrid({ search, category }: ProductGridProps) {
  const {
    data: products,
    isLoading,
    isError,
  } = useProducts({ search, category })

  if (isLoading)
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <Skeleton key={i} className="h-52 rounded-lg" />
        ))}
      </div>
    )

  if (isError)
    return (
      <div className="py-16 text-center text-muted-foreground">
        <p className="text-sm">
          Erro ao carregar produtos. Verifique se o backend está rodando.
        </p>
      </div>
    )

  if (!products?.length)
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-muted-foreground">
        <Package size={40} className="opacity-30" />
        <p className="text-sm">Nenhum produto encontrado.</p>
      </div>
    )

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.product_id} product={product} />
      ))}
    </div>
  )
}
