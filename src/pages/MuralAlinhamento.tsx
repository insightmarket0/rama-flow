import React, { useState } from "react";
import { 
  Megaphone,
  Pin,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Plus,
  X,
  MessageSquare
} from "lucide-react";
import { InternalAnnouncement } from "@/integrations/supabase/internal_announcements";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

const FULL_TEAM = [
  { id: "user_manager", name: "Anderson" },
  { id: "user_operacao_1", name: "Will Mendes" },
  { id: "user_operacao_2", name: "Rogério" },
  { id: "user_design", name: "Alyson" }
];

const MOCK_ANNOUNCEMENTS: InternalAnnouncement[] = [
  {
    id: "1",
    creator_id: "user_manager",
    title: "Padrão de Imagens - Kits de Gás",
    content: "Atenção nas fotos dos kits de gás: verifiquem as imagens do fornecedor antes de subir. Se o kit é de apenas uma abraçadeira, a foto não pode ter duas abraçadeiras. Corrijam a imagem antes de publicar.",
    is_pinned: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 dia atrás
    creator: { full_name: "Anderson • Direção", avatar_url: "" },
    acknowledgments: [
      { id: "ack_1", announcement_id: "1", user_id: "user_operacao_1", acknowledged_at: new Date().toISOString(), user: { full_name: "Will Mendes • Comercial", avatar_url: "" } }
    ]
  },
  {
    id: "2",
    creator_id: "user_chefe",
    title: "Cuidado com Marcas Não Autorizadas",
    content: "Aviso geral: muita atenção ao clonar anúncios da Shopee. Lembrem sempre de retirar a marca do título e da descrição para evitar bloqueios e perda do anúncio.",
    is_pinned: false,
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 horas atrás
    creator: { full_name: "Rogério • Operação", avatar_url: "" },
    acknowledgments: []
  }
];

const getInitials = (name?: string) => {
  if (!name) return "U";
  const parts = name.split("•")[0].trim().split(" ");
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.substring(0, 2).toUpperCase();
};

