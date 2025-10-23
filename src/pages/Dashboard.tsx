import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, TrendingUp, AlertCircle, ShoppingCart, Users } from "lucide-react";

const Dashboard = () => {
  const metrics = [
    {
      title: "Total a Pagar (30 dias)",
      value: "R$ 125.450,00",
      icon: TrendingUp,
      color: "text-secondary",
    },
    {
      title: "Parcelas Vencidas",
      value: "3",
      icon: AlertCircle,
      color: "text-destructive",
    },
    {
      title: "Pedidos em Aberto",
      value: "12",
      icon: ShoppingCart,
      color: "text-accent",
    },
    {
      title: "Fornecedores Ativos",
      value: "24",
      icon: Users,
      color: "text-primary",
    },
  ];

  const upcomingPayments = [
    { date: "2025-10-25", supplier: "Fornecedor ABC", order: "#001", value: "R$ 5.500,00", status: "Pendente" },
    { date: "2025-10-27", supplier: "Fornecedor XYZ", order: "#002", value: "R$ 3.200,00", status: "Pendente" },
    { date: "2025-10-30", supplier: "Fornecedor 123", order: "#003", value: "R$ 8.750,00", status: "Atrasado" },
    { date: "2025-11-02", supplier: "Fornecedor DEF", order: "#004", value: "R$ 2.100,00", status: "Pendente" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pago":
        return "text-secondary";
      case "Atrasado":
        return "text-destructive";
      default:
        return "text-accent";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Visão geral das suas finanças</p>
        </div>
        <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Plus className="h-4 w-4 mr-2" />
          Novo Pedido
        </Button>
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
              <div className="text-2xl font-bold">{metric.value}</div>
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
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Gráfico de valores em desenvolvimento</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-shadow">
          <CardHeader>
            <CardTitle>Próximos Vencimentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingPayments.map((payment, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{payment.supplier}</p>
                    <p className="text-xs text-muted-foreground">Pedido {payment.order}</p>
                  </div>
                  <div className="text-right mr-4">
                    <p className="font-semibold text-sm">{payment.value}</p>
                    <p className="text-xs text-muted-foreground">{payment.date}</p>
                  </div>
                  <span className={`text-xs font-medium ${getStatusColor(payment.status)}`}>
                    {payment.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
