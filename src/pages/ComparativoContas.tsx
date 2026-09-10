import React, { useMemo, useState } from "react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend
} from "recharts";
import { format, addWeeks, startOfWeek, isSameWeek, parseISO, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useInstallments } from "@/hooks/useInstallments";
import { useSmartContractInstallments } from "@/hooks/useSmartContractInstallments";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { formatCurrencyBRL } from "@/lib/format";
import { TrendingUp, TrendingDown, Wallet, Activity, Calendar as CalendarIcon } from "lucide-react";

export default function ComparativoContas() {
  const { installments = [] } = useInstallments();
  const { upcomingInstallments = [] } = useSmartContractInstallments();
  const [date, setDate] = useState<Date | undefined>(new Date());

  const { chartData, totals, allBills } = useMemo(() => {
    const today = new Date();
    const weeks: Date[] = [];
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

      const fixTotal = upcomingInstallments.filter((inst: any) => {
        if (!inst.due_date) return false; // status 'pago' já foi filtrado no hook, mas garantimos
        const dueDate = parseISO(inst.due_date);
        return isSameWeek(dueDate, weekStart, { weekStartsOn: 1 });
      }).reduce((sum, inst: any) => sum + Number(inst.value || 0), 0);

      totalVar += varTotal;
      totalFix += fixTotal;

      return {
        name: weekStr,
        "Variáveis": varTotal,
        "Fixas": fixTotal
      };
    });

    const combined = [
      ...installments.filter(i => i.status !== 'pago' && i.due_date).map(i => ({
        id: i.id,
        // @ts-ignore
        description: `Pedido de Compra #${i.order?.order_number || ''}`,
        value: Number(i.value || 0),
        dueDate: parseISO(i.due_date),
        type: 'var'
      })),
      ...upcomingInstallments.filter((i: any) => i.due_date).map((i: any) => ({
        id: i.id,
        description: i.smart_contract?.name || 'Despesa Fixa',
        value: Number(i.value || 0),
        dueDate: parseISO(i.due_date),
        type: 'fix'
      }))
    ];

    return { 
      chartData: data, 
      totals: { totalVar, totalFix, total: totalVar + totalFix },
      allBills: combined 
    };
  }, [installments, upcomingInstallments]);

  const todayBillsTotal = useMemo(() => {
    return allBills
      .filter(bill => isSameDay(bill.dueDate, new Date()))
      .reduce((sum, bill) => sum + bill.value, 0);
  }, [allBills]);

  const selectedDayBills = useMemo(() => {
    if (!date) return [];
    return allBills.filter(bill => isSameDay(bill.dueDate, date));
  }, [allBills, date]);

  return (
    <div className="flex-1 flex flex-col xl:flex-row gap-6 p-6 h-[calc(100vh-64px)] overflow-y-auto">
      {/* Lado Esquerdo - Gráfico e Cards */}
      <div className="flex-1 flex flex-col gap-6 max-w-7xl mx-auto w-full">
        <div className="flex flex-col gap-2">
          <p className="text-cyan-400 font-bold text-[10px] tracking-[0.2em] uppercase flex items-center gap-2">
            <Activity className="w-3 h-3" /> Análise Financeira
          </p>
          <h1 className="text-2xl font-light text-white mt-1">Comparativo de Contas</h1>
        </div>

        {/* Top KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-[#111111]/80 backdrop-blur-sm border-[#00FF00]/30 shadow-[0_0_20px_rgba(0,255,0,0.05)] rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-[#00FF00] text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#00FF00] shadow-[0_0_8px_rgba(0,255,0,0.8)] animate-pulse"></div>
                Para Pagar Hoje
                <CalendarIcon className="w-4 h-4 ml-auto opacity-50" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-light text-white tracking-tight">
                {formatCurrencyBRL(todayBillsTotal)}
              </div>
              <p className="text-gray-500 text-xs mt-1">Vencimentos do dia atual (Fixo + Var)</p>
            </CardContent>
          </Card>

          <Card className="bg-[#111111]/80 backdrop-blur-sm border-white/5 rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-gray-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                Previsão Total (6 Semanas)
                <Wallet className="w-4 h-4 ml-auto opacity-50" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-light text-white tracking-tight">
                {formatCurrencyBRL(totals.total)}
              </div>
              <p className="text-[#00FF00] text-xs mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> Impacto financeiro futuro
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#111111]/80 backdrop-blur-sm border-white/5 rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-cyan-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
                Contas Variáveis
                <TrendingDown className="w-4 h-4 ml-auto opacity-50" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-light text-cyan-400 tracking-tight">
                {formatCurrencyBRL(totals.totalVar)}
              </div>
              <p className="text-gray-500 text-xs mt-1">Pedidos de Compra (Fornecedores)</p>
            </CardContent>
          </Card>

          <Card className="bg-[#111111]/80 backdrop-blur-sm border-white/5 rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-[#00FF00] text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00FF00]"></div>
                Contas Fixas
                <TrendingUp className="w-4 h-4 ml-auto opacity-50" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-light text-[#00FF00] tracking-tight">
                {formatCurrencyBRL(totals.totalFix)}
              </div>
              <p className="text-gray-500 text-xs mt-1">Despesas Operacionais Recorrentes</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Chart Area */}
        <Card className="bg-[#111111]/80 backdrop-blur-sm border-white/5 rounded-3xl overflow-hidden flex-1 min-h-[400px] flex flex-col">
          <CardHeader className="border-b border-white/5 bg-white/[0.02] py-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-light text-white">Projeção de Saídas</CardTitle>
              <div className="bg-white/5 px-3 py-1 rounded-full text-xs text-gray-400 font-medium tracking-wide">
                Próximas 6 semanas
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 flex-1 flex flex-col">
            <div className="flex-1 min-h-[300px]">
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
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="rgba(255,255,255,0.2)"
                    tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    dy={10}
                  />
                  <YAxis 
                    stroke="rgba(255,255,255,0.2)"
                    tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
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
