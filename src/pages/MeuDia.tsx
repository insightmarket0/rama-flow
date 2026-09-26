import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { 
  Zap, 
  Megaphone, 
  CheckCircle2, 
  Store, 
  Tag, 
  AlertTriangle,
  CalendarDays,
  ArrowRight,
  Sparkles,
  Handshake,
  Truck,
  Package,
  Settings2,
  Leaf,
  Sprout,
  Trees,
  LayoutGrid,
  Heart,
  MessageSquare, X, Plus, Trash2, Send, MessageCircle, ChevronRight } from "lucide-react";
import { RamaDoDiaWidget } from "@/components/RamaDoDiaWidget";
import { PainelPagamentosHoje } from "@/components/finance/PainelPagamentosHoje";
import { parseISO, isBefore, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { RAP_QUOTES, BIBLE_VERSES } from "@/lib/quotes";
import { SiMercadopago, SiShopee } from "react-icons/si";
import { FaAmazon } from "react-icons/fa";

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
  if (m === 'magalu' || m === 'magazine luiza') {
    return (
      <div className="h-4 w-4 rounded-sm bg-[#0086FF] flex items-center justify-center shrink-0">
        <span className="text-white text-[10px] font-bold leading-none -mt-[1px]">m</span>
      </div>
    );
  }
  
  return <Store className="h-3.5 w-3.5 opacity-70 shrink-0" />;
};

const getMarketplaceStyle = (marketplace: string) => {
  switch (marketplace.toLowerCase()) {
    case 'mercado livre': return "bg-[#FFE600]/10 text-[#FFE600] border-[#FFE600]/20";
    case 'shopee': return "bg-[#EE4D2D]/10 text-[#EE4D2D] border-[#EE4D2D]/20";
    case 'magalu':
    case 'magazine luiza': return "bg-[#0086FF]/10 text-[#0086FF] border-[#0086FF]/20";
    case 'amazon': return "bg-white/10 text-white border-white/20";
    default: return "bg-white/5 text-gray-400 border-white/10";
  }
};

// ---- MOCKS AGREGADOS PARA DEMONSTRAé!òO ----

const MOCK_ANNOUNCEMENTS = [
  {
    id: "ann_1",
    creator: { full_name: "Anderson - Supervisão" },
    title: "Cuidado com os itens de vidro!",
    content: "Lembrete: A partir de hoje, é obrigatório usar plástico bolha duplo em todos os itens frágeis.",
    is_pinned: true,
  }
];

const MOCK_REMINDERS = [
  {
    id: "rem_1",
    title: "Reposição de Insumos: Caixa Parda 30x20x10",
    description: "O almoxarifado separou as caixas solicitadas. Estão a caminho da bancada 2.",
    due_date: new Date(new Date().setHours(17, 0, 0, 0)).toISOString(),
    status: "pendente",
  },
  {
    id: "rem_2",
    title: "Estoque Crítico: Fita Adesiva",
    description: "Atenção: Restam apenas 3 rolos de fita. O pedido de compra já foi aprovado.",
    due_date: new Date(new Date().setHours(10, 0, 0, 0)).toISOString(),
    status: "pendente",
  }
];

const MOCK_ADJUSTMENTS = [
  {
    id: "adj_1",
    marketplace: "Mercado Livre",
    sku: "KITGAS001",
    description: "Divergência Corrigida: O anúncio foi pausado e o estoque atualizado. Pode desmontar o pacote.",
  },
];

const getQuoteOfTheDay = (email?: string) => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  
  // Exibir versículos bíblicos apenas para a conta do Rogério e da Mara
  if (email === "suporte.ramamagazine@gmail.com" || email === "mara@hotmail.com") {
    return BIBLE_VERSES[dayOfYear % BIBLE_VERSES.length];
  }
  
  return RAP_QUOTES[dayOfYear % RAP_QUOTES.length];
};

// -------------------------------------------

