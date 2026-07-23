import { StaffPopover } from './StaffPopover';
import { UtilityPopover } from './UtilityPopover';
import { SubscriptionPopover } from './SubscriptionPopover';
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Briefcase, Zap, Droplets, Wifi, Building, Users, Pencil, Trash2, Bot, Scale, Rocket, TrendingUp, Truck, Heart, Calculator } from "lucide-react";
import { formatCurrencyBRL } from "@/lib/format";

const CORE_SLOTS = [
  { id: "prolabore", name: "Pró-labore (Diretoria)", category: "folha", icon: Briefcase, color: "text-blue-500", bg: "bg-blue-500/10", aliases: ["pró-labore", "prolabore"] },
  { id: "folha", name: "Folha de Pagamento", category: "folha", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10", aliases: ["folha", "salário", "salario", "funcionário"] },
  { id: "aluguel", name: "Aluguel Comercial", category: "infraestrutura", icon: Building, color: "text-cyan-500", bg: "bg-cyan-500/10", aliases: ["aluguel"] },
  { id: "energia", name: "Energia Elétrica", category: "infraestrutura", icon: Zap, color: "text-cyan-500", bg: "bg-cyan-500/10", aliases: ["energia", "luz", "enel", "cemig", "cpfl"] },
  { id: "agua", name: "Água e Esgoto", category: "infraestrutura", icon: Droplets, color: "text-cyan-500", bg: "bg-cyan-500/10", aliases: ["agua", "água", "sabesp", "copasa", "caesb"] },
  { id: "internet", name: "Internet / Telecom", category: "infraestrutura", icon: Wifi, color: "text-cyan-500", bg: "bg-cyan-500/10", aliases: ["internet", "vivo", "claro", "tim", "telefone"] },
  { id: "gemini", name: "Google Gemini", category: "software", icon: Bot, color: "text-emerald-500", bg: "bg-emerald-500/10", aliases: ["gemini", "google", "ia", "ai"] },
  { id: "saude", name: "Plano de Saúde", category: "servicos", icon: Heart, color: "text-stone-400", bg: "bg-stone-400/10", aliases: ["saúde", "saude", "unimed", "amil", "bradesco", "sulamerica", "plano de saúde", "convenio", "convênio"] },
  { id: "advogado", name: "Heloíde Advogada", category: "servicos", icon: Scale, color: "text-stone-400", bg: "bg-stone-400/10", aliases: ["advogado", "advogada", "jurídico", "juridica", "assessoria", "honorário", "heloíde", "heloide"] },
  { id: "contabilidade", name: "Contabilidade Ideal", category: "servicos", icon: Calculator, color: "text-stone-400", bg: "bg-stone-400/10", aliases: ["contabilidade", "contador", "contábil", "impostos", "ideal"] },
  { id: "mercadoturbo", name: "Mercado Turbo", category: "software", icon: Rocket, color: "text-emerald-500", bg: "bg-emerald-500/10", aliases: ["mercado turbo", "turbo", "meli"] },
  { id: "upseller", name: "Up Seller", category: "software", icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10", aliases: ["up seller", "upseller", "up seller"] },
  { id: "flex", name: "Logística Flex (Motoboy)", category: "servicos", icon: Truck, color: "text-stone-400", bg: "bg-stone-400/10", aliases: ["flex", "motoboy", "entrega", "entregas", "logística", "logistica"] }
];

export function ContractManagementTab({ 
  smartContracts = [], 
  pastInstallments = [],
  onEditContract, 
  onDelete, 
  onCreateSlot 
}: { 
  smartContracts?: any[]; 
  pastInstallments?: any[];
  onEditContract?: (expense: any, slotId?: string) => void;
  onDelete?: (id: string) => void;
  onCreateSlot?: (name: string, category: string, slotId?: string) => void;
}) {
  const allExpenses = smartContracts || [];

  // Identify which expenses fit into the core slots
  const slotMatches = CORE_SLOTS.map(slot => {
    // Simple matching by name substring (case insensitive)
    const match = allExpenses.find(e => {
      const eName = e.name.toLowerCase();
      const sName = slot.name.toLowerCase();
      if (eName.includes(sName.split(' ')[0])) return true;
      if (slot.aliases && slot.aliases.some((alias: string) => eName.includes(alias))) return true;
      return false;
    });
    return { ...slot, match };
  });

  // Leftovers go to "Outros Contratos"
  const matchedIds = slotMatches.filter(s => s.match).map(s => s.match.id);
  const leftoverExpenses = allExpenses.filter(e => !matchedIds.includes(e.id));

  const renderDueRule = (expense: any) => {
    if (expense.due_rule_type === "days_after_start") return `${expense.due_day_offset || 0} dias após inicio`;
    if (Array.isArray(expense.due_days) && expense.due_days.length > 0) {
      const sortedDays = [...expense.due_days].sort((a, b) => Number(a) - Number(b));
      return `Dias ${sortedDays.join(', ')}`;
    }
    return `Dia ${expense.due_day || '?'}`;
  };

  
  const renderSlotCard = (slot: any) => {
            const isConfigured = !!slot.match;
            const Icon = slot.icon;
            
            let splitRules = [];
            if (isConfigured && slot.match.notes) {
              try {
                const p = JSON.parse(slot.match.notes);
                if (p.split_rules) splitRules = p.split_rules;
              } catch(e) {}
            }

            return (
              <Card key={slot.id} className={`bg-[#111111]/80 backdrop-blur-sm border ${isConfigured ? 'border-white/10' : 'border-dashed border-white/5'} overflow-hidden transition-all hover:border-white/20`}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-md ${slot.bg} ${slot.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <CardTitle className="text-white text-base font-medium truncate max-w-[180px]">
                        {slot.name}
                      </CardTitle>
                    </div>
                    {isConfigured && (
                      <Badge variant="outline" className="text-[9px] uppercase border-[#00FF00]/20 text-[#00FF00] bg-[#00FF00]/5">
                        Ativo
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent>
                  {isConfigured ? (
                    <div className="space-y-4 pt-2">
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Valor Base</p>
                          <div className="text-2xl font-light text-white">
                            {slot.match.value_type === 'variable' ? `~${formatCurrencyBRL(slot.match.amount || 0)}` : formatCurrencyBRL(slot.match.amount || 0)}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Vencimento</p>
                          <div className="text-sm font-medium text-gray-300">{renderDueRule(slot.match)}</div>
                        </div>
                      </div>

                      {/* Tempo Restante para Longo Prazo */}
                      {(() => {
                        if (!slot.match.start_date) return null;
                        if (slot.match.recurrence_type !== 'semestral' && slot.match.recurrence_type !== 'anual') return null;
                        
                        const start = new Date(slot.match.start_date + "T12:00:00");
                        const today = new Date();
                        today.setHours(12, 0, 0, 0);
                        
                        const diffTime = start.getTime() - today.getTime();
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                        
                        if (diffDays <= 0) return null;
                        
                        const totalDays = slot.match.recurrence_type === 'semestral' ? 180 : 365;
                        const percentLeft = Math.max(0, Math.min(100, (diffDays / totalDays) * 100));
                        
                        return (
                          <div className="bg-white/5 rounded-lg p-3 border border-white/5 space-y-2 mt-2">
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-gray-400">Tempo de Sistema Ativo</span>
                              <span className="text-[#00FF00] font-medium">
                                {diffDays > 30 ? `~ ${Math.floor(diffDays / 30)} meses restantes` : `${diffDays} dias restantes`}
                              </span>
                            </div>
                            <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-emerald-500 to-[#00FF00] rounded-full" 
                                style={{ width: `${percentLeft}%` }}
                              />
                            </div>
                          </div>
                        );
                      })()}

                                            {/* Histórico para Variáveis */}
                      {(() => {
                        if (slot.match.value_type !== 'variable') return null;
                        const history = pastInstallments.filter(i => i.recurring_expense_id === slot.match.id && (i.status === 'pago' || i.value > 0)).slice(0, 3);
                        if (history.length === 0) {
                          return (
                            <div className="bg-white/5 rounded-lg p-3 border border-white/5 space-y-2 mt-2">
                              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Últimas Faturas</p>
                              <div className="text-xs text-gray-500 italic text-center py-2">
                                Nenhum histórico de fatura pago
                              </div>
                            </div>
                          );
                        }
                        
                        return (
                          <div className="bg-white/5 rounded-lg p-3 border border-white/5 space-y-2 mt-2">
                            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Últimas Faturas</p>
                            <div className="flex justify-between gap-2">
                              {history.map((h, i) => {
                                const dt = new Date(h.due_date);
                                const mes = dt.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');
                                return (
                                  <div key={i} className="flex-1 bg-black/40 rounded-md p-1.5 text-center border border-white/5">
                                    <div className="text-[9px] text-gray-500 uppercase">{mes}</div>
                                    <div className="text-xs font-medium text-gray-300">
                                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(h.value || 0)}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })()}

                      {/* Exibir Fracionamento visivelmente */}
                      {splitRules.length > 0 && (
                        <div className="bg-white/5 rounded-lg p-3 border border-white/5 space-y-2 mt-2">
                          <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Divisões (Beneficiários)</p>
                          <div className="space-y-1">
                            {[...splitRules].sort((a: any, b: any) => a.day - b.day).map((rule: any, i: number) => (
                              <div key={i} className="flex justify-between text-xs text-gray-300">
                                <span>{rule.name}</span>
                                <span className="text-gray-500">Dia {rule.day}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons logic */}
                      {(() => {
                      const isStaff = slot.id === 'prolabore' || slot.id === 'folha';
                      const isUtility = ['aluguel', 'energia', 'agua', 'internet'].includes(slot.id);
                      const isSubscription = ['gemini', 'advogado', 'mercadoturbo', 'upseller', 'flex', 'saude', 'contabilidade'].includes(slot.id);
                        
                        
                        const editProps = { variant: "ghost" as any, size: "sm" as any, className: "text-[11px] uppercase tracking-widest font-medium text-gray-500 hover:text-white hover:bg-transparent p-1 h-auto transition-colors flex items-center justify-center" };
                        const editInner = <><Pencil className="h-3 w-3 mr-1.5 shrink-0" /> <span className="pt-[1px]">Editar</span></>;
                        const PlainEditBtn = <Button {...editProps} onClick={(e) => { e.preventDefault(); onEditContract?.(slot.match, slot.id); }}>{editInner}</Button>;
                        const PopoverEditBtn = <Button {...editProps}>{editInner}</Button>;


                        return (
                          <div className="flex items-center justify-center gap-8 pt-3 mt-2 border-t border-white/5">
                            {isStaff ? (
                              <StaffPopover type={slot.id as any} expenseToEdit={slot.match}>
                                {PopoverEditBtn}
                              </StaffPopover>
                            ) : isUtility ? (
                              <UtilityPopover type={slot.id as any} expenseToEdit={slot.match}>
                                {PopoverEditBtn}
                              </UtilityPopover>
                            ) : isSubscription ? (
                              <SubscriptionPopover type={slot.id as any} expenseToEdit={slot.match}>
                                {PopoverEditBtn}
                              </SubscriptionPopover>
                            ) : (
                              PlainEditBtn
                            )}
                            <Button variant="ghost" size="sm" className="text-red-500/30 hover:text-red-400 hover:bg-transparent p-1 h-auto transition-colors flex items-center justify-center" onClick={() => onDelete(slot.match.id)} title="Remover">
                              <Trash2 className="h-3 w-3 shrink-0" />
                            </Button>
                          </div>
                        );
                      })()}
                    </div>
                  ) : (
                    (() => {
                      const isStaff = slot.id === 'prolabore' || slot.id === 'folha';
                      const isUtility = ['aluguel', 'energia', 'agua', 'internet'].includes(slot.id);
                      const isSubscription = ['gemini', 'advogado', 'mercadoturbo', 'upseller', 'flex', 'saude', 'contabilidade'].includes(slot.id);
                      
                      
                      const createProps = { variant: "outline" as any, className: "border-white/10 hover:bg-white/10 text-gray-300 text-xs h-8" };
                      const createInner = <><Plus className="h-3 w-3 mr-2" /> Configurar {slot.name}</>;
                      const PlainCreateBtn = <Button {...createProps} onClick={(e) => { e.preventDefault(); onCreateSlot(slot.name, slot.category, slot.id); }}>{createInner}</Button>;
                      const PopoverCreateBtn = <Button {...createProps}>{createInner}</Button>;


                      return (
                        <div className="py-6 flex flex-col items-center justify-center text-center space-y-3">
                          <p className="text-xs text-gray-500">Nenhum contrato associado.</p>
                          {isStaff ? (
                            <StaffPopover type={slot.id as any}>
                              {PopoverCreateBtn}
                            </StaffPopover>
                          ) : isUtility ? (
                            <UtilityPopover type={slot.id as any}>
                              {PopoverCreateBtn}
                            </UtilityPopover>
                          ) : isSubscription ? (
                            <SubscriptionPopover type={slot.id as any}>
                              {PopoverCreateBtn}
                            </SubscriptionPopover>
                          ) : (
                            PlainCreateBtn
                          )}
                        </div>
                      );
                    })()
                  )}
                </CardContent>
              </Card>
            );

  };

  const getCategoryTotal = (ids: string[]) => {
    const total = slotMatches
      .filter(s => ids.includes(s.id) && s.match)
      .reduce((acc, s) => acc + (s.match.amount || 0), 0);
    if (total === 0) return null;
    return (
      <div className="ml-3 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-gray-400">
        {formatCurrencyBRL(total)}
      </div>
    );
  };

  return (
    <div className="space-y-12">
      {/* 1. RH */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <Users className="h-5 w-5 text-blue-500" />
          <h2 className="text-xl font-light text-white tracking-tight flex items-center">
            Equipe & Talentos (RH)
            {getCategoryTotal(['prolabore', 'folha'])}
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {slotMatches.filter(s => ['prolabore', 'folha'].includes(s.id)).map(renderSlotCard)}
        </div>
      </div>

      {/* 2. INFRA */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <Building className="h-5 w-5 text-cyan-500" />
          <h2 className="text-xl font-light text-white tracking-tight flex items-center">
            Infraestrutura Operacional
            {getCategoryTotal(['aluguel', 'energia', 'agua', 'internet'])}
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {slotMatches.filter(s => ['aluguel', 'energia', 'agua', 'internet'].includes(s.id)).map(renderSlotCard)}
        </div>
      </div>

      {/* 3. SOFTWARES & ASSINATURAS */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <Briefcase className="h-5 w-5 text-emerald-500" />
          <h2 className="text-xl font-light text-white tracking-tight flex items-center">
            Softwares & Assinaturas
            {getCategoryTotal(['gemini', 'mercadoturbo', 'upseller'])}
          </h2>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {slotMatches.filter(s => ['gemini', 'mercadoturbo', 'upseller'].includes(s.id)).map(renderSlotCard)}
        </div>
      </div>

      {/* 4. SERVIÇOS CONTRATADOS */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <Briefcase className="h-5 w-5 text-stone-400" />
          <h2 className="text-xl font-light text-white tracking-tight flex items-center">
            Serviços Contratados
            {getCategoryTotal(['saude', 'advogado', 'contabilidade', 'flex'])}
          </h2>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {slotMatches.filter(s => ['saude', 'advogado', 'contabilidade', 'flex'].includes(s.id)).map(renderSlotCard)}
        </div>
      </div>

      {leftoverExpenses.length > 0 && (
        <div className="pt-8">
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-xl font-light text-white tracking-tight flex items-center">
              Outras Contas Fixas
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {leftoverExpenses.map(expense => {
               let splitRules = [];
             if (expense.notes) {
               try {
                 const p = JSON.parse(expense.notes);
                 if (p.split_rules) splitRules = p.split_rules;
               } catch(e) {}
             }

             return (
               <Card key={expense.id} className="bg-[#111111]/80 backdrop-blur-sm border border-white/5 hover:border-white/10 transition-all">
                <CardHeader className="pb-2 border-b border-white/5 bg-white/5">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white text-base font-medium truncate">{expense.name}</CardTitle>
                    {!expense.is_active && <Badge variant="outline" className="text-[9px] border-white/10 text-gray-500">Pausado</Badge>}
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex items-end justify-between mb-4">
                    <div>
                      <div className="text-xl font-light text-[#00FF00]">
                        {expense.value_type === 'variable' ? `~${formatCurrencyBRL(expense.amount || 0)}` : formatCurrencyBRL(expense.amount || 0)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-400">{renderDueRule(expense)}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="w-full text-gray-400 hover:text-white hover:bg-white/10 h-8" onClick={() => onEditContract?.(expense)}>
                      <Pencil className="h-3 w-3 mr-2" /> Editar
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full text-red-500 hover:text-red-400 hover:bg-red-500/10 h-8" onClick={() => onDelete(expense.id)}>
                      <Trash2 className="h-3 w-3 mr-2" /> Excluir
                    </Button>
                  </div>
                </CardContent>
               </Card>
              );
          })}
          </div>
        </div>
      )}
    </div>
  );
}
