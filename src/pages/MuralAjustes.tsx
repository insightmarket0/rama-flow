import React, { useState, useEffect } from "react";
import { AlertCircle, Plus, Search, Store, Trash2, ExternalLink, CheckCircle2, Clock, Activity, LayoutGrid } from "lucide-react";
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
    }
  };

  const handleResolve = async (id: string, sku: string) => {
    await supabase.from('ajustes_tickets').update({ status: 'resolvido', resolved_by_id: user?.id, resolved_by_name: userName }).eq('id', id);
    await supabase.from('ajustes_auditoria').insert({
      action_type: 'resolved', user_id: user?.id, user_name: userName, target_id: id, target_type: 'ticket',
      context_text: `SKU: ${sku || 'N/A'}`, message: 'resolveu um ticket', priority: 'normal'
    });
  };

  const handleDelete = async (id: string, sku: string) => {
    if (!window.confirm('Excluir ticket permanentemente?')) return;
    await supabase.from('ajustes_tickets').delete().eq('id', id);
    await supabase.from('ajustes_auditoria').insert({
      action_type: 'deleted', user_id: user?.id, user_name: userName, target_id: id, target_type: 'ticket',
      context_text: `SKU: ${sku || 'N/A'}`, message: 'excluiu um ticket', priority: 'normal'
    });
  };

  const filteredTickets = tickets.filter(t => {
    const matchesFilter = filter === "todos" || t.marketplace.toLowerCase() === filter.toLowerCase();
    const matchesSearch = search === "" || t.sku?.toLowerCase().includes(search.toLowerCase()) || t.description?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex-1 w-full bg-transparent min-h-[calc(100vh-64px)] text-white overflow-hidden font-sans flex flex-col xl:flex-row p-4 gap-4">
      
      {/* MAIN CONTENT (LEFT) */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto pr-2 custom-scrollbar">
        
        {/* MINIMALIST HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pt-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-light text-white flex items-center gap-3">
              <LayoutGrid className="h-8 w-8 text-[#00FF00]" />
              Mural de Ajustes
            </h1>
            <p className="text-xs font-medium tracking-[0.2em] uppercase text-[#00FF00]">
              Correção de Erros e Otimização
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 group-focus-within:text-[#00FF00] transition-colors" />
              <input 
                type="text" 
                placeholder="Buscar SKU ou tarefa..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-white/[0.02] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#00FF00]/50 focus:bg-white/[0.05] transition-all w-64 md:w-80"
              />
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-[#00FF00] hover:bg-[#00FF00]/80 text-black px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-[0_0_15px_rgba(204,255,0,0.2)] hover:shadow-[0_0_20px_rgba(204,255,0,0.4)] flex items-center gap-2"
            >
              <Plus className="h-4 w-4" /> Novo Ticket
            </button>
          </div>
        </div>

        {/* MINIMALIST TABS */}
        <div className="flex flex-wrap gap-2 mb-6">
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

        {/* GLASSMORPHISM TICKETS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
          {filteredTickets.map((ticket) => {
            const isResolved = ticket.status === 'resolvido';
            const isCritical = ticket.priority === 'critico';
            
            return (
              <div key={ticket.id} className={`flex flex-col bg-[#111111]/80 backdrop-blur-sm border rounded-2xl overflow-hidden transition-all duration-300 hover:border-white/20 hover:shadow-2xl hover:-translate-y-1 ${isResolved ? 'border-white/5 opacity-60' : isCritical ? 'border-red-500/30' : 'border-white/10'}`}>
                
                {/* HEADER */}
                <div className={`p-4 border-b flex justify-between items-center bg-gradient-to-r ${isResolved ? 'from-white/[0.02] border-white/5' : isCritical ? 'from-red-500/10 border-red-500/20' : 'from-white/[0.02] border-white/5'}`}>
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${isCritical && !isResolved ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse' : 'bg-[#00FF00] shadow-[0_0_8px_rgba(204,255,0,0.6)]'}`} />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300 flex items-center gap-1.5">
                      {getMarketplaceLogo(ticket.marketplace)}
                      {ticket.marketplace}
                    </span>
                  </div>
                  <div className="text-[10px] text-gray-500 font-medium flex items-center gap-1">
                    <Clock className="h-3 w-3" /> Hoje
                  </div>
                </div>

                {/* BODY */}
                <div className="p-5 flex flex-col gap-3 flex-1">
                  {ticket.sku && (
                    <div className="flex items-center gap-2 text-sm text-white font-bold tracking-wide">
                      <span className="text-xs text-gray-500 uppercase font-medium">SKU</span>
                      {ticket.sku}
                    </div>
                  )}
                  <p className={`text-sm leading-relaxed font-light ${isResolved ? 'line-through text-gray-500' : 'text-gray-300'}`}>
                    {ticket.description}
                  </p>
                </div>

                {/* FOOTER ACTIONS */}
                <div className="p-4 border-t border-white/5 flex justify-between items-center bg-white/[0.01]">
                  <div className="flex items-center gap-2">
                    {ticket.assignee_name ? (
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-[10px] font-bold text-white">
                          {ticket.assignee_name.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="text-xs text-gray-400 font-medium">{ticket.assignee_name.split(' ')[0]}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-600 font-medium italic">Sem responsável</span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleDelete(ticket.id, ticket.sku)} className="p-1.5 text-gray-500 hover:text-red-400 transition-colors rounded-lg hover:bg-white/5" title="Excluir">
                      <Trash2 className="h-4 w-4" />
                    </button>
                    {(ticket.link || ticket.sku) && (
                      <a href={ticket.link || '#'} target="_blank" rel="noopener noreferrer" className="p-1.5 text-gray-500 hover:text-white transition-colors rounded-lg hover:bg-white/5" title="Abrir Anúncio">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                    {!isResolved ? (
                      <button onClick={() => handleResolve(ticket.id, ticket.sku)} className="ml-2 px-3 py-1.5 bg-transparent border border-[#00FF00]/50 text-[#00FF00] hover:bg-[#00FF00] hover:text-black hover:border-[#00FF00] transition-all rounded-lg font-bold flex items-center gap-1.5 text-[10px] uppercase tracking-widest shadow-[0_0_10px_rgba(204,255,0,0.1)]">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Resolver
                      </button>
                    ) : (
                      <span className="ml-2 px-3 py-1.5 bg-white/5 text-[#00FF00]/60 rounded-lg font-bold flex items-center gap-1.5 text-[10px] uppercase tracking-widest">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Resolvido
                      </span>
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
        <div className="p-5 border-b border-white/5 flex items-center gap-3">
          <Activity className="h-4 w-4 text-[#00FF00]" />
          <h3 className="text-white font-bold text-xs tracking-widest uppercase">Feed de Auditoria</h3>
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
        <DialogContent className="bg-[#111111]/95 backdrop-blur-md border-white/10 text-white max-w-md rounded-3xl p-6 shadow-2xl">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-xl font-light flex items-center gap-2">
              <Plus className="h-5 w-5 text-[#00FF00]" /> Novo Ticket
            </DialogTitle>
            <DialogDescription className="text-gray-400 text-xs">
              Preencha os detalhes para solicitar uma correção.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateTicket} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Plataforma</label>
                <Select value={formData.marketplace} onValueChange={v => setFormData({...formData, marketplace: v})}>
                  <SelectTrigger className="bg-white/5 border-transparent text-white rounded-xl focus:ring-1 focus:ring-[#00FF00]/50 h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#111] border-white/10 text-white rounded-xl">
                    {['Mercado Livre', 'Shopee', 'Magalu', 'Amazon', 'Geral'].map(m => (
                      <SelectItem key={m} value={m} className="hover:bg-white/10">{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Responsável</label>
                <Select value={formData.assignee_name} onValueChange={v => setFormData({...formData, assignee_name: v})}>
                  <SelectTrigger className="bg-white/5 border-transparent text-white rounded-xl focus:ring-1 focus:ring-[#00FF00]/50 h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#111] border-white/10 text-white rounded-xl">
                    <SelectItem value="livre" className="hover:bg-white/10">Livre</SelectItem>
                    <SelectItem value="Rogério" className="hover:bg-white/10">Rogério</SelectItem>
                    <SelectItem value="Anderson" className="hover:bg-white/10">Anderson</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">SKU</label>
                <input type="text" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} placeholder="Ex: KIT001" className="w-full bg-white/5 border-transparent rounded-xl px-4 h-11 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#00FF00]/50 uppercase" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Link</label>
                <input type="text" value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} placeholder="Opcional..." className="w-full bg-white/5 border-transparent rounded-xl px-4 h-11 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#00FF00]/50" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Descrição</label>
              <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required placeholder="O que precisa ser ajustado?" className="w-full bg-white/5 border-transparent rounded-xl p-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#00FF00]/50 min-h-[100px] resize-none" />
            </div>

            <div className="flex items-center justify-between pt-4 mt-4">
              <div className="flex items-center gap-2 bg-[#0A0A0A] p-1 rounded-xl border border-white/5">
                <button type="button" onClick={() => setFormData({...formData, priority: 'normal'})} className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${formData.priority === 'normal' ? 'bg-white/10 text-white' : 'text-gray-600'}`}>Normal</button>
                <button type="button" onClick={() => setFormData({...formData, priority: 'critico'})} className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${formData.priority === 'critico' ? 'bg-red-500/20 text-red-400' : 'text-gray-600'}`}>Crítico</button>
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-wider">Cancelar</button>
                <button type="submit" className="bg-[#00FF00] hover:bg-[#00FF00]/80 text-black px-6 py-2 rounded-xl text-xs font-bold transition-all shadow-[0_0_15px_rgba(204,255,0,0.2)] uppercase tracking-wider">Criar Ticket</button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
