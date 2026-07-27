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
  Heart
} from "lucide-react";
import { RamaDoDiaWidget } from "@/components/RamaDoDiaWidget";
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

// ---- MOCKS AGREGADOS PARA DEMONSTRAÇÃO ----

const MOCK_ANNOUNCEMENTS = [
  {
    id: "ann_1",
    creator: { full_name: "Anderson • Estratégia" },
    title: "Padrão de Imagens - Kits de Gás",
    content: "Atenção nas fotos dos kits de gás: verifiquem as imagens do fornecedor antes de subir.",
    is_pinned: true,
  }
];

const MOCK_REMINDERS = [
  {
    id: "rem_1",
    title: "Replicar correção em todos os canais",
    description: "Tira o R antes do Guardanapo. Atualizar Mercado Livre, Amazon e Shopee.",
    due_date: new Date(new Date().setHours(17, 0, 0, 0)).toISOString(),
    status: "pendente",
  },
  {
    id: "rem_2",
    title: "Atualizar foto do kit de gás",
    description: "Trocar a foto do anúncio mestre, fornecedor mandou nova.",
    due_date: new Date(new Date().setHours(10, 0, 0, 0)).toISOString(),
    status: "pendente",
  }
];

const MOCK_ADJUSTMENTS = [
  {
    id: "adj_1",
    marketplace: "Mercado Livre",
    sku: "KITGAS001",
    description: "Aviso no kit de gás: corrigir a imagem e a descrição.",
  },
  {
    id: "adj_2",
    marketplace: "Geral",
    sku: "RGUARDANAPO",
    description: "Tirar a letra R que foi digitada por erro antes da palavra Guardanapo.",
  }
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

const ExpedicaoTracker = () => {
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
    <div className="col-span-1 md:col-span-2 flex flex-col md:flex-row items-center justify-between py-4 px-6 bg-[#050505] rounded-3xl border border-white/5 relative overflow-hidden shadow-2xl gap-6">
      {/* Glow background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[150px] bg-[#EE4D2D]/10 rounded-full blur-[60px] pointer-events-none" />
      
      {/* Esquerda: Avisos */}
      <div className="flex flex-col items-start gap-3 z-10 w-full md:w-auto">
        <div className="bg-[#111] border border-white/10 rounded-full px-4 py-1.5 flex items-center gap-2 shadow-lg backdrop-blur-md">
          <div className="w-1.5 h-1.5 rounded-full bg-[#EE4D2D] animate-pulse shadow-[0_0_8px_#EE4D2D]" />
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
      <div className="relative w-[220px] h-[120px] flex flex-col items-center justify-start overflow-hidden z-10 shrink-0">
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
          <circle cx="150" cy="150" r={radius} fill="none" stroke="#EE4D2D" strokeWidth="24" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={circumference - ((progress / 100) * (circumference / 2))} transform="rotate(180 150 150)" className="transition-all duration-1000 ease-in-out drop-shadow-[0_0_10px_rgba(238,77,45,0.5)]" />
        </svg>

        <div className="absolute top-[40%] flex flex-col items-center justify-center w-full">
          <span className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.1em] mb-0.5">
            Horário Local
          </span>
          <div className="text-white text-5xl font-bold tracking-tighter" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {hours.toString().padStart(2, '0')}:{minutes.toString().padStart(2, '0')}
          </div>
          <span className="text-[#EE4D2D] text-[9px] font-bold uppercase tracking-wider mt-1 bg-[#EE4D2D]/10 px-2 py-0.5 rounded-full">
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
          Operando
        </span>
      </div>
    </div>
  );
};

