import React, { useState, useEffect } from "react";
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

// ---- MOCKS AGREGADOS PARA DEMONSTRAÃ©!Ã²O ----

const MOCK_ANNOUNCEMENTS = [
  {
    id: "ann_1",
    creator: { full_name: "Anderson - SupervisÃ£o" },
    title: "Cuidado com os itens de vidro!",
    content: "Lembrete: A partir de hoje, Ã© obrigatÃ³rio usar plÃ¡stico bolha duplo em todos os itens frÃ¡geis.",
    is_pinned: true,
  }
];

const MOCK_REMINDERS = [
  {
    id: "rem_1",
    title: "ReposiÃ§Ã£o de Insumos: Caixa Parda 30x20x10",
    description: "O almoxarifado separou as caixas solicitadas. EstÃ£o a caminho da bancada 2.",
    due_date: new Date(new Date().setHours(17, 0, 0, 0)).toISOString(),
    status: "pendente",
  },
  {
    id: "rem_2",
    title: "Estoque CrÃ­tico: Fita Adesiva",
    description: "AtenÃ§Ã£o: Restam apenas 3 rolos de fita. O pedido de compra jÃ¡ foi aprovado.",
    due_date: new Date(new Date().setHours(10, 0, 0, 0)).toISOString(),
    status: "pendente",
  }
];

const MOCK_ADJUSTMENTS = [
  {
    id: "adj_1",
    marketplace: "Mercado Livre",
    sku: "KITGAS001",
    description: "DivergÃªncia Corrigida: O anÃºncio foi pausado e o estoque atualizado. Pode desmontar o pacote.",
  },
];

const getQuoteOfTheDay = (email?: string) => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  
  // Exibir versÃ­culos bÃ­blicos apenas para a conta do RogÃ©rio e da Mara
  if (email === "suporte.ramamagazine@gmail.com" || email === "mara@hotmail.com") {
    return BIBLE_VERSES[dayOfYear % BIBLE_VERSES.length];
  }
  
  return RAP_QUOTES[dayOfYear % RAP_QUOTES.length];
};

// -------------------------------------------

const ExpediÃ§Ã£oTracker = () => {
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
    { name: "ML AgÃªncia", time: "16:00", minutes: 16 * 60, color: "#FFE600" },
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
    <div className="col-span-1 md:col-span-2 flex flex-col md:flex-row items-center justify-between py-3 px-6 bg-[#050505] rounded-3xl border border-white/5 relative overflow-hidden shadow-2xl gap-6 min-h-[160px]">
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

      {/* Centro: RelÃ³gio AnalÃ³gico (Menor) */}
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
            HorÃ¡rio Local
          </span>
          <div className="text-white text-5xl font-bold tracking-tighter" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {hours.toString().padStart(2, '0')}:{minutes.toString().padStart(2, '0')}
          </div>
          <span className="text-[#00FF00] text-[9px] font-bold uppercase tracking-wider mt-1 bg-[#00FF00]/10 px-2 py-0.5 rounded-full">
            Faltam {remainingHoursStr}h {remainingMinsStr}m
          </span>
        </div>
      </div>
      
      {/* Direita: Indicador de OperaÃ§Ã£o */}
      <div className="flex flex-col items-center justify-center z-10 w-full md:w-auto mt-4 md:mt-0">
        <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-[#111] border border-white/10 shadow-[inset_0_0_15px_rgba(255,255,255,0.02)]">
          <div className="absolute inset-0 rounded-full border border-[#00FF00]/40 animate-[spin_3s_linear_infinite]" style={{ borderTopColor: 'transparent', borderLeftColor: 'transparent' }} />
          <div className="absolute inset-2 rounded-full bg-[#00FF00]/10 animate-pulse" />
          <Zap className="w-5 h-5 text-[#00FF00] drop-shadow-[0_0_5px_rgba(0,255,0,0.8)] z-10" />
        </div>
        <span className="text-[9px] font-bold tracking-widest text-[#00FF00] uppercase mt-2 animate-pulse">
          OperaÃ§Ã£o
        </span>
      </div>

    </div>
  );
};

