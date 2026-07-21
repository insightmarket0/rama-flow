import React, { useState, useEffect, useRef } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  const [currentTime, setCurrentTime] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (msg.audioUrl) {
      const audio = new Audio(msg.audioUrl);
      audioRef.current = audio;
      
      audio.onloadedmetadata = () => {
        if (audio.duration && audio.duration !== Infinity) {
          setTotalSeconds(audio.duration);
        } else {
           const durationParts = (msg.duration || "0:03").split(":");
           setTotalSeconds(parseInt(durationParts[0] || "0") * 60 + parseInt(durationParts[1] || "3"));
        }
      };
      
      audio.ontimeupdate = () => setCurrentTime(audio.currentTime);
      audio.onended = () => {
        setIsPlaying(false);
        setCurrentTime(0);
      };
    } else {
      const durationParts = (msg.duration || "0:03").split(":");
      setTotalSeconds(parseInt(durationParts[0] || "0") * 60 + parseInt(durationParts[1] || "3"));
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [msg.audioUrl, msg.duration]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && !msg.audioUrl) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= totalSeconds - 1) {
            setIsPlaying(false);
            return 0; // reseta ao final
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, totalSeconds, msg.audioUrl]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    } else {
      if (!isPlaying && currentTime >= totalSeconds) {
        setCurrentTime(0);
      }
    }
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
    <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-3 shadow-md min-w-[220px]">
      <button 
        onClick={togglePlay}
        className="w-10 h-10 rounded-full bg-[#111] border border-[#00FF00]/30 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(0,255,0,0.1)] hover:border-[#00FF00]/60 hover:bg-[#00FF00]/10 transition-all">
        {isPlaying ? (
          <Pause className="w-4 h-4 text-[#00FF00] fill-[#00FF00]" />
        ) : (
          <Play className="w-4 h-4 text-[#00FF00] ml-0.5 fill-[#00FF00]" />
        )}
      </button>
      
      <div className="flex-1 flex items-center gap-1 px-1">
        {bars.map((h, i) => {
          const isPassed = (i / bars.length) <= progressRatio;
          return (
            <div 
              key={i} 
              className={`w-1 rounded-full transition-all duration-300 ${
                isPassed ? 'bg-[#00FF00]' : 'bg-[#00FF00]/30'
              } ${isPlaying && isPassed ? 'animate-pulse' : ''}`} 
              style={{ 
                height: `${isPlaying && !isPassed ? (Math.random() * 2 + 2) * 3 : h * 3.5}px`,
                animationDelay: `${i * 50}ms`
              }} 
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

interface Topic {
  id: string;
  name: string;
  initialMessage: string;
  creator: string;
  creatorInitials: string;
  priority: string;
  department: string;
  replies: any[];
}

const INITIAL_TOPICS: Topic[] = [
  {
    id: "t1",
    name: "Reclamação Mercado Livre",
    initialMessage: "Pode deixar, vou reportar isso no painel de divergências agora mesmo e pedir o reembolso pelo portal deles.",
    creator: "Anderson",
    creatorInitials: "AN",
    priority: "Alta",
    department: "Atendimento",
    replies: [
      { sender: "Alyson", initials: "AL", color: "bg-purple-500/20 text-purple-500", time: "Hoje às 09:37", text: "Maravilha! Assim que sair o protocolo me envia aqui para eu atualizar a planilha." }
    ]
  },
  {
    id: "t2",
    name: "Coletas Flex (ML)",
    initialMessage: "Pessoal! O flex do Mercado Livre acabou de chegar pra coleta.",
    creator: "Rogério",
    creatorInitials: "RO",
    priority: "Normal",
    department: "Expedição",
    replies: [
       { sender: "Rogério", initials: "RO", color: "bg-blue-500/20 text-blue-500", time: "Hoje às 09:41", text: "Boa Anderson, qualquer coisa me avisa." }
    ]
  }
];

export default function ChatPage() {
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [topicReply, setTopicReply] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [activeChatId, setActiveChatId] = useState("c1");
  const [chatMessages, setChatMessages] = useState<Record<string, any[]>>({});
  const [recordingTime, setRecordingTime] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isMessageSearchOpen, setIsMessageSearchOpen] = useState(false);
  const [messageSearchQuery, setMessageSearchQuery] = useState("");

  const [topics, setTopics] = useState<Topic[]>(INITIAL_TOPICS);
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
  const [newTopicName, setNewTopicName] = useState("");
  const [newTopicMessage, setNewTopicMessage] = useState("");
  const [newTopicPriority, setNewTopicPriority] = useState("Normal");
  const [newTopicDepartment, setNewTopicDepartment] = useState("Geral");

  const handleCreateTopic = () => {
    if (!newTopicName.trim() || !newTopicMessage.trim()) return;
    const newTopic: Topic = {
      id: "t" + Date.now(),
      name: newTopicName,
      initialMessage: newTopicMessage,
      creator: "Anderson",
      creatorInitials: "AN",
      priority: newTopicPriority,
      department: newTopicDepartment,
      replies: []
    };
    setTopics(prev => [newTopic, ...prev]);
    setIsTopicModalOpen(false);
    setActiveTopic(newTopic.id);
    setNewTopicName("");
    setNewTopicMessage("");
    setNewTopicPriority("Normal");
    setNewTopicDepartment("Geral");
  };

  const handleReplyTopic = () => {
    if (!topicReply.trim() || !activeTopic) return;
    setTopics(prev => prev.map(t => {
      if (t.id === activeTopic) {
        return {
          ...t,
          replies: [...t.replies, {
            sender: "Anderson (Você)",
            initials: "AN",
            color: "bg-gray-500/20 text-gray-400",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            text: topicReply
          }]
        };
      }
      return t;
    }));
    setTopicReply("");
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      setRecordingTime(0);
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedImage(url);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };
      
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Erro ao acessar microfone", err);
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const handleSendMessage = () => {
    if (isRecording) {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const audioUrl = URL.createObjectURL(audioBlob);
          
          const newMessage = {
            id: Date.now(),
            sender: "Anderson (Você)",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            text: "",
            type: "audio",
            audioUrl: audioUrl,
            duration: formatTime(recordingTime),
            isMe: true,
            initials: "AN"
          };

          setChatMessages(prev => ({
            ...prev,
            [activeChatId]: [...(prev[activeChatId] || []), newMessage]
          }));
          setIsRecording(false);
        };
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
      return;
    }

    if (!message.trim() && !selectedImage) return;
    
    const isImage = !!selectedImage;
    
    const newMessage = {
      id: Date.now(),
      sender: "Anderson (Você)",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: message,
      type: isImage ? "image" : "text",
      image: isImage ? selectedImage : undefined,
      isMe: true,
      initials: "AN"
    };

    setChatMessages(prev => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] || []), newMessage]
    }));
    setMessage("");
    setSelectedImage(null);
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
        <div key={`header-${activeChatId}`} className="h-16 px-6 flex items-center justify-between shrink-0 z-10 bg-transparent pt-4 animate-in fade-in duration-500">
          {isMessageSearchOpen ? (
            <div className="flex-1 flex items-center bg-[#1a1a1a] border border-[#00FF00]/30 rounded-xl px-4 py-2 mr-4 animate-in fade-in slide-in-from-right-4">
              <Search className="w-4 h-4 text-[#00FF00] mr-2 shrink-0" />
              <input 
                autoFocus
                type="text"
                placeholder="Buscar nas mensagens..."
                value={messageSearchQuery}
                onChange={(e) => setMessageSearchQuery(e.target.value)}
                className="flex-1 bg-transparent border-none focus:outline-none text-sm text-white placeholder:text-gray-500"
              />
            </div>
          ) : (
            <div>
              <h2 className="text-lg font-bold text-gray-100 tracking-tight">
                {CHAT_LIST.find(c => c.id === activeChatId)?.name || "Chat"}
              </h2>
            </div>
          )}
          <div className="flex items-center gap-1.5 shrink-0">
            <button 
              onClick={() => {
                setIsMessageSearchOpen(!isMessageSearchOpen);
                if (isMessageSearchOpen) setMessageSearchQuery("");
              }}
              className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-colors ${isMessageSearchOpen ? 'bg-[#00FF00]/10 border-[#00FF00]/30 text-[#00FF00]' : 'bg-transparent hover:bg-white/10 border-transparent hover:border-white/5 text-gray-400 hover:text-white'}`}>
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages Feed */}
        <div key={`feed-${activeChatId}`} className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-500">
          {(() => {
            const filteredMessages = (chatMessages[activeChatId] || []).filter(msg => 
              !messageSearchQuery.trim() || 
              (msg.text && msg.text.toLowerCase().includes(messageSearchQuery.toLowerCase()))
            );
            
            return filteredMessages.length > 0 ? filteredMessages.map((msg) => (
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
                {msg.text && (!msg.type || msg.type === "text") && (
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
              <p className="text-sm font-medium">{messageSearchQuery ? "Nenhuma mensagem encontrada na busca." : "Você ainda não tem mensagens aqui."}</p>
              {!messageSearchQuery && <p className="text-xs text-gray-600">Envie um 'Oi' para começar.</p>}
            </div>
          );
        })()}
        </div>

        {/* Input Area */}
        <div className="p-6 pt-0 bg-transparent shrink-0 relative z-10 flex flex-col gap-2">
          {selectedImage && (
            <div className="relative self-start ml-2 mb-1 animate-in fade-in slide-in-from-bottom-2">
              <img src={selectedImage} alt="Preview" className="h-24 rounded-lg object-cover border border-white/10 shadow-lg" />
              <button onClick={() => setSelectedImage(null)} className="absolute -top-2 -right-2 bg-[#1a1a1a] border border-white/10 text-gray-400 hover:text-red-500 rounded-full p-1 shadow-md hover:bg-red-500/10 transition-colors z-20">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
          <div className="bg-black/50 backdrop-blur-md rounded-2xl shadow-[0_0_30px_rgba(0,255,0,0.03)] border border-white/10 flex items-center p-2 pr-2.5 transition-all focus-within:border-[#00FF00]/30 focus-within:shadow-[0_0_30px_rgba(0,255,0,0.08)] h-14">
            {isRecording ? (
              <div className="flex-1 flex items-center px-4 animate-in fade-in duration-300">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse mr-3" />
                <span className="text-red-400 font-medium text-[14px]">Gravando áudio... {formatTime(recordingTime)}</span>
                <div className="flex-1 flex items-center gap-1 ml-6 overflow-hidden">
                   {[1, 3, 2, 5, 4, 2, 4, 6, 3, 2, 5, 2, 1, 3, 2, 4, 2, 5, 3].map((h, i) => (
                      <div key={i} className="w-1 bg-red-500/50 rounded-full animate-pulse" style={{ height: `${h * 3}px`, animationDelay: `${i * 50}ms` }} />
                   ))}
                </div>
              </div>
            ) : (
              <>
                <button onClick={() => fileInputRef.current?.click()} className="p-2.5 text-gray-500 hover:text-gray-300 rounded-xl hover:bg-white/5 transition-colors shrink-0" title="Anexar Imagem">
                  <Paperclip className="h-5 w-5" />
                </button>
                <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageSelect} />
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
                <button onClick={cancelRecording} className="p-2.5 text-red-500 hover:text-red-400 rounded-xl hover:bg-red-500/10 transition-colors" title="Cancelar Gravação">
                  <Trash2 className="h-5 w-5" />
                </button>
              ) : (
                <button onClick={startRecording} className="p-2.5 text-gray-500 hover:text-gray-300 rounded-xl hover:bg-white/5 transition-colors" title="Gravar Áudio">
                  <Mic className="h-5 w-5" />
                </button>
              )}
              <button 
                onClick={handleSendMessage}
                className={`ml-2 w-10 h-10 flex items-center justify-center rounded-xl transition-all shadow-md ${
                  message.trim() || isRecording || selectedImage ? 'bg-[#00FF00] text-black hover:bg-[#00CC00] shadow-[0_0_15px_rgba(0,255,0,0.4)]' : 'bg-white/5 text-gray-500 border border-white/5'
                }`}
              >
                <Send className={`h-4 w-4 ${message.trim() || isRecording || selectedImage ? '' : 'opacity-50'}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Right Threads Sidebar */}
      <div className="w-[340px] bg-[#121212] border-l border-[#1a1a1a] flex flex-col shrink-0 z-10">
        <div className="h-12 px-4 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-2">
            {activeTopic && (
              <button onClick={() => setActiveTopic(null)} className="w-6 h-6 rounded flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/5 transition-colors">
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            )}
            <h3 className="text-[13px] font-medium text-gray-400 tracking-tight">{activeTopic ? "Detalhes do Tópico" : "Tópicos Ativos"}</h3>
          </div>
          {!activeTopic && (
            <div className="flex items-center gap-1">
                <Dialog open={isTopicModalOpen} onOpenChange={setIsTopicModalOpen}>
                  <DialogTrigger asChild>
                    <button className="w-6 h-6 rounded flex items-center justify-center text-gray-500 hover:text-[#00FF00] hover:bg-[#00FF00]/10 transition-colors" title="Novo Tópico Manual">
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </DialogTrigger>
                  <DialogContent className="bg-[#111] border border-white/10 text-white rounded-3xl p-6 sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-light mb-2">Criar Tópico</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Nome do Tópico</label>
                        <input value={newTopicName} onChange={e => setNewTopicName(e.target.value)} type="text" placeholder="Ex: SKU 3050 mercado livre" className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#00FF00]/50 transition-colors" />
                      </div>
                      <div className="flex gap-4">
                        <div className="flex-1 space-y-2">
                          <label className="text-sm font-medium text-gray-400">Prioridade</label>
                          <Select value={newTopicPriority} onValueChange={setNewTopicPriority}>
                            <SelectTrigger className="w-full bg-[#1a1a1a] border border-white/10 h-[46px] rounded-xl px-4 text-sm focus:ring-1 focus:ring-[#00FF00]/50 outline-none text-white shadow-inner">
                              <SelectValue placeholder="Prioridade" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#111111] border-white/10 text-white">
                              <SelectItem value="Baixa" className="hover:bg-white/10 focus:bg-white/10 focus:text-white cursor-pointer">Baixa</SelectItem>
                              <SelectItem value="Normal" className="hover:bg-white/10 focus:bg-white/10 focus:text-white cursor-pointer">Normal</SelectItem>
                              <SelectItem value="Alta" className="hover:bg-white/10 focus:bg-white/10 focus:text-white cursor-pointer">Alta</SelectItem>
                              <SelectItem value="Urgente" className="hover:bg-white/10 focus:bg-white/10 focus:text-white cursor-pointer">Urgente</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex-1 space-y-2">
                          <label className="text-sm font-medium text-gray-400">Departamento</label>
                          <Select value={newTopicDepartment} onValueChange={setNewTopicDepartment}>
                            <SelectTrigger className="w-full bg-[#1a1a1a] border border-white/10 h-[46px] rounded-xl px-4 text-sm focus:ring-1 focus:ring-[#00FF00]/50 outline-none text-white shadow-inner">
                              <SelectValue placeholder="Departamento" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#111111] border-white/10 text-white">
                              <SelectItem value="Geral" className="hover:bg-white/10 focus:bg-white/10 focus:text-white cursor-pointer">Geral</SelectItem>
                              <SelectItem value="Expedição" className="hover:bg-white/10 focus:bg-white/10 focus:text-white cursor-pointer">Expedição</SelectItem>
                              <SelectItem value="Atendimento" className="hover:bg-white/10 focus:bg-white/10 focus:text-white cursor-pointer">Atendimento</SelectItem>
                              <SelectItem value="Comercial" className="hover:bg-white/10 focus:bg-white/10 focus:text-white cursor-pointer">Comercial</SelectItem>
                              <SelectItem value="Financeiro" className="hover:bg-white/10 focus:bg-white/10 focus:text-white cursor-pointer">Financeiro</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Mensagem Inicial</label>
                        <textarea value={newTopicMessage} onChange={e => setNewTopicMessage(e.target.value)} placeholder="Descreva sobre o que será discutido..." rows={3} className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#00FF00]/50 transition-colors resize-none" />
                      </div>
                    </div>
                    <DialogFooter>
                      <button onClick={handleCreateTopic} disabled={!newTopicName.trim() || !newTopicMessage.trim()} className="w-full bg-[#00FF00] text-black disabled:bg-gray-700 disabled:text-gray-400 hover:bg-[#00CC00] font-semibold py-3 px-4 rounded-xl transition-colors">
                        Iniciar Tópico
                      </button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
            </div>
          )}
        </div>

        {activeTopic ? (() => {
          const topic = topics.find(t => t.id === activeTopic);
          if (!topic) return null;
          return (
            <div className="flex flex-col h-[calc(100%-48px)]">
              <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-5">
                
                <div className="border-b border-white/10 pb-5 mb-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-[#00FF00]" />
                      <h4 className="text-[15px] font-bold text-white tracking-tight">{topic.name}</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        topic.priority === 'Alta' ? 'bg-red-500/20 text-red-400' :
                        topic.priority === 'Urgente' ? 'bg-red-600/30 text-red-500 border border-red-500/30' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>{topic.priority}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400">{topic.department}</span>
                    </div>
                  </div>
                  <div className="bg-[#1a1a1a] rounded-xl p-4 border border-white/5">
                    <span className="text-[12px] font-bold text-gray-400 mb-1 block">{topic.creator}</span>
                    <p className="text-[13px] text-gray-200 leading-relaxed whitespace-pre-wrap">
                      {topic.initialMessage}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {topic.replies.map((reply: any, index: number) => (
                    <div key={index} className="flex gap-3">
                      <div className={`w-8 h-8 rounded-full ${reply.color || 'bg-gray-500/20 text-gray-400'} flex items-center justify-center text-[11px] font-extrabold border-2 border-[#1a1a1a] shrink-0`}>{reply.initials}</div>
                      <div>
                        <span className="text-[11px] font-bold text-gray-400 block mb-1">{reply.sender} <span className="text-gray-600 font-normal ml-2">{reply.time}</span></span>
                        <p className="text-[13px] text-gray-300 whitespace-pre-wrap">{reply.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-[#161616] border-t border-[#1a1a1a] shrink-0">
                <div className="bg-[#111] border border-white/10 rounded-xl flex items-center p-1.5 focus-within:border-[#00FF00]/50 transition-colors">
                  <input 
                    type="text" 
                    placeholder="Responder no tópico..." 
                    value={topicReply}
                    onChange={(e) => setTopicReply(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleReplyTopic()}
                    className="flex-1 bg-transparent border-none focus:outline-none text-sm text-white px-3"
                  />
                  <button 
                    onClick={handleReplyTopic}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${topicReply.trim() ? 'bg-[#00FF00] text-black' : 'bg-white/5 text-gray-500'}`}
                  >
                    <Send className="w-3.5 h-3.5 ml-0.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })() : (
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4">
            {topics.map(topic => (
              <div key={topic.id} onClick={() => setActiveTopic(topic.id)} className="bg-white/5 backdrop-blur-md rounded-xl p-4 border-t border-t-white/10 shadow-lg cursor-pointer hover:bg-white/10 transition-colors group">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-[#00FF00]" />
                    <span className="text-[13px] font-bold text-gray-100 group-hover:text-white transition-colors">{topic.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      topic.priority === 'Alta' ? 'bg-red-500/20 text-red-400' :
                      topic.priority === 'Urgente' ? 'bg-red-600/30 text-red-500 border border-red-500/30' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>{topic.priority}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400">{topic.department}</span>
                  </div>
                </div>
                <p className="text-[12px] text-gray-400 mb-4 line-clamp-2 leading-relaxed">
                  <strong className="text-gray-300">{topic.creator}:</strong> {topic.initialMessage}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    <div className="w-7 h-7 rounded-full bg-purple-500/20 text-purple-500 flex items-center justify-center text-[10px] font-extrabold border-2 border-[#1a1a1a] relative z-20">{topic.creatorInitials}</div>
                    {topic.replies.slice(0, 3).map((r: any, i: number) => (
                      <div key={i} className={`w-7 h-7 rounded-full ${r.color || 'bg-gray-500/20 text-gray-400'} flex items-center justify-center text-[10px] font-extrabold border-2 border-[#1a1a1a] relative z-10`} style={{ zIndex: 10 - i }}>{r.initials}</div>
                    ))}
                  </div>
                  <span className="text-[11px] font-bold text-gray-400 flex items-center gap-1">
                    {topic.replies.length} resposta{topic.replies.length !== 1 && 's'} <ChevronDown className="w-3 h-3 -rotate-90 text-gray-600" />
                  </span>
                </div>
              </div>
            ))}
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