export default function MeuDia() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
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

  const [announcements, setAnnouncements] = useState(MOCK_ANNOUNCEMENTS);
  const [reminders, setReminders] = useState(MOCK_REMINDERS);
  const [adjustments, setAdjustments] = useState(MOCK_ADJUSTMENTS);

  const todayDate = format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR });

  const handleAcknowledge = (id: string) => {
    setAnnouncements(announcements.filter(a => a.id !== id));
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
            <div onClick={() => navigate('/mural-ajustes')} className="hover:text-white transition-colors cursor-pointer flex items-center group">
              Ajustes <span className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity text-[#00FF00] text-sm font-bold bg-[#00FF00]/10 px-3 py-1 rounded-full">{adjustments.length}</span>
            </div>
            <div onClick={() => navigate('/mural-alinhamento')} className="hover:text-white transition-colors cursor-pointer flex items-center group">
              Alinhamento <span className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity text-[#00FF00] text-sm font-bold bg-[#00FF00]/10 px-3 py-1 rounded-full">2</span>
            </div>
          </div>
        </div>

        {/* A Rama do Dia no canto inferior direito da coluna esquerda */}
        <RamaDoDiaWidget />

      </div>

      {/* Coluna Direita: O Bento Grid */}
      <div className="w-full lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-4 h-full overflow-y-auto custom-scrollbar pb-10 lg:pb-0 lg:pl-8">
        
        {isNothingPending && (
          <div className="col-span-1 md:col-span-2 aspect-[2/1] rounded-[2rem] bg-[#111111] flex flex-col items-center justify-center border border-white/5 shadow-2xl p-8 mt-4">
            <CheckCircle2 className="h-20 w-20 text-[#00FF00] mb-6 drop-shadow-[0_0_15px_rgba(0,255,0,0.4)]" />
            <h3 className="text-3xl font-light text-white mb-2 tracking-wide">Tudo zerado</h3>
            <p className="text-gray-500 text-center text-lg">Seu foco operacional está limpo.</p>
          </div>
        )}

        {user?.email === "mara@hotmail.com" ? (
          <ExpedicaoTracker />
        ) : (
          announcements.length > 0 && (
            <div className="col-span-1 md:col-span-2 bg-[#111111] border-l-4 border-[#00FF00] rounded-2xl p-5 group relative shadow-lg h-fit">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[#00FF00] font-bold tracking-tighter text-xl uppercase flex items-center gap-2">
                  <Megaphone className="h-5 w-5" strokeWidth={3} />
                  Mural
                </h3>
                <span className="text-[#00FF00] text-[10px] font-bold tracking-widest uppercase border border-[#00FF00]/20 px-2 py-0.5 rounded-full">
                  Prioridade
                </span>
              </div>
              
              <div className="space-y-3">
                {announcements.map(ann => (
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
                        className="bg-[#00FF00]/10 text-[#00FF00] border border-[#00FF00]/20 px-4 py-1.5 rounded-lg font-bold text-xs flex items-center gap-2 hover:bg-[#00FF00]/20 transition-colors w-fit shrink-0 mb-1"
                      >
                        Estou Ciente <CheckCircle2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          )
        )}

        {reminders.length > 0 && reminders.map((reminder, idx) => {
          const isLate = reminder.due_date && isBefore(parseISO(reminder.due_date), new Date());
          return (
            <div key={reminder.id} className={`col-span-1 rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden transition-all hover:border-white/20 group ${isLate ? 'bg-[#1a0f0f] border border-red-500/20' : 'bg-[#111] border border-white/5'}`}>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <CalendarDays className={`h-5 w-5 ${isLate ? 'text-red-500' : 'text-gray-500'}`} />
                  {isLate && (
                    <span className="bg-red-500 text-white text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full">
                      Atrasado
                    </span>
                  )}
                </div>
                <h4 className="text-white text-lg font-light tracking-tight leading-tight mb-2">
                  {reminder.title}
                </h4>
                <p className="text-gray-500 text-xs font-medium line-clamp-2">
                  {reminder.description}
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-white/5">
                <button 
                  onClick={() => handleCompleteReminder(reminder.id)}
                  className="w-full flex items-center justify-between group-hover:text-[#00FF00] text-gray-400 font-bold text-xs tracking-widest uppercase transition-colors"
                >
                  Concluir Tarefa
                  <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          );
        })}

        {/* 3. Cards de Ajustes (Estética Glass/Branding) */}
        {adjustments.length > 0 && adjustments.map((ticket, idx) => (
          <div key={ticket.id} className="col-span-1 rounded-2xl p-5 flex flex-col justify-between bg-gradient-to-b from-[#18181A] to-[#111111] border border-white/5 shadow-xl relative group">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className={`px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-widest border flex items-center gap-1.5 ${getMarketplaceStyle(ticket.marketplace)}`}>
                  {getMarketplaceLogo(ticket.marketplace)}
                  {ticket.marketplace}
                </span>
                <span className="text-gray-500 text-[9px] font-bold uppercase tracking-widest flex items-center gap-1">
                  <Tag className="h-2.5 w-2.5" /> {ticket.sku}
                </span>
              </div>
              
              <p className="text-gray-300 font-light text-sm leading-relaxed mb-4 line-clamp-3">
                {ticket.description}
              </p>
            </div>
            
            <button 
              onClick={() => handleResolveAdjustment(ticket.id)}
              className="w-full bg-white/5 hover:bg-[#00FF00] hover:text-black text-white px-4 py-2 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-2 group-hover:shadow-[0_0_15px_rgba(0,255,0,0.2)]"
            >
              Marcar Resolvido <CheckCircle2 className="h-3 w-3" />
            </button>
          </div>
        ))}

        {/* 4. Card de Desempenho Rápido */}
        {!isNothingPending && (
          <div className="col-span-1 md:col-span-2 bg-[#1A1A1A] rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between border border-white/5 relative overflow-hidden">
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
               <div className="text-center">
                 <div className="text-3xl font-extrabold text-white tracking-tighter leading-none">12</div>
                 <div className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-1">Ajustes</div>
               </div>
               <div className="text-center">
                 <div className="text-3xl font-extrabold text-[#00FF00] tracking-tighter leading-none">4</div>
                 <div className="text-[9px] font-bold text-[#00FF00] uppercase tracking-widest mt-1">Urgências</div>
               </div>
             </div>
          </div>
        )}

      </div>
    </div>
  );
}
