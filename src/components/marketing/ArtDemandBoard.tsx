import React, { useState } from "react";
import { Plus, MoreHorizontal, MessageCircle, Paperclip, Clock, CheckCircle2, AlertCircle, Edit2, Trash2, Eye, ImagePlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

type TaskStatus = "backlog" | "in_progress" | "review" | "adjustment" | "approved";

interface ArtTask {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  assignee: { name: string; avatar: string };
  createdAt: string;
  comments: number;
  attachments: number;
  priority: "low" | "medium" | "high";
  coverImage?: string;
}

const INITIAL_TASKS: ArtTask[] = [
  {
    id: "task-1",
    title: "Campanha Dia dos Pais",
    description: "Criativos para a campanha principal de Dia dos Pais. Formatos Stories e Feed.",
    status: "backlog",
    assignee: { name: "Will", avatar: "https://i.pravatar.cc/150?u=will" },
    createdAt: "10/Ago",
    comments: 0,
    attachments: 0,
    priority: "high",
  },
  {
    id: "task-2",
    title: "Banners para Site",
    description: "Atualizar os banners da home page com as novas promoções de inverno.",
    status: "in_progress",
    assignee: { name: "Will", avatar: "https://i.pravatar.cc/150?u=will" },
    createdAt: "12/Ago",
    comments: 2,
    attachments: 0,
    priority: "medium",
  },
  {
    id: "task-3",
    title: "Logo da Nova Submarca",
    description: "Opções de logo para a nova submarca. Escolher e aprovar uma das opções finais.",
    status: "review",
    assignee: { name: "Will", avatar: "https://i.pravatar.cc/150?u=will" },
    createdAt: "Há 2 dias",
    comments: 4,
    attachments: 3,
    priority: "high",
    coverImage: "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "task-4",
    title: "Post Redes Sociais",
    description: "Carrossel de 3 páginas com dicas de uso do produto.",
    status: "adjustment",
    assignee: { name: "Will", avatar: "https://i.pravatar.cc/150?u=will" },
    createdAt: "Ontem",
    comments: 6,
    attachments: 1,
    priority: "medium",
    coverImage: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "task-5",
    title: "Cartão de Visita",
    description: "Arte final para impressão do cartão dos executivos. Arquivo fechado para gráfica.",
    status: "approved",
    assignee: { name: "Will", avatar: "https://i.pravatar.cc/150?u=will" },
    createdAt: "15/Jul",
    comments: 2,
    attachments: 2,
    priority: "low",
    coverImage: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=800&auto=format&fit=crop",
  },
];

const COLUMNS: { id: TaskStatus; label: string; color: string }[] = [
  { id: "backlog", label: "Fila / Backlog", color: "text-gray-300 border-white/10" },
  { id: "in_progress", label: "Em Produção", color: "text-gray-300 border-white/10" },
  { id: "review", label: "Aguardando Aprovação", color: "text-emerald-400/60 border-emerald-500/10" },
  { id: "adjustment", label: "Em Ajuste", color: "text-blue-400 border-blue-500/20" },
  { id: "approved", label: "Aprovado", color: "text-emerald-400 border-emerald-500/30" },
];

export default function ArtDemandBoard() {
  const [tasks, setTasks] = useState<ArtTask[]>(INITIAL_TASKS);
  const [isNewDemandOpen, setIsNewDemandOpen] = useState(false);
  const [viewTask, setViewTask] = useState<ArtTask | null>(null);

  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const handleCreateDemand = () => {
    if (!newTitle.trim()) return;
    const newTask: ArtTask = {
      id: `task-${Date.now()}`,
      title: newTitle,
      description: newDescription,
      status: "backlog",
      assignee: { name: "Will", avatar: "https://i.pravatar.cc/150?u=will" },
      createdAt: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('. de', ''),
      comments: 0,
      attachments: 0,
      priority: "medium",
    };
    setTasks([...tasks, newTask]);
    setIsNewDemandOpen(false);
    setNewTitle("");
    setNewDescription("");
  };

  const moveTask = (taskId: string, newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
  };

  const attachImageToTask = (taskId: string) => {
    // Simula um upload pegando uma imagem bonita do unsplash
    const mockImages = [
      "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1626785774625-ddcddc3445e9?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1541462608143-67571c6738dd?q=80&w=800&auto=format&fit=crop"
    ];
    const randomImg = mockImages[Math.floor(Math.random() * mockImages.length)];
    
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, coverImage: randomImg, attachments: t.attachments + 1 } : t))
    );
  };

  const priorityColors = {
    low: "bg-white/5 text-gray-400 border border-white/10",
    medium: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20",
    high: "bg-red-500/10 text-red-400 border border-red-500/20",
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden mt-1">
      {/* Header do Board */}
      <div className="p-0 pb-3 mb-0 border-b border-white/10 flex items-center justify-end shrink-0 bg-transparent">
        <button 
          onClick={() => setIsNewDemandOpen(true)}
          className="bg-cyan-500 hover:bg-cyan-600 text-black text-xs font-bold px-5 py-2.5 rounded-full transition-colors shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center gap-2"
        >
          <Plus className="w-3.5 h-3.5" /> Nova Demanda
        </button>
      </div>

      {/* Board Scroll Horizontal */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden pt-3 flex gap-3 lg:gap-5 custom-scrollbar">
        {COLUMNS.map((column) => {
          const columnTasks = tasks.filter((t) => t.status === column.id);

          return (
            <div key={column.id} className="flex flex-col flex-1 min-w-[180px] h-full">
              {/* Header da Coluna */}
              <div className={`flex items-center justify-between mb-4 pb-2 border-b-2 ${column.color.split(' ')[1]}`}>
                <h3 className={`text-sm font-semibold tracking-tight ${column.color.split(' ')[0]}`}>
                  {column.label}
                </h3>
                <span className="bg-white/10 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {columnTasks.length}
                </span>
              </div>

              {/* Lista de Cards */}
              <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-1 pb-4">
                {columnTasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-[#161618] border border-white/5 rounded-2xl flex flex-col group hover:border-white/10 hover:bg-[#1C1C1F] transition-all duration-300 shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.4)] overflow-hidden"
                  >
                    {/* Imagem de Capa (Se existir) */}
                    {task.coverImage && (
                      <div className="w-full h-36 relative border-b border-white/10 shrink-0">
                        <img src={task.coverImage} alt={task.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                      </div>
                    )}

                    <div className="p-4 flex flex-col gap-3">
                      <div className="flex justify-between items-start gap-3">
                        <h4 className="text-white/95 text-[15px] font-medium leading-tight tracking-tight mt-0.5">{task.title}</h4>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="text-gray-500 hover:text-white transition-colors bg-white/5 rounded-full p-1 opacity-0 group-hover:opacity-100 outline-none shrink-0 -mt-1">
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-[#111] border-white/10 text-gray-300 w-40 z-50">
                            <DropdownMenuItem className="focus:bg-white/10 focus:text-white cursor-pointer py-2" onClick={() => setViewTask(task)}>
                              <Eye className="w-3.5 h-3.5 mr-2" /> Visualizar
                            </DropdownMenuItem>
                            <DropdownMenuItem className="focus:bg-white/10 focus:text-white cursor-pointer py-2">
                              <Edit2 className="w-3.5 h-3.5 mr-2" /> Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-white/10" />
                            <DropdownMenuItem className="focus:bg-red-500/20 focus:text-red-400 text-red-500 cursor-pointer py-2" onClick={() => setTasks(prev => prev.filter(t => t.id !== task.id))}>
                              <Trash2 className="w-3.5 h-3.5 mr-2" /> Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {task.description && (
                        <p className="text-[#888] text-[12px] line-clamp-2 leading-relaxed -mt-1">{task.description}</p>
                      )}

                      {/* Dropzone intuitiva caso não tenha imagem e esteja em produção/revisão */}
                      {!task.coverImage && (task.status === "in_progress" || task.status === "review" || task.status === "adjustment") && (
                        <button 
                          onClick={() => attachImageToTask(task.id)}
                          className="w-full mt-2 border-2 border-dashed border-white/10 hover:border-cyan-500/50 hover:bg-cyan-500/5 rounded-xl p-3 flex flex-col items-center justify-center gap-1.5 transition-colors group/upload"
                        >
                          <ImagePlus className="w-4 h-4 text-gray-500 group-hover/upload:text-cyan-400 transition-colors" />
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 group-hover/upload:text-cyan-400 transition-colors">Anexar Arte</span>
                        </button>
                      )}

                      {/* Meta info */}
                      <div className="flex items-center gap-5 mt-1">
                        <div className="flex items-center gap-1.5 text-[#666]" title="Data do Pedido">
                          <Clock className="w-3.5 h-3.5" />
                          <span className="text-[11px] font-medium tracking-wide">{task.createdAt}</span>
                        </div>
                        <div className="flex items-center gap-3 text-[#666]">
                          <div className="flex items-center gap-1.5">
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span className="text-[11px] font-medium">{task.comments}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Paperclip className="w-3.5 h-3.5" />
                            <span className="text-[11px] font-medium">{task.attachments}</span>
                          </div>
                        </div>
                      </div>

                    <div className="pt-4 border-t border-white/[0.04] flex items-center justify-between mt-1">
                      <Avatar className="w-7 h-7 border border-[#333] ring-2 ring-[#111]">
                        <AvatarImage src={task.assignee.avatar} />
                        <AvatarFallback className="bg-white/5 text-[9px] text-white">
                          {task.assignee.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      {/* Quick Actions Baseado no Status */}
                      <div className="flex gap-2">
                        {task.status === "review" && (
                          <>
                            <button
                              onClick={() => moveTask(task.id, "adjustment")}
                              className="bg-red-500/10 hover:bg-red-500/20 text-red-400 p-1.5 rounded-md transition-colors"
                              title="Pedir Ajuste"
                            >
                              <AlertCircle className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => moveTask(task.id, "approved")}
                              className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 p-1.5 rounded-md transition-colors"
                              title="Aprovar Arte"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                        {task.status === "backlog" && (
                          <button
                            onClick={() => moveTask(task.id, "in_progress")}
                            className="bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-[10px] font-bold px-3 py-1.5 rounded-full transition-colors border border-cyan-500/20"
                          >
                            Iniciar
                          </button>
                        )}
                        {task.status === "in_progress" && (
                          <button
                            onClick={() => moveTask(task.id, "review")}
                            className="bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-[10px] font-bold px-3 py-1.5 rounded-full transition-colors border border-cyan-500/20"
                          >
                            Enviar p/ Revisão
                          </button>
                        )}
                        {task.status === "adjustment" && (
                          <button
                            onClick={() => moveTask(task.id, "review")}
                            className="bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-[10px] font-bold px-3 py-1.5 rounded-full transition-colors border border-cyan-500/20"
                          >
                            Re-enviar
                          </button>
                        )}
                        {task.status === "approved" && (
                          <span className="text-[10px] text-gray-500 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Finalizado
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                ))}

                {/* Empty State visual */}
                {columnTasks.length === 0 && (
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
        <DialogContent className="bg-[#111] border border-white/10 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-light">Nova <span className="font-bold text-cyan-400">Demanda de Arte</span></DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Título da Arte</label>
              <input 
                value={newTitle} 
                onChange={(e) => setNewTitle(e.target.value)} 
                className="bg-[#222] border border-white/5 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 text-white placeholder-gray-600"
                placeholder="Ex: Criativo Meta Ads (Carrossel)"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Descrição / Briefing</label>
              <textarea 
                value={newDescription} 
                onChange={(e) => setNewDescription(e.target.value)} 
                className="bg-[#222] border border-white/5 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 text-white placeholder-gray-600 min-h-[100px] resize-none"
                placeholder="Detalhes, referências e orientações..."
              />
            </div>
          </div>
          <DialogFooter>
            <button onClick={() => setIsNewDemandOpen(false)} className="px-5 py-2.5 text-sm font-semibold text-gray-400 hover:text-white transition-colors">
              Cancelar
            </button>
            <button 
              onClick={handleCreateDemand}
              disabled={!newTitle.trim()}
              className="bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 disabled:hover:bg-cyan-500 text-black text-sm font-bold px-6 py-2.5 rounded-full transition-colors shadow-[0_0_15px_rgba(6,182,212,0.3)]"
            >
              Criar Demanda
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Visualizar Demanda */}
      <Dialog open={!!viewTask} onOpenChange={(open) => !open && setViewTask(null)}>
        {viewTask && (
          <DialogContent className="bg-[#111] border border-white/10 text-white sm:max-w-xl p-0 overflow-hidden">
            {/* Se houver arte, ela é a protagonista no modal */}
            {viewTask.coverImage && (
              <div className="w-full h-64 bg-black relative border-b border-white/10">
                <img src={viewTask.coverImage} className="w-full h-full object-cover opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent pointer-events-none" />
              </div>
            )}
            <div className={`p-6 flex flex-col gap-6 ${viewTask.coverImage ? 'pt-2' : ''}`}>
              <DialogHeader>
                <div className="flex items-center gap-3 mb-2">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border bg-white/5 ${COLUMNS.find(c => c.id === viewTask.status)?.color}`}>
                    {COLUMNS.find(c => c.id === viewTask.status)?.label}
                  </span>
                </div>
                <DialogTitle className="text-2xl font-semibold tracking-tight">{viewTask.title}</DialogTitle>
              </DialogHeader>
            
              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-4 bg-white/[0.02] border border-white/5 rounded-xl p-4">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Responsável</span>
                  <div className="flex items-center gap-2">
                    <Avatar className="w-6 h-6 border border-white/10">
                      <AvatarImage src={viewTask.assignee.avatar} />
                      <AvatarFallback className="bg-white/5 text-[9px] text-white">
                        {viewTask.assignee.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-gray-300">{viewTask.assignee.name}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Data do Pedido</span>
                  <div className="flex items-center gap-2 text-gray-300">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium">{viewTask.createdAt}</span>
                  </div>
                </div>
              </div>

              {/* Descrição */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Briefing / Detalhes</span>
                <div className="bg-[#222] border border-white/5 rounded-xl p-4 min-h-[120px]">
                  <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{viewTask.description || "Nenhuma descrição fornecida."}</p>
                </div>
              </div>

              {/* Extras */}
              <div className="flex items-center gap-6 border-t border-white/10 pt-4 mt-2">
                <div className="flex items-center gap-2 text-gray-400">
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm">{viewTask.comments} Comentários</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Paperclip className="w-4 h-4" />
                  <span className="text-sm">{viewTask.attachments} Anexos</span>
                </div>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
