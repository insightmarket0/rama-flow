import React, { useState } from "react";
import { Plus, MoreHorizontal, MessageCircle, Paperclip, Clock, CheckCircle2, AlertCircle, Edit2, Trash2, Eye, ImagePlus, Maximize } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useMarketingDemands, MarketingDemand } from "@/hooks/useMarketingDemands";
import { useAuth } from "@/hooks/useAuth";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

type TaskStatus = "backlog" | "in_progress" | "review" | "adjustment" | "approved";

type Column = { id: TaskStatus; label: string; color: string };

const COLUMNS: Column[] = [
  { id: "backlog", label: "Fila / Backlog", color: "text-gray-400 border-white/10 bg-white/5" },
  { id: "in_progress", label: "Em Produção", color: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10" },
  { id: "review", label: "Aguardando Aprovação", color: "text-amber-400 border-amber-500/30 bg-amber-500/10" },
  { id: "adjustment", label: "Em Ajuste", color: "text-rose-400 border-rose-500/30 bg-rose-500/10" },
  { id: "approved", label: "Aprovado", color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" },
];

export default function ArtDemandBoard() {
  const { user } = useAuth();
  const { demands, isLoading, createDemand, updateDemand, deleteDemand, uploadImage, addComment } = useMarketingDemands();
  const [isNewDemandOpen, setIsNewDemandOpen] = useState(false);
  const [viewTask, setViewTask] = useState<MarketingDemand | null>(null);

  const [animatingTask, setAnimatingTask] = useState<{ id: string, action: string } | null>(null);
  
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [uploadingTaskId, setUploadingTaskId] = useState<string | null>(null);

  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  
  const [newCommentText, setNewCommentText] = useState("");

  const handleCreateDemand = () => {
    if (!newTitle.trim()) return;
    createDemand.mutate({
      title: newTitle,
      description: newDescription,
      status: "backlog",
      priority: "medium",
      cover_image: null,
      due_date: null
    });
    setIsNewDemandOpen(false);
    setNewTitle("");
    setNewDescription("");
  };

  const moveTask = (taskId: string, newStatus: TaskStatus, actionLabel: string = 'move') => {
    setAnimatingTask({ id: taskId, action: actionLabel });
    setTimeout(() => {
      updateDemand.mutate({ id: taskId, status: newStatus });
      setAnimatingTask(null);
    }, 350); // Reduzido para ficar mais ágil
  };

  const triggerFileUpload = (taskId: string) => {
    setUploadingTaskId(taskId);
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && uploadingTaskId) {
      uploadImage.mutate({ file, demandId: uploadingTaskId });
    }
    // reset
    if (fileInputRef.current) fileInputRef.current.value = '';
    setUploadingTaskId(null);
  };

  const handleAddComment = () => {
    if (!newCommentText.trim() || !viewTask) return;
    
    const email = user?.email || "Usuario";
    const fullName = user?.user_metadata?.full_name || user?.user_metadata?.name;
    const fallbackName = fullName || email.split('@')[0];
    
    // Capitaliza a primeira letra do fallbackName caso seja o email
    const userName = fullName ? fullName : (fallbackName.charAt(0).toUpperCase() + fallbackName.slice(1));

    let avatar = "";
    if (userName.toLowerCase().includes("mara")) avatar = "/mara.png";
    else if (userName.toLowerCase().includes("rogerio") || userName.toLowerCase().includes("rogério")) avatar = "/rogerio.png";
    else if (userName.toLowerCase().includes("livia") || userName.toLowerCase().includes("lívia")) avatar = "/livia.png";
    else avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=random`;

    // Update local state so it appears instantly in the modal
    const newComment = {
      id: Math.random().toString(),
      text: newCommentText,
      user_name: userName,
      user_avatar: avatar,
      created_at: new Date().toISOString()
    };
    setViewTask({ ...viewTask, comments: [...(viewTask.comments || []), newComment], comments_count: (viewTask.comments_count || 0) + 1 });

    addComment.mutate({ 
      demandId: viewTask.id, 
      text: newCommentText,
      userName: userName,
      userAvatar: avatar
    });
    setNewCommentText("");
  };

  const priorityColors = {
    low: "bg-white/5 text-gray-400 border border-white/10",
    medium: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20",
    high: "bg-red-500/10 text-red-400 border border-red-500/20",
  };

  const renderDate = (isoString: string) => {
    try {
      return format(parseISO(isoString), "dd/MMM", { locale: ptBR });
    } catch {
      return "Recente";
    }
  };

  // Helper to determine animation classes based on action
  const getAnimationClasses = (taskId: string) => {
    // Quando entra na nova coluna
    if (animatingTask?.id !== taskId) return "animate-in fade-in slide-in-from-left-8 zoom-in-95 duration-500 ease-out";
    
    // Quando está saindo
    const base = "transition-all duration-400 z-50 transform pointer-events-none ease-in";
    switch (animatingTask.action) {
      case 'start':
      case 'review':
        // Vai para a direita suavemente
        return `${base} scale-95 opacity-0 translate-x-16 shadow-[0_0_50px_rgba(6,182,212,0.3)] border-cyan-500/50`;
      case 'approve':
        // Vai para cima (concluído)
        return `${base} scale-105 opacity-0 -translate-y-12 shadow-[0_0_80px_rgba(16,185,129,0.5)] border-emerald-400`;
      case 'adjust':
        // Volta para a esquerda
        return `${base} scale-95 opacity-0 -translate-x-16 shadow-[0_0_50px_rgba(239,68,68,0.3)] border-red-500/50`;
      default:
        return `${base} scale-95 opacity-0 translate-x-8`;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden mt-1">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        className="hidden" 
        accept="image/png, image/jpeg, image/webp" 
      />

      {/* Board Scroll Horizontal */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden pt-4 flex gap-3 lg:gap-5 custom-scrollbar relative">
        {COLUMNS.map((column) => {
          const columnTasks = demands.filter((t) => t.status === column.id);

          return (
            <div key={column.id} className="min-w-[240px] lg:min-w-[250px] flex-1 flex flex-col h-full shrink-0">
              {/* Header da Coluna */}
              <div className={`flex items-center justify-between mb-4 pb-2 border-b-2 ${column.color.split(' ')[1]}`}>
                <h3 className={`text-sm font-semibold tracking-tight ${column.color.split(' ')[0]}`}>
                  {column.label}
                </h3>
                <span className={`${column.color.split(' ')[2]} ${column.color.split(' ')[0]} text-[10px] font-bold px-2 py-0.5 rounded-full transition-all duration-300`}>
                  {columnTasks.length}
                </span>
              </div>

              {/* Lista de Cards da Coluna */}
              <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar flex flex-col gap-3 pb-4">
                
                {/* Botão de Nova Demanda (Apenas na Fila) */}
                {column.id === "backlog" && (
                  <button
                    onClick={() => setIsNewDemandOpen(true)}
                    className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-white/10 hover:border-cyan-500/50 rounded-xl bg-white/[0.02] hover:bg-cyan-500/10 text-gray-400 hover:text-cyan-400 transition-all font-semibold text-xs shrink-0"
                  >
                    <Plus className="w-4 h-4" /> Solicitar Nova Arte
                  </button>
                )}
                {columnTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`bg-[#111111]/90 backdrop-blur-md border border-white/[0.08] rounded-2xl flex flex-col group hover:border-white/20 hover:bg-[#151515] shadow-lg hover:shadow-[0_12px_40px_rgba(0,0,0,0.6)] overflow-hidden ${getAnimationClasses(task.id)}`}
                  >
                    {/* Imagem de Capa (Se existir) */}
                    {task.cover_image && (
                      <div 
                        className="w-full h-40 relative shrink-0 overflow-hidden cursor-pointer group/image"
                        onClick={() => window.open(task.cover_image!, '_blank')}
                        title="Clique para ver a arte em tamanho original"
                      >
                        <img src={task.cover_image} alt={task.title} className="w-full h-full object-cover transition-transform duration-700 group-hover/image:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent pointer-events-none" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                           <Maximize className="w-6 h-6 text-white drop-shadow-md" />
                        </div>
                      </div>
                    )}

                    <div className="p-4 flex flex-col gap-3">
                      {/* Title & Menu */}
                      <div className="flex justify-between items-start gap-3">
                        <h4 className="text-white text-[15px] font-semibold leading-tight tracking-tight drop-shadow-sm mt-0.5">{task.title}</h4>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="text-gray-500 hover:text-white transition-colors bg-white/5 hover:bg-white/10 rounded-full p-1 opacity-0 group-hover:opacity-100 outline-none shrink-0 -mt-1">
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 bg-[#1C1C1F] border-white/10 text-white/90">
                            <DropdownMenuItem onClick={() => setViewTask(task)} className="hover:bg-white/5 cursor-pointer">
                              <Eye className="w-4 h-4 mr-2" /> Ver detalhes
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => triggerFileUpload(task.id)} className="hover:bg-white/5 cursor-pointer">
                              <ImagePlus className="w-4 h-4 mr-2" /> Anexar Arte
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-white/10" />
                            <DropdownMenuItem onClick={() => deleteDemand.mutate(task.id)} className="text-red-400 focus:text-red-400 hover:bg-red-500/10 cursor-pointer">
                              <Trash2 className="w-4 h-4 mr-2" /> Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Description */}
                      {task.description && (
                        <p className="text-[#888] text-[13px] leading-relaxed line-clamp-2 font-light">
                          {task.description}
                        </p>
                      )}

                      {/* Dropzone intuitiva caso não tenha imagem e esteja em produção/revisão */}
                      {!task.cover_image && (task.status === "in_progress" || task.status === "review" || task.status === "adjustment") && (
                        <button 
                          onClick={() => triggerFileUpload(task.id)}
                          className="w-full mt-1 border border-dashed border-white/10 hover:border-cyan-500/40 hover:bg-cyan-500/5 rounded-xl p-2.5 flex items-center justify-center gap-2 transition-colors group/upload"
                        >
                          <ImagePlus className="w-4 h-4 text-gray-500 group-hover/upload:text-cyan-400 transition-colors" />
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 group-hover/upload:text-cyan-400 transition-colors">
                            {uploadImage.isPending && uploadingTaskId === task.id ? "Enviando..." : "Anexar Arte"}
                          </span>
                        </button>
                      )}

                      {/* Footer: User + Meta + Actions */}
                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-white/[0.04]">
                        {/* User */}
                        <Avatar className="w-7 h-7 border border-[#222] ring-1 ring-black shadow-lg" title={task.creator_name}>
                          <AvatarImage src={task.creator_avatar} />
                          <AvatarFallback className="bg-white/5 text-[9px] text-white">
                            {task.creator_name ? task.creator_name.substring(0, 2).toUpperCase() : 'US'}
                          </AvatarFallback>
                        </Avatar>

                        {/* Meta Pills */}
                        <div className="flex items-center gap-1.5">
                          <button 
                            onClick={() => setViewTask(task)} 
                            className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition-colors text-xs font-medium ${
                              task.comments_count > 0 
                              ? 'bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]' 
                              : 'bg-white/[0.03] hover:bg-white/10 text-[#888] hover:text-white border border-transparent'
                            }`}
                          >
                            <MessageCircle className={`w-3.5 h-3.5 ${task.comments_count > 0 ? 'fill-cyan-400/20' : ''}`} />
                            <span>{task.comments_count}</span>
                          </button>
                          <div className="flex items-center gap-1.5 px-2 py-1 bg-white/[0.03] rounded-lg text-[#888] text-xs font-medium border border-transparent">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{renderDate(task.created_at)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Quick Actions Baseado no Status */}
                      {(task.status === "review" || task.status === "backlog" || task.status === "in_progress" || task.status === "adjustment") && (
                        <div className="flex gap-2 w-full mt-1">
                          {task.status === "review" && (
                            <>
                              <button
                                onClick={() => moveTask(task.id, "adjustment", "adjust")}
                                className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[11px] font-bold py-2 rounded-xl transition-colors border border-red-500/20 flex items-center justify-center gap-1.5"
                                title="Pedir Ajuste"
                              >
                                <AlertCircle className="w-3.5 h-3.5" /> Ajuste
                              </button>
                              <button
                                onClick={() => moveTask(task.id, "approved", "approve")}
                                className="flex-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-[11px] font-bold py-2 rounded-xl transition-colors border border-emerald-500/20 flex items-center justify-center gap-1.5"
                                title="Aprovar Arte"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" /> Aprovar
                              </button>
                            </>
                          )}
                          {task.status === "backlog" && (
                            <button
                              onClick={() => moveTask(task.id, "in_progress", "start")}
                              className="w-full bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-[11px] font-bold py-2 rounded-xl transition-colors border border-cyan-500/20 text-center"
                            >
                              Iniciar Produção
                            </button>
                          )}
                          {task.status === "in_progress" && (
                            <button
                              onClick={() => moveTask(task.id, "review", "review")}
                              className="w-full bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-[11px] font-bold py-2 rounded-xl transition-colors border border-cyan-500/20 text-center"
                            >
                              Enviar p/ Revisão
                            </button>
                          )}
                          {task.status === "adjustment" && (
                            <button
                              onClick={() => moveTask(task.id, "review", "review")}
                              className="w-full bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-[11px] font-bold py-2 rounded-xl transition-colors border border-cyan-500/20 text-center"
                            >
                              Re-enviar p/ Revisão
                            </button>
                          )}
                        </div>
                      )}
                      
                      {task.status === "approved" && (
                        <div className="w-full mt-1 flex justify-center py-1">
                          <span className="text-[11px] font-bold text-gray-500 flex items-center gap-1.5 uppercase tracking-wider">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Concluído
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Empty State visual */}
                {columnTasks.length === 0 && column.id !== "backlog" && (
                  <div className="h-24 border-2 border-dashed border-white/5 rounded-xl flex items-center justify-center">
                    <span className="text-xs text-gray-600 font-medium">Nenhuma tarefa aqui</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Nova Demanda */}
      <Dialog open={isNewDemandOpen} onOpenChange={setIsNewDemandOpen}>
        <DialogContent className="bg-[#111] border border-white/10 text-white sm:max-w-lg p-6">
          <DialogHeader className="mb-2">
            <DialogTitle className="text-xl font-semibold tracking-tight text-white/90">
              Solicitar <span className="text-cyan-400 font-normal">Nova Arte</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-col gap-5 mt-2">
            {/* Título Estilo Documento */}
            <input 
              type="text" 
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="O que você precisa? (Ex: Carrossel Dia das Mães)"
              className="bg-transparent border-b border-white/10 pb-2 text-lg font-medium text-white focus:outline-none focus:border-cyan-500 transition-colors placeholder:text-gray-600 w-full"
              autoFocus
            />
            
            {/* Descrição Sutil */}
            <textarea 
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Descreva o briefing, adicione links de referência ou instruções específicas para o designer..."
              rows={3}
              className="bg-[#161616] border border-white/5 rounded-xl px-4 py-3 text-[13px] leading-relaxed text-gray-300 focus:outline-none focus:bg-[#1a1a1a] focus:border-white/10 transition-colors resize-none custom-scrollbar w-full"
            />
          </div>

          <div className="flex items-center justify-end gap-2 mt-4">
            <button 
              onClick={() => setIsNewDemandOpen(false)} 
              className="text-gray-500 hover:text-white text-[12px] uppercase tracking-wider font-semibold px-4 py-2.5 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button 
              onClick={handleCreateDemand} 
              disabled={!newTitle.trim() || createDemand.isPending} 
              className="bg-cyan-500 text-black font-bold text-[12px] uppercase tracking-wider px-6 py-2.5 rounded-lg transition-colors hover:bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)] disabled:opacity-50 flex items-center gap-2"
            >
              {createDemand.isPending ? 'Enviando...' : 'Criar Demanda'}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Visualizar Demanda */}
      <Dialog open={!!viewTask} onOpenChange={(open) => !open && setViewTask(null)}>
        {viewTask && (
          <DialogContent aria-describedby="view-demand-desc" className="bg-[#111] border border-white/10 text-white sm:max-w-3xl p-0 overflow-hidden flex flex-col md:flex-row max-h-[85vh]">
            <div id="view-demand-desc" className="sr-only">Detalhes da demanda de arte {viewTask.title}</div>
            
            {/* Lado Esquerdo: Imagem + Info */}
            <div className="w-full md:w-1/2 flex flex-col overflow-y-auto custom-scrollbar relative">
              {/* Se houver arte, ela é a protagonista */}
              {viewTask.cover_image && (
                <div 
                  className="w-full h-48 sm:h-56 bg-[#050505] relative border-b border-white/5 cursor-pointer group/image flex items-center justify-center shrink-0 overflow-hidden"
                  onClick={() => window.open(viewTask.cover_image!, '_blank')}
                  title="Clique para abrir a arte original em nova aba"
                >
                  <img src={viewTask.cover_image} className="w-full h-full object-contain opacity-95 transition-transform duration-500 group-hover/image:scale-105" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                     <Maximize className="w-8 h-8 text-white drop-shadow-xl" />
                  </div>
                </div>
              )}
              
              <div className="p-5 flex flex-col gap-5">
                <DialogHeader className="p-0 space-y-2 text-left">
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${COLUMNS.find(c => c.id === viewTask.status)?.color}`}>
                      {COLUMNS.find(c => c.id === viewTask.status)?.label}
                    </span>
                  </div>
                  <DialogTitle className="text-xl font-semibold tracking-tight leading-tight">{viewTask.title}</DialogTitle>
                </DialogHeader>
              
                {/* Info Compacta */}
                <div className="flex items-center gap-6">
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-gray-600">Responsável</span>
                    <div className="flex items-center gap-1.5">
                      <Avatar className="w-5 h-5 border border-white/10">
                        <AvatarImage src={viewTask.creator_avatar} />
                        <AvatarFallback className="bg-white/5 text-[8px] text-white">
                          {viewTask.creator_name ? viewTask.creator_name.substring(0, 2).toUpperCase() : 'US'}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-[13px] font-medium text-gray-300">{viewTask.creator_name}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-gray-600">Data</span>
                    <div className="flex items-center gap-1.5 text-gray-300">
                      <Clock className="w-3.5 h-3.5 text-gray-500" />
                      <span className="text-[13px] font-medium">{renderDate(viewTask.created_at)}</span>
                    </div>
                  </div>
                </div>

                {/* Descrição Limpa */}
                <div className="flex flex-col gap-1.5 border-t border-white/5 pt-4">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-gray-600">Briefing / Detalhes</span>
                  <p className="text-[13px] text-gray-300 leading-relaxed whitespace-pre-wrap">{viewTask.description || "Nenhuma descrição..."}</p>
                </div>
              </div>
            </div>

            {/* Lado Direito: Comentários e Histórico */}
            <div className="w-full md:w-1/2 flex flex-col bg-[#161618] border-l border-white/5 shrink-0">
              <div className="p-4 border-b border-white/5 shrink-0 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
                  <MessageCircle className="w-3.5 h-3.5" /> Comentários ({viewTask.comments_count})
                </span>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-4 flex flex-col gap-5">
                {(!viewTask.comments || viewTask.comments.length === 0) ? (
                  <p className="text-[11px] text-gray-600 italic text-center py-6 bg-white/[0.01] rounded-xl border border-dashed border-white/5">
                    Nenhum comentário. Comece a discussão!
                  </p>
                ) : (
                  viewTask.comments.map((comment: any) => (
                    <div key={comment.id} className="flex gap-3">
                      <Avatar className="w-6 h-6 border border-[#333] shrink-0 mt-0.5">
                        <AvatarImage src={comment.user_avatar} />
                        <AvatarFallback className="bg-white/5 text-[8px] text-white">
                          {comment.user_name?.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-semibold text-white/90">{comment.user_name}</span>
                          <span className="text-[9px] text-gray-600">{format(parseISO(comment.created_at), "dd/MM 'às' HH:mm", { locale: ptBR })}</span>
                        </div>
                        <p className="text-[12px] text-gray-300 leading-snug">{comment.text}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Input Comentário Minimalista */}
              <div className="p-3 border-t border-white/5 shrink-0 bg-[#111]">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleAddComment(); }}
                    placeholder="Escreva um comentário..."
                    className="flex-1 bg-white/5 border border-white/5 rounded-lg px-3 py-2 text-[12px] focus:outline-none focus:border-cyan-500/50 text-white placeholder-gray-600 transition-colors"
                  />
                  <button 
                    onClick={handleAddComment}
                    disabled={!newCommentText.trim() || addComment.isPending}
                    className="bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 px-3 py-2 rounded-lg transition-colors border border-cyan-500/20 disabled:opacity-50 font-semibold text-[11px] uppercase tracking-wider shrink-0"
                  >
                    {addComment.isPending ? '...' : 'Enviar'}
                  </button>
                </div>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
