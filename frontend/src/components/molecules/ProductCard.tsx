import { useNavigate } from "react-router-dom"
import { Pencil, Trash2, MoreHorizontal } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { StarRating } from "@/components/atoms/StarRating"
import { CategoryBadge } from "@/components/atoms/CategoryBadge"
import { StockDisplay } from "@/components/atoms/StockDisplay"
import { useUIStore } from "@/store/ui.store"
import { useDeleteProduct } from "@/hooks/useProducts"
import type { Product } from "@/types"
import { cn } from "@/lib/utils"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate()
  const { openEdit } = useUIStore()
  const deleteProduct = useDeleteProduct()

  return (
    <Card
      className={cn(
        "group relative flex cursor-pointer flex-col transition-shadow duration-150",
        "hover:shadow-md"
      )}
      onClick={() => navigate(`/products/${product.product_id}`)}
    >
      {/* Imagem da categoria */}
      {product.category_image_url ? (
        <div className="h-32 overflow-hidden rounded-t-lg bg-muted">
          <img
            src={product.category_image_url}
            alt={product.product_category ?? ""}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="flex h-32 items-center justify-center rounded-t-lg bg-muted/50">
          <span className="text-3xl">📦</span>
        </div>
      )}

      <CardContent className="flex-1 space-y-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <CategoryBadge category={product.product_category} />
          {/* Menu de ações — não propaga o click para o card */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
                <MoreHorizontal size={14} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              onClick={(e) => e.stopPropagation()}
            >
              <DropdownMenuItem onClick={() => openEdit(product.product_id)}>
                <Pencil size={14} className="mr-2" /> Editar
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => deleteProduct.mutate(product.product_id)}
              >
                <Trash2 size={14} className="mr-2" /> Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <p className="line-clamp-2 text-sm leading-snug font-medium">
          {product.product_name}
        </p>

        <StarRating value={product.average_rating} />
      </CardContent>

      <CardFooter className="border-t px-4 py-2">
        <StockDisplay totalSales={product.total_sales} />
      </CardFooter>
    </Card>
  )
}
