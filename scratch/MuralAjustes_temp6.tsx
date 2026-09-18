import React, { useState } from "react";
import { 
  AlertCircle,
  Activity, 
  CheckCircle2, 
  Clock, 
  MessageSquare, 
  Plus, 
  Search,
  ShoppingCart,
  Store,
  Trash2,
  ExternalLink,
  Tag,
  Handshake,
  ShoppingBag,
  Smile,
  Smartphone
} from "lucide-react";
import { SiMercadopago, SiShopee } from "react-icons/si";
import { FaAmazon } from "react-icons/fa";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

const getMarketplaceLogo = (marketplace?: string) => {
  if (!marketplace) return <Store className="h-3.5 w-3.5 opacity-70 shrink-0" />;
  const m = marketplace.toLowerCase();
  
  if (m === 'mercado livre') {
    return <SiMercadopago className="h-4 w-4 text-[#FFE600] shrink-0 drop-shadow-[0_0_2px_rgba(255,230,0,0.5)]" />;
  }
  if (m === 'shopee') {
    return <SiShopee className="h-4 w-4 text-[#EE4D2D] shrink-0 drop-shadow-[0_0_2px_rgba(238,77,45,0.5)]" />;
  }
  if (m === 'amazon') {
    return <FaAmazon className="h-4 w-4 text-white shrink-0 drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]" />;
  }
  if (m === 'magalu') {
    return (
      <div className="h-4 w-4 rounded-sm bg-[#0086FF] flex items-center justify-center shrink-0">
        <span className="text-white text-[10px] font-bold leading-none -mt-[1px]">m</span>
      </div>
    );
  }
  
  return <Store className="h-3.5 w-3.5 opacity-70 shrink-0" />;
};

// Dados mockados baseados nos exemplos reais solicitados pelo usuÃ¡rio
const MOCK_TICKETS: any[] = [
  {
    id: "1",
    creator_id: "user_manager",
    creator_name: "Anderson",
    assignee_id: "user_rogerio",
    assignee_name: "RogÃ©rio",
    marketplace: "Mercado Livre",
    sku: "KITGAS001",
    description: "Aviso no kit de gÃ¡s: corrigir a imagem e a descriÃ§Ã£o. Tem duas abraÃ§adeiras na foto, mas Ã© sÃ³ uma.",
    status: "pendente",
    priority: "normal",
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins atrÃ¡s
  },
  {
    id: "2",
    creator_id: "user_manager",
    creator_name: "Anderson",
    assignee_id: null,
    assignee_name: null,
    marketplace: "Shopee",
    sku: "CAP002",
    description: "Retirar a marca do tÃ­tulo e descriÃ§Ã£o do anÃºncio do cap na Shopee para evitar bloqueio.",
    status: "pendente",
    priority: "critico",
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
  },
  {
    id: "3",
    creator_id: "user_manager",
    creator_name: "Anderson",
    assignee_id: "user_rogerio",
    assignee_name: "RogÃ©rio",
    marketplace: "Amazon",
    sku: "MANG003",
    description: "Alterar as especificaÃ§Ãµes do produto: retira a mangueira comum da descriÃ§Ã£o porque Ã© uma pigtail.",
    status: "pendente",
    priority: "normal",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
  },
  {
    id: "4",
    creator_id: "user_manager",
    creator_name: "Anderson",
    assignee_id: "user_rogerio",
    assignee_name: "RogÃ©rio",
    marketplace: "Geral",
    sku: "RGUARDANAPO",
    description: "Tirar a letra R que foi digitada por erro antes da palavra Guardanapo no SKU.",
    status: "pendente",
    priority: "normal",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
  }
];

const getMarketplaceStyle = (marketplace: string) => {
  switch (marketplace.toLowerCase()) {
    case 'mercado livre':
      return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
    case 'shopee':
      return "bg-[#EE4D2D]/10 text-[#EE4D2D] border-[#EE4D2D]/20";
    case 'magalu':
    case 'magazine luiza':
      return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    case 'amazon':
      return "bg-white/10 text-white border-white/20";
    default:
      return "bg-white/5 text-gray-400 border-white/10";
  }
};

