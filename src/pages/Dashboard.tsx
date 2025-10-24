import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { OrderDialog } from "@/components/orders/OrderDialog";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Plus,
  TrendingUp,
  AlertCircle,
  ShoppingCart,
  Users,
} from "lucide-react";
import { useDashboard } from "@/hooks/useDashboard";
import {
  InstallmentStatus,
  InstallmentWithRelations,
} from "@/hooks/useInstallments";
import { format, parseISO } from "date-fns";

const statusLabels: Record<InstallmentStatus, string> = {
  pendente: "Pendente",
  atrasado: "Atrasado",
  pago: "Pago",
};

const getStatusVariant = (status: InstallmentStatus) => {
  switch (status) {
    case "pago":
      return "default";
    case "atrasado":
      return "destructive";
    default:
      return "secondary";
  }
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

const formatNumber = (value: number) =>
  new Intl.NumberFormat("pt-BR").format(value);

const chartConfig = {
  total: {
    label: "Valor a pagar",
    color: "hsl(var(--chart-1))",
  },
};

const renderUpcomingItem = (installment: InstallmentWithRelations) => (
  <div
    key={installment.id}
    className="flex items-center justify-between gap-4 p-3 bg-muted/50 rounded-lg"
  >
    <div className="flex-1">
      <p className="font-medium text-sm">
        {installment.supplier?.name ?? "Fornecedor não informado"}
      </p>
      <p className="text-xs text-muted-foreground">
        Pedido {installment.order?.order_number ?? "-"} •{" "}
        {installment.installment_number === 0
          ? "Entrada"
          : `Parcela ${installment.installment_number}`}
      </p>
    </div>
    <div className="text-right">
      <p className="font-semibold text-sm">
        {formatCurrency(installment.value)}
      </p>
      <p className="text-xs text-muted-foreground">
        {format(parseISO(installment.due_date), "dd/MM/yyyy")}
      </p>
    </div>
    <Badge variant={getStatusVariant(installment.status)}>
      {statusLabels[installment.status]}
    </Badge>
  </div>
);

const Dashboard = () => {
  const { data, isLoading, isError, refetch } = useDashboard();

  const metrics = [
    {
      title: "Total a Pagar (30 dias)",
      icon: TrendingUp,
      color: "text-secondary",
      value: data ? formatCurrency(data.metrics.upcoming30DaysTotal) : null,
    },
    {
      title: "Parcelas Vencidas",
      icon: AlertCircle,
      color: "text-destructive",
      value: data ? formatNumber(data.metrics.overdueCount) : null,
    },
    {
      title: "Pedidos em Aberto",
      icon: ShoppingCart,
      color: "text-accent",
      value: data ? formatNumber(data.metrics.openOrdersCount) : null,
    },
    {
      title: "Fornecedores Ativos",
      icon: Users,
      color: "text-primary",
      value: data ? formatNumber(data.metrics.activeSuppliersCount) : null,
    },
  ];

  const chartData = data?.chartData ?? [];
  const chartHasData = chartData.some((item) => item.total > 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Visão geral das suas finanças
          </p>
        </div>
        <OrderDialog>
          <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Plus className="h-4 w-4 mr-2" />
            Novo Pedido
          </Button>
        </OrderDialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <Card key={metric.title} className="hover-scale card-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <metric.icon className={`h-5 w-5 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : metric.value !== null ? (
                <div className="text-2xl font-bold">{metric.value}</div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  Erro ao carregar métricas.
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle>Valores a Pagar (Próximas Semanas)</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : chartHasData ? (
              <ChartContainer config={chartConfig} className="h-64 w-full">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="4 4" vertical={false} />
                  <XAxis
                    dataKey="label"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    width={80}
                    tickFormatter={(value) =>
                      new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                        maximumFractionDigits: 0,
                      }).format(value as number)
                    }
                  />
                  <ChartTooltip
                    cursor={{ fill: "rgba(148, 163, 184, 0.12)" }}
                    content={
                      <ChartTooltipContent
                        labelFormatter={(_, payload) =>
                          payload?.[0]?.payload.range ?? ""
                        }
                        formatter={(value) => [
                          formatCurrency(value as number),
                          "Valor a pagar",
                        ]}
                      />
                    }
                  />
                  <Bar
                    dataKey="total"
                    fill="var(--color-total)"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-sm text-muted-foreground text-center">
                Nenhum valor pendente para as próximas semanas.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="card-shadow">
          <CardHeader>
            <CardTitle>Próximos Vencimentos</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} className="h-16 w-full" />
                ))}
              </div>
            ) : data && data.upcomingInstallments.length > 0 ? (
              <div className="space-y-3">
                {data.upcomingInstallments.map(renderUpcomingItem)}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                Nenhuma parcela pendente no momento.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {isError ? (
        <div className="border border-destructive/30 bg-destructive/10 text-destructive rounded-md p-4 text-sm">
          Ocorreu um erro ao carregar os dados.{" "}
          <button
            type="button"
            className="underline font-medium"
            onClick={() => refetch()}
          >
            Tentar novamente
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default Dashboard;