const ExpediçãoTracker = () => {
  const [now, setNow] = useState(new Date());
  
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const hours = now.getHours();
  const minutes = now.getMinutes();
  const currentTotalMinutes = hours * 60 + minutes;
  
  const dispatches = [
    { name: "Flex (ML/Shopee)", time: "13:00", minutes: 13 * 60, color: "#00FF00" },
    { name: "ML Agência", time: "16:00", minutes: 16 * 60, color: "#FFE600" },
    { name: "Shopee/Amz/Mag", time: "17:00", minutes: 17 * 60, color: "#EE4D2D" },
  ];
  
  let nextDispatch = dispatches.find(d => d.minutes > currentTotalMinutes) || dispatches[0];
  
  let remainingMinutes = nextDispatch.minutes - currentTotalMinutes;
  if (remainingMinutes < 0) remainingMinutes += 24 * 60; // Next day
  
  const remainingHoursStr = Math.floor(remainingMinutes / 60).toString().padStart(2, '0');
  const remainingMinsStr = (remainingMinutes % 60).toString().padStart(2, '0');
  
  const maxWindow = 180;
  const progress = Math.max(0, Math.min(100, ((maxWindow - remainingMinutes) / maxWindow) * 100));
  
  const radius = 120;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="col-span-1 md:col-span-2 flex flex-col md:flex-row items-center justify-between py-3 px-6 bg-[#050505] rounded-3xl border border-[#00FF00]/20 relative overflow-hidden shadow-[0_0_30px_rgba(0,255,0,0.05)] gap-6 min-h-[160px]">
      {/* Glow background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] bg-[#00FF00]/5 rounded-full blur-[80px] pointer-events-none" />
      
      {/* Esquerda: Avisos */}
      <div className="flex flex-col items-start gap-3 z-10 w-full md:w-auto">
        <div className="bg-[#111] border border-white/10 rounded-full px-4 py-1.5 flex items-center gap-2 shadow-lg backdrop-blur-md">
          <div className="w-1.5 h-1.5 rounded-full bg-[#00FF00] animate-pulse shadow-[0_0_8px_#00FF00]" />
          <span className="text-gray-300 text-xs tracking-wide">
            Focado no <strong className="text-white">{nextDispatch.name}</strong>
          </span>
        </div>

        {/* Fila compacta */}
        <div className="flex flex-col gap-2 mt-2">
          {dispatches.filter(d => d.name !== nextDispatch.name).map((d, i) => (
            <div key={i} className="flex items-center gap-2 opacity-70">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: d.color }} />
              <span className="text-[9px] font-bold uppercase text-gray-400">{d.name} {d.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Centro: Relógio Analógico (Menor) */}
      <div className="relative w-[220px] h-[150px] mt-2 flex flex-col items-center justify-start overflow-hidden z-10 shrink-0">
        <svg className="absolute top-0 w-[220px] h-[220px]" viewBox="0 0 300 300">
          <g stroke="currentColor" strokeWidth="2">
            {[...Array(31)].map((_, i) => {
              const angle = 180 + (i * 6);
              const isMajor = i % 5 === 0;
              const r1 = 135;
              const r2 = isMajor ? 115 : 125;
              const x1 = 150 + r1 * Math.cos((angle * Math.PI) / 180);
              const y1 = 150 + r1 * Math.sin((angle * Math.PI) / 180);
              const x2 = 150 + r2 * Math.cos((angle * Math.PI) / 180);
              const y2 = 150 + r2 * Math.sin((angle * Math.PI) / 180);
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth={isMajor ? "3" : "2"} className={isMajor ? "text-white/40" : "text-white/10"} />;
            })}
          </g>

          <circle cx="150" cy="150" r={radius} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="24" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={circumference / 2} transform="rotate(180 150 150)" />
          <circle cx="150" cy="150" r={radius} fill="none" stroke="#00FF00" strokeWidth="24" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={circumference - ((progress / 100) * (circumference / 2))} transform="rotate(180 150 150)" className="transition-all duration-1000 ease-in-out drop-shadow-[0_0_15px_rgba(0,255,0,0.3)]" />
        </svg>

        <div className="absolute top-[35%] flex flex-col items-center justify-center w-full">
          <span className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.1em] mb-0.5">
            Horário Local
          </span>
          <div className="text-white text-5xl font-bold tracking-tighter" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {hours.toString().padStart(2, '0')}:{minutes.toString().padStart(2, '0')}
          </div>
          <span className="text-[#00FF00] text-[9px] font-bold uppercase tracking-wider mt-1 bg-[#00FF00]/10 px-2 py-0.5 rounded-full">
            Faltam {remainingHoursStr}h {remainingMinsStr}m
          </span>
        </div>
      </div>
      
      {/* Direita: Indicador de Operação */}
      <div className="flex flex-col items-center justify-center z-10 w-full md:w-auto mt-4 md:mt-0">
        <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-[#111] border border-white/10 shadow-[inset_0_0_15px_rgba(255,255,255,0.02)]">
          <div className="absolute inset-0 rounded-full border border-[#00FF00]/40 animate-[spin_3s_linear_infinite]" style={{ borderTopColor: 'transparent', borderLeftColor: 'transparent' }} />
          <div className="absolute inset-2 rounded-full bg-[#00FF00]/10 animate-pulse" />
          <Zap className="w-5 h-5 text-[#00FF00] drop-shadow-[0_0_5px_rgba(0,255,0,0.8)] z-10" />
        </div>
        <span className="text-[9px] font-bold tracking-widest text-[#00FF00] uppercase mt-2 animate-pulse">
          Operação
        </span>
      </div>

    </div>
  );
};