const getMarketplaceCardStyle = (marketplace: string) => {
  switch (marketplace.toLowerCase()) {
    case 'mercado livre':
      return "border-t-[#FFE600]/50 hover:border-[#FFE600]/30 hover:shadow-[0_0_30px_rgba(255,230,0,0.07)] bg-gradient-to-b from-[#FFE600]/[0.03] to-transparent";
    case 'shopee':
      return "border-t-[#EE4D2D]/50 hover:border-[#EE4D2D]/30 hover:shadow-[0_0_30px_rgba(238,77,45,0.07)] bg-gradient-to-b from-[#EE4D2D]/[0.03] to-transparent";
    case 'amazon':
      return "border-t-white/50 hover:border-white/30 hover:shadow-[0_0_30px_rgba(255,255,255,0.07)] bg-gradient-to-b from-white/[0.03] to-transparent";
    case 'magalu':
    case 'magazine luiza':
      return "border-t-[#0086FF]/50 hover:border-[#0086FF]/30 hover:shadow-[0_0_30px_rgba(0,134,255,0.07)] bg-gradient-to-b from-[#0086FF]/[0.03] to-transparent";
    default:
      return "border-t-white/10 hover:border-white/20 hover:shadow-2xl bg-gradient-to-b from-white/[0.01] to-transparent";
  }
};

const getAvatarStyle = (name: string) => {
  switch (name.toLowerCase()) {
    case 'rogÃ©rio': return "bg-blue-500/10 border-blue-500/30 text-blue-400";
    case 'anderson': return "bg-[#00FF00]/10 border-[#00FF00]/30 text-[#00FF00]";
    case 'william': return "bg-orange-500/10 border-orange-500/30 text-orange-400";
    case 'alyson': return "bg-purple-500/10 border-purple-500/30 text-purple-400";
    default: return "bg-white/5 border-white/10 text-gray-400";
  }
};

