import React, { useState } from "react";
import { 
  Clock, 
  CircleDashed,
  CheckCircle2,
  Plus,
  MoreVertical,
  BrainCircuit,
  Lightbulb,
  ListTodo,
  Send,
  Calendar,
  Sparkles,
  X
} from "lucide-react";

// Mocks para o novo Workspace
const MOCK_IDEAS = [
  {
    id: "1",
    content: "Talvez criar um playbook específico sobre como tratar devoluções de eletrônicos no Mercado Livre. Temos tido muitas dúvidas nisso.",
    date: "Hoje às 10:45",
    color: "bg-blue-500",
  },
  {
    id: "2",
    content: "Revisar as descrições da linha de Cozinha. O CTR caiu um pouco, podemos colocar os bullet points no topo.",
    date: "Ontem às 16:30",
    color: "bg-[#00FF00]",
  },
  {
    id: "3",
    content: "Lembrar de pedir para o marketing as fotos de life-style dos produtos novos.",
    date: "19/07 às 09:12",
    color: "bg-purple-500",
  }
];

const MOCK_CHECKLIST = [
  { id: "c1", title: "Limpar caixa de entrada de emails", done: true },
  { id: "c2", title: "Revisar anúncios pausados", done: false },
  { id: "c3", title: "Aprovar orçamentos de embalagem", done: false },
  { id: "c4", title: "Ler os 2 Playbooks novos", done: false },
];

const MOCK_AGENDA = [
  { id: "a1", title: "Reunião de Alinhamento", day: "HOJE", time: "14:00 - Google Meet", isPriority: true },
  { id: "a2", title: "Fechamento de Ponto", day: "AMANHÃ", time: "Até as 18:00", isPriority: false },
  { id: "a3", title: "Renovação de Contratos", day: "25/07", time: "09:00 - Financeiro", isPriority: false }
];

