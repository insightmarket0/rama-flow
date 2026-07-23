import { useMemo, useState } from "react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingDown, TrendingUp, BarChart3, Receipt, History, CheckCircle2, Search, Download, FileText, User } from "lucide-react";
import { formatCurrencyBRL } from "@/lib/format";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useSmartContractInstallments } from "@/hooks/useSmartContractInstallments";

interface PaymentHistoryTabProps {
  paidInstallmentsHistory: any[] | undefined;
  isLoadingHistory: boolean;
}

export function PaymentHistoryTab({ paidInstallmentsHistory, isLoadingHistory }: PaymentHistoryTabProps) {
  const { deleteInstallment } = useSmartContractInstallments();
  
  // Aggregate data for the chart (last 6 months)
  const monthlyData = useMemo(() => {
    if (!paidInstallmentsHistory) return [];
    
    const totals: Record<string, number> = {};
    const now = new Date();
    
    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = format(d, 'MMM/yy', { locale: ptBR });
      totals[key] = 0;
    }

    paidInstallmentsHistory.forEach(installment => {
      if (!installment.paid_at) return;
      
      const paidDate = new Date(installment.paid_at);
      
      // Only aggregate if within the last 6 months
      if (paidDate >= new Date(now.getFullYear(), now.getMonth() - 5, 1)) {
        const key = format(paidDate, 'MMM/yy', { locale: ptBR });
        if (totals[key] !== undefined) {
          totals[key] += Number(installment.value) || 0;
        }
      }
    });

    // Projeção Preditiva (Next Month)
    const nextMonthTotal = Object.values(totals).reduce((a, b) => a + b, 0) / 6; // Media movel simples
    const nextDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const nextKey = format(nextDate, 'MMM/yy', { locale: ptBR });
    const nextLabel = nextKey.charAt(0).toUpperCase() + nextKey.slice(1);

    return [
      ...Object.entries(totals).map(([month, total]) => ({
        month: month.charAt(0).toUpperCase() + month.slice(1),
        total,
        isProjection: false
      })),
      { month: `${nextLabel} (Proj.)`, total: nextMonthTotal, isProjection: true }
    ];
  }, [paidInstallmentsHistory]);

  const currentMonth = useMemo(() => {
    const now = new Date();
    const key = format(now, 'MMM/yy', { locale: ptBR });
    return monthlyData.find(d => !d.isProjection && d.month.toLowerCase() === key.toLowerCase())?.total || 0;
  }, [monthlyData]);

  const lastMonth = useMemo(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    const key = format(d, 'MMM/yy', { locale: ptBR });
    return monthlyData.find(d => !d.isProjection && d.month.toLowerCase() === key.toLowerCase())?.total || 0;
  }, [monthlyData]);

  const percentChange = lastMonth > 0 ? ((currentMonth - lastMonth) / lastMonth) * 100 : 0;
  const isIncrease = percentChange > 0;

  // Filtros e Detalhamento
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);

  const filteredHistory = useMemo(() => {
    if (!paidInstallmentsHistory) return [];
    if (!searchTerm) return paidInstallmentsHistory;
    return paidInstallmentsHistory.filter(i => 
      i.smart_contract?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.smart_contract?.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [paidInstallmentsHistory, searchTerm]);

  const getCategoryColor = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'impostos': return "bg-red-500/10 text-red-500 border-red-500/20";
      case 'folha': return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case 'infraestrutura': return "bg-cyan-500/10 text-cyan-500 border-cyan-500/20";
      case 'software': return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case 'marketing': return "bg-fuchsia-500/10 text-fuchsia-500 border-fuchsia-500/20";
      default: return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  const handleExportCSV = () => {
    if (!filteredHistory || filteredHistory.length === 0) return;
    const headers = ["Conta/Fornecedor", "Categoria", "Data Pagamento", "Valor", "Status"];
    const rows = filteredHistory.map(i => [
      i.smart_contract?.name || 'Avulsa',
      i.smart_contract?.category || 'Sem Categoria',
      i.paid_at ? format(parseISO(i.paid_at), "dd/MM/yyyy") : '',
      i.value || 0,
      "Pago"
    ]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `extrato_pagamentos_${format(new Date(), 'yyyyMMdd')}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  if (isLoadingHistory) {
    return (
      <div className="space-y-6 pt-4 animate-in fade-in">
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-32 w-full bg-white/5 rounded-2xl" />
          <Skeleton className="h-32 w-full bg-white/5 rounded-2xl" />
        </div>
        <Skeleton className="h-[400px] w-full bg-white/5 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-4 pt-2 animate-in fade-in duration-500 h-[calc(100vh-12rem)] flex flex-col">
      
      {/* KPIs - Compactos */}
      <div className="grid gap-4 md:grid-cols-2 shrink-0">
        <Card className="bg-[#111111]/80 backdrop-blur-sm border-white/10 rounded-2xl overflow-hidden relative">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 mb-1">
                <Receipt className="h-3 w-3" /> Pagas Este Mês
              </p>
              <div className="text-2xl font-light text-white">
                {formatCurrencyBRL(currentMonth)}
              </div>
            </div>
            {/* Delta MoM */}
            <div className="text-right flex flex-col items-end justify-center">
              {lastMonth === 0 ? (
                <div className="flex items-center text-xs font-medium text-gray-500">
                  Sem base (mês ant. zerado)
                </div>
              ) : (
                <div className={`flex flex-col items-end text-xs font-medium ${percentChange > 0 ? 'text-red-400' : 'text-[#00FF00]'}`}>
                  <div className="flex items-center">
                    {percentChange > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                    {percentChange > 0 ? '+' : ''}{percentChange.toFixed(1)}% vs último mês
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#111111]/80 backdrop-blur-sm border-white/10 rounded-2xl overflow-hidden relative">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 mb-1">
                <History className="h-3 w-3" /> Pagas Mês Passado
              </p>
              <div className="text-2xl font-light text-gray-300">
                {formatCurrencyBRL(lastMonth)}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grid Principal: Gráfico e Tabela Lado a Lado */}
      <div className="grid gap-4 lg:grid-cols-2 flex-1 min-h-0">
        
        {/* Gráfico */}
        <Card className="bg-[#111111]/80 backdrop-blur-sm border-white/10 rounded-2xl flex flex-col min-h-0">
          <CardHeader className="py-3 px-4 shrink-0 border-b border-white/5">
            <CardTitle className="text-white text-sm font-medium flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-gray-400" /> Evolução (6 meses)
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-4 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                <XAxis 
                  dataKey="month" 
                  stroke="#ffffff40" 
                  fontSize={10} 
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#ffffff40" 
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `R$ ${value >= 1000 ? (value / 1000).toFixed(1).replace('.0', '') + 'k' : value}`}
                />
                <Tooltip 
                  cursor={{ fill: '#ffffff05' }}
                  contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#ffffff20', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  itemStyle={{ color: '#9ca3af' }}
                  formatter={(value: number) => [formatCurrencyBRL(value), 'Custo Total']}
                />
                <Bar dataKey="total" radius={[4, 4, 0, 0]} maxBarSize={30}>
                  {monthlyData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.isProjection ? "url(#projectionPattern)" : "#9ca3af"} 
                      fillOpacity={entry.isProjection ? 0.6 : 1}
                      stroke={entry.isProjection ? "#9ca3af" : "none"}
                      strokeDasharray={entry.isProjection ? "4 4" : "none"}
                    />
                  ))}
                </Bar>
                <defs>
                  <pattern id="projectionPattern" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                    <rect width="1" height="4" fill="#9ca3af" />
                  </pattern>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Tabela de Histórico */}
        <Card className="bg-[#111111]/80 backdrop-blur-sm border-white/10 rounded-2xl flex flex-col min-h-0">
          <CardHeader className="py-3 px-4 shrink-0 border-b border-white/5">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white text-sm font-medium flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#00FF00]" /> Últimas Quitações
              </CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="h-3 w-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <Input 
                    type="text" 
                    placeholder="Buscar fornecedor..." 
                    className="h-7 w-[160px] pl-8 bg-black/40 border-white/10 text-xs text-white placeholder:text-gray-600 focus-visible:ring-1 focus-visible:ring-white/20 rounded-md"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="icon" className="h-7 w-7 border-white/10 bg-white/5 hover:bg-white/10 hover:text-white text-gray-400" onClick={handleExportCSV} title="Exportar CSV">
                  <Download className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto p-0">
            {!paidInstallmentsHistory || paidInstallmentsHistory.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500 text-xs">Nenhum pagamento registrado.</p>
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-white/5 sticky top-0 z-10">
                  <TableRow className="border-white/10 hover:bg-transparent">
                    <TableHead className="text-gray-400 font-medium text-xs h-8">Conta</TableHead>
                    <TableHead className="text-gray-400 font-medium text-xs h-8">Data</TableHead>
                    <TableHead className="text-gray-400 font-medium text-xs text-center h-8">Responsável</TableHead>
                    <TableHead className="text-gray-400 font-medium text-xs text-right h-8">Valor</TableHead>
                    <TableHead className="text-gray-400 font-medium text-xs text-center h-8">Comprovante</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHistory.map((installment) => (
                    <TableRow 
                      key={installment.id} 
                      className="border-white/5 hover:bg-white/10 transition-colors cursor-pointer group"
                      onClick={() => setSelectedTransaction(installment)}
                    >
                      <TableCell className="font-medium text-white py-2">
                        <div className="flex flex-col items-start gap-1">
                          <span className="text-xs truncate max-w-[120px] group-hover:text-[#00FF00] transition-colors">{installment.smart_contract?.name || 'Despesa Avulsa'}</span>
                          <Badge variant="outline" className={`text-[9px] uppercase font-bold tracking-wider px-1.5 py-0 rounded-sm border ${getCategoryColor(installment.smart_contract?.category)}`}>
                            {installment.smart_contract?.category || 'S/ Categoria'}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-400 text-[10px] py-2">
                        {installment.paid_at ? format(parseISO(installment.paid_at), "dd/MM/yy") : '-'}
                      </TableCell>
                      <TableCell className="text-center py-2">
                        <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#1A1A1A] border border-white/10 text-[9px] font-bold text-gray-300 mx-auto" title={installment.paid_by || "Admin"}>
                          {(installment.paid_by || "ADM").substring(0, 2).toUpperCase()}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium text-white py-2">
                        {formatCurrencyBRL(installment.value || 0)}
                      </TableCell>
                      <TableCell className="text-center py-2 relative">
                        <div className="flex items-center justify-center gap-2">
                          <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full hover:bg-white/10 text-gray-400 group-hover:text-white">
                            <FileText className="h-3 w-3" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 rounded-full hover:bg-red-500/20 text-gray-500 hover:text-red-500 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm("Tem certeza que deseja excluir este pagamento do histórico?")) {
                                deleteInstallment.mutate(installment.id);
                              }
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Sheet de Detalhamento */}
      <Sheet open={!!selectedTransaction} onOpenChange={(open) => !open && setSelectedTransaction(null)}>
        <SheetContent className="bg-[#0a0a0a] border-l border-white/10 text-white w-full sm:max-w-md p-0 overflow-hidden flex flex-col">
          <SheetHeader className="p-6 border-b border-white/5 shrink-0 bg-black/20">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                <Receipt className="h-6 w-6 text-[#00FF00]" />
              </div>
              <div className="text-left">
                <SheetTitle className="text-lg font-medium text-white mb-1">
                  {selectedTransaction?.smart_contract?.name || 'Despesa Avulsa'}
                </SheetTitle>
                <Badge variant="outline" className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${getCategoryColor(selectedTransaction?.smart_contract?.category)}`}>
                  {selectedTransaction?.smart_contract?.category || 'S/ Categoria'}
                </Badge>
              </div>
            </div>
          </SheetHeader>
          
          <div className="flex-1 overflow-auto p-6 space-y-6 relative">
            
            {/* Resumo Valor e Data */}
            <div className="flex flex-col items-center justify-center py-6 bg-gradient-to-b from-[#111] to-transparent rounded-2xl border border-white/5 shadow-inner relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-[0.02]">
                <CheckCircle2 className="w-40 h-40" />
              </div>
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-2 relative z-10">Valor Liquidado</p>
              <div className="text-4xl font-light text-[#00FF00] mb-2 relative z-10">
                {formatCurrencyBRL(selectedTransaction?.value || 0)}
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-xs relative z-10">
                <CheckCircle2 className="h-4 w-4 text-[#00FF00]" />
                Pago em {selectedTransaction?.paid_at ? format(parseISO(selectedTransaction?.paid_at), "dd/MM/yyyy 'às' HH:mm") : '-'}
              </div>
            </div>

            {/* Auditoria Trail */}
            <div>
              <h3 className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-4 flex items-center gap-2">
                <History className="h-3 w-3" /> Trilha de Auditoria
              </h3>
              
              <div className="relative pl-6 space-y-6 border-l border-white/10 ml-2">
                
                {/* Event: Pagamento */}
                <div className="relative">
                  <div className="absolute -left-[30px] p-1 bg-[#0a0a0a]">
                    <div className="h-3 w-3 rounded-full bg-[#00FF00] shadow-[0_0_8px_rgba(0,255,0,0.5)] border border-black" />
                  </div>
                  <p className="text-white text-sm font-medium">Pagamento Efetuado</p>
                  <p className="text-gray-500 text-xs mt-0.5">Operação aprovada e lançada no sistema.</p>
                  <div className="flex items-center gap-2 mt-3 p-3 bg-white/5 rounded-lg border border-white/5">
                    <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <User className="h-4 w-4 text-gray-300" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Responsável (Autorização)</p>
                      <p className="text-sm text-gray-200 font-medium">{selectedTransaction?.paid_by || 'Administrador Padrão'}</p>
                    </div>
                  </div>
                </div>

                {/* Event: Criação */}
                <div className="relative">
                  <div className="absolute -left-[30px] p-1 bg-[#0a0a0a]">
                    <div className="h-3 w-3 rounded-full bg-white/20 border border-black" />
                  </div>
                  <p className="text-gray-300 text-sm font-medium">Fatura Gerada</p>
                  <p className="text-gray-500 text-xs mt-0.5">Criada para o ciclo {selectedTransaction?.due_date ? format(parseISO(selectedTransaction?.due_date), "MMM/yyyy") : '-'}.</p>
                </div>

              </div>
            </div>

            {/* Comprovante */}
            <div>
               <h3 className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-3 flex items-center gap-2">
                <FileText className="h-3 w-3" /> Documentação Anexa
              </h3>
              <div className="p-4 rounded-xl border border-dashed border-white/20 flex flex-col items-center justify-center text-center gap-3 hover:bg-white/5 transition-colors cursor-pointer group">
                <div className="p-3 rounded-full bg-white/5 group-hover:bg-[#00FF00]/10 transition-colors">
                  <FileText className="h-5 w-5 text-gray-400 group-hover:text-[#00FF00] transition-colors" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-300 group-hover:text-white">Ver Comprovante.pdf</p>
                  <p className="text-xs text-gray-500">124 KB • Gerado pelo banco</p>
                </div>
              </div>
            </div>

          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
