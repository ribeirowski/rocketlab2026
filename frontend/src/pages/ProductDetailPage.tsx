import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Pencil, Package, Star, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { MetricCard } from "@/components/molecules/MetricCard"
import { ReviewsList } from "@/components/organisms/ReviewsList"
import { CategoryBadge } from "@/components/atoms/CategoryBadge"
import { ProductForm } from "@/components/organisms/ProductForm"
import { useProduct } from "@/hooks/useProducts"
import { useUIStore } from "@/store/ui.store"

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { openEdit, productFormOpen } = useUIStore()
  const { data: product, isLoading } = useProduct(id ?? "")

  if (isLoading)
    return (
      <div className="max-w-4xl space-y-6">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-36 w-full" />
        <div className="grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
      </div>
    )

  if (!product) return null

  const hasDimensions =
    product.length_cm ||
    product.height_cm ||
    product.width_cm ||
    product.product_weight_grams

  const dimensions = [
    { label: "Comprimento", value: product.length_cm, unit: "cm" },
    { label: "Altura", value: product.height_cm, unit: "cm" },
    { label: "Largura", value: product.width_cm, unit: "cm" },
    { label: "Peso", value: product.product_weight_grams, unit: "g" },
  ]

  return (
    <div className="max-w-4xl space-y-6">
      {/* Breadcrumb */}
      <button
        onClick={() => navigate("/products")}
        className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft size={14} /> Voltar para produtos
      </button>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 rounded-lg border bg-card p-5">
        <div className="min-w-0 space-y-1.5">
          <CategoryBadge category={product.product_category} />
          <h1 className="text-lg leading-snug font-semibold">
            {product.product_name}
          </h1>
          <p className="font-mono text-xs text-muted-foreground">
            {product.product_id}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => openEdit(product.product_id)}
          className="shrink-0 gap-1.5"
        >
          <Pencil size={13} /> Editar
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <MetricCard
          label="Avaliação média"
          value={
            product.average_rating
              ? `${product.average_rating.toFixed(1)} / 5`
              : "—"
          }
          icon={Star}
          description="baseado nos pedidos"
        />
        <MetricCard
          label="Total de vendas"
          value={product.total_sales ?? 0}
          icon={TrendingUp}
          description="unidades vendidas"
        />
        <MetricCard
          label="Peso"
          value={
            product.product_weight_grams
              ? `${product.product_weight_grams}g`
              : "—"
          }
          icon={Package}
        />
      </div>

      {/* Dimensões — sempre visíveis se existirem */}
      {hasDimensions && (
        <>
          <Separator />
          <div>
            <h2 className="mb-3 text-sm font-semibold">Dimensões</h2>
            <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {dimensions.map(({ label, value, unit }) => (
                <div key={label} className="rounded-md border bg-card p-3">
                  <dt className="text-xs text-muted-foreground">{label}</dt>
                  <dd className="mt-0.5 text-sm font-medium tabular-nums">
                    {value != null ? `${value} ${unit}` : "—"}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </>
      )}

      {/* Avaliações — sempre visíveis */}
      <Separator />
      <div>
        <h2 className="mb-3 text-sm font-semibold">
          Avaliações dos consumidores
        </h2>
        <ReviewsList productId={product.product_id} />
      </div>

      {productFormOpen && <ProductForm existingProduct={product} />}
    </div>
  )
}
