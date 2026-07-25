import React, { useState, useEffect, useRef } from "react";
import { Package, Send, AlertTriangle, CheckCircle2, MessageSquare, Plus, Clock, FileText, CheckCircle, Box, UploadCloud, X, XCircle, Image as ImageIcon, Truck, Settings2, Save, CheckCheck, Paperclip, Mic, Phone, PhoneCall, MicOff, PhoneOff, Radio } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function PortalExpedicao() {
  const [sku, setSku] = useState("");
  const [marketplace, setMarketplace] = useState("Mercado Livre");
  const [description, setDescription] = useState("");
  const [evidenceFiles, setEvidenceFiles] = useState<File[]>([]);
  const [priority, setPriority] = useState("normal");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Estados do Rádio Operacional
  const [activeRoom, setActiveRoom] = useState<string | null>(null);
  const [isCalling, setIsCalling] = useState(false);
  const [isRadioMuted, setIsRadioMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  // Efeito para o timer da chamada
  useEffect(() => {
    let interval: any;
    if (activeRoom && !isCalling) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeRoom, isCalling]);

  const joinRoom = (room: string) => {
    if (activeRoom === room) return;
    setActiveRoom(room);
    setIsCalling(true);
    setCallDuration(0);
    setIsRadioMuted(false);
    toast("Conectando na " + room + "...");
    
    // Simula a outra pessoa atendendo após 3 segundos
    setTimeout(() => {
      setIsCalling(false);
      toast.success("Conectado!");
    }, 3000);
  };

  const leaveRoom = () => {
    setActiveRoom(null);
    setIsCalling(false);
    setCallDuration(0);
  };
  
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 60000);
    return () => clearInterval(timer);
  }, []);

  const [tickets, setTickets] = useState<any[]>([
    {
      id: 1,
      type: 'insumo',
      title: 'Caixa Parda 30x20x10',
      description: 'Estava com apenas 1 rolo restante. Prioridade Crítica.',
      status: 'aprovado',
      priority: 'critico',
      author: 'Anderson',
      time: 'Ontem às 14:30',
      createdAt: Date.now() - 86400000
    },
    {
      id: 2,
      type: 'risco',
      title: 'KITGAS001 - Mercado Livre',
      description: 'A foto mostra 3 itens, mas a embalagem comporta 2. Precisa arrumar a imagem no anúncio.',
      status: 'aguardando',
      priority: 'critico',
      author: 'Lívia',
      time: 'Hoje às 09:15',
      createdAt: Date.now() - 8100000
    }
  ]);

  const changeTicketStatus = (id: number, newStatus: string) => {
    setTickets(tickets.map(t => t.id === id ? { ...t, status: newStatus } : t));
    toast.success(newStatus === 'aprovado' ? "Aprovado com sucesso!" : newStatus === 'recusado' ? "Recusado!" : "Voltado para triagem!");
  };
  
  // Estados para Aba e Alerta de Insumos
  const [activeTab, setActiveTab] = useState<"divergencia" | "insumos" | "kanban" | "historico">("kanban");
  const [itemName, setItemName] = useState("");
  const [itemCategory, setItemCategory] = useState("Embalagem (Caixa, Fita, etc)");
  const [remainingQty, setRemainingQty] = useState("");
  const [supplyPriority, setSupplyPriority] = useState("normal");
  const [isSubmittingSupply, setIsSubmittingSupply] = useState(false);


  const [chatMessage, setChatMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "Lívia",
      initials: "LI",
      time: "10:45",
      text: "Pessoal, o produto 2343 tá saindo muito hoje, mas notei que a caixa parda que usamos acabou. Posso mandar na caixa branca?",
      isMe: false,
      color: "bg-purple-500 text-white"
    },
    {
      id: 2,
      sender: "Anderson",
      initials: "AN",
      time: "10:48",
      text: "Pode mandar na branca sim, Lívia. Mas me abre um chamado ali na esquerda pra eu lembrar de comprar mais parda depois.",
      isMe: true,
      color: "bg-[#00FF00] text-black"
    }
  ]);

  const createTicketFromMessage = (msg: any) => {
    // Regex buscando especificamente por 4 números seguidos, que é o padrão de SKU da empresa.
    const skuMatch = msg.text?.match(/\b\d{4}\b/);
    const skuOrTitle = skuMatch ? `SKU: ${skuMatch[0]}` : msg.text?.split(' ').slice(0, 4).join(' ') + '...';
    
    const textLower = msg.text?.toLowerCase() || '';
    const isRisk = textLower.includes('mercado livre') || textLower.includes('ml') || textLower.includes('anúncio') || textLower.includes('devolução') || textLower.includes('estoque') || textLower.includes('falto');

    const newTicket = {
      id: Date.now(),
      type: isRisk ? 'risco' : 'insumo', 
      title: `${isRisk ? 'Risco Comercial' : 'Alerta'}: ${skuOrTitle || 'Chamado'}`,
      description: `Gerado via chat por ${msg.sender}: "${msg.text}"`,
      status: 'aguardando',
      priority: isRisk ? 'critico' : 'alta',
      author: msg.sender,
      time: `Hoje às ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`,
      createdAt: Date.now()
    };
    
    setTickets(prev => [newTicket, ...prev]);
    toast.success("Chamado gerado a partir do chat!");
    setActiveTab("kanban");
  };

  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleChatFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      
      const newMsg = {
        id: messages.length + 1,
        sender: "Anderson",
        initials: "AN",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: "Enviou uma imagem",
        imageUrl: imageUrl,
        isMe: true,
        color: "bg-[#00FF00] text-black"
      };
      
      setMessages([...messages, newMsg as any]);
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
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        const time = `${new Date().getHours().toString().padStart(2, '0')}:${new Date().getMinutes().toString().padStart(2, '0')}`;
        
        setMessages(prev => [...prev, {
          id: Date.now(),
          sender: "Anderson",
          initials: "AN",
          time,
          text: "",
          isAudio: true,
          audioUrl: audioUrl,
          isMe: true,
          color: "bg-[#00FF00] text-black"
        } as any]);
      };
      
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Erro ao acessar microfone", err);
      toast.error("Permissão de microfone negada ou indisponível.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sku || !description) {
      toast.error("Preencha o SKU e a descrição do erro!");
      return;
    }

    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Divergência reportada para a Triagem!", {
        icon: <CheckCircle2 className="w-5 h-5 text-[#00FF00]" />,
        style: { background: "#0A0A0A", border: "1px solid #00FF00", color: "#FFF" }
      });
      
      setTickets(prev => [{
        id: Date.now(),
        type: 'divergencia',
        title: `${sku} - ${marketplace}`,
        description: description,
        status: 'aguardando',
        priority: priority,
        author: 'Anderson',
        time: `Hoje às ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
      }, ...prev]);
      setActiveTab("historico");
      
      setSku("");
      setMarketplace("Mercado Livre");
      setDescription("");
      setEvidenceFiles([]);
      setPriority("normal");
    }, 1500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setEvidenceFiles(prev => [...prev, ...filesArray]);
    }
  };

  const removeFile = (index: number) => {
    setEvidenceFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSupplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName || !remainingQty) {
      toast.error("Preencha o nome do item e a quantidade restante!");
      return;
    }

    setIsSubmittingSupply(true);
    
    setTimeout(() => {
      setIsSubmittingSupply(false);
      toast.success("Alerta de estoque enviado para Compras!", {
        icon: <CheckCircle2 className="w-5 h-5 text-[#00FF00]" />,
        style: { background: "#0A0A0A", border: "1px solid #00FF00", color: "#FFF" }
      });
      
      setTickets(prev => [{
        id: Date.now(),
        type: itemCategory.includes('Produto') ? 'produto' : 'insumo',
        title: itemName,
        description: `Restante: ${remainingQty}. Categoria: ${itemCategory}`,
        status: 'aguardando',
        priority: supplyPriority,
        author: 'Anderson',
        time: `Hoje às ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
      }, ...prev]);
      setActiveTab("historico");
      
      setItemName("");
      setItemCategory("Embalagem (Caixa, Fita, etc)");
      setRemainingQty("");
      setSupplyPriority("normal");
    }, 800);
  };

  const sendChatMessage = (text: string) => {
    if (!text.trim()) return;
    
    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    setMessages(prev => [...prev, {
      id: Date.now(),
      sender: "Anderson",
      initials: "AN",
      time,
      text,
      isMe: true,
      color: "bg-[#00FF00] text-black"
    }]);
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendChatMessage(chatMessage);
    setChatMessage("");
  };

  return (
    <div className="flex flex-col h-full bg-transparent w-full font-sans animate-in fade-in duration-700 overflow-hidden p-4">
      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        
        {/* Lado Direito na tela original, mas agora será order-2 (Direita) */}
        <div className="w-full lg:w-[65%] order-2 bg-[#1A1A1A] border border-white/5 rounded-2xl p-4 shadow-xl relative overflow-y-auto h-full flex flex-col">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00FF00] to-transparent opacity-20" />
          
          {/* Header e Abas Premium */}
          <div className="flex flex-col mb-4 shrink-0">
            <div className="flex flex-wrap items-center bg-[#111111] p-1 rounded-xl border border-white/5 w-full xl:w-fit shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] gap-1">
              <button 
                onClick={() => setActiveTab("kanban")}
                className={`flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-bold transition-all duration-300 ${activeTab === "kanban" ? "bg-purple-500/10 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.1)] border border-purple-500/20" : "text-gray-500 border border-transparent hover:text-gray-300 hover:bg-white/5"}`}
              >
                <CheckCheck className="w-3.5 h-3.5" /> Quadro Kanban
              </button>
              <button 
                onClick={() => setActiveTab("divergencia")}
                className={`flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-bold transition-all duration-300 ${activeTab === "divergencia" ? "bg-[#00FF00]/10 text-[#00E500] shadow-[0_0_10px_rgba(0,255,0,0.1)] border border-[#00FF00]/20" : "text-gray-500 border border-transparent hover:text-gray-300 hover:bg-white/5"}`}
              >
                <AlertTriangle className="w-3.5 h-3.5" /> Divergência
              </button>
              <button 
                onClick={() => setActiveTab("insumos")}
                className={`flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-bold transition-all duration-300 ${activeTab === "insumos" ? "bg-[#00FF00]/10 text-[#00E500] shadow-[0_0_10px_rgba(0,255,0,0.1)] border border-[#00FF00]/20" : "text-gray-500 border border-transparent hover:text-gray-300 hover:bg-white/5"}`}
              >
                <Box className="w-3.5 h-3.5" /> Alerta Insumos
              </button>
              <button 
                onClick={() => setActiveTab("historico")}
                className={`flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-bold transition-all duration-300 ${activeTab === "historico" ? "bg-blue-500/10 text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.1)] border border-blue-500/20" : "text-gray-500 border border-transparent hover:text-gray-300 hover:bg-white/5"}`}
              >
                <Clock className="w-3.5 h-3.5" /> Meus Chamados
              </button>
            </div>
          </div>

          {activeTab === "divergencia" && (
            <form onSubmit={handleSubmit} className="space-y-3 flex-1 flex flex-col animate-in fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-gray-500">
                    Código SKU ou Produto
                  </label>
                  <Input 
                    value={sku}
                    onChange={(e) => setSku(e.target.value.toUpperCase())}
                    placeholder="Ex: KITGAS001"
                    className="bg-black/20 border-white/10 h-9 text-xs focus-visible:ring-1 focus-visible:ring-[#00FF00]/30 focus-visible:border-[#00FF00]/30 text-white placeholder:text-gray-600 shadow-inner"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-gray-500">
                    Canal de Venda
                  </label>
                  <Select value={marketplace} onValueChange={setMarketplace}>
                    <SelectTrigger className="w-full bg-black/20 border border-white/10 h-9 rounded-md px-3 text-xs focus:ring-1 focus:ring-[#00FF00]/30 focus:border-[#00FF00]/30 outline-none text-white shadow-inner">
                      <SelectValue placeholder="Selecione o Canal" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#111111] border-white/10 text-white">
                      <SelectItem value="Mercado Livre" className="hover:bg-white/10 focus:bg-white/10 focus:text-white cursor-pointer">Mercado Livre</SelectItem>
                      <SelectItem value="Shopee" className="hover:bg-white/10 focus:bg-white/10 focus:text-white cursor-pointer">Shopee</SelectItem>
                      <SelectItem value="Amazon" className="hover:bg-white/10 focus:bg-white/10 focus:text-white cursor-pointer">Amazon</SelectItem>
                      <SelectItem value="Magalu" className="hover:bg-white/10 focus:bg-white/10 focus:text-white cursor-pointer">Magalu</SelectItem>
                      <SelectItem value="Site Oficial" className="hover:bg-white/10 focus:bg-white/10 focus:text-white cursor-pointer">Site Oficial</SelectItem>
                      <SelectItem value="Geral (Todos)" className="hover:bg-white/10 focus:bg-white/10 focus:text-white cursor-pointer">Geral (Todos)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1 flex-1 flex flex-col">
                <label className="text-[9px] font-bold uppercase tracking-widest text-gray-500">
                  Descrição do Erro
                </label>
                <Textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ex: A foto mostra 3 itens, mas a embalagem só comporta 2. Precisa arrumar a imagem..."
                  className="bg-black/20 border-white/10 flex-1 min-h-[50px] text-xs focus-visible:ring-1 focus-visible:ring-[#00FF00]/30 focus-visible:border-[#00FF00]/30 text-white placeholder:text-gray-600 resize-none shadow-inner py-2"
                />
              </div>

              {/* Upload de Evidências */}
              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase tracking-widest text-gray-500">
                  Evidências (Fotos/Vídeos)
                </label>
                <div className="bg-black/20 border border-dashed border-white/20 rounded-xl p-3 flex flex-col items-center justify-center gap-1.5 hover:border-[#00FF00]/50 hover:bg-[#00FF00]/5 transition-colors group relative cursor-pointer">
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#00FF00]/10 transition-colors">
                      <UploadCloud className="w-4 h-4 text-gray-400 group-hover:text-[#00FF00] transition-colors" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Anexar foto ou vídeo</p>
                      <p className="text-[10px] text-gray-500">Ou arraste e solte</p>
                    </div>
                  </div>
                </div>
                
                {/* Lista de Arquivos Anexados */}
                {evidenceFiles.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-1.5">
                    {evidenceFiles.map((file, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 bg-[#1A1A1A] border border-white/10 px-2 py-1 rounded-md">
                        <ImageIcon className="w-3.5 h-3.5 text-[#00FF00]" />
                        <span className="text-[10px] text-gray-300 max-w-[80px] truncate">{file.name}</span>
                        <button 
                          type="button" 
                          onClick={() => removeFile(idx)}
                          className="text-gray-500 hover:text-red-500 transition-colors ml-0.5 z-10 relative"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase tracking-widest text-gray-500">
                  Nível de Urgência
                </label>
                <div className="flex gap-2">
                  <label className={`flex-1 flex items-center justify-center gap-1.5 border py-2 rounded-lg cursor-pointer transition-all duration-300 ${priority === 'normal' ? 'bg-[#00FF00]/10 border-[#00FF00]/30 text-[#00E500]' : 'bg-[#111111] border-white/5 text-gray-500 hover:bg-white/5'}`}>
                    <input 
                      type="radio" 
                      name="priority" 
                      value="normal" 
                      checked={priority === 'normal'} 
                      onChange={() => setPriority('normal')}
                      className="hidden" 
                    />
                    <CheckCircle2 className="w-3.5 h-3.5" /> <span className="text-xs">Pode esperar</span>
                  </label>

                  <label className={`flex-1 flex items-center justify-center gap-1.5 border py-2 rounded-lg cursor-pointer transition-all duration-300 ${priority === 'critico' ? 'bg-red-500/20 border-red-500/50 text-red-500' : 'bg-[#111111] border-white/5 text-gray-500 hover:bg-white/5'}`}>
                    <input 
                      type="radio" 
                      name="priority" 
                      value="critico" 
                      checked={priority === 'critico'} 
                      onChange={() => setPriority('critico')}
                      className="hidden" 
                    />
                    <AlertTriangle className="w-3.5 h-3.5" /> <span className="text-xs">Parou a Expedição!</span>
                  </label>
                </div>
              </div>

              <div className="pt-1">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full h-10 bg-gradient-to-r from-[#00E500] to-[#00CC00] hover:from-[#00FF00] hover:to-[#00D900] text-black font-extrabold text-sm rounded-lg shadow-[0_4px_15px_rgba(0,255,0,0.15)] border border-[#00FF00]/50 transition-all duration-300"
                >
                  {isSubmitting ? "Enviando Chamado..." : (
                    <span className="flex items-center gap-2">
                      Enviar para Triagem <Send className="w-3.5 h-3.5" />
                    </span>
                  )}
                </Button>
              </div>
            </form>
          )}

          {activeTab === "insumos" && (
            <form onSubmit={handleSupplySubmit} className="space-y-3 flex-1 flex flex-col animate-in fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-gray-500">
                    Nome do Item / Insumo
                  </label>
                  <Input 
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value.toUpperCase())}
                    placeholder="Ex: Caixa Parda 30x20x10"
                    className="bg-black/20 border-white/10 h-9 text-xs focus-visible:ring-1 focus-visible:ring-[#00FF00]/30 focus-visible:border-[#00FF00]/30 text-white placeholder:text-gray-600 shadow-inner"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-gray-500">
                    Categoria
                  </label>
                  <Select value={itemCategory} onValueChange={setItemCategory}>
                    <SelectTrigger className="w-full bg-black/20 border border-white/10 h-9 rounded-md px-3 text-xs focus:ring-1 focus:ring-[#00FF00]/30 focus:border-[#00FF00]/30 outline-none text-white shadow-inner">
                      <SelectValue placeholder="Selecione a Categoria" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#111111] border-white/10 text-white">
                      <SelectItem value="Embalagem (Caixa, Fita, etc)" className="hover:bg-white/10 focus:bg-white/10 focus:text-white cursor-pointer">Embalagem (Caixa, Fita, Plástico)</SelectItem>
                      <SelectItem value="Produto Físico" className="hover:bg-white/10 focus:bg-white/10 focus:text-white cursor-pointer">Produto Físico (Acabou no Estoque)</SelectItem>
                      <SelectItem value="Brindes/Folders" className="hover:bg-white/10 focus:bg-white/10 focus:text-white cursor-pointer">Brindes e Folders</SelectItem>
                      <SelectItem value="Material Administrativo" className="hover:bg-white/10 focus:bg-white/10 focus:text-white cursor-pointer">Material Administrativo (Papel, Tinta)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1 flex-1">
                <label className="text-[9px] font-bold uppercase tracking-widest text-gray-500">
                  Quantidade Restante Estimada
                </label>
                <Input 
                  value={remainingQty}
                  onChange={(e) => setRemainingQty(e.target.value)}
                  placeholder="Ex: Tem apenas mais 1 pacote fechado"
                  className="bg-black/20 border-white/10 h-9 text-xs focus-visible:ring-1 focus-visible:ring-[#00FF00]/30 focus-visible:border-[#00FF00]/30 text-white placeholder:text-gray-600 shadow-inner"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase tracking-widest text-gray-500">
                  Nível de Urgência
                </label>
                <div className="flex gap-2">
                  <label className={`flex-1 flex items-center justify-center gap-1.5 border py-2 rounded-lg cursor-pointer transition-all duration-300 ${supplyPriority === 'normal' ? 'bg-[#00FF00]/10 border-[#00FF00]/30 text-[#00FF00]' : 'bg-[#111111] border-white/5 text-gray-500 hover:bg-white/5'}`}>
                    <input 
                      type="radio" 
                      name="supplyPriority" 
                      value="normal" 
                      checked={supplyPriority === 'normal'} 
                      onChange={() => setSupplyPriority('normal')}
                      className="hidden" 
                    />
                    <CheckCircle2 className="w-3.5 h-3.5" /> <span className="text-xs">Dá pra usar hoje</span>
                  </label>

                  <label className={`flex-1 flex items-center justify-center gap-1.5 border py-2 rounded-lg cursor-pointer transition-all duration-300 ${supplyPriority === 'critico' ? 'bg-red-500/20 border-red-500/50 text-red-500' : 'bg-[#111111] border-white/5 text-gray-500 hover:bg-white/5'}`}>
                    <input 
                      type="radio" 
                      name="supplyPriority" 
                      value="critico" 
                      checked={supplyPriority === 'critico'} 
                      onChange={() => setSupplyPriority('critico')}
                      className="hidden" 
                    />
                    <AlertTriangle className="w-3.5 h-3.5" /> <span className="text-xs">Acabou / Parou tudo!</span>
                  </label>
                </div>
              </div>

              <div className="pt-1">
                <Button 
                  type="submit" 
                  disabled={isSubmittingSupply}
                  className="w-full h-10 bg-gradient-to-r from-[#00FF00] to-[#00CC00] hover:from-[#00CC00] hover:to-[#009900] text-black font-extrabold text-sm rounded-lg shadow-[0_4px_15px_rgba(0,255,0,0.2)] border border-[#00FF00]/50 transition-all duration-300"
                >
                  {isSubmittingSupply ? "Notificando Compras..." : (
                    <span className="flex items-center gap-2">
                      Avisar Falta de Insumo <Box className="w-3.5 h-3.5" />
                    </span>
                  )}
                </Button>
              </div>
            </form>
          )}

          {activeTab === "kanban" && (
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden animate-in fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full pb-2">
                
                {/* Coluna: Aguardando */}
                <div className="bg-[#141414] border border-white/5 rounded-xl flex flex-col overflow-hidden">
                  <div className="p-3 border-b border-white/5 bg-black/20 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2 text-yellow-500 font-bold text-sm">
                      <Clock className="w-4 h-4" /> Triagem / Aguardando
                    </div>
                    <span className="bg-white/10 text-white text-[10px] px-2 py-0.5 rounded-full">{tickets.filter(t => t.status === 'aguardando').length}</span>
                  </div>
                  <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
                    {tickets.filter(t => t.status === 'aguardando').map(ticket => {
                      const elapsedMinutes = Math.floor((currentTime - (ticket.createdAt || Date.now())) / 60000);
                      const isCriticalTimer = ticket.priority === 'critico';
                      
                      let borderClass = ticket.type === 'produto' ? 'border-orange-500/30' : ticket.type === 'insumo' ? 'border-yellow-500/30' : ticket.type === 'risco' ? 'border-red-500/30' : 'border-[#00FF00]/30';
                      let pulseClass = '';
                      let bgClass = 'bg-[#1A1A1A]';

                      if (isCriticalTimer) {
                        if (elapsedMinutes > 120) {
                          borderClass = 'border-red-500';
                          pulseClass = 'animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.3)]';
                          bgClass = 'bg-red-950/40';
                        } else if (elapsedMinutes > 60) {
                          borderClass = 'border-red-500/80';
                          bgClass = 'bg-red-900/20';
                        } else if (elapsedMinutes > 30) {
                          borderClass = 'border-orange-500/80';
                        }
                      }

                      return (
                      <div key={ticket.id} className={`${bgClass} border ${borderClass} ${pulseClass} hover:border-white/30 transition-all rounded-lg p-3 group relative overflow-hidden mt-2`}>
                        {isCriticalTimer && elapsedMinutes > 0 && (
                          <div className="absolute top-0 right-0 bg-red-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-bl-lg z-10 flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" /> Sangrando há {elapsedMinutes > 60 ? `${Math.floor(elapsedMinutes/60)}h ${elapsedMinutes%60}m` : `${elapsedMinutes}m`}
                          </div>
                        )}
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded flex items-center gap-1 w-fit ${ticket.type === 'produto' ? 'bg-orange-500/10 text-orange-500' : ticket.type === 'insumo' ? 'bg-yellow-500/10 text-yellow-500' : ticket.type === 'risco' ? 'bg-red-500/10 text-red-500' : 'bg-[#00FF00]/10 text-[#00FF00]'}`}>
                            {ticket.type === 'produto' ? <Package className="w-3 h-3" /> : ticket.type === 'insumo' ? <Box className="w-3 h-3" /> : ticket.type === 'risco' ? <AlertTriangle className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />} 
                            {ticket.type === 'produto' ? 'Falta Produto' : ticket.type === 'insumo' ? 'Falta Insumo' : ticket.type === 'risco' ? 'Risco Comercial' : 'Divergência'}
                          </span>
                          <span className="text-[9px] text-gray-600">{ticket.time}</span>
                        </div>
                        <h4 className="text-white font-medium text-sm leading-tight mb-1">{ticket.title}</h4>
                        <p className="text-xs text-gray-400 mb-4 line-clamp-3">{ticket.description}</p>
                        
                        <div className="flex flex-col gap-2 relative z-10">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-gray-500">De: <strong className="text-gray-300">{ticket.author}</strong></span>
                            {ticket.priority === 'critico' && !isCriticalTimer && <span className="text-red-500 flex items-center gap-1 text-[9px] font-bold uppercase"><AlertTriangle className="w-3 h-3" /> Parou tudo!</span>}
                          </div>
                          <div className="grid grid-cols-2 gap-2 mt-1">
                            <button onClick={() => changeTicketStatus(ticket.id, 'aprovado')} className="flex items-center justify-center gap-1 bg-[#00FF00]/10 hover:bg-[#00FF00]/20 text-[#00FF00] border border-[#00FF00]/30 rounded py-1.5 text-xs font-bold transition-colors">
                              <CheckCircle className="w-3.5 h-3.5" /> Resolver
                            </button>
                            <button onClick={() => changeTicketStatus(ticket.id, 'recusado')} className="flex items-center justify-center gap-1 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 rounded py-1.5 text-xs font-bold transition-colors">
                              <XCircle className="w-3.5 h-3.5" /> Recusar
                            </button>
                          </div>
                        </div>
                      </div>
                    )})}
                  </div>
                </div>

                {/* Coluna: Resolvido / Aprovado */}
                <div className="bg-[#141414] border border-white/5 rounded-xl flex flex-col overflow-hidden">
                  <div className="p-3 border-b border-white/5 bg-black/20 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2 text-[#00FF00] font-bold text-sm">
                      <CheckCircle2 className="w-4 h-4" /> Resolvido
                    </div>
                    <span className="bg-white/10 text-white text-[10px] px-2 py-0.5 rounded-full">{tickets.filter(t => t.status === 'aprovado').length}</span>
                  </div>
                  <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
                    {tickets.filter(t => t.status === 'aprovado').map(ticket => (
                      <div key={ticket.id} className="bg-black/40 border border-[#00FF00]/20 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2 opacity-70">
                          <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded flex items-center gap-1 w-fit ${ticket.type === 'produto' ? 'bg-orange-500/10 text-orange-500' : ticket.type === 'insumo' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-[#00FF00]/10 text-[#00FF00]'}`}>
                            {ticket.type === 'produto' ? <Package className="w-3 h-3" /> : ticket.type === 'insumo' ? <Box className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />} 
                            {ticket.type === 'produto' ? 'Produto' : ticket.type === 'insumo' ? 'Insumo' : 'Divergência'}
                          </span>
                        </div>
                        <h4 className="text-gray-300 font-medium text-sm leading-tight mb-1">{ticket.title}</h4>
                        <p className="text-[11px] text-gray-500">{ticket.description}</p>
                        <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-2">
                          <span className="text-[10px] text-gray-600">De: {ticket.author}</span>
                          <button onClick={() => changeTicketStatus(ticket.id, 'aguardando')} className="text-[10px] text-gray-500 hover:text-white underline">Reverter</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Coluna: Recusado */}
                <div className="bg-[#141414] border border-white/5 rounded-xl flex flex-col overflow-hidden">
                  <div className="p-3 border-b border-white/5 bg-black/20 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2 text-red-500 font-bold text-sm">
                      <XCircle className="w-4 h-4" /> Recusado
                    </div>
                    <span className="bg-white/10 text-white text-[10px] px-2 py-0.5 rounded-full">{tickets.filter(t => t.status === 'recusado').length}</span>
                  </div>
                  <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
                    {tickets.filter(t => t.status === 'recusado').map(ticket => (
                      <div key={ticket.id} className="bg-black/40 border border-red-500/20 rounded-lg p-3 opacity-75 grayscale-[30%]">
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded flex items-center gap-1 w-fit ${ticket.type === 'produto' ? 'bg-orange-500/10 text-orange-500' : ticket.type === 'insumo' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-[#00FF00]/10 text-[#00FF00]'}`}>
                            {ticket.type === 'produto' ? <Package className="w-3 h-3" /> : ticket.type === 'insumo' ? <Box className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />} 
                            {ticket.type === 'produto' ? 'Produto' : ticket.type === 'insumo' ? 'Insumo' : 'Divergência'}
                          </span>
                        </div>
                        <h4 className="text-gray-400 line-through font-medium text-sm leading-tight mb-1">{ticket.title}</h4>
                        <p className="text-[11px] text-gray-500">{ticket.description}</p>
                        <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-2">
                          <span className="text-[10px] text-gray-600">De: {ticket.author}</span>
                          <button onClick={() => changeTicketStatus(ticket.id, 'aguardando')} className="text-[10px] text-gray-500 hover:text-white underline">Reverter</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {activeTab === "historico" && (
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 animate-in fade-in duration-300">
              {tickets.length === 0 ? (
                <p className="text-gray-500 text-xs text-center mt-10">Nenhum chamado aberto ainda.</p>
              ) : (
                tickets.map(ticket => (
                  <div key={ticket.id} className={`bg-[#1a1a1a] border border-white/5 rounded-xl p-4 transition-colors ${ticket.type === 'produto' ? 'hover:border-orange-500/40' : ticket.type === 'insumo' ? 'hover:border-yellow-500/40' : 'hover:border-[#00FF00]/40'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md flex items-center gap-1.5 ${ticket.type === 'produto' ? 'bg-orange-500/10 text-orange-500' : ticket.type === 'insumo' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-[#00FF00]/10 text-[#00FF00]'}`}>
                        {ticket.type === 'produto' ? <Package className="w-3 h-3" /> : ticket.type === 'insumo' ? <Box className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />} 
                        {ticket.type === 'produto' ? 'Falta Produto' : ticket.type === 'insumo' ? 'Insumo' : 'Divergência'}
                      </span>
                      <span className="bg-white/5 text-gray-400 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md flex items-center gap-1">
                        {ticket.status === 'aprovado' ? <CheckCircle2 className="w-3 h-3 text-[#00FF00]" /> : ticket.status === 'recusado' ? <XCircle className="w-3 h-3 text-red-500" /> : <Clock className="w-3 h-3 text-yellow-500" />} 
                        {ticket.status === 'aprovado' ? 'Resolvido' : ticket.status === 'recusado' ? 'Recusado' : 'Aguardando'}
                      </span>
                    </div>
                    <h4 className="text-white font-bold text-sm mb-1">{ticket.title}</h4>
                    <p className="text-gray-400 text-xs mb-3">{ticket.description}</p>
                    <div className="flex items-center justify-between text-[10px] text-gray-500 border-t border-white/5 pt-3 mt-1">
                      <div className="flex items-center gap-3">
                        <span>Por: {ticket.author}</span>
                        {ticket.priority === 'critico' || ticket.priority === 'alta' ? (
                          <span className="text-red-500 flex items-center gap-1 font-bold uppercase tracking-wider"><AlertTriangle className="w-3 h-3" /> Crítico</span>
                        ) : (
                          <span className="text-[#00FF00] flex items-center gap-1 font-bold uppercase tracking-wider"><CheckCircle2 className="w-3 h-3" /> Normal</span>
                        )}
                      </div>
                      <span>{ticket.time}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Chat Integrado (Agora na Esquerda com order-1) */}
        <div className="w-full lg:w-[35%] order-1 bg-[#121212] border border-white/5 rounded-2xl flex flex-col overflow-hidden h-full shadow-2xl relative">
          
          <div className="px-4 py-3 bg-[#121212] flex flex-col justify-center shrink-0">
            <h1 className="text-xl font-light text-white tracking-tighter flex items-center gap-2">
              <Package className="w-5 h-5 text-[#00FF00]" />
              Portal da <span className="font-bold">Expedição</span>
            </h1>
            <p className="text-gray-400 text-xs ml-7 mt-0.5">
              Hub centralizado para comunicação e aprovações
            </p>
          </div>

          <div className="bg-[#181818] border-b border-t border-white/5 px-4 py-3 shrink-0 relative overflow-hidden flex flex-col gap-2">
            {!activeRoom ? (
              <>
                <div className="flex items-center gap-1.5 text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">
                  <Radio className="w-3.5 h-3.5 text-[#00FF00]" /> Rádio Operacional
                </div>
                <div className="flex gap-2">
                  <button onClick={() => joinRoom("Mesa da Mara")} className="flex-1 bg-[#222] hover:bg-[#2A2A2A] border border-white/5 rounded-lg p-2 flex items-center gap-2 transition-colors group">
                    <Avatar className="w-7 h-7 border border-white/10 group-hover:border-[#00FF00]/50 transition-colors">
                      <AvatarFallback className="bg-purple-500/20 text-purple-400 text-[10px] font-bold">MA</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start">
                      <span className="text-white text-xs font-bold">Mesa da Mara</span>
                      <span className="text-[9px] text-[#00FF00]">Livre</span>
                    </div>
                  </button>
                  <button onClick={() => joinRoom("Equipe Base")} className="flex-1 bg-[#222] hover:bg-[#2A2A2A] border border-white/5 rounded-lg p-2 flex items-center gap-2 transition-colors group">
                    <div className="w-7 h-7 rounded-full bg-blue-500/20 border border-white/10 group-hover:border-blue-500/50 flex items-center justify-center text-blue-400">
                      <Package className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-white text-xs font-bold">Equipe Base</span>
                      <span className="text-[9px] text-[#00FF00]">3 online</span>
                    </div>
                  </button>
                </div>
              </>
            ) : (
              <div className="bg-[#0A2010] border border-[#00FF00]/30 rounded-xl p-3 flex flex-col gap-3 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#00FF00] to-transparent animate-pulse" />
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Avatar className="w-8 h-8 border border-[#00FF00]/50">
                        <AvatarFallback className="bg-purple-500/20 text-purple-400 text-xs font-bold">
                          {activeRoom === "Mesa da Mara" ? "MA" : "EQ"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#00FF00] border-2 border-[#0A2010] rounded-full animate-pulse" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-white text-sm font-bold">{activeRoom}</span>
                      <span className="text-[#00FF00] text-[10px] font-bold tracking-wider uppercase">
                        {isCalling ? "Chamando..." : `Ao Vivo • ${Math.floor(callDuration/60).toString().padStart(2, '0')}:${(callDuration%60).toString().padStart(2, '0')}`}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setIsRadioMuted(!isRadioMuted)} 
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${isRadioMuted ? 'bg-red-500/20 text-red-500 border border-red-500/30' : 'bg-white/10 text-white hover:bg-white/20'}`}
                    >
                      {isRadioMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </button>
                    <button 
                      onClick={leaveRoom} 
                      className="w-9 h-9 rounded-full bg-red-600 hover:bg-red-500 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)] flex items-center justify-center transition-all"
                    >
                      <PhoneOff className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 p-3 overflow-y-auto flex flex-col gap-3">
            <div className="flex justify-center my-1">
              <span className="text-[9px] font-bold uppercase tracking-widest text-gray-600 flex items-center gap-1.5">
                <Clock className="w-2.5 h-2.5" /> Hoje
              </span>
            </div>

            {messages.map((msg, index) => {
              const prevMsg = index > 0 ? messages[index - 1] : null;
              
              let isGrouped = false;
              if (prevMsg && prevMsg.sender === msg.sender) {
                const [h1, m1] = prevMsg.time.split(':').map(Number);
                const [h2, m2] = msg.time.split(':').map(Number);
                const diff = (h2 * 60 + m2) - (h1 * 60 + m1);
                if (diff >= 0 && diff <= 5) {
                  isGrouped = true;
                }
              }

              return (
              <div key={msg.id} className={`flex gap-2.5 ${msg.isMe ? 'flex-row-reverse' : ''} ${isGrouped ? 'mt-0.5' : 'mt-2'}`}>
                <div className="w-6 flex shrink-0 justify-center">
                  {!isGrouped && (
                    <Avatar className="h-6 w-6 mt-1">
                      <AvatarFallback className={`text-[10px] font-bold ${msg.isMe ? 'bg-[#00FF00]/20 text-[#00FF00]' : msg.color}`}>{msg.initials}</AvatarFallback>
                    </Avatar>
                  )}
                </div>
                <div className={`flex flex-col ${msg.isMe ? 'items-end' : ''}`}>
                  {!isGrouped && (
                    <div className={`flex items-baseline gap-1.5 mb-0.5 ${msg.isMe ? 'flex-row-reverse' : ''}`}>
                      <span className="text-[11px] font-bold text-gray-300">{msg.sender}</span>
                      <span className="text-[9px] text-gray-500">{msg.time}</span>
                    </div>
                  )}
                  <div className="relative group/bubble flex items-center gap-2">
                    {msg.isMe && msg.text && (
                      <button 
                        onClick={() => createTicketFromMessage(msg)}
                        title="Converter em Chamado"
                        className="opacity-0 group-hover/bubble:opacity-100 transition-all p-1.5 bg-purple-500/10 hover:bg-purple-500 border border-purple-500/20 hover:border-purple-500 text-purple-400 hover:text-white rounded-full shadow-sm"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    )}
                    
                    <div className={`px-3 py-2 text-[13px] border leading-snug max-w-[260px] shadow-sm break-words overflow-hidden ${
                      msg.isMe 
                        ? `bg-[#1A3A2A] text-gray-100 border-[#00FF00]/10 ${isGrouped ? 'rounded-xl' : 'rounded-xl rounded-tr-sm'}` 
                        : `bg-[#1C1C1E] text-gray-300 border-white/5 ${isGrouped ? 'rounded-xl' : 'rounded-xl rounded-tl-sm'}`
                    }`}>
                      {(msg as any).imageUrl && (
                        <img 
                          src={(msg as any).imageUrl} 
                          alt="Anexo" 
                          onLoad={scrollToBottom}
                          className="w-full rounded-md mb-2 object-cover max-h-[150px]" 
                        />
                      )}
                      {(msg as any).isAudio && (
                        <div className="mb-2 w-full min-w-[200px]">
                          <audio controls src={(msg as any).audioUrl} className="h-8 w-full max-w-[220px] outline-none" />
                        </div>
                      )}
                      {msg.text && <div>{msg.text}</div>}
                    </div>

                    {!msg.isMe && msg.text && (
                      <button 
                        onClick={() => createTicketFromMessage(msg)}
                        title="Converter em Chamado"
                        className="opacity-0 group-hover/bubble:opacity-100 transition-all p-1.5 bg-purple-500/10 hover:bg-purple-500 border border-purple-500/20 hover:border-purple-500 text-purple-400 hover:text-white rounded-full shadow-sm"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  {msg.isMe && !isGrouped && (
                    <div className="mt-1 mr-1">
                      <CheckCheck className="w-3.5 h-3.5 text-gray-600" />
                    </div>
                  )}
                </div>
              </div>
            )})}
            <div ref={chatEndRef} className="mt-auto" />
          </div>

          <div className="p-3 bg-[#181818] border-t border-white/5">
            {/* Quick Replies Clean */}
            <div className="flex gap-4 mb-1 px-2 overflow-x-auto custom-scrollbar">
              <button type="button" onClick={() => sendChatMessage("👍 Ciente. Pode prosseguir.")} className="whitespace-nowrap text-[10px] font-bold text-gray-500 hover:text-[#00FF00] transition-colors">
                👍 Ciente
              </button>
              <button type="button" onClick={() => sendChatMessage("✅ Aprovado. Liberado para envio.")} className="whitespace-nowrap text-[10px] font-bold text-gray-500 hover:text-[#00FF00] transition-colors">
                ✅ Aprovado
              </button>
              <button type="button" onClick={() => sendChatMessage("❌ Segura o pedido. Vou verificar.")} className="whitespace-nowrap text-[10px] font-bold text-gray-500 hover:text-red-500 transition-colors">
                ❌ Segura
              </button>
              <button type="button" onClick={() => sendChatMessage("📦 Abre um chamado de Falta de Estoque.")} className="whitespace-nowrap text-[10px] font-bold text-gray-500 hover:text-blue-400 transition-colors">
                📦 Chamado
              </button>
            </div>
            
            <form onSubmit={handleChatSubmit} className="relative mt-2">
              <input 
                type="file" 
                accept="image/*" 
                ref={fileInputRef} 
                onChange={handleChatFileChange} 
                className="hidden" 
              />
              <div className="flex items-center bg-[#111111] rounded-full border border-white/5 focus-within:border-white/10 transition-colors pr-1.5 pl-2 h-10">
                <button type="button" onClick={() => fileInputRef.current?.click()} className="p-1.5 text-gray-500 hover:text-[#00FF00] transition-colors rounded-full shrink-0">
                  <Paperclip className="w-4 h-4" />
                </button>
                {isRecording ? (
                  <button type="button" onClick={stopRecording} className="p-1.5 text-red-500 hover:text-red-400 transition-colors rounded-full shrink-0 animate-pulse bg-red-500/10">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h12v12H6z"/></svg>
                  </button>
                ) : (
                  <button type="button" onClick={startRecording} className="p-1.5 text-gray-500 hover:text-[#00FF00] transition-colors rounded-full shrink-0">
                    <Mic className="w-4 h-4" />
                  </button>
                )}
                <Input 
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder={isRecording ? "Gravando áudio..." : "Responder..."} 
                  disabled={isRecording}
                  className="flex-1 bg-transparent border-0 h-full text-sm focus-visible:ring-0 text-white placeholder:text-gray-600 shadow-none px-1 disabled:opacity-50"
                />
                <button 
                  type="submit" 
                  disabled={!chatMessage.trim()}
                  className="h-7 w-7 rounded-full flex items-center justify-center transition-all shrink-0 disabled:opacity-30 text-[#00FF00] hover:bg-[#00FF00]/10"
                >
                  <Send className="w-3.5 h-3.5 ml-0.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

    </div>
  );
}
