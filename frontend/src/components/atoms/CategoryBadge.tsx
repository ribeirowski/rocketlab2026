import { Badge } from "@/components/ui/badge"

interface CategoryBadgeProps {
  category: string | null
}

export function CategoryBadge({ category }: CategoryBadgeProps) {
  if (!category)
    return (
      <Badge variant="outline" className="text-muted-foreground">
        Sem categoria
      </Badge>
    )
  return (
    <Badge variant="secondary" className="capitalize">
      {category.replace(/_/g, " ")}
    </Badge>
  )
}
