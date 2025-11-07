import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/layout/EmptyState";
import { RecurringExpenseDialog } from "@/components/recurring-expenses/RecurringExpenseDialog";
import { useRecurringExpenses } from "@/hooks/useRecurringExpenses";
import { useRecurringExpenseInstallments } from "@/hooks/useRecurringExpenseInstallments";
import { formatCurrencyBRL } from "@/lib/format";
import { FEATURE_TAX_DESCRIPTION } from "@/lib/features";
import { EXPENSE_CATEGORIES } from "@/lib/recurring-expense-categories";
import { 
  Plus, 
  Calendar, 
  DollarSign, 
  Trash2, 
  Pause, 
  Play,
  CheckCircle2,
  Clock,
  AlertCircle
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function ContasFixas() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { recurringExpenses, isLoading: loadingExpenses, deleteRecurringExpense, updateRecurringExpense } = useRecurringExpenses();
  const { upcomingInstallments, isLoading: loadingInstallments, markAsPaid } = useRecurringExpenseInstallments();

  const getCategoryIcon = (category: string) => {
    const cat = EXPENSE_CATEGORIES.find((c) => c.value === category);
    if (!cat) return <DollarSign className="h-5 w-5" />;
    const IconComponent = LucideIcons[cat.icon as keyof typeof LucideIcons] as LucideIcon | undefined;
    return IconComponent ? <IconComponent className="h-5 w-5" /> : <DollarSign className="h-5 w-5" />;
  };

  const getCategoryLabel = (category: string) => {
    return EXPENSE_CATEGORIES.find((c) => c.value === category)?.label || category;
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive"; icon: LucideIcon }> = {
      pendente: { variant: "secondary", icon: Clock },
      atrasado: { variant: "destructive", icon: AlertCircle },
      pago: { variant: "default", icon: CheckCircle2 },
    };
    const config = variants[status] || variants.pendente;
    const Icon = config.icon;
    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    await updateRecurringExpense.mutateAsync({
      id,
      is_active: !currentStatus,
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta conta fixa?")) {
      await deleteRecurringExpense.mutateAsync(id);
    }
  };

  const totalUpcoming = upcomingInstallments?.reduce((sum, inst) => sum + Number(inst.value), 0) || 0;
  const formatInstallmentDueDate = (value?: string | null) => {
    if (!value) {
      return "Data não informada";
    }

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return "Data inválida";
    }

    return format(parsed, "dd 'de' MMMM", { locale: ptBR });
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Contas Fixas</h1>
            <p className="text-muted-foreground">Gerencie suas despesas recorrentes</p>
          </div>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Conta Fixa
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Lado Esquerdo - Lista de Contas Fixas */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Contas Fixas Cadastradas</CardTitle>
                <CardDescription>
                  {recurringExpenses?.length || 0} {recurringExpenses?.length === 1 ? "conta cadastrada" : "contas cadastradas"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {loadingExpenses ? (
                  <>
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
                        <Skeleton className="h-12 w-12 rounded-lg" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-5 w-48" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                        <Skeleton className="h-8 w-24" />
                      </div>
                    ))}
                  </>
                ) : !recurringExpenses || recurringExpenses.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Nenhuma conta fixa cadastrada</h3>
                    <p className="text-sm text-muted-foreground mb-4">Crie sua primeira conta fixa para começar a gerenciar despesas recorrentes</p>
                    <Button onClick={() => setDialogOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Nova Conta Fixa
                    </Button>
                  </div>
                ) : (
                  <>
                    {recurringExpenses.map((expense) => (
                      <div
                        key={expense.id}
                        className={`flex items-start gap-4 p-4 border rounded-lg transition-all hover:shadow-md ${
                          !expense.is_active ? "opacity-60" : ""
                        }`}
                      >
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          {getCategoryIcon(expense.category)}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{expense.name}</h3>
                            {!expense.is_active && (
                              <Badge variant="outline">Pausada</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {getCategoryLabel(expense.category)} • Vence dia {expense.due_day} • {expense.recurrence_type}
                          </p>
                          {FEATURE_TAX_DESCRIPTION && expense.category === "impostos" && expense.tax_description && (
                            <p className="text-xs text-muted-foreground">
                              Imposto: {expense.tax_description}
                            </p>
                          )}
                          {expense.supplier && (
                            <p className="text-xs text-muted-foreground">
                              Fornecedor: {expense.supplier.name}
                            </p>
                          )}
                        </div>
                        <div className="text-right space-y-2">
                          <p className="text-lg font-bold">{formatCurrencyBRL(Number(expense.amount))}</p>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleToggleActive(expense.id, expense.is_active || false)}
                            >
                              {expense.is_active ? (
                                <Pause className="h-4 w-4" />
                              ) : (
                                <Play className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete(expense.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Lado Direito - Próximos Vencimentos */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Próximos Vencimentos</CardTitle>
                <CardDescription>Próximos 60 dias</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {loadingInstallments ? (
                  <>
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-20 w-full" />
                    ))}
                  </>
                ) : !upcomingInstallments || upcomingInstallments.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle2 className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                    <h3 className="font-semibold mb-1">Nenhum vencimento</h3>
                    <p className="text-sm text-muted-foreground">Não há contas fixas para pagar nos próximos 60 dias</p>
                  </div>
                ) : (
                  <>
                    <div className="p-4 bg-accent/20 rounded-lg border border-accent">
                      <p className="text-sm text-muted-foreground">Total a pagar</p>
                      <p className="text-2xl font-bold text-accent">{formatCurrencyBRL(totalUpcoming)}</p>
                    </div>

                    <div className="space-y-3">
                      {upcomingInstallments.map((inst) => (
                        <div
                          key={inst.id}
                          className="p-3 border rounded-lg space-y-2 hover:shadow-sm transition-shadow"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <p className="font-medium text-sm">
                                {inst.recurring_expense?.name || "Despesa"}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {formatInstallmentDueDate(inst.due_date)}
                              </p>
                            </div>
                            {getStatusBadge(inst.status || "pendente")}
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="font-bold text-accent">{formatCurrencyBRL(Number(inst.value))}</p>
                            {inst.status !== "pago" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => markAsPaid.mutateAsync(inst.id)}
                              >
                                <CheckCircle2 className="mr-1 h-3 w-3" />
                                Pagar
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <RecurringExpenseDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
}
