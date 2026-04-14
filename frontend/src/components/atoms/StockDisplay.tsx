import { TrendingUp } from "lucide-react"

interface StockDisplayProps {
  totalSales: number | null
}

export function StockDisplay({ totalSales }: StockDisplayProps) {
  return (
    <div className="flex items-center gap-1 text-xs text-muted-foreground">
      <TrendingUp size={12} />
      <span className="tabular-nums">{totalSales ?? 0} vendas</span>
    </div>
  )
}
