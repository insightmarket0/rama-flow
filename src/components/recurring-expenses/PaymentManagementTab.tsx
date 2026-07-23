import { useState } from "react";
import { format } from "date-fns";
import { 
  Building2, Calendar, AlertCircle, CheckCircle2, 
  FileQuestion, Clock, FileText, Search, Copy, BarChart3, Loader2, CreditCard,
  Zap, Plus, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EXPENSE_CATEGORIES } from "@/lib/recurring-expense-categories";
import { formatCurrencyBRL } from "@/lib/format";
import { toast } from "sonner";

// Helpers
const getCategoryLabel = (category: string) => {
  return EXPENSE_CATEGORIES.find((c) => c.value === category)?.label || category;
};

const formatInstallmentDueDate = (value?: string | null) => {
  if (!value) return "Data não informada";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "Data inválida";
  return format(parsed, "dd/MM/yy");
};

const getDaysUntilDue = (dueDate: string) => {
  const due = new Date(dueDate);
  const today = new Date();
  due.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return "Hoje";
  if (diffDays === 1) return "Amanhã";
  if (diffDays === -1) return "Ontem";
  if (diffDays < 0) return `Atrasado há ${Math.abs(diffDays)} dias`;
  return `Faltam ${diffDays} dias`;
};

const getUrgencyLevel = (dueDate: string) => {
  const due = new Date(dueDate);
  const today = new Date();
  due.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return "overdue";
  if (diffDays === 0) return "today";
  if (diffDays <= 7) return "week";
  return "future";
};

const sumValues = (items: any[]) => {
  return items.reduce((acc, curr) => {
    let val = typeof curr.value === "number" ? curr.value : 0;
    if (val === 0 && curr.recurring_expense?.amount) {
        val = curr.recurring_expense.amount;
    }
    return val > 0 ? acc + val : acc;
  }, 0);
};

