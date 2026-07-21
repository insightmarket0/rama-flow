import React, { useState } from "react";
import { 
  Mic, 
  Paperclip, 
  Send,
  MoreHorizontal,
  Search,
  Pin,
  AtSign,
  Smile,
  Headphones,
  Calendar,
  X,
  Menu,
  MessageSquare,
  Plus,
  Briefcase,
  Users,
  Archive,
  LogOut,
  Folder,
  Image as ImageIcon,
  Video,
  FileText,
  Music,
  Link,
  ChevronDown,
  Phone,
  Video as VideoIcon,
  Reply,
  Copy,
  CheckCircle2,
  ArrowLeft,
  Play,
  Pause,
  Trash2
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";

const CHAT_LIST = [
  { id: "c1", name: "Marketplace", time: "", text: "Nova conversa...", unread: 0, pinned: false, avatar: "MK", color: "bg-[#00FF00]/20 text-[#00FF00]" },
  { id: "c2", name: "Rogério", time: "", text: "Nova conversa...", unread: 0, pinned: false, avatar: "RO", color: "bg-blue-500/20 text-blue-500" },
  { id: "c3", name: "Will Mendes", time: "", text: "Nova conversa...", unread: 0, pinned: false, avatar: "WM", image: "/assets/will.jpg", color: "bg-green-500/20 text-green-500" },
  { id: "c4", name: "Alyson", time: "", text: "Nova conversa...", unread: 0, pinned: false, avatar: "AL", color: "bg-purple-500/20 text-purple-500" }
];

const MOCK_MESSAGES = [
  { 
    id: 1, 
    sender: "Alyson", 
    time: "09:20", 
    text: "Adicionei as novas fotos da divergência do pedido 1540. O cliente do Mercado Livre abriu reclamação.", 
    initials: "AL",
    color: "bg-purple-500/20 text-purple-500",
    reactions: [{ emoji: "👍", count: 2 }]
  },
  { 
    id: 2, 
    sender: "Rogério", 
    time: "09:24", 
    text: "Pessoal! O flex do Mercado Livre acabou de chegar pra coleta.", 
    initials: "RO",
    color: "bg-blue-500/20 text-blue-500",
    views: 4
  },
  { 
    id: 3, 
    sender: "Will Mendes", 
    time: "09:30",
    type: "image",
    image: "https://images.unsplash.com/photo-1586528116311-ad8c738759be?auto=format&fit=crop&w=800&q=80",
    text: "Olha o estado que a transportadora da Shopee deixou.",
    initials: "WM",
    userImage: "/assets/will.jpg",
    color: "bg-green-500/20 text-green-500",
    reactions: [{ emoji: "😲", count: 1 }, { emoji: "🤦‍♂️", count: 2 }],
    views: 4
  },
  { 
    id: 4, 
    sender: "Anderson", 
    time: "09:35", 
    text: "Pode deixar, vou reportar isso no painel de divergências agora mesmo e pedir o reembolso pelo portal deles.", 
    isMe: true,
    views: 4
  },
  {
    id: 6,
    type: "audio",
    sender: "Rogério",
    time: "09:40",
    initials: "RO",
    color: "bg-blue-500/20 text-blue-500",
    duration: "0:15",
    views: 4
  },
  {
    id: 7,
    type: "approval",
    sender: "Workflow Bot",
    time: "11:21",
    initials: "🤖",
    color: "bg-orange-500/10 border border-orange-500/20 text-xl",
    title: "Orçamento de Campanha",
    subtitle: "Valor solicitado: R$ 5.000,00 | Plataforma: Meta Ads",
    status: "PENDENTE",
  }
];

const MEMBERS = [
  { name: "Anderson (Você)", role: "admin", initials: "AN", color: "bg-gray-500/20 text-gray-400" },
  { name: "Rogério", role: "admin", initials: "RO", color: "bg-blue-500/20 text-blue-500" },
  { name: "Will Mendes", role: "", initials: "WM", color: "bg-green-500/20 text-green-500" },
  { name: "Alyson", role: "", initials: "AL", color: "bg-purple-500/20 text-purple-500" },
];

const AudioBubble = ({ msg }: { msg: any }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  
  return (
    <div className="bg-[#1a1a1a] border border-white/5 rounded-xl rounded-tl-sm px-4 py-3 flex items-center gap-4 shadow-md w-64">
      <button 
        onClick={() => setIsPlaying(!isPlaying)}
        className="w-10 h-10 rounded-full bg-[#111] border border-[#00FF00]/30 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(0,255,0,0.1)] hover:border-[#00FF00]/60 transition-colors">
        {isPlaying ? (
          <Pause className="w-4 h-4 text-[#00FF00] fill-[#00FF00]" />
        ) : (
          <Play className="w-4 h-4 text-[#00FF00] ml-0.5 fill-[#00FF00]" />
        )}
      </button>
      <div className="flex-1 flex items-center gap-1">
        {[1, 2, 3, 2, 4, 5, 3, 2, 1, 3, 4, 2].map((h, i) => (
          <div 
            key={i} 
            className={`w-1 rounded-full transition-all duration-300 ${isPlaying ? 'bg-[#00FF00] animate-pulse' : 'bg-[#00FF00]/50'}`} 
            style={{ 
              height: `${isPlaying ? (Math.random() * 4 + 2) * 4 : h * 4}px`,
              animationDelay: isPlaying ? `${i * 100}ms` : '0ms'
            }} 
          />
        ))}
      </div>
      <span className="text-[11px] font-bold text-gray-500">{msg.duration}</span>
    </div>
  );
};

export default function ChatPage() {
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [topicReply, setTopicReply] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [activeChatId, setActiveChatId] = useState("c1");
  const [chatMessages, setChatMessages] = useState<Record<string, any[]>>({});

  const handleSendMessage = () => {
    if (!message.trim() && !isRecording) return;
    
    const newMessage = {
      id: Date.now(),
      sender: "Anderson (Você)",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: isRecording ? "" : message,
      type: isRecording ? "audio" : "text",
      duration: isRecording ? "0:03" : undefined,
      isMe: true,
      initials: "AN"
    };

    setChatMessages(prev => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] || []), newMessage]
    }));
    setMessage("");
    setIsRecording(false);
  };

  const totalMessages = Object.values(chatMessages).reduce((acc, msgs) => acc + msgs.length, 0);

  return (
    <div className="flex h-[calc(100vh-48px)] w-full bg-[#050505] rounded-[2rem] overflow-hidden shadow-2xl animate-in fade-in duration-500 font-sans border border-white/10">
      
      {/* 1. Slim Sidebar (Leftmost) */}
      <div className="w-[84px] bg-[#0a0a0a] flex flex-col items-center py-6 border-r border-[#1a1a1a] shrink-0 z-20">
        
        <div className="w-12 h-12 flex items-center justify-center mb-8 hover-scale cursor-pointer">
          <img src="/assets/logo.png" alt="RAMA Logo" className="w-10 h-10 object-contain drop-shadow-md" />
        </div>

        <div className="flex flex-col gap-4 flex-1 w-full">
          <SidebarIcon id="all" icon={<MessageSquare className="w-5 h-5" />} label="Todos" badge={totalMessages > 0 ? totalMessages : undefined} active={activeTab === 'all'} onClick={() => setActiveTab('all')} />
        </div>

        <div className="flex flex-col gap-4 w-full">
          <SidebarIcon id="profile" icon={<div className="w-7 h-7 rounded-full bg-gray-500/20 text-gray-400 font-bold flex items-center justify-center text-[10px] overflow-hidden">AN</div>} label="Perfil" active={false} onClick={() => {}} />
        </div>
      </div>

      {/* 2. Chat List Sidebar */}
      <div className="w-[320px] bg-[#121212] flex flex-col border-r border-[#1a1a1a] shrink-0 z-10">
        <div className="px-4 py-4">
          <div className="relative group mb-2">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 z-10" />
            <input 
              type="text" 
              placeholder="Pesquisar..." 
              className="w-full bg-[#1a1a1a] border border-white/5 rounded-xl pl-10 pr-4 py-2 text-[13px] text-gray-200 placeholder:text-gray-500 focus:outline-none focus:border-[#00FF00]/50 transition-colors shadow-inner"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar px-3 pb-6">
          <div className="space-y-1">
            {CHAT_LIST.map((chat) => {
              const chatMsgs = chatMessages[chat.id] || [];
              const lastMsg = chatMsgs.length > 0 ? chatMsgs[chatMsgs.length - 1] : null;
              
              const displayText = lastMsg 
                ? (lastMsg.type === "audio" ? "🎵 Áudio" : `${lastMsg.isMe ? 'Você: ' : ''}${lastMsg.text}`)
                : chat.text;
                
              const displayTime = lastMsg ? lastMsg.time : chat.time;

              return (
              <div 
                key={chat.id} 
                onClick={() => setActiveChatId(chat.id)}
                className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all ${chat.id === activeChatId ? 'bg-gradient-to-r from-[#00FF00]/10 to-transparent border-l-2 border-l-[#00FF00] border-y-transparent border-r-transparent shadow-[inset_0_0_20px_rgba(0,255,0,0.02)]' : 'hover:bg-[#1a1a1a] border-l-2 border-transparent'}`}
              >
                <div className="relative shrink-0">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 text-[14px] font-bold shadow-inner ${chat.color}`}>
                    {chat.image ? (
                      <img src={chat.image} alt={chat.name} className="w-full h-full object-cover rounded-2xl" />
                    ) : chat.avatar}
                  </div>
                  {chat.unread > 0 && chat.id === activeChatId && (
                    <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-orange-500 rounded-full border-2 border-[#1e1e1e]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h4 className="text-gray-200 font-bold text-[14px] truncate pr-2">{chat.name}</h4>
                    <span className="text-[10px] text-gray-500 font-medium shrink-0">{displayTime}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className={`text-[12px] truncate pr-2 ${chat.id === activeChatId ? 'text-[#00FF00] font-medium' : 'text-gray-500'}`}>
                      {displayText}
                    </p>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {chat.unread > 0 && (
                        <span className="bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                          {chat.unread}
                        </span>
                      )}
                      {chat.pinned && (
                        <Pin className="w-3 h-3 text-blue-500 fill-blue-500" />
                      )}
                      {chat.read && (
                        <span className="text-blue-500 font-bold text-[10px]">✓✓</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Main Chat Area */}
      <div className="flex-1 flex flex-col bg-[#0a0a0a] min-w-0 relative overflow-hidden">
        {/* Glow Orb Base */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00FF00]/5 rounded-full blur-[120px] pointer-events-none" />
        
        {/* Header */}
        <div className="h-16 px-6 flex items-center justify-between shrink-0 z-10 bg-transparent pt-4">
          <div>
            <h2 className="text-lg font-bold text-gray-100 tracking-tight">
              {CHAT_LIST.find(c => c.id === activeChatId)?.name || "Chat"}
            </h2>
          </div>
          <div className="flex items-center gap-1.5">
            <button className="w-8 h-8 rounded-lg bg-transparent hover:bg-white/10 border border-transparent hover:border-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6 relative z-10">
          {(chatMessages[activeChatId] || []).length > 0 ? chatMessages[activeChatId].map((msg) => (
            <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'} w-full relative group/msg`}>
              {!msg.isMe && (
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-sm border border-white/10 mr-4 mt-1 shrink-0 shadow-sm ${msg.color || 'bg-gray-500/20 text-gray-500'}`}>
                  {msg.initials}
                </div>
              )}
              
              <div className={`max-w-[75%] flex flex-col ${msg.isMe ? 'items-end' : 'items-start'} relative`}>
                
                <div className={`absolute top-6 ${msg.isMe ? '-left-20' : '-right-20'} opacity-0 group-hover/msg:opacity-100 transition-opacity flex items-center gap-1 z-20`}>
                  <div className="bg-[#1a1a1a] border border-white/10 rounded-lg shadow-xl p-1 flex items-center gap-1">
                    <button className="p-1.5 text-gray-400 hover:text-[#00FF00] rounded hover:bg-white/5 transition-colors" title="Responder em Tópico">
                      <MessageSquare className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-1.5 text-gray-400 hover:text-[#00FF00] rounded hover:bg-white/5 transition-colors" title="Transformar em Chamado">
                      <Briefcase className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {!msg.isMe && (
                  <span className="text-[12px] font-bold text-gray-400 mb-1 ml-1">{msg.sender}</span>
                )}
                
                {/* Bubble Text */}
                {msg.text && !msg.type && (
                  <div className={`px-5 py-3 rounded-xl text-[14px] leading-relaxed shadow-md ${
                    msg.isMe 
                      ? 'bg-emerald-900/30 border border-emerald-500/20 text-emerald-50 font-medium rounded-tr-sm' 
                      : 'bg-[#1a1a1a] text-gray-300 border border-white/5 rounded-tl-sm'
                  }`}>
                    {msg.text.split(/(\s+)/).map((word, i) => {
                      if (word.startsWith('#') || word.startsWith('@')) {
                        return <span key={i} className="inline-block bg-[#00FF00]/10 text-[#00FF00] px-1.5 py-0.5 rounded border border-[#00FF00]/20 font-bold cursor-pointer hover:bg-[#00FF00]/20 transition-colors mx-0.5">{word}</span>;
                      }
                      return word;
                    })}
                  </div>
                )}

                {/* Bubble Image */}
                {msg.type === "image" && (
                  <div className="bg-[#1a1a1a] border border-white/5 rounded-xl rounded-tl-sm overflow-hidden shadow-md">
                    <img src={msg.image} alt="Evidência" className="w-full max-w-sm h-48 object-cover" />
                    {msg.text && (
                      <div className="p-3 text-[13px] text-gray-300">
                        {msg.text.split(/(\s+)/).map((word, i) => {
                          if (word.startsWith('#') || word.startsWith('@')) {
                            return <span key={i} className="inline-block bg-[#00FF00]/10 text-[#00FF00] px-1.5 py-0.5 rounded border border-[#00FF00]/20 font-bold cursor-pointer hover:bg-[#00FF00]/20 transition-colors mx-0.5">{word}</span>;
                          }
                          return word;
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Bubble Audio */}
                {msg.type === "audio" && (
                  <AudioBubble msg={msg} />
                )}

                {/* Bubble Approval */}
                {msg.type === "approval" && (
                  <div className="bg-[#1a1a1a] border border-white/10 rounded-xl rounded-tl-sm p-5 flex flex-col gap-4 shadow-md w-[400px]">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[16px] font-bold text-white tracking-tight">{msg.title}</h4>
                      <span className="text-[10px] font-bold tracking-widest text-gray-400 bg-white/5 border border-white/10 px-2.5 py-1 rounded-md">{msg.status}</span>
                    </div>
                    <p className="text-[14px] text-blue-400 font-medium">{msg.subtitle}</p>
                    
                    <div className="flex gap-3 mt-2">
                      <button className="flex-1 flex items-center justify-center gap-2 bg-transparent border border-white/10 hover:border-[#00FF00]/50 hover:bg-[#00FF00]/5 text-white font-bold py-2.5 rounded-xl transition-all shadow-sm">
                        <CheckCircle2 className="w-4 h-4 text-[#00FF00]" />
                        Aprovar
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-2 bg-transparent border border-white/10 hover:border-red-500/50 hover:bg-red-500/5 text-white font-bold py-2.5 rounded-xl transition-all shadow-sm">
                        <X className="w-4 h-4 text-red-500" />
                        Recusar
                      </button>
                    </div>
                  </div>
                )}

                {/* Meta / Reactions */}
                <div className={`flex items-center gap-2 mt-1.5 ${msg.isMe ? 'flex-row-reverse' : ''}`}>
                  {msg.reactions && (
                    <div className="flex items-center gap-1.5">
                      {msg.reactions.map((r, i) => (
                        <div key={i} className="bg-[#1e1e1e] border border-white/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <span className="text-[12px]">{r.emoji}</span>
                          <span className="text-[10px] font-bold text-gray-400">{r.count}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {msg.views && (
                    <span className="text-[10px] font-medium text-gray-600 flex items-center gap-1">
                      {msg.time}
                    </span>
                  )}
                </div>
              </div>

              {msg.isMe && (
                <div className="w-10 h-10 rounded-2xl bg-gray-500/20 border border-white/10 flex items-center justify-center ml-4 mt-1 shrink-0 overflow-hidden shadow-sm text-gray-400 font-extrabold text-sm">
                  AN
                </div>
              )}
            </div>
          )) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4 pt-20">
              <MessageSquare className="w-12 h-12 text-gray-600/50" />
              <p className="text-sm font-medium">Você ainda não tem mensagens aqui.</p>
              <p className="text-xs text-gray-600">Envie um 'Oi' para começar.</p>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-6 pt-0 bg-transparent shrink-0 relative z-10">
          <div className="bg-black/50 backdrop-blur-md rounded-2xl shadow-[0_0_30px_rgba(0,255,0,0.03)] border border-white/10 flex items-center p-2 pr-2.5 transition-all focus-within:border-[#00FF00]/30 focus-within:shadow-[0_0_30px_rgba(0,255,0,0.08)] h-14">
            {isRecording ? (
              <div className="flex-1 flex items-center px-4 animate-in fade-in duration-300">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse mr-3" />
                <span className="text-red-400 font-medium text-[14px]">Gravando áudio... 0:03</span>
                <div className="flex-1 flex items-center gap-1 ml-6 overflow-hidden">
                   {[1, 3, 2, 5, 4, 2, 4, 6, 3, 2, 5, 2, 1, 3, 2, 4, 2, 5, 3].map((h, i) => (
                      <div key={i} className="w-1 bg-red-500/50 rounded-full animate-pulse" style={{ height: `${h * 3}px`, animationDelay: `${i * 50}ms` }} />
                   ))}
                </div>
              </div>
            ) : (
              <>
                <button className="p-2.5 text-gray-500 hover:text-gray-300 rounded-xl hover:bg-white/5 transition-colors shrink-0" title="Anexar Arquivo">
                  <Paperclip className="h-5 w-5" />
                </button>
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="p-2.5 text-gray-500 hover:text-[#00FF00] rounded-xl hover:bg-[#00FF00]/10 transition-colors shrink-0" title="Solicitar Aprovação">
                      <CheckCircle2 className="h-5 w-5" />
                    </button>
                  </DialogTrigger>
                  <DialogContent className="bg-[#111] border border-white/10 text-white rounded-3xl p-6 sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-light mb-2">Solicitar Aprovação</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Título da Solicitação</label>
                        <input type="text" placeholder="Ex: Orçamento de Campanha" className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#00FF00]/50 transition-colors" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Detalhes / Valores</label>
                        <input type="text" placeholder="Ex: Valor solicitado: R$ 5.000,00 | Plataforma: Meta Ads" className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#00FF00]/50 transition-colors" />
                      </div>
                    </div>
                    <DialogFooter>
                      <button className="w-full flex items-center justify-center gap-2 bg-[#00FF00]/10 text-[#00FF00] hover:bg-[#00FF00]/20 font-semibold py-3 px-4 rounded-xl transition-colors">
                        <CheckCircle2 className="w-4 h-4" />
                        Enviar Solicitação ao Grupo
                      </button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <input 
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendMessage();
                  }}
                  placeholder="Sua mensagem..."
                  className="flex-1 bg-transparent border-none focus:outline-none text-gray-200 text-[14px] placeholder:text-gray-600 font-medium h-full px-3"
                />
              </>
            )}
            
            <div className="flex items-center gap-1 shrink-0">
              {isRecording ? (
                <button onClick={() => setIsRecording(false)} className="p-2.5 text-red-500 hover:text-red-400 rounded-xl hover:bg-red-500/10 transition-colors" title="Cancelar Gravação">
                  <Trash2 className="h-5 w-5" />
                </button>
              ) : (
                <button onClick={() => setIsRecording(true)} className="p-2.5 text-gray-500 hover:text-gray-300 rounded-xl hover:bg-white/5 transition-colors" title="Gravar Áudio">
                  <Mic className="h-5 w-5" />
                </button>
              )}
              <button 
                onClick={handleSendMessage}
                className={`ml-2 w-10 h-10 flex items-center justify-center rounded-xl transition-all shadow-md ${
                  message.trim() || isRecording ? 'bg-[#00FF00] text-black hover:bg-[#00CC00] shadow-[0_0_15px_rgba(0,255,0,0.4)]' : 'bg-white/5 text-gray-500 border border-white/5'
                }`}
              >
                <Send className="h-4 w-4 ml-0.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Right Threads Sidebar */}
      <div className="w-[340px] bg-[#121212] border-l border-[#1a1a1a] flex flex-col shrink-0 z-10">
        <div className="h-16 px-5 flex items-center justify-between border-b border-[#1a1a1a]">
          <div className="flex items-center gap-2">
            {activeTopic && (
              <button onClick={() => setActiveTopic(null)} className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <h3 className="text-[14px] font-semibold text-gray-100 tracking-tight">{activeTopic ? "Detalhes do Tópico" : "Tópicos Ativos"}</h3>
          </div>
          {!activeTopic && (
            <div className="flex items-center gap-1">
              <Dialog>
                <DialogTrigger asChild>
                  <button className="w-7 h-7 rounded-lg bg-transparent hover:bg-white/10 border border-transparent hover:border-white/5 flex items-center justify-center text-[#00FF00] transition-colors" title="Novo Tópico Manual">
                    <Plus className="w-4 h-4" />
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-[#111] border border-white/10 text-white rounded-3xl p-6 sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-light mb-2">Criar Tópico</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-400">Nome do Tópico</label>
                      <input type="text" placeholder="Ex: Ajustes na Black Friday" className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#00FF00]/50 transition-colors" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-400">Mensagem Inicial</label>
                      <textarea placeholder="Descreva sobre o que será discutido..." rows={3} className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#00FF00]/50 transition-colors resize-none" />
                    </div>
                  </div>
                  <DialogFooter>
                    <button className="w-full bg-[#00FF00]/10 text-[#00FF00] hover:bg-[#00FF00]/20 font-semibold py-3 px-4 rounded-xl transition-colors">
                      Iniciar Tópico
                    </button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>

        {activeTopic ? (
          <div className="flex flex-col h-[calc(100%-64px)]">
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-5">
              
              <div className="border-b border-white/10 pb-5 mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare className="w-5 h-5 text-[#00FF00]" />
                  <h4 className="text-[15px] font-bold text-white tracking-tight">{activeTopic}</h4>
                </div>
                <div className="bg-[#1a1a1a] rounded-xl p-4 border border-white/5">
                  <span className="text-[12px] font-bold text-gray-400 mb-1 block">Anderson</span>
                  <p className="text-[13px] text-gray-200 leading-relaxed">
                    Pode deixar, vou reportar isso no painel de divergências agora mesmo e pedir o reembolso pelo portal deles.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-500 flex items-center justify-center text-[11px] font-extrabold border-2 border-[#1a1a1a] shrink-0">AL</div>
                  <div>
                    <span className="text-[11px] font-bold text-gray-400 block mb-1">Alyson <span className="text-gray-600 font-normal ml-2">Hoje às 09:37</span></span>
                    <p className="text-[13px] text-gray-300">Maravilha! Assim que sair o protocolo me envia aqui para eu atualizar a planilha.</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center text-[11px] font-extrabold border-2 border-[#1a1a1a] shrink-0">RO</div>
                  <div>
                    <span className="text-[11px] font-bold text-gray-400 block mb-1">Rogério <span className="text-gray-600 font-normal ml-2">Hoje às 09:41</span></span>
                    <p className="text-[13px] text-gray-300">Boa Anderson, qualquer coisa me avisa.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#161616] border-t border-[#1a1a1a] shrink-0">
              <div className="bg-[#111] border border-white/10 rounded-xl flex items-center p-1.5 focus-within:border-[#00FF00]/50 transition-colors">
                <input 
                  type="text" 
                  placeholder="Responder no tópico..." 
                  value={topicReply}
                  onChange={(e) => setTopicReply(e.target.value)}
                  className="flex-1 bg-transparent border-none focus:outline-none text-sm text-white px-3"
                />
                <button 
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${topicReply.trim() ? 'bg-[#00FF00] text-black' : 'bg-white/5 text-gray-500'}`}
                >
                  <Send className="w-3.5 h-3.5 ml-0.5" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4">
            <div onClick={() => setActiveTopic('Reclamação Mercado Livre')} className="bg-white/5 backdrop-blur-md rounded-xl p-4 border-t border-t-white/10 shadow-lg cursor-pointer hover:bg-white/10 transition-colors group">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-4 h-4 text-[#00FF00]" />
                <span className="text-[13px] font-bold text-gray-100 group-hover:text-white transition-colors">Reclamação Mercado Livre</span>
              </div>
              <p className="text-[12px] text-gray-400 mb-4 line-clamp-2 leading-relaxed">
                <strong className="text-gray-300">Anderson:</strong> Pode deixar, vou reportar isso no painel de divergências...
              </p>
              <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                  <div className="w-7 h-7 rounded-full bg-purple-500/20 text-purple-500 flex items-center justify-center text-[10px] font-extrabold border-2 border-[#1a1a1a] relative z-20">AL</div>
                  <div className="w-7 h-7 rounded-full bg-gray-500/20 text-gray-400 flex items-center justify-center text-[10px] font-extrabold border-2 border-[#1a1a1a] relative z-10">AN</div>
                </div>
                <span className="text-[11px] font-bold text-gray-400 flex items-center gap-1">
                  2 respostas <ChevronDown className="w-3 h-3 -rotate-90 text-gray-600" />
                </span>
              </div>
            </div>
            
            <div onClick={() => setActiveTopic('Coletas Flex (ML)')} className="bg-white/5 backdrop-blur-md rounded-xl p-4 border-t border-t-white/10 shadow-lg cursor-pointer hover:bg-white/10 transition-colors group">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-4 h-4 text-gray-400" />
                <span className="text-[13px] font-bold text-gray-100 group-hover:text-white transition-colors">Coletas Flex (ML)</span>
              </div>
              <p className="text-[12px] text-gray-400 mb-4 line-clamp-2 leading-relaxed">
                <strong className="text-gray-300">Rogério:</strong> Pessoal! O flex do Mercado Livre acabou de chegar pra coleta.
              </p>
              <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                  <div className="w-7 h-7 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center text-[10px] font-extrabold border-2 border-[#1a1a1a] relative z-10">RO</div>
                </div>
                <span className="text-[11px] font-bold text-gray-400 flex items-center gap-1">
                  1 resposta <ChevronDown className="w-3 h-3 -rotate-90 text-gray-600" />
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

// Subcomponent para ícones da sidebar esquerda
function SidebarIcon({ id, icon, label, badge, active, onClick }: { id: string, icon: React.ReactNode, label: string, badge?: number, active: boolean, onClick: () => void }) {
  return (
    <div className="relative group w-full flex justify-center cursor-pointer" onClick={onClick}>
      {active && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#00FF00] rounded-r-full shadow-[0_0_10px_rgba(0,255,0,0.5)]" />
      )}
      <div className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all ${
        active 
          ? 'bg-[#1e1e1e] text-gray-100 shadow-md border border-white/5' 
          : 'text-gray-500 hover:text-gray-200 hover:bg-[#1a1a1a]'
      }`}>
        {icon}
      </div>
      {badge && (
        <div className="absolute top-0 right-3 bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full border-2 border-[#0a0a0a]">
          {badge}
        </div>
      )}
      <span className="absolute left-full ml-4 top-1/2 -translate-y-1/2 bg-[#1a1a1a] text-gray-200 text-[11px] font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl z-50 border border-white/10">
        {label}
      </span>
    </div>
  );
}
