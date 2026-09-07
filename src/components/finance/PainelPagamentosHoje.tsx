import React, { useMemo } from "react";
import { format, isSameDay, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useInstallments } from "@/hooks/useInstallments";
import { useRecurringExpenseInstallments } from "@/hooks/useRecurringExpenseInstallments";
import { useRecurringExpenses } from "@/hooks/useRecurringExpenses";
import { formatCurrencyBRL } from "@/lib/format";
import { CalendarIcon, CheckCircle2, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function PainelPagamentosHoje() {
  const { installments = [] } = useInstallments();
  const { upcomingInstallments: recurringInstallments = [] } = useRecurringExpenseInstallments();
  const { data: rawRecurringExpenses = [] } = useRecurringExpenses();

  const { todayTotal, todayBills } = useMemo(() => {
    const today = new Date();
    const todayDay = today.getDate();

    const combined = [
      ...installments.filter(i => i.status !== 'pago' && i.due_date).map(i => ({
        id: i.id,
        // @ts-ignore
        description: `Pedido de Compra #${i.order?.order_number || ''}`,
        value: Number(i.value),
        dueDate: new Date(`${i.due_date}T12:00:00`),
        type: 'var',
        status: i.status
      })),
      ...recurringInstallments.filter(i => {
        if (i.status === 'pago' || !i.due_date) return false;
        const val = Number(i.value || (i.recurring_expense as any)?.amount || 0);
        return val !== 5000;
      }).map(i => ({
        id: i.id,
        // @ts-ignore
        description: i.recurring_expense?.description || i.recurring_expense?.name || 'Despesa Fixa',
        value: Number(i.value || (i.recurring_expense as any)?.amount || 0),
        dueDate: new Date(`${i.due_date}T12:00:00`),
        type: 'fix',
        status: i.status
      }))
    ];

    // Fallback: se estamos rodando local e a Edge Function não rodou, a parcela não existe.
    // Vamos buscar direto da tabela mãe (recurring_expenses) se o due_day for hoje.
    rawRecurringExpenses.forEach(raw => {
      if (raw.due_day === todayDay) {
        // Verifica se já não existe na lista 'combined'
        const alreadyExists = combined.some(b => b.type === 'fix' && b.description === (raw.description || raw.name));
        if (!alreadyExists && Number(raw.amount || 0) !== 5000) {
          combined.push({
            id: `fallback-${raw.id}`,
            description: raw.description || raw.name || 'Despesa Fixa',
            value: Number(raw.amount || 0),
            dueDate: today,
            type: 'fix',
            status: 'pendente'
          });
        }
      }
    });

    const todayItems = combined.filter(bill => isSameDay(bill.dueDate, today)).sort((a, b) => b.value - a.value);
    const total = todayItems.reduce((acc, b) => acc + b.value, 0);

    return { todayTotal: total, todayBills: todayItems };
  }, [installments, recurringInstallments, rawRecurringExpenses]);

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
                {todayBills.map(bill => (
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