export function PaymentManagementTab({ 
  smartContracts,
  upcomingInstallments, 
  loadingInstallments, 
  markAsPaid, 
  updateInstallmentValue,
  createInstallment
}: any) {
  
  const [launcherDialogOpen, setLauncherDialogOpen] = useState(false);
  const [selectedLauncherContract, setSelectedLauncherContract] = useState<any | null>(null);
  const [launcherValue, setLauncherValue] = useState("");
  const [launcherDate, setLauncherDate] = useState(new Date().toISOString().split('T')[0]);
  const [launcherError, setLauncherError] = useState<string | null>(null);
  const [isLaunching, setIsLaunching] = useState(false);
  const [selectedInstallment, setSelectedInstallment] = useState<any | null>(null);
  const [valueInput, setValueInput] = useState("");
  const [valueError, setValueError] = useState<string | null>(null);
  const [isSubmittingValue, setIsSubmittingValue] = useState(false);

  const openInlineValue = (installment: any) => {
    setSelectedInstallment(installment);
    setValueInput(installment.value ? installment.value.toString() : "");
    setValueError(null);
  };

  const closeInlineValue = () => {
    setSelectedInstallment(null);
    setValueInput("");
    setValueError(null);
  };

  const handlePaymentWithValue = async () => {
    if (!selectedInstallment) return;
    const parsedValue = Number(valueInput);
      if (!valueInput || isNaN(parsedValue) || parsedValue <= 0) {
        setValueError("Por favor, insira um valor numérico válido.");
        return;
      }
      try {
        setIsSubmittingValue(true);
        await updateInstallmentValue.mutateAsync({ id: selectedInstallment.id, value: parsedValue });
        closeInlineValue();
      } catch (error) {
        console.error(error);
      } finally {
        setIsSubmittingValue(false);
      }
  };



  const handleLaunchInvoice = async () => {
    if (!selectedLauncherContract) return;
    const parsedValue = Number(launcherValue);
    try {
      if (!launcherValue || isNaN(parsedValue) || parsedValue <= 0) {
        setLauncherError("Por favor, insira um valor válido.");
        return;
      }
      if (!launcherDate) {
        setLauncherError("Por favor, insira uma data de vencimento.");
        return;
      }
      setIsLaunching(true);
      await createInstallment.mutateAsync({ 
        smart_contract_id: selectedLauncherContract.id, 
        due_date: launcherDate, 
        value: parsedValue 
      });
      closeLauncherDialog();
    } catch (error) {
      console.error(error);
      setLauncherError("Erro ao lançar fatura.");
    } finally {
      setIsLaunching(false);
    }
  };

  const handlePayClick = (installment: any, needsValue: boolean) => {
    if (needsValue) {
      openInlineValue(installment);
    } else {
      markAsPaid.mutate({ id: installment.id });
      toast.success("Marcado como pago!");
    }
  };

  // Processing Data
  const sortedUpcomingInstallments = upcomingInstallments
    ? [...upcomingInstallments].sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
    : [];

  const currentMonthInstallments = sortedUpcomingInstallments.filter(inst => {
    const due = new Date(inst.due_date);
    const today = new Date();
    return due.getMonth() === today.getMonth() && due.getFullYear() === today.getFullYear();
  });

  const dueWithin7Days = sortedUpcomingInstallments.filter(inst => {
    const level = getUrgencyLevel(inst.due_date);
    return level === "week" || level === "today";
  });

  // Split into Timeline Zones
  const pendingValueInstallments = sortedUpcomingInstallments.filter(inst => {
    const rawValue = typeof inst.value === "number" ? inst.value : null;
    const hasValue = rawValue !== null && rawValue > 0;
    const isVariable = (inst.smart_contract?.value_type ?? "fixed") === "variable";
    const level = getUrgencyLevel(inst.due_date);
    return isVariable && !hasValue && (level === "overdue" || level === "today" || level === "week");
  });

  const urgentInstallments = sortedUpcomingInstallments.filter(inst => {
    if (pendingValueInstallments.includes(inst)) return false;
    const level = getUrgencyLevel(inst.due_date);
    return level === "overdue" || level === "today";
  });
  
  const weekInstallments = sortedUpcomingInstallments.filter(inst => {
    if (pendingValueInstallments.includes(inst)) return false;
    const level = getUrgencyLevel(inst.due_date);
    return level === "week";
  });

  const futureInstallments = sortedUpcomingInstallments.filter(inst => {
    if (pendingValueInstallments.includes(inst)) return false;
    const level = getUrgencyLevel(inst.due_date);
    return level === "future";
  });

  // Calcula o valor mensal real de todos os contratos/contas ativas
  const trueMonthlyBurnRate = (smartContracts || []).reduce((acc: number, expense: any) => {
    if (!expense.is_active) return acc;
    const amount = typeof expense.amount === "number" ? expense.amount : 0;
    
    let divisor = 1;
    if (expense.recurrence_type === "trimestral") divisor = 3;
    if (expense.recurrence_type === "semestral") divisor = 6;
    if (expense.recurrence_type === "anual") divisor = 12;
    if (expense.recurrence_type === "semanal") divisor = 1 / 4.33; // ~4.33 semanas num mês
    
    return acc + (amount / divisor);
  }, 0);

  const totalCurrentMonth = trueMonthlyBurnRate;
  const totalWithin7Days = sumValues(dueWithin7Days);
  const totalOverdue = sumValues(urgentInstallments.filter((i: any) => getUrgencyLevel(i.due_date) === "overdue"));

  // Identify Variable Contracts for Quick Launcher
  const variableContracts = (smartContracts || []).filter((exp: any) => 
    exp.is_active && (exp.value_type === 'variable' || exp.category === 'impostos')
  );

  const renderCard = (inst: any, styleType: 'urgent' | 'variable' | 'normal' | 'future') => {
    const rawValue = typeof inst.value === "number" ? inst.value : null;
    const hasValue = rawValue !== null && rawValue > 0;
    const isVariable = (inst.smart_contract?.value_type ?? "fixed") === "variable";
    const needsValueBeforePayment = inst.status === "aguardando_valor" || (isVariable && inst.status !== "valor_informado");
    const estimatedAmount = inst.smart_contract?.amount || 0;
    
    let parsedNotes = null;
    try {
      if (inst.smart_contract?.notes && inst.smart_contract.notes.startsWith("{")) {
        parsedNotes = JSON.parse(inst.smart_contract.notes);
      }
    } catch (e) {}

    const displayAmount = hasValue ? rawValue : estimatedAmount;

    // Define visual styles based on the type
    const styles = {
      urgent: {
        border: 'border-red-500/30 hover:border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.05)]',
        bg: 'bg-[#111111]/90',
        icon: <AlertCircle className="h-5 w-5 text-red-500" />,
        iconBg: 'bg-red-500/10 text-red-500',
        badge: <Badge variant="outline" className="text-[9px] uppercase tracking-widest border-red-500/40 text-red-500 bg-red-500/10 animate-pulse">{getDaysUntilDue(inst.due_date)}</Badge>
      },
      variable: {
        border: 'border-yellow-500/30 border-dashed hover:border-yellow-500/50',
        bg: 'bg-[#111111]/80',
        icon: <FileQuestion className="h-5 w-5 text-yellow-500" />,
        iconBg: 'bg-yellow-500/10 text-yellow-500',
        badge: <Badge variant="outline" className="text-[11px] font-medium uppercase tracking-widest border-yellow-500/30 text-yellow-500 bg-yellow-500/10">Fatura Pendente</Badge>
      },
      normal: {
        border: 'border-white/10 hover:border-white/20',
        bg: 'bg-[#111111]/80',
        icon: <Calendar className="h-5 w-5 text-gray-300" />,
        iconBg: 'bg-white/5 text-gray-300',
        badge: <Badge variant="outline" className="text-[11px] font-medium uppercase tracking-widest border-white/10 text-gray-400 bg-white/5">{getDaysUntilDue(inst.due_date)}</Badge>
      },
      future: {
        border: 'border-white/5 hover:border-white/10',
        bg: 'bg-black/40',
        icon: <Clock className="h-4 w-4 text-gray-600" />,
        iconBg: 'bg-transparent text-gray-600',
        badge: <Badge variant="outline" className="text-[11px] font-medium uppercase tracking-widest border-transparent text-gray-500">{formatInstallmentDueDate(inst.due_date)}</Badge>
      }
    }[styleType];

    return (
      <Sheet key={inst.id}>
        <Card className={`transition-all duration-300 backdrop-blur-sm overflow-hidden ${styles.border} ${styles.bg}`}>
          <div className="p-4">
            {/* Header + Value Row */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3 max-w-[70%]">
                <div className={`p-1.5 rounded-md shrink-0 ${styles.iconBg}`}>
                  {styles.icon}
                </div>
                <div className="min-w-0">
                  <h3 className="text-white text-sm font-medium truncate">
                    {parsedNotes?.split_name ? `${inst.smart_contract?.name} - ${parsedNotes.split_name}` : (inst.smart_contract?.name || "Despesa")}
                  </h3>
                  <p className="text-gray-400 text-[9px] uppercase tracking-widest truncate mt-0.5">
                    {getCategoryLabel(inst.smart_contract?.category || "")}
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0 flex flex-col items-end gap-1">
                <div className={`text-lg font-light leading-none ${!hasValue && isVariable ? 'text-gray-500' : 'text-white'}`}>
                  {!hasValue && isVariable ? `~${formatCurrencyBRL(displayAmount || 0)}` : formatCurrencyBRL(displayAmount || 0)}
                </div>
                {styles.badge}
              </div>
            </div>

            {/* Actions Row */}
            {selectedInstallment?.id === inst.id ? (
              <div className="flex flex-col gap-2 pt-2 mt-2 border-t border-white/5 w-full">
                <div className="flex gap-2 items-center w-full bg-black/30 p-1.5 rounded-lg border border-white/5 shadow-inner">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[11px] text-gray-500 font-medium">R$</span>
                    <Input 
                      type="number" 
                      step="0.01"
                      autoFocus
                      className="h-8 pl-9 text-sm font-medium bg-transparent border-0 text-white focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-700 w-full [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      placeholder="0.00"
                      value={valueInput}
                      onChange={(e) => setValueInput(e.target.value)}
                      onKeyDown={(e) => {
                         if (e.key === 'Enter') handlePaymentWithValue();
                         if (e.key === 'Escape') closeInlineValue();
                      }}
                    />
                  </div>
                  <Button 
                    size="sm"
                    className="h-8 px-4 bg-white hover:bg-gray-200 text-black shrink-0 font-bold text-[10px] tracking-wider uppercase shadow-[0_0_15px_rgba(255,255,255,0.15)] rounded-md transition-all"
                    onClick={(e) => { e.stopPropagation(); handlePaymentWithValue(); }}
                    disabled={isSubmittingValue || !valueInput}
                  >
                    {isSubmittingValue ? <Loader2 className="h-3 w-3 animate-spin" /> : "Salvar"}
                  </Button>
                  <Button 
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-md shrink-0 transition-colors"
                    onClick={(e) => { e.stopPropagation(); closeInlineValue(); }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                {valueError && <p className="text-red-400 text-[10px] font-medium px-1">{valueError}</p>}
              </div>
            ) : (
              <div className="flex gap-2 pt-1 border-t border-white/5 mt-3">
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full h-8 border-white/10 bg-white/5 hover:bg-white/10 text-gray-300 text-xs">
                    Detalhes
                  </Button>
                </SheetTrigger>
                
                {needsValueBeforePayment ? (
                  <Button 
                    size="sm"
                    className="w-full h-8 bg-white hover:bg-gray-200 text-black shadow-[0_0_10px_rgba(255,255,255,0.2)] font-semibold text-xs px-2 transition-all"
                    onClick={(e) => { e.stopPropagation(); handlePayClick(inst, true); }}
                  >
                    Informar Valor
                  </Button>
                ) : (
                  <Button 
                    size="sm"
                    className="w-full h-8 bg-[#00FF00] hover:bg-[#00FF00]/80 text-black font-semibold shadow-[0_0_10px_rgba(0,255,0,0.2)] text-xs px-2"
                    onClick={(e) => { e.stopPropagation(); handlePayClick(inst, false); }}
                    disabled={markAsPaid.isPending}
                  >
                    {markAsPaid.isPending ? <Loader2 className="animate-spin h-3 w-3 mr-1" /> : "Pagar Agora"}
                  </Button>
                )}
              </div>
            )}
          </div>
        </Card>

        {/* The Drawer Content */}
        <SheetContent className="bg-[#111111] border-l border-white/5 text-white w-full sm:max-w-md">
          <SheetHeader className="pb-6 border-b border-white/10">
            <SheetTitle className="text-2xl font-light text-white">{inst.smart_contract?.name}</SheetTitle>
            <SheetDescription className="text-gray-400">
              Vencimento: {formatInstallmentDueDate(inst.due_date)} • {getCategoryLabel(inst.smart_contract?.category || "")}
            </SheetDescription>
          </SheetHeader>
          <div className="py-6 space-y-8">
            <div className="space-y-3">
              <div className="text-sm font-medium text-gray-500 uppercase tracking-widest">Valor da Conta</div>
              {isVariable && !hasValue ? (
                <div className="bg-white/5 p-4 rounded-xl border border-dashed border-gray-600 space-y-3">
                  <div className="text-3xl font-light text-gray-400">~ {formatCurrencyBRL(estimatedAmount)}</div>
                  <p className="text-xs text-gray-500">Valor baseado na média/estimativa. Aguardando fatura oficial.</p>
                  <Button onClick={() => openInlineValue(inst)} className="w-full bg-white/10 hover:bg-white/20 text-white border-0">
                    <FileQuestion className="mr-2 h-4 w-4" /> Informar Valor Real
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
                  <div className="flex flex-col">
                    <span className="text-3xl font-light text-[#00FF00]">{formatCurrencyBRL(rawValue ?? 0)}</span>
                    {isVariable && <span className="text-xs text-gray-500 mt-1">Valor base estimado</span>}
                  </div>
                  {inst.status !== "pago" && (
                    <Button variant="outline" className="border-white/10 bg-black/20 hover:bg-white/10 text-white shrink-0" onClick={() => openValueDialog(inst)}>
                      Alterar
                    </Button>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="text-sm font-medium text-gray-500 uppercase tracking-widest">Ações Executivas</div>
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  className="h-14 border-white/10 bg-white/5 hover:bg-white/10 flex flex-col gap-1 text-gray-300"
                  onClick={() => {
                    if (parsedNotes?.pix_key || parsedNotes?.barcode) {
                      navigator.clipboard.writeText(parsedNotes.pix_key || parsedNotes.barcode);
                      toast.success("Copiado com sucesso!");
                    } else {
                      toast.error("Nenhum código cadastrado.");
                    }
                  }}
                >
                  <Copy className="h-4 w-4" />
                  <span className="text-xs">Copiar Código</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-14 border-white/10 bg-white/5 hover:bg-white/10 flex flex-col gap-1 text-gray-300"
                  onClick={() => toast.info("Visualizador de PDF em desenvolvimento.")}
                >
                  <FileText className="h-4 w-4" />
                  <span className="text-xs">Ver Fatura</span>
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-sm font-medium text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Histórico (Últimos 3 meses)
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/5 h-32 flex items-end justify-around gap-2">
                {[0.8, 1.1, 0.9, 1.0].map((v, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 w-full group">
                    <div className="text-[10px] text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      {formatCurrencyBRL((estimatedAmount || 100) * v)}
                    </div>
                    <div 
                      className="w-full bg-[#00FF00]/20 rounded-t-sm transition-all relative overflow-hidden" 
                      style={{ height: `${v * 60}%`, minHeight: '10%' }}
                    >
                      <div className="absolute bottom-0 w-full bg-[#00FF00] opacity-50" style={{ height: '100%' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {needsValueBeforePayment ? (
              <Button 
                className="w-full h-12 bg-white hover:bg-gray-200 text-black shadow-[0_0_15px_rgba(255,255,255,0.2)] font-bold text-lg transition-all"
                onClick={() => handlePayClick(inst, true)}
              >
                Informar Valor
              </Button>
            ) : inst.status !== "pago" ? (
              <Button 
                className="w-full h-12 bg-[#00FF00] hover:bg-[#00FF00]/80 text-black font-bold text-lg"
                onClick={() => handlePayClick(inst, false)}
                disabled={markAsPaid.isPending}
              >
                {markAsPaid.isPending ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : "Confirmar Pagamento"}
              </Button>
            ) : null}
          </div>
        </SheetContent>
      </Sheet>
    );
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Top KPIs */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-[#111111]/80 backdrop-blur-sm border-t border-[#00FF00]/30 border-x-[#00FF00]/10 border-b-[#00FF00]/10 shadow-[0_0_15px_rgba(0,255,0,0.05)] rounded-2xl overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00FF00]/5 to-transparent opacity-50 z-0"></div>
          <CardHeader className="relative z-10 pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-[#00FF00]/80 text-sm font-medium uppercase tracking-widest flex items-center gap-2">
                <Building2 className="h-4 w-4" /> Despesas do Mês
              </CardTitle>
            </div>
            <CardDescription className="text-gray-400">Soma total dos seus custos fixos</CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-light text-[#00FF00] drop-shadow-[0_0_15px_rgba(0,255,0,0.2)] mb-4">
              {formatCurrencyBRL(totalCurrentMonth)}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Gasto Médio Diário: {formatCurrencyBRL(totalCurrentMonth / 30)}</span>
                <span className="text-[#00FF00] font-medium">Dentro do Limite</span>
              </div>
              <div className="h-1 w-full bg-black/40 rounded-full overflow-hidden shadow-inner">
                <div className="h-full bg-gradient-to-r from-[#00FF00] to-emerald-400" style={{ width: '80%' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#111111]/80 backdrop-blur-sm border-white/10 hover:border-white/20 transition-all rounded-2xl overflow-hidden relative group">
          <CardHeader className="relative z-10 pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-gray-300 text-sm font-medium uppercase tracking-widest flex items-center gap-2">
                <Calendar className="h-4 w-4" /> Próximos 7 Dias
              </CardTitle>
            </div>
            <CardDescription className="text-gray-400">Caixa necessário para a semana</CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-light text-white mb-4">
              {formatCurrencyBRL(totalWithin7Days)}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Contas na semana</span>
                <span className="text-gray-300 font-medium">{dueWithin7Days.length} obrigações</span>
              </div>
              <div className="h-1 w-full bg-black/40 rounded-full overflow-hidden shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-gray-500 to-gray-300 transition-all duration-1000" 
                  style={{ width: `${Math.min(100, totalCurrentMonth > 0 ? (totalWithin7Days / totalCurrentMonth) * 100 : 0)}%` }} 
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`backdrop-blur-sm rounded-2xl overflow-hidden relative group transition-all ${totalOverdue > 0 ? "bg-[#111111]/90 border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.1)]" : "bg-[#111111]/80 border-white/5"}`}>
          {totalOverdue > 0 && <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-50 z-0"></div>}
          <CardHeader className="relative z-10 pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className={`text-sm font-medium uppercase tracking-widest flex items-center gap-2 ${totalOverdue > 0 ? "text-red-500" : "text-gray-500"}`}>
                <AlertCircle className="h-4 w-4" /> Em Atraso
              </CardTitle>
            </div>
            <CardDescription className="text-gray-400">{totalOverdue > 0 ? "Atenção imediata requerida" : "Tudo em dia"}</CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className={`text-3xl font-light mb-4 ${totalOverdue > 0 ? "text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.3)]" : "text-white"}`}>
              {formatCurrencyBRL(totalOverdue)}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Contas atrasadas</span>
                <span className={`${totalOverdue > 0 ? "text-red-500" : "text-gray-500"} font-medium`}>
                  {urgentInstallments.filter((i: any) => getUrgencyLevel(i.due_date) === "overdue").length} pendências
                </span>
              </div>
              <div className="h-1 w-full bg-black/40 rounded-full overflow-hidden shadow-inner">
                <div className={`h-full ${totalOverdue > 0 ? "bg-gradient-to-r from-red-600 to-red-400" : "bg-gray-600"}`} style={{ width: totalOverdue > 0 ? '100%' : '0%' }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>



      {loadingInstallments ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 pt-8">
          <Skeleton className="h-48 w-full bg-white/5" />
          <Skeleton className="h-48 w-full bg-white/5" />
          <Skeleton className="h-48 w-full bg-white/5" />
        </div>
      ) : !sortedUpcomingInstallments || sortedUpcomingInstallments.length === 0 ? (
        <div className="text-center py-16 bg-[#111111]/50 border border-white/5 rounded-2xl">
          <CheckCircle2 className="h-12 w-12 mx-auto text-[#00FF00] mb-3 opacity-80" />
          <h3 className="font-semibold text-white mb-1">Fluxo Limpo</h3>
          <p className="text-sm text-gray-500">Sem contas para os próximos 60 dias.</p>
        </div>
      ) : (
        <div className="space-y-12">
          
          {/* Zona de Ação Imediata */}
          {urgentInstallments.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-red-500/20 pb-2 mt-8">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <h2 className="text-lg font-light text-red-500 tracking-tight">Ação Imediata (Vencem Hoje & Atrasados)</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {urgentInstallments.map(inst => renderCard(inst, 'urgent'))}
              </div>
            </div>
          )}

          {/* Aguardando Fatura */}
          {pendingValueInstallments.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-yellow-500/20 pb-2 mt-8">
                <FileQuestion className="h-5 w-5 text-yellow-500" />
                <h2 className="text-lg font-light text-yellow-500 tracking-tight">Aguardando Fatura Oficial (Variáveis)</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {pendingValueInstallments.map(inst => renderCard(inst, 'variable'))}
              </div>
            </div>
          )}

          {/* Próximos 7 Dias */}
          {weekInstallments.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-white/10 pb-2 mt-8">
                <Calendar className="h-5 w-5 text-gray-300" />
                <h2 className="text-lg font-light text-white tracking-tight">Próximos 7 Dias</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {weekInstallments.map(inst => renderCard(inst, 'normal'))}
              </div>
            </div>
          )}

          {/* Restante do Mês / Futuro */}
          {futureInstallments.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-white/5 pb-2 mt-8">
                <Clock className="h-5 w-5 text-gray-600" />
                <h2 className="text-lg font-light text-gray-400 tracking-tight">Próximos Lançamentos (Visão Estendida)</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 opacity-80">
                {futureInstallments.map(inst => renderCard(inst, 'future'))}
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
