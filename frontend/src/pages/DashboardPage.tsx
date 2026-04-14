import { useMemo } from "react"
import { useOrders } from "@/hooks/useOrders"
import { useProducts } from "@/hooks/useProducts"
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
  Package,
  CheckCircle,
  XCircle,
  Clock,
  Star,
} from "lucide-react"

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
  const { data: orders, isLoading: loadingOrders } = useOrders({ limit: 100 })
  const { data: products, isLoading: loadingProducts } = useProducts({
    limit: 100,
  })

  const stats = useMemo(() => {
    if (!orders) return null
    const total = orders.length
    const entregues = orders.filter((o) => o.status === "entregue").length
    const cancelados = orders.filter((o) => o.status === "cancelado").length
    const emAndamento = orders.filter(
      (o) => !["entregue", "cancelado"].includes(o.status)
    ).length
    const avgDelivery = orders
      .filter((o) => o.delivery_time_days != null)
      .reduce(
        (acc, o, _, arr) => acc + (o.delivery_time_days ?? 0) / arr.length,
        0
      )

    // agrupamento por status para pie chart
    const byStatus = Object.entries(
      orders.reduce<Record<string, number>>((acc, o) => {
        acc[o.status] = (acc[o.status] ?? 0) + 1
        return acc
      }, {})
    ).map(([name, value]) => ({
      name,
      label: STATUS_LABELS[name] ?? name,
      value,
    }))

    // pedidos por mês (últimos 6 meses)
    const byMonth = orders
      .filter((o) => o.order_purchase_timestamp)
      .reduce<Record<string, number>>((acc, o) => {
        const d = new Date(o.order_purchase_timestamp!)
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
        acc[key] = (acc[key] ?? 0) + 1
        return acc
      }, {})

    const monthlyData = Object.entries(byMonth)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([month, count]) => ({
        month: month.slice(5) + "/" + month.slice(2, 4),
        pedidos: count,
      }))

    return {
      total,
      entregues,
      cancelados,
      emAndamento,
      avgDelivery,
      byStatus,
      monthlyData,
    }
  }, [orders])

  const topProducts = useMemo(() => {
    if (!products) return []
    return [...products]
      .filter((p) => (p.total_sales ?? 0) > 0)
      .sort((a, b) => (b.total_sales ?? 0) - (a.total_sales ?? 0))
      .slice(0, 5)
  }, [products])

  const topRated = useMemo(() => {
    if (!products) return []
    return [...products]
      .filter((p) => p.average_rating != null)
      .sort((a, b) => (b.average_rating ?? 0) - (a.average_rating ?? 0))
      .slice(0, 5)
  }, [products])

  if (loadingOrders || loadingProducts) return <DashboardSkeleton />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Visão geral da loja</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <MetricCard
          label="Total de pedidos"
          value={stats?.total ?? 0}
          icon={ShoppingCart}
        />
        <MetricCard
          label="Entregues"
          value={stats?.entregues ?? 0}
          icon={CheckCircle}
          description="pedidos concluídos"
        />
        <MetricCard
          label="Cancelados"
          value={stats?.cancelados ?? 0}
          icon={XCircle}
        />
        <MetricCard
          label="Em andamento"
          value={stats?.emAndamento ?? 0}
          icon={Clock}
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Pedidos por mês */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Pedidos por mês
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(stats?.monthlyData?.length ?? 0) > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={stats!.monthlyData} barSize={28}>
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

        {/* Status dos pedidos */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Distribuição por status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={stats?.byStatus}
                  dataKey="value"
                  nameKey="label"
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  innerRadius={40}
                >
                  {stats?.byStatus.map((entry) => (
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
          </CardContent>
        </Card>
      </div>

      {/* Rankings */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Mais vendidos */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Top 5 mais vendidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topProducts.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                Sem dados de vendas
              </p>
            ) : (
              <div className="space-y-2">
                {topProducts.map((p, i) => (
                  <div key={p.product_id} className="flex items-center gap-3">
                    <span className="w-5 text-xs font-bold text-muted-foreground tabular-nums">
                      #{i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm">{p.product_name}</p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {p.product_category?.replace(/_/g, " ") ?? "—"}
                      </p>
                    </div>
                    <span className="text-sm font-semibold tabular-nums">
                      {p.total_sales} vendas
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Melhor avaliados */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Top 5 melhor avaliados
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topRated.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                Sem avaliações
              </p>
            ) : (
              <div className="space-y-2">
                {topRated.map((p, i) => (
                  <div key={p.product_id} className="flex items-center gap-3">
                    <span className="w-5 text-xs font-bold text-muted-foreground tabular-nums">
                      #{i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm">{p.product_name}</p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {p.product_category?.replace(/_/g, " ") ?? "—"}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star
                        size={12}
                        className="fill-amber-400 text-amber-400"
                      />
                      <span className="text-sm font-semibold tabular-nums">
                        {p.average_rating?.toFixed(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Skeleton className="h-56" />
        <Skeleton className="h-56" />
      </div>
    </div>
  )
}