export default function Lembretes() {
  const [ideas, setIdeas] = useState(MOCK_IDEAS);
  const [checklist, setChecklist] = useState(MOCK_CHECKLIST);
  const [agenda, setAgenda] = useState(MOCK_AGENDA);
  
  const [quickThought, setQuickThought] = useState("");
  const [showAgendaForm, setShowAgendaForm] = useState(false);
  const [showChecklistForm, setShowChecklistForm] = useState(false);
  
  const [newAgendaTitle, setNewAgendaTitle] = useState("");
  const [newAgendaDate, setNewAgendaDate] = useState("");
  const [newAgendaTime, setNewAgendaTime] = useState("");
  const [newChecklistTitle, setNewChecklistTitle] = useState("");

  const handleAddThought = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickThought.trim()) return;

    const colors = [
      "bg-blue-500",
      "bg-[#00FF00]",
      "bg-purple-500",
      "bg-orange-500",
      "bg-pink-500",
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newIdea = {
      id: Date.now().toString(),
      content: quickThought,
      date: "Agora mesmo",
      color: randomColor,
    };

    setIdeas([newIdea, ...ideas]);
    setQuickThought("");
  };

  const toggleTask = (id: string) => {
    setChecklist(checklist.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const handleAddAgenda = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAgendaTitle.trim()) return;

    const newItem = {
      id: Date.now().toString(),
      title: newAgendaTitle,
      day: newAgendaDate || "HOJE",
      time: newAgendaTime || "O dia todo",
      isPriority: true // Colocando como prioridade apenas para destaque
    };

    setAgenda([newItem, ...agenda]);
    setNewAgendaTitle("");
    setNewAgendaDate("");
    setNewAgendaTime("");
    setShowAgendaForm(false);
  };

  const handleAddChecklist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChecklistTitle.trim()) return;

    const newTask = {
      id: Date.now().toString(),
      title: newChecklistTitle,
      done: false
    };

    setChecklist([newTask, ...checklist]);
    setNewChecklistTitle("");
    setShowChecklistForm(false);
  };

  const removeChecklist = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setChecklist(checklist.filter(item => item.id !== id));
  };

  const removeAgenda = (id: string) => {
    setAgenda(agenda.filter(item => item.id !== id));
  };

  const removeIdea = (id: string) => {
    setIdeas(ideas.filter(item => item.id !== id));
  };

  return (
    <div className="flex-1 p-4 md:p-8 pt-6 animate-in fade-in duration-500 max-w-[1400px] mx-auto w-full font-sans flex flex-col min-h-0 overflow-hidden">
      
      {/* Header Intimista */}
      <div className="mb-8 border-b border-white/5 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6 shrink-0">
        <div>
          <div className="mb-2">
            <h1 className="text-3xl md:text-4xl font-light text-white tracking-tight flex items-center gap-2">
              Seu <span className="font-semibold text-[#00FF00]">Mundo</span>.
            </h1>
          </div>
          <p className="text-gray-500 mt-2 text-sm max-w-xl leading-relaxed">
            Um espaço totalmente seu. Organize sua agenda, checklist do dia a dia e rascunhos mentais longe do barulho da operação.
          </p>
        </div>

        {/* Módulo de Captura Rápida no Topo (Stealth Input) */}
        <div className="w-full md:w-[450px]">
          <form onSubmit={handleAddThought} className="relative group">
            <div className="relative flex items-center bg-[#0A0A0A] border border-white/5 group-focus-within:border-[#00FF00]/40 rounded-xl overflow-hidden transition-all shadow-lg group-focus-within:shadow-[0_0_20px_rgba(0,255,0,0.05)]">
              <div className="pl-4">
                <BrainCircuit className="h-4 w-4 text-gray-500 group-focus-within:text-[#00FF00] transition-colors" />
              </div>
              <input 
                type="text" 
                value={quickThought}
                onChange={(e) => setQuickThought(e.target.value)}
                placeholder="O que está na sua mente agora?"
                className="w-full bg-transparent border-none text-white text-xs px-3 py-3 focus:outline-none placeholder:text-gray-600"
              />
              <button 
                type="submit"
                disabled={!quickThought.trim()}
                className="pr-4 pl-2 text-gray-600 hover:text-[#00FF00] disabled:opacity-30 disabled:hover:text-gray-600 transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 min-h-0 overflow-y-auto pr-2 pb-20 custom-scrollbar">
        
        {/* COLUNA 1: Agenda / Lembretes */}
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Calendar className="h-5 w-5 text-[#00FF00]" />
              Minha Agenda
            </h3>
            <button 
              onClick={() => setShowAgendaForm(!showAgendaForm)}
              className="text-gray-500 hover:text-[#00FF00] hover:bg-white/5 p-1.5 rounded-lg transition-colors"
            >
              {showAgendaForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            </button>
          </div>

          {showAgendaForm && (
            <form onSubmit={handleAddAgenda} className="bg-[#111111] border border-[#00FF00]/20 rounded-2xl p-4 shadow-xl animate-in slide-in-from-top-2">
              <input
                type="text"
                placeholder="Título do compromisso"
                value={newAgendaTitle}
                onChange={(e) => setNewAgendaTitle(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-white/5 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00FF00]/50 mb-2"
                autoFocus
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ex: HOJE"
                  value={newAgendaDate}
                  onChange={(e) => setNewAgendaDate(e.target.value)}
                  className="w-1/2 bg-[#0a0a0a] border border-white/5 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00FF00]/50"
                />
                <input
                  type="text"
                  placeholder="Ex: 14:00"
                  value={newAgendaTime}
                  onChange={(e) => setNewAgendaTime(e.target.value)}
                  className="w-1/2 bg-[#0a0a0a] border border-white/5 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00FF00]/50"
                />
              </div>
              <button type="submit" className="w-full mt-3 bg-white/5 hover:bg-[#00FF00]/20 text-white hover:text-[#00FF00] border border-white/5 hover:border-[#00FF00]/30 rounded-lg py-2 text-xs font-bold transition-all uppercase tracking-wider">
                Adicionar
              </button>
            </form>
          )}

          <div className="bg-[#111111] border border-[#00FF00]/20 rounded-3xl p-6 shadow-[0_0_30px_rgba(0,255,0,0.02)] relative overflow-hidden">
            <div className="space-y-1">
              {agenda.length === 0 && (
                <p className="text-gray-600 text-xs font-bold uppercase tracking-widest text-center py-4">Sua agenda está livre!</p>
              )}
              {agenda.map((item, index) => (
                <div key={item.id} className="group relative py-2.5 border-b border-white/5 last:border-0 flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[9px] font-bold uppercase tracking-widest ${item.day === 'HOJE' ? 'text-[#00FF00]' : 'text-gray-500'}`}>
                        {item.day}
                      </span>
                      {item.isPriority && (
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse" title="Prioridade" />
                      )}
                    </div>
                    <p className={`text-xs font-medium truncate ${item.day === 'HOJE' ? 'text-white' : 'text-gray-400'}`}>
                      {item.title}
                    </p>
                    <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-1 mt-1">
                      <Clock className="h-2.5 w-2.5" /> {item.time}
                    </p>
                  </div>
                  <button 
                    onClick={() => removeAgenda(item.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-white/5 rounded-md text-gray-600 hover:text-red-500 transition-all shrink-0 mt-1"
                    title="Excluir"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* COLUNA 2: Checklist Pessoal */}
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <ListTodo className="h-5 w-5 text-[#00FF00]" />
              Checklist do Dia
            </h3>
            <button 
              onClick={() => setShowChecklistForm(!showChecklistForm)}
              className="text-gray-500 hover:text-[#00FF00] hover:bg-white/5 p-1.5 rounded-lg transition-colors"
            >
              {showChecklistForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            </button>
          </div>
          
          {showChecklistForm && (
            <form onSubmit={handleAddChecklist} className="bg-[#111111] border border-[#00FF00]/20 rounded-2xl p-4 shadow-xl animate-in slide-in-from-top-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ex: Enviar relatório"
                  value={newChecklistTitle}
                  onChange={(e) => setNewChecklistTitle(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-white/5 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00FF00]/50"
                  autoFocus
                />
                <button type="submit" className="bg-[#00FF00]/10 hover:bg-[#00FF00]/20 text-[#00FF00] border border-[#00FF00]/20 rounded-lg px-4 text-xs font-bold uppercase tracking-wider transition-colors">
                  Add
                </button>
              </div>
            </form>
          )}

          <div className="bg-[#111111] border border-[#00FF00]/20 rounded-3xl p-6 shadow-[0_0_30px_rgba(0,255,0,0.02)] relative overflow-hidden">
            <div className="space-y-1">
              {checklist.length === 0 && (
                <p className="text-gray-600 text-xs font-bold uppercase tracking-widest text-center py-4">Sua lista está limpa!</p>
              )}
              {checklist.map(task => (
                <div 
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className="group flex items-center justify-between gap-3 py-2.5 cursor-pointer transition-all border-b border-white/5 last:border-0 relative"
                >
                  <div className="flex items-start gap-3 w-full pr-6">
                    <button className="shrink-0 transition-colors mt-0.5">
                      {task.done 
                        ? <CheckCircle2 className="h-4 w-4 text-[#00FF00]/50" /> 
                        : <CircleDashed className="h-4 w-4 text-gray-600 group-hover:text-[#00FF00]" />
                      }
                    </button>
                    <span className={`text-xs font-medium leading-relaxed ${task.done ? "text-gray-600 line-through" : "text-gray-300"}`}>
                      {task.title}
                    </span>
                  </div>
                  <button 
                    onClick={(e) => removeChecklist(task.id, e)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1.5 hover:bg-white/5 rounded-md text-gray-600 hover:text-red-500 transition-all"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
            
            {checklist.length > 0 && checklist.every(t => t.done) && (
              <div className="mt-4 flex items-center justify-center gap-2">
                <span className="text-[9px] font-bold text-[#00FF00]/50 uppercase tracking-widest">Você concluiu tudo</span>
                <CheckCircle2 className="h-3 w-3 text-[#00FF00]/50" />
              </div>
            )}
          </div>
        </div>

        {/* COLUNA 3: Ideias e Rascunhos */}
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-[#00FF00]" />
              Ideias Avulsas
            </h3>
            <span className="text-[9px] font-bold uppercase tracking-widest bg-white/5 border border-white/10 text-gray-500 px-2 py-1 rounded">
              {ideas.length} Notas
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {ideas.length === 0 && (
              <div className="bg-[#111111] border border-[#00FF00]/20 rounded-3xl p-6 shadow-[0_0_30px_rgba(0,255,0,0.02)] flex items-center justify-center">
                <p className="text-gray-600 text-xs font-bold uppercase tracking-widest text-center py-4">Nenhuma ideia anotada</p>
              </div>
            )}
            {ideas.map(idea => (
              <div 
                key={idea.id} 
                className="relative group p-5 rounded-3xl bg-[#111111] border border-[#00FF00]/20 shadow-[0_0_30px_rgba(0,255,0,0.05)] hover:border-[#00FF00]/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="absolute top-4 right-4">
                  <div className={`w-1.5 h-1.5 rounded-full ${idea.color}`} />
                </div>
                <p className="text-xs leading-relaxed mb-5 font-light text-gray-300 pr-4">
                  {idea.content}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-[9px] uppercase font-bold tracking-widest text-gray-600 flex items-center gap-1.5">
                    <Clock className="h-2.5 w-2.5" />
                    {idea.date}
                  </span>
                  <button 
                    onClick={() => removeIdea(idea.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 text-gray-600 hover:text-red-500 hover:bg-white/5 rounded-md"
                    title="Excluir ideia"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}