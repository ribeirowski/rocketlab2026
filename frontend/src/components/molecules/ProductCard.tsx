import { useNavigate } from "react-router-dom"
import { Pencil, Trash2, MoreHorizontal } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { StarRating } from "@/components/atoms/StarRating"
import { StockDisplay } from "@/components/atoms/StockDisplay"
import { useUIStore } from "@/store/ui.store"
import { useDeleteProduct } from "@/hooks/useProducts"
import type { Product } from "@/types"
import { cn } from "@/lib/utils"

export function ProductCard({ product }: { product: Product }) {
  const navigate = useNavigate()
  const { openEdit } = useUIStore()
  const deleteProduct = useDeleteProduct()

  return (
    <Card
      className={cn(
        "group flex cursor-pointer flex-col overflow-hidden rounded-lg",
        "border transition-shadow duration-150 hover:shadow-md"
      )}
      onClick={() => navigate(`/products/${product.product_id}`)}
    >
      {/* Imagem compacta */}
      {product.category_image_url ? (
        <div className="h-24 overflow-hidden bg-muted">
          <img
            src={product.category_image_url}
            alt={product.product_category ?? ""}
            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="flex h-24 items-center justify-center bg-muted/40 text-2xl">
          📦
        </div>
      )}

      <CardContent className="flex flex-1 flex-col gap-1.5 p-3">
        {/* Categoria + menu */}
        <div className="flex items-center justify-between gap-1">
          <span className="truncate text-xs font-medium text-muted-foreground capitalize">
            {product.product_category?.replace(/_/g, " ") ?? "Sem categoria"}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="icon"
                className="-mr-1 h-6 w-6 shrink-0"
              >
                <MoreHorizontal size={13} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              onClick={(e) => e.stopPropagation()}
            >
              <DropdownMenuItem onClick={() => openEdit(product.product_id)}>
                <Pencil size={13} className="mr-2" /> Editar
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => deleteProduct.mutate(product.product_id)}
              >
                <Trash2 size={13} className="mr-2" /> Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Nome */}
        <p className="line-clamp-2 flex-1 text-xs leading-snug font-medium">
          {product.product_name}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-1">
          <StarRating value={product.average_rating} size={11} />
          <StockDisplay totalSales={product.total_sales} />
        </div>
      </CardContent>
    </Card>
  )
}