const MuralExpediÃ§Ã£o = ({ user }: { user: any }) => {
  const [notes, setNotes] = useState([
    { id: 1, text: "Lembrete: A partir de hoje, Ã© obrigatÃ³rio usar plÃ¡stico bolha duplo em todos os itens frÃ¡geis.", author: "RogÃ©rio", date: "Hoje" },
    { id: 2, text: "Verificar se as caixas da Shopee chegaram.", author: "Mara", date: "Ontem" }
  ]);
  const [newNote, setNewNote] = useState("");

  const handlePost = () => {
    if (newNote.trim()) {
      setNotes([{id: Date.now(), text: newNote, author: user?.user_metadata?.full_name || "ExpediÃ§Ã£o", date: "Agora"}, ...notes]);
      setNewNote("");
    }
  };

  return (
    <div className="col-span-1 md:col-span-2 bg-[#111111] border-l-4 border-[#00FF00] rounded-2xl p-5 group relative shadow-lg h-fit mt-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[#00FF00] font-bold tracking-tighter text-xl uppercase flex items-center gap-2">
          <Megaphone className="h-5 w-5" strokeWidth={3} />
          Mural da ExpediÃ§Ã£o
        </h3>
        <span className="text-[#00FF00] text-[10px] font-bold tracking-widest uppercase border border-[#00FF00]/20 px-2 py-0.5 rounded-full">
          Avisos Internos
        </span>
      </div>
      
      <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2 mb-4">
        {notes.map(note => (
          <div key={note.id} className="bg-black/30 rounded-xl p-4 border border-white/5 flex flex-col gap-2">
            <div className="flex items-center justify-between text-gray-400 font-bold text-[10px] uppercase tracking-wider">
              <span>{note.author}</span>
              <span>{note.date}</span>
            </div>
            <p className="text-white text-sm font-medium leading-relaxed">
              {note.text}
            </p>
          </div>
        ))}
      </div>
      
      <div className="flex gap-2">
        <input 
          value={newNote} 
          onChange={e => setNewNote(e.target.value)}
          placeholder="Adicionar novo aviso..."
          className="flex h-10 w-full rounded-md border border-white/10 bg-black/50 px-3 py-2 text-sm text-white placeholder:text-gray-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#00FF00]/50"
          onKeyDown={e => {
            if (e.key === 'Enter') handlePost();
          }}
        />
        <button 
          onClick={handlePost}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-[#00FF00] text-black hover:bg-[#00E500] h-10 px-4 py-2 font-bold"
        >
          Postar
        </button>
      </div>

    </div>
  );
};

export default function MeuDia() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Extrai e formata o nome do usuÃ¡rio logado
  const rawName = user?.user_metadata?.name || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Equipe";
  const currentUserName = rawName.charAt(0).toUpperCase() + rawName.slice(1);

  // SaudaÃ§Ã£o de acordo com o horÃ¡rio
  const currentHour = new Date().getHours();
  let greeting = "Bom dia";
  if (currentHour >= 12 && currentHour < 18) {
    greeting = "Boa tarde";
  } else if (currentHour >= 18 || currentHour < 5) {
    greeting = "Boa noite";
  }

  const [announcements, setAnnouncements] = useState(MOCK_ANNOUNCEMENTS);
  const [reminders, setReminders] = useState(MOCK_REMINDERS);
  const [adjustments, setAdjustments] = useState(MOCK_ADJUSTMENTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [isPinned, setIsPinned] = useState(false);

  const todayDate = format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR });

  const handleDeleteAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
  };

  const handleAcknowledge = (id: string) => {
    const TOTAL_TEAM_MEMBERS = 4; // Auto-excluir apÃ³s 4 visualizaÃ§Ãµes
    
    setAnnouncements(prev => {
      const updated = prev.map(a => {
        if (a.id === id) {
          const hasAck = a.acknowledgments?.some(ack => ack.user_id === (user?.id || 'anon'));
          if (hasAck) return a;
          
          return {
            ...a,
            acknowledgments: [
              ...(a.acknowledgments || []),
              {
                id: Math.random().toString(),
                announcement_id: id,
                user_id: user?.id || 'anon',
                acknowledged_at: new Date().toISOString(),
                user: { full_name: currentUserName }
              }
            ]
          };
        }
        return a;
      });
      
      return updated.filter(a => {
        if (a.id === id && a.acknowledgments && a.acknowledgments.length >= TOTAL_TEAM_MEMBERS) {
          return false; // Remove automatically
        }
        return true;
      });
    });
  };

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newContent) return;

    const newAnnouncement = {
      id: Math.random().toString(),
      creator_id: user?.id || "anon",
      title: newTitle,
      content: newContent,
      is_pinned: isPinned,
      created_at: new Date().toISOString(),
      creator: { full_name: currentUserName + " â€¢ Equipe" },
      acknowledgments: []
    };

    setAnnouncements([newAnnouncement, ...announcements]);
    setIsModalOpen(false);
    setNewTitle("");
    setNewContent("");
    setIsPinned(false);
  };


  const handleCompleteReminder = (id: string) => {
    setReminders(reminders.filter(r => r.id !== id));
  };

  const handleResolveAdjustment = (id: string) => {
    setAdjustments(adjustments.filter(a => a.id !== id));
  };

  const isNothingPending = announcements.length === 0 && reminders.length === 0 && adjustments.length === 0;

  const quoteOfDay = getQuoteOfTheDay(user?.email);

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-48px)] bg-transparent w-full gap-8 font-sans overflow-hidden animate-in fade-in duration-700">
      
      {/* Coluna Esquerda: Tipografia Minimalista */}
      <div className="w-full lg:w-1/3 flex flex-col justify-center border-r border-white/5 pr-8 pt-20 pb-8 relative">
        
        {/* Ponto Verde Neon */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-3 h-3 rounded-full bg-[#00FF00] shadow-[0_0_10px_#00FF00] animate-pulse" />
          <span className="text-[#00FF00] text-[10px] font-bold tracking-[0.2em] uppercase opacity-80">
            Resumo OperaÃ§Ã£onal
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
                Portal de ExpediÃ§Ã£o <span className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity text-[#00FF00] text-sm font-bold bg-[#00FF00]/10 px-3 py-1 rounded-full">Ir</span>
              </div>
            ) : (
              <div className="hover:text-white transition-colors cursor-pointer flex items-center group">
                UrgÃªncias <span className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity text-[#00FF00] text-sm font-bold bg-[#00FF00]/10 px-3 py-1 rounded-full">{reminders.length}</span>
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
            <p className="text-gray-500 text-center text-lg">Seu foco operacional estÃ¡ limpo.</p>
          </div>
        )}

        <ExpediÃ§Ã£oTracker />

        {(user?.email === "livia@hotmail.com" || currentUserName.startsWith("RogÃ©rio")) ? (
          <PainelPagamentosHoje />
        ) : (
          user?.email !== "mara@hotmail.com" && (
            <div className="col-span-1 md:col-span-2 bg-[#111111] border-l-4 border-[#00FF00] rounded-2xl p-5 group relative shadow-lg h-fit">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[#00FF00] font-bold tracking-tighter text-xl uppercase flex items-center gap-2">
                  <Megaphone className="h-5 w-5" strokeWidth={3} />
                  Mural de Alinhamento
                </h3>
                <span className="text-[#00FF00] text-[10px] font-bold tracking-widest uppercase border border-[#00FF00]/20 px-2 py-0.5 rounded-full">
                  Prioridade
                </span>
              </div>
              
              
              <div className="space-y-3">
                {announcements.length === 0 ? (
                  <div className="text-gray-500 text-sm italic text-center py-4 bg-black/20 rounded-xl">
                    Nenhum aviso no momento.
                  </div>
                ) : (
                  announcements.map(ann => (
                  <div key={ann.id} className="bg-black/30 rounded-xl p-4 border border-white/5 hover:bg-black/50 transition-colors">
                    <div>
                      <div className="flex items-center gap-2 mb-2 text-gray-400 font-bold text-[10px] uppercase tracking-wider">
                        <span>{ann.creator.full_name}</span>
                        {ann.is_pinned && <AlertTriangle className="h-3 w-3 text-amber-500" />}
                      </div>
                      <h4 className="text-white font-extrabold text-lg mb-1 leading-tight tracking-tight">
                        {ann.title}
                      </h4>
                    </div>
                    
                    <div className="flex items-end justify-between gap-4 mt-1">
                      <p className="text-gray-400 font-medium text-xs mb-0">
                        {ann.content}
                      </p>
                      <button 
                        onClick={() => handleAcknowledge(ann.id)}
                        className="bg-[#00FF00]/10 text-[#00FF00] border border-[#00FF00]/20 px-4 py-1.5 rounded-lg font-bold text-xs flex items-center gap-2 hover:bg-[#00FF00]/20 transition-colors w-fit shrink-0"
                      >
                        Estou Ciente <CheckCircle2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                )))}
              </div>
            </div>
          </div>
          )
        )}

        {(user?.email === "mara@hotmail.com" || currentUserName.startsWith("RogÃ©rio")) ? (
          <MuralExpediÃ§Ã£o user={user} />
        ) : (
          <>
            {/* 3.1. Card Fixo de PrÃ©via de Mensagens */}
            <div 
              onClick={() => window.dispatchEvent(new CustomEvent('open-global-chat'))}
              className="col-span-1 bg-[#121214] hover:bg-[#18181B] rounded-3xl p-5 flex flex-col justify-center items-center gap-5 border border-white/5 hover:border-white/10 shadow-lg cursor-pointer transition-all duration-500 group relative overflow-hidden h-[250px]"
            >
              {/* Subtle inner glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              <div className="relative shrink-0">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1E1E20] to-[#111] flex items-center justify-center border border-white/10 group-hover:scale-105 transition-transform duration-500 shadow-inner relative overflow-hidden">
                   <div className="absolute inset-0 bg-emerald-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                   <MessageCircle className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors relative z-10" />
                </div>
                {/* Notification Badge */}
                <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#FF3B30] border-2 border-[#121214] rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-lg animate-in zoom-in">
                  3
                </div>
              </div>
              
              <div className="flex-1 min-w-0 flex flex-col justify-center items-center text-center mt-2">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                    Chat da Equipe
                  </span>
                  <div className="w-1 h-1 rounded-full bg-white/20" />
                  <span className="text-[10px] text-gray-500 font-medium">Agora</span>
                </div>
                <h3 className="text-white font-medium text-[13px] leading-tight truncate mb-1">
                  Fahema: <span className="text-gray-400 font-normal">Os novos criativos jÃ¡ estÃ£o na pasta...</span>
                </h3>
              </div>
              
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 duration-300">
                <ChevronRight className="w-4 h-4 text-white/50 group-hover:text-white" />
              </div>
            </div>

            {/* 3.2. Cards do Mural de Alinhamento */}
            <div id="mural-alinhamento" className="col-span-1 flex flex-col gap-4 h-[250px]">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-gray-300 text-xs font-semibold uppercase tracking-widest flex items-center gap-2">
                  <Megaphone className="h-3.5 w-3.5 text-[#00FF00]" />
                  Alinhamento
                </h3>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="bg-white/5 hover:bg-[#00FF00]/20 hover:text-[#00FF00] text-gray-400 p-1 rounded-md transition-colors border border-white/5 hover:border-[#00FF00]/30"
                  title="Novo Aviso"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
              {announcements.slice(0, 1).map((ann) => {
                const hasAck = ann.acknowledgments?.some(ack => ack.user_id === (user?.id || 'anon'));
                return (
                <div key={ann.id} className="rounded-2xl p-5 flex flex-col justify-between bg-gradient-to-b from-[#18181A] to-[#111111] border border-white/5 shadow-xl relative group flex-1 overflow-hidden">
                  <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 mb-2 min-h-0">
                    <div className="flex items-center gap-2 mb-4 flex-wrap relative pr-8">
                      <button 
                        onClick={() => handleDeleteAnnouncement(ann.id)}
                        className="absolute right-0 top-0 text-gray-500 hover:text-red-500 transition-colors bg-white/5 hover:bg-red-500/10 p-1.5 rounded-lg"
                        title="Excluir Aviso"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-widest border border-white/10 bg-white/5 flex items-center gap-1.5 text-gray-300">
                        <Megaphone className="h-3 w-3 text-[#00FF00]" />
                        {ann.creator?.full_name || 'Equipe'}
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
                                {ack.user?.full_name?.split(' ')[0] || 'UsuÃ¡rio'}
                              </span>
                            ))}
                          </div>
                        </>
                      ) : (
                        <div className="text-[10px] text-gray-600 font-medium italic">NinguÃ©m visualizou ainda.</div>
                      )}
                    </div>
                  </div>
                  <button 
                    onClick={() => handleAcknowledge(ann.id)}
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
          </>
        )}

        {/* 4. Card de Desempenho RÃ¡pido */}
        {!isNothingPending && (
          <div className="col-span-1 md:col-span-2 bg-[#1A1A1A] rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between border border-white/5 relative overflow-hidden shrink-0 min-h-[90px]">
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
               {(user?.email === "mara@hotmail.com" || currentUserName.startsWith("RogÃ©rio")) && (
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







