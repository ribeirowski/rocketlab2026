import { useParams, useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  Pencil,
  Package,
  Star,
  TrendingUp,
  Ruler,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
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
      <div className="space-y-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-40 w-full" />
        <div className="grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24" />
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

  return (
    <div className="max-w-4xl space-y-6">
      {/* Breadcrumb */}
      <button
        onClick={() => navigate("/products")}
        className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft size={14} />
        Voltar
      </button>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 rounded-xl border bg-card p-5">
        <div className="min-w-0 space-y-2">
          <CategoryBadge category={product.product_category} />
          <h1 className="text-xl leading-snug font-semibold">
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
          <Pencil size={13} />
          Editar
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard
          label="Avaliação média"
          value={
            product.average_rating
              ? `${product.average_rating.toFixed(1)} / 5`
              : "—"
          }
          icon={Star}
          description={
            product.average_rating
              ? "baseado nas avaliações"
              : "sem avaliações ainda"
          }
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
          description="gramas"
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="reviews">
        <TabsList>
          <TabsTrigger value="reviews">
            <Star size={13} className="mr-1.5" />
            Avaliações
          </TabsTrigger>
          {hasDimensions && (
            <TabsTrigger value="dimensions">
              <Ruler size={13} className="mr-1.5" />
              Dimensões
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="reviews" className="mt-4">
          <ReviewsList productId={product.product_id} />
        </TabsContent>

        <TabsContent value="dimensions" className="mt-4">
          <div className="rounded-lg border bg-card p-4">
            <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { label: "Comprimento", value: product.length_cm, unit: "cm" },
                { label: "Altura", value: product.height_cm, unit: "cm" },
                { label: "Largura", value: product.width_cm, unit: "cm" },
                {
                  label: "Peso",
                  value: product.product_weight_grams,
                  unit: "g",
                },
              ].map(({ label, value, unit }) => (
                <div key={label}>
                  <dt className="text-xs text-muted-foreground">{label}</dt>
                  <dd className="text-sm font-medium tabular-nums">
                    {value != null ? `${value} ${unit}` : "—"}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </TabsContent>
      </Tabs>

      {productFormOpen && <ProductForm existingProduct={product} />}
    </div>
  )
}
