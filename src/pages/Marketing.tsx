import React, { useState } from "react";
import { FaTiktok } from "react-icons/fa";
import { AreaChart, Area, ResponsiveContainer, YAxis } from "recharts";
import {
  TrendingUp,
  Target,
  Activity,
  Flame,
  AlertCircle,
  LayoutGrid,
  Plus,
  X,
  Palette,
  Image as ImageIcon,
  FileVideo,
  MousePointerClick,
  Copy,
  Download,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  ShieldCheck,
  Clock,
  Lock,
  CheckCircle2,
  User,
  Truck,
  MapPin,
  BarChart3,
  Gauge,
  Instagram,
  Users,
  Smartphone,
  Heart,
  MessageCircle,
  ShoppingBag,
  PlayCircle,
  FileText,
  PenTool
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const BrandPalette = [
  { name: "Primary White", hex: "#FFFFFF", class: "bg-white" },
  { name: "Surface Dark", hex: "#111111", class: "bg-[#111111]" },
  { name: "Border Subtle", hex: "#262626", class: "bg-[#262626]" },
  { name: "Accent Blue", hex: "#2563EB", class: "bg-blue-600" },
  { name: "Success Green", hex: "#16A34A", class: "bg-green-600" }
];

const CAMPAIGNS_ROADMAP = [
  { 
    id: 1, title: "Black Friday", color: "bg-blue-600", startDay: 5, endDay: 25,
    milestones: [
      { day: 10, label: "Aquecimento", status: "approved", owner: "Design" }, 
      { day: 15, label: "Banners", status: "blocked", owner: "Financeiro" }, 
      { day: 20, label: "Lote 2", status: "pending", owner: "Growth" }
    ]
  },
  { 
    id: 2, title: "Inverno", color: "bg-purple-600", startDay: 2, endDay: 18,
    milestones: [
      { day: 5, label: "Teaser", status: "approved", owner: "Growth" }, 
      { day: 12, label: "Live", status: "pending", owner: "Mkt" }, 
      { day: 18, label: "Fim", status: "pending", owner: "Comercial" }
    ]
  },
  { 
    id: 3, title: "Saldão", color: "bg-emerald-600", startDay: 20, endDay: 28,
    milestones: [
      { day: 20, label: "Start", status: "approved", owner: "Growth" }, 
      { day: 25, label: "Remarketing", status: "pending", owner: "Design" }
    ]
  }
];

const CRM_PARTNERS = [
  { id: 1, avatar: "https://i.pravatar.cc/150?u=1", name: "@tech_influencer", niche: "Tecnologia", status: "Postado", base: "R$ 500", upside: "15%", tracking: "TECH15", roi: "R$ 4.250", roiColor: "text-emerald-500", whitelisted: true, cpa: "R$ 15,20", tier: "A", rightsExp: "120" },
  { id: 2, avatar: "https://i.pravatar.cc/150?u=2", name: "Maria Clara", niche: "Lifestyle", status: "Aguardando Roteiro", base: "Permuta", upside: "10%", tracking: "MARIA10", roi: "R$ 0", roiColor: "text-gray-500", whitelisted: false, cpa: "-", tier: "C", rightsExp: "10" },
  { id: 3, avatar: "https://i.pravatar.cc/150?u=3", name: "Lucas Dev", niche: "Programação", status: "Aprovação Interna", base: "R$ 300", upside: "R$ 50/venda", tracking: "UTM_LUCAS", roi: "R$ 2.100", roiColor: "text-emerald-500", whitelisted: true, cpa: "R$ 22,00", tier: "A", rightsExp: "60" },
  { id: 4, avatar: "https://i.pravatar.cc/150?u=4", name: "Revenda Sul", niche: "B2B", status: "Refação", base: "R$ 1.000", upside: "20%", tracking: "REVENDASUL", roi: "R$ 0", roiColor: "text-gray-500", whitelisted: false, cpa: "-", tier: "B", rightsExp: "5" }
];

const ASSETS = [
  { id: 1, type: "Logo", name: "Principal_Claro.svg", size: "1.2 MB" },
  { id: 2, type: "Banner", name: "Capa_MercadoLivre.jpg", size: "4.5 MB" },
  { id: 3, type: "Vídeo", name: "Reels_Inverno.mp4", size: "45 MB" },
];

export default function Marketing() {

  const [isSalesModalOpen, setIsSalesModalOpen] = useState(false);
  const [salesForm, setSalesForm] = useState({ vendas: 0, vendasGrowth: 0 });

  const handleEditSales = () => {
    setSalesForm({ vendas: marketingBudget.vendas || 0, vendasGrowth: marketingBudget.vendasGrowth || 0 });
    setIsSalesModalOpen(true);
  };

  const handleSaveSales = () => {
    const updated = { ...marketingBudget, vendas: salesForm.vendas, vendasGrowth: salesForm.vendasGrowth };
    setMarketingBudget(updated);
    localStorage.setItem("rama_marketing_budget", JSON.stringify(updated));
    setIsSalesModalOpen(false);
  };


  const [isScalingActive, setIsScalingActive] = useState(false);
  const [isNewMonthPromptOpen, setIsNewMonthPromptOpen] = useState(false);
  const [approvals, setApprovals] = useState([
    { id: 1, title: 'Cachê Extra: Virgínia', campaign: 'Campanha Black Friday', amount: 15000, description: 'Cachê adicional aprovado em reunião com diretoria para fechar 3 stories e 1 reel.' },
    { id: 2, title: 'Boost Meta Ads', campaign: 'Escala de Criativo #04', amount: 5000, description: 'Injeção de verba para escalar criativo validado com ROAS > 4.' }
  ]);
  const [isCreateApprovalModalOpen, setIsCreateApprovalModalOpen] = useState(false);
  const [approvalForm, setApprovalForm] = useState({ title: '', campaign: '', amount: 0, description: '' });
  const [approvalDetails, setApprovalDetails] = useState(null);

  React.useEffect(() => {
    const savedApprovals = localStorage.getItem("rama_approvals");
    if (savedApprovals) {
      try { setApprovals(JSON.parse(savedApprovals)); } catch(e){}
    }
  }, []);

  const handleCreateApproval = () => {
    const newApproval = { ...approvalForm, id: Date.now() };
    const updated = [...approvals, newApproval];
    setApprovals(updated);
    localStorage.setItem("rama_approvals", JSON.stringify(updated));
    setIsCreateApprovalModalOpen(false);
    setApprovalForm({ title: '', campaign: '', amount: 0, description: '' });
  };

  const handleApprove = (id, amount) => {
    const updated = approvals.filter(a => a.id !== id);
    setApprovals(updated);
    localStorage.setItem("rama_approvals", JSON.stringify(updated));
    
    // Add to spent budget
    const updatedBudget = { ...marketingBudget, gasto: marketingBudget.gasto + amount };
    setMarketingBudget(updatedBudget);
    localStorage.setItem("rama_marketing_budget", JSON.stringify(updatedBudget));
    setApprovalDetails(null);
  };

  const handleReject = (id) => {
    const updated = approvals.filter(a => a.id !== id);
    setApprovals(updated);
    localStorage.setItem("rama_approvals", JSON.stringify(updated));
    setApprovalDetails(null);
  };

  const handleSplitChange = (key, newValue) => {
    const currentSplit = marketingBudget.budgetSplit || { trafego: 60, influenciadores: 25, seeding: 15 };
    const oldVal = currentSplit[key];
    let delta = newValue - oldVal;
    
    if (newValue > 100) newValue = 100;
    if (newValue < 0) newValue = 0;
    
    const others = ['trafego', 'influenciadores', 'seeding'].filter(k => k !== key);
    const otherTotal = currentSplit[others[0]] + currentSplit[others[1]];

    let newForm = { ...currentSplit, [key]: newValue };

    if (otherTotal === 0) {
       const remainder = 100 - newValue;
       newForm[others[0]] = Math.round(remainder / 2);
       newForm[others[1]] = remainder - newForm[others[0]];
    } else {
       const remainder = 100 - newValue;
       let val0 = Math.round((currentSplit[others[0]] / otherTotal) * remainder);
       let val1 = remainder - val0;
       newForm[others[0]] = val0;
       newForm[others[1]] = val1;
    }
    
    const updated = { ...marketingBudget, budgetSplit: newForm };
    setMarketingBudget(updated);
    localStorage.setItem("rama_marketing_budget", JSON.stringify(updated));
  };


  const [socialMetrics, setSocialMetrics] = useState({
    instagram: { followers: 135145, likes: 42500, comments: 8200, followersGrowth: 1.2, history: [{name:"M-4", value: 120000}, {name:"M-3", value: 125000}, {name:"M-2", value: 130000}, {name:"M-1", value: 135145}] },
    tiktok: { followers: 241800, likes: 89200, comments: 14500, followersGrowth: 5.4, history: [{name:"M-4", value: 190000}, {name:"M-3", value: 210000}, {name:"M-2", value: 230000}, {name:"M-1", value: 241800}] }
  });
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);
  const [editingSocial, setEditingSocial] = useState("instagram");
  const [socialForm, setSocialForm] = useState({ followers: 0, likes: 0, comments: 0 });

  React.useEffect(() => {
    const saved = localStorage.getItem("rama_social_metrics");
    if (saved) {
      try { setSocialMetrics(JSON.parse(saved)); } catch (e) {}
    }
  }, []);

  const handleEditSocial = (platform) => {
    setEditingSocial(platform);
    setSocialForm(socialMetrics[platform]);
    setIsSocialModalOpen(true);
  };

  const handleSaveSocial = () => {
    const oldFollowers = socialMetrics[editingSocial].followers;
    let growth = 0;
    if (oldFollowers > 0 && socialForm.followers !== oldFollowers) {
      growth = (((socialForm.followers - oldFollowers) / oldFollowers) * 100);
    } else {
      growth = socialMetrics[editingSocial].followersGrowth; // keep old if no change
    }
    const updated = {
      ...socialMetrics,
      [editingSocial]: {
        ...socialForm,
        followersGrowth: parseFloat(Number(growth).toFixed(1))
      }
    };
    setSocialMetrics(updated);
    localStorage.setItem("rama_social_metrics", JSON.stringify(updated));
    setIsSocialModalOpen(false);
  };

  const formatK = (num) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  
  // --- BUDGET & SALES STATES ---
  const getCurrentMonthStr = () => {
    const months = ['janeiro', 'fevereiro', 'marco', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
    return months[new Date().getMonth()];
  };

  const getMonthName = (monthStr) => {
    if (!monthStr) return "";
    const map = {
      janeiro: 'Janeiro', fevereiro: 'Fevereiro', marco: 'Março',
      abril: 'Abril', maio: 'Maio', junho: 'Junho',
      julho: 'Julho', agosto: 'Agosto', setembro: 'Setembro',
      outubro: 'Outubro', novembro: 'Novembro', dezembro: 'Dezembro'
    };
    return map[monthStr] || monthStr;
  };

  const [marketingBudget, setMarketingBudget] = useState(() => {
    const saved = localStorage.getItem("rama_marketing_budget");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.currentMonth !== getCurrentMonthStr()) {
        parsed.needsMonthUpdate = true;
      }
      return parsed;
    }
    return {
      currentMonth: getCurrentMonthStr(),
      total: 150000,
      gasto: 87540,
      vendas: 450000,
      vendasGrowth: 15,
      history: [],
      budgetSplit: { trafego: 52, cache: 48, seeding: 0 }
    };
  });

  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [budgetForm, setBudgetForm] = useState({ total: 0, gasto: 0 });
  
  // NOTE: isNewMonthPromptOpen and isScalingActive were already injected by inject_hooks_final.cjs!
  // Let's NOT duplicate them if they exist! Wait, inject_hooks_final injected them!
  // Let's just define the handlers for Budget!

  const handleEditBudget = () => {
    setBudgetForm({ total: marketingBudget.total, gasto: marketingBudget.gasto });
    setIsBudgetModalOpen(true);
  };

  const handleSaveBudget = () => {
    const updated = { ...marketingBudget, total: budgetForm.total, gasto: budgetForm.gasto };
    setMarketingBudget(updated);
    localStorage.setItem("rama_marketing_budget", JSON.stringify(updated));
    setIsBudgetModalOpen(false);
  };

  const handleConfirmNewMonth = (keepSameBudget) => {
    const newHistory = [...(marketingBudget.history || [])];
    if (marketingBudget.total > 0 || marketingBudget.gasto > 0) {
      newHistory.push({
        month: marketingBudget.currentMonth,
        total: marketingBudget.total,
        gasto: marketingBudget.gasto
      });
    }
    const updated = {
      ...marketingBudget,
      currentMonth: getCurrentMonthStr(),
      total: keepSameBudget ? marketingBudget.total : 0,
      gasto: 0,
      history: newHistory
    };
    delete updated.needsMonthUpdate;
    setMarketingBudget(updated);
    localStorage.setItem("rama_marketing_budget", JSON.stringify(updated));
    // The state setter for isNewMonthPromptOpen is already defined!
    setIsNewMonthPromptOpen(false);
    if (!keepSameBudget) {
      setBudgetForm({ total: 0, gasto: 0 });
      setIsBudgetModalOpen(true);
    }
  };

  const [activeTab, setActiveTab] = useState<"orcamento" | "cockpit" | "roadmap" | "crm" | "performance">("cockpit");
  const [viewScope, setViewScope] = useState<"global" | "marca_propria">("global");
  const [isBrandVaultOpen, setIsBrandVaultOpen] = useState(false);
  const [zoom, setZoom] = useState<"semana" | "mes" | "trimestre">("mes");
  const zoomDays = zoom === "semana" ? 7 : zoom === "mes" ? 30 : 90;

  // Dados mockados para os KPIs de acordo com o escopo
  const kpiData = {
    global: { orcamento: "R$ 5.000", vendasSite: "R$ 0,00", cpa: "R$ 13,48", percentGasto: 65, vendasTrend: 0, cpaTrend: 2 },
    marca_propria: { orcamento: "R$ 2.000", vendasSite: "R$ 0,00", cpa: "R$ 8,15", percentGasto: 40, vendasTrend: 0, cpaTrend: -10 }
  };
  const currentKPI = kpiData[viewScope];

  return (
    <div className="flex flex-col h-full w-full pl-24 bg-[#040809] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#071618] via-[#040809] to-[#020404] font-sans pb-20 md:pb-0 overflow-hidden relative">
      
      <div className="p-4 md:p-5 max-w-[1400px] w-full mx-auto h-full flex flex-col gap-4 relative z-10">
        
        {/* Header Compacto Premium */}
        <div className="flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-xl font-semibold text-white tracking-tight flex items-center gap-2">
              MARKETING & <span className="text-cyan-400 font-light">GROWTH</span>
            </h1>
            <p className="text-gray-400 text-xs mt-0.5">Gestão integrada de campanhas, CRM e aquisição.</p>
          </div>
          
        </div>

        {/* Tabs de Navegação Estilo Pill */}
        <div className="flex items-center gap-2 mt-2 shrink-0 overflow-x-auto no-scrollbar">
          {[
            { id: "cockpit", label: "Visão Analítica" },
            { id: "orcamento", label: "Orçamento e Investimentos" },
            { id: "roadmap", label: "Creative Studio (Roteiros)" },
            { id: "crm", label: "CRM Influenciadores" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all ${
                activeTab === tab.id 
                  ? "bg-white/10 text-white shadow-sm" 
                  : "bg-transparent text-gray-500 hover:text-gray-300 hover:bg-white/5"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>


        {/* Tab Content Flex-Grow para preencher e rolar apenas dentro */}
        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
          
          {/* TAB 0: COCKPIT EXECUTIVO */}
          {activeTab === "cockpit" && (
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-6">
              <div className="grid grid-cols-12 gap-4 min-h-full">
                
                {/* --- NOVA LINHA DO COCKPIT --- */}

                {/* Social Media & TikTok Trackers (Compactos) */}
                <div className="col-span-12 lg:col-span-8 flex flex-col gap-4 mt-2">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    
                    {/* INSTAGRAM COMPACTO */}
                    <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-4 relative overflow-hidden flex flex-col h-[320px]">
                      <div className="absolute -right-10 -top-10 w-24 h-24 bg-purple-500/10 rounded-full blur-[30px] pointer-events-none"></div>
                      <div className="flex items-center justify-between mb-2 relative z-10">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                            <Instagram className="w-4 h-4 text-white" />
                          </div>
                          <h3 className="text-white text-sm font-semibold tracking-tight">Instagram</h3>
                        </div>
                        <button onClick={() => handleEditSocial('instagram')} className="bg-white/5 hover:bg-white/10 text-gray-400 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase transition-colors border border-white/10 flex items-center gap-1">Lançar +</button>
                      </div>
                      <div className="flex items-end gap-3 mb-4 mt-2">
                        <div>
                          <span className="text-[9px] font-medium tracking-widest uppercase text-gray-500 block mb-0.5">Seguidores Totais</span>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-white">{socialMetrics.instagram.followers.toLocaleString('pt-BR')}</span>
                            <span className="text-emerald-400 text-[10px] font-medium flex items-center bg-emerald-400/10 px-1.5 py-0.5 rounded"><ArrowUpRight className="w-2.5 h-2.5 mr-0.5" /> {socialMetrics.instagram.followersGrowth > 0 ? '+' : ''}{socialMetrics.instagram.followersGrowth}%</span>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <div className="bg-[#111] border border-white/5 rounded-lg p-2.5 flex flex-col justify-between">
                          <div className="flex items-center gap-1.5 mb-1">
                            <Heart className="w-3 h-3 text-gray-500" />
                            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Likes (Mês)</span>
                          </div>
                          <span className="text-white text-sm font-bold">{formatK(socialMetrics.instagram.likes)}</span>
                        </div>
                        <div className="bg-[#111] border border-white/5 rounded-lg p-2.5 flex flex-col justify-between">
                          <div className="flex items-center gap-1.5 mb-1">
                            <MessageCircle className="w-3 h-3 text-gray-500" />
                            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Comentários</span>
                          </div>
                          <span className="text-white text-sm font-bold">{formatK(socialMetrics.instagram.comments)}</span>
                        </div>
                      </div>
                      <div className="mt-auto pt-3 border-t border-white/5 flex-1 min-h-[80px] flex flex-col relative">
                        <span className="text-[9px] font-medium tracking-widest uppercase text-gray-600 absolute top-2 left-0 z-10">Evolução de Audiência</span>
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={socialMetrics.instagram.history}>
                            <defs>
                              <linearGradient id="colorInsta" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#d946ef" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="#d946ef" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <Area type="monotone" dataKey="value" stroke="#d946ef" strokeWidth={2} fillOpacity={1} fill="url(#colorInsta)" />
                            <YAxis domain={['dataMin', 'dataMax']} hide />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    
                    {/* TIKTOK COMPACTO */}
                    <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-4 relative overflow-hidden flex flex-col h-[320px]">
                      <div className="absolute -right-10 -top-10 w-24 h-24 bg-cyan-500/10 rounded-full blur-[30px] pointer-events-none"></div>
                      <div className="flex items-center justify-between mb-2 relative z-10">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg">
                            <FaTiktok className="w-4 h-4 text-white" />
                          </div>
                          <h3 className="text-white text-sm font-semibold tracking-tight">TikTok</h3>
                        </div>
                        <button onClick={() => handleEditSocial('tiktok')} className="bg-white/5 hover:bg-white/10 text-gray-400 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase transition-colors border border-white/10 flex items-center gap-1">Lançar +</button>
                      </div>
                      <div className="flex items-end gap-3 mb-4 mt-2">
                        <div>
                          <span className="text-[9px] font-medium tracking-widest uppercase text-gray-500 block mb-0.5">Seguidores Totais</span>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-white">{socialMetrics.tiktok.followers.toLocaleString('pt-BR')}</span>
                            <span className="text-emerald-400 text-[10px] font-medium flex items-center bg-emerald-400/10 px-1.5 py-0.5 rounded"><ArrowUpRight className="w-2.5 h-2.5 mr-0.5" /> {socialMetrics.tiktok.followersGrowth > 0 ? '+' : ''}{socialMetrics.tiktok.followersGrowth}%</span>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <div className="bg-[#111] border border-white/5 rounded-lg p-2.5 flex flex-col justify-between">
                          <div className="flex items-center gap-1.5 mb-1">
                            <Heart className="w-3 h-3 text-gray-500" />
                            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Likes (Mês)</span>
                          </div>
                          <span className="text-white text-sm font-bold">{formatK(socialMetrics.tiktok.likes)}</span>
                        </div>
                        <div className="bg-[#111] border border-white/5 rounded-lg p-2.5 flex flex-col justify-between">
                          <div className="flex items-center gap-1.5 mb-1">
                            <MessageCircle className="w-3 h-3 text-gray-500" />
                            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Comentários</span>
                          </div>
                          <span className="text-white text-sm font-bold">{formatK(socialMetrics.tiktok.comments)}</span>
                        </div>
                      </div>
                      <div className="mt-auto pt-3 border-t border-white/5 flex-1 min-h-[80px] flex flex-col relative">
                        <span className="text-[9px] font-medium tracking-widest uppercase text-gray-600 absolute top-2 left-0 z-10">Evolução de Audiência</span>
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={socialMetrics.tiktok.history}>
                            <defs>
                              <linearGradient id="colorTikTok" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <Area type="monotone" dataKey="value" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorTikTok)" />
                            <YAxis domain={['dataMin', 'dataMax']} hide />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </div>
          </div>
            </div>
          )}

          {/* TAB 1: CREATIVE STUDIO (Master-Detail / Notion Style) */}
          {activeTab === "roadmap" && (
            <div className="flex-1 overflow-hidden flex gap-4 mt-4 h-full">
              
              {/* MASTER PANEL (Left Sidebar) */}
              <div className="w-[320px] flex-shrink-0 bg-[#0a0a0a] border border-white/5 rounded-2xl flex flex-col overflow-hidden h-full">
                <div className="p-4 border-b border-white/5 bg-[#111]/50 flex items-center justify-between sticky top-0 z-10 backdrop-blur-md">
                  <h3 className="text-white text-sm font-semibold tracking-tight">Suas Estratégias</h3>
                  <button className="text-cyan-400 hover:text-cyan-300 transition-colors p-1"><Plus className="w-4 h-4" /></button>
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-6">
                  
                  {/* Category: TikTok */}
                  <div>
                    <div className="flex items-center gap-2 mb-2 px-2">
                      <PlayCircle className="w-3.5 h-3.5 text-pink-400" />
                      <span className="text-xs font-bold uppercase tracking-widest text-gray-500">TikTok & UGC</span>
                    </div>
                    <div className="space-y-1">
                      <div className="bg-white/[0.08] border border-white/20 rounded-lg p-3 cursor-pointer flex flex-col gap-1.5 relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-all hover:bg-white/[0.12]">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-pink-500 rounded-l-lg"></div>
                        <span className="text-white text-xs font-medium ml-1">Unboxing "Ferramenta X"</span>
                        <div className="flex justify-between items-center ml-1">
                          <span className="text-[9px] text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded">Roteiro Pronto</span>
                          <span className="text-[9px] text-gray-500">2h atrás</span>
                        </div>
                      </div>
                      <div className="hover:bg-white/5 border border-transparent rounded-lg p-2.5 cursor-pointer flex flex-col gap-1.5 transition-colors">
                        <span className="text-gray-300 text-xs font-medium ml-1">Hook: "Perdi dinheiro..."</span>
                        <div className="flex justify-between items-center ml-1">
                          <span className="text-[9px] text-yellow-500 bg-yellow-500/10 px-1.5 py-0.5 rounded">Em Rascunho</span>
                          <span className="text-[9px] text-gray-500">Ontem</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Category: Instagram */}
                  <div>
                    <div className="flex items-center gap-2 mb-2 px-2">
                      <Instagram className="w-3.5 h-3.5 text-purple-400" />
                      <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Instagram</span>
                    </div>
                    <div className="space-y-1">
                      <div className="hover:bg-white/5 border border-transparent rounded-lg p-2.5 cursor-pointer flex flex-col gap-1.5 transition-colors">
                        <span className="text-gray-300 text-xs font-medium ml-1">Brief: @marceneiromoderno</span>
                        <div className="flex justify-between items-center ml-1">
                          <span className="text-[9px] text-cyan-400 bg-cyan-400/10 px-1.5 py-0.5 rounded">Aguardando</span>
                          <span className="text-[9px] text-gray-500">15/Ago</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Category: Shopee */}
                  <div>
                    <div className="flex items-center gap-2 mb-2 px-2">
                      <ShoppingBag className="w-3.5 h-3.5 text-orange-400" />
                      <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Shopee</span>
                    </div>
                    <div className="space-y-1">
                      <div className="hover:bg-white/5 border border-transparent rounded-lg p-2.5 cursor-pointer flex flex-col gap-1.5 transition-colors">
                        <span className="text-gray-300 text-xs font-medium ml-1">Mega Campanha 9.9</span>
                        <div className="flex justify-between items-center ml-1">
                          <span className="text-[9px] text-red-400 bg-red-400/10 px-1.5 py-0.5 rounded flex items-center gap-1"><Flame className="w-2.5 h-2.5" /> Alta Priori.</span>
                          <span className="text-[9px] text-gray-500">09/09</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* DETAIL PANEL (Right Content Editor) */}
              <div className="flex-1 bg-[#0a0a0a] border border-white/5 rounded-2xl flex flex-col overflow-hidden h-full relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/5 rounded-full blur-[80px] pointer-events-none"></div>
                
                {/* Editor Header */}
                <div className="p-8 border-b border-white/5 flex flex-col gap-4 relative z-10">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-2">
                      <span className="text-[10px] font-bold tracking-widest uppercase text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-md">Roteiro Pronto</span>
                      <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400 bg-white/5 px-2 py-1 rounded-md flex items-center gap-1"><PlayCircle className="w-3 h-3" /> TikTok UGC</span>
                    </div>
                    <button className="bg-cyan-500 hover:bg-cyan-600 text-black text-xs font-bold px-4 py-2 rounded-lg transition-colors shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                      Salvar Roteiro
                    </button>
                  </div>
                  <h2 className="text-4xl font-extrabold text-white tracking-tight mt-3 mb-1">Unboxing "Ferramenta X"</h2>
                  <p className="text-gray-400 text-base max-w-3xl leading-relaxed">Criador focado em marcenaria vai demonstrar o torque e bateria do equipamento recém lançado.</p>
                </div>

                {/* Editor Body (Notion-like) */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-8 relative z-10">
                  <div className="max-w-2xl space-y-8">
                    
                    {/* Block 1 */}
                    <div className="group">
                      <h4 className="flex items-center gap-2 text-pink-400 font-semibold mb-3">
                        <span className="bg-pink-500/20 p-1 rounded"><FileText className="w-4 h-4" /></span> 
                        1. O Gancho (Hook - 0 a 3 seg)
                      </h4>
                      <div className="pl-4 border-l-2 border-pink-500/30 hover:border-pink-500 text-gray-300 text-[15px] leading-relaxed outline-none transition-colors" contentEditable suppressContentEditableWarning>
                        <p className="italic text-gray-500 mb-2">// O criador recebe a caixa misteriosa. Ele abre com expressão de choque para a câmera.</p>
                        "Eu duvidei que essa ferramenta aguentaria o tranco da minha marcenaria, mas olha o que veio nessa caixa da [Nome da Marca]."
                      </div>
                    </div>

                    {/* Block 2 */}
                    <div className="group">
                      <h4 className="flex items-center gap-2 text-cyan-400 font-semibold mb-3">
                        <span className="bg-cyan-500/20 p-1 rounded"><PlayCircle className="w-4 h-4" /></span> 
                        2. Desenvolvimento (Provas e Features)
                      </h4>
                      <div className="pl-4 border-l-2 border-cyan-500/30 hover:border-cyan-500 text-gray-300 text-[15px] leading-relaxed outline-none transition-colors" contentEditable suppressContentEditableWarning>
                        <ul className="list-disc list-inside space-y-2">
                          <li><strong>Cena 1:</strong> Mostrar o torque furando uma madeira maciça (Angulo fechado na broca).</li>
                          <li><strong>Cena 2:</strong> Mostrar a bateria (Mencionar que dura 20h direto).</li>
                          <li><strong>Fala:</strong> "O torque disso aqui é absurdo. Ela atravessa peroba rosa como se fosse manteiga, e a bateria não me deixa na mão no meio do projeto."</li>
                        </ul>
                      </div>
                    </div>

                    {/* Block 3 */}
                    <div className="group">
                      <h4 className="flex items-center gap-2 text-emerald-400 font-semibold mb-3">
                        <span className="bg-emerald-500/20 p-1 rounded"><ShoppingBag className="w-4 h-4" /></span> 
                        3. Call to Action (CTA)
                      </h4>
                      <div className="pl-4 border-l-2 border-emerald-500/30 hover:border-emerald-500 text-gray-300 text-[15px] leading-relaxed outline-none transition-colors" contentEditable suppressContentEditableWarning>
                        <p className="italic text-gray-500 mb-2">// Apontar para baixo (link da bio/carrinho) segurando a ferramenta.</p>
                        "Se você é marceneiro ou faz DIY, isso aqui é investimento. Clica no link da minha bio que eu consegui um cupom de 15% de desconto lá na loja deles na Shopee!"
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-gray-500 text-xs mt-10 hover:text-white cursor-pointer transition-colors w-max">
                      <Plus className="w-4 h-4" /> Adicionar novo bloco de texto
                    </div>

                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: CRM */}
          {activeTab === "crm" && (
            <div className="flex-1 flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-2">
              <div className="bg-[#111] border border-[#222] rounded-lg overflow-hidden flex flex-col shrink-0">
              <div className="overflow-auto flex-1 custom-scrollbar">
                <table className="w-full text-left">
                  <thead className="bg-[#141414] sticky top-0 z-10">
                    <tr className="border-b border-[#222]">
                      <th className="px-4 py-2.5 text-[10px] uppercase font-semibold text-gray-400">Parceiro</th>
                      <th className="px-4 py-2.5 text-[10px] uppercase font-semibold text-gray-400">Nicho</th>
                      <th className="px-4 py-2.5 text-[10px] uppercase font-semibold text-gray-400">Status</th>
                      <th className="px-4 py-2.5 text-[10px] uppercase font-semibold text-gray-400">Base Fixa</th>
                      <th className="px-4 py-2.5 text-[10px] uppercase font-semibold text-gray-400">Upside (Comissão)</th>
                      <th className="px-4 py-2.5 text-[10px] uppercase font-semibold text-gray-400">Cupom / UTM</th>
                      <th className="px-4 py-2.5 text-[10px] uppercase font-semibold text-gray-400 text-right">ROI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#222]">
                    {CRM_PARTNERS.map(partner => (
                      <tr key={partner.id} className="hover:bg-[#161616]">
                        <td className="px-4 py-2 flex items-center gap-2">
                          <div className="relative">
                            <Avatar className="w-8 h-8 rounded border border-[#333]">
                              <AvatarImage src={partner.avatar} />
                              <AvatarFallback className="bg-[#222] text-[9px] text-white rounded">
                                {partner.name.substring(0,2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            {/* Tier Badge */}
                            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#111] flex items-center justify-center border border-[#222]">
                              <span className={`text-[8px] font-bold ${partner.tier === 'A' ? 'text-amber-400' : partner.tier === 'B' ? 'text-gray-300' : 'text-orange-600'}`}>{partner.tier}</span>
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-medium text-xs text-gray-200">{partner.name}</span>
                              {partner.whitelisted && <ShieldCheck className="w-3.5 h-3.5 text-blue-500" title="Whitelisting Ativo" />}
                            </div>
                            {/* Image Rights */}
                            <div className="flex items-center gap-1 mt-0.5">
                              <Clock className={`w-3 h-3 ${parseInt(partner.rightsExp) <= 15 ? 'text-red-500' : 'text-gray-500'}`} />
                              <span className={`text-[8px] ${parseInt(partner.rightsExp) <= 15 ? 'text-red-400' : 'text-gray-500'}`}>{partner.rightsExp} dias</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-2 text-xs text-gray-400">{partner.niche}</td>
                        <td className="px-4 py-2">
                          <span className={`inline-flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded border ${
                            partner.status === 'Postado' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                            partner.status === 'Aprovação Interna' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                            partner.status === 'Aguardando Roteiro' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                            partner.status === 'Refação' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                            'bg-gray-500/10 text-gray-400 border-gray-500/20'
                          }`}>
                            {partner.status}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-xs text-gray-300">{partner.base}</td>
                        <td className="px-4 py-2 text-xs text-emerald-400/80 font-medium">{partner.upside}</td>
                        <td className="px-4 py-2">
                          <span className="text-[10px] font-mono text-blue-400/80 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">{partner.tracking}</span>
                        </td>
                        <td className="px-4 py-2 text-right">
                          <div className={`text-xs font-semibold ${partner.roiColor}`}>{partner.roi}</div>
                          <div className="text-[9px] text-gray-500 mt-0.5">CPA: {partner.cpa}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
              {/* 3. Tabela de ROI de Influenciadores */}
              <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden flex flex-col">
                <div className="p-5 border-b border-white/5 flex justify-between items-center bg-[#0d0d0d]">
                  <div>
                    <h3 className="text-white text-sm font-semibold tracking-tight">Scorecard & ROI de Influenciadores</h3>
                    <p className="text-[10px] text-gray-500 mt-1">Análise de retorno financeiro por parceria ativa.</p>
                  </div>
                  <button className="bg-transparent border border-white/10 hover:border-white/20 text-gray-300 px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5">
                    <Download className="w-3.5 h-3.5" /> Exportar
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#111] border-b border-white/5">
                        <th className="py-3 px-5 text-[10px] font-medium tracking-widest text-gray-500 uppercase">Creator</th>
                        <th className="py-3 px-5 text-[10px] font-medium tracking-widest text-gray-500 uppercase">Custo (Cachê)</th>
                        <th className="py-3 px-5 text-[10px] font-medium tracking-widest text-gray-500 uppercase">Custo (Seeding)</th>
                        <th className="py-3 px-5 text-[10px] font-medium tracking-widest text-gray-500 uppercase">Receita (Cupom)</th>
                        <th className="py-3 px-5 text-[10px] font-medium tracking-widest text-gray-500 uppercase text-right">eCPA Final</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      <tr className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 px-5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 p-0.5">
                              <div className="w-full h-full bg-[#111] rounded-full border border-black overflow-hidden flex items-center justify-center">
                                <User className="w-4 h-4 text-white" />
                              </div>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-white">@mariasilva</p>
                              <p className="text-[9px] text-emerald-400 flex items-center gap-0.5 mt-0.5"><Target className="w-2.5 h-2.5" /> Alta Conversão</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-5 text-xs text-gray-300">R$ 2.000</td>
                        <td className="py-3 px-5 text-xs text-gray-300">R$ 150 <span className="text-[9px] text-gray-600">(1 Kit)</span></td>
                        <td className="py-3 px-5 text-xs font-bold text-white">R$ 12.500</td>
                        <td className="py-3 px-5 text-right">
                          <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md text-[10px] font-bold">R$ 8,50</span>
                        </td>
                      </tr>
                      <tr className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 px-5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-500 to-gray-700 p-0.5">
                              <div className="w-full h-full bg-[#111] rounded-full border border-black overflow-hidden flex items-center justify-center">
                                <User className="w-4 h-4 text-white" />
                              </div>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-white">@carlosfit</p>
                              <p className="text-[9px] text-yellow-500 flex items-center gap-0.5 mt-0.5"><AlertCircle className="w-2.5 h-2.5" /> Atenção</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-5 text-xs text-gray-300">R$ 0 <span className="text-[9px] text-gray-500">(Permuta)</span></td>
                        <td className="py-3 px-5 text-xs text-gray-300">R$ 450 <span className="text-[9px] text-gray-600">(3 Kits)</span></td>
                        <td className="py-3 px-5 text-xs font-bold text-white">R$ 800</td>
                        <td className="py-3 px-5 text-right">
                          <span className="px-2 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-md text-[10px] font-bold">R$ 45,00</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: OR�!AMENTO */}
          {activeTab === "orcamento" && (
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-6 mt-4">
            <div className="grid grid-cols-4 gap-3 shrink-0">
                              <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-3.5 flex flex-col justify-between relative overflow-hidden group hover:border-white/10 transition-colors cursor-pointer" onClick={handleEditBudget}>
                  <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="flex justify-between mb-1.5 items-center">
                    <span className="text-gray-500 text-[10px] font-medium tracking-widest uppercase">Orçamento ({getMonthName(marketingBudget.currentMonth)})</span>
                    <button className="bg-white/5 hover:bg-white/10 text-gray-400 px-2 py-0.5 rounded text-[9px] font-medium transition-colors border border-white/5 uppercase">Edit</button>
                  </div>
                  <div className="flex items-end justify-between mt-auto">
                    <span className="text-lg font-semibold text-white tracking-tight">R$ {marketingBudget.total.toLocaleString('pt-BR')}</span>
                    <span className="text-[10px] text-gray-400">{Math.round((marketingBudget.gasto/marketingBudget.total)*100 || 0)}% gasto</span>
                  </div>
                  <div className="w-full h-1 bg-[#1a1a1a] rounded-full mt-2 overflow-hidden relative">
                    <div className="h-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)] transition-all duration-500 relative z-10" style={{ width: `${Math.min((marketingBudget.gasto/marketingBudget.total)*100 || 0, 100)}%` }}></div>
                  </div>
                </div>

<div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-3.5 flex flex-col justify-between relative overflow-hidden group hover:border-white/10 transition-colors">
                  <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="flex justify-between mb-1.5 items-center">
                    <span className="text-gray-500 text-[10px] font-medium tracking-widest uppercase">Vendas do Site</span>
                    <button onClick={handleEditSales} className="bg-white/5 hover:bg-white/10 text-gray-400 px-2 py-0.5 rounded text-[9px] font-medium transition-colors border border-white/5 uppercase flex items-center gap-1">Lançar +</button>
                  </div>
                  <div className="flex items-center gap-2 mt-auto">
                    <span className="text-lg font-semibold text-white tracking-tight">R$ {(marketingBudget.vendas || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    <span className="flex items-center text-cyan-400 text-[10px] font-medium bg-cyan-500/10 px-1.5 py-0.5 rounded-full border border-cyan-500/20">
                      <ArrowUpRight className="w-2.5 h-2.5 mr-0.5" /> {marketingBudget.vendasGrowth || 0}%
                    </span>
                  </div>
                </div>

              <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-3.5 flex flex-col justify-between relative overflow-hidden group hover:border-white/10 transition-colors">
                <div className="flex justify-between mb-1.5">
                  <span className="text-gray-500 text-[10px] font-medium tracking-widest uppercase">CPA (Custo Acq.)</span>
                  <Activity className="w-3.5 h-3.5 text-gray-600" />
                </div>
                <div className="flex items-center gap-2 mt-auto">
                  <span className="text-lg font-semibold text-white tracking-tight">{currentKPI.cpa}</span>
                  <span className={`flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded-full border ${currentKPI.cpaTrend > 0 ? 'text-red-400 bg-red-400/10 border-red-400/20' : 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'}`}>
                    {currentKPI.cpaTrend > 0 ? <ArrowUpRight className="w-2.5 h-2.5 mr-0.5" /> : <ArrowDownRight className="w-2.5 h-2.5 mr-0.5" />}
                    {Math.abs(currentKPI.cpaTrend)}%
                  </span>
                </div>
              </div>

                                              <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-3.5 flex flex-col justify-between relative overflow-hidden group hover:border-white/10 transition-colors">
                  <div className="flex justify-between mb-1.5">
                    <span className="text-gray-500 text-[10px] font-medium tracking-widest uppercase">CPA (Custo Acq.)</span>
                    <Activity className="w-3.5 h-3.5 text-gray-600" />
                  </div>
                  <div className="flex items-center gap-2 mt-auto">
                    <span className="text-lg font-semibold text-white tracking-tight">{currentKPI?.cpa || "R$ 12,50"}</span>
                    <span className="flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded-full border text-emerald-400 bg-emerald-400/10 border-emerald-400/20">
                      <ArrowDownRight className="w-2.5 h-2.5 mr-0.5" /> 8%
                    </span>
                  </div>
                </div>

<div 
                  onClick={() => setIsScalingActive(!isScalingActive)}
                  className={`bg-[#0a0a0a] border ${isScalingActive ? 'border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.15)]' : 'border-white/5'} rounded-2xl p-3.5 flex flex-col justify-between relative overflow-hidden cursor-pointer transition-all duration-300 group`}
                >
                  <div className={`absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent ${isScalingActive ? 'via-cyan-500' : 'via-white/10'} to-transparent transition-colors`} ></div>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-1.5">
                      <div className={`p-1.5 rounded-lg ${isScalingActive ? 'bg-cyan-500/20' : 'bg-white/5'} transition-colors`}>
                        <Flame className={`w-4 h-4 ${isScalingActive ? 'text-cyan-400 drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]' : 'text-gray-500'} transition-all`} />
                      </div>
                      <span className={`text-xs font-bold uppercase tracking-widest ${isScalingActive ? 'text-cyan-400' : 'text-gray-400'}`}>Modo Scaling</span>
                    </div>
                    <div className={`w-8 h-4 rounded-full flex items-center px-0.5 transition-colors ${isScalingActive ? 'bg-cyan-500' : 'bg-[#222]'}`}>
                      <div className={`w-3 h-3 bg-white rounded-full transition-transform ${isScalingActive ? 'translate-x-4' : 'translate-x-0'}`}></div>
                    </div>
                  </div>
                  <div className="mt-auto">
                    {isScalingActive ? (
                      <div className="flex flex-col gap-1">
                        <span className="text-white text-xs font-semibold">Automação Ativa</span>
                        <p className="text-[9px] text-cyan-400/80 leading-tight">Injetando +20% de verba se o CPA &lt; R$ 15,00.</p>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-1">
                        <span className="text-gray-400 text-xs font-semibold">Pausado</span>
                        <p className="text-[9px] text-gray-600 leading-tight">Clique para ligar as regras de automação de campanhas.</p>
                      </div>
                    )}
                  </div>
                </div>

            </div>

              {/* Painéis Corporativos */}
            <div className="mt-6 flex flex-col gap-6 max-w-full pb-4">
              
              {/* Split Superior: Distribuição & Aprovações */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                
                {/* 1. Distribuição de Verba (Burn Rate & Split) */}
                
                  <div className="lg:col-span-7 bg-[#0a0a0a] border border-white/5 rounded-2xl p-5 flex flex-col relative overflow-hidden group">
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="flex items-center justify-between mb-6 relative z-10">
                      <div className="flex items-center gap-2">
                        <h3 className="text-white text-sm font-semibold tracking-tight">Divisão do Orçamento (Onde investimos)</h3>
                        <span className="bg-white/5 text-gray-400 px-2 py-0.5 rounded text-[9px] font-bold tracking-widest uppercase border border-white/5">Interativo</span>
                      </div>
                      <span className="text-xs text-gray-500 font-medium tracking-widest uppercase">{getMonthName(marketingBudget.currentMonth)}</span>
                    </div>
                    
                    <div className="space-y-6 mt-auto relative z-10">
                      <div>
                        <div className="flex justify-between text-xs mb-2">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]"></span>
                            <span className="text-gray-300 font-medium">Tráfego Pago (Meta/TikTok)</span>
                          </div>
                          <span className="text-white font-bold text-sm">{marketingBudget.budgetSplit?.trafego || 0}%</span>
                        </div>
                        <div className="relative w-full h-3 bg-[#1a1a1a] rounded-full overflow-hidden hover:bg-[#222] transition-colors cursor-ew-resize">
                          <div className="h-full bg-cyan-500 transition-all duration-75 pointer-events-none" style={{ width: `${marketingBudget.budgetSplit?.trafego || 0}%` }}></div>
                          <input 
                            type="range" min="0" max="100" 
                            value={marketingBudget.budgetSplit?.trafego || 0}
                            onChange={(e) => handleSplitChange('trafego', parseInt(e.target.value))}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize m-0 p-0"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-xs mb-2">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]"></span>
                            <span className="text-gray-300 font-medium">Cachê (Influenciadores)</span>
                          </div>
                          <span className="text-white font-bold text-sm">{marketingBudget.budgetSplit?.influenciadores || 0}%</span>
                        </div>
                        <div className="relative w-full h-3 bg-[#1a1a1a] rounded-full overflow-hidden hover:bg-[#222] transition-colors cursor-ew-resize">
                          <div className="h-full bg-purple-500 transition-all duration-75 pointer-events-none" style={{ width: `${marketingBudget.budgetSplit?.influenciadores || 0}%` }}></div>
                          <input 
                            type="range" min="0" max="100" 
                            value={marketingBudget.budgetSplit?.influenciadores || 0}
                            onChange={(e) => handleSplitChange('influenciadores', parseInt(e.target.value))}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize m-0 p-0"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-xs mb-2">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]"></span>
                            <span className="text-gray-300 font-medium">Envio de Produtos (Seeding)</span>
                          </div>
                          <span className="text-white font-bold text-sm">{marketingBudget.budgetSplit?.seeding || 0}%</span>
                        </div>
                        <div className="relative w-full h-3 bg-[#1a1a1a] rounded-full overflow-hidden hover:bg-[#222] transition-colors cursor-ew-resize">
                          <div className="h-full bg-orange-500 transition-all duration-75 pointer-events-none" style={{ width: `${marketingBudget.budgetSplit?.seeding || 0}%` }}></div>
                          <input 
                            type="range" min="0" max="100" 
                            value={marketingBudget.budgetSplit?.seeding || 0}
                            onChange={(e) => handleSplitChange('seeding', parseInt(e.target.value))}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize m-0 p-0"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* 2. Pipeline de Aprovações (Corporate Workflow) */}
                  <div className="lg:col-span-5 bg-[#0a0a0a] border border-white/5 rounded-2xl p-5 flex flex-col relative overflow-hidden group">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <h3 className="text-white text-sm font-semibold tracking-tight">Aprovações Pendentes</h3>
                        <button onClick={() => setIsCreateApprovalModalOpen(true)} className="bg-white/5 hover:bg-white/10 text-gray-400 px-2 py-0.5 rounded text-[9px] font-bold tracking-widest uppercase transition-colors border border-white/5 flex items-center gap-1">Criar +</button>
                      </div>
                      <div className="px-2 py-0.5 bg-yellow-500/10 border border-yellow-500/20 rounded-full flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-yellow-500" />
                        <span className="text-[10px] text-yellow-500 font-bold uppercase tracking-widest">{approvals.length} Ações</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3 mt-auto max-h-[180px] overflow-y-auto custom-scrollbar pr-1">
                      {approvals.length === 0 ? (
                        <div className="text-center py-8">
                          <CheckCircle2 className="w-8 h-8 text-emerald-500/50 mx-auto mb-2" />
                          <p className="text-gray-500 text-xs">Tudo aprovado! Nenhuma pendência.</p>
                        </div>
                      ) : approvals.map(app => (
                        <div key={app.id} className="bg-[#111] border border-white/5 rounded-xl p-3 flex flex-col gap-2 hover:border-white/10 transition-colors cursor-pointer" onClick={() => setApprovalDetails(app)}>
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-white text-xs font-bold">{app.title}</h4>
                              <span className="text-[10px] text-gray-500">{app.campaign}</span>
                            </div>
                            <span className="text-cyan-400 font-bold text-xs bg-cyan-400/10 px-1.5 py-0.5 rounded">R$ {app.amount.toLocaleString('pt-BR')}</span>
                          </div>
                          <div className="flex justify-between items-center mt-1 border-t border-white/5 pt-2">
                            <span className="text-[9px] text-gray-600 uppercase tracking-widest font-bold">Ver Detalhes</span>
                            <div className="flex gap-2">
                              <button onClick={(e) => { e.stopPropagation(); handleReject(app.id); }} className="text-[9px] font-bold px-2 py-1 bg-white/5 hover:bg-red-500/20 hover:text-red-400 rounded uppercase text-gray-400 transition-colors">Rejeitar</button>
                              <button onClick={(e) => { e.stopPropagation(); handleApprove(app.id, app.amount); }} className="text-[9px] font-bold px-2 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded uppercase hover:bg-cyan-500 hover:text-white transition-colors">Aprovar</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

              </div>

            </div>
          </div>
        )}
      </div>

      </div>

      

      {/* Modals para Aprovações */}
      {isCreateApprovalModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCreateApprovalModalOpen(false)}></div>
          <div className="bg-[#111] border border-[#222] rounded-2xl p-6 relative z-10 w-full max-w-md shadow-2xl flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-white font-semibold">Nova Solicitação</h3>
              <button onClick={() => setIsCreateApprovalModalOpen(false)} className="text-gray-500 hover:text-white">x</button>
            </div>
            
            <div className="space-y-4 mt-2">
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Título da Despesa</label>
                <input type="text" value={approvalForm.title} onChange={e => setApprovalForm({...approvalForm, title: e.target.value})} placeholder="Ex: Cachê Virgínia" className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-cyan-500 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Campanha/Setor</label>
                  <input type="text" value={approvalForm.campaign} onChange={e => setApprovalForm({...approvalForm, campaign: e.target.value})} placeholder="Ex: Black Friday" className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-cyan-500 outline-none" />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Valor Solicitado (R$)</label>
                  <input type="number" value={approvalForm.amount} onChange={e => setApprovalForm({...approvalForm, amount: parseInt(e.target.value) || 0})} className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-cyan-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Justificativa / Detalhes</label>
                <textarea value={approvalForm.description} onChange={e => setApprovalForm({...approvalForm, description: e.target.value})} rows="3" placeholder="Explique o motivo do orçamento extra..." className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-cyan-500 outline-none resize-none"></textarea>
              </div>
            </div>

            <button onClick={handleCreateApproval} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm py-2.5 rounded-lg mt-2 transition-colors">
              Criar Solicitação
            </button>
          </div>
        </div>
      )}

      {approvalDetails && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setApprovalDetails(null)}></div>
          <div className="bg-[#111] border border-white/10 rounded-2xl p-6 relative z-10 w-full max-w-sm shadow-2xl flex flex-col gap-4">
            <div className="flex justify-between items-start border-b border-white/10 pb-4 mb-2">
              <div>
                <h3 className="text-white font-bold text-lg leading-tight">{approvalDetails.title}</h3>
                <span className="text-cyan-400 text-xs font-semibold uppercase tracking-widest">{approvalDetails.campaign}</span>
              </div>
              <button onClick={() => setApprovalDetails(null)} className="text-gray-500 hover:text-white p-1">x</button>
            </div>
            
            <div className="bg-black/50 p-4 rounded-xl border border-white/5 mb-2">
              <span className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Justificativa</span>
              <p className="text-gray-300 text-sm leading-relaxed">{approvalDetails.description || 'Nenhum detalhe adicional fornecido.'}</p>
            </div>

            <div className="flex items-center justify-between bg-cyan-500/10 border border-cyan-500/20 p-4 rounded-xl">
              <span className="text-xs uppercase font-bold text-cyan-500">Valor Solicitado</span>
              <span className="text-xl font-bold text-white">R$ {approvalDetails.amount.toLocaleString('pt-BR')}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4">
              <button onClick={() => handleReject(approvalDetails.id)} className="w-full bg-transparent border border-white/10 hover:bg-red-500/20 hover:border-red-500/30 text-white hover:text-red-400 font-bold text-sm py-3 rounded-xl transition-colors">
                Rejeitar
              </button>
              <button onClick={() => handleApprove(approvalDetails.id, approvalDetails.amount)} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm py-3 rounded-xl transition-colors">
                Aprovar & Lançar
              </button>
            </div>
            <p className="text-[10px] text-center text-gray-500 mt-2">
              Ao aprovar, o valor de R$ {approvalDetails.amount.toLocaleString('pt-BR')} será adicionado automaticamente ao "Gasto" do seu Orçamento atual.
            </p>
          </div>
        </div>
      )}

      {/* OVERLAY: BRAND VAULT */}
      {isBrandVaultOpen && (
        <div className="fixed inset-0 z-50 flex justify-end" onClick={() => setIsBrandVaultOpen(false)}>
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="w-full md:w-[60vw] max-w-[800px] h-full bg-[#0A0A0A] border-l border-[#222] shadow-2xl flex flex-col relative z-10" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-[#222] flex justify-between bg-[#111] shrink-0">
              <h2 className="text-sm font-semibold text-white">Brand Vault</h2>
              <button onClick={() => setIsBrandVaultOpen(false)} className="p-1 hover:bg-[#222] rounded text-gray-400">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 grid grid-cols-3 gap-6">
              <div className="col-span-1 space-y-6">
                <div>
                  <h3 className="text-xs font-semibold text-white mb-2">Cores</h3>
                  <div className="space-y-2">
                    {BrandPalette.map(color => (
                      <div key={color.name} className="flex items-center p-2 rounded-lg border border-[#222] bg-[#111]">
                        <div className={`w-5 h-5 rounded border border-white/10 mr-2 ${color.class}`}></div>
                        <div>
                          <p className="text-[10px] font-medium text-gray-200">{color.name}</p>
                          <p className="text-[9px] text-gray-500">{color.hex}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-white mb-2">Tipografia</h3>
                  <div className="bg-[#111] border border-[#222] rounded-lg p-3">
                    <div className="text-3xl font-bold text-white mb-2">Aa</div>
                    <h4 className="text-xs font-medium text-white mb-1">Inter</h4>
                    <p className="text-[9px] text-gray-400 mb-2">A B C D E F G H I J K L M N O P Q R S T U V W X Y Z</p>
                    <div className="flex gap-1">
                      <span className="px-1.5 py-0.5 bg-[#222] rounded text-[8px] text-gray-300">Rg</span>
                      <span className="px-1.5 py-0.5 bg-[#222] rounded text-[8px] text-gray-300">Md</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-2">
                <h3 className="text-xs font-semibold text-white mb-3">Arquivos</h3>
                <div className="grid grid-cols-2 gap-3">
                  {ASSETS.map(asset => (
                    <div key={asset.id} className="bg-[#111] border border-[#222] rounded-lg p-3 flex flex-col cursor-pointer hover:border-[#444]">
                      <div className="flex justify-between mb-2">
                        {asset.type === 'Logo' && <ImageIcon className="w-4 h-4 text-gray-400" />}
                        {asset.type === 'Banner' && <LayoutGrid className="w-4 h-4 text-gray-400" />}
                        {asset.type === 'Vídeo' && <FileVideo className="w-4 h-4 text-gray-400" />}
                        <Download className="w-3.5 h-3.5 text-gray-500" />
                      </div>
                      <div className="mt-auto">
                        <p className="text-xs font-medium text-gray-200 truncate">{asset.name}</p>
                        <p className="text-[9px] text-gray-500 mt-0.5">{asset.type} ⬢ {asset.size}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    

      {isSalesModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsSalesModalOpen(false)}></div>
          <div className="bg-[#111] border border-[#222] rounded-2xl p-6 relative z-10 w-full max-w-sm shadow-2xl flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-cyan-400" />
                Vendas do Site
              </h3>
              <button onClick={() => setIsSalesModalOpen(false)} className="text-gray-500 hover:text-white">x</button>
            </div>
            
            <div className="space-y-4 mt-2">
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Total em Vendas (R$)</label>
                <input type="number" value={salesForm.vendas} onChange={e => setSalesForm({...salesForm, vendas: parseFloat(e.target.value) || 0})} className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-cyan-500 outline-none" />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Crescimento (%)</label>
                <input type="number" value={salesForm.vendasGrowth} onChange={e => setSalesForm({...salesForm, vendasGrowth: parseFloat(e.target.value) || 0})} className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-cyan-500 outline-none" />
              </div>
            </div>

            <button onClick={handleSaveSales} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm py-2.5 rounded-lg mt-2 transition-colors">
              Salvar Vendas
            </button>
          </div>
        </div>
      )}

</div>
  );
}