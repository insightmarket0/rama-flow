import { useState } from "react";
import { format } from "date-fns";
import { 
  Building2, Calendar, AlertCircle, CheckCircle2, 
  Clock, FileText, Search, Loader2, PackageOpen
} from "lucide-react";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrencyBRL } from "@/lib/format";

// Helpers
const parseLocalDate = (dateStr: string) => {
  if (!dateStr) return new Date();
  const [year, month, day] = dateStr.split('T')[0].split('-');
  return new Date(Number(year), Number(month) - 1, Number(day));
};

const formatInstallmentDueDate = (value?: string | null) => {
  if (!value) return "Data não informada";
  const parsed = parseLocalDate(value);
  if (Number.isNaN(parsed.getTime())) return "Data inválida";
  return format(parsed, "dd/MM/yy");
};

const getDaysUntilDue = (dueDate: string) => {
  const due = parseLocalDate(dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return "Hoje";
  if (diffDays === 1) return "Amanhã";
  if (diffDays === -1) return "Ontem";
  if (diffDays < 0) return `Atrasado há ${Math.abs(diffDays)} dias`;
  return `Faltam ${diffDays} dias`;
};

const getUrgencyLevel = (dueDate: string) => {
  const due = parseLocalDate(dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return "overdue";
  if (diffDays === 0) return "today";
  if (diffDays <= 7) return "week";
  return "future";
};

const sumValues = (items: any[]) => {
  return items.reduce((acc, curr) => {
    const val = typeof curr.value === "number" ? curr.value : 0;
    return val > 0 ? acc + val : acc;
  }, 0);
};

export function PurchasePaymentTab({ 
  installments,
  loadingInstallments, 
  markAsPaid,
  orders,
  onNew
}: any) {
  
  const handlePayClick = (installment: any) => {
    markAsPaid.mutate(installment.id, {
      onSuccess: () => {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#00FF00', '#10B981', '#ffffff']
        });
      }
    });
  };

  // Only consider pending or overdue for the timeline
  const activeInstallments = (installments || []).filter((i: any) => i.status !== "pago");
  
  const sortedUpcomingInstallments = [...activeInstallments].sort(
    (a, b) => parseLocalDate(a.due_date).getTime() - parseLocalDate(b.due_date).getTime()
  );

  const currentMonthInstallments = sortedUpcomingInstallments.filter(inst => {
    const due = parseLocalDate(inst.due_date);
    const today = new Date();
    return due.getMonth() === today.getMonth() && due.getFullYear() === today.getFullYear();
  });

  const dueWithin7Days = sortedUpcomingInstallments.filter(inst => {
    const level = getUrgencyLevel(inst.due_date);
    return level === "week" || level === "today";
  });

  const overdueInstallments = sortedUpcomingInstallments.filter(inst => getUrgencyLevel(inst.due_date) === "overdue");
  const todayInstallments = sortedUpcomingInstallments.filter(inst => getUrgencyLevel(inst.due_date) === "today");
  const weekInstallments = sortedUpcomingInstallments.filter(inst => getUrgencyLevel(inst.due_date) === "week");
  const futureInstallments = sortedUpcomingInstallments.filter(inst => getUrgencyLevel(inst.due_date) === "future");

  const totalCurrentMonth = sumValues(currentMonthInstallments);
  const totalWithin7Days = sumValues(dueWithin7Days);
  const totalDueToday = sumValues(todayInstallments);
  const totalOverdue = sumValues(overdueInstallments);

  const openOrders = (orders || []).filter((o: any) => o.status === "aberto");

  const renderCard = (inst: any, styleType: 'urgent' | 'today' | 'normal' | 'future') => {
    const displayAmount = inst.value || 0;
    const supplierName = inst.supplier?.name || "Fornecedor";
    const orderNumber = inst.order?.order_number || "Pedido";
    const parcelText = `Parcela ${inst.installment_number}`;

    const styles = {
      urgent: {
        border: 'border-red-500/30 hover:border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.05)]',
        bg: 'bg-[#111111]/90',
        icon: <AlertCircle className="h-5 w-5 text-red-500" />,
        iconBg: 'bg-red-500/10 text-red-500',
        badge: <Badge variant="outline" className="text-[9px] uppercase tracking-widest border-red-500/40 text-red-500 bg-red-500/10 animate-pulse">{getDaysUntilDue(inst.due_date)}</Badge>
      },
      today: {
        border: 'border-white/20 hover:border-white/30 shadow-[0_0_15px_rgba(255,255,255,0.03)]',
        bg: 'bg-[#111111]/90',
        icon: <Calendar className="h-5 w-5 text-white" />,
        iconBg: 'bg-white/10 text-white',
        badge: <Badge variant="outline" className="text-[9px] uppercase tracking-widest border-white/40 text-white bg-white/10">HOJE</Badge>
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
      <Card key={inst.id} className={`transition-all duration-300 backdrop-blur-sm overflow-hidden ${styles.border} ${styles.bg}`}>
        <div className="p-4 flex flex-col h-full justify-between">
          <div>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3 max-w-[70%]">
                <div className={`p-1.5 rounded-md shrink-0 ${styles.iconBg}`}>
                  {styles.icon}
                </div>
                <div className="min-w-0">
                  <h3 className="text-white text-sm font-medium truncate">
                    {supplierName}
                  </h3>
                  <p className="text-gray-400 text-[9px] uppercase tracking-widest truncate mt-0.5">
                    {orderNumber} • {parcelText}
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0 flex flex-col items-end gap-1">
                <div className="text-lg font-light leading-none text-white">
                  {formatCurrencyBRL(displayAmount)}
                </div>
                {styles.badge}
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 pt-2 border-t border-white/5 mt-3">
            <Button 
              size="sm"
              className="w-full h-8 bg-white hover:bg-gray-200 text-black font-semibold shadow-[0_0_10px_rgba(255,255,255,0.1)] text-xs px-2 transition-all"
              onClick={() => handlePayClick(inst)}
              disabled={markAsPaid.isPending}
            >
              {markAsPaid.isPending ? <Loader2 className="animate-spin h-3 w-3 mr-1" /> : "Marcar como Pago"}
            </Button>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Top KPIs */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-[#111111]/80 backdrop-blur-sm border-t border-[#00FF00]/30 border-x-[#00FF00]/10 border-b-[#00FF00]/10 shadow-[0_0_15px_rgba(0,255,0,0.05)] rounded-2xl overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00FF00]/5 to-transparent opacity-50 z-0"></div>
          <CardHeader className="relative z-10 pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-[#00FF00]/80 text-sm font-medium uppercase tracking-widest flex items-center gap-2">
                <Building2 className="h-4 w-4" /> Compras do Mês
              </CardTitle>
            </div>
            <CardDescription className="text-gray-400">Total a pagar neste mês</CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-light text-[#00FF00] drop-shadow-[0_0_15px_rgba(0,255,0,0.2)] mb-4">
              {formatCurrencyBRL(totalCurrentMonth)}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Boletos no mês</span>
                <span className="text-[#00FF00] font-medium">{currentMonthInstallments.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#111111]/80 backdrop-blur-sm border-white/10 hover:border-white/20 transition-all rounded-2xl overflow-hidden relative group">
          <CardHeader className="relative z-10 pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-gray-300 text-sm font-medium uppercase tracking-widest flex items-center gap-2">
                <Calendar className="h-4 w-4" /> Vence Hoje
              </CardTitle>
            </div>
            <CardDescription className="text-gray-400">Pagamentos que vencem hoje</CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-light text-white mb-4">
              {formatCurrencyBRL(totalDueToday)}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Contas hoje</span>
                <span className="text-gray-300 font-medium">{todayInstallments.length} obrigações</span>
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
                  {overdueInstallments.length} pendências
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#111111]/80 backdrop-blur-sm border-white/10 hover:border-white/20 transition-all rounded-2xl overflow-hidden relative group">
          <CardHeader className="relative z-10 pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-gray-300 text-sm font-medium uppercase tracking-widest flex items-center gap-2">
                <PackageOpen className="h-4 w-4" /> Em Aberto
              </CardTitle>
            </div>
            <CardDescription className="text-gray-400">Pedidos não faturados</CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-light text-white mb-4">
              {openOrders.length}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Total de pedidos</span>
                <span className="text-gray-300 font-medium">Aguardando</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {loadingInstallments ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 pt-8">
          <Skeleton className="h-40 w-full bg-white/5" />
          <Skeleton className="h-40 w-full bg-white/5" />
          <Skeleton className="h-40 w-full bg-white/5" />
        </div>
      ) : sortedUpcomingInstallments.length === 0 ? (
        <div className="text-center py-16 bg-[#111111]/50 border border-white/5 rounded-2xl">
          <CheckCircle2 className="h-12 w-12 mx-auto text-[#00FF00] mb-3 opacity-80" />
          <h3 className="font-semibold text-white mb-1">Fluxo Limpo</h3>
          <p className="text-sm text-gray-500">Sem boletos de fornecedores pendentes no momento.</p>
        </div>
      ) : (
        <div className="space-y-12">
          
          {/* Atrasados */}
          {overdueInstallments.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-red-500/20 pb-2 mt-8">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <h2 className="text-lg font-light text-red-500 tracking-tight">Atrasados (Ação Imediata)</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {overdueInstallments.map(inst => renderCard(inst, 'urgent'))}
              </div>
            </div>
          )}

          {/* Vencem Hoje */}
          {todayInstallments.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-white/20 pb-2 mt-8">
                <Calendar className="h-5 w-5 text-white" />
                <h2 className="text-lg font-light text-white tracking-tight">Vencem Hoje</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {todayInstallments.map(inst => renderCard(inst, 'today'))}
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
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 opacity-80">
                {futureInstallments.map(inst => renderCard(inst, 'future'))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
