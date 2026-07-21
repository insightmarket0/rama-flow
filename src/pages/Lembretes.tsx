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
    color: "bg-blue-500/10 border-blue-500/20 text-blue-100",
  },
  {
    id: "2",
    content: "Revisar as descrições da linha de Cozinha. O CTR caiu um pouco, podemos colocar os bullet points no topo.",
    date: "Ontem às 16:30",
    color: "bg-[#00FF00]/10 border-[#00FF00]/20 text-[#00FF00]",
  },
  {
    id: "3",
    content: "Lembrar de pedir para o marketing as fotos de life-style dos produtos novos.",
    date: "19/07 às 09:12",
    color: "bg-purple-500/10 border-purple-500/20 text-purple-100",
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
  const [quickThought, setQuickThought] = useState("");
  const [ideas, setIdeas] = useState(MOCK_IDEAS);
  const [checklist, setChecklist] = useState(MOCK_CHECKLIST);
  
  // Agenda State
  const [agenda, setAgenda] = useState(MOCK_AGENDA);
  const [showAgendaForm, setShowAgendaForm] = useState(false);
  const [newAgendaTitle, setNewAgendaTitle] = useState("");
  const [newAgendaDate, setNewAgendaDate] = useState("");
  const [newAgendaTime, setNewAgendaTime] = useState("");

  // Checklist State
  const [showChecklistForm, setShowChecklistForm] = useState(false);
  const [newChecklistTitle, setNewChecklistTitle] = useState("");

  const handleAddThought = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickThought.trim()) return;

    const colors = [
      "bg-blue-500/10 border-blue-500/20 text-blue-100",
      "bg-[#00FF00]/10 border-[#00FF00]/20 text-[#00FF00]",
      "bg-purple-500/10 border-purple-500/20 text-purple-100",
      "bg-orange-500/10 border-orange-500/20 text-orange-100",
      "bg-pink-500/10 border-pink-500/20 text-pink-100",
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

  return (
    <div className="flex-1 p-4 md:p-8 pt-6 animate-in fade-in duration-500 max-w-[1400px] mx-auto w-full font-sans">
      
      {/* Header Intimista */}
      <div className="mb-8 border-b border-white/5 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
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

        {/* Módulo de Captura Rápida no Topo */}
        <div className="w-full md:w-[450px]">
          <form onSubmit={handleAddThought} className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00FF00]/30 to-blue-500/30 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
            <div className="relative flex items-center bg-[#111315]/90 border border-white/10 rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm">
              <div className="pl-4">
                <BrainCircuit className="h-5 w-5 text-gray-400 group-focus-within:text-[#00FF00] transition-colors" />
              </div>
              <input 
                type="text" 
                value={quickThought}
                onChange={(e) => setQuickThought(e.target.value)}
                placeholder="O que está na sua mente agora?"
                className="w-full bg-transparent border-none text-white text-sm px-4 py-4 focus:outline-none placeholder:text-gray-600"
              />
              <button 
                type="submit"
                disabled={!quickThought.trim()}
                className="pr-4 pl-2 text-gray-500 hover:text-[#00FF00] disabled:opacity-30 disabled:hover:text-gray-500 transition-colors"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLUNA 1: Agenda / Lembretes */}
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Calendar className="h-6 w-6 text-orange-400" />
              Minha Agenda
            </h3>
            <button 
              onClick={() => setShowAgendaForm(!showAgendaForm)}
              className="text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 p-1.5 rounded-lg transition-colors"
            >
              {showAgendaForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            </button>
          </div>

          {showAgendaForm && (
            <form onSubmit={handleAddAgenda} className="bg-[#111315]/80 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-xl animate-in slide-in-from-top-2">
              <input
                type="text"
                placeholder="Ex: Almoço com cliente"
                value={newAgendaTitle}
                onChange={(e) => setNewAgendaTitle(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500/50 mb-3"
                autoFocus
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Data (ex: HOJE, 25/07)"
                  value={newAgendaDate}
                  onChange={(e) => setNewAgendaDate(e.target.value.toUpperCase())}
                  className="w-1/2 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500/50"
                />
                <input
                  type="text"
                  placeholder="Horário (ex: 12:30)"
                  value={newAgendaTime}
                  onChange={(e) => setNewAgendaTime(e.target.value)}
                  className="w-1/2 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500/50"
                />
              </div>
              <button type="submit" className="w-full mt-3 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border border-orange-500/20 rounded-xl px-4 py-2 text-sm font-bold transition-colors">
                Salvar Compromisso
              </button>
            </form>
          )}

          <div className="bg-[#111315]/50 backdrop-blur-sm border border-white/5 rounded-[2rem] p-6 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-yellow-500"></div>
            
            <div className="space-y-6 mt-2">
              {agenda.length === 0 && (
                <p className="text-gray-500 text-sm text-center py-4">Sua agenda está livre!</p>
              )}
              {agenda.map((item, index) => (
                <React.Fragment key={item.id}>
                  <div className="flex gap-4 items-start group cursor-pointer relative">
                    <button 
                      onClick={() => removeAgenda(item.id)}
                      className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded text-gray-500 hover:text-red-400 transition-all"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    <div className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center shrink-0 transition-colors ${item.day === 'HOJE' ? 'bg-orange-500/10 border border-orange-500/30 group-hover:bg-orange-500/20' : 'bg-white/5 border border-white/10 group-hover:bg-white/10'}`}>
                      <span className={`text-[9px] font-black uppercase tracking-wider ${item.day === 'HOJE' ? 'text-orange-500' : 'text-gray-400'}`}>{item.day}</span>
                    </div>
                    <div className={`pt-1 ${item.day !== 'HOJE' ? 'opacity-70 group-hover:opacity-100 transition-opacity' : ''}`}>
                      <p className="text-sm font-bold text-white mb-0.5">{item.title}</p>
                      <p className="text-xs text-gray-400 flex items-center gap-1 mb-1">
                        <Clock className="h-3 w-3" /> {item.time}
                      </p>
                      {item.isPriority && (
                        <span className="text-[10px] bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded uppercase font-bold tracking-wider inline-block">Prioridade</span>
                      )}
                    </div>
                  </div>
                  {index < agenda.length - 1 && <div className="w-full h-px bg-white/5"></div>}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* COLUNA 2: Checklist Pessoal */}
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <ListTodo className="h-6 w-6 text-[#00FF00]" />
              Checklist do Dia
            </h3>
            <button 
              onClick={() => setShowChecklistForm(!showChecklistForm)}
              className="text-gray-400 hover:text-[#00FF00] bg-white/5 hover:bg-white/10 p-1.5 rounded-lg transition-colors"
            >
              {showChecklistForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            </button>
          </div>
          
          {showChecklistForm && (
            <form onSubmit={handleAddChecklist} className="bg-[#111315]/80 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-xl animate-in slide-in-from-top-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ex: Enviar relatório"
                  value={newChecklistTitle}
                  onChange={(e) => setNewChecklistTitle(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00FF00]/50"
                  autoFocus
                />
                <button type="submit" className="bg-[#00FF00]/20 hover:bg-[#00FF00]/30 text-[#00FF00] border border-[#00FF00]/20 rounded-xl px-4 text-sm font-bold transition-colors">
                  Add
                </button>
              </div>
            </form>
          )}

          <div className="bg-[#111315]/80 backdrop-blur-md border border-white/5 rounded-[2rem] p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-[#00FF00]"></div>

            <div className="space-y-3 mt-2">
              {checklist.length === 0 && (
                <p className="text-gray-500 text-sm text-center py-4">Sua lista está limpa!</p>
              )}
              {checklist.map(task => (
                <div 
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`group flex items-start justify-between gap-3 p-3.5 rounded-2xl cursor-pointer transition-all border relative ${
                    task.done 
                      ? "bg-white/5 border-transparent opacity-50" 
                      : "bg-[#0a0a0a]/50 border-white/5 hover:border-white/10 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-start gap-3 w-full pr-6">
                    <button className="mt-0.5 shrink-0 transition-colors">
                      {task.done 
                        ? <CheckCircle2 className="h-5 w-5 text-[#00FF00]" /> 
                        : <CircleDashed className="h-5 w-5 text-gray-500 group-hover:text-[#00FF00]" />
                      }
                    </button>
                    <span className={`text-sm font-medium leading-relaxed ${task.done ? "text-gray-500 line-through" : "text-gray-200"}`}>
                      {task.title}
                    </span>
                  </div>
                  <button 
                    onClick={(e) => removeChecklist(task.id, e)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1.5 hover:bg-white/10 rounded-lg text-gray-500 hover:text-red-400 transition-all"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
            
            {checklist.every(t => t.done) && (
              <div className="mt-6 text-center border border-dashed border-[#00FF00]/30 bg-[#00FF00]/10 rounded-2xl p-4">
                <p className="text-[10px] font-bold text-[#00FF00] uppercase tracking-widest">Você concluiu tudo!</p>
              </div>
            )}
          </div>
        </div>

        {/* COLUNA 3: Ideias e Rascunhos */}
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Lightbulb className="h-6 w-6 text-[#00FF00] drop-shadow-[0_0_8px_rgba(0,255,0,0.4)]" />
              Ideias Avulsas
            </h3>
            <span className="text-[10px] font-bold uppercase tracking-widest bg-white/5 border border-white/10 text-gray-400 px-3 py-1.5 rounded-lg">
              {ideas.length} Notas
            </span>
          </div>

          <div className="flex flex-col gap-4">
            {ideas.map(idea => (
              <div 
                key={idea.id} 
                className={`relative group p-6 rounded-3xl border backdrop-blur-sm shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between ${idea.color}`}
              >
                <p className="text-sm leading-relaxed mb-6 font-medium text-white/90">
                  {idea.content}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-[10px] uppercase font-bold tracking-wider opacity-60 flex items-center gap-1.5">
                    <Clock className="h-3 w-3" />
                    {idea.date}
                  </span>
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-black/20 rounded-lg">
                    <MoreVertical className="h-4 w-4" />
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
