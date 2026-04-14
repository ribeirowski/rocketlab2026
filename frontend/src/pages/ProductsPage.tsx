import { useState, useMemo } from "react"
import { Plus, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SearchBar } from "@/components/molecules/SearchBar"
import { ProductCard } from "@/components/molecules/ProductCard"
import { ProductForm } from "@/components/organisms/ProductForm"
import { Skeleton } from "@/components/ui/skeleton"
import { useUIStore } from "@/store/ui.store"
import { useProducts } from "@/hooks/useProducts"
import { Package } from "lucide-react"
import type { Product } from "@/types"

type SortKey = "name_asc" | "name_desc" | "sales_desc" | "rating_desc"

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "name_asc", label: "Nome A→Z" },
  { value: "name_desc", label: "Nome Z→A" },
  { value: "sales_desc", label: "Mais vendidos" },
  { value: "rating_desc", label: "Melhor avaliados" },
]

function sortProducts(products: Product[], sort: SortKey): Product[] {
  return [...products].sort((a, b) => {
    switch (sort) {
      case "name_asc":
        return a.product_name.localeCompare(b.product_name)
      case "name_desc":
        return b.product_name.localeCompare(a.product_name)
      case "sales_desc":
        return (b.total_sales ?? 0) - (a.total_sales ?? 0)
      case "rating_desc":
        return (b.average_rating ?? 0) - (a.average_rating ?? 0)
    }
  })
}

export function ProductsPage() {
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [sort, setSort] = useState<SortKey>("name_asc")
  const { openCreate, productFormOpen } = useUIStore()

  // Busca todos e deixa filtro/ordenação no cliente para facilitar agrupamento por categoria
  const { data: allProducts, isLoading, isError } = useProducts({ limit: 100 })

  // Categorias únicas extraídas dos dados
  const categories = useMemo(() => {
    if (!allProducts) return []
    const cats = [
      ...new Set(
        allProducts.map((p) => p.product_category).filter(Boolean) as string[]
      ),
    ].sort()
    return cats
  }, [allProducts])

  // Filtra + ordena
  const filtered = useMemo(() => {
    if (!allProducts) return {}
    let list = allProducts

    if (search) {
      const q = search.toLowerCase()
      list = list.filter((p) => p.product_name.toLowerCase().includes(q))
    }
    if (activeCategory) {
      list = list.filter((p) => p.product_category === activeCategory)
    }

    list = sortProducts(list, sort)

    // Agrupa por categoria
    return list.reduce<Record<string, Product[]>>((acc, p) => {
      const cat = p.product_category ?? "Sem categoria"
      if (!acc[cat]) acc[cat] = []
      acc[cat].push(p)
      return acc
    }, {})
  }, [allProducts, search, activeCategory, sort])

  const totalFiltered = Object.values(filtered).flat().length

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Produtos</h1>
          <p className="text-sm text-muted-foreground">
            {totalFiltered} produto{totalFiltered !== 1 ? "s" : ""}
            {activeCategory ? ` em "${activeCategory.replace(/_/g, " ")}"` : ""}
          </p>
        </div>
        <Button onClick={openCreate} size="sm" className="gap-1.5">
          <Plus size={14} />
          Novo produto
        </Button>
      </div>

      {/* Barra de filtros */}
      <div className="flex flex-wrap items-center gap-2">
        <SearchBar value={search} onChange={setSearch} />
        <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
          <SelectTrigger className="h-9 w-44">
            <SlidersHorizontal
              size={13}
              className="mr-1.5 text-muted-foreground"
            />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Chips de categoria */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setActiveCategory(null)}
            className={`rounded-full border px-3 py-0.5 text-xs font-medium capitalize transition-colors ${
              !activeCategory
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
            }`}
          >
            Todos
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() =>
                setActiveCategory(activeCategory === cat ? null : cat)
              }
              className={`rounded-full border px-3 py-0.5 text-xs font-medium capitalize transition-colors ${
                activeCategory === cat
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
              }`}
            >
              {cat.replace(/_/g, " ")}
            </button>
          ))}
        </div>
      )}

      {/* Conteúdo */}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {[...Array(10)].map((_, i) => (
            <Skeleton key={i} className="h-44 rounded-lg" />
          ))}
        </div>
      ) : isError ? (
        <div className="py-16 text-center text-sm text-muted-foreground">
          Erro ao carregar. Verifique se o backend está rodando.
        </div>
      ) : totalFiltered === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-muted-foreground">
          <Package size={36} className="opacity-30" />
          <p className="text-sm">Nenhum produto encontrado.</p>
        </div>
      ) : (
        /* Seções por categoria */
        <div className="space-y-8">
          {Object.entries(filtered).map(([category, products]) => (
            <section key={category}>
              <h2 className="mb-3 text-sm font-semibold tracking-wide text-muted-foreground capitalize">
                {category.replace(/_/g, " ")}
                <span className="ml-2 font-normal">({products.length})</span>
              </h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {products.map((product) => (
                  <ProductCard key={product.product_id} product={product} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {productFormOpen && <ProductForm />}
    </div>
  )
}