export default function MuralAlinhamento() {
  const [announcements, setAnnouncements] = useState<InternalAnnouncement[]>(MOCK_ANNOUNCEMENTS);
  // Simula o ID do usuário logado (ex: você)
  const CURRENT_USER_ID = "user_manager"; 

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [isPinned, setIsPinned] = useState(false);
  
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  const handleAddComment = (id: string) => {
    const text = commentInputs[id];
    if (!text?.trim()) return;
    
    setAnnouncements(announcements.map(a => {
      if (a.id === id) {
        const newComment = { author: "Você", text: text.trim() };
        return { ...a, comments: [...(a.comments || []), newComment] };
      }
      return a;
    }));
    
    setCommentInputs({...commentInputs, [id]: ""});
  };

  const handleAcknowledge = (id: string) => {
    setAnnouncements(announcements.map(a => {
      if (a.id === id) {
        const newAck = {
          id: `ack_temp_${Date.now()}`,
          announcement_id: id,
          user_id: CURRENT_USER_ID,
          acknowledged_at: new Date().toISOString(),
          user: { full_name: "Anderson • Direção", avatar_url: "" }
        };
        return { ...a, acknowledgments: [...(a.acknowledgments || []), newAck] };
      }
      return a;
    }));
  };

  const togglePin = (id: string) => {
    setAnnouncements(announcements.map(a => {
      if (a.id === id) {
        return { ...a, is_pinned: !a.is_pinned };
      }
      return a;
    }).sort((a, b) => {
      // Ordena fixados primeiro
      if (a.is_pinned === b.is_pinned) return 0;
      return a.is_pinned ? -1 : 1;
    }));
  };

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newContent) return;

    const newAnnouncement: InternalAnnouncement = {
      id: Math.random().toString(),
      creator_id: CURRENT_USER_ID,
      title: newTitle,
      content: newContent,
      is_pinned: isPinned,
      created_at: new Date().toISOString(),
      creator: { full_name: "Anderson • Direção", avatar_url: "" },
      acknowledgments: []
    };

    setAnnouncements([newAnnouncement, ...announcements]);
    setIsModalOpen(false);
    setNewTitle("");
    setNewContent("");
    setIsPinned(false);
  };

  return (
    <div className="flex-1 p-4 md:p-8 pt-6 animate-in fade-in duration-500 w-full overflow-y-auto">
      
      {/* Header Centralizado */}
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h2 className="text-3xl md:text-4xl font-light tracking-tight text-white flex items-center gap-4">
            <Megaphone className="h-8 w-8 md:h-10 md:w-10 text-[#00FF00] drop-shadow-[0_0_10px_rgba(0,255,0,0.3)]" />
            Mural de Alinhamento
          </h2>
          <p className="text-gray-400 mt-2 text-sm md:text-base font-medium tracking-wide">
            Feed oficial de comunicados, processos e prevenção de erros da operação.
          </p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="shrink-0 flex items-center justify-center gap-2 bg-[#00FF00]/10 hover:bg-[#00FF00]/20 text-[#00FF00] border border-[#00FF00]/30 px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-[0_0_15px_rgba(0,255,0,0.1)] hover:shadow-[0_0_20px_rgba(0,255,0,0.2)]"
        >
          <Plus className="h-4 w-4" strokeWidth={3} />
          Novo Aviso
        </button>
      </div>

      {/* Feed Layout */}
      <div className="max-w-4xl mx-auto flex flex-col gap-6 pb-20">
        {announcements.map((announcement) => {
          const hasAcknowledged = announcement.acknowledgments?.some(ack => ack.user_id === CURRENT_USER_ID);
          const pinned = announcement.is_pinned;

          return (
            <div 
              key={announcement.id} 
              className={`w-full bg-[#050505]/60 backdrop-blur-2xl border rounded-2xl p-6 md:p-8 shadow-2xl transition-all group hover:bg-[#0a0a0a]/80 ${
                pinned ? 'border-[#00FF00]/20 shadow-[0_4px_30px_rgba(0,255,0,0.03)]' : 'border-white/5 hover:border-white/10'
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-5">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center border border-white/10 text-white font-bold text-sm md:text-base shadow-inner shrink-0">
                    {getInitials(announcement.creator?.full_name)}
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm md:text-base tracking-wide">
                      {announcement.creator?.full_name}
                    </h4>
                    <span className="text-[9px] md:text-[10px] uppercase tracking-widest text-gray-500 font-bold flex items-center gap-1.5 mt-0.5">
                      <Clock className="h-3 w-3" />
                      {format(parseISO(announcement.created_at), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                    </span>
                  </div>
                </div>
                
                <button 
                  onClick={() => togglePin(announcement.id)}
                  className={`shrink-0 flex items-center gap-1.5 transition-all cursor-pointer text-[10px] uppercase tracking-widest font-bold ${
                    pinned 
                      ? 'text-[#00FF00] hover:text-red-500' 
                      : 'text-gray-500 opacity-50 hover:opacity-100 hover:text-white md:opacity-0 md:group-hover:opacity-100'
                  }`}
                  title={pinned ? "Desafixar aviso" : "Fixar aviso"}
                >
                  <Pin className={`h-3.5 w-3.5 ${pinned ? 'fill-[#00FF00]/20' : ''}`} />
                  {pinned ? "Fixado" : "Fixar"}
                </button>
              </div>

              <div className="mb-8 mt-2">
                <h3 className={`text-xl md:text-2xl font-medium tracking-tight mb-3 flex items-start gap-3 ${pinned ? 'text-white' : 'text-gray-200'}`}>
                  {pinned && <AlertTriangle className="h-5 w-5 md:h-6 md:w-6 text-[#00FF00] drop-shadow-[0_0_8px_rgba(0,255,0,0.5)] shrink-0 mt-0.5" />}
                  {announcement.title}
                </h3>
                <p className="text-gray-400 text-sm md:text-base leading-relaxed whitespace-pre-wrap font-light">
                  {announcement.content}
                </p>
              </div>

              {/* Comentários Clean */}
              <div className="pt-4 mt-2 border-t border-white/5 space-y-3 mb-5">
                {announcement.comments && announcement.comments.length > 0 && (
                  <div className="space-y-2 mb-3">
                    {announcement.comments.map((comment, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm bg-white/[0.02] p-2.5 rounded-lg border border-white/5">
                        <div className="font-bold text-[#00FF00]/80 text-[10px] uppercase tracking-widest mt-[3px] shrink-0">{comment.author}:</div>
                        <div className="text-gray-300 font-light text-xs leading-relaxed">{comment.text}</div>
                      </div>
                    ))}
                  </div>
                )}
                
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAddComment(announcement.id);
                  }}
                  className="flex items-center gap-2 relative"
                >
                  <input
                    type="text"
                    placeholder="Adicionar comentário..."
                    value={commentInputs[announcement.id] || ''}
                    onChange={(e) => setCommentInputs({...commentInputs, [announcement.id]: e.target.value})}
                    className="w-full bg-black/40 border border-white/5 hover:border-white/10 rounded-full pl-4 pr-10 py-2 text-xs text-white focus:outline-none focus:border-[#00FF00]/30 transition-colors placeholder:text-gray-600"
                  />
                  <button 
                    type="submit" 
                    disabled={!commentInputs[announcement.id]?.trim()} 
                    className="absolute right-3 text-gray-500 hover:text-[#00FF00] disabled:opacity-0 transition-all"
                  >
                    <MessageSquare className="h-4 w-4" />
                  </button>
                </form>
              </div>

              <div className="pt-5 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-5">
                
                <div className="flex -space-x-2 overflow-hidden items-center w-full sm:w-auto">
                  {FULL_TEAM.map((member) => {
                    const isAck = announcement.acknowledgments?.some(ack => ack.user_id === member.id || ack.user?.full_name?.includes(member.name));
                    const ackData = announcement.acknowledgments?.find(ack => ack.user_id === member.id || ack.user?.full_name?.includes(member.name));
                    
                    return (
                      <div 
                        key={member.id} 
                        className={`inline-flex h-8 w-8 rounded-full ring-2 ring-[#111111] items-center justify-center text-[10px] font-bold shadow-[0_0_10px_rgba(0,0,0,0.2)] transition-all ${
                          isAck 
                            ? 'bg-[#00FF00]/20 border border-[#00FF00]/30 text-[#00FF00] shadow-[0_0_10px_rgba(0,255,0,0.2)]'
                            : 'bg-white/5 border border-white/10 text-gray-500 opacity-50 grayscale'
                        }`}
                        title={isAck && ackData ? `${member.name} leu em ${format(parseISO(ackData.acknowledged_at), "dd/MM HH:mm")}` : `${member.name} ainda não leu`}
                      >
                        {getInitials(member.name)}
                      </div>
                    );
                  })}
                </div>

                {hasAcknowledged ? (
                  <div className="w-full sm:w-auto flex items-center justify-center gap-2 text-[#00FF00] text-xs font-bold transition-all px-2">
                    <CheckCircle2 className="h-4 w-4 drop-shadow-[0_0_5px_rgba(0,255,0,0.5)]" />
                    Você está ciente
                  </div>
                ) : (
                  <button 
                    onClick={() => handleAcknowledge(announcement.id)}
                    className="w-full sm:w-auto px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 text-gray-400 hover:text-[#00FF00] hover:bg-[#00FF00]/5 group"
                  >
                    <CheckCircle2 className="h-4 w-4 group-hover:text-[#00FF00] text-gray-500 transition-colors" />
                    Confirmar Leitura
                  </button>
                )}
                
              </div>
            </div>
          );
        })}
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
                  Título do Aviso
                </label>
                <input 
                  type="text" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ex: Mudança na etiqueta de envio..."
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
                  Marcar como Alta Urgência / Fixar
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