import { supabase } from "@/integrations/supabase/client";

export default function MeuDia() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const isAnderson = user?.email?.toLowerCase().includes("anderson") || user?.email?.toLowerCase() === "livia@hotmail.com";

  const handleRestrictedAction = (callback: () => void) => {
    if (isAnderson) {
      callback();
    } else {
      toast.error("Acesso Restrito", { description: "Apenas a supervisão tem acesso a este módulo." });
    }
  };

  // Extrai e formata o nome do usuário logado
  const rawName = user?.user_metadata?.name || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Equipe";
  const currentUserName = rawName.charAt(0).toUpperCase() + rawName.slice(1);

  // Saudação de acordo com o horário
  const currentHour = new Date().getHours();
  let greeting = "Bom dia";
  if (currentHour >= 12 && currentHour < 18) {
    greeting = "Boa tarde";
  } else if (currentHour >= 18 || currentHour < 5) {
    greeting = "Boa noite";
  }

  type Announcement = {
    id: string;
    title: string;
    content: string;
    is_pinned: boolean;
    creator_name: string;
    created_at: string;
    acknowledgments?: { id: string; user_id: string; user_name: string; acknowledged_at: string }[];
  };

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [reminders, setReminders] = useState(MOCK_REMINDERS);
  const [adjustments, setAdjustments] = useState(MOCK_ADJUSTMENTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [isPinned, setIsPinned] = useState(false);

  const fetchAnnouncements = async () => {
    try {
      // 1. Fetch announcements
      const { data: annData, error: annError } = await supabase
        .from('announcements')
        .select('*')
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });

      if (annError) throw annError;

      // 2. Fetch acknowledgments
      const { data: ackData, error: ackError } = await supabase
        .from('announcement_acknowledgments')
        .select('*');

      if (ackError) throw ackError;

      // 3. Map together
      const merged = (annData || []).map(ann => ({
        ...ann,
        acknowledgments: (ackData || []).filter(ack => ack.announcement_id === ann.id)
      }));

      setAnnouncements(merged);
    } catch (error) {
      console.warn("Table announcements not found or error fetching.", error);
    }
  };

  useEffect(() => {
    fetchAnnouncements();

    const channel = supabase
      .channel('announcements_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'announcements' }, () => {
        fetchAnnouncements();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'announcement_acknowledgments' }, () => {
        fetchAnnouncements();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const todayDate = format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR });
  const [exitingAnnouncement, setExitingAnnouncement] = useState<string | null>(null);

  const handleDeleteAnnouncement = async (id: string) => {
    setExitingAnnouncement(id);
    setTimeout(async () => {
      await supabase.from('announcements').delete().eq('id', id);
      setExitingAnnouncement(null);
    }, 300);
  };

  const handleAcknowledge = async (id: string) => {
    const hasAck = announcements.find(a => a.id === id)?.acknowledgments?.some(ack => ack.user_id === (user?.id || 'anon'));
    if (hasAck) return;
    
    setExitingAnnouncement(id);
    setTimeout(async () => {
      await supabase.from('announcement_acknowledgments').insert({
        announcement_id: id,
        user_id: user?.id || 'anon',
        user_name: currentUserName
      });
      setExitingAnnouncement(null);
    }, 300);
  };

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newContent) return;

    await supabase.from('announcements').insert({
      title: newTitle,
      content: newContent,
      is_pinned: isPinned,
      creator_id: user?.id || null,
      creator_name: currentUserName
    });

    setNewTitle("");
    setNewContent("");
    setIsPinned(false);
    setIsModalOpen(false);
  };


  const handleCompleteReminder = (id: string) => {
    setReminders(reminders.filter(r => r.id !== id));
  };

  const handleResolveAdjustment = (id: string) => {
    setAdjustments(adjustments.filter(a => a.id !== id));
  };

  const TOTAL_TEAM_MEMBERS = 4;

  const visibleAnnouncements = announcements.filter(ann => {
    const isCreator = ann.creator_id === user?.id;
    const hasAck = ann.acknowledgments?.some(ack => ack.user_id === (user?.id || 'anon'));
    const ackCount = ann.acknowledgments?.length || 0;

    if (isCreator) {
      // Se for o criador, só some quando todos os outros marcarem ciente
      return ackCount < (TOTAL_TEAM_MEMBERS - 1);
    } else {
      // Se não for o criador, some assim que ele próprio marcar ciente
      return !hasAck;
    }
  });

  const isNothingPending = visibleAnnouncements.length === 0 && reminders.length === 0 && adjustments.length === 0;

  const quoteOfDay = getQuoteOfTheDay(user?.email);

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-48px)] bg-transparent w-full gap-8 font-sans overflow-hidden animate-in fade-in duration-700">
      
      {/* Coluna Esquerda: Tipografia Minimalista */}
      <div className="w-full lg:w-1/3 flex flex-col justify-center border-r border-white/5 pr-8 pt-20 pb-8 relative">
        
        {/* Ponto Verde Neon */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-3 h-3 rounded-full bg-[#00FF00] shadow-[0_0_10px_#00FF00] animate-pulse" />
          <span className="text-[#00FF00] text-[10px] font-bold tracking-[0.2em] uppercase opacity-80">
            Resumo Operacional
          </span>
        </div>

        <div className="text-[10px] font-bold text-gray-500 tracking-[0.1em] uppercase mb-4 flex flex-col gap-1">
          <span>WORKFLOW DA SEMANA</span>
          <span className="text-gray-400/80 capitalize">{todayDate}</span>
        </div>

        {/* Tipografia Gigante Empilhada */}
        <div className="flex flex-col space-y-1">
          <h1 className="text-4xl md:text-5xl font-light text-white tracking-tight leading-none mb-2">
            {greeting}, <br />
            <span className="font-medium text-[#00FF00]">{currentUserName}</span>.
          </h1>
          
          <div className="flex flex-col space-y-1 mt-6 text-2xl md:text-3xl font-light text-gray-400">
            {user?.email === "mara@hotmail.com" ? (
              <div onClick={() => navigate('/expedicao')} className="hover:text-white transition-colors cursor-pointer flex items-center group">
                Portal de Expedição <span className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity text-[#00FF00] text-sm font-bold bg-[#00FF00]/10 px-3 py-1 rounded-full">Ir</span>
              </div>
            ) : (
              <div className="hover:text-white transition-colors cursor-pointer flex items-center group">
                Urgências <span className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity text-[#00FF00] text-sm font-bold bg-[#00FF00]/10 px-3 py-1 rounded-full">{reminders.length}</span>
              </div>
            )}
            <div onClick={() => navigate('/lembretes')} className="hover:text-white transition-colors cursor-pointer flex items-center group">
              Workspace <span className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity text-[#00FF00] text-sm font-bold bg-[#00FF00]/10 px-3 py-1 rounded-full">Ir</span>
            </div>
            {user?.email !== "mara@hotmail.com" && (
              <>
                <div onClick={() => navigate('/mural-ajustes')} className="hover:text-white transition-colors cursor-pointer flex items-center group">
                  Ajustes <span className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity text-[#00FF00] text-sm font-bold bg-[#00FF00]/10 px-3 py-1 rounded-full">{adjustments.length}</span>
                </div>
                <div onClick={() => navigate('/marketing')} className="hover:text-white transition-colors cursor-pointer flex items-center group">
                  Marketing & Growth <span className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity text-[#00FF00] text-sm font-bold bg-[#00FF00]/10 px-3 py-1 rounded-full">Ir</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* A Rama do Dia no canto inferior direito da coluna esquerda */}
        <RamaDoDiaWidget />

      </div>

      {/* Coluna Direita: O Bento Grid */}
      <div className="w-full lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-4 h-full overflow-hidden pb-10 lg:pb-0 lg:pl-8">
        
        {isNothingPending && (
          <div className="col-span-1 md:col-span-2 aspect-[2/1] rounded-[2rem] bg-[#111111] flex flex-col items-center justify-center border border-white/5 shadow-2xl p-8 mt-4">
            <CheckCircle2 className="h-20 w-20 text-[#00FF00] mb-6 drop-shadow-[0_0_15px_rgba(0,255,0,0.4)]" />
            <h3 className="text-3xl font-light text-white mb-2 tracking-wide">Tudo zerado</h3>
            <p className="text-gray-500 text-center text-lg">Seu foco operacional está limpo.</p>
          </div>
        )}

        <ExpediçãoTracker />

        <PainelPagamentosHoje />

            {/* 3.1. Card Fixo de Prévia de Mensagens -> Escritório Virtual */}
            <div 
              onClick={() => handleRestrictedAction(() => window.dispatchEvent(new CustomEvent('open-global-chat')))}
              className="col-span-1 bg-gradient-to-br from-slate-300/10 via-slate-400/5 to-slate-500/10 hover:from-slate-300/15 hover:to-slate-500/15 backdrop-blur-md rounded-[2rem] p-6 flex flex-col justify-between border border-white/10 cursor-pointer transition-all duration-500 h-[250px] relative overflow-hidden group shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
            >
              {/* Brilho interno sutil */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-slate-200/5 rounded-full blur-[60px] group-hover:bg-slate-200/10 transition-colors pointer-events-none"></div>
              
              <div className="flex justify-between items-start z-10 relative">
                <div className="w-12 h-12 rounded-[14px] bg-white/5 flex items-center justify-center border border-white/10 shadow-sm group-hover:bg-white/10 transition-all">
                   <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300"><rect width="16" height="12" x="4" y="4" rx="2"/><path d="M4 12v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6"/><path d="M12 16v-4"/><path d="M8 16v-4"/><path d="M16 16v-4"/></svg>
                </div>
                {/* Notification Badge */}
                <div className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm group-hover:bg-white/10 transition-colors">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.5)]"></div>
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">6 Online</span>
                </div>
              </div>
              
              <div className="flex-1 mt-6 z-10 relative">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-bold text-slate-400 tracking-[0.15em] uppercase">
                    Ambiente Virtual
                  </span>
                </div>
                <h3 className="text-slate-100 text-xl font-bold tracking-tight leading-tight mb-2 group-hover:text-white transition-colors">
                  Escritório da Equipe
                </h3>
                <p className="text-sm text-slate-400 font-medium leading-relaxed">
                  Toda a equipe está trabalhando no escritório virtual.
                </p>
              </div>

              {/* Avatar Pile */}
              <div className="flex items-center mt-3 z-10 relative">
                <div className="w-8 h-8 rounded-full border-2 border-[#1e2330] bg-gray-200 z-50 overflow-hidden shadow-sm"><img src="/rogerio.png" className="w-full h-full object-cover" onError={(e) => e.currentTarget.src = 'https://ui-avatars.com/api/?name=RO&background=random'}/></div>
                <div className="w-8 h-8 rounded-full border-2 border-[#1e2330] bg-purple-600 flex items-center justify-center text-[10px] font-bold text-white z-40 -ml-2 shadow-sm">MA</div>
                <div className="w-8 h-8 rounded-full border-2 border-[#1e2330] bg-amber-600 flex items-center justify-center text-[10px] font-bold text-white z-30 -ml-2 shadow-sm">AN</div>
                <div className="w-8 h-8 rounded-full border-2 border-[#1e2330] bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white z-20 -ml-2 shadow-sm">AL</div>
                <div className="w-8 h-8 rounded-full border-2 border-[#1e2330] bg-gray-200 z-10 -ml-2 overflow-hidden shadow-sm"><img src="/assets/will.jpg" className="w-full h-full object-cover" onError={(e) => e.currentTarget.src = 'https://ui-avatars.com/api/?name=WM&background=random'}/></div>
                <div className="w-8 h-8 rounded-full border-2 border-[#1e2330] bg-green-500/20 flex items-center justify-center text-[10px] font-bold text-emerald-400 z-0 -ml-2 shadow-sm border-green-500/30">IA</div>
              </div>
            </div>

            {/* 3.2. Cards do Mural de Alinhamento */}
            <div id="mural-alinhamento" className="col-span-1 flex flex-col gap-2 h-[250px]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h3 className="text-gray-300 text-xs font-semibold uppercase tracking-widest flex items-center gap-2">
                    <Megaphone className="h-3.5 w-3.5 text-[#00FF00]" />
                    Alinhamento
                  </h3>
                  {visibleAnnouncements.length > 1 && (
                    <span className="text-[9px] font-bold text-gray-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/10 flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-300 shadow-[0_0_5px_rgba(203,213,225,0.8)] animate-pulse"></div>
                      +{visibleAnnouncements.length - 1} na fila
                    </span>
                  )}
                </div>
                <button 
                  onClick={() => handleRestrictedAction(() => setIsModalOpen(true))}
                  className="bg-white/5 hover:bg-[#00FF00]/20 hover:text-[#00FF00] text-gray-400 p-1 rounded-md transition-colors border border-white/5 hover:border-[#00FF00]/30"
                  title="Novo Aviso"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>

              {visibleAnnouncements.length === 0 && (
                <div className="flex-1 rounded-2xl p-5 flex flex-col items-center justify-center bg-[#111111] border border-white/5 border-dashed text-gray-500 shadow-inner">
                  <CheckCircle2 className="h-6 w-6 mb-2 opacity-20" />
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">Nenhum alinhamento pendente</span>
                </div>
              )}

              {visibleAnnouncements.slice(0, 1).map((ann) => {
                const hasAck = ann.acknowledgments?.some(ack => ack.user_id === (user?.id || 'anon'));
                return (
                <div key={ann.id} className={`rounded-2xl p-5 flex flex-col justify-between bg-gradient-to-b from-[#18181A] to-[#111111] border border-white/5 shadow-xl relative group flex-1 overflow-hidden transition-all duration-300 transform ${exitingAnnouncement === ann.id ? 'opacity-0 scale-95 -translate-x-8' : 'opacity-100 scale-100 translate-x-0'}`}>
                  <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 mb-2 min-h-0">
                    <div className="flex items-center gap-2 mb-4 flex-wrap relative pr-8">
                      <button 
                        onClick={() => handleRestrictedAction(() => handleDeleteAnnouncement(ann.id))}
                        className="absolute right-0 top-0 text-gray-500 hover:text-red-500 transition-colors bg-white/5 hover:bg-red-500/10 p-1.5 rounded-lg"
                        title="Excluir Aviso"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-widest border border-white/10 bg-white/5 flex items-center gap-1.5 text-gray-300">
                        <Megaphone className="h-3 w-3 text-[#00FF00]" />
                        {ann.creator_name || 'Equipe'}
                      </span>
                      <span className="text-gray-500 text-[9px] font-bold uppercase tracking-widest flex items-center gap-1">
                        <Tag className="h-2.5 w-2.5" /> {ann.title}
                      </span>
                      {ann.is_pinned && <AlertTriangle className="h-3 w-3 text-amber-500 ml-auto" />}
                    </div>
                    
                    <p className="text-gray-300 font-light text-sm leading-relaxed mb-4">
                      {ann.content}
                    </p>
                    
                    <div className="flex items-center gap-2 mb-4 flex-wrap relative pr-8 min-h-[24px]">
                      {(ann.acknowledgments && ann.acknowledgments.length > 0) ? (
                        <>
                          <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3 text-[#00FF00]" /> Cientes:
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {ann.acknowledgments.map(ack => (
                              <span key={ack.id} className="bg-[#00FF00]/10 text-[#00FF00] border border-[#00FF00]/20 px-2 py-0.5 rounded-md text-[9px] font-bold">
                                {ack.user_name?.split(' ')[0] || 'Usuário'}
                              </span>
                            ))}
                          </div>
                        </>
                      ) : (
                        <div className="text-[10px] text-gray-600 font-medium italic">Ninguém visualizou ainda.</div>
                      )}
                    </div>
                  </div>
                  <button 
                    onClick={() => handleRestrictedAction(() => handleAcknowledge(ann.id))}
                    disabled={hasAck}
                    className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                      hasAck 
                        ? 'bg-[#00FF00]/10 text-[#00FF00] border border-[#00FF00]/20' 
                        : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5'
                    }`}
                  >
                    {hasAck ? 'Ciente Registrado' : 'Estou Ciente'}
                    {hasAck ? <CheckCircle2 className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4 opacity-50" />}
                  </button>
                </div>
                );
              })}
            </div>

        {/* 4. Card de Desempenho Rápido */}
        {!isNothingPending && (
          <div className="col-span-1 md:col-span-2 bg-[#1A1A1A] rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-between border border-[#00FF00]/20 relative overflow-hidden shadow-[0_0_30px_rgba(0,255,0,0.05)] shrink-0 min-h-[90px]">
             <div className="relative z-10 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-[#00FF00]/10 flex items-center justify-center border border-[#00FF00]/20">
                  <Zap className="h-6 w-6 text-[#00FF00]" />
                </div>
                <div>
                  <h3 className="text-white text-lg font-light tracking-tight mb-0.5">Desempenho</h3>
                  <p className="text-gray-400 font-light italic text-xs max-w-sm">{quoteOfDay}</p>
                </div>
             </div>
             <div className="relative z-10 flex gap-6 mt-4 sm:mt-0">
               {(user?.email === "mara@hotmail.com" || currentUserName.startsWith("Rogério")) && (
                 <div className="text-center">
                   <div className="text-3xl font-extrabold text-[#00FF00] tracking-tighter leading-none">{reminders.length + adjustments.length}</div>
                   <div className="text-[9px] font-bold text-[#00FF00] uppercase tracking-widest mt-1">Casos Abertos</div>
                 </div>
               )}
             </div>
          </div>
        )}

      </div>

    

      {/* Modal de Novo Aviso */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#111111] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <Megaphone className="h-5 w-5 text-[#00FF00]" />
                Criar Novo Aviso
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateAnnouncement} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                  Ttulo do Aviso
                </label>
                <input 
                  type="text" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ex: Mudana na etiqueta de envio..."
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00FF00]/50 transition-colors"
                  required
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                  Detalhes do Aviso
                </label>
                <textarea 
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Descreva a regra, alinhamento ou erro que precisa ser evitado..."
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00FF00]/50 transition-colors h-32 resize-none"
                  required
                />
              </div>

              <div className="flex items-center gap-3 bg-[#0a0a0a] p-4 rounded-xl border border-white/5">
                <input 
                  type="checkbox" 
                  id="pin-notice"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="w-4 h-4 rounded border-white/20 bg-transparent text-[#00FF00] focus:ring-[#00FF00] focus:ring-offset-0"
                />
                <label htmlFor="pin-notice" className="text-sm font-medium text-white cursor-pointer flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  Marcar como Alta Urgncia / Fixar
                </label>
              </div>

              <div className="pt-4 flex items-center gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 px-4 bg-transparent border border-white/10 hover:bg-white/5 text-white text-sm font-bold rounded-xl transition-all"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 px-4 bg-[#00FF00] hover:bg-[#00FF00]/80 text-black text-sm font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(0,255,0,0.2)]"
                >
                  Publicar Aviso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
</div>
  );
}







