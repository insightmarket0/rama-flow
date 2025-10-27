import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, CalendarClock, ClipboardList, ShoppingCart, X } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useCriticalIndicators } from "@/hooks/useCriticalIndicators";

type AlertKey = "overdue-installments" | "overdue-recurring" | "open-orders" | "open-quotations";

const STORAGE_KEY = "rama-flow.dismissed-alerts";

interface DismissState {
  [key: string]: boolean;
}

export const GlobalAlerts = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useCriticalIndicators();

  const [dismissed, setDismissed] = useState<DismissState>(() => {
    if (typeof window === "undefined") return {};
    try {
      const stored = window.sessionStorage.getItem(STORAGE_KEY);
      return stored ? (JSON.parse(stored) as DismissState) : {};
    } catch (error) {
      console.warn("Erro ao carregar preferências de alertas", error);
      return {};
    }
  });

  useEffect(() => {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(dismissed));
    } catch (error) {
      console.warn("Erro ao persistir preferências de alertas", error);
    }
  }, [dismissed]);

  const alerts = useMemo(() => {
    if (!data) return [];

    const items: Array<{
      id: AlertKey;
      title: string;
      description: string;
      actionLabel: string;
      icon: React.ComponentType<{ className?: string }>;
      onAction: () => void;
    }> = [];

    if (data.overdueInstallments > 0) {
      items.push({
        id: "overdue-installments",
        title: `Você tem ${data.overdueInstallments} parcela(s) em atraso`,
        description: "Revise o fluxo de caixa e renegocie com fornecedores para evitar juros.",
        actionLabel: "Ver contas",
        icon: AlertTriangle,
        onAction: () => navigate("/contas"),
      });
    }

    if (data.overdueRecurringInstallments > 0) {
      items.push({
        id: "overdue-recurring",
        title: `Há ${data.overdueRecurringInstallments} despesa(s) fixa(s) atrasada(s)`,
        description: "Verifique assinaturas e custos recorrentes que precisam de atenção imediata.",
        actionLabel: "Contas fixas",
        icon: CalendarClock,
        onAction: () => navigate("/contas-fixas"),
      });
    }

    if (data.openOrders > 0) {
      items.push({
        id: "open-orders",
        title: `${data.openOrders} pedido(s) aguardando conclusão`,
        description: "Finalize pedidos para liberar pagamento e entrega aos fornecedores.",
        actionLabel: "Ir para pedidos",
        icon: ShoppingCart,
        onAction: () => navigate("/pedidos"),
      });
    }

    if (data.openQuotations > 0) {
      items.push({
        id: "open-quotations",
        title: `${data.openQuotations} cotação(ões) aguardando decisão`,
        description: "Compare as propostas recebidas e aprove a melhor oferta.",
        actionLabel: "Cotações",
        icon: ClipboardList,
        onAction: () => navigate("/quotations"),
      });
    }

    return items;
  }, [data, navigate]);

  if (isLoading || !alerts.length) return null;

  const activeAlerts = alerts.filter((alert) => !dismissed[alert.id]);
  if (!activeAlerts.length) return null;

  return (
    <div className="space-y-3">
      {activeAlerts.map((alert) => (
        <Alert key={alert.id} variant="default" className="border-primary/40 bg-primary/5">
          <div className="flex items-start gap-3">
            <alert.icon className="mt-0.5 h-5 w-5 text-primary" />
            <div className="flex-1 space-y-1">
              <AlertTitle className="font-semibold text-primary">{alert.title}</AlertTitle>
              <AlertDescription className="text-muted-foreground text-sm">
                {alert.description}
              </AlertDescription>
              <div className="pt-2">
                <Button size="sm" onClick={alert.onAction}>
                  {alert.actionLabel}
                </Button>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={() => setDismissed((prev) => ({ ...prev, [alert.id]: true }))}
              aria-label="Ignorar alerta"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </Alert>
      ))}
    </div>
  );
};
