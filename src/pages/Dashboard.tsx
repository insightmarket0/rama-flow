import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Plus, TrendingUp, AlertCircle, ShoppingCart, Users, BarChart3, CalendarClock, Wallet } from "lucide-react";
import { format, parseISO } from "date-fns";
import { useDashboard } from "@/hooks/useDashboard";
import {
  InstallmentStatus,
  InstallmentWithRelations,
} from "@/hooks/useInstallments";
import { formatCurrencyBRL, formatNumberBR } from "@/lib/format";
import { OnboardingChecklist } from "@/components/onboarding/OnboardingChecklist";
import { EmptyState } from "@/components/layout/EmptyState";
import { dispatchAppEvent, OPEN_ORDER_DIALOG_EVENT } from "@/lib/events";

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

const chartConfig = {
  variaveis: {
    label: "Variáveis",
    color: "hsl(var(--chart-1))",
  },
  fixas: {
    label: "Fixas",
    color: "hsl(var(--chart-2))",
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
        {formatCurrencyBRL(installment.value)}
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
      title: "Projeção de Caixa (30 dias)",
      icon: TrendingUp,
      color: "text-secondary",
      value: data ? formatCurrencyBRL(data.metrics.cashProjectionNext30Days) : null,
    },
    {
      title: "Despesas Variáveis (30 dias)",
      icon: Wallet,
      color: "text-accent",
      value: data ? formatCurrencyBRL(data.metrics.upcomingVariable30DaysTotal) : null,
    },
    {
      title: "Despesas Fixas (mês atual)",
      icon: CalendarClock,
      color: "text-primary",
      value: data ? formatCurrencyBRL(data.metrics.recurringMonthlyTotal) : null,
    },
    {
      title: "Parcelas Vencidas",
      icon: AlertCircle,
      color: "text-destructive",
      value: data ? formatNumberBR(data.metrics.overdueCount) : null,
    },
    {
      title: "Pedidos em Aberto",
      icon: ShoppingCart,
      color: "text-muted-foreground",
      value: data ? formatNumberBR(data.metrics.openOrdersCount) : null,
    },
    {
      title: "Fornecedores Ativos",
      icon: Users,
      color: "text-muted-foreground",
      value: data ? formatNumberBR(data.metrics.activeSuppliersCount) : null,
    },
  ];

  const chartData = data?.variableVsFixedChart ?? [];
  const chartHasData = chartData.some((item) => item.variaveis > 0 || item.fixas > 0);

  return (
    <div className="space-y-6">
      <OnboardingChecklist />
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Visão geral das suas finanças
          </p>
        </div>
        <Button
          className="bg-accent hover:bg-accent/90 text-accent-foreground"
          onClick={() => dispatchAppEvent(OPEN_ORDER_DIALOG_EVENT)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Pedido
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-6">
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
            <CardTitle>Variáveis vs Fixas (Próximas Semanas)</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : chartHasData ? (
              <>
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
                          formatter={(value, seriesKey) => [
                            formatCurrencyBRL(value as number),
                            seriesKey === "variaveis" ? "Variáveis" : "Fixas",
                          ]}
                        />
                      }
                    />
                    <ChartLegend
                      content={<ChartLegendContent />}
                      wrapperStyle={{ paddingTop: 12 }}
                    />
                    <Bar
                      dataKey="variaveis"
                      fill="var(--color-variaveis)"
                      radius={[6, 6, 0, 0]}
                    />
                    <Bar
                      dataKey="fixas"
                      fill="var(--color-fixas)"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ChartContainer>
              </>
            ) : (
              <EmptyState
                className="h-64"
                icon={<BarChart3 className="h-6 w-6" />}
                title="Sem valores previstos"
                description="Cadastre pedidos ou contas fixas para ver projeções aqui."
                action={
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => dispatchAppEvent(OPEN_ORDER_DIALOG_EVENT)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Criar pedido
                  </Button>
                }
              />
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
              <EmptyState
                icon={<CalendarClock className="h-6 w-6" />}
                title="Sem vencimentos próximos"
                description="As parcelas aparecerão aqui quando estiverem próximas do vencimento."
              />
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
