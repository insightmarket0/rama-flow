import React, { useState, useEffect, useRef } from "react";
import { 
  MessageCircle, 
  X, 
  Mic, 
  Paperclip, 
  Send,
  MoreVertical,
  Hash,
  User,
  Package,
  FileText,
  Play,
  Pause,
  AlertTriangle,
  CheckCircle2,
  Sparkles
} from "lucide-react";

const CHANNELS = [
  { id: "c1", name: "Central", unread: 2, icon: Hash },
];

const DIRECT_MESSAGES = [
  { id: "u1", name: "Rogério", unread: 0, online: true, image: "/rogerio.png" },
  { id: "u2", name: "Will Mendes", unread: 1, online: false, image: "/assets/will.jpg" },
  { id: "u3", name: "Alyson", unread: 0, online: true },
];

const INITIAL_MESSAGES = [
  { 
    id: 1, 
    sender: "Alyson", 
    time: "09:20", 
    text: "Adicionei as novas fotos da divergência do pedido 1540. O cliente do Mercado Livre abriu reclamação.", 
    isMe: false 
  },
  { 
    id: 2, 
    sender: "Rogério", 
    time: "09:24", 
    text: "Pessoal! O flex do Mercado Livre acabou de chegar pra coleta.", 
    isMe: false,
    userImage: "/rogerio.png"
  },
  { 
    id: 3, 
    sender: "Will Mendes", 
    time: "09:30",
    type: "image",
    image: "https://images.unsplash.com/photo-1586528116311-ad8c738759be?auto=format&fit=crop&w=400&q=80",
    text: "Olha o estado que a transportadora da Shopee deixou.",
    isMe: false,
    userImage: "/assets/will.jpg"
  },
  { 
    id: 4, 
    sender: "Você", 
    time: "09:35", 
    text: "Pode deixar, vou reportar isso no painel de divergências agora mesmo.", 
    isMe: true
  },
  {
    id: 5,
    type: "audio",
    sender: "Rogério",
    time: "09:40",
    isMe: false,
    userImage: "/rogerio.png",
    duration: "0:15"
  },
  {
    id: 6,
    type: "approval",
    sender: "Workflow Bot",
    time: "11:21",
    isMe: false,
    title: "Orçamento de Campanha",
    subtitle: "Valor: R$ 5.000,00 | Plataforma: Meta Ads",
  }
];

