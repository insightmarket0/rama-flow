import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, Loader2, Users, CreditCard, ShoppingCart, Wallet, Calendar } from "lucide-react";
import { useOnboardingProgress } from "@/hooks/useOnboardingProgress";
import { useAuth } from "@/hooks/useAuth";
import {
  dispatchAppEvent,
  OPEN_ORDER_DIALOG_EVENT,
  OPEN_PAYMENT_CONDITION_DIALOG_EVENT,
  OPEN_SUPPLIER_DIALOG_EVENT,
} from "@/lib/events";

const buildDismissedKey = (userId?: string | null) => `rama:onboarding-dismissed:${userId ?? "anonymous"}`;
const buildCompletedKey = (userId?: string | null) => `rama:onboarding-complete:${userId ?? "anonymous"}`;

export const OnboardingChecklist = () => {
  const navigate = useNavigate();
  const { counts, isLoading, isFetching } = useOnboardingProgress();
  const { user } = useAuth();

  const dismissedStorageKey = useMemo(() => buildDismissedKey(user?.id), [user?.id]);
  const completedStorageKey = useMemo(() => buildCompletedKey(user?.id), [user?.id]);

  const [hydrated, setHydrated] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [completionAcknowledged, setCompletionAcknowledged] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const dismissed = window.localStorage.getItem(dismissedStorageKey) === "true";
    const completed = window.localStorage.getItem(completedStorageKey) === "true";
    setIsDismissed(dismissed);
    setCompletionAcknowledged(completed);
    setHydrated(true);
  }, [dismissedStorageKey, completedStorageKey]);

  const steps = useMemo(
    () => [
      {
        id: "supplier",
        title: "Cadastre o primeiro fornecedor",
        description: "Registre quem fornece seus produtos ou serviços.",
        actionLabel: "Novo fornecedor",
        icon: Users,
        completed: counts.suppliers > 0,
        onAction: () => dispatchAppEvent(OPEN_SUPPLIER_DIALOG_EVENT),
      },
      {
        id: "payment_condition",
        title: "Configure uma condição de pagamento",
        description: "Defina parcelas e intervalos para os pedidos.",
        actionLabel: "Nova condição",
        icon: CreditCard,
        completed: counts.paymentConditions > 0,
        onAction: () => dispatchAppEvent(OPEN_PAYMENT_CONDITION_DIALOG_EVENT),
      },
      {
        id: "order",
        title: "Crie seu primeiro pedido",
        description: "Lance um pedido para gerar parcelas automaticamente.",
        actionLabel: "Novo pedido",
        icon: ShoppingCart,
        completed: counts.orders > 0,
        onAction: () => dispatchAppEvent(OPEN_ORDER_DIALOG_EVENT),
      },
      {
        id: "recurring_expense",
        title: "Configure uma conta fixa",
        description: "Cadastre despesas recorrentes como aluguel e salários.",
        actionLabel: "Ir para Contas Fixas",
        icon: Calendar,
        completed: counts.recurringExpenses > 0,
        onAction: () => navigate("/contas-fixas"),
      },
    ],
    [counts, navigate],
  );

  const totalSteps = steps.length;
  const completedSteps = steps.filter((step) => step.completed).length;
  const progressValue = Math.round((completedSteps / totalSteps) * 100);
  const allStepsCompleted = completedSteps === totalSteps;

  useEffect(() => {
    if (!allStepsCompleted || typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(completedStorageKey, "true");
  }, [allStepsCompleted, completedStorageKey]);

  const handleDismiss = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(dismissedStorageKey, "true");
    }
    setIsDismissed(true);
  };

  const handleAcknowledgeCompletion = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(completedStorageKey, "true");
    }
    setCompletionAcknowledged(true);
  };

  if (!hydrated) {
    return null;
  }

  if (allStepsCompleted && completionAcknowledged) {
    return null;
  }

  if (allStepsCompleted && !completionAcknowledged) {
    return (
      <Card className="card-shadow border border-primary/30 bg-primary/10">
        <CardHeader className="flex flex-col gap-2">
          <CardTitle className="text-2xl">Parabéns! 🎉</CardTitle>
          <CardDescription>
            Você completou os passos iniciais e já pode aproveitar toda a plataforma. Conte
            conosco para o próximo nível.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button className="self-start" onClick={handleAcknowledgeCompletion}>
            Continuar usando a RAMA
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isDismissed) {
    return null;
  }

  return (
    <Card className="card-shadow border border-muted">
      <CardHeader className="gap-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-xl">Comece em 4 passos</CardTitle>
            <CardDescription>
              Complete a checklist abaixo para dominar o essencial em poucos minutos.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              {completedSteps}/{totalSteps} concluídos
            </span>
            <Button variant="ghost" size="sm" onClick={handleDismiss}>
              Ver depois
            </Button>
          </div>
        </div>
        <Progress value={progressValue} className="h-2" />
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <Skeleton key={index} className="h-16 w-full" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.id}
                  className="flex items-start justify-between gap-3 rounded-lg border border-border/60 bg-muted/50 p-4"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-full bg-background shadow-sm ${
                        step.completed ? "text-rama-success" : "text-muted-foreground"
                      }`}
                    >
                      {step.completed ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <Icon className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{step.title}</p>
                      <p className="text-xs text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant={step.completed ? "outline" : "secondary"}
                    onClick={step.onAction}
                    disabled={step.completed}
                  >
                    {step.completed ? "Concluído" : step.actionLabel}
                  </Button>
                </div>
              );
            })}
          </div>
        )}
        {isFetching && !isLoading ? (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="h-3 w-3 animate-spin" />
            Atualizando progresso...
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};
