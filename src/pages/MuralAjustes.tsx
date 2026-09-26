import React, { useState, useEffect } from "react";
import { AlertCircle, Plus, Search, Store, Trash2, ExternalLink, CheckCircle2, Check, Clock, Activity, LayoutGrid } from "lucide-react";
import { SiMercadopago, SiShopee } from "react-icons/si";
import { FaAmazon } from "react-icons/fa";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const getMarketplaceLogo = (marketplace?: string, className = "h-4 w-4") => {
  if (!marketplace) return <Store className={className} />;
  const m = marketplace.toLowerCase();
  if (m === 'mercado livre') return <SiMercadopago className={`text-[#FFE600] ${className}`} />;
  if (m === 'shopee') return <SiShopee className={`text-[#EE4D2D] ${className}`} />;
  if (m === 'amazon') return <FaAmazon className={`text-white ${className}`} />;
  if (m === 'magalu' || m === 'magazine luiza') return <div className={`flex items-center justify-center font-black bg-[#0086FF] text-white rounded-sm text-[10px] ${className}`}>m</div>;
  return <Store className={`text-gray-400 ${className}`} />;
};

export default function MuralAjustes() {
  const { user } = useAuth();
  const userName = user?.user_metadata?.name || 'Sistema';
  
  const [tickets, setTickets] = useState<any[]>([]);
  const [audits, setAudits] = useState<any[]>([]);
  const [filter, setFilter] = useState("todos");
  const [search, setSearch] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    marketplace: 'Mercado Livre',
    sku: '', link: '', description: '', priority: 'normal', assignee_name: 'livre'
  });

  const fetchTicketsAndAudits = async () => {
    const { data: ticketsData } = await supabase.from('ajustes_tickets').select('*').order('created_at', { ascending: false });
    if (ticketsData) setTickets(ticketsData);

    const { data: auditsData } = await supabase.from('ajustes_auditoria').select('*').order('created_at', { ascending: false }).limit(20);
    if (auditsData) setAudits(auditsData);
  };

  useEffect(() => {
    fetchTicketsAndAudits();
    const ticketsSub = supabase.channel('ajustes_tickets_changes').on('postgres_changes', { event: '*', schema: 'public', table: 'ajustes_tickets' }, fetchTicketsAndAudits).subscribe();
    const auditsSub = supabase.channel('ajustes_auditoria_changes').on('postgres_changes', { event: '*', schema: 'public', table: 'ajustes_auditoria' }, fetchTicketsAndAudits).subscribe();
    return () => { supabase.removeChannel(ticketsSub); supabase.removeChannel(auditsSub); }
  }, []);


  const handleClearHistory = async () => {
    if (!window.confirm('Tem certeza que deseja limpar todo o histórico de auditoria? Esta ação não pode ser desfeita.')) return;
    const { error } = await supabase.from('ajustes_auditoria').delete().neq('id', '00000000-0000-0000-0000-000000000000'); // delete all
    if (!error) {
      await fetchTicketsAndAudits();
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description) return;
    const { data: insertedTicket, error } = await supabase.from('ajustes_tickets').insert({
      creator_id: user?.id, creator_name: userName,
      assignee_name: formData.assignee_name === 'livre' ? null : formData.assignee_name,
      marketplace: formData.marketplace, sku: formData.sku, link: formData.link, description: formData.description,
      status: "pendente", priority: formData.priority,
    }).select().single();
    
    if (!error && insertedTicket) {
      await supabase.from('ajustes_auditoria').insert({
        action_type: 'created', user_id: user?.id, user_name: userName, target_id: insertedTicket.id, target_type: 'ticket',
        context_text: `SKU: ${insertedTicket.sku || 'N/A'}`, message: 'abriu um ticket', priority: formData.priority
      });
      setIsModalOpen(false);
      setFormData({ marketplace: 'Mercado Livre', sku: '', link: '', description: '', priority: 'normal', assignee_name: 'livre' });
      await fetchTicketsAndAudits();
    }
  };

  const handleResolve = async (id: string, sku: string) => {
    await supabase.from('ajustes_tickets').update({ status: 'resolvido', resolved_by_id: user?.id, resolved_by_name: userName }).eq('id', id);
    await supabase.from('ajustes_auditoria').insert({
      action_type: 'resolved', user_id: user?.id, user_name: userName, target_id: id, target_type: 'ticket',
      context_text: `SKU: ${sku || 'N/A'}`, message: 'resolveu um ticket', priority: 'normal'
    });
    await fetchTicketsAndAudits();
  };

  const handleDelete = async (id: string, sku: string) => {
    if (!window.confirm('Excluir ticket permanentemente?')) return;
    await supabase.from('ajustes_tickets').delete().eq('id', id);
    await supabase.from('ajustes_auditoria').insert({
      action_type: 'deleted', user_id: user?.id, user_name: userName, target_id: id, target_type: 'ticket',
      context_text: `SKU: ${sku || 'N/A'}`, message: 'excluiu um ticket', priority: 'normal'
    });
    await fetchTicketsAndAudits();
  };

  const filteredTickets = tickets.filter(t => {
    const matchesFilter = filter === "todos" || t.marketplace.toLowerCase() === filter.toLowerCase();
    const matchesSearch = search === "" || t.sku?.toLowerCase().includes(search.toLowerCase()) || t.description?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex-1 w-full bg-transparent min-h-[calc(100vh-64px)] text-white overflow-hidden font-sans flex flex-col xl:flex-row px-4 pb-4 pt-2 gap-4">
      
      {/* MAIN CONTENT (LEFT) */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto pr-2 custom-scrollbar">
        
        {/* MINIMALIST HEADER */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-2 pt-0 shrink-0">
            <h1 className="text-3xl font-light text-white tracking-tight flex items-center gap-4">
              <span className="text-[#00FF00]">Mural de <span className="font-semibold">Ajustes</span>.</span>
              <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-500 border-l border-[#00FF00]/30 pl-4 hidden xl:inline-block mt-1">Correção de Erros e Otimização.</span>
            </h1>
          </div>
  
          {/* MINIMALIST TABS E ACTIONS */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div className="flex flex-wrap gap-2">
              {['Todos', 'Shopee', 'Mercado Livre', 'Amazon', 'Geral'].map((m) => {
                const count = m === 'Todos' ? tickets.length : tickets.filter(t => (t.marketplace || '').toLowerCase() === m.toLowerCase()).length;
                const isActive = filter === m.toLowerCase();
                return (
                  <button 
                    key={m}
                    onClick={() => setFilter(m.toLowerCase())}
                    className={`px-4 py-2 flex items-center gap-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
                      isActive 
                        ? 'bg-white/10 text-white border-white/20' 
                        : 'bg-transparent border-transparent text-gray-500 hover:text-gray-300 hover:bg-white/5'
                    }`}
                  >
                    {m !== 'Todos' && getMarketplaceLogo(m, "h-3.5 w-3.5 opacity-70")}
                    {m}
                    <span className={`px-2 py-0.5 rounded-full text-[10px] ${isActive ? 'bg-[#00FF00] text-black' : 'bg-white/10 text-gray-400'}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-[#00FF00] hover:bg-[#CCFF00] text-black px-6 py-2.5 font-black text-xs uppercase tracking-widest transition-transform hover:scale-105 flex items-center gap-2 border-2 border-[#00FF00] shadow-[0_0_20px_rgba(0,255,0,0.15)]"
            >
              <Plus className="h-4 w-4 stroke-[3]" /> NOVO TICKET
            </button>
          </div>
          
          {/* BRUTALIST TICKETS GRID (COMPACT) */}
          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
            {filteredTickets.map((ticket) => {
              const isResolved = ticket.status === 'resolvido';
              const isCritical = ticket.priority === 'critico';
              
              const cardTheme = isResolved 
                ? "bg-[#0A0A0A] border-y-2 border-white/5 opacity-60"
                : isCritical 
                  ? "bg-[#00FF00] border-y-2 border-[#00FF00] shadow-[0_0_20px_rgba(0,255,0,0.15)]" 
                  : "bg-[#0A0A0A] border-y-2 border-[#00FF00]";
              
              const textColor = isCritical && !isResolved ? "text-black" : "text-white";
              const mutedColor = isCritical && !isResolved ? "text-black/70" : "text-gray-400";
              const pillTheme = isCritical && !isResolved ? "bg-black text-[#00FF00]" : "bg-white/10 text-white";
              const dividerTheme = isCritical && !isResolved ? "bg-black/20" : "bg-white/10";

              return (
                <div key={ticket.id} className={`flex flex-col p-4 transition-all duration-300 hover:-translate-y-1 ${cardTheme}`}>
                  
                  {/* CATEGORY PILL */}
                  <div className="flex justify-between items-start mb-4">
                    <div className={`px-2 py-1 text-[8px] font-black uppercase tracking-[0.2em] flex items-center gap-1.5 ${pillTheme}`}>
                      {getMarketplaceLogo(ticket.marketplace, "h-2.5 w-2.5")}
                      {ticket.marketplace}
                    </div>
                  </div>

                  {/* TITLE / SKU */}
                  <div className="flex flex-col gap-1.5 flex-1">
                    {ticket.sku && (
                      <h3 className={`text-lg md:text-xl font-black uppercase tracking-tighter leading-none ${textColor} ${isResolved ? 'line-through opacity-50' : ''}`}>
                        {ticket.sku}
                      </h3>
                    )}
                    <p className={`text-xs font-bold leading-snug ${mutedColor} ${isResolved ? 'line-through' : ''}`}>
                      {ticket.description}
                    </p>
                  </div>

                  {/* DIVIDER */}
                  <div className={`w-full h-px my-4 ${dividerTheme}`} />

                  {/* FOOTER */}
                  <div className="flex items-center justify-between mt-auto">
                    <div className={`text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 ${mutedColor}`}>
                      {ticket.assignee_name ? (
                        <>
                          <span>HOJE</span>
                          <span className="mx-0.5">•</span>
                          <span>{ticket.assignee_name.split(' ')[0]}</span>
                        </>
                      ) : (
                        <span>NÃO ATRIBUÍDO</span>
                      )}
                    </div>

                    {/* ACTIONS */}
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleDelete(ticket.id, ticket.sku)} className={`p-1.5 hover:scale-110 transition-transform ${isCritical && !isResolved ? 'text-black/60 hover:text-black' : 'text-gray-500 hover:text-white'}`} title="Excluir">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                      {(ticket.link || ticket.sku) && (
                        <a href={ticket.link || '#'} target="_blank" rel="noopener noreferrer" className={`p-1.5 hover:scale-110 transition-transform ${isCritical && !isResolved ? 'text-black/60 hover:text-black' : 'text-gray-500 hover:text-white'}`} title="Abrir Anúncio">
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}

                      {!isResolved ? (
                        <button onClick={() => handleResolve(ticket.id, ticket.sku)} className={`ml-1.5 h-8 w-8 flex items-center justify-center rounded-full transition-transform hover:scale-105 shadow-xl ${isCritical && !isResolved ? 'bg-black text-[#00FF00]' : 'bg-[#00FF00] text-black'}`} title="Resolver">
                          <Check className="w-4 h-4 stroke-[3]" />
                        </button>
                      ) : (
                        <div className="ml-1.5 h-8 w-8 flex items-center justify-center rounded-full bg-white/5 text-gray-500" title="Resolvido">
                          <Check className="w-4 h-4 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
{filteredTickets.length === 0 && (
            <div className="col-span-full py-16 flex flex-col items-center justify-center text-gray-500">
              <CheckCircle2 className="h-12 w-12 mb-4 text-white/10" />
              <p>Nenhum ajuste pendente encontrado.</p>
            </div>
          )}
        </div>
      </div>

      {/* MINIMALIST AUDIT SIDEBAR */}
      <div className="w-full xl:w-[320px] shrink-0 bg-[#0A0A0A] border border-white/10 rounded-3xl flex flex-col h-[calc(100vh-32px)] shadow-2xl">
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Activity className="h-4 w-4 text-[#00FF00]" />
              <h3 className="text-white font-bold text-xs tracking-widest uppercase">Feed de Auditoria</h3>
            </div>
            <button onClick={handleClearHistory} className="text-gray-500 hover:text-red-400 transition-colors bg-white/5 hover:bg-white/10 p-1.5 rounded-md" title="Limpar Histórico">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        
        <div className="flex-1 p-5 overflow-y-auto custom-scrollbar">
          <div className="space-y-6 relative before:absolute before:inset-y-0 before:left-[3px] before:w-[1px] before:bg-gradient-to-b before:from-white/10 before:to-transparent">
            {audits.map((audit) => {
              const timeStr = new Date(audit.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
              const isCritical = audit.priority === 'critico';
              
              return (
                <div key={audit.id} className="relative pl-5 group">
                  <div className={`absolute left-0 top-1.5 w-2 h-2 rounded-full ${isCritical ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 'bg-[#00FF00] shadow-[0_0_8px_rgba(204,255,0,0.8)]'}`} />
                  <p className="text-[11px] text-gray-300 leading-relaxed mb-1">
                    <span className={`font-bold ${isCritical ? 'text-red-400' : 'text-white'}`}>{audit.user_name || 'Sistema'}</span> {audit.message}
                  </p>
                  {audit.context_text && (
                    <span className="inline-block mb-1.5 bg-white/5 border border-white/10 text-gray-400 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {audit.context_text}
                    </span>
                  )}
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <Clock className="h-2.5 w-2.5" />
                    <span className="text-[9px] font-medium">{timeStr}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* GLASSMORPHISM MODAL */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-[#111111]/95 backdrop-blur-md border-white/10 text-white max-w-md rounded-2xl p-5 shadow-2xl">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl font-light flex items-center gap-2">
              <Plus className="h-5 w-5 text-[#00FF00]" /> Novo Ticket
            </DialogTitle>
            <DialogDescription className="text-gray-400 text-xs">
              Preencha os detalhes para solicitar uma correção.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateTicket} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Plataforma</label>
                <Select value={formData.marketplace} onValueChange={v => setFormData({...formData, marketplace: v})}>
                  <SelectTrigger className="bg-white/5 border-transparent text-white rounded-lg focus:ring-1 focus:ring-[#00FF00]/50 h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#111] border-white/10 text-white rounded-lg">
                    {['Mercado Livre', 'Shopee', 'Magalu', 'Amazon', 'Geral'].map(m => (
                      <SelectItem key={m} value={m} className="hover:bg-white/10">{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Responsável</label>
                <Select value={formData.assignee_name} onValueChange={v => setFormData({...formData, assignee_name: v})}>
                  <SelectTrigger className="bg-white/5 border-transparent text-white rounded-lg focus:ring-1 focus:ring-[#00FF00]/50 h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#111] border-white/10 text-white rounded-lg">
                    <SelectItem value="livre" className="hover:bg-white/10">Livre</SelectItem>
                    <SelectItem value="Rogério" className="hover:bg-white/10">Rogério</SelectItem>
                    <SelectItem value="Anderson" className="hover:bg-white/10">Anderson</SelectItem>
                      <SelectItem value="Alyson" className="hover:bg-white/10">Alyson</SelectItem>
                      <SelectItem value="William" className="hover:bg-white/10">William</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">SKU</label>
                <input type="text" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} placeholder="Ex: KIT001" className="w-full bg-white/5 border-transparent rounded-lg px-3 h-9 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#00FF00]/50 uppercase" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Link</label>
                <input type="text" value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} placeholder="Opcional..." className="w-full bg-white/5 border-transparent rounded-lg px-3 h-9 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#00FF00]/50" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Descrição</label>
              <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required placeholder="O que precisa ser ajustado?" className="w-full bg-white/5 border-transparent rounded-lg p-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#00FF00]/50 min-h-[80px] resize-none" />
            </div>

            <div className="flex items-center justify-between pt-2 mt-2">
              <div className="flex items-center gap-2 bg-[#0A0A0A] p-1 rounded-lg border border-white/5">
                <button type="button" onClick={() => setFormData({...formData, priority: 'normal'})} className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${formData.priority === 'normal' ? 'bg-white/10 text-white' : 'text-gray-600'}`}>Normal</button>
                <button type="button" onClick={() => setFormData({...formData, priority: 'critico'})} className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${formData.priority === 'critico' ? 'bg-red-500/20 text-red-400' : 'text-gray-600'}`}>Crítico</button>
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-wider">Cancelar</button>
                <button type="submit" className="bg-[#00FF00] hover:bg-[#00FF00]/80 text-black px-5 py-2 rounded-lg text-xs font-bold transition-all shadow-[0_0_15px_rgba(204,255,0,0.2)] uppercase tracking-wider">Criar Ticket</button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
