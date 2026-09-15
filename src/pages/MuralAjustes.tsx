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

// Dados mockados baseados nos exemplos reais solicitados pelo usuário
const MOCK_TICKETS: any[] = [
  {
    id: "1",
    creator_id: "user_manager",
    creator_name: "Anderson",
    assignee_id: "user_rogerio",
    assignee_name: "Rogério",
    marketplace: "Mercado Livre",
    sku: "KITGAS001",
    description: "Aviso no kit de gás: corrigir a imagem e a descrição. Tem duas abraçadeiras na foto, mas é só uma.",
    status: "pendente",
    priority: "normal",
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins atrás
  },
  {
    id: "2",
    creator_id: "user_manager",
    creator_name: "Anderson",
    assignee_id: null,
    assignee_name: null,
    marketplace: "Shopee",
    sku: "CAP002",
    description: "Retirar a marca do título e descrição do anúncio do cap na Shopee para evitar bloqueio.",
    status: "pendente",
    priority: "critico",
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
  },
  {
    id: "3",
    creator_id: "user_manager",
    creator_name: "Anderson",
    assignee_id: "user_rogerio",
    assignee_name: "Rogério",
    marketplace: "Amazon",
    sku: "MANG003",
    description: "Alterar as especificações do produto: retira a mangueira comum da descrição porque é uma pigtail.",
    status: "pendente",
    priority: "normal",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
  },
  {
    id: "4",
    creator_id: "user_manager",
    creator_name: "Anderson",
    assignee_id: "user_rogerio",
    assignee_name: "Rogério",
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
    case 'rogério': return "bg-blue-500/10 border-blue-500/30 text-blue-400";
    case 'anderson': return "bg-[#00FF00]/10 border-[#00FF00]/30 text-[#00FF00]";
    case 'william': return "bg-orange-500/10 border-orange-500/30 text-orange-400";
    case 'alyson': return "bg-purple-500/10 border-purple-500/30 text-purple-400";
    default: return "bg-white/5 border-white/10 text-gray-400";
  }
};

