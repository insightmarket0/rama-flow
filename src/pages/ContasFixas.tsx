import { useState, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RecurringExpenseDialog } from "@/components/recurring-expenses/RecurringExpenseDialog";
import { useRecurringExpenses } from "@/hooks/useRecurringExpenses";
import { useRecurringExpenseInstallments } from "@/hooks/useRecurringExpenseInstallments";
import { formatCurrencyBRL } from "@/lib/format";
import { FEATURE_TAX_DESCRIPTION } from "@/lib/features";
import { EXPENSE_CATEGORIES } from "@/lib/recurring-expense-categories";
import { Tables } from "@/integrations/supabase/types";
import { 
  Plus, 
  Calendar, 
  DollarSign, 
  Trash2, 
  Pause, 
  Play,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileQuestion,
  Loader2,
  Check,
  X
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

type RecurringExpenseItem = Tables<"recurring_expenses"> & {
  supplier?: { id: string; name: string } | null;
};

type RecurringExpenseInstallmentItem = Tables<"recurring_expense_installments"> & {
  recurring_expense?: { name: string; category: string } | null;
  supplier?: { name: string } | null;
};

export default function ContasFixas() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { recurringExpenses, isLoading: loadingExpenses, deleteRecurringExpense, updateRecurringExpense } = useRecurringExpenses();
  const { upcomingInstallments, isLoading: loadingInstallments, markAsPaid } = useRecurringExpenseInstallments();
  const [valueDialogOpen, setValueDialogOpen] = useState(false);
  const [selectedInstallment, setSelectedInstallment] = useState<RecurringExpenseInstallmentItem | null>(null);
  const [valueInput, setValueInput] = useState("");
  const [valueError, setValueError] = useState<string | null>(null);
  const [isSubmittingValue, setIsSubmittingValue] = useState(false);
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [editingError, setEditingError] = useState<string | null>(null);
  const [isSavingName, setIsSavingName] = useState(false);

  const getCategoryIcon = (category: string) => {
    const cat = EXPENSE_CATEGORIES.find((c) => c.value === category);
    if (!cat) return <DollarSign className="h-5 w-5" />;
    const IconComponent = LucideIcons[cat.icon as keyof typeof LucideIcons] as LucideIcon | undefined;
    return IconComponent ? <IconComponent className="h-5 w-5" /> : <DollarSign className="h-5 w-5" />;
  };

  const getCategoryLabel = (category: string) => {
    return EXPENSE_CATEGORIES.find((c) => c.value === category)?.label || category;
  };

  const getDueRuleDescription = (expense: RecurringExpenseItem) => {
    const ruleType = expense.due_rule_type ?? "specific_day";
    if (ruleType === "days_after_start") {
      const offset = expense.due_day_offset ?? 0;
      return `${offset} dia${offset === 1 ? "" : "s"} após o início do mês`;
    }
    if (Array.isArray(expense.due_days) && expense.due_days.length > 0) {
      if (expense.due_days.length === 1) return `Vence dia ${expense.due_days[0]}`;
      return `Vence dia ${expense.due_days.join(", ")}`;
    }
    if (expense.due_day) {
      return `Vence dia ${expense.due_day}`;
    }
    return "Regra de vencimento não informada";
  };

  const getValueDisplay = (expense: RecurringExpenseItem) => {
    const isVariable = (expense.value_type ?? "fixed") === "variable";
    if (isVariable) {
      if (typeof expense.amount === "number" && expense.amount > 0) {
        return `${formatCurrencyBRL(Number(expense.amount))} estimado`;
      }
      return "Valor definido quando a fatura chegar";
    }
    const amount = typeof expense.amount === "number" ? Number(expense.amount) : 0;
    return formatCurrencyBRL(amount);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<
      string,
      { variant: "default" | "secondary" | "destructive" | "outline"; icon: LucideIcon; label: string }
    > = {
      pendente: { variant: "secondary", icon: Clock, label: "Pendente" },
      aguardando_valor: { variant: "outline", icon: FileQuestion, label: "Aguardando valor" },
      atrasado: { variant: "destructive", icon: AlertCircle, label: "Atrasado" },
      pago: { variant: "default", icon: CheckCircle2, label: "Pago" },
    };
    const config = variants[status] || variants.pendente;
    const Icon = config.icon;
    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
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

  const totalUpcoming =
    upcomingInstallments?.reduce((sum, inst) => {
      const value = typeof inst.value === "number" ? inst.value : 0;
      return value > 0 ? sum + value : sum;
    }, 0) ?? 0;
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
  const handlePayClick = (installment: RecurringExpenseInstallmentItem, needsValue: boolean) => {
    if (needsValue) {
      openValueDialog(installment);
      return;
    }
    markAsPaid.mutateAsync({ id: installment.id });
  };

  const startEditingName = (expense: RecurringExpenseItem) => {
    setEditingExpenseId(expense.id);
    setEditingName(expense.name);
    setEditingError(null);
  };

  const cancelEditingName = () => {
    setEditingExpenseId(null);
    setEditingName("");
    setEditingError(null);
  };

  const saveEditingName = async () => {
    if (!editingExpenseId) return;
    const trimmed = editingName.trim();
    if (trimmed.length < 3) {
      setEditingError("Informe pelo menos 3 caracteres");
      return;
    }

    try {
      setIsSavingName(true);
      await updateRecurringExpense.mutateAsync({ id: editingExpenseId, name: trimmed });
      cancelEditingName();
    } finally {
      setIsSavingName(false);
    }
  };

  const handleNameKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      saveEditingName();
    }
    if (event.key === "Escape") {
      event.preventDefault();
      cancelEditingName();
    }
  };

  const openValueDialog = (installment: RecurringExpenseInstallmentItem) => {
    setSelectedInstallment(installment);
    setValueInput(installment.value ? installment.value.toString() : "");
    setValueError(null);
    setValueDialogOpen(true);
  };

  const closeValueDialog = () => {
    setValueDialogOpen(false);
    setSelectedInstallment(null);
    setValueInput("");
    setValueError(null);
  };

  const handlePaymentWithValue = async () => {
    if (!selectedInstallment) return;
    const parsedValue = Number(valueInput);
    if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
      setValueError("Informe um valor maior que zero");
      return;
    }

    try {
      setIsSubmittingValue(true);
      await markAsPaid.mutateAsync({ id: selectedInstallment.id, value: parsedValue });
      closeValueDialog();
    } finally {
      setIsSubmittingValue(false);
    }
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
                          <div className="flex flex-col gap-1">
                            <div className="flex flex-wrap items-center gap-2">
                              {editingExpenseId === expense.id ? (
                                <>
                                  <Input
                                    value={editingName}
                                    onChange={(event) => {
                                      setEditingName(event.target.value);
                                      if (editingError) setEditingError(null);
                                    }}
                                    onKeyDown={handleNameKeyDown}
                                    autoFocus
                                    className="h-9 w-full sm:w-64"
                                  />
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={saveEditingName}
                                    disabled={isSavingName}
                                  >
                                    {isSavingName ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <Check className="h-4 w-4" />
                                    )}
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={cancelEditingName}
                                    disabled={isSavingName}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => startEditingName(expense)}
                                  className="font-semibold hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring"
                                >
                                  {expense.name}
                                </button>
                              )}
                              {!expense.is_active && (
                                <Badge variant="outline">Pausada</Badge>
                              )}
                              {(expense.value_type ?? "fixed") === "variable" && (
                                <Badge variant="outline">Valor variável</Badge>
                              )}
                            </div>
                            {editingExpenseId === expense.id && editingError && (
                              <p className="text-xs text-destructive">{editingError}</p>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {getCategoryLabel(expense.category)} • {getDueRuleDescription(expense)} • {expense.recurrence_type}
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
                          <p className="text-lg font-bold">{getValueDisplay(expense)}</p>
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
                      {upcomingInstallments.map((inst) => {
                        const rawValue = typeof inst.value === "number" ? inst.value : null;
                        const hasValue = rawValue !== null && rawValue > 0;
                        const awaitingValue = inst.status === "aguardando_valor";
                        const needsValueBeforePayment = awaitingValue || !hasValue;
                        const isProcessing =
                          markAsPaid.isPending &&
                          ((markAsPaid.variables as { id: string } | undefined)?.id === inst.id);

                        return (
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
                            <div className="flex items-center justify-between gap-3">
                              <p className={`font-bold ${hasValue ? "text-accent" : "text-muted-foreground"}`}>
                                {hasValue ? formatCurrencyBRL(rawValue ?? 0) : "Valor pendente"}
                              </p>
                              {inst.status !== "pago" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handlePayClick(inst, needsValueBeforePayment)}
                                  disabled={isProcessing}
                                >
                                  {isProcessing ? (
                                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                                  ) : (
                                    <CheckCircle2 className="mr-1 h-3 w-3" />
                                  )}
                                  {needsValueBeforePayment ? "Informar e pagar" : "Pagar"}
                                </Button>
                              )}
                            </div>
                            {needsValueBeforePayment && inst.status !== "pago" && (
                              <p className="text-xs text-muted-foreground">
                                Informe o valor real da fatura para concluir o pagamento.
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <RecurringExpenseDialog open={dialogOpen} onOpenChange={setDialogOpen} />

      <Dialog
        open={valueDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            closeValueDialog();
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Informar valor da conta</DialogTitle>
            <DialogDescription>Preencha o valor cobrado antes de confirmar o pagamento.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="font-semibold">
                {selectedInstallment?.recurring_expense?.name || "Despesa"}
              </p>
              <p className="text-xs text-muted-foreground">
                Vencimento {formatInstallmentDueDate(selectedInstallment?.due_date)}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="installment-value">Valor pago</Label>
              <Input
                id="installment-value"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0,00"
                value={valueInput}
                onChange={(event) => setValueInput(event.target.value)}
              />
              {valueError && <p className="text-sm text-destructive">{valueError}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeValueDialog}>
              Cancelar
            </Button>
            <Button onClick={handlePaymentWithValue} disabled={isSubmittingValue}>
              {isSubmittingValue && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar e pagar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
