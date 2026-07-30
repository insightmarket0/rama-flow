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
  CheckCircle2
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
  const [activeChat, setActiveChat] = useState("Central");
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);

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
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-10 right-10 h-14 w-14 bg-[#00FF00] text-black rounded-full shadow-[0_0_20px_rgba(0,255,0,0.3)] hover:shadow-[0_0_30px_rgba(0,255,0,0.5)] flex items-center justify-center transition-all hover:scale-110 z-[100] animate-in zoom-in duration-300"
        >
          <MessageCircle className="h-6 w-6" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-[#111315]">
            8
          </span>
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-10 right-10 w-[800px] h-[600px] max-w-[calc(100vw-4rem)] max-h-[calc(100vh-4rem)] bg-[#111315]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex overflow-hidden z-[100] animate-in slide-in-from-bottom-8 duration-300">
          
          {/* Sidebar */}
          <div className="w-64 bg-[#1A1D21]/50 border-r border-white/5 flex flex-col hidden sm:flex shrink-0">
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-white text-lg font-light tracking-tight">Comuni<span className="font-bold">cação</span></h3>
              <button onClick={() => setIsOpen(false)} className="md:hidden text-gray-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-3 custom-scrollbar space-y-6">
              <div>
                <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 px-2">Canais</h4>
                <div className="space-y-1">
                  {CHANNELS.map(c => (
                    <button 
                      key={c.id} 
                      onClick={() => setActiveChat(c.name)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-r-xl transition-all group ${activeChat === c.name ? 'bg-gradient-to-r from-[#00FF00]/10 to-transparent border-l-2 border-[#00FF00] text-white shadow-[inset_0_0_20px_rgba(0,255,0,0.02)]' : 'hover:bg-white/5 text-gray-400 hover:text-gray-200 border-l-2 border-transparent'}`}
                    >
                      <span className="flex items-center gap-2 text-sm">
                        <c.icon className={`h-3.5 w-3.5 ${c.alert ? 'text-red-400' : activeChat === c.name ? 'text-[#00FF00]' : 'opacity-50'}`} />
                        {c.name}
                      </span>
                      {c.unread > 0 && <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${c.alert ? 'bg-red-500/20 text-red-400' : 'bg-[#00FF00]/20 text-[#00FF00]'}`}>{c.unread}</span>}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 px-2">Equipe</h4>
                <div className="space-y-1">
                  {DIRECT_MESSAGES.map(u => (
                    <button 
                      key={u.id}
                      onClick={() => setActiveChat(u.name)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-r-xl transition-all ${activeChat === u.name ? 'bg-gradient-to-r from-[#00FF00]/10 to-transparent border-l-2 border-[#00FF00] text-white shadow-[inset_0_0_20px_rgba(0,255,0,0.02)]' : 'hover:bg-white/5 text-gray-400 border-l-2 border-transparent'}`}
                    >
                      <span className="flex items-center gap-2 text-sm">
                        <div className="relative">
                           {u.image ? (
                             <img src={u.image} alt={u.name} className="w-5 h-5 rounded-full object-cover" />
                           ) : (
                             <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold">{u.name.substring(0,2).toUpperCase()}</div>
                           )}
                          {u.online && <div className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 bg-green-500 rounded-full border border-[#1A1D21]" />}
                        </div>
                        {u.name}
                      </span>
                      {u.unread > 0 && <span className="bg-[#00FF00]/20 text-[#00FF00] text-[10px] font-bold px-1.5 py-0.5 rounded">{u.unread}</span>}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col bg-[#0A0B0C] min-w-0">
            <div className="h-16 px-6 border-b border-white/5 flex items-center justify-between bg-[#111315]/50 shrink-0">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-[#00FF00]/10 rounded-full flex items-center justify-center text-[#00FF00] font-bold border border-[#00FF00]/20">
                  {activeChat.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-white font-bold leading-none">{activeChat}</h3>
                  <span className="text-[10px] text-green-400 font-medium">Ativo agora</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="h-8 w-8 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                  <MoreVertical className="h-4 w-4" />
                </button>
                <button onClick={() => setIsOpen(false)} className="h-8 w-8 rounded-full flex items-center justify-center text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 custom-scrollbar">
              <div className="flex justify-center mb-6">
                <span className="text-[10px] font-medium text-gray-500 bg-white/5 px-3 py-1 rounded-full">Hoje</span>
              </div>
              
              {messages.map(msg => (
                <div key={msg.id} className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
                  <div className={`flex items-end gap-2 max-w-[85%] ${msg.isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                    {!msg.isMe && (
                      <div className="h-7 w-7 shrink-0 rounded-full overflow-hidden mb-1 border border-white/10 bg-[#1A1D21] flex items-center justify-center">
                        {msg.userImage ? (
                          <img src={msg.userImage} alt={msg.sender} className="h-full w-full object-cover" />
                        ) : (
                          <span className="text-[10px] font-bold text-gray-400">{msg.sender.substring(0,2).toUpperCase()}</span>
                        )}
                      </div>
                    )}
                    
                    <div className="flex flex-col gap-1">
                      {!msg.isMe && <span className="text-[10px] text-gray-500 ml-1">{msg.sender}</span>}
                      
                      {msg.type === "audio" ? (
                        <AudioBubble msg={msg} />
                      ) : msg.type === "approval" ? (
                        <div className="bg-[#1A1D21] border border-white/5 p-4 rounded-2xl rounded-tl-sm w-64 shadow-md">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-xl">{msg.initials}</span>
                            <span className="font-bold text-white text-sm">Aprovação Necessária</span>
                          </div>
                          <h4 className="text-[#00FF00] font-bold text-sm">{msg.title}</h4>
                          <p className="text-xs text-gray-400 mt-1 mb-4">{msg.subtitle}</p>
                          <div className="flex gap-2">
                            <button className="flex-1 bg-[#00FF00] text-black font-bold text-xs py-2 rounded-lg hover:bg-[#00FF00]/80">Aprovar</button>
                            <button className="flex-1 bg-white/5 text-white font-bold text-xs py-2 rounded-lg hover:bg-white/10">Recusar</button>
                          </div>
                        </div>
                      ) : (
                        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed max-w-[400px] ${msg.isMe ? 'bg-[#00FF00]/10 border border-[#00FF00]/20 text-[#00FF00] rounded-br-sm shadow-[inset_0_0_10px_rgba(0,255,0,0.05)]' : 'bg-white/5 backdrop-blur-md text-gray-200 border border-white/5 rounded-tl-sm shadow-sm'}`}>
                          {msg.type === "image" && (
                            <div className="mb-2 rounded-lg overflow-hidden border border-black/10">
                              <img src={msg.image} alt="Anexo" className="max-w-full h-auto max-h-48 object-cover hover:scale-105 transition-transform" />
                            </div>
                          )}
                          {msg.text}
                        </div>
                      )}
                    </div>
                  </div>
                  <span className={`text-[10px] text-gray-500 mt-1 ${msg.isMe ? 'mr-1' : 'ml-10'}`}>{msg.time}</span>
                </div>
              ))}
            </div>

            <div className="p-4 bg-[#111315]/50 border-t border-white/5 shrink-0 relative">
              {showAttachMenu && (
                <div className="absolute bottom-20 left-4 bg-[#1A1D21] border border-white/10 rounded-xl p-2 shadow-xl flex gap-2 animate-in fade-in slide-in-from-bottom-2 z-10">
                  <button className="flex flex-col items-center gap-1 p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors w-20">
                    <Package className="h-5 w-5 text-orange-400" />
                    <span className="text-[10px] font-bold mt-1">SKU</span>
                  </button>
                  <button className="flex flex-col items-center gap-1 p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors w-20">
                    <FileText className="h-5 w-5 text-blue-400" />
                    <span className="text-[10px] font-bold mt-1">Playbook</span>
                  </button>
                  <button onClick={handleSendApproval} className="flex flex-col items-center gap-1 p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-[#00FF00] transition-colors w-20">
                    <CheckCircle2 className="h-5 w-5 text-[#00FF00]" />
                    <span className="text-[10px] font-bold mt-1 text-center leading-tight">Pedir Aprovação</span>
                  </button>
                </div>
              )}
              
              <div className="flex items-end gap-2 bg-[#0A0B0C]/60 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 focus-within:border-[#00FF00]/40 focus-within:bg-[#050505]/80 transition-all shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]">
                <button 
                  onClick={() => setShowAttachMenu(!showAttachMenu)}
                  className={`p-2.5 rounded-lg transition-colors ${showAttachMenu ? 'bg-[#00FF00]/20 text-[#00FF00]' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                  <Paperclip className="h-5 w-5" />
                </button>
                
                <textarea 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Mensagem..."
                  className="flex-1 bg-transparent border-none focus:outline-none text-white text-sm resize-none py-3 px-2 max-h-32 min-h-[44px]"
                  rows={1}
                />
                
                {message.trim() ? (
                  <button className="p-2.5 bg-[#00FF00] text-black rounded-lg hover:bg-[#00FF00]/90 transition-colors shadow-lg">
                    <Send className="h-5 w-5" />
                  </button>
                ) : (
                  <button 
                    className={`p-2.5 rounded-lg transition-colors shadow-inner flex items-center gap-2 ${isRecording ? 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'}`}
                    onClick={() => setIsRecording(!isRecording)}
                  >
                    <Mic className="h-5 w-5" />
                    {isRecording && <span className="text-xs font-bold mr-1">Gravando...</span>}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
