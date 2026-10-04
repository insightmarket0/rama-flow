import React, { useState, useEffect } from "react";
import { 
  Wallet, 
  CreditCard, 
  TrendingUp, 
  PiggyBank, 
  Receipt, 
  CalendarDays,
  Plus,
  Check,
  Clock,
  MoreHorizontal,
  Trash2,
  ArrowDownRight,
  Car,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Initial Mock Data
const initialFinancings = [
  { id: "1", name: "Financiamento do Carro", totalInstallments: 48, paidInstallments: 9, installmentValue: 1800 }
];

const initialCards = [
  { id: "1", name: "Nubank (Roxinho)", limit: 5000, current: 0, closingDay: 25, dueDay: 5, color: "from-purple-500 to-purple-800" },
  { id: "2", name: "Itaú Azul", limit: 8000, current: 0, closingDay: 10, dueDay: 20, color: "from-blue-500 to-blue-800" },
  { id: "3", name: "Inter", limit: 3000, current: 0, closingDay: 15, dueDay: 25, color: "from-orange-500 to-orange-800" }
];

const initialSubscriptions = [
  { id: "1", name: "Netflix", price: 55.90, category: "Entretenimento", date: "Dia 10", status: "Pago" },
  { id: "2", name: "Spotify", price: 21.90, category: "Entretenimento", date: "Dia 15", status: "Pago" },
  { id: "3", name: "Aluguel", price: 1500.00, category: "Moradia", date: "Dia 05", status: "Pago" },
  { id: "4", name: "Energia Elétrica", price: 230.50, category: "Moradia", date: "Dia 20", status: "Pendente" },
  { id: "5", name: "Internet", price: 119.90, category: "Contas Fixas", date: "Dia 12", status: "Pendente" },
  { id: "6", name: "Academia", price: 109.90, category: "Saúde", date: "Dia 01", status: "Pago" }
];

const initialDailyExpenses = [
  { id: "1", name: "Padaria", amount: 25.50, method: "PIX", date: "Hoje" },
  { id: "2", name: "Uber", amount: 18.90, method: "PIX", date: "Ontem" },
  { id: "3", name: "Farmácia", amount: 54.00, method: "Débito", date: "Ontem" }
];

const initialIncomes = [
  { id: "1", name: "Salário Fixo", amount: 6500.00, type: "Principal", frequency: "Mensal", date: "Dia 05", status: "Recebido" },
  { id: "2", name: "Bônus / PLR", amount: 1200.00, type: "Extra", frequency: "Única", date: "Dia 15", status: "Previsto" },
  { id: "3", name: "Freelance Design", amount: 850.00, type: "Extra", frequency: "Única", date: "Dia 20", status: "Previsto" }
];

const initialGoals = [
  { id: "1", name: "Reserva de Emergência", target: 10000, saved: 1500, color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" },
  { id: "2", name: "Viagem Fim de Ano", target: 3000, saved: 500, color: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20" }
];

// Calendar Utilities
const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();
const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
const formatSelectedDate = (date: Date) => `${date.getDate()} de ${monthNames[date.getMonth()].toLowerCase()}`;

export default function ContaPessoal() {
  // States
  const [incomes, setIncomes] = useState(initialIncomes);
  const [cards, setCards] = useState(initialCards);
  const [subscriptions, setSubscriptions] = useState(initialSubscriptions);
  const [financings, setFinancings] = useState(initialFinancings);
  const [dailyExpenses, setDailyExpenses] = useState(initialDailyExpenses);
  const [goals, setGoals] = useState(initialGoals);
  
  // Calendar State
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Load from local storage on mount (optional simple persistence)
  useEffect(() => {
    const savedIncomes = localStorage.getItem("@ramaflow:incomes");
    if (savedIncomes) setIncomes(JSON.parse(savedIncomes));
    
    const savedCards = localStorage.getItem("@ramaflow:cards");
    if (savedCards) setCards(JSON.parse(savedCards));
    
    const savedSubs = localStorage.getItem("@ramaflow:subs");
    // Append status "Pendente" to legacy subs
    if (savedSubs) setSubscriptions(JSON.parse(savedSubs).map((s: any) => ({...s, status: s.status || "Pendente"})));

    const savedFin = localStorage.getItem("@ramaflow:financings");
    if (savedFin) {
      setFinancings(JSON.parse(savedFin));
    } else {
      setFinancings([{ id: "1", name: "Financiamento do Carro", totalInstallments: 48, paidInstallments: 9, installmentValue: 1800 }]);
    }
    
    const savedDaily = localStorage.getItem("@ramaflow:daily");
    if (savedDaily) setDailyExpenses(JSON.parse(savedDaily));
    
    const savedGoals = localStorage.getItem("@ramaflow:goals");
    if (savedGoals) setGoals(JSON.parse(savedGoals));
  }, []);

  // Save to local storage when state changes
  useEffect(() => {
    localStorage.setItem("@ramaflow:incomes", JSON.stringify(incomes));
    localStorage.setItem("@ramaflow:cards", JSON.stringify(cards));
    localStorage.setItem("@ramaflow:subs", JSON.stringify(subscriptions));
    localStorage.setItem("@ramaflow:financings", JSON.stringify(financings));
    localStorage.setItem("@ramaflow:daily", JSON.stringify(dailyExpenses));
    localStorage.setItem("@ramaflow:goals", JSON.stringify(goals));
  }, [incomes, cards, subscriptions, financings, dailyExpenses, goals]);

  // Dialog States
  const [openIncome, setOpenIncome] = useState(false);
  const [openCard, setOpenCard] = useState(false);
  const [openSub, setOpenSub] = useState(false);
  const [openExpense, setOpenExpense] = useState(false);
  const [openGoal, setOpenGoal] = useState(false);
  const [openUpdateCard, setOpenUpdateCard] = useState(false);
  const [updatingCardId, setUpdatingCardId] = useState("");
  const [updateCardValue, setUpdateCardValue] = useState("");
  
  const [openAddMoney, setOpenAddMoney] = useState(false);
  const [addingMoneyGoalId, setAddingMoneyGoalId] = useState("");
  const [addMoneyAmount, setAddMoneyAmount] = useState("");

  // Form States
  const [newIncome, setNewIncome] = useState({ name: "", amount: "", type: "Principal", frequency: "Mensal", date: "Ex: Dia 05, Toda Sexta", status: "Previsto" });
  const [newCard, setNewCard] = useState({ name: "", limit: "", current: "", closingDay: "10", dueDay: "20" });
  const [newSub, setNewSub] = useState({ name: "", price: "", category: "Contas Fixas", date: "Dia 10" });
  const [newExpense, setNewExpense] = useState({ name: "", amount: "", method: "PIX", date: "Hoje" });
  const [newGoal, setNewGoal] = useState({ name: "", target: "" });

  // Metrics
  const getMonthlyAmount = (inc: any) => {
    const val = Number(inc.amount);
    if (inc.frequency === "Semanal") return val * 4;
    if (inc.frequency === "Quinzenal") return val * 2;
    return val;
  };
  
  const totalIncome = incomes.reduce((acc, curr) => acc + getMonthlyAmount(curr), 0);
  const totalCards = cards.reduce((acc, curr) => acc + Number(curr.current), 0);
  const totalFixed = subscriptions.reduce((acc, curr) => acc + Number(curr.price), 0);
  const totalDaily = dailyExpenses.reduce((acc, curr) => acc + Number(curr.amount), 0);
  const balance = totalIncome - totalCards - totalFixed - totalDaily;

  // Handlers
  const handleAddIncome = () => {
    if (!newIncome.name || !newIncome.amount) return toast.error("Preencha nome e valor!");
    setIncomes([...incomes, { ...newIncome, id: Date.now().toString(), amount: Number(newIncome.amount) }]);
    setOpenIncome(false);
    setNewIncome({ name: "", amount: "", type: "Principal", frequency: "Mensal", date: "Ex: Dia 05, Toda Sexta", status: "Previsto" });
    toast.success("Renda adicionada!");
  };

  const handleDeleteIncome = (id: string) => {
    setIncomes(incomes.filter(i => i.id !== id));
    toast.success("Item removido!");
  };

  const handleToggleIncomeStatus = (id: string) => {
    setIncomes(incomes.map(i => i.id === id ? { ...i, status: i.status === "Recebido" ? "Previsto" : "Recebido" } : i));
  };

  const handleAddCard = () => {
    if (!newCard.name || !newCard.limit) return toast.error("Preencha nome e limite!");
    
    // Smart Color Detection
    const getCardColor = (name: string) => {
      const n = name.toLowerCase();
      if (n.includes('nubank') || n.includes('roxinho') || n.includes('nu')) return "from-[#8A05BE] to-[#4A006A]";
      if (n.includes('itaú') || n.includes('itau')) return "from-blue-600 to-blue-900";
      if (n.includes('inter')) return "from-[#FF7A00] to-[#CC6200]";
      if (n.includes('c6')) return "from-gray-800 to-black";
      if (n.includes('santander')) return "from-red-600 to-red-900";
      if (n.includes('bradesco')) return "from-rose-600 to-red-800";
      if (n.includes('xp')) return "from-gray-700 to-gray-900 border border-yellow-500/30";
      if (n.includes('neon')) return "from-cyan-400 to-blue-500";
      if (n.includes('azul')) return "from-blue-500 to-blue-800";
      if (n.includes('smiles') || n.includes('gol')) return "from-orange-500 to-orange-700";
      if (n.includes('porto') || n.includes('seguro')) return "from-blue-700 to-blue-950";

      const defaultColors = ["from-purple-500 to-purple-800", "from-blue-500 to-blue-800", "from-emerald-500 to-emerald-800", "from-rose-500 to-rose-800"];
      return defaultColors[Math.floor(Math.random() * defaultColors.length)];
    };
    
    setCards([...cards, { 
      id: Date.now().toString(), 
      name: newCard.name, 
      limit: Number(newCard.limit), 
      current: Number(newCard.current || 0), 
      closingDay: Number(newCard.closingDay), 
      dueDay: Number(newCard.dueDay), 
      color: getCardColor(newCard.name)
    }]);
    setOpenCard(false);
    setNewCard({ name: "", limit: "", current: "", closingDay: "10", dueDay: "20" });
    toast.success("Cartão adicionado!");
  };

  const handleDeleteCard = (id: string) => {
    setCards(cards.filter(c => c.id !== id));
    toast.success("Cartão removido!");
  };

  const handleOpenUpdateCard = (card: any) => {
    setUpdatingCardId(card.id);
    setUpdateCardValue(card.current.toString());
    setOpenUpdateCard(true);
  };

  const handleUpdateCardInvoice = () => {
    setCards(cards.map(c => c.id === updatingCardId ? { ...c, current: Number(updateCardValue) } : c));
    setOpenUpdateCard(false);
    toast.success("Fatura atualizada com sucesso!");
  };

  const handleAddSub = () => {
    if (!newSub.name || !newSub.price) return toast.error("Preencha nome e valor!");
    setSubscriptions([...subscriptions, { ...newSub, id: Date.now().toString(), price: Number(newSub.price) }]);
    setOpenSub(false);
    setNewSub({ name: "", price: "", category: "Contas Fixas", date: "Dia 10" });
    toast.success("Conta adicionada!");
  };

  const handleDeleteSub = (id: string) => {
    setSubscriptions(subscriptions.filter(s => s.id !== id));
    toast.success("Conta removida!");
  };

  const handlePayInstallment = (id: string) => {
    setFinancings(financings.map(f => {
      if (f.id === id) {
        if (f.paidInstallments >= f.totalInstallments) {
          toast.error("Todas as parcelas já foram pagas!");
          return f;
        }
        toast.success("Parcela registrada como paga!");
        return { ...f, paidInstallments: f.paidInstallments + 1 };
      }
      return f;
    }));
  };

  const handleToggleSubStatus = (id: string) => {
    setSubscriptions(subscriptions.map(s => s.id === id ? { ...s, status: s.status === "Pago" ? "Pendente" : "Pago" } : s));
  };

  const handleAddExpense = () => {
    if (!newExpense.name || !newExpense.amount) return toast.error("Preencha nome e valor!");
    setDailyExpenses([...dailyExpenses, { ...newExpense, id: Date.now().toString(), amount: Number(newExpense.amount) }]);
    setOpenExpense(false);
    setNewExpense({ name: "", amount: "", method: "PIX", date: "Hoje" });
    toast.success("Gasto adicionado!");
  };

  const handleDeleteExpense = (id: string) => {
    setDailyExpenses(dailyExpenses.filter(e => e.id !== id));
    toast.success("Gasto removido!");
  };

  const handleAddGoal = () => {
    if (!newGoal.name || !newGoal.target) return toast.error("Preencha o nome e o objetivo!");
    const colors = ["text-emerald-400 bg-emerald-400/10 border-emerald-400/20", "text-cyan-400 bg-cyan-400/10 border-cyan-400/20", "text-purple-400 bg-purple-400/10 border-purple-400/20", "text-orange-400 bg-orange-400/10 border-orange-400/20"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setGoals([...goals, { ...newGoal, id: Date.now().toString(), target: Number(newGoal.target), saved: 0, color: randomColor }]);
    setOpenGoal(false);
    setNewGoal({ name: "", target: "" });
    toast.success("Meta criada!");
  };

  const handleOpenAddMoney = (id: string) => {
    setAddingMoneyGoalId(id);
    setAddMoneyAmount("");
    setOpenAddMoney(true);
  };

  const handleAddMoneyToGoal = () => {
    if (!addMoneyAmount) return;
    setGoals(goals.map(g => g.id === addingMoneyGoalId ? { ...g, saved: g.saved + Number(addMoneyAmount) } : g));
    setOpenAddMoney(false);
    toast.success("Dinheiro guardado na meta!");
  };

  // --- Calendar Logic ---
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const prevMonthDays = getDaysInMonth(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  
  const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  // Identify events for current month display
  const calendarEvents = [
    ...subscriptions.filter(s => s.status === 'Pendente').map(s => ({ 
      id: `sub-${s.id}`, 
      name: s.name, 
      day: parseInt(s.date.replace(/\D/g, '')) || 1, 
      type: 'Conta Fixa', 
      amount: s.price, 
      color: 'bg-orange-500',
      textColor: 'text-orange-500'
    })),
    ...cards.map(c => ({ 
      id: `card-${c.id}`, 
      name: `Fatura ${c.name}`, 
      day: c.dueDay, 
      type: 'Cartão', 
      amount: c.current, 
      color: 'bg-red-500',
      textColor: 'text-red-500'
    }))
  ];

  const isCurrentMonthSelected = currentDate.getMonth() === selectedDate.getMonth() && currentDate.getFullYear() === selectedDate.getFullYear();
  const selectedDayEvents = calendarEvents.filter(e => e.day === selectedDate.getDate() && isCurrentMonthSelected);

  return (
    <div className="flex-1 min-h-[100dvh] bg-[#050505] text-white pt-0 pl-0 -ml-4 -mt-2 pr-4 md:pr-8 animate-in fade-in duration-500 font-sans selection:bg-[#CCFF00] selection:text-black pb-24">
      
      {/* HEADER */}
      <div className="w-full flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter -mt-[2px] md:-mt-[4px] -ml-1 md:-ml-[6px]">
            <span className="text-[#00FF00]">Conta pessoal.</span>
          </h1>
          <div className="hidden md:block w-px h-10 bg-[#00FF00]/40"></div>
          <div className="md:hidden w-10 h-px bg-[#00FF00]/40 my-1"></div>
          <p className="text-gray-400 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] max-w-sm leading-relaxed">
            Controle total da vida adulta: ganhos, cartões e contas fixas.
          </p>
        </div>
        <button 
          onClick={() => setOpenIncome(true)}
          className="bg-[#CCFF00] text-black font-bold uppercase tracking-wider text-sm px-6 py-3 rounded-full hover:bg-white hover:scale-105 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(204,255,0,0.3)]">
          <Plus className="w-5 h-5" />
          Novo Lançamento
        </button>
      </div>

      {/* DASHBOARD METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
        <MetricCard 
          title="Renda Total do Mês" 
          value={totalIncome} 
          icon={<TrendingUp className="w-6 h-6 text-[#CCFF00]" />} 
          trend="+15% que o mês passado"
          theme="green"
        />
        <MetricCard 
          title="Faturas Abertas (Cartões)" 
          value={totalCards} 
          icon={<CreditCard className="w-6 h-6 text-red-400" />} 
          trend={`${cards.length} cartões ativos`}
          theme="red"
        />
        <MetricCard 
          title="Contas Fixas & Assinaturas" 
          value={totalFixed} 
          icon={<Receipt className="w-6 h-6 text-orange-400" />} 
          trend={`${subscriptions.length} contas listadas`}
          theme="orange"
        />
        <MetricCard 
          title="Saldo Livre Estimado" 
          value={balance} 
          icon={<PiggyBank className="w-6 h-6 text-emerald-400" />} 
          trend="Pode ser poupado ou investido"
          theme="emerald"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN */}
        <div className="col-span-1 lg:col-span-2 flex flex-col gap-8">
          
          {/* CARTÕES DE CRÉDITO */}
          <div className="bg-[#111111] border border-white/5 p-8 rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] pointer-events-none" />
            <h2 className="text-2xl font-black uppercase tracking-tight mb-6 flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3">
                <CreditCard className="w-6 h-6 text-[#CCFF00]" />
                Meus Cartões de Crédito
              </div>
              <button onClick={() => setOpenCard(true)} className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors border border-white/5" title="Adicionar Cartão">
                <Plus className="w-5 h-5 text-[#CCFF00]" />
              </button>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {cards.map((card) => {
                const getCardColor = (name: string, fallback: string) => {
                  const n = name.toLowerCase();
                  if (n.includes('nubank') || n.includes('roxinho') || n.includes('nu')) return "from-[#8A05BE] to-[#4A006A]";
                  if (n.includes('itaú') || n.includes('itau')) return "from-blue-600 to-blue-900";
                  if (n.includes('inter')) return "from-[#FF7A00] to-[#CC6200]";
                  if (n.includes('c6')) return "from-gray-800 to-black";
                  if (n.includes('santander')) return "from-red-600 to-red-900";
                  if (n.includes('bradesco')) return "from-rose-600 to-red-800";
                  if (n.includes('xp')) return "from-gray-700 to-gray-900 border border-yellow-500/30";
                  if (n.includes('neon')) return "from-cyan-400 to-blue-500";
                  if (n.includes('azul')) return "from-blue-500 to-blue-800";
                  if (n.includes('smiles') || n.includes('gol')) return "from-orange-500 to-orange-700";
                  if (n.includes('porto') || n.includes('seguro')) return "from-blue-700 to-blue-950";
                  return fallback;
                };
                const finalColor = getCardColor(card.name, card.color);

                return (
                <div key={card.id} className={`p-5 rounded-2xl bg-gradient-to-br ${finalColor} relative overflow-hidden shadow-xl group`}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mt-10 -mr-10 pointer-events-none" />
                  <div className="flex justify-between items-start mb-6 relative z-10">
                    <span className="font-bold text-white shadow-sm">{card.name}</span>
                    <WifiIcon className="w-5 h-5 text-white/50" />
                  </div>
                  <div className="relative z-10">
                    <span className="text-white/70 text-xs uppercase tracking-wider font-bold block mb-1">Fatura Atual</span>
                    <div className="text-2xl font-black text-white mb-4">
                      {card.current.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-bold text-white/80 uppercase tracking-wider bg-black/20 p-2 rounded-lg mb-2">
                      <div className="flex flex-col">
                        <span>Fecha: Dia {card.closingDay}</span>
                      </div>
                      <div className="flex flex-col text-right">
                        <span>Vence: Dia {card.dueDay}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleOpenUpdateCard(card)}
                      className="w-full py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-[10px] font-bold text-white uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-3 h-3" />
                      Lançar Fatura
                    </button>
                  </div>
                  <button onClick={() => handleDeleteCard(card.id)} className="absolute top-3 right-3 p-1.5 bg-black/30 hover:bg-red-500/80 rounded-lg opacity-0 group-hover:opacity-100 transition-all text-white z-20">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                )
              })}
            </div>
          </div>

          {/* GASTOS DIÁRIOS / PIX */}
          <div className="bg-[#111111] border border-red-500/10 p-8 rounded-3xl relative overflow-hidden">
            <h2 className="text-2xl font-black uppercase tracking-tight mb-6 flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3">
                <Receipt className="w-6 h-6 text-red-400" />
                Gastos Variáveis (PIX / Débito)
              </div>
              <button onClick={() => setOpenExpense(true)} className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-full transition-colors border border-red-500/20" title="Adicionar Gasto">
                <Plus className="w-5 h-5 text-red-400" />
              </button>
            </h2>

            <div className="flex flex-col gap-3">
              {dailyExpenses.map((expense) => (
                <div key={expense.id} className="flex items-center justify-between p-4 rounded-2xl bg-[#0a0a0a] border border-white/5 group relative">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
                      <ArrowDownRight className="w-5 h-5 text-red-400" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-white text-lg">{expense.name}</span>
                      <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">{expense.method} • {expense.date}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-black text-xl text-red-400">
                      - {Number(expense.amount).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                    <button onClick={() => handleDeleteExpense(expense.id)} className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-opacity">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {dailyExpenses.length === 0 && (
                <div className="text-center py-6 text-gray-500 text-sm">Nenhum gasto avulso registrado.</div>
              )}
            </div>
          </div>

          {/* RENDAS E GANHOS EXTRAS */}
          <div className="bg-[#111111] border border-white/5 p-8 rounded-3xl relative overflow-hidden">
            <h2 className="text-2xl font-black uppercase tracking-tight mb-6 flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3">
                <Wallet className="w-6 h-6 text-[#00FF00]" />
                Receitas & Ganhos Extras
              </div>
              <button onClick={() => setOpenIncome(true)} className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors border border-white/5" title="Adicionar Nova Renda">
                <Plus className="w-5 h-5 text-[#00FF00]" />
              </button>
            </h2>

            {/* Resumo Rápido */}
            <div className="flex justify-between items-end mb-6 bg-black/20 p-5 rounded-2xl border border-white/5 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-[#00FF00]/5 rounded-full blur-[40px] pointer-events-none" />
               <div className="relative z-10">
                 <span className="text-xs text-gray-500 font-bold uppercase tracking-widest block mb-1">Total Previsto no Mês</span>
                 <span className="text-3xl font-black text-[#00FF00]">
                   {totalIncome.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                 </span>
               </div>
               <div className="text-right relative z-10">
                 <span className="text-xs text-gray-500 font-bold uppercase tracking-widest block mb-1">Já Recebido</span>
                 <span className="text-lg font-bold text-white">
                   {incomes.filter(i => i.status === 'Recebido').reduce((a, b) => a + getMonthlyAmount(b), 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                 </span>
               </div>
            </div>

            <div className="flex flex-col gap-3">
              {incomes.map((income) => {
                const percent = totalIncome > 0 ? ((Number(income.amount) / totalIncome) * 100).toFixed(0) : 0;
                return (
                  <div key={income.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-2xl bg-[#0a0a0a] border border-white/5 hover:border-[#00FF00]/30 transition-all group relative">
                    <div className="flex items-center gap-4 mb-3 md:mb-0">
                      <button 
                        onClick={() => handleToggleIncomeStatus(income.id)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center border transition-colors ${income.status === 'Recebido' ? 'bg-[#00FF00]/10 border-[#00FF00]/20 text-[#00FF00]' : 'bg-white/5 border-white/10 text-gray-500 hover:text-white hover:border-white/30'}`}>
                        {income.status === 'Recebido' ? <Check className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                      </button>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-white text-lg">{income.name}</h4>
                          <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${income.status === 'Recebido' ? 'bg-[#00FF00]/20 text-[#00FF00]' : 'bg-orange-500/20 text-orange-400'}`}>
                            {income.status}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 font-bold uppercase tracking-wider flex items-center gap-2 mt-1">
                          {income.type} • {income.frequency} • {income.date}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center pl-14 md:pl-0">
                      <span className={`font-black text-xl flex items-baseline gap-1 ${income.status === 'Recebido' ? 'text-[#00FF00]' : 'text-gray-300'}`}>
                        + {Number(income.amount).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        <span className="text-[10px] text-gray-500 tracking-widest">{income.frequency === 'Semanal' ? '/sem' : income.frequency === 'Quinzenal' ? '/quinz' : income.frequency === 'Mensal' ? '/mês' : ''}</span>
                      </span>
                      <span className="text-[10px] text-gray-500 font-bold tracking-widest mt-1">
                        {percent}% DA RENDA
                      </span>
                    </div>

                    <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 hidden md:flex">
                       <button onClick={() => handleDeleteIncome(income.id)} className="p-2 bg-[#111111] hover:bg-red-500/20 border border-white/10 hover:border-red-500/50 rounded-lg transition-colors text-gray-400 hover:text-red-400" title="Excluir">
                         <Trash2 className="w-4 h-4" />
                       </button>
                    </div>
                  </div>
                )
              })}
              {incomes.length === 0 && (
                <div className="text-center py-8 text-gray-500 text-sm">Nenhuma renda cadastrada.</div>
              )}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div className="col-span-1 flex flex-col gap-8">

          {/* CALENDÁRIO / PRÓXIMOS VENCIMENTOS */}
          <div className="bg-[#1a1b1f] border border-white/5 p-6 rounded-3xl relative overflow-hidden flex flex-col items-center shadow-lg">
            {/* Header Mês/Ano */}
            <div className="w-full flex items-center justify-between mb-6">
              <button onClick={handlePrevMonth} className="p-2 text-gray-400 hover:text-white transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h3 className="text-white font-bold text-[15px]">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h3>
              <button onClick={handleNextMonth} className="p-2 text-gray-400 hover:text-white transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Dias da Semana */}
            <div className="w-full grid grid-cols-7 gap-1 mb-2 text-center">
              {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'].map(d => (
                <div key={d} className="text-[11px] text-[#6b7280] font-medium">{d}</div>
              ))}
            </div>

            {/* Grid do Calendário */}
            <div className="w-full grid grid-cols-7 gap-1 gap-y-2 mb-6">
              {/* Espaços vazios antes do primeiro dia */}
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} className="h-10 flex items-center justify-center text-[#374151] text-sm font-medium">
                  {prevMonthDays - firstDay + i + 1}
                </div>
              ))}
              
              {/* Dias do mês atual */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const isSelected = selectedDate.getDate() === day && isCurrentMonthSelected;
                
                // Checar eventos do dia
                const dayEvents = calendarEvents.filter(e => e.day === day);
                const hasEvent = dayEvents.length > 0;
                // Pega a cor do primeiro evento para o ponto, priorizando vermelho (cartão) se houver múltiplos
                const eventColor = hasEvent ? (dayEvents.find(e => e.color.includes('red'))?.color || dayEvents[0].color) : '';

                return (
                  <button 
                    key={day}
                    onClick={() => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
                    className={`h-10 w-10 mx-auto relative flex items-center justify-center rounded-full text-[15px] transition-all
                      ${isSelected ? 'bg-[#132b21] text-[#00FF00] font-bold' : 'text-white hover:bg-white/5 font-medium'}
                    `}
                  >
                    {day}
                    {hasEvent && (
                      <div className={`absolute bottom-1 w-[3px] h-[3px] rounded-full ${isSelected ? 'bg-[#00FF00]' : eventColor}`}></div>
                    )}
                  </button>
                );
              })}

              {/* Espaços vazios depois do último dia */}
              {Array.from({ length: (42 - firstDay - daysInMonth) % 7 }).map((_, i) => (
                <div key={`empty-end-${i}`} className="h-10 flex items-center justify-center text-[#374151] text-sm font-medium">
                  {i + 1}
                </div>
              ))}
            </div>

            {/* Eventos do Dia Selecionado */}
            <div className="w-full border-t border-white/5 pt-6">
              <div className="text-[#9ca3af] text-[13px] mb-5">{formatSelectedDate(selectedDate)}</div>
              <div className="flex flex-col gap-4">
                {selectedDayEvents.length > 0 ? (
                  selectedDayEvents.map(event => (
                    <div key={event.id} className="flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-gray-200">{event.name}</span>
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{event.type}</span>
                      </div>
                      <span className={`font-bold text-sm ${event.textColor}`}>
                        {Number(event.amount).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-[#4b5563] text-[13px] italic font-light">Nenhum pagamento agendado</div>
                )}
              </div>
            </div>
          </div>
          
          {/* ASSINATURAS E CONTAS FIXAS */}
          <div className="bg-[#111111] border border-white/5 p-8 rounded-3xl relative overflow-hidden h-full">
            <h2 className="text-2xl font-black uppercase tracking-tight mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CalendarDays className="w-6 h-6 text-orange-400" />
                Contas da Vida Adulta
              </div>
              <button onClick={() => setOpenSub(true)} className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors border border-white/5" title="Adicionar Conta">
                <Plus className="w-4 h-4 text-orange-400" />
              </button>
            </h2>
            <p className="text-gray-500 text-sm mb-6">Assinaturas, aluguel, energia e gastos fixos que não estão no cartão de crédito.</p>
            
            <div className="flex flex-col gap-3">
              {subscriptions.map((sub) => (
                <div key={sub.id} className={`flex items-center justify-between p-3 rounded-xl transition-colors group relative border ${sub.status === 'Pago' ? 'bg-[#00FF00]/5 border-[#00FF00]/10' : 'hover:bg-white/5 border-transparent'}`}>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => handleToggleSubStatus(sub.id)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${sub.status === 'Pago' ? 'bg-[#00FF00]/20 border-[#00FF00]/30 text-[#00FF00]' : 'bg-white/5 border-white/10 text-gray-500 hover:text-white hover:border-orange-400'}`}
                      title={sub.status === 'Pago' ? 'Marcar como Pendente' : 'Marcar como Pago'}
                    >
                      {sub.status === 'Pago' ? <Check className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                    </button>
                    <div className="flex flex-col">
                      <span className={`font-bold text-sm transition-all ${sub.status === 'Pago' ? 'text-gray-500 line-through' : 'text-gray-200'}`}>{sub.name}</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] uppercase font-bold tracking-wider ${sub.status === 'Pago' ? 'text-gray-600' : 'text-gray-500'}`}>{sub.category} • Vence {sub.date}</span>
                        {sub.status === 'Pago' && <span className="text-[8px] bg-[#00FF00]/20 text-[#00FF00] px-1.5 py-0.5 rounded font-bold uppercase tracking-widest">Pago</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`font-bold text-sm transition-all ${sub.status === 'Pago' ? 'text-gray-600' : 'text-gray-300 group-hover:text-white'}`}>
                      {Number(sub.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                    <button onClick={() => handleDeleteSub(sub.id)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-opacity">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {subscriptions.length === 0 && (
                <div className="text-center py-4 text-gray-500 text-sm">Nenhuma conta cadastrada.</div>
              )}
            </div>
            
            <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center">
              <span className="text-gray-400 font-bold uppercase tracking-widest text-xs">Custo Fixo Total</span>
              <span className="text-2xl font-black text-white">
                {totalFixed.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </span>
            </div>

          </div>

          {/* FINANCIAMENTOS - ESTÉTICA MINIMALISTA */}
          <div className="bg-[#111111] border border-white/5 p-8 rounded-3xl relative overflow-hidden">
            {/* Background glow for elegance */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-[80px] pointer-events-none" />
            
            <h2 className="text-2xl font-black uppercase tracking-tight mb-8 flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                  <Car className="w-5 h-5 text-purple-400" />
                </div>
                Meus Financiamentos
              </div>
              <button className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors border border-white/5" title="Adicionar Financiamento">
                <Plus className="w-4 h-4 text-purple-400" />
              </button>
            </h2>

            <div className="flex flex-col gap-6 relative z-10">
              {financings.map(fin => {
                const progress = (fin.paidInstallments / fin.totalInstallments) * 100;
                return (
                  <div key={fin.id} className="group relative">
                    {/* Minimalist Data Row */}
                    <div className="flex justify-between items-end mb-4">
                      <div className="flex flex-col gap-1">
                        <h4 className="font-bold text-white text-lg tracking-tight">{fin.name}</h4>
                        <span className="text-[10px] text-gray-500 font-medium uppercase tracking-widest block">
                          Parcela de <span className="text-gray-300 font-bold">{fin.installmentValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                        </span>
                        <span className="text-[10px] text-gray-500 font-medium uppercase tracking-widest block">
                          Total Pago: <span className="text-purple-400 font-bold">{(fin.paidInstallments * fin.installmentValue).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                        </span>
                      </div>
                      <div className="text-right flex flex-col items-end">
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl font-black text-purple-400 leading-none">{fin.paidInstallments}</span>
                          <span className="text-sm font-bold text-gray-600">/ {fin.totalInstallments}</span>
                        </div>
                        <span className="text-[9px] text-gray-500 uppercase tracking-widest mt-1">Parcelas Pagas</span>
                      </div>
                    </div>

                    {/* Minimalist Progress Bar */}
                    <div className="mb-5">
                      <div className="flex justify-between text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-2">
                        <span>Progresso do Contrato</span>
                        <span className="text-purple-400">{progress.toFixed(1)}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)] transition-all duration-1000 ease-out" style={{ width: `${progress}%` }} />
                      </div>
                    </div>

                    {/* Sleek Action Area */}
                    <div className="flex justify-between items-center pt-5 border-t border-white/5 mt-5">
                       <div className="text-xs text-gray-500">
                          Faltam <span className="font-bold text-white">{fin.totalInstallments - fin.paidInstallments}</span> parcelas
                       </div>
                       <button 
                         onClick={() => handlePayInstallment(fin.id)}
                         disabled={fin.paidInstallments >= fin.totalInstallments}
                         className="py-2.5 px-6 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 disabled:opacity-50 disabled:hover:bg-purple-500/10 disabled:cursor-not-allowed rounded-full font-bold uppercase tracking-wider text-[10px] transition-all flex items-center justify-center gap-2 border border-purple-500/20 hover:border-purple-500/40">
                         <Check className="w-3.5 h-3.5" />
                         {fin.paidInstallments >= fin.totalInstallments ? "Quitado!" : "Registrar Pagamento"}
                       </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* METAS & COFRE */}
          <div className="bg-[#111111] border border-white/5 p-8 rounded-3xl relative overflow-hidden h-fit">
            <h2 className="text-2xl font-black uppercase tracking-tight mb-6 flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3">
                <PiggyBank className="w-6 h-6 text-emerald-400" />
                Reservas & Metas
              </div>
              <button onClick={() => setOpenGoal(true)} className="p-2 bg-emerald-400/10 hover:bg-emerald-400/20 rounded-full transition-colors border border-emerald-400/20" title="Criar Nova Meta">
                <Plus className="w-5 h-5 text-emerald-400" />
              </button>
            </h2>

            <div className="flex flex-col gap-6 relative z-10">
              {goals.map(goal => {
                const progress = (goal.saved / goal.target) * 100;
                return (
                  <div key={goal.id} className="group relative">
                    <div className="flex justify-between items-end mb-4">
                      <div className="flex flex-col gap-1">
                        <h4 className="font-bold text-white text-lg tracking-tight">{goal.name}</h4>
                        <span className="text-[10px] text-gray-500 font-medium uppercase tracking-widest block">
                          Objetivo: <span className="text-gray-300 font-bold">{goal.target.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                        </span>
                      </div>
                      <div className="text-right flex flex-col items-end">
                        <span className="text-xl font-black text-white leading-none">{goal.saved.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                        <span className="text-[9px] text-gray-500 uppercase tracking-widest mt-1">Guardados</span>
                      </div>
                    </div>

                    <div className="mb-5">
                      <div className="flex justify-between text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-2">
                        <span>Progresso</span>
                        <span className={goal.color.split(' ')[0]}>{progress.toFixed(1)}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full transition-all duration-1000 ease-out ${goal.color.split(' ')[1]}`} style={{ width: `${progress}%` }} />
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-5 border-t border-white/5 mt-5">
                       <div className="text-xs text-gray-500">
                          Faltam <span className="font-bold text-white">{(goal.target - goal.saved).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                       </div>
                       <button 
                         onClick={() => handleOpenAddMoney(goal.id)}
                         disabled={goal.saved >= goal.target}
                         className={`py-2 px-4 rounded-full font-bold uppercase tracking-wider text-[10px] transition-all flex items-center justify-center gap-2 border ${goal.color}`}>
                         <Plus className="w-3.5 h-3.5" />
                         {goal.saved >= goal.target ? "Concluída!" : "Guardar Dinheiro"}
                       </button>
                    </div>
                  </div>
                )
              })}
              {goals.length === 0 && (
                <div className="text-center py-6 text-gray-500 text-sm">Nenhuma meta criada.</div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* DIALOG: NOVO GANHO */}
      <Dialog open={openIncome} onOpenChange={setOpenIncome}>
        <DialogContent className="bg-[#111111] border-white/10 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black uppercase tracking-tight text-[#00FF00]">Nova Renda</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Nome da Receita</label>
              <Input value={newIncome.name} onChange={e => setNewIncome({...newIncome, name: e.target.value})} placeholder="Ex: Salário, Freelance..." className="bg-black/50 border-white/10" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Valor (R$)</label>
              <Input type="number" value={newIncome.amount} onChange={e => setNewIncome({...newIncome, amount: e.target.value})} placeholder="Ex: 5000" className="bg-black/50 border-white/10" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Tipo</label>
                <Input value={newIncome.type} onChange={e => setNewIncome({...newIncome, type: e.target.value})} placeholder="Fixo / Extra" className="bg-black/50 border-white/10" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Frequência</label>
                <select 
                  className="flex h-10 w-full rounded-md border border-white/10 bg-black/50 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
                  value={newIncome.frequency}
                  onChange={e => setNewIncome({...newIncome, frequency: e.target.value})}
                >
                  <option value="Mensal">Mensal</option>
                  <option value="Quinzenal">Quinzenal</option>
                  <option value="Semanal">Semanal</option>
                  <option value="Única">Única</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Data / Dia</label>
              <Input value={newIncome.date} onChange={e => setNewIncome({...newIncome, date: e.target.value})} placeholder="Ex: Toda Sexta, ou Dia 05" className="bg-black/50 border-white/10" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpenIncome(false)} className="hover:bg-white/5 hover:text-white">Cancelar</Button>
            <Button onClick={handleAddIncome} className="bg-[#00FF00] text-black hover:bg-[#00FF00]/80 font-bold">Salvar Receita</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DIALOG: NOVO CARTÃO */}
      <Dialog open={openCard} onOpenChange={setOpenCard}>
        <DialogContent className="bg-[#111111] border-white/10 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black uppercase tracking-tight text-[#CCFF00]">Novo Cartão</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Nome / Banco</label>
              <Input value={newCard.name} onChange={e => setNewCard({...newCard, name: e.target.value})} placeholder="Ex: Nubank" className="bg-black/50 border-white/10" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Limite Total</label>
                <Input type="number" value={newCard.limit} onChange={e => setNewCard({...newCard, limit: e.target.value})} placeholder="Ex: 5000" className="bg-black/50 border-white/10" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Fatura Atual</label>
                <Input type="number" value={newCard.current} onChange={e => setNewCard({...newCard, current: e.target.value})} placeholder="Ex: 1200" className="bg-black/50 border-white/10" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Dia Fechamento</label>
                <Input type="number" value={newCard.closingDay} onChange={e => setNewCard({...newCard, closingDay: e.target.value})} placeholder="Ex: 25" className="bg-black/50 border-white/10" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Dia Vencimento</label>
                <Input type="number" value={newCard.dueDay} onChange={e => setNewCard({...newCard, dueDay: e.target.value})} placeholder="Ex: 5" className="bg-black/50 border-white/10" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpenCard(false)} className="hover:bg-white/5 hover:text-white">Cancelar</Button>
            <Button onClick={handleAddCard} className="bg-[#CCFF00] text-black hover:bg-[#CCFF00]/80 font-bold">Salvar Cartão</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DIALOG: ATUALIZAR FATURA */}
      <Dialog open={openUpdateCard} onOpenChange={setOpenUpdateCard}>
        <DialogContent className="bg-[#111111] border-white/10 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black uppercase tracking-tight text-white">Atualizar Fatura</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Valor Atual Fechado (R$)</label>
              <Input 
                type="number" 
                value={updateCardValue} 
                onChange={e => setUpdateCardValue(e.target.value)} 
                placeholder="Ex: 1500.50" 
                className="bg-black/50 border-white/10 text-xl font-bold" 
                autoFocus
              />
            </div>
            <p className="text-xs text-gray-500">Ao fechar a sua fatura, lance o valor atualizado aqui para as estatísticas do mês baterem com a sua dívida real.</p>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpenUpdateCard(false)} className="hover:bg-white/5 hover:text-white">Cancelar</Button>
            <Button onClick={handleUpdateCardInvoice} className="bg-white text-black hover:bg-gray-200 font-bold">Lançar Valor</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DIALOG: NOVA CONTA */}
      <Dialog open={openSub} onOpenChange={setOpenSub}>
        <DialogContent className="bg-[#111111] border-white/10 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black uppercase tracking-tight text-orange-400">Nova Conta / Fixo</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Nome da Conta</label>
              <Input value={newSub.name} onChange={e => setNewSub({...newSub, name: e.target.value})} placeholder="Ex: Netflix, Aluguel" className="bg-black/50 border-white/10" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Valor Mensal</label>
              <Input type="number" value={newSub.price} onChange={e => setNewSub({...newSub, price: e.target.value})} placeholder="Ex: 55.90" className="bg-black/50 border-white/10" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Categoria</label>
                <Input value={newSub.category} onChange={e => setNewSub({...newSub, category: e.target.value})} placeholder="Ex: Moradia" className="bg-black/50 border-white/10" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Vencimento</label>
                <Input value={newSub.date} onChange={e => setNewSub({...newSub, date: e.target.value})} placeholder="Ex: Dia 10" className="bg-black/50 border-white/10" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpenSub(false)} className="hover:bg-white/5 hover:text-white">Cancelar</Button>
            <Button onClick={handleAddSub} className="bg-orange-400 text-black hover:bg-orange-500 font-bold">Salvar Conta</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DIALOG: NOVO GASTO AVULSO */}
      <Dialog open={openExpense} onOpenChange={setOpenExpense}>
        <DialogContent className="bg-[#111111] border-red-500/20 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black uppercase tracking-tight text-red-400">Novo Gasto Avulso</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">O que você pagou?</label>
              <Input value={newExpense.name} onChange={e => setNewExpense({...newExpense, name: e.target.value})} placeholder="Ex: Padaria, Uber, Ifood..." className="bg-black/50 border-white/10" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Valor (R$)</label>
              <Input type="number" value={newExpense.amount} onChange={e => setNewExpense({...newExpense, amount: e.target.value})} placeholder="Ex: 45.90" className="bg-black/50 border-white/10" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Método</label>
                <select 
                  className="flex h-10 w-full rounded-md border border-white/10 bg-black/50 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
                  value={newExpense.method}
                  onChange={e => setNewExpense({...newExpense, method: e.target.value})}
                >
                  <option value="PIX">PIX</option>
                  <option value="Débito">Débito</option>
                  <option value="Dinheiro">Dinheiro</option>
                  <option value="Transferência">Transferência</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Quando?</label>
                <Input value={newExpense.date} onChange={e => setNewExpense({...newExpense, date: e.target.value})} placeholder="Ex: Hoje" className="bg-black/50 border-white/10" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpenExpense(false)} className="hover:bg-white/5 hover:text-white">Cancelar</Button>
            <Button onClick={handleAddExpense} className="bg-red-500 text-white hover:bg-red-600 font-bold">Registrar Gasto</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DIALOG: NOVA META */}
      <Dialog open={openGoal} onOpenChange={setOpenGoal}>
        <DialogContent className="bg-[#111111] border-emerald-400/20 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black uppercase tracking-tight text-emerald-400">Nova Meta</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Nome da Meta</label>
              <Input value={newGoal.name} onChange={e => setNewGoal({...newGoal, name: e.target.value})} placeholder="Ex: Reserva de Emergência, Viagem..." className="bg-black/50 border-white/10" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Objetivo Final (R$)</label>
              <Input type="number" value={newGoal.target} onChange={e => setNewGoal({...newGoal, target: e.target.value})} placeholder="Ex: 10000" className="bg-black/50 border-white/10" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpenGoal(false)} className="hover:bg-white/5 hover:text-white">Cancelar</Button>
            <Button onClick={handleAddGoal} className="bg-emerald-400 text-black hover:bg-emerald-500 font-bold">Criar Meta</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DIALOG: GUARDAR DINHEIRO */}
      <Dialog open={openAddMoney} onOpenChange={setOpenAddMoney}>
        <DialogContent className="bg-[#111111] border-emerald-400/20 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black uppercase tracking-tight text-emerald-400">Guardar Dinheiro</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Valor a guardar agora (R$)</label>
              <Input type="number" value={addMoneyAmount} onChange={e => setAddMoneyAmount(e.target.value)} placeholder="Ex: 500" className="bg-black/50 border-white/10 text-xl font-bold" autoFocus />
            </div>
            <p className="text-xs text-gray-500">Ao guardar dinheiro, lembre-se que isso sairá do seu saldo livre do mês para compor a sua reserva.</p>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpenAddMoney(false)} className="hover:bg-white/5 hover:text-white">Cancelar</Button>
            <Button onClick={handleAddMoneyToGoal} className="bg-emerald-400 text-black hover:bg-emerald-500 font-bold">Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}

// Subcomponents

function MetricCard({ 
  title, 
  value, 
  icon, 
  trend, 
  theme = 'default' 
}: { 
  title: string, 
  value: number, 
  icon: React.ReactNode, 
  trend: string, 
  theme?: 'green' | 'red' | 'orange' | 'emerald' | 'default' 
}) {
  
  const themes = {
    green: {
      bg: "bg-[#CCFF00]/5 hover:bg-[#CCFF00]/10",
      border: "border-[#CCFF00]/20 hover:border-[#CCFF00]/40",
      text: "text-[#CCFF00]",
      trendText: "text-[#CCFF00]/80",
      iconBg: "bg-[#CCFF00]/10 border-[#CCFF00]/20",
      glow: "bg-[#CCFF00]/20"
    },
    red: {
      bg: "bg-red-500/5 hover:bg-red-500/10",
      border: "border-red-500/20 hover:border-red-500/40",
      text: "text-red-400",
      trendText: "text-red-400/80",
      iconBg: "bg-red-500/10 border-red-500/20",
      glow: "bg-red-500/20"
    },
    orange: {
      bg: "bg-orange-500/5 hover:bg-orange-500/10",
      border: "border-orange-500/20 hover:border-orange-500/40",
      text: "text-orange-400",
      trendText: "text-orange-400/80",
      iconBg: "bg-orange-500/10 border-orange-500/20",
      glow: "bg-orange-500/20"
    },
    emerald: {
      bg: "bg-emerald-500/5 hover:bg-emerald-500/10",
      border: "border-emerald-500/20 hover:border-emerald-500/40",
      text: "text-emerald-400",
      trendText: "text-emerald-400/80",
      iconBg: "bg-emerald-500/10 border-emerald-500/20",
      glow: "bg-emerald-500/20"
    },
    default: {
      bg: "bg-[#111111] hover:bg-[#1a1a1a]",
      border: "border-white/5 hover:border-white/20",
      text: "text-white",
      trendText: "text-gray-500",
      iconBg: "bg-white/5 border-white/5",
      glow: "bg-white/5"
    }
  };

  const t = themes[theme];

  return (
    <div className={`${t.bg} border ${t.border} p-6 rounded-3xl relative overflow-hidden group transition-all duration-300`}>
      <div className={`absolute -top-10 -right-10 w-32 h-32 ${t.glow} rounded-full blur-[40px] pointer-events-none group-hover:scale-150 transition-transform duration-500`} />
      <div className="flex justify-between items-start mb-4 relative z-10">
        <h3 className="text-gray-400 font-bold uppercase tracking-widest text-[10px] w-2/3 leading-tight group-hover:text-white transition-colors">{title}</h3>
        <div className={`p-2 rounded-xl border ${t.iconBg} transition-colors`}>
          {icon}
        </div>
      </div>
      <div className={`text-3xl font-black ${t.text} mb-2 tracking-tighter relative z-10`}>
        {value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
      </div>
      <div className={`text-[10px] font-bold uppercase tracking-widest ${t.trendText} relative z-10`}>
        {trend}
      </div>
    </div>
  );
}

function WifiIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12.55a11 11 0 0 1 14.08 0" />
      <path d="M1.42 9a16 16 0 0 1 21.16 0" />
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
      <line x1="12" y1="20" x2="12.01" y2="20" />
    </svg>
  );
}