export default function MuralAjustes() {
  const { user } = useAuth();
  const userName = user?.user_metadata?.name || 'Sistema';
  
  const [tickets, setTickets] = useState<any[]>(MOCK_TICKETS);
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

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description) return;
    
    const newTicket = {
      id: Math.random().toString(),
      creator_id: user?.id || "user_manager",
      creator_name: userName,
      assignee_id: formData.assignee_name === 'livre' ? null : `user_${formData.assignee_name.toLowerCase()}`,
      assignee_name: formData.assignee_name === 'livre' ? null : formData.assignee_name,
      marketplace: formData.marketplace,
      sku: formData.sku,
      link: formData.link,
      description: formData.description,
      status: "pendente",
      priority: formData.priority,
      created_at: new Date().toISOString()
    };
    
    setTickets([newTicket, ...tickets]);
    setIsModalOpen(false);
    setFormData({ marketplace: 'Mercado Livre', sku: '', description: '', priority: 'normal', assignee_name: 'livre' });
  };

  const handleResolve = (id: string) => {
    // Na vida real: await updateTicketStatus(id, 'resolvido')
    setTickets(tickets.map(t => t.id === id ? { ...t, status: 'resolvido', resolved_by: 'Você' } : t));
  };

  const filteredTickets = tickets.filter(t => {
    if (filter === "todos") return true;
    return t.marketplace.toLowerCase() === filter.toLowerCase();
  });

  return (
    <div className="flex-1 p-4 md:px-8 md:py-4 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="mb-6">
        <div>
          <h2 className="text-3xl font-light tracking-tight text-white flex items-center gap-2 mb-1">
            <AlertCircle className="h-6 w-6 text-[#00FF00] drop-shadow-[0_0_10px_rgba(0,255,0,0.3)]" />
            Mural de Ajustes Rápidos
          </h2>
          <p className="text-gray-500 font-medium text-[10px] tracking-widest uppercase">
            CORREÇÃO DE ERROS E OTIMIZAÇÃO DE ANÚNCIOS
          </p>
        </div>
        
        </div>

      {/* Action Bar: Tabs + Search/Add */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-6">
        {/* Tabs / Filters */}
        <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar-thin flex-1">
        {['Todos', 'Shopee', 'Mercado Livre', 'Amazon', 'Geral'].map((m) => {
          const count = m === 'Todos' 
            ? tickets.length 
            : tickets.filter(t => (t.marketplace || '').toLowerCase() === m.toLowerCase()).length;
          const isActive = filter === m.toLowerCase();

          return (
            <button 
              key={m}
              onClick={() => setFilter(m.toLowerCase())}
              className={`px-4 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-2 ${
                isActive 
                  ? 'bg-white/10 text-white border-b-2 border-[#00FF00]' 
                  : 'text-gray-500 hover:text-gray-300 hover:bg-white/5 border-b-2 border-transparent'
              }`}
            >
              {m !== 'Todos' && getMarketplaceLogo(m)}
              {m}
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${isActive ? 'bg-[#00FF00]/20 text-[#00FF00]' : 'bg-white/5 text-gray-500'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

        {/* Search & Actions */}
        <div className="flex gap-4 items-center shrink-0">

          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 group-focus-within:text-[#00FF00] transition-colors" />
            <input 
              type="text" 
              placeholder="Buscar SKU ou tarefa..." 
              className="pl-10 pr-4 py-1.5 bg-[#0a0a0a] border border-white/5 rounded-xl text-sm text-white focus:outline-none focus:border-[#00FF00]/50 focus:shadow-[0_0_10px_rgba(0,255,0,0.1)] transition-all w-64"
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-[#00FF00] hover:bg-[#00FF00]/80 text-black px-4 py-1.5 rounded-lg text-sm font-bold transition-all shadow-[0_0_15px_rgba(0,255,0,0.3)] hover:shadow-[0_0_20px_rgba(0,255,0,0.4)]"
          >
            <Plus className="h-4 w-4" />
            Novo Ticket
          </button>
        </div>
      </div>

            {/* Container Layout com Feed na Lateral */}
      <div className="flex flex-col xl:flex-row gap-4 items-start">
        {/* Lado Esquerdo: Grid de Tickets */}
        <div className="flex-1 w-full min-w-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredTickets.map((ticket) => {
          const isResolved = ticket.status === 'resolvido';
          const mkStyle = getMarketplaceStyle(ticket.marketplace);
          const textColor = mkStyle.split(' ').find(c => c.startsWith('text-')) || 'text-gray-400';
          
          return (
            <div 
              key={ticket.id} 
              className={`bg-[#111111]/80 backdrop-blur-sm rounded-xl p-5 flex flex-col justify-between transition-all duration-300 group ${
                isResolved 
                  ? 'opacity-50 border border-[#00FF00]/20' 
                  : `border-x border-b border-white/5 border-t-2 ${getMarketplaceCardStyle(ticket.marketplace)}`
              }`}
            >
              <div>
                {/* Header (Status, Marketplace, SKU, Creator) */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full shrink-0 ${ticket.priority === 'critico' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse' : 'bg-[#00FF00] shadow-[0_0_8px_rgba(0,255,0,0.6)]'}`} title={ticket.priority === 'critico' ? 'Crítico / Risco' : 'Normal / Estético'} />
                      <span className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 ${textColor}`}>
                        {getMarketplaceLogo(ticket.marketplace)}
                        {ticket.marketplace}
                      </span>
                    </div>
                    
                    {(ticket.sku || ticket.link) && (
                      <div className="flex items-center gap-1.5 text-white font-bold text-sm tracking-wide mt-1">
                        <span className="text-gray-500 font-medium text-xs">{ticket.sku ? "SKU" : "LINK"}</span>
                        <a href={ticket.link || `https://seller.shopee.com.br/portal/product/list?search=${ticket.sku}`} target="_blank" rel="noopener noreferrer" className="hover:text-[#00FF00] transition-colors">
                          {ticket.sku || "Acessar Anúncio"}
                        </a>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] text-gray-500 font-medium">{ticket.creator_name?.split(' ')[0] || 'Sistema'}</span>
                    <span className="text-[9px] text-gray-600 font-medium flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Hoje
                    </span>
                  </div>
                </div>
                
                {/* Description */}
                <p className="text-gray-300 text-[13px] leading-relaxed mb-6 font-light">
                  <span className={isResolved ? "line-through text-gray-500" : ""}>{ticket.description}</span>
                </p>
              </div>
              
              {/* Footer */}
              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-2 shrink-0">
                  {ticket.assignee_name ? (
                    <>
                      <div className={`h-6 w-6 rounded-full border flex items-center justify-center text-[9px] font-bold ${getAvatarStyle(ticket.assignee_name)}`}>
                        {ticket.assignee_name.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="text-xs text-gray-400 font-medium">{ticket.assignee_name.split(' ')[0]}</span>
                    </>
                  ) : (
                    <span className="text-xs text-gray-600 font-medium italic">Não atribuído</span>
                  )}
                </div>

                {isResolved ? (
                  <span className="text-[#00FF00]/70 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4" /> Resolvido
                  </span>
                ) : (
                  <button 
                    onClick={() => handleResolve(ticket.id)}
                    className="text-gray-500 hover:text-[#00FF00] transition-colors flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest group/btn"
                  >
                    <CheckCircle2 className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                    Resolver
                  </button>
                )}
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
        <div className="w-full xl:w-[350px] shrink-0 bg-[#0A0A0A] border border-[#222] rounded-3xl p-6 shadow-2xl flex flex-col h-full sticky top-6">
          <div className="flex items-center gap-3 mb-8">
            <Activity className="h-5 w-5 text-gray-400" />
            <h3 className="text-white font-bold text-lg tracking-tight">Feed de Auditoria</h3>
          </div>
          
          <div className="flex-1 relative">
            {/* Linha do Tempo */}
            <div className="absolute left-[7px] top-2 bottom-2 w-px bg-white/5" />
            
            <div className="space-y-8 relative">
              {/* Item 1 */}
              <div className="relative pl-6">
                <div className="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full bg-[#00FF00] shadow-[0_0_10px_rgba(0,255,0,0.6)]" />
                <p className="text-sm text-gray-300 leading-tight mb-2">
                  <span className="text-white font-bold">Lucas</span> resolveu um ajuste de anúncio
                </p>
                <div className="bg-white/5 border border-white/10 rounded-full px-3 py-1 w-fit mb-2">
                  <span className="text-[10px] text-gray-400 font-medium">SKU: KITGAS001 (Mercado Livre)</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-500">
                  <Clock className="h-3 w-3" />
                  <span className="text-[9px] font-bold uppercase tracking-widest">Há 5 min</span>
                </div>
              </div>

              {/* Item 2 */}
              <div className="relative pl-6">
                <div className="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full bg-[#00FF00] shadow-[0_0_10px_rgba(0,255,0,0.6)]" />
                <p className="text-sm text-gray-300 leading-tight mb-2">
                  <span className="text-white font-bold">João</span> deu Ciente em um aviso crítico
                </p>
                <div className="bg-white/5 border border-white/10 rounded-full px-3 py-1 w-fit mb-2">
                  <span className="text-[10px] text-gray-400 font-medium">Mural de Alinhamento</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-500">
                  <Clock className="h-3 w-3" />
                  <span className="text-[9px] font-bold uppercase tracking-widest">Há 12 min</span>
                </div>
              </div>

              {/* Item 3 */}
              <div className="relative pl-6">
                <div className="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full bg-[#00FF00] shadow-[0_0_10px_rgba(0,255,0,0.6)]" />
                <p className="text-sm text-gray-300 leading-tight mb-2">
                  <span className="text-white font-bold">Lucas</span> concluiu uma urgência atrasada
                </p>
                <div className="bg-white/5 border border-white/10 rounded-full px-3 py-1 w-fit mb-2">
                  <span className="text-[10px] text-gray-400 font-medium">Atualizar foto do kit de gás</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-500">
                  <Clock className="h-3 w-3" />
                  <span className="text-[9px] font-bold uppercase tracking-widest">Há 45 min</span>
                </div>
              </div>

              {/* Item 4 */}
              <div className="relative pl-6">
                <div className="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full bg-[#FF5C5C] shadow-[0_0_10px_rgba(255,92,92,0.6)] animate-pulse" />
                <p className="text-sm text-gray-300 leading-tight mb-2">
                  <span className="text-white font-bold">Sistema</span> emitiu alerta de SLA estourado
                </p>
                <div className="bg-white/5 border border-white/10 rounded-full px-3 py-1 w-fit mb-2">
                  <span className="text-[10px] text-gray-400 font-medium">João ainda não leu o aviso de Padrão de Imagens</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-500">
                  <Clock className="h-3 w-3" />
                  <span className="text-[9px] font-bold uppercase tracking-widest">Há 2 horas</span>
                </div>
              </div>
            </div>
          </div>
          
          <button className="w-full mt-8 py-3.5 rounded-xl border border-white/5 bg-[#111] hover:bg-white/5 text-gray-400 hover:text-white text-sm font-bold transition-colors">
            Ver Histórico Completo
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
              Preencha os dados da correção necessária no anúncio.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateTicket} className="space-y-4 mt-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Plataforma</label>
              <Select 
                value={formData.marketplace}
                onValueChange={v => setFormData({...formData, marketplace: v})}
              >
                <SelectTrigger className="w-full bg-[#0a0a0a] border-white/10 text-white focus:ring-0 focus:border-[#00FF00]/50 h-10">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent className="bg-[#111111] border-white/10 text-white">
                  <SelectItem value="Mercado Livre" className="hover:bg-white/10 focus:bg-white/10 focus:text-white cursor-pointer">
                    <div className="flex items-center gap-2">{getMarketplaceLogo("Mercado Livre")} Mercado Livre</div>
                  </SelectItem>
                  <SelectItem value="Shopee" className="hover:bg-white/10 focus:bg-white/10 focus:text-white cursor-pointer">
                    <div className="flex items-center gap-2">{getMarketplaceLogo("Shopee")} Shopee</div>
                  </SelectItem>
                  <SelectItem value="Magalu" className="hover:bg-white/10 focus:bg-white/10 focus:text-white cursor-pointer">
                    <div className="flex items-center gap-2">{getMarketplaceLogo("Magalu")} Magalu</div>
                  </SelectItem>
                  <SelectItem value="Amazon" className="hover:bg-white/10 focus:bg-white/10 focus:text-white cursor-pointer">
                    <div className="flex items-center gap-2">{getMarketplaceLogo("Amazon")} Amazon</div>
                  </SelectItem>
                  <SelectItem value="Geral" className="hover:bg-white/10 focus:bg-white/10 focus:text-white cursor-pointer">
                    <div className="flex items-center gap-2">{getMarketplaceLogo("Geral")} Geral</div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-4">
              <div className="space-y-2 flex-1">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">SKU (Opcional)</label>
                <input 
                  type="text" 
                  placeholder="Ex: KITGAS001"
                  value={formData.sku}
                  onChange={e => setFormData({...formData, sku: e.target.value})}
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[#00FF00]/50 uppercase"
                />
              </div>
              <div className="space-y-2 flex-1">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Link (Opcional)</label>
                <input 
                  type="text" 
                  placeholder="https://..."
                  value={formData.link}
                  onChange={e => setFormData({...formData, link: e.target.value})}
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[#00FF00]/50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Responsável</label>
              <Select 
                value={formData.assignee_name}
                onValueChange={v => setFormData({...formData, assignee_name: v})}
              >
                <SelectTrigger className="w-full bg-[#0a0a0a] border-white/10 text-white focus:ring-0 focus:border-[#00FF00]/50 h-10">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent className="bg-[#111111] border-white/10 text-white">
                  <SelectItem value="livre" className="hover:bg-white/10 focus:bg-white/10 focus:text-white cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="h-5 w-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[8px] text-gray-500 font-bold">--</div>
                      <span>Nenhum (Livre)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="Rogério" className="hover:bg-white/10 focus:bg-white/10 focus:text-white cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="h-5 w-5 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 text-[8px] font-bold">RO</div>
                      <span>Rogério</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="Anderson" className="hover:bg-white/10 focus:bg-white/10 focus:text-white cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="h-5 w-5 rounded-full bg-[#00FF00]/10 border border-[#00FF00]/30 flex items-center justify-center text-[#00FF00] text-[8px] font-bold">AN</div>
                      <span>Anderson</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="William" className="hover:bg-white/10 focus:bg-white/10 focus:text-white cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="h-5 w-5 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 text-[8px] font-bold">WI</div>
                      <span>William</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="Alyson" className="hover:bg-white/10 focus:bg-white/10 focus:text-white cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="h-5 w-5 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 text-[8px] font-bold">AL</div>
                      <span>Alyson</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Prioridade</label>
              <Select 
                value={formData.priority}
                onValueChange={v => setFormData({...formData, priority: v})}
              >
                <SelectTrigger className="w-full bg-[#0a0a0a] border-white/10 text-white focus:ring-0 focus:border-[#00FF00]/50 h-10">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent className="bg-[#111111] border-white/10 text-white">
                  <SelectItem value="normal" className="hover:bg-white/10 focus:bg-white/10 focus:text-white cursor-pointer">Normal / Estético</SelectItem>
                  <SelectItem value="critico" className="hover:bg-white/10 focus:bg-white/10 focus:text-white cursor-pointer">Crítico / Risco de Bloqueio</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500">O que precisa ser feito?</label>
              <textarea 
                placeholder="Descreva o ajuste necessário de forma clara..."
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[#00FF00]/50 min-h-[100px] resize-none"
                required
              />
            </div>

            <DialogFooter className="mt-6 pt-4 border-t border-white/5">
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                className="bg-[#00FF00] hover:bg-[#00FF00]/80 text-black px-6 py-2 rounded-lg text-sm font-bold transition-all shadow-[0_0_15px_rgba(0,255,0,0.2)] hover:shadow-[0_0_20px_rgba(0,255,0,0.4)]"
              >
                Criar Ticket
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
