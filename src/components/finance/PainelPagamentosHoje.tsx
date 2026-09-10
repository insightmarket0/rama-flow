import React, { useMemo } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useSmartContractInstallments } from "@/hooks/useSmartContractInstallments";
import { useInstallments } from "@/hooks/useInstallments";
import { formatCurrencyBRL } from "@/lib/format";
import { CheckCircle2 } from "lucide-react";

// Helpers matching PaymentManagementTab
const parseLocalDate = (dateStr: string) => {
  if (!dateStr) return new Date();
  const [year, month, day] = dateStr.split('T')[0].split('-');
  return new Date(Number(year), Number(month) - 1, Number(day));
};

const getUrgencyLevel = (dueDateStr: string | null) => {
  if (!dueDateStr) return "future";
  const due = parseLocalDate(dueDateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  
  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "overdue";
  if (diffDays === 0) return "today";
  if (diffDays <= 7) return "week";
  if (diffDays <= 15) return "month";
  return "future";
};

export function PainelPagamentosHoje() {
  const { upcomingInstallments = [] } = useSmartContractInstallments();
  const { installments = [] } = useInstallments();

  const { todayTotal, todayBills } = useMemo(() => {
    // Pegamos apenas as que vencem hoje (diffDays === 0)

    const fixBills = upcomingInstallments
      .filter((inst: any) => getUrgencyLevel(inst.due_date) === "today")
      .map((inst: any) => ({
        id: inst.id,
        description: inst.smart_contract?.name || "Conta Fixa",
        value: Number(inst.value || 0),
        type: 'fix'
      }));

    const varBills = installments
      .filter((inst: any) => inst.status !== 'pago' && inst.due_date && getUrgencyLevel(inst.due_date) === "today")
      .map((inst: any) => ({
        id: inst.id,
        description: `Pedido de Compra #${inst.order?.order_number || ''}`,
        value: Number(inst.value || 0),
        type: 'var'
      }));

    const todayItems = [...fixBills, ...varBills].sort((a, b) => b.value - a.value);

    const total = todayItems.reduce((acc, b) => acc + b.value, 0);

    return { todayTotal: total, todayBills: todayItems };
  }, [upcomingInstallments, installments]);

  return (
    <div className="col-span-1 md:col-span-2 flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-[#111111] border border-[#00FF00]/20 rounded-3xl p-6 relative overflow-hidden shadow-[0_0_30px_rgba(0,255,0,0.05)]">
        
        {/* Glow de fundo */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#00FF00]/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
          
          {/* Header do Painel */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00FF00] shadow-[0_0_8px_rgba(0,255,0,1)] animate-pulse" />
              <p className="text-xs text-[#00FF00] font-bold tracking-[0.2em] uppercase">Vencimentos de Hoje</p>
            </div>
            <h2 className="text-4xl md:text-5xl font-light text-white tracking-tight">
              {formatCurrencyBRL(todayTotal)}
            </h2>
            <p className="text-gray-400 font-medium text-sm">
              Total a pagar no dia {format(new Date(), "dd 'de' MMMM", { locale: ptBR })}.
            </p>
          </div>

          {/* Lista de Contas */}
          <div className="flex-1 w-full md:max-w-md">
            {todayBills.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-6 border border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
                <CheckCircle2 className="h-8 w-8 text-gray-600 mb-2" />
                <p className="text-gray-400 font-medium text-sm text-center">Nenhuma conta para pagar hoje.</p>
                <p className="text-gray-600 text-xs text-center mt-1">Tudo em dia!</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
                {todayBills.map((bill: any) => (
                  <div key={bill.id} className="flex items-center justify-between p-4 rounded-2xl bg-[#1A1A1D] border border-white/5 hover:border-white/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${bill.type === 'fix' ? 'bg-[#00FF00]' : 'bg-cyan-400'}`} />
                      <div>
                        <p className="text-white font-medium text-sm line-clamp-1">{bill.description}</p>
                        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">
                          {bill.type === 'fix' ? 'Conta Fixa' : 'Pedido de Compra'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-white font-bold tracking-wide">{formatCurrencyBRL(bill.value)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Trigger HMR

// Trigger HMR again