export default function MuralAjustes() {
  const { user } = useAuth();
  const userName = user?.user_metadata?.name || 'Sistema';
  
  const [tickets, setTickets] = useState<any[]>([]);
  const [audits, setAudits] = useState<any[]>([]);
  const [filter, setFilter] = useState("todos");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    marketplace: 'Mercado Livre',
    sku: '',
    link: '',
    description: '',
    priority: 'normal',
    assignee_name: 'livre'
  });

  const fetchTicketsAndAudits = async () => {
    try {
      const { data: ticketsData, error: tError } = await supabase
        .from('ajustes_tickets')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (!tError && ticketsData) setTickets(ticketsData);

      const { data: auditsData, error: aError } = await supabase
        .from('ajustes_auditoria')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(15);
        
      if (!aError && auditsData) setAudits(auditsData);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchTicketsAndAudits();

    const ticketsSub = supabase.channel('ajustes_tickets_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ajustes_tickets' }, () => {
        fetchTicketsAndAudits();
      }).subscribe();

    const auditsSub = supabase.channel('ajustes_auditoria_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ajustes_auditoria' }, () => {
        fetchTicketsAndAudits();
      }).subscribe();

    return () => {
      supabase.removeChannel(ticketsSub);
      supabase.removeChannel(auditsSub);
    }
  }, []);

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description) return;
    
    const newTicket = {
      creator_id: user?.id,
      creator_name: userName,
      assignee_id: null,
      assignee_name: formData.assignee_name === 'livre' ? null : formData.assignee_name,
      marketplace: formData.marketplace,
      sku: formData.sku,
      link: formData.link,
      description: formData.description,
      status: "pendente",
      priority: formData.priority,
    };
    
    const { data: insertedTicket, error } = await supabase.from('ajustes_tickets').insert(newTicket).select().single();
    
    if (error) {
      console.error("Erro Supabase:", error);
      alert("Erro ao criar ticket: " + error.message);
      return;
    }
    
    if (!error && insertedTicket) {
      await supabase.from('ajustes_auditoria').insert({
        action_type: 'created',
        user_id: user?.id,
        user_name: userName,
        target_id: insertedTicket.id,
        target_type: 'ticket',
        context_text: `SKU: ${insertedTicket.sku || 'N/A'} (${insertedTicket.marketplace})`,
        message: 'abriu um ticket de ajuste',
        priority: formData.priority
      });
      setIsModalOpen(false);
      setFormData({ marketplace: 'Mercado Livre', sku: '', link: '', description: '', priority: 'normal', assignee_name: 'livre' });
      fetchTicketsAndAudits();
    }
  };

  const handleResolve = async (id: string, sku: string, marketplace: string) => {
    const { error } = await supabase.from('ajustes_tickets').update({ status: 'resolvido', resolved_by_id: user?.id, resolved_by_name: userName }).eq('id', id);
    if (!error) {
      await supabase.from('ajustes_auditoria').insert({
        action_type: 'resolved',
        user_id: user?.id,
        user_name: userName,
        target_id: id,
        target_type: 'ticket',
        context_text: `SKU: ${sku || 'N/A'} (${marketplace})`,
        message: 'resolveu um ajuste de anÃºncio',
        priority: 'normal'
      });
    }
  };

  const handleDelete = async (id: string, sku: string, marketplace: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este ticket?')) return;
    
    const { error } = await supabase.from('ajustes_tickets').delete().eq('id', id);
    if (!error) {
      await supabase.from('ajustes_auditoria').insert({
        action_type: 'deleted',
        user_id: user?.id,
        user_name: userName,
        target_id: id,
        target_type: 'ticket',
        context_text: `SKU: ${sku || 'N/A'} (${marketplace})`,
        message: 'excluiu um ticket',
        priority: 'normal'
      });
      fetchTicketsAndAudits();
    } else {
      console.error(error);
      alert('Erro ao excluir: ' + error.message);
    }
  };

  const filteredTickets = tickets.filter(t => {
    if (filter === "todos") return true;
    return t.marketplace.toLowerCase() === filter.toLowerCase();
  });

  return (
    <div className="flex-1 w-full max-w-full px-4 md:px-8 pt-6 pb-6 animate-in fade-in duration-500 min-h-0 overflow-hidden flex flex-col">
      
      {/* Container Layout com Feed na Lateral */}
      <div className="flex flex-col xl:flex-row gap-4 items-start flex-1 min-h-0 overflow-hidden">
        {/* Lado Esquerdo: Header + Actions + Grid */}
        <div className="flex-1 w-full min-w-0 flex flex-col h-full overflow-y-auto [&::-webkit-scrollbar]:hidden pr-2">
          {/* Header */}
          <div className="mb-3">
        <div>
          <h2 className="text-2xl font-light tracking-tight text-white flex items-center gap-2 mb-1">
            <AlertCircle className="h-5 w-5 text-[#00FF00] drop-shadow-[0_0_10px_rgba(0,255,0,0.3)]" />
            Mural de Ajustes RÃ¡pidos
          </h2>
          <p className="text-gray-500 font-medium text-[9px] tracking-widest uppercase">
            CORREÃ‡ÃƒO DE ERROS E OTIMIZAÃ‡ÃƒO DE ANÃšNCIOS
          </p>
        </div>
        
        </div>

      {/* Action Bar: Tabs + Search/Add */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-start gap-4 mb-4">
        {/* Tabs / Filters */}
        <div className="flex gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
        {['Todos', 'Shopee', 'Mercado Livre', 'Amazon', 'Geral'].map((m) => {
          const count = m === 'Todos' 
            ? tickets.length 
            : tickets.filter(t => (t.marketplace || '').toLowerCase() === m.toLowerCase()).length;
          const isActive = filter === m.toLowerCase();

          return (
            <button 
              key={m}
              onClick={() => setFilter(m.toLowerCase())}
              className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-2 ${
                isActive 
                  ? 'bg-white/10 text-white border-b-2 border-[#00FF00]' 
                  : 'text-gray-500 hover:text-gray-300 hover:bg-white/5 border-b-2 border-transparent'
              }`}
            >
              {m !== 'Todos' && getMarketplaceLogo(m)}
              {m}
              <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${isActive ? 'bg-[#00FF00]/20 text-[#00FF00]' : 'bg-white/5 text-gray-500'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

        {/* Search & Actions */}
        <div className="flex gap-4 items-center shrink-0">

          <div className="relative group">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500 group-focus-within:text-[#00FF00] transition-colors" />
            <input 
              type="text" 
              placeholder="Buscar SKU ou tarefa..." 
              className="pl-9 pr-3 py-1 bg-[#0a0a0a] border border-white/5 rounded-lg text-xs text-white focus:outline-none focus:border-[#00FF00]/50 focus:shadow-[0_0_10px_rgba(0,255,0,0.1)] transition-all w-64"
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-[#00FF00] hover:bg-[#00FF00]/80 text-black px-3 py-1 rounded-md text-xs font-bold transition-all shadow-[0_0_15px_rgba(0,255,0,0.3)] hover:shadow-[0_0_20px_rgba(0,255,0,0.4)]"
          >
            <Plus className="h-3.5 w-3.5" />
            Novo Ticket
          </button>
        </div>
      </div>

            {/* Grid de Tickets */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                {filteredTickets.map((ticket) => {
          const isResolved = ticket.status === 'resolvido';
          const mkStyle = getMarketplaceStyle(ticket.marketplace);
          const textColor = mkStyle.split(' ').find(c => c.startsWith('text-')) || 'text-gray-400';
          
          return (
            <div 
              key={ticket.id} 
              className={`bg-[#111111]/80 backdrop-blur-sm rounded-xl p-4 flex flex-col justify-between transition-all duration-300 group ${
                isResolved 
                  ? 'opacity-50 border border-[#00FF00]/20' 
                  : `border-x border-b border-white/5 border-t-2 ${getMarketplaceCardStyle(ticket.marketplace)}`
              }`}
            >
              <div className="flex flex-col gap-3 flex-1">
                {/* Header: Marketplace & Meta */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`h-1.5 w-1.5 rounded-full shrink-0 ${ticket.priority === 'critico' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse' : 'bg-[#00FF00] shadow-[0_0_8px_rgba(0,255,0,0.6)]'}`} title={ticket.priority === 'critico' ? 'CrÃ­tico / Risco' : 'Normal / EstÃ©tico'} />
                    <span className={`text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5 ${textColor}`}>
                      {getMarketplaceLogo(ticket.marketplace)}
                      {ticket.marketplace}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-[9px] text-gray-500 font-medium">
                    <span>{ticket.creator_name?.split(' ')[0] || 'Sistema'}</span>
                    <span className="flex items-center gap-1 text-gray-600"><Clock className="h-2.5 w-2.5" /> Hoje</span>
                  </div>
                </div>
                
                {/* Body: SKU & Desc */}
                <div className="flex flex-col gap-1.5 mb-2">
                  {(ticket.sku) && (
                    <div className="flex items-center gap-1.5 text-white font-bold text-xs tracking-wide">
                      <span className="text-gray-500 font-medium text-[9px] uppercase">SKU</span>
                      <span>{ticket.sku}</span>
                    </div>
                  )}
                  <p className="text-gray-300 text-xs leading-relaxed font-light">
                    <span className={isResolved ? "line-through text-gray-500" : ""}>{ticket.description}</span>
                  </p>
                </div>
              </div>
              
              {/* Footer: Assignee & Actions */}
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
                <div className="flex items-center gap-2 shrink-0">
                  {ticket.assignee_name ? (
                    <>
                      <div className={`h-5 w-5 rounded-full border flex items-center justify-center text-[8px] font-bold ${getAvatarStyle(ticket.assignee_name)}`}>
                        {ticket.assignee_name.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="text-[10px] text-gray-400 font-medium">{ticket.assignee_name.split(' ')[0]}</span>
                    </>
                  ) : (
                    <span className="text-[10px] text-gray-600 font-medium italic">Sem responsÃ¡vel</span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {/* Action: Link */}
                  {(ticket.link || ticket.sku) && (
                    <a 
                      href={ticket.link || (ticket.marketplace.toLowerCase() === 'shopee' ? `https://seller.shopee.com.br/portal/product/list?search=${ticket.sku}` : ticket.marketplace.toLowerCase() === 'mercado livre' ? `https://myaccount.mercadolivre.com.br/listings/#label=active&search=${ticket.sku}` : `#`)}
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-gray-500 hover:text-white transition-colors flex items-center justify-center"
                      title="Abrir AnÃºncio"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}

                  {/* Action: Delete */}
                  <button 
                    onClick={() => handleDelete(ticket.id, ticket.sku, ticket.marketplace)}
                    className="text-gray-600 hover:text-red-500 transition-colors flex items-center justify-center"
                    title="Excluir ticket"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                  
                  {/* Action: Resolve */}
                  {isResolved ? (
                    <span className="text-[#00FF00]/70 text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5 ml-1">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Resolvido
                    </span>
                  ) : (
                    <button 
                      onClick={() => handleResolve(ticket.id, ticket.sku, ticket.marketplace)}
                      className="text-gray-400 hover:text-[#00FF00] transition-colors flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest group/btn ml-1"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 group-hover/btn:scale-110 transition-transform" />
                      Resolver
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        
        {filteredTickets.length === 0 && (
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-gray-500">
            <CheckCircle2 className="h-12 w-12 mb-3 text-white/10" />
            <p>Nenhum ajuste pendente para este canal.</p>
          </div>
        )}
      </div>

      
        </div>
        {/* Lado Direito: Feed de Auditoria */}
        <div className="w-full xl:w-[320px] shrink-0 bg-[#070707] border border-white/5 rounded-2xl flex flex-col h-full shadow-2xl overflow-hidden">
          <div className="flex items-center gap-2 p-4 border-b border-white/5 bg-[#0a0a0a]/50">
            <Activity className="h-4 w-4 text-[#00FF00]" />
            <h3 className="text-white font-bold text-xs tracking-widest uppercase">Feed de Auditoria</h3>
          </div>
          
          <div className="flex-1 p-5 overflow-y-auto [&::-webkit-scrollbar]:hidden">
            <div className="space-y-6 relative before:absolute before:inset-y-0 before:left-1.5 before:w-[1px] before:bg-white/5">
              
              {audits.map((audit) => {
                const dateObj = new Date(audit.created_at);
                const timeStr = dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                const isCritical = audit.priority === 'critico' || audit.action_type === 'alert';
                return (
                  <div key={audit.id} className="relative pl-6">
                    <div className={`absolute left-[3px] top-1.5 w-2 h-2 rounded-full ${isCritical ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 'bg-[#00FF00] shadow-[0_0_8px_rgba(0,255,0,0.8)]'}`} />
                    <p className="text-[11px] text-gray-400 leading-snug mb-1">
                      <span className={isCritical ? "text-red-400 font-bold" : "text-white font-bold"}>{audit.user_name || 'Sistema'}</span> {audit.message}
                    </p>
                    {audit.context_text && (
                      <span className={`text-[9px] font-bold uppercase tracking-wider block mb-1.5 w-fit px-2 py-0.5 rounded ${isCritical ? 'bg-red-500/10 text-red-400' : 'bg-white/5 text-gray-500'}`}>
                        {audit.context_text}
                      </span>
                    )}
                    <div className="flex items-center gap-1 text-gray-600">
                      <Clock className="h-2.5 w-2.5" />
                      <span className="text-[8px] font-bold uppercase">{timeStr}</span>
                    </div>
                  </div>
                )
              })}
              
            </div>
          </div>
          
          <button className="p-3 border-t border-white/5 text-[9px] font-bold uppercase tracking-widest text-gray-500 hover:text-white bg-[#0a0a0a]/50 hover:bg-[#111] transition-colors">
            Ver HistÃ³rico Completo
          </button>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-[#111111] border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-light text-white flex items-center gap-2">
              <Plus className="h-5 w-5 text-[#00FF00]" />
              Novo Ticket de Ajuste
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Preencha os dados da correÃ§Ã£o necessÃ¡ria no anÃºncio.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateTicket} className="space-y-4 mt-6">
            
            <div className="flex gap-4">
              <div className="flex-1 space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Plataforma</label>
                <Select 
                  value={formData.marketplace}
                  onValueChange={v => setFormData({...formData, marketplace: v})}
                >
                  <SelectTrigger className="w-full bg-white/5 border-transparent hover:bg-white/10 text-white focus:ring-1 focus:ring-white/20 h-11 rounded-xl transition-all">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent className="bg-[#111111] border-white/10 text-white rounded-xl shadow-2xl">
                    <SelectItem value="Mercado Livre" className="hover:bg-white/10 cursor-pointer py-2">
                      <div className="flex items-center gap-2">{getMarketplaceLogo("Mercado Livre")} Mercado Livre</div>
                    </SelectItem>
                    <SelectItem value="Shopee" className="hover:bg-white/10 cursor-pointer py-2">
                      <div className="flex items-center gap-2">{getMarketplaceLogo("Shopee")} Shopee</div>
                    </SelectItem>
                    <SelectItem value="Magalu" className="hover:bg-white/10 cursor-pointer py-2">
                      <div className="flex items-center gap-2">{getMarketplaceLogo("Magalu")} Magalu</div>
                    </SelectItem>
                    <SelectItem value="Amazon" className="hover:bg-white/10 cursor-pointer py-2">
                      <div className="flex items-center gap-2">{getMarketplaceLogo("Amazon")} Amazon</div>
                    </SelectItem>
                    <SelectItem value="Geral" className="hover:bg-white/10 cursor-pointer py-2">
                      <div className="flex items-center gap-2">{getMarketplaceLogo("Geral")} Geral</div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1 space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">ResponsÃ¡vel</label>
                <Select 
                  value={formData.assignee_name}
                  onValueChange={v => setFormData({...formData, assignee_name: v})}
                >
                  <SelectTrigger className="w-full bg-white/5 border-transparent hover:bg-white/10 text-white focus:ring-1 focus:ring-white/20 h-11 rounded-xl transition-all">
                    <SelectValue placeholder="Livre" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#111111] border-white/10 text-white rounded-xl shadow-2xl">
                    <SelectItem value="livre" className="hover:bg-white/10 cursor-pointer py-2">Nenhum (Livre)</SelectItem>
                    <SelectItem value="RogÃ©rio" className="hover:bg-white/10 cursor-pointer py-2">RogÃ©rio</SelectItem>
                    <SelectItem value="Anderson" className="hover:bg-white/10 cursor-pointer py-2">Anderson</SelectItem>
                    <SelectItem value="William" className="hover:bg-white/10 cursor-pointer py-2">William</SelectItem>
                    <SelectItem value="Alyson" className="hover:bg-white/10 cursor-pointer py-2">Alyson</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-1 space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">SKU</label>
                <input 
                  type="text" 
                  placeholder="EX: KITGAS001"
                  value={formData.sku}
                  onChange={e => setFormData({...formData, sku: e.target.value})}
                  className="w-full bg-white/5 border-transparent hover:bg-white/10 rounded-xl px-4 h-11 text-sm text-white focus:outline-none focus:bg-white/10 focus:ring-1 focus:ring-white/20 uppercase transition-all placeholder:text-gray-600 placeholder:normal-case"
                />
              </div>
              <div className="flex-1 space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Link</label>
                <input 
                  type="text" 
                  placeholder="Opcional..."
                  value={formData.link}
                  onChange={e => setFormData({...formData, link: e.target.value})}
                  className="w-full bg-white/5 border-transparent hover:bg-white/10 rounded-xl px-4 h-11 text-sm text-white focus:outline-none focus:bg-white/10 focus:ring-1 focus:ring-white/20 transition-all placeholder:text-gray-600"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Ajuste NecessÃ¡rio</label>
              <textarea 
                placeholder="O que precisa ser feito?"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full bg-white/5 border-transparent hover:bg-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:bg-white/10 focus:ring-1 focus:ring-white/20 min-h-[90px] resize-none transition-all placeholder:text-gray-600"
                required
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <div className="flex items-center gap-2 bg-[#0A0A0A] p-1 rounded-xl border border-white/5">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, priority: 'normal'})}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${formData.priority === 'normal' ? 'bg-white/10 text-white' : 'text-gray-600 hover:text-gray-400'}`}
                >
                  Normal
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, priority: 'critico'})}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${formData.priority === 'critico' ? 'bg-red-500/20 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.2)]' : 'text-gray-600 hover:text-gray-400'}`}
                >
                  CrÃ­tico
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="text-xs font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-wider"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="bg-[#00FF00] hover:bg-[#00FF00]/80 text-black px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-[0_0_15px_rgba(0,255,0,0.2)] hover:shadow-[0_0_20px_rgba(0,255,0,0.4)] uppercase tracking-wider"
                >
                  Criar Ticket
                </button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
