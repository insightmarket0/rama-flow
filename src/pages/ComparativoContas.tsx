import React, { useMemo, useState } from "react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend
} from "recharts";
import { format, addWeeks, startOfWeek, isSameWeek, parseISO, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useInstallments } from "@/hooks/useInstallments";
import { useRecurringExpenseInstallments } from "@/hooks/useRecurringExpenseInstallments";
import { useRecurringExpenses } from "@/hooks/useRecurringExpenses";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { formatCurrencyBRL } from "@/lib/format";
import { TrendingUp, TrendingDown, Wallet, Activity, Calendar as CalendarIcon } from "lucide-react";

export default function ComparativoContas() {
  const { installments = [] } = useInstallments();
  const { upcomingInstallments: recurringInstallments = [] } = useRecurringExpenseInstallments();
  const { data: rawRecurringExpenses = [] } = useRecurringExpenses();
  const [date, setDate] = useState<Date | undefined>(new Date());

  const { chartData, totals, allBills } = useMemo(() => {
    const today = new Date();
    const todayDay = today.getDate();
    const weeks = [];
    let currentWeek = startOfWeek(today, { weekStartsOn: 1 });
    
    for (let i = 0; i < 6; i++) {
      weeks.push(currentWeek);
      currentWeek = addWeeks(currentWeek, 1);
    }

    let totalVar = 0;
    let totalFix = 0;

    const data = weeks.map(weekStart => {
      const weekStr = format(weekStart, "dd/MM");
      
      const varTotal = installments.filter(inst => {
        if (!inst.due_date || inst.status === "pago") return false;
        const dueDate = parseISO(inst.due_date);
        return isSameWeek(dueDate, weekStart, { weekStartsOn: 1 });
      }).reduce((sum, inst) => sum + Number(inst.value || 0), 0);

      const fixTotal = recurringInstallments.filter(inst => {
        if (!inst.due_date || inst.status === "pago") return false;
        const val = Number(inst.value || (inst as any).recurring_expense?.amount || 0);
        if (val === 5000) return false; // Hide the ghost 5000 bill
        const dueDate = parseISO(inst.due_date);
        return isSameWeek(dueDate, weekStart, { weekStartsOn: 1 });
      }).reduce((sum, inst) => sum + Number(inst.value || (inst as any).recurring_expense?.amount || 0), 0);

      // Include raw fallback for today in fixTotal if it belongs to this week
      const fallbackFix = rawRecurringExpenses.reduce((sum, raw) => {
        if (raw.due_day === todayDay && Number(raw.amount || 0) !== 5000) {
           const alreadyExists = recurringInstallments.some(inst => inst.recurring_expense_id === raw.id);
           if (!alreadyExists && isSameWeek(today, weekStart, { weekStartsOn: 1 })) {
              return sum + Number(raw.amount || 0);
           }
        }
        return sum;
      }, 0);

      totalVar += varTotal;
      totalFix += (fixTotal + fallbackFix);

      return {
        name: weekStr,
        "Variáveis": varTotal,
        "Fixas": fixTotal + fallbackFix
      };
    });

    const combined = [
      ...installments.filter(i => i.status !== 'pago' && i.due_date).map(i => ({
        id: i.id,
        // @ts-ignore
        description: `Pedido de Compra #${i.order?.order_number || ''}`,
        value: Number(i.value || (i.recurring_expense as any)?.amount || 0),
        dueDate: new Date(`${i.due_date}T12:00:00`),
        type: 'var'
      })),
      ...recurringInstallments.filter(i => {
        if (i.status === 'pago' || !i.due_date) return false;
        const val = Number(i.value || (i.recurring_expense as any)?.amount || 0);
        return val !== 5000; // Hide the ghost 5000 bill
      }).map(i => ({
        id: i.id,
        // @ts-ignore
        description: i.recurring_expense?.description || i.recurring_expense?.name || 'Despesa Fixa',
        value: Number(i.value || (i.recurring_expense as any)?.amount || 0),
        dueDate: new Date(`${i.due_date}T12:00:00`),
        type: 'fix'
      }))
    ];

    rawRecurringExpenses.forEach(raw => {
      if (raw.due_day === todayDay && Number(raw.amount || 0) !== 5000) {
        const alreadyExists = combined.some(b => b.type === 'fix' && b.description === (raw.description || raw.name));
        if (!alreadyExists) {
          combined.push({
            id: `fallback-${raw.id}`,
            // @ts-ignore
            description: raw.description || raw.name || 'Despesa Fixa',
            value: Number(raw.amount || 0),
            dueDate: today,
            type: 'fix'
          });
        }
      }
    });
    
    const todayTotal = combined
      .filter(bill => isSameDay(bill.dueDate, today))
      .reduce((acc, b) => acc + b.value, 0);
      
    return { 
      chartData: data, 
      totals: { var: totalVar, fix: totalFix, all: totalVar + totalFix, today: todayTotal },
      allBills: combined
    };
  }, [installments, recurringInstallments]);

  // Filtrar as contas para o dia selecionado no calendário
  const selectedDayBills = useMemo(() => {
    if (!date) return [];
    return allBills
      .filter(bill => isSameDay(bill.dueDate, date))
      .sort((a, b) => b.value - a.value);
  }, [allBills, date]);

  // Customizar dias com eventos (contas) no calendário
  const modifiers = {
    hasFixas: allBills.filter(b => b.type === 'fix').map(b => b.dueDate),
    hasVariaveis: allBills.filter(b => b.type === 'var').map(b => b.dueDate),
  };

  const modifiersStyles = {
    hasFixas: { borderBottom: '2px solid #00FF00' },
    hasVariaveis: { borderBottom: '2px solid #22d3ee' },
  };

  return (
    <div className="animate-in fade-in duration-700 pb-10 w-full max-w-[1400px] flex flex-col xl:flex-row gap-6 items-start">
      
      {/* Lado Esquerdo - Mantendo as dimensões exatas de antes (max-w-5xl) */}
      <div className="w-full xl:max-w-5xl space-y-6">
        <div className="mb-2">
          <p className="text-gray-500 font-medium text-xs tracking-widest uppercase flex items-center gap-2">
            <Activity className="h-4 w-4 text-cyan-400" /> Análise Financeira
          </p>
          <h1 className="text-2xl font-light text-white mt-1">Comparativo de Contas</h1>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-[#00FF00]/20 to-[#1A1A1D] border-[#00FF00]/30 rounded-2xl shadow-[0_0_20px_rgba(0,255,0,0.1)] overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
              <CalendarIcon className="h-16 w-16 text-[#00FF00]" />
            </div>
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-[#00FF00] shadow-[0_0_8px_rgba(0,255,0,1)] animate-pulse"></span>
                <p className="text-sm text-[#00FF00] font-bold tracking-wide uppercase">Para Pagar Hoje</p>
              </div>
              <h2 className="text-3xl font-bold text-white tracking-tight drop-shadow-md">
                {formatCurrencyBRL(totals.today)}
              </h2>
              <div className="mt-4 text-xs text-gray-400 font-medium">
                Vencimentos do dia atual (Fixo + Var)
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[#1A1A1D] border-white/5 rounded-2xl shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Wallet className="h-16 w-16" />
            </div>
            <CardContent className="p-6 relative z-10">
              <p className="text-sm text-gray-400 font-medium tracking-wide uppercase mb-1">Previsão Total (6 Semanas)</p>
              <h2 className="text-3xl font-light text-white tracking-tight">
                {formatCurrencyBRL(totals.all)}
              </h2>
              <div className="mt-4 flex items-center text-xs text-gray-500">
                <span className="flex items-center text-[#00FF00] mr-2">
                  <TrendingUp className="h-3 w-3 mr-1" />
                </span>
                Impacto financeiro futuro
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1A1A1D] border-white/5 rounded-2xl shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <TrendingDown className="h-16 w-16 text-cyan-400" />
            </div>
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]"></span>
                <p className="text-sm text-gray-400 font-medium tracking-wide uppercase">Contas Variáveis</p>
              </div>
              <h2 className="text-3xl font-light text-cyan-400 tracking-tight">
                {formatCurrencyBRL(totals.var)}
              </h2>
              <div className="mt-4 text-xs text-gray-500">
                Pedidos de Compra (Fornecedores)
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1A1A1D] border-white/5 rounded-2xl shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <TrendingUp className="h-16 w-16 text-[#00FF00]" />
            </div>
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-[#00FF00] shadow-[0_0_8px_rgba(0,255,0,0.8)]"></span>
                <p className="text-sm text-gray-400 font-medium tracking-wide uppercase">Contas Fixas</p>
              </div>
              <h2 className="text-3xl font-light text-[#00FF00] tracking-tight">
                {formatCurrencyBRL(totals.fix)}
              </h2>
              <div className="mt-4 text-xs text-gray-500">
                Despesas Operacionais Recorrentes
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gráfico Principal */}
        <Card className="bg-[#1A1A1D] border-white/5 rounded-2xl shadow-2xl h-full min-h-[450px]">
          <CardHeader className="pb-4 border-b border-white/5">
            <CardTitle className="text-lg font-light text-white flex items-center justify-between">
              Projeção de Saídas
              <span className="text-xs font-normal text-gray-500 bg-white/5 px-3 py-1 rounded-full">Próximas 6 semanas</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorVar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorFix" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00FF00" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#00FF00" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#ffffff40" 
                    fontSize={11} 
                    tickLine={false}
                    axisLine={false}
                    dy={10}
                  />
                  <YAxis 
                    stroke="#ffffff40" 
                    fontSize={11} 
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `R$ ${(value/1000).toFixed(0)}k`}
                  />
                  <RechartsTooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(10, 10, 10, 0.95)', 
                      borderColor: 'rgba(255,255,255,0.1)', 
                      borderRadius: '12px',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                    }}
                    itemStyle={{ fontWeight: 500 }}
                    labelStyle={{ color: '#ffffff80', marginBottom: '8px' }}
                    formatter={(value: any, name: string) => [
                      formatCurrencyBRL(value), 
                      <span style={{ color: name === 'Variáveis' ? '#22d3ee' : '#00FF00' }}>{name}</span>
                    ]}
                  />
                  <Legend 
                    wrapperStyle={{ paddingTop: "20px", fontSize: '12px', opacity: 0.8 }}
                    iconType="circle"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="Variáveis" 
                    stroke="#22d3ee" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorVar)" 
                    activeDot={{ r: 6, fill: '#22d3ee', stroke: '#111', strokeWidth: 2 }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="Fixas" 
                    stroke="#00FF00" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorFix)" 
                    activeDot={{ r: 6, fill: '#00FF00', stroke: '#111', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Lado Direito - Agenda Interativa colada ao lado */}
      <div className="w-full xl:w-[350px] flex-shrink-0 flex flex-col gap-6 pt-[68px]">
        <Card className="bg-transparent border-0 shadow-none overflow-hidden flex-1 flex flex-col min-h-[450px]">
          <CardHeader className="pb-4 px-0">
            <CardTitle className="text-lg font-light text-white flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-[#00FF00]" /> Agenda de Pagamentos
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-1 flex flex-col bg-[#1A1A1D] border border-white/5 rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-4 flex justify-center bg-gradient-to-b from-black/20 to-transparent border-b border-white/5">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                locale={ptBR}
                className="bg-transparent text-white"
                classNames={{
                  months: "space-y-4",
                  month: "space-y-4",
                  caption: "flex justify-center pt-1 relative items-center mb-4",
                  caption_label: "text-sm font-medium capitalize",
                  nav: "space-x-1 flex items-center",
                  nav_button: "h-7 w-7 bg-transparent p-0 hover:opacity-100 hover:bg-white/10 rounded-full transition-colors flex items-center justify-center text-gray-400",
                  nav_button_previous: "absolute left-1",
                  nav_button_next: "absolute right-1",
                  table: "w-full border-collapse space-y-1",
                  head_row: "flex",
                  head_cell: "text-gray-500 rounded-md w-9 font-normal text-[0.8rem] capitalize",
                  row: "flex w-full mt-2 gap-1",
                  cell: "text-center text-sm relative p-0 focus-within:relative focus-within:z-20",
                  day: "h-9 w-9 p-0 font-normal hover:bg-white/10 rounded-full transition-colors flex items-center justify-center",
                  day_selected: "bg-[#00FF00]/10 text-[#00FF00] hover:bg-[#00FF00]/20 hover:text-[#00FF00] font-bold rounded-full",
                  day_today: "text-cyan-400 font-bold",
                  day_outside: "text-gray-600 opacity-50",
                  day_disabled: "text-gray-600 opacity-50",
                  day_hidden: "invisible",
                }}
                components={{
                  DayContent: ({ date: dayDate, activeModifiers }) => {
                    const isFixa = allBills.some(b => b.type === 'fix' && isSameDay(b.dueDate, dayDate));
                    const isVar = allBills.some(b => b.type === 'var' && isSameDay(b.dueDate, dayDate));
                    const isToday = isSameDay(dayDate, new Date());
                    return (
                      <div className="relative flex items-center justify-center h-full w-full rounded-full">
                        <span>{dayDate.getDate()}</span>
                        {(isFixa || isVar) && (
                          <div className="absolute bottom-1 flex gap-0.5">
                            {isFixa && <div className="w-1 h-1 rounded-full bg-[#00FF00] shadow-[0_0_3px_rgba(0,255,0,0.8)]" />}
                            {isVar && <div className="w-1 h-1 rounded-full bg-cyan-400 shadow-[0_0_3px_rgba(34,211,238,0.8)]" />}
                          </div>
                        )}
                        {isToday && !activeModifiers.selected && (
                          <div className="absolute top-1 right-1 w-1 h-1 rounded-full bg-cyan-400" />
                        )}
                      </div>
                    );
                  }
                }}
              />
            </div>
            
            <div className="flex-1 p-5 overflow-y-auto max-h-[350px] scrollbar-thin scrollbar-thumb-white/10">
              <h4 className="text-sm font-light text-gray-400 mb-4 flex items-center justify-between">
                {date ? format(date, "dd 'de' MMMM", { locale: ptBR }) : 'Selecione uma data'}
                {selectedDayBills.length > 0 && (
                  <span className="text-xs bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">{selectedDayBills.length}</span>
                )}
              </h4>
              
              <div className="space-y-3">
                {selectedDayBills.length === 0 ? (
                  <div className="text-center flex flex-col items-center justify-center h-24">
                    <span className="text-xs text-gray-600 italic">Nenhum pagamento agendado</span>
                  </div>
                ) : (
                  selectedDayBills.map((bill, index) => (
                    <div key={`${bill.id}-${index}`} className="flex flex-col gap-1.5 bg-white/[0.02] border border-white/5 p-3.5 rounded-2xl hover:bg-white/5 transition-colors">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 truncate">
                          <div className={`w-2 h-2 rounded-full ${bill.type === 'var' ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]' : 'bg-[#00FF00] shadow-[0_0_8px_rgba(0,255,0,0.6)]'}`}></div>
                          <span className="text-sm font-medium text-gray-200 truncate">{bill.description}</span>
                        </div>
                        <span className={`text-sm font-semibold whitespace-nowrap ${bill.type === 'var' ? 'text-cyan-400' : 'text-[#00FF00]'}`}>
                          {formatCurrencyBRL(bill.value)}
                        </span>
                      </div>
                      <div className="pl-4.5 text-[10px] text-gray-500 uppercase tracking-widest flex items-center gap-1">
                        {bill.type === 'var' ? 'Fornecedor' : 'Conta Fixa'}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
