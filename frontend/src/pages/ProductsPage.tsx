import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SearchBar } from "@/components/molecules/SearchBar"
import { ProductGrid } from "@/components/organisms/ProductGrid"
import { ProductForm } from "@/components/organisms/ProductForm"
import { useUIStore } from "@/store/ui.store"

export function ProductsPage() {
  const [search, setSearch] = useState("")
  const { openCreate } = useUIStore()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Produtos</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie o catálogo da loja
          </p>
        </div>
        <Button onClick={openCreate} size="sm" className="gap-1.5">
          <Plus size={15} />
          Novo produto
        </Button>
      </div>

      <SearchBar value={search} onChange={setSearch} />
      <ProductGrid search={search} />
      <ProductForm />
    </div>
  )
}
