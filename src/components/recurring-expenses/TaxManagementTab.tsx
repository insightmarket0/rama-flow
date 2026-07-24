import React, { useState, useMemo, useEffect } from 'react';
import { 
  FileText, Plus, UploadCloud, CheckCircle2, AlertTriangle, Clock, Target, Info, Trash2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrencyBRL } from '@/lib/format';
import { LineChart, Line, Tooltip, ResponsiveContainer } from 'recharts';
import { useFinancialClosings } from '@/hooks/useFinancialClosings';

interface TaxManagementTabProps {
  smartContracts: any[];
  pastInstallments: any[];
  upcomingInstallments?: any[];
  onAddNew: (presetRecurrence?: "mensal" | "anual" | "esporadico") => void;
  onEdit: (expense: any) => void;
  onDelete: (id: string) => void;
}

export function TaxManagementTab({ 
  smartContracts, 
  pastInstallments,
  upcomingInstallments,
  onAddNew, 
  onEdit, 
  onDelete,
  createInstallment,
  markAsPaid
}: TaxManagementTabProps) {
  // Estado para simular o Drag & Drop
  const [isDragging, setIsDragging] = useState(false);
  
  // Apenas impostos
  const taxes = useMemo(() => smartContracts.filter(e => e.category === 'impostos'), [smartContracts]);

  const { closings } = useFinancialClosings();

  const [currentMonthRevenue, setCurrentMonthRevenue] = useState(() => {
    const saved = localStorage.getItem('tax_revenue');
    return saved !== null ? Number(saved) : 105620.50;
  });
  const [estimatedTaxRate, setEstimatedTaxRate] = useState(() => {
    const saved = localStorage.getItem('tax_rate');
    return saved !== null ? Number(saved) : 0.08;
  });

  // Atualiza automaticamente o faturamento com o último mês fechado
  useEffect(() => {
    if (closings && closings.length > 0) {
      const sortedClosings = [...closings].sort((a, b) => b.month.localeCompare(a.month));
      const latestTotal = sortedClosings[0].total;
      setCurrentMonthRevenue(latestTotal);
      localStorage.setItem('tax_revenue', latestTotal.toString());
    }
  }, [closings]);

  useEffect(() => {
    localStorage.setItem('tax_revenue', currentMonthRevenue.toString());
  }, [currentMonthRevenue]);

  useEffect(() => {
    localStorage.setItem('tax_rate', estimatedTaxRate.toString());
  }, [estimatedTaxRate]);

  const estimatedProvision = currentMonthRevenue * estimatedTaxRate;

  // Mock de dados para o gráfico de Carga Tributária (Últimos 6 meses)
  const chartData = useMemo(() => {
    return [
      { name: 'Fev', valor: 4200, rate: 7.8 },
      { name: 'Mar', valor: 4500, rate: 8.0 },
      { name: 'Abr', valor: 5100, rate: 8.1 },
      { name: 'Mai', valor: 5000, rate: 7.9 },
      { name: 'Jun', valor: 7800, rate: 10.5 },
      { name: 'Jul', valor: 8450, rate: 12.5 },
    ];
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    // Simular processamento do arquivo
    const file = e.dataTransfer.files[0];
    if (file) {
      console.log('Arquivo recebido:', file.name);
      // Aqui integraria com OCR no futuro
    }
  };

  const renderDueRule = (expense: any) => {
    if (expense.due_rule_type === "days_after_start") return `${expense.due_day_offset || 0} dias após fechamento`;
    if (Array.isArray(expense.due_days) && expense.due_days.length > 0) return `Dias ${[...expense.due_days].sort((a,b)=>a-b).join(', ')}`;
    return `Dia ${expense.due_day || '?'}`;
  };

  // Função para simular o estado do ciclo visual da obrigação
  const getObligationStatus = (expense: any) => {
    // Exemplo: Usamos o nome para simular os 3 estados
    if (expense.name.toLowerCase().includes('inss') || expense.name.toLowerCase().includes('gps')) return 'liquidado';
    if (expense.name.toLowerCase().includes('icms')) return 'guia_disponivel';
    return 'aguardando'; // Default para DAS e outros
  };

  return (
    <div className="space-y-6">
      {/* Top Section: Provisão, Cofre e Gráfico */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Card 1: Provisão do Mês */}
        <Card className="bg-[#111111]/80 backdrop-blur-sm border-stone-500/20 overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-stone-500/5 to-transparent opacity-50 z-0"></div>
          <CardHeader className="relative z-10 pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-stone-400 text-sm font-medium uppercase tracking-widest flex items-center gap-2">
                <Target className="h-4 w-4" /> Provisão do Mês
              </CardTitle>
            </div>
            <CardDescription className="text-gray-400">Estimativa baseada no faturamento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-gray-500 text-lg">~</span>
              <span className="text-3xl font-light text-white tracking-tight">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(estimatedProvision)}
              </span>
            </div>
            
            <div className="mt-6 space-y-5 border-t border-white/5 pt-5">
              <div className="space-y-3">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Faturamento: <span className="text-white font-medium">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(currentMonthRevenue)}</span></span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="500000" 
                  step="1000"
                  value={currentMonthRevenue}
                  onChange={(e) => setCurrentMonthRevenue(Number(e.target.value))}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#00FF00]"
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Alíquota de Imposto: <span className="text-white font-medium">{(estimatedTaxRate * 100).toFixed(1)}%</span></span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="0.30" 
                  step="0.005"
                  value={estimatedTaxRate}
                  onChange={(e) => setEstimatedTaxRate(Number(e.target.value))}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#00FF00]"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Cofre de Guias (Drag & Drop) */}
        <Card 
          className={`bg-[#111111]/80 backdrop-blur-sm transition-all relative flex flex-col items-center justify-center p-6 text-center border-2 border-dashed
            ${isDragging ? 'border-[#00FF00] bg-[#00FF00]/5 scale-[1.02]' : 'border-white/10 hover:border-white/20'}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors cursor-help" title="Arraste o PDF do contador aqui para leitura automática do código de barras e atualização do valor.">
            <Info className="h-4 w-4" />
          </div>
          <div className={`p-4 rounded-full mb-3 transition-colors ${isDragging ? 'bg-[#00FF00]/20 text-[#00FF00]' : 'bg-white/5 text-gray-400'}`}>
            <UploadCloud className="h-8 w-8" />
          </div>
          <h3 className="text-white font-medium mb-1">Cofre de Guias</h3>
          <p className="text-xs text-gray-400 max-w-[200px]">Arraste o PDF da contabilidade para ler o código de barras.</p>
        </Card>

        {/* Card 3: Gráfico de Carga Tributária */}
        <Card className="bg-[#111111]/80 backdrop-blur-sm border-white/5 flex flex-col">
          <CardHeader className="pb-0">
            <CardTitle className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Carga Tributária Acumulada</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 min-h-[120px] pt-4 px-2 pb-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 20, right: 15, left: 15, bottom: 0 }}>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }}
                  itemStyle={{ color: '#94a3b8' }}
                  formatter={(value: number, name: string, props: any) => [`R$ ${value.toLocaleString('pt-BR')} (${props.payload.rate}%)`, 'Carga']}
                  labelStyle={{ display: 'none' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="valor" 
                  stroke="#94a3b8" 
                  strokeWidth={2} 
                  dot={{ r: 3, fill: '#111', stroke: '#94a3b8', strokeWidth: 2 }} 
                  activeDot={{ r: 5, fill: '#94a3b8' }} 
                  label={(props: any) => {
                    const { x, y, index } = props;
                    // Recharts as vezes chama a função de label sem propriedades completas durante a inicialização
                    if (index === chartData.length - 1 && x !== undefined && y !== undefined) {
                      return (
                        <text x={x} y={y - 12} fill="#94a3b8" fontSize={11} fontWeight="bold" textAnchor="middle">
                          {chartData[chartData.length - 1].rate}%
                        </text>
                      );
                    }
                    return null;
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Seção de Guias Avulsas e Esporádicas (DARE) */}
        <div>
        <div className="flex items-center justify-between mb-4 mt-8">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-white/70" />
            <h2 className="text-lg font-light text-white tracking-tight">Guias Avulsas & Esporádicas</h2>
          </div>
        </div>

        <div className="grid gap-4 grid-cols-1 xl:grid-cols-2">
            {smartContracts.filter(e => e.category === 'impostos' && e.recurrence_type === 'esporadico').map(tax => {
              // Verifica se há alguma guia pendente (installment)
              const pendingGuia = upcomingInstallments?.find(inst => inst.smart_contract_id === tax.id && inst.status !== 'paid');
              
              return (
                <Card key={tax.id} className="transition-all duration-300 backdrop-blur-sm overflow-hidden border-white/10 hover:border-white/20 bg-[#111111]/80 cursor-pointer group hover:scale-[1.01]">
                  <CardHeader className="pb-3 border-b border-white/5 bg-white/5">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-stone-500/10 text-stone-400 group-hover:scale-110 transition-transform">
                          <Clock className="h-5 w-5 text-stone-400" />
                        </div>
                        <div>
                          <CardTitle className="text-white text-base font-medium group-hover:text-[#00FF00] transition-colors">{tax.name}</CardTitle>
                          <CardDescription className="text-gray-400 text-[10px] uppercase tracking-widest mt-0.5 font-semibold">
                            {pendingGuia ? `Vencimento: ${new Date(pendingGuia.due_date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}` : 'Sem guia ativa'}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => onEdit(tax)} className="h-8 w-8 text-gray-500 hover:text-white hover:bg-white/10 rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm("Deseja realmente excluir este imposto?")) {
                              onDelete(tax.id);
                            }
                          }} 
                          className="h-8 w-8 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-full"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      {pendingGuia ? (
                        <Badge variant="outline" className="text-[9px] uppercase tracking-widest border-stone-500/30 text-stone-400 bg-stone-500/10">Aguardando Pagamento</Badge>
                      ) : (
                        <Badge variant="outline" className="text-[9px] uppercase tracking-widest border-stone-500/30 text-stone-400 bg-transparent">Aguardando Próxima Guia</Badge>
                      )}
                      
                      {pendingGuia && (
                        <span className="text-sm font-semibold text-white">
                          {formatCurrencyBRL(pendingGuia.value)}
                        </span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-3">
                    <div className="bg-black/50 rounded p-2 text-xs text-gray-400 border border-white/5">
                      <span className="block text-gray-300 font-medium mb-1">Pagamento Personalizado:</span>
                      Imposto esporádico. Não possui datas fixas mensais.
                    </div>
                    <div className="flex gap-2 mt-4">
                      {pendingGuia ? (
                        <>
                          <Button className="flex-1 bg-transparent hover:bg-white/5 text-gray-300 border border-white/10 text-xs h-8 transition-colors">
                            <UploadCloud className="w-3 h-3 mr-2" /> Anexar Guia
                          </Button>
                          <Button 
                            onClick={(e) => {
                              e.stopPropagation();
                              if (markAsPaid) markAsPaid.mutateAsync({ id: pendingGuia.id });
                            }}
                            className="flex-1 bg-white/5 hover:bg-[#00FF00]/10 hover:text-[#00FF00] hover:border-[#00FF00]/30 text-white font-semibold text-xs h-8 border border-white/10 transition-all"
                          >
                            <CheckCircle2 className="w-3 h-3 mr-2" /> Liquidar
                          </Button>
                        </>
                      ) : (
                        <Button 
                          onClick={(e) => {
                            e.stopPropagation();
                            if (createInstallment) {
                              const hoje = new Date().toISOString().split('T')[0];
                              const valor = parseFloat(prompt('Digite o valor da nova guia:') || '0');
                              const dataStr = prompt('Digite a data de vencimento (AAAA-MM-DD):', hoje);
                              if (valor > 0 && dataStr) {
                                createInstallment.mutateAsync({
                                  smart_contract_id: tax.id,
                                  value: valor,
                                  due_date: dataStr
                                });
                              }
                            }
                          }}
                          className="w-full bg-white/5 hover:bg-white/10 text-white font-semibold text-xs h-8 border border-white/10 transition-all"
                        >
                          <Plus className="w-3 h-3 mr-2" /> Lançar Nova Guia
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            
            {smartContracts.filter(e => e.category === 'impostos' && e.recurrence_type === 'esporadico').length === 0 && (
              <div className="col-span-full py-8 text-center border border-white/5 border-dashed rounded-xl bg-white/[0.02]">
                <Clock className="w-8 h-8 text-stone-500 mx-auto mb-3 opacity-50" />
                <p className="text-gray-400 text-sm">Nenhum imposto esporádico (ex: DARE) cadastrado.</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onAddNew('esporadico')} 
                  className="mt-4 border-white/10 hover:bg-white/10"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Cadastrar Imposto Esporádico
                </Button>
              </div>
            )}
        </div>
      </div>

      {/* Seção das Obrigações (Cards Robustos) */}
      <div>
        <div className="flex items-center justify-between mb-4 mt-8">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-white/70" />
            <h2 className="text-lg font-light text-white tracking-tight">Obrigações Fixas (O Mapa do Mês)</h2>
          </div>
          <Button 
            variant="outline"
            className="border-white/10 hover:bg-white/10 text-gray-300 text-xs h-8"
            onClick={onAddNew}
          >
            <Plus className="h-3 w-3 mr-2" /> Cadastrar Imposto
          </Button>
        </div>

        <div className="grid gap-4 grid-cols-1 xl:grid-cols-2">
          {taxes.filter(e => e.recurrence_type !== 'esporadico').map(expense => {
            const status = getObligationStatus(expense);
            
            // Definições de Estilo por Estado
            const styles = {
              aguardando: {
                border: 'border-white/10 border-dashed hover:border-white/20',
                bg: 'bg-[#111111]/80',
                icon: <Clock className="h-5 w-5 text-stone-400" />,
                iconBg: 'bg-stone-500/10 text-stone-400',
                badge: <Badge variant="outline" className="text-[9px] uppercase tracking-widest border-stone-500/30 text-stone-400 bg-stone-500/10">Aguardando Contabilidade</Badge>
              },
              guia_disponivel: {
                border: 'border-[#00FF00]/30 shadow-[0_0_15px_rgba(0,255,0,0.05)] hover:border-[#00FF00]/50',
                bg: 'bg-[#111111]/90',
                icon: <AlertTriangle className="h-5 w-5 text-[#00FF00]" />,
                iconBg: 'bg-[#00FF00]/10 text-[#00FF00]',
                badge: <Badge variant="outline" className="text-[9px] uppercase tracking-widest border-[#00FF00]/40 text-[#00FF00] bg-[#00FF00]/10 animate-pulse">Pronto para Pagar</Badge>
              },
              liquidado: {
                border: 'border-emerald-500/20 hover:border-emerald-500/40',
                bg: 'bg-[#111111]/80',
                icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
                iconBg: 'bg-emerald-500/10 text-emerald-500',
                badge: <Badge variant="outline" className="text-[9px] uppercase tracking-widest border-emerald-500/20 text-emerald-500 bg-emerald-500/5">Liquidado</Badge>
              }
            }[status];

            return (
              <Card 
                key={expense.id} 
                className={`transition-all duration-300 backdrop-blur-sm overflow-hidden ${styles.border} ${styles.bg} cursor-pointer group hover:scale-[1.01]`}
                onClick={() => onEdit(expense)}
              >
                <CardHeader className="pb-3 border-b border-white/5 bg-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${styles.iconBg} group-hover:scale-110 transition-transform`}>
                        {styles.icon}
                      </div>
                      <div>
                        <CardTitle className="text-white text-base font-medium group-hover:text-[#00FF00] transition-colors">{expense.name}</CardTitle>
                        <CardDescription className="text-gray-400 text-[10px] uppercase tracking-widest mt-0.5">
                          Vencimento: {renderDueRule(expense)}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-gray-500 hover:text-white hover:bg-white/10 rounded-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(expense);
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm("Deseja realmente excluir esta obrigação fixa?")) {
                            onDelete(expense.id);
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {/* CNPJ / Empresa */}
                  {expense.notes && (() => {
                    try {
                      const p = JSON.parse(expense.notes);
                      if (p.company_name) return <div className="text-[9px] text-gray-500 mt-2 uppercase tracking-wider pl-12">{p.company_name}</div>;
                    } catch(e) {}
                    return null;
                  })()}
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex items-end justify-between mb-4">
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Valor do Imposto</p>
                      <div className={`text-2xl font-light ${status === 'liquidado' ? 'text-emerald-400' : 'text-white'}`}>
                        {expense.value_type === 'variable' ? `~${formatCurrencyBRL(expense.amount || 0)}` : formatCurrencyBRL(expense.amount || 0)}
                      </div>
                    </div>
                    <div className="text-right">
                      {styles.badge}
                    </div>
                  </div>

                  <div className="pt-2">
                    {status === 'guia_disponivel' ? (
                      <Button className="w-full bg-[#00FF00] hover:bg-[#00FF00]/80 text-black font-semibold shadow-[0_0_10px_rgba(0,255,0,0.2)]">
                        Pagar Guia
                      </Button>
                    ) : status === 'liquidado' ? (
                      <Button variant="outline" className="w-full border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10">
                        Ver Comprovante
                      </Button>
                    ) : (
                      <div className="w-full text-center py-2.5 mt-1 text-[10px] text-gray-500 font-bold uppercase tracking-widest border border-dashed border-white/5 rounded-md">
                        Aguardando PDF no Cofre
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {taxes.length === 0 && (
            <div className="col-span-full py-12 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-xl">
              <FileText className="h-8 w-8 text-gray-500 mb-3" />
              <p className="text-gray-400 text-sm">Nenhum imposto cadastrado.</p>
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
  );
}
