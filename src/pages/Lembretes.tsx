import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
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
  const { user } = useAuth();
  const [ideas, setIdeas] = useState<any[]>([]);
  const [checklist, setChecklist] = useState<any[]>([]);
  const [agenda, setAgenda] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetchData();
    } else {
      // Fallback para os mocks se no estiver logado ou em ambiente local sem bd conectado
      setIdeas(MOCK_IDEAS);
      setChecklist(MOCK_CHECKLIST);
      setAgenda(MOCK_AGENDA);
    }
  }, [user]);

  const formatTime = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) + ' s ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const formatAgendaDay = (dateStr: string) => {
    if (!dateStr || typeof dateStr !== 'string') return "HOJE";
    if (dateStr.toUpperCase() === "HOJE" || dateStr.toUpperCase() === "AMANHÃ" || dateStr.toUpperCase() === "AMANH") return dateStr.toUpperCase();
    if (dateStr.includes('/')) return dateStr;

    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    if (dateStr === todayStr) return "HOJE";
    if (dateStr === tomorrowStr) return "AMANHÃ";

    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}`;
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  const fetchData = async () => {
    const { data: agendaData } = await supabase.from('seu_mundo_agenda').select('*').order('created_at', { ascending: false });
    if (agendaData) setAgenda(agendaData);

    const { data: checklistData } = await supabase.from('seu_mundo_checklist').select('*').order('created_at', { ascending: false });
    if (checklistData) setChecklist(checklistData);

    const { data: ideiasData } = await supabase.from('seu_mundo_ideias').select('*').order('created_at', { ascending: false });
    if (ideiasData) setIdeas(ideiasData);
  };
  
  const [quickThought, setQuickThought] = useState("");
  const [showAgendaForm, setShowAgendaForm] = useState(false);
  const [showChecklistForm, setShowChecklistForm] = useState(false);
  
  const [newAgendaTitle, setNewAgendaTitle] = useState("");
  const [newAgendaDate, setNewAgendaDate] = useState("");
  const [newAgendaTime, setNewAgendaTime] = useState("");
  const [newChecklistTitle, setNewChecklistTitle] = useState("");

  const handleAddThought = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickThought.trim()) return;

    const colors = ["bg-blue-500", "bg-[#00FF00]", "bg-purple-500", "bg-orange-500", "bg-pink-500"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    if (!user) {
      const newIdea = { id: Date.now().toString(), content: quickThought, date: "Agora mesmo", color: randomColor };
      setIdeas([newIdea, ...ideas]);
      setQuickThought("");
      return;
    }

    const { error } = await supabase.from('seu_mundo_ideias').insert({
      content: quickThought,
      color: randomColor,
      user_id: user.id
    });
    
    if (!error) {
      setQuickThought("");
      fetchData();
    }
  };

  const toggleTask = async (id: string) => {
    const task = checklist.find(t => t.id === id);
    if (!task) return;
    
    if (!user) {
      setChecklist(checklist.map(t => t.id === id ? { ...t, done: !t.done } : t));
      return;
    }

    await supabase.from('seu_mundo_checklist').update({ done: !task.done }).eq('id', id);
    fetchData();
  };

  const handleAddAgenda = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAgendaTitle.trim()) return;

    const todayStr = new Date().toISOString().split('T')[0];
    const finalDate = newAgendaDate || todayStr;
    const finalTime = newAgendaTime || "O dia todo";

    if (!user) {
      const newItem = { id: Date.now().toString(), title: newAgendaTitle, day: finalDate, time: finalTime, is_priority: true };
      setAgenda([newItem, ...agenda]);
      setNewAgendaTitle(""); setNewAgendaDate(""); setNewAgendaTime(""); setShowAgendaForm(false);
      return;
    }

    await supabase.from('seu_mundo_agenda').insert({
      title: newAgendaTitle,
      day: finalDate,
      time: finalTime,
      is_priority: true,
      user_id: user.id
    });

    setNewAgendaTitle(""); setNewAgendaDate(""); setNewAgendaTime(""); setShowAgendaForm(false);
    fetchData();
  };

  const handleAddChecklist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChecklistTitle.trim()) return;

    if (!user) {
      const newTask = { id: Date.now().toString(), title: newChecklistTitle, done: false };
      setChecklist([newTask, ...checklist]);
      setNewChecklistTitle(""); setShowChecklistForm(false);
      return;
    }

    await supabase.from('seu_mundo_checklist').insert({
      title: newChecklistTitle,
      done: false,
      user_id: user.id
    });

    setNewChecklistTitle(""); setShowChecklistForm(false);
    fetchData();
  };

  const removeChecklist = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) { setChecklist(checklist.filter(item => item.id !== id)); return; }
    
    await supabase.from('seu_mundo_checklist').delete().eq('id', id);
    fetchData();
  };

  const removeAgenda = async (id: string) => {
    if (!user) { setAgenda(agenda.filter(item => item.id !== id)); return; }
    
    await supabase.from('seu_mundo_agenda').delete().eq('id', id);
    fetchData();
  };

  const removeIdea = async (id: string) => {
    if (!user) { setIdeas(ideas.filter(item => item.id !== id)); return; }
    
    await supabase.from('seu_mundo_ideias').delete().eq('id', id);
    fetchData();
  };

  return (
    <div className="flex-1 p-4 md:p-8 pt-6 animate-in fade-in duration-500 max-w-[1400px] mx-auto w-full font-sans flex flex-col min-h-0 overflow-hidden">
      
      {/* Header Intimista */}
      <div className="mb-6 border-b border-white/5 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6 shrink-0">
        <div>
          <div className="mb-2">
            <h1 className="text-3xl md:text-4xl font-light text-white tracking-tight flex items-center gap-2">
              Seu <span className="font-semibold text-[#00FF00]">Mundo</span>.
            </h1>
          </div>
          <p className="text-gray-500 mt-2 text-sm max-w-xl leading-relaxed">
            Um espaço totalmente seu. Organize sua agenda, checklist do dia a dia e rascunhos mentais.
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 min-h-0 overflow-hidden pb-4">
        
        {/* COLUNA 1: Agenda / Lembretes */}
        <div className="flex flex-col min-h-0">
          {/* Header Fixo */}
          <div className="flex items-center justify-between mb-4 shrink-0 px-1">
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

          {/* Área Rolável */}
          <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-2 space-y-4">
            {showAgendaForm && (
              <form onSubmit={handleAddAgenda} className="bg-[#111111] border border-white/5 border-t border-t-[#00FF00]/30 rounded-2xl p-4 shadow-xl animate-in slide-in-from-top-2 shrink-0">
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
                      type="date"
                      value={newAgendaDate}
                      onChange={(e) => setNewAgendaDate(e.target.value)}
                      className="w-1/2 bg-[#0a0a0a] border border-white/5 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00FF00]/50 [color-scheme:dark]"
                    />
                    <input
                      type="time"
                      value={newAgendaTime}
                      onChange={(e) => setNewAgendaTime(e.target.value)}
                      className="w-1/2 bg-[#0a0a0a] border border-white/5 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00FF00]/50 [color-scheme:dark]"
                    />
                  </div>
                <button type="submit" className="w-full mt-3 bg-white/5 hover:bg-[#00FF00]/20 text-white hover:text-[#00FF00] border border-white/5 hover:border-[#00FF00]/30 rounded-lg py-2 text-xs font-bold transition-all uppercase tracking-wider">
                  Adicionar
                </button>
              </form>
            )}

            <div className="bg-[#111111] border border-[#00FF00]/20 rounded-3xl p-6 shadow-[0_0_30px_rgba(0,255,0,0.02)] relative overflow-hidden shrink-0">
              <div className="space-y-1">
                {agenda.length === 0 && (
                  <p className="text-gray-600 text-xs font-bold uppercase tracking-widest text-center py-4">Sua agenda está livre!</p>
                )}
                {agenda.map((item, index) => (
                  <div key={item.id} className="group relative py-2.5 border-b border-white/5 last:border-0 flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[9px] font-bold uppercase tracking-widest ${item.day === 'HOJE' ? 'text-[#00FF00]' : 'text-gray-500'}`}>
                          {formatAgendaDay(item.day)}
                        </span>
                        {(item.is_priority || item.isPriority) && (
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
        </div>

        {/* COLUNA 2: Checklist Pessoal */}
        <div className="flex flex-col min-h-0">
          {/* Header Fixo */}
          <div className="flex items-center justify-between mb-4 shrink-0 px-1">
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
          
          {/* Área Rolável */}
          <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-2 space-y-4">
            {showChecklistForm && (
              <form onSubmit={handleAddChecklist} className="bg-[#111111] border border-white/5 border-t border-t-[#00FF00]/30 rounded-2xl p-4 shadow-xl animate-in slide-in-from-top-2 shrink-0">
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

                        <div className="bg-[#111315]/80 backdrop-blur-md border border-white/5 rounded-[2rem] p-6 shadow-2xl relative overflow-hidden shrink-0">
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
              
              {checklist.length > 0 && checklist.every(t => t.done) && (
                <div className="mt-6 text-center border border-dashed border-[#00FF00]/30 bg-[#00FF00]/10 rounded-2xl p-4">
                  <p className="text-[10px] font-bold text-[#00FF00] uppercase tracking-widest">Você concluiu tudo!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* COLUNA 3: Ideias e Rascunhos */}
        <div className="flex flex-col min-h-0">
          {/* Header Fixo */}
          <div className="flex items-center justify-between mb-4 shrink-0 px-1">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-[#00FF00]" />
              Ideias Avulsas
            </h3>
            <span className="text-[9px] font-bold uppercase tracking-widest bg-white/5 border border-white/10 text-gray-500 px-2 py-1 rounded">
              {ideas.length} Notas
            </span>
          </div>

          {/* Área Rolável */}
          <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-2">
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
                      {user && idea.created_at ? formatTime(idea.created_at) : idea.date}
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
    </div>
  );
}