const AudioBubble = ({ msg }: { msg: any }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const durationParts = (msg.duration || "0:03").split(":");
    setTotalSeconds(parseInt(durationParts[0] || "0") * 60 + parseInt(durationParts[1] || "3"));
  }, [msg.duration]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= totalSeconds - 1) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, totalSeconds]);

  const togglePlay = () => {
    if (!isPlaying && currentTime >= totalSeconds) setCurrentTime(0);
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const bars = [2, 3, 2, 4, 5, 3, 2, 1, 3, 4, 2, 3, 2, 4, 3];
  const progressRatio = totalSeconds > 0 ? currentTime / totalSeconds : 0;

  return (
    <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-3 shadow-md min-w-[200px]">
      <button 
        onClick={togglePlay}
        className="w-10 h-10 rounded-full bg-[#111] border border-[#00FF00]/30 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(0,255,0,0.1)] hover:border-[#00FF00]/60 hover:bg-[#00FF00]/10 transition-all">
        {isPlaying ? <Pause className="w-4 h-4 text-[#00FF00] fill-[#00FF00]" /> : <Play className="w-4 h-4 text-[#00FF00] ml-0.5 fill-[#00FF00]" />}
      </button>
      
      <div className="flex-1 flex items-center gap-1 px-1">
        {bars.map((h, i) => {
          const isPassed = (i / bars.length) <= progressRatio;
          return (
            <div 
              key={i} 
              className={`w-1 rounded-full transition-all duration-300 ${isPassed ? 'bg-[#00FF00]' : 'bg-[#00FF00]/30'} ${isPlaying && isPassed ? 'animate-pulse' : ''}`} 
              style={{ height: `${isPlaying && !isPassed ? (Math.random() * 2 + 2) * 3 : h * 3.5}px`, animationDelay: `${i * 50}ms` }} 
            />
          );
        })}
      </div>
      
      <span className="text-[11px] font-bold text-gray-400 min-w-[28px] text-right">
        {isPlaying || currentTime > 0 ? formatTime(currentTime) : (msg.duration || "0:03")}
      </span>
    </div>
  );
};

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeChat, setActiveChat] = useState("Escritório Virtual");
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  useEffect(() => {
    const handleOpenChat = () => setIsOpen(true);
    window.addEventListener('open-global-chat', handleOpenChat);
    return () => window.removeEventListener('open-global-chat', handleOpenChat);
  }, []);

  // GAME LOOP & PLAYER MOVEMENT
  const playerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const playerPos = useRef({ x: 500, y: 400 }); // Posição inicial no meio do mapa
  const keys = useRef({ w: false, a: false, s: false, d: false, ArrowUp: false, ArrowLeft: false, ArrowDown: false, ArrowRight: false } as Record<string, boolean>);

  useEffect(() => {
    if (!isOpen || activeChat !== "Escritório Virtual") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (keys.current.hasOwnProperty(e.key)) keys.current[e.key] = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (keys.current.hasOwnProperty(e.key)) keys.current[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    let animationFrameId: number;
    const speed = 6; // Velocidade do personagem

    const gameLoop = () => {
      if (!mapRef.current || !playerRef.current) {
        animationFrameId = requestAnimationFrame(gameLoop);
        return;
      }
      
      const k = keys.current;
      let dx = 0;
      let dy = 0;
      
      if (k.w || k.ArrowUp) dy -= speed;
      if (k.s || k.ArrowDown) dy += speed;
      if (k.a || k.ArrowLeft) dx -= speed;
      if (k.d || k.ArrowRight) dx += speed;

      if (dx !== 0 || dy !== 0) {
        playerPos.current.x += dx;
        playerPos.current.y += dy;

        // Limites do mapa (considerando o container do mapa)
        const maxX = mapRef.current.clientWidth - 40; // largura do player
        const maxY = mapRef.current.clientHeight - 40;

        playerPos.current.x = Math.max(0, Math.min(playerPos.current.x, maxX));
        playerPos.current.y = Math.max(0, Math.min(playerPos.current.y, maxY));

        playerRef.current.style.transform = `translate(${playerPos.current.x}px, ${playerPos.current.y}px)`;
      }

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isOpen, activeChat]);

  const handleSendApproval = () => {
    const newMsg = {
      id: Date.now(),
      type: "approval",
      sender: "Você",
      initials: "VO",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
      title: "Solicitação de Compra",
      subtitle: "Caixas de Papelão | Qtd: 1000",
    };
    setMessages([...messages, newMsg]);
    setShowAttachMenu(false);
  };

  return (
    <>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-[1200px] h-[850px] max-w-[95vw] max-h-[95vh] bg-[#111315]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex overflow-hidden animate-in zoom-in-95 duration-200">
          
          {/* Full Width Main Area */}
          <div className="flex-1 flex flex-col bg-[#111111] min-w-0 relative">
            
            {activeChat === "Escritório Virtual" ? (
              // VIRTUAL OFFICE VIEW
              <div className="flex-1 flex flex-col h-full bg-[#1A1A1D] relative overflow-hidden">
                
                  {/* Gamified Map - GATHER TOWN STYLE (ENHANCED) */}
                  <div 
                    className="flex-1 overflow-auto relative p-8"
                    style={{
                      backgroundColor: '#F3E8D8',
                      backgroundImage: 'repeating-linear-gradient(90deg, #F3E8D8 0px, #F3E8D8 40px, #EADBC5 40px, #EADBC5 42px), repeating-linear-gradient(0deg, transparent 0px, transparent 40px, rgba(0,0,0,0.02) 40px, rgba(0,0,0,0.02) 42px)'
                    }}
                  >

                  {/* FLOATING HEADER (Minimalist Toggle) */}
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-white rounded-full p-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.12)] flex items-center gap-1 z-50 border border-gray-100">
                    <button className="flex items-center gap-2 px-5 py-2 bg-[#DDF0D6] text-[#0F172A] rounded-full text-sm font-bold transition-all">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                      Escritório
                    </button>
                    <button className="flex items-center gap-2 px-5 py-2 hover:bg-gray-50 text-[#64748B] hover:text-[#0F172A] rounded-full text-sm font-bold transition-all">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z"/><path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"/></svg>
                      Reuniões
                    </button>
                    <button className="flex items-center gap-2 px-5 py-2 hover:bg-gray-50 text-[#64748B] hover:text-[#0F172A] rounded-full text-sm font-bold transition-all">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                      Bate-papo
                    </button>
                  </div>

                  {/* FLOATING CLOSE BUTTON */}
                  <button onClick={() => setIsOpen(false)} className="absolute top-6 right-6 w-10 h-10 bg-white rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.12)] flex items-center justify-center text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition-all z-50 border border-gray-100">
                    <X className="h-5 w-5" />
                  </button>
                  
                  {/* NOTIFICATION TOAST (Like the image) */}
                  <div className="absolute top-20 right-6 bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.2)] p-4 flex flex-col gap-3 z-50 animate-in slide-in-from-top-4 w-[300px] border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img src="/rogerio.png" className="w-10 h-10 rounded-full object-cover" />
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      </div>
                      <div>
                        <div className="text-gray-800 font-bold text-sm">Rogério acenou pra você</div>
                        <div className="text-gray-500 text-xs">Agora mesmo</div>
                      </div>
                      <button className="ml-auto text-gray-400 hover:text-gray-600 mb-auto"><X className="w-4 h-4" /></button>
                    </div>
                    <button onClick={() => setActiveChat("Rogério")} className="w-full bg-[#3B38D0] hover:bg-[#2D2AB8] text-white font-medium py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 4v16"/><path d="M17 8h2a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-2"/><path d="M7 8H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h2"/><path d="m9 8 4-4 4 4"/></svg>
                      Ir até a mesa
                    </button>
                  </div>

                  {/* MAP CONTAINER */}
                  <div ref={mapRef} className="w-full h-full min-w-[900px] min-h-[700px] relative mt-10">
                    
                    {/* THE PLAYER (VOCÊ) */}
                    <div 
                      ref={playerRef} 
                      className="absolute z-50 flex flex-col items-center justify-center pointer-events-none"
                      style={{ width: 48, height: 48, top: 0, left: 0 }}
                    >
                      {/* Name Tag */}
                      <div className="bg-[#111] text-white text-[10px] font-bold px-2 py-0.5 rounded-full mb-1 border border-white/10 shadow-lg whitespace-nowrap flex items-center gap-1">
                        <span>🚀</span> Você
                      </div>
                      {/* Avatar Circle */}
                      <div className="w-10 h-10 bg-blue-500 rounded-full border-2 border-white shadow-[0_4px_10px_rgba(0,0,0,0.3)] flex items-center justify-center overflow-hidden">
                        <User className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    
                    {/* ROOM 1: MARKETING (Top Center) */}
                    <div 
                      className="absolute top-0 left-[200px] w-[350px] h-[260px] border-[10px] border-b-[16px] border-gray-600 border-b-gray-700 shadow-xl flex flex-col items-center justify-center"
                      style={{
                        backgroundColor: '#B5CBF2',
                        backgroundImage: 'linear-gradient(45deg, #A3BCED 25%, transparent 25%, transparent 75%, #A3BCED 75%, #A3BCED), linear-gradient(45deg, #A3BCED 25%, transparent 25%, transparent 75%, #A3BCED 75%, #A3BCED)',
                        backgroundSize: '20px 20px',
                        backgroundPosition: '0 0, 10px 10px'
                      }}
                    >
                      {/* Floating Room Label */}
                      <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-[11px] font-bold text-gray-400 shadow-sm whitespace-nowrap">
                        Equipe de Produto & Tráfego
                      </div>
                      
                      {/* Desks (Two rows) */}
                      <div className="w-[280px] h-[60px] bg-white rounded shadow-md border border-gray-300 flex items-center justify-around mb-8 relative">
                        {/* CSS Chairs */}
                        <div className="absolute -bottom-6 left-10 w-6 h-6 bg-gray-800 rounded-full border-2 border-gray-900 shadow-sm flex items-center justify-center"><div className="w-8 h-4 border-t-4 border-gray-700 rounded-t-full absolute -top-1"></div></div>
                        <div className="absolute -bottom-6 right-10 w-6 h-6 bg-gray-800 rounded-full border-2 border-gray-900 shadow-sm flex items-center justify-center"><div className="w-8 h-4 border-t-4 border-gray-700 rounded-t-full absolute -top-1"></div></div>
                        
                        {/* PCs & Plants */}
                        <div className="w-12 h-4 bg-gray-800 rounded-sm shadow-inner relative"><div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-2 bg-gray-300"></div></div>
                        <div className="w-6 h-6 bg-green-500 rounded-full border-2 border-green-700 shadow-sm"></div>
                        <div className="w-12 h-4 bg-gray-800 rounded-sm shadow-inner relative flex justify-end p-0.5"><div className="w-4 h-full bg-blue-500/50"></div><div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-2 bg-gray-300"></div></div>
                      </div>

                      {/* Character: Will Mendes */}
                      <div className="absolute top-[130px] left-[60px] flex flex-col items-center group cursor-pointer hover:scale-110 transition-transform z-20" onClick={() => setActiveChat("Will Mendes")}>
                        <div className="bg-[#111] text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg mb-1 relative flex items-center gap-1.5">
                          🎧 Will Mendes 🚀
                          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-[#111]"></div>
                        </div>
                        <div className="w-9 h-9 rounded-full border-[2px] border-[#111] shadow-md overflow-hidden bg-gray-200">
                          <img src="/assets/will.jpg" className="w-full h-full object-cover" />
                        </div>
                      </div>
                    </div>

                    {/* ROOM 2: CX TEAM (Right) */}
                    <div 
                      className="absolute top-[80px] right-[40px] w-[340px] h-[300px] border-[10px] border-b-[16px] border-gray-600 border-b-gray-700 shadow-xl"
                      style={{
                        backgroundColor: '#E2E8F0',
                        backgroundImage: 'radial-gradient(#CBD5E0 2px, transparent 2px)',
                        backgroundSize: '20px 20px'
                      }}
                    >
                      <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-[11px] font-bold text-gray-400 shadow-sm whitespace-nowrap">
                        Equipe de Atendimento (CX)
                      </div>
                      
                      {/* Desk Grid */}
                      <div className="absolute top-[80px] right-[40px] w-[240px] h-[120px] flex flex-wrap gap-1">
                        <div className="w-[115px] h-[55px] bg-white rounded shadow-sm border border-gray-300 flex flex-col items-center justify-end pb-2 relative">
                           <div className="w-10 h-3 bg-blue-900 rounded-sm shadow-inner relative"></div>
                           <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-6 h-6 bg-gray-800 rounded-full border-2 border-gray-900 flex items-center justify-center rotate-180"><div className="w-8 h-4 border-t-4 border-gray-700 rounded-t-full absolute -top-1"></div></div>
                        </div>
                        <div className="w-[115px] h-[55px] bg-white rounded shadow-sm border border-gray-300 flex flex-col items-center justify-end pb-2 relative">
                           <div className="w-10 h-3 bg-gray-800 rounded-sm shadow-inner relative"></div>
                        </div>
                        <div className="w-[115px] h-[55px] bg-white rounded shadow-sm border border-gray-300 flex flex-col items-center pt-2 relative">
                           <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-6 h-6 bg-gray-800 rounded-full border-2 border-gray-900 flex items-center justify-center"><div className="w-8 h-4 border-t-4 border-gray-700 rounded-t-full absolute -top-1"></div></div>
                           <div className="w-10 h-3 bg-gray-800 rounded-sm shadow-inner relative"></div>
                        </div>
                        <div className="w-[115px] h-[55px] bg-white rounded shadow-sm border border-gray-300 flex flex-col items-center pt-2 relative">
                           <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-6 h-6 bg-gray-800 rounded-full border-2 border-gray-900 flex items-center justify-center"><div className="w-8 h-4 border-t-4 border-gray-700 rounded-t-full absolute -top-1"></div></div>
                           <div className="w-10 h-3 bg-gray-800 rounded-sm shadow-inner relative"><div className="absolute inset-0 bg-green-500/20 animate-pulse"></div></div>
                        </div>
                      </div>

                      {/* Character: Alyson */}
                      <div className="absolute top-[160px] right-[180px] flex flex-col items-center group cursor-pointer hover:scale-110 transition-transform z-20" onClick={() => setActiveChat("Alyson")}>
                        <div className="bg-[#111] text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg mb-1 relative flex items-center gap-1.5">
                          💬 Alyson 🍕
                          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-[#111]"></div>
                        </div>
                        <div className="w-9 h-9 rounded-full border-[2px] border-[#111] shadow-md overflow-hidden bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
                          AL
                        </div>
                      </div>

                      {/* Character: IA Copiloto */}
                      <div className="absolute top-[160px] right-[60px] flex flex-col items-center group cursor-pointer hover:scale-110 transition-transform z-20">
                        <div className="bg-[#111] text-green-400 text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg mb-1 relative flex items-center gap-1.5 border border-green-500/30">
                          ⚡ IA Copiloto 🤖
                          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-[#111]"></div>
                        </div>
                        <div className="w-9 h-9 rounded-full border-[2px] border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.4)] bg-[#111] flex items-center justify-center">
                          <Sparkles className="w-4 h-4 text-green-400" />
                        </div>
                      </div>
                    </div>

                    {/* LOUNGE AREA (Left Center) */}
                    <div className="absolute top-[320px] left-[50px] w-[280px] h-[180px] bg-[#90CDF4] border-4 border-[#63B3ED] rounded-xl flex items-center justify-center relative shadow-inner">
                      {/* Sofas */}
                      <div className="absolute top-8 left-1/2 -translate-x-1/2 w-[100px] h-[35px] bg-[#F6AD55] border-2 border-[#DD6B20] rounded-lg shadow-md"></div>
                      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[100px] h-[35px] bg-[#F6AD55] border-2 border-[#DD6B20] rounded-lg shadow-md"></div>
                      {/* Coffee Table */}
                      <div className="w-[60px] h-[40px] bg-[#4A5568] border-2 border-[#2D3748] rounded shadow-xl flex items-center justify-center gap-2">
                        <div className="w-4 h-5 bg-white/80 rounded-sm"></div> {/* Laptop */}
                        <div className="w-2 h-2 bg-white rounded-full"></div> {/* Cup */}
                      </div>
                      {/* Plants */}
                      <div className="absolute top-4 left-4 w-12 h-12 bg-[#38A169] rounded-full border-4 border-[#276749] flex items-center justify-center shadow-lg"><div className="w-6 h-6 bg-[#48BB78] rounded-full"></div></div>
                      <div className="absolute bottom-4 right-4 w-10 h-10 bg-[#38A169] rounded-full border-4 border-[#276749] flex items-center justify-center shadow-lg"><div className="w-4 h-4 bg-[#48BB78] rounded-full"></div></div>
                    </div>

                    {/* ROOM 3: OPERAÇÃO / LOGÍSTICA (Bottom) */}
                    <div className="absolute bottom-[20px] left-[350px] w-[450px] h-[220px] border-[10px] border-b-[16px] border-gray-600 border-b-gray-700 shadow-xl bg-[#CBD5E0]">
                      <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-[11px] font-bold text-gray-400 shadow-sm whitespace-nowrap">
                        Operação (Curva A)
                      </div>
                      
                      {/* Warehouse Shelves */}
                      <div className="absolute top-8 left-8 w-20 h-36 bg-[#8B5A2B] rounded border-4 border-[#5C3A21] grid grid-cols-1 grid-rows-3 gap-1 p-1.5 shadow-xl">
                        <div className="bg-[#D69E2E] rounded-sm"></div>
                        <div className="bg-[#D69E2E] rounded-sm"></div>
                        <div className="bg-[#D69E2E] rounded-sm"></div>
                      </div>
                      
                      <div className="absolute top-8 left-36 w-20 h-36 bg-[#8B5A2B] rounded border-4 border-[#5C3A21] grid grid-cols-1 grid-rows-3 gap-1 p-1.5 shadow-xl">
                        <div className="bg-[#D69E2E] rounded-sm"></div>
                        <div className="bg-[#D69E2E] rounded-sm flex items-center justify-center"><div className="w-4 h-1 bg-white/50"></div></div>
                        <div className="bg-[#B7791F] rounded-sm"></div>
                      </div>

                      {/* Packing Table */}
                      <div className="absolute bottom-8 right-[60px] w-[160px] h-[60px] bg-[#E2E8F0] border-4 border-[#A0AEC0] rounded-sm shadow-xl flex items-center justify-center gap-6">
                        <div className="w-10 h-10 bg-[#ED8936] border-2 border-[#C05621] shadow-inner relative flex items-center justify-center">
                          <div className="w-full h-1 bg-[#C05621]/50 absolute"></div>
                        </div> 
                        <div className="w-8 h-10 bg-white/80 border border-gray-300 shadow-sm flex flex-col justify-end p-1"><div className="w-full h-4 bg-gray-200"></div></div> 
                      </div>

                      {/* Character: Rogério */}
                      <div className="absolute bottom-[40px] right-[100px] flex flex-col items-center group cursor-pointer hover:scale-110 transition-transform z-20" onClick={() => setActiveChat("Rogério")}>
                        <div className="bg-[#111] text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg mb-1 relative flex items-center gap-1.5">
                          📦 Despachando ML
                          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-[#111]"></div>
                        </div>
                        <div className="w-9 h-9 rounded-full border-[2px] border-[#111] shadow-md overflow-hidden bg-gray-200">
                          <img src="/rogerio.png" className="w-full h-full object-cover" />
                        </div>
                      </div>
                    </div>

                    {/* Random Plants in Hallway */}
                    <div className="absolute top-[50px] left-[600px] w-10 h-10 bg-[#38A169] rounded-full border-4 border-[#276749] shadow-lg flex items-center justify-center"><div className="w-4 h-4 bg-[#48BB78] rounded-full"></div></div>
                    <div className="absolute bottom-[100px] right-[500px] w-14 h-14 bg-[#38A169] rounded-full border-4 border-[#276749] shadow-lg flex items-center justify-center"><div className="w-6 h-6 bg-[#48BB78] rounded-full"></div></div>

                  </div>
                </div>

              </div>
            ) : (
              // NORMAL CHAT VIEW
              <>
                {/* Header Aesthetic */}
                <div className="h-[72px] px-6 border-b border-white/5 flex items-center justify-between bg-[#111111] shrink-0 z-10">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setActiveChat("Escritório Virtual")}
                      className="mr-2 text-gray-400 hover:text-white transition-colors flex items-center gap-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                    </button>
                    <div className="h-10 w-10 bg-[#222] rounded-full flex items-center justify-center text-white font-medium overflow-hidden">
                      {activeChat === "Central" ? <Hash className="w-5 h-5 text-gray-400" /> : (
                        <img src={DIRECT_MESSAGES.find(u => u.name === activeChat)?.image || `https://ui-avatars.com/api/?name=${activeChat}&background=random`} alt={activeChat} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <h3 className="text-white text-[15px] font-medium leading-none mb-1">{activeChat}</h3>
                      <span className="text-[11px] text-gray-500 font-medium">Online</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <button className="text-gray-400 hover:text-white transition-colors">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                    <button onClick={() => setIsOpen(false)} className="md:hidden text-gray-400 hover:text-red-400 transition-colors">
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 custom-scrollbar bg-[#111111]">
                  <div className="flex justify-center mb-6">
                    <span className="text-[10px] font-medium text-gray-500 bg-[#222] px-3 py-1 rounded-full">Hoje</span>
                  </div>
                  
                  {messages.map(msg => (
                    <div key={msg.id} className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
                      <div className={`flex items-end gap-2 max-w-[75%] ${msg.isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                        
                        <div className="flex flex-col gap-1 relative group">
                          {!msg.isMe && <span className="text-[11px] text-gray-500 ml-3 mb-1">{msg.sender}</span>}
                          
                          {msg.type === "audio" ? (
                            <AudioBubble msg={msg} />
                          ) : msg.type === "approval" ? (
                            <div className="bg-[#222] border border-white/5 p-4 rounded-3xl rounded-tl-sm w-64 shadow-md">
                              <div className="flex items-center gap-2 mb-3">
                                <span className="text-xl">{msg.initials}</span>
                                <span className="font-bold text-white text-sm">Aprovação Necessária</span>
                              </div>
                              <h4 className="text-white font-bold text-sm">{msg.title}</h4>
                              <p className="text-xs text-gray-400 mt-1 mb-4">{msg.subtitle}</p>
                              <div className="flex gap-2">
                                <button className="flex-1 bg-white text-black font-bold text-xs py-2 rounded-xl hover:bg-gray-200 transition-colors">Aprovar</button>
                                <button className="flex-1 bg-[#333] text-white font-bold text-xs py-2 rounded-xl hover:bg-[#444] transition-colors">Recusar</button>
                              </div>
                            </div>
                          ) : (
                            <div className={`px-4 py-2.5 rounded-3xl text-[15px] leading-relaxed relative ${
                              msg.isMe 
                                ? 'bg-[#333333] text-white rounded-br-sm' 
                                : 'bg-[#555555] text-white rounded-tl-sm'
                            }`}>
                              {msg.type === "image" && (
                                <div className="mb-2 -mx-2 -mt-1 rounded-2xl overflow-hidden">
                                  <img src={msg.image} alt="Anexo" className="max-w-full h-auto max-h-48 object-cover hover:scale-105 transition-transform" />
                                </div>
                              )}
                              <div className="flex flex-wrap items-end gap-3">
                                <span>{msg.text}</span>
                                <span className="text-[10px] text-white/50 self-end mb-[2px] -mr-1">{msg.time}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input Aesthetic */}
                <div className="p-4 bg-[#111111] shrink-0 relative">
                  {showAttachMenu && (
                    <div className="absolute bottom-20 left-4 bg-[#222] border border-white/5 rounded-2xl p-2 shadow-2xl flex gap-2 animate-in fade-in slide-in-from-bottom-2 z-10">
                      <button className="flex flex-col items-center gap-1 p-3 hover:bg-white/5 rounded-xl text-gray-400 hover:text-white transition-colors w-20">
                        <Package className="h-5 w-5 text-gray-300" />
                        <span className="text-[10px] font-medium mt-1">SKU</span>
                      </button>
                      <button className="flex flex-col items-center gap-1 p-3 hover:bg-white/5 rounded-xl text-gray-400 hover:text-white transition-colors w-20">
                        <FileText className="h-5 w-5 text-gray-300" />
                        <span className="text-[10px] font-medium mt-1">Playbook</span>
                      </button>
                      <button onClick={handleSendApproval} className="flex flex-col items-center gap-1 p-3 hover:bg-white/5 rounded-xl text-gray-400 hover:text-white transition-colors w-20">
                        <CheckCircle2 className="h-5 w-5 text-gray-300" />
                        <span className="text-[10px] font-medium mt-1 text-center leading-tight">Aprovação</span>
                      </button>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 bg-[#222] rounded-full border border-transparent focus-within:border-white/10 px-2 py-1 transition-all shadow-sm">
                    <button 
                      onClick={() => setShowAttachMenu(!showAttachMenu)}
                      className={`p-2 rounded-full transition-colors ${showAttachMenu ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                    >
                      <Paperclip className="h-5 w-5" />
                    </button>
                    
                    <input 
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Message..."
                      className="flex-1 bg-transparent border-none focus:outline-none text-white text-[15px] placeholder-gray-500 px-2 h-10"
                    />
                    
                    {message.trim() ? (
                      <button className="p-2 text-white hover:bg-white/10 rounded-full transition-colors mr-1">
                        <Send className="h-5 w-5" />
                      </button>
                    ) : (
                      <button 
                        className={`p-2 rounded-full transition-colors mr-1 ${isRecording ? 'bg-red-500/20 text-red-400 animate-pulse' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
                        onClick={() => setIsRecording(!isRecording)}
                      >
                        <Mic className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        </div>
      )}
    </>
  );
}
