import React, { useState } from "react";
import {
  TrendingUp,
  Target,
  BarChart3,
  DollarSign,
  Megaphone,
  Palette,
  Image as ImageIcon,
  Type,
  LayoutGrid,
  Plus,
  Activity,
  Flame,
  Clock,
  ArrowRight,
  AlertTriangle,
  Users,
  LineChart,
  X
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Cores premium para Marketing (Magenta vibrante e verde neon)
const BrandPalette = [
  { name: "Neon Green", hex: "#00FF00", class: "bg-[#00FF00]" },
  { name: "Dark Surface", hex: "#111111", class: "bg-[#111111]" },
  { name: "Deep Charcoal", hex: "#1C1C1E", class: "bg-[#1C1C1E]" },
  { name: "Magenta Burst", hex: "#FF00FF", class: "bg-[#FF00FF]" },
  { name: "Accent Blue", hex: "#00E5FF", class: "bg-[#00E5FF]" }
];

const KANBAN_COLUMNS = [
  { id: "backlog", title: "Backlog / Ideias", color: "text-gray-400 border-gray-400" },
  { id: "producao", title: "Em Produção", color: "text-yellow-400 border-yellow-400" },
  { id: "rodando", title: "Rodando (Ads)", color: "text-[#00FF00] border-[#00FF00]" },
  { id: "analise", title: "Análise", color: "text-purple-400 border-purple-400" }
];

const INITIAL_TASKS = [
  { id: 1, title: "Campanha Dia dos Pais", column: "backlog", tags: ["Sazonal", "Instagram"], priority: "Alta" },
  { id: 2, title: "Re-design de Banners ML", column: "producao", tags: ["Branding", "Marketplace"], priority: "Urgente" },
  { id: 3, title: "Tráfego Frio - Inverno", column: "rodando", tags: ["Meta Ads", "Conversão"], priority: "Alta", metric: "ROAS 3.2x" },
  { id: 4, title: "Ajuste Bio", column: "analise", tags: ["Branding", "Social"], priority: "Baixa" },
  { id: 5, title: "Cortes (Reels)", column: "producao", tags: ["Vídeo", "Orgânico"], priority: "Normal" }
];

const PARTNERS = [
  { id: 1, name: "@tech_influencer", status: "Entregue", cupom: 142, roi: "R$ 4.250" },
  { id: 2, name: "Maria Clara", status: "A Caminho", cupom: 0, roi: "R$ 0" },
  { id: 3, name: "Lucas Dev", status: "Entregue", cupom: 89, roi: "R$ 2.100" },
  { id: 4, name: "Revenda Sul", status: "Preparando", cupom: 0, roi: "R$ 0" },
  { id: 5, name: "@design_br", status: "Entregue", cupom: 34, roi: "R$ 950" }
];

export default function Marketing() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [activeTab, setActiveTab] = useState<"kanban" | "performance">("kanban");
  const [isBrandVaultOpen, setIsBrandVaultOpen] = useState(false);

  return (
    <div className="flex flex-col h-full bg-[#050505] animate-in fade-in duration-700 pb-20 md:pb-0 overflow-x-hidden overflow-y-auto custom-scrollbar relative">
      {/* Decorações Visuais de Marketing */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#FF00FF] rounded-full blur-[150px] opacity-10 pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-[#00E5FF] rounded-full blur-[150px] opacity-[0.07] pointer-events-none" />

      <div className="p-6 md:p-10 max-w-[1600px] w-full mx-auto relative z-10 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#FF00FF] to-[#00E5FF] text-white shadow-lg">
                <Megaphone className="w-5 h-5" />
              </div>
              <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 tracking-tight">
                Marketing & Growth
              </h1>
            </div>
            <p className="text-gray-400 font-medium text-sm">Central tática de expansão de marca, gestão de Ads e design.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex -space-x-3 mr-2 hidden sm:flex">
              <Avatar className="border-2 border-[#050505] w-9 h-9">
                <AvatarFallback className="bg-purple-500 text-[10px] font-bold text-white">AN</AvatarFallback>
              </Avatar>
              <Avatar className="border-2 border-[#050505] w-9 h-9">
                <AvatarFallback className="bg-green-500 text-[10px] font-bold text-white">WM</AvatarFallback>
              </Avatar>
            </div>
            <button 
              onClick={() => setIsBrandVaultOpen(true)}
              className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2"
            >
              <Palette className="w-4 h-4 text-gray-400" /> Cofre
            </button>
            <button className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2">
              <BarChart3 className="w-4 h-4" /> Relatórios
            </button>
            <button className="bg-[#00FF00] hover:bg-[#00CC00] text-black px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-[0_0_15px_rgba(0,255,0,0.3)] flex items-center gap-2">
              <Plus className="w-4 h-4" /> Campanha
            </button>
          </div>
        </div>

        {/* Sec 1: Ad Budget Tracker (Always visible) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#121212] border border-white/5 rounded-3xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <DollarSign className="w-20 h-20 text-[#00FF00]" />
            </div>
            <h3 className="text-gray-400 font-semibold text-sm mb-1 uppercase tracking-widest">Orçamento Mensal</h3>
            <div className="flex items-end gap-2 mb-4">
              <span className="text-3xl font-black text-white">R$ 5.000</span>
              <span className="text-gray-500 text-sm mb-1">,00</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-1.5 mb-2">
              <div className="bg-[#00FF00] h-1.5 rounded-full" style={{ width: '65%' }}></div>
            </div>
            <div className="flex justify-between text-xs font-bold text-gray-500">
              <span>Gasto: R$ 3.250,00</span>
              <span>65%</span>
            </div>
          </div>

          <div className="bg-[#121212] border border-white/5 rounded-3xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <Target className="w-20 h-20 text-[#00E5FF]" />
            </div>
            <h3 className="text-gray-400 font-semibold text-sm mb-1 uppercase tracking-widest">ROAS Global</h3>
            <div className="flex items-end gap-2 mb-1">
              <span className="text-3xl font-black text-white">3.8x</span>
            </div>
            <div className="inline-flex items-center gap-1 text-[11px] font-bold text-[#00FF00] bg-[#00FF00]/10 px-2 py-0.5 rounded-full mt-2">
              <TrendingUp className="w-3 h-3" /> +0.4x vs Mês Anterior
            </div>
          </div>

          <div className="bg-[#121212] border border-white/5 rounded-3xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <Activity className="w-20 h-20 text-[#FF00FF]" />
            </div>
            <h3 className="text-gray-400 font-semibold text-sm mb-1 uppercase tracking-widest">Conversões (Ads)</h3>
            <div className="flex items-end gap-2 mb-1">
              <span className="text-3xl font-black text-white">241</span>
              <span className="text-gray-500 text-sm mb-1">vendas</span>
            </div>
            <p className="text-xs font-bold text-gray-500 mt-3">Custo por Aquisição: <span className="text-white">R$ 13,48</span></p>
          </div>

          <div className="bg-gradient-to-br from-[#1A1A1A] to-[#111111] border border-[#FF00FF]/20 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-center items-center text-center cursor-pointer hover:border-[#FF00FF]/50 transition-colors">
            <Flame className="w-8 h-8 text-[#FF00FF] mb-3 animate-pulse" />
            <h3 className="text-white font-bold mb-1">Boost de Campanha</h3>
            <p className="text-xs text-gray-400">Distribuir verba para a campanha campeã.</p>
          </div>
        </div>

        {/* Tabs Control */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-4">
          <button 
            onClick={() => setActiveTab("kanban")}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === "kanban" 
                ? "bg-white/10 text-white shadow-sm" 
                : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
            }`}
          >
            <LayoutGrid className="w-4 h-4" /> Gestão Tática (Kanban)
          </button>
          <button 
            onClick={() => setActiveTab("performance")}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === "performance" 
                ? "bg-[#00FF00]/10 text-[#00FF00] border border-[#00FF00]/20" 
                : "text-gray-500 hover:text-[#00FF00] hover:bg-white/5"
            }`}
          >
            <LineChart className="w-4 h-4" /> Performance & Financeiro
          </button>
        </div>

        {/* Tab Content */}
        <div>
          {/* TAB: KANBAN */}
          {activeTab === "kanban" && (
            <div className="flex gap-4 overflow-x-auto pb-6 custom-scrollbar animate-in fade-in slide-in-from-bottom-2 duration-300">
              {KANBAN_COLUMNS.map(col => (
                <div key={col.id} className="flex-1 min-w-[280px] flex flex-col">
                  <div className={`border-b-2 ${col.color} pb-3 mb-4 flex items-center justify-between`}>
                    <h3 className="font-bold text-white tracking-tight uppercase text-xs">{col.title}</h3>
                    <span className="text-[10px] bg-white/10 text-gray-400 font-bold px-2 py-0.5 rounded-full">
                      {tasks.filter(t => t.column === col.id).length}
                    </span>
                  </div>
                  
                  <div className="flex-1 bg-white/[0.02] border border-white/5 rounded-2xl p-2.5 flex flex-col gap-3 min-h-[400px]">
                    {tasks.filter(t => t.column === col.id).map(task => (
                      <div key={task.id} className="bg-[#121212] border border-white/5 hover:border-white/20 transition-colors rounded-xl p-4 shadow-sm cursor-pointer group relative overflow-hidden">
                        {task.metric && (
                          <div className="absolute top-0 right-0 bg-[#00FF00]/20 text-[#00FF00] text-[9px] font-black px-2 py-0.5 rounded-bl-lg">
                            {task.metric}
                          </div>
                        )}
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {task.tags.map(tag => (
                            <span key={tag} className="text-[9px] uppercase tracking-wider font-bold bg-white/10 text-gray-300 px-2 py-0.5 rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <h4 className="text-sm font-bold text-gray-100 mb-3 pr-4 group-hover:text-white">{task.title}</h4>
                        <div className="flex items-center justify-between mt-auto">
                          <span className={`text-[10px] font-bold flex items-center gap-1 ${
                            task.priority === 'Urgente' ? 'text-[#FF00FF]' : 
                            task.priority === 'Alta' ? 'text-[#00E5FF]' : 
                            'text-gray-500'
                          }`}>
                            <Clock className="w-3 h-3" /> {task.priority}
                          </span>
                          <Avatar className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity">
                            <AvatarFallback className="bg-gray-800 text-[8px] font-bold text-white">WM</AvatarFallback>
                          </Avatar>
                        </div>
                      </div>
                    ))}
                    
                    <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-white/10 text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-colors text-xs font-bold uppercase tracking-widest mt-1">
                      <Plus className="w-3.5 h-3.5" /> Adicionar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB: PERFORMANCE */}
          {activeTab === "performance" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {/* Controle de Verba vs Tráfego (2/3 width) */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-[#121212] border border-white/5 rounded-3xl p-6 relative overflow-hidden h-[450px] flex flex-col shadow-xl">
                  {/* Alerta de CPC */}
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center justify-between mb-6 shrink-0 shadow-lg relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/5 to-red-500/0 animate-shimmer pointer-events-none"></div>
                    <div className="flex items-center gap-3 relative z-10">
                      <div className="p-2 bg-red-500/20 rounded-full animate-pulse">
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                      </div>
                      <div>
                        <h4 className="text-red-500 font-bold text-sm">Alerta Crítico: Custo por Clique Elevado</h4>
                        <p className="text-red-400/80 text-xs mt-0.5">A campanha "Inverno Frio" subiu para R$ 2,85 (Acima do teto ideal de R$ 2,50).</p>
                      </div>
                    </div>
                    <button className="bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-[0_0_15px_rgba(239,68,68,0.4)] relative z-10">
                      Pausar Campanha
                    </button>
                  </div>

                  {/* Chart Mock */}
                  <div className="flex-1 flex items-end justify-between gap-2 mt-2 px-2 overflow-hidden">
                    {[...Array(15)].map((_, i) => {
                      const isHigh = i === 13 || i === 14;
                      const heightSpend = isHigh ? 85 + Math.random() * 10 : 30 + Math.random() * 30;
                      const heightTraffic = isHigh ? 40 + Math.random() * 10 : 40 + Math.random() * 40;
                      
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center justify-end h-full gap-2 group relative">
                          {isHigh && (
                            <div className="absolute top-0 text-[9px] font-bold text-red-500 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 px-2 py-1 rounded-md z-10">
                              Custo Elevado
                            </div>
                          )}
                          <div className="w-full flex justify-center items-end gap-1 px-1 h-full">
                            <div className={`w-1/2 rounded-t-sm transition-all duration-500 ${isHigh ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-[#FF00FF]/80 hover:bg-[#FF00FF]'}`} style={{ height: `${heightSpend}%` }}></div>
                            <div className="w-1/2 bg-[#00FF00]/80 hover:bg-[#00FF00] rounded-t-sm transition-all duration-500" style={{ height: `${heightTraffic}%` }}></div>
                          </div>
                          <span className="text-[9px] text-gray-600 font-bold">{i+1}/08</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Legend */}
                  <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-white/5 shrink-0">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#FF00FF]"></div>
                      <span className="text-xs text-gray-400 font-bold">Gasto com Ads (R$)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#00FF00]"></div>
                      <span className="text-xs text-gray-400 font-bold">Visitas no Site</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)] animate-pulse"></div>
                      <span className="text-xs text-gray-400 font-bold">Alerta de Custo</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Parcerias (1/3 width) */}
              <div className="space-y-4 lg:col-span-1">
                <div className="bg-[#121212] border border-white/5 rounded-3xl p-5 overflow-hidden flex flex-col h-[450px] shadow-xl">
                  <div className="flex items-center justify-between mb-4 shrink-0">
                    <h3 className="text-[11px] uppercase tracking-widest font-bold text-gray-300 flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#00E5FF]" /> Top Afiliados
                    </h3>
                    <button className="text-[#00FF00] hover:text-[#00CC00] transition-colors bg-[#00FF00]/10 p-1.5 rounded-lg">
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 -mr-1 space-y-3">
                    {PARTNERS.map(partner => (
                      <div key={partner.id} className="bg-white/[0.02] border border-white/5 rounded-xl p-3 hover:border-white/20 hover:bg-white/[0.04] transition-all group">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-bold text-white">{partner.name}</span>
                          <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            partner.status === 'Entregue' ? 'bg-[#00FF00]/10 text-[#00FF00]' :
                            'bg-yellow-500/10 text-yellow-500'
                          }`}>
                            {partner.status}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-white/5">
                          <div>
                            <p className="text-[9px] uppercase tracking-widest text-gray-500 font-bold mb-0.5">Cupons</p>
                            <p className="text-xs font-mono text-gray-300">{partner.cupom}</p>
                          </div>
                          <div>
                            <p className="text-[9px] uppercase tracking-widest text-gray-500 font-bold mb-0.5">Retorno (ROI)</p>
                            <p className={`text-xs font-mono font-bold ${partner.roi !== 'R$ 0' ? 'text-[#00FF00]' : 'text-gray-500'}`}>
                              {partner.roi}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <button className="w-full mt-4 py-2.5 rounded-xl border border-dashed border-white/10 text-gray-500 hover:text-gray-300 hover:bg-white/5 hover:border-white/20 transition-all text-xs font-bold uppercase tracking-widest shrink-0">
                    Ver Todos os Parceiros
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Slide-over Brand Vault */}
      {isBrandVaultOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setIsBrandVaultOpen(false)}>
          <div 
            className="w-full max-w-[400px] h-full bg-[#111111] border-l border-white/10 p-6 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-8 shrink-0">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Palette className="w-5 h-5 text-gray-400" /> Cofre da Marca
              </h2>
              <button 
                onClick={() => setIsBrandVaultOpen(false)}
                className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6 overflow-y-auto custom-scrollbar pr-2 flex-1">
              {/* Colors */}
              <div className="bg-black/30 border border-white/5 rounded-3xl p-5">
                <h3 className="text-[11px] uppercase tracking-widest font-bold text-gray-500 mb-4">
                  Paleta Oficial
                </h3>
                <div className="space-y-3">
                  {BrandPalette.map(color => (
                    <div key={color.name} className="flex items-center gap-3 group cursor-pointer">
                      <div className={`w-8 h-8 rounded-lg ${color.class} shadow-sm border border-white/10`}></div>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-gray-200 group-hover:text-white transition-colors">{color.name}</p>
                        <p className="text-[10px] font-mono text-gray-500">{color.hex}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Typography */}
              <div className="bg-black/30 border border-white/5 rounded-3xl p-5">
                <h3 className="text-[11px] uppercase tracking-widest font-bold text-gray-500 mb-3 flex items-center gap-2">
                  <Type className="w-3.5 h-3.5" /> Tipografia
                </h3>
                <div className="bg-white/5 rounded-xl p-3">
                  <p className="text-sm font-black text-white font-sans">Inter / Roboto</p>
                  <p className="text-xs text-gray-400 mt-1">Fontes primárias para web e criativos.</p>
                </div>
              </div>

              {/* Assets */}
              <div className="bg-black/30 border border-white/5 rounded-3xl p-5">
                <h3 className="text-[11px] uppercase tracking-widest font-bold text-gray-500 mb-3 flex items-center gap-2">
                  <ImageIcon className="w-3.5 h-3.5" /> Logos & Mídia
                </h3>
                <div className="space-y-2">
                  <button className="w-full flex items-center justify-between bg-white/5 hover:bg-white/10 p-3 rounded-xl transition-colors group">
                    <span className="text-xs font-bold text-gray-300 group-hover:text-white">Logos em Alta Res.</span>
                    <ArrowRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-[#00FF00] transition-colors" />
                  </button>
                  <button className="w-full flex items-center justify-between bg-white/5 hover:bg-white/10 p-3 rounded-xl transition-colors group">
                    <span className="text-xs font-bold text-gray-300 group-hover:text-white">Templates Redes Sociais</span>
                    <ArrowRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-[#00FF00] transition-colors" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
