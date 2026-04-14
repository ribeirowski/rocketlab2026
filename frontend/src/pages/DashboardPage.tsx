import { useMemo } from "react"
import { useOrderStats } from "@/hooks/useOrders"
import { useProductStats } from "@/hooks/useProducts"
import { MetricCard } from "@/components/molecules/MetricCard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import {
  ShoppingCart,
  CheckCircle,
  XCircle,
  Clock,
  Package,
  Star,
  TrendingUp,
} from "lucide-react"
import type { TopProduct } from "@/api/products"

const STATUS_COLORS: Record<string, string> = {
  entregue: "#22c55e",
  enviado: "#3b82f6",
  cancelado: "#ef4444",
  aprovado: "#f59e0b",
  faturado: "#8b5cf6",
  "em processamento": "#06b6d4",
  criado: "#94a3b8",
  indisponível: "#f97316",
}

const STATUS_LABELS: Record<string, string> = {
  entregue: "Entregue",
  enviado: "Enviado",
  cancelado: "Cancelado",
  aprovado: "Aprovado",
  faturado: "Faturado",
  "em processamento": "Em processamento",
  criado: "Criado",
  indisponível: "Indisponível",
}

export function DashboardPage() {
  const { data: orderStats, isLoading: loadingOrders } = useOrderStats()
  const { data: productStats, isLoading: loadingProducts } = useProductStats()

  const pieData = useMemo(() => {
    if (!orderStats?.by_status) return []
    return orderStats.by_status.map(({ status, count }) => ({
      name: status,
      label: STATUS_LABELS[status] ?? status,
      value: count,
    }))
  }, [orderStats])

  const monthlyOrdersData = useMemo(() => {
    if (!orderStats?.by_month) return []
    return orderStats.by_month.slice(-6).map(({ month, count }) => ({
      month: month.slice(5) + "/" + month.slice(2, 4),
      pedidos: count,
    }))
  }, [orderStats])

  if (loadingOrders || loadingProducts) return <DashboardSkeleton />

  const entregues =
    orderStats?.by_status.find((s) => s.status === "entregue")?.count ?? 0
  const cancelados =
    orderStats?.by_status.find((s) => s.status === "cancelado")?.count ?? 0
  const emAndamento = (orderStats?.total ?? 0) - entregues - cancelados

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Visão geral da loja</p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <MetricCard
          label="Total de pedidos"
          value={orderStats?.total ?? 0}
          icon={ShoppingCart}
        />
        <MetricCard
          label="Entregues"
          value={entregues}
          icon={CheckCircle}
          description="pedidos concluídos"
        />
        <MetricCard label="Cancelados" value={cancelados} icon={XCircle} />
        <MetricCard label="Em andamento" value={emAndamento} icon={Clock} />
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <MetricCard
          label="Produtos cadastrados"
          value={productStats?.total_products ?? 0}
          icon={Package}
        />
        <MetricCard
          label="Itens vendidos"
          value={productStats?.total_sales ?? 0}
          icon={TrendingUp}
          description="total de unidades"
        />
        <MetricCard
          label="Receita total"
          value={
            productStats?.total_revenue != null
              ? `R$ ${productStats.total_revenue.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}`
              : "—"
          }
          icon={ShoppingCart}
        />
        <MetricCard
          label="Avaliação média"
          value={
            productStats?.avg_rating_global != null
              ? `★ ${productStats.avg_rating_global.toFixed(1)}`
              : "—"
          }
          icon={Star}
          description="média geral dos produtos"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Pedidos por mês
            </CardTitle>
          </CardHeader>
          <CardContent>
            {monthlyOrdersData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={monthlyOrdersData} barSize={28}>
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    width={30}
                  />
                  <Tooltip
                    contentStyle={{
                      fontSize: 12,
                      borderRadius: 8,
                      border: "1px solid hsl(var(--border))",
                    }}
                    cursor={{ fill: "hsl(var(--muted))" }}
                  />
                  <Bar
                    dataKey="pedidos"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
                Sem dados de pedidos com data
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Distribuição por status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    innerRadius={40}
                  >
                    {pieData.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={STATUS_COLORS[entry.name] ?? "#94a3b8"}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      fontSize: 12,
                      borderRadius: 8,
                      border: "1px solid hsl(var(--border))",
                    }}
                  />
                  <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
                Sem dados de status
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Top 5 mais vendidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(productStats?.top_products?.length ?? 0) === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                Sem dados de vendas
              </p>
            ) : (
              <div className="space-y-2">
                {productStats!.top_products.map((p: TopProduct, i: number) => (
                  <div key={p.product_id} className="flex items-center gap-3">
                    <span className="w-5 text-xs font-bold text-muted-foreground tabular-nums">
                      #{i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm">{p.product_name}</p>
                      <p className="text-xs text-muted-foreground">
                        R${" "}
                        {p.revenue.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}{" "}
                        em receita
                      </p>
                    </div>
                    <span className="shrink-0 text-sm font-semibold tabular-nums">
                      {p.sales} vendas
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Resumo de avaliações
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg bg-muted/50 p-4">
              <div>
                <p className="text-xs text-muted-foreground">Média geral</p>
                <p className="text-3xl font-bold tabular-nums">
                  {productStats?.avg_rating_global?.toFixed(1) ?? "—"}
                </p>
              </div>
              <Star
                size={36}
                className="fill-amber-400 text-amber-400 opacity-80"
              />
            </div>
            <div className="space-y-1 text-sm text-muted-foreground">
              <div className="flex justify-between">
                <span>Total de produtos</span>
                <span className="font-medium text-foreground tabular-nums">
                  {productStats?.total_products ?? 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Itens vendidos</span>
                <span className="font-medium text-foreground tabular-nums">
                  {productStats?.total_sales ?? 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Receita total</span>
                <span className="font-medium text-foreground tabular-nums">
                  R${" "}
                  {productStats?.total_revenue?.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  }) ?? "0,00"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-40" />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-20" />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-20" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Skeleton className="h-56" />
        <Skeleton className="h-56" />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Skeleton className="h-48" />
        <Skeleton className="h-48" />
      </div>
    </div>
  )
}
