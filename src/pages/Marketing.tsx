import React, { useState } from "react";
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
  const [activeTab, setActiveTab] = useState<"orcamento" | "cockpit" | "roadmap" | "crm" | "performance">("cockpit");
  const [viewScope, setViewScope] = useState<"global" | "marca_propria">("global");
  const [isBrandVaultOpen, setIsBrandVaultOpen] = useState(false);
  const [zoom, setZoom] = useState<"semana" | "mes" | "trimestre">("mes");
  const zoomDays = zoom === "semana" ? 7 : zoom === "mes" ? 30 : 90;

  // Dados mockados para os KPIs de acordo com o escopo
  const kpiData = {
    global: { orcamento: "R$ 5.000", roas: "3.8x", cpa: "R$ 13,48", percentGasto: 65, roasTrend: 12, cpaTrend: 2 },
    marca_propria: { orcamento: "R$ 2.000", roas: "5.2x", cpa: "R$ 8,15", percentGasto: 40, roasTrend: 25, cpaTrend: -10 }
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
          <div className="flex items-center gap-3">
            {/* Chave Seletora Cockpit Executivo */}
            <div className="flex bg-[#0a0a0a] border border-white/5 p-1 rounded-full items-center mr-2">
              <button 
                onClick={() => setViewScope("global")}
                className={`px-3 py-1 text-[10px] font-bold tracking-wider uppercase rounded-full transition-all ${viewScope === "global" ? "bg-white/10 text-white shadow-sm" : "text-gray-500 hover:text-gray-300"}`}
              >
                Global
              </button>
              <button 
                onClick={() => setViewScope("marca_propria")}
                className={`px-3 py-1 text-[10px] font-bold tracking-wider uppercase rounded-full transition-all ${viewScope === "marca_propria" ? "bg-cyan-500/20 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.2)]" : "text-gray-500 hover:text-gray-300"}`}
              >
                Marca Própria
              </button>
            </div>

            <button 
              onClick={() => setIsBrandVaultOpen(true)}
              className="bg-[#111] hover:bg-[#1a1a1a] border border-white/5 text-gray-300 px-4 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Palette className="w-3.5 h-3.5 text-gray-400" />
              Brand Vault
            </button>
            <button className="bg-transparent border border-cyan-500/40 hover:bg-cyan-500/10 text-cyan-400 px-4 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.15)] hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]">
              <Plus className="w-3.5 h-3.5" />
              Campanha
            </button>
          </div>
        </div>

        {/* Tabs de Navegação Estilo Pill */}
        <div className="flex items-center gap-2 mt-2 shrink-0 overflow-x-auto no-scrollbar">
          {[
            { id: "cockpit", label: "Cockpit Executivo" },
            { id: "orcamento", label: "Orçamento e Investimentos" },
            { id: "roadmap", label: "Creative Studio (Roteiros)" },
            { id: "crm", label: "CRM Influenciadores" },
            { id: "performance", label: "Performance Ads" },
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
                
                {/* Radar Logístico (Esquerda, 4 colunas) */}
                <div className="col-span-12 lg:col-span-4 bg-[#0a0a0a] border border-white/5 rounded-2xl p-4 flex flex-col relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-[40px] pointer-events-none"></div>
                  <div className="flex items-center justify-between mb-4 relative z-10">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-cyan-500/10 rounded-lg">
                        <Truck className="w-4 h-4 text-cyan-400" />
                      </div>
                      <h3 className="text-white text-sm font-semibold tracking-tight">Radar Logístico</h3>
                    </div>
                    <span className="flex items-center gap-1 text-[10px] font-medium text-gray-500 uppercase tracking-widest bg-white/5 px-2 py-1 rounded-full">
                      <MapPin className="w-3 h-3 text-cyan-500" /> ABC Paulista
                    </span>
                  </div>

                  <div className="space-y-4 relative z-10 mt-2">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-400">Same-Day (Hoje)</span>
                        <span className="text-white font-medium">142 envios</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                        <div className="h-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-400">Next-Day (Amanhã)</span>
                        <span className="text-white font-medium">48 envios</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500/50" style={{ width: '25%' }}></div>
                      </div>
                    </div>
                  </div>

                  {/* Visualização de Mapa (Heatmap ABC/SP) */}
                  <div className="mt-4 mb-2 relative h-32 bg-[#111111] border border-white/5 rounded-xl overflow-hidden group">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
                    
                    {/* Pontos no Mapa */}
                    <div className="absolute top-1/3 left-1/4 group-hover:scale-110 transition-transform">
                      <div className="relative">
                        <span className="animate-ping absolute -inset-1 rounded-full bg-cyan-400 opacity-20"></span>
                        <div className="w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]"></div>
                        <span className="absolute top-3 left-1/2 -translate-x-1/2 text-[8px] text-cyan-400/80 font-bold tracking-widest uppercase">SP</span>
                      </div>
                    </div>
                    
                    <div className="absolute top-1/2 right-1/3 group-hover:scale-110 transition-transform delay-75">
                      <div className="relative">
                        <span className="animate-ping absolute -inset-2 rounded-full bg-cyan-500 opacity-30" style={{ animationDuration: '3s' }}></span>
                        <div className="w-3 h-3 bg-cyan-500 rounded-full shadow-[0_0_12px_rgba(6,182,212,1)]"></div>
                        <span className="absolute top-4 left-1/2 -translate-x-1/2 text-[8px] text-cyan-400/80 font-bold tracking-widest uppercase">SBC</span>
                      </div>
                    </div>

                    <div className="absolute bottom-1/4 right-1/4 group-hover:scale-110 transition-transform delay-150">
                      <div className="relative">
                        <span className="animate-ping absolute -inset-1 rounded-full bg-blue-400 opacity-20" style={{ animationDuration: '2.5s' }}></span>
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                        <span className="absolute top-2.5 left-1/2 -translate-x-1/2 text-[7px] text-blue-400/60 uppercase">SA</span>
                      </div>
                    </div>
                    
                    <div className="absolute top-1/4 right-1/4 group-hover:scale-110 transition-transform delay-150">
                      <div className="relative">
                        <span className="animate-ping absolute -inset-1 rounded-full bg-blue-400 opacity-20" style={{ animationDuration: '2s' }}></span>
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                        <span className="absolute top-2.5 left-1/2 -translate-x-1/2 text-[7px] text-blue-400/60 uppercase">SCS</span>
                      </div>
                    </div>

                  </div>

                  {/* Indicador de Risco / Custo */}
                  <div className="mt-auto pt-2">
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl relative overflow-hidden flex flex-col">
                      <div className="absolute top-0 right-0 p-1">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </span>
                      </div>
                      <span className="text-red-400 text-[10px] font-bold uppercase tracking-widest mb-1">Custo Médio Frete (Mauá)</span>
                      <div className="flex items-end justify-between">
                        <span className="text-white text-xl font-bold tracking-tight">R$ 18,50<span className="text-xs text-gray-400 font-normal ml-1">/pedido</span></span>
                        <span className="text-red-400 text-xs font-medium flex items-center">
                          <ArrowUpRight className="w-3 h-3 mr-0.5" /> Acima da meta
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Termômetro de Aquisição (Centro-Direita, 8 colunas) */}
                <div className="col-span-12 lg:col-span-8 flex flex-col gap-4">
                  <div className="flex-1 bg-[#0a0a0a] border border-white/5 rounded-2xl p-4 relative overflow-hidden flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-cyan-500/10 rounded-lg">
                          <BarChart3 className="w-4 h-4 text-cyan-400" />
                        </div>
                        <h3 className="text-white text-sm font-semibold tracking-tight">Termômetro de Aquisição</h3>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_5px_rgba(6,182,212,0.8)]"></span><span className="text-xs text-gray-400">Tráfego Próprio</span></div>
                        <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-purple-500"></span><span className="text-xs text-gray-400">Afiliados Shopee</span></div>
                      </div>
                    </div>

                    <div className="flex-1 grid grid-cols-2 gap-6 items-center">
                      <div className="flex flex-col justify-center gap-4 border-r border-white/5 pr-6 h-full">
                        <div>
                          <div className="flex justify-between items-baseline mb-2">
                            <span className="text-gray-400 text-xs font-medium">UGC / TikTok Ads</span>
                            <span className="text-white font-bold">R$ 42.500 <span className="text-[10px] text-gray-500 font-normal">Faturamento</span></span>
                          </div>
                          <div className="w-full h-8 bg-[#111] border border-white/5 rounded-xl overflow-hidden relative">
                            <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-600 to-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]" style={{ width: '85%' }}></div>
                            <div className="absolute inset-y-0 left-4 flex items-center">
                              <span className="text-black/80 text-[10px] font-bold">ROI 4.2x</span>
                            </div>
                          </div>
                          <span className="text-cyan-400 text-[10px] font-medium mt-1 inline-block">CAC: R$ 13,48</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col justify-center gap-4 pl-2 h-full">
                        <div>
                          <div className="flex justify-between items-baseline mb-2">
                            <span className="text-gray-400 text-xs font-medium">Shopee Afiliados</span>
                            <span className="text-white font-bold">R$ 18.200 <span className="text-[10px] text-gray-500 font-normal">Vendas Líq.</span></span>
                          </div>
                          <div className="w-full h-8 bg-[#111] border border-white/5 rounded-xl overflow-hidden relative">
                            <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-600 to-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.4)]" style={{ width: '35%' }}></div>
                            <div className="absolute inset-y-0 left-4 flex items-center">
                              <span className="text-white/80 text-[10px] font-bold">12% Comis.</span>
                            </div>
                          </div>
                          <span className="text-purple-400 text-[10px] font-medium mt-1 inline-block">Custo Total: R$ 2.184</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Régua de Breakeven */}
                  <div className="h-32 bg-[#0a0a0a] border border-white/5 rounded-2xl p-4 flex flex-col justify-center relative overflow-hidden">
                    <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-[50px] pointer-events-none"></div>
                    <div className="flex items-center justify-between mb-3 relative z-10">
                      <div className="flex items-center gap-2">
                        <Gauge className="w-4 h-4 text-emerald-400" />
                        <h3 className="text-white text-sm font-semibold tracking-tight">Ponto de Equilíbrio <span className="text-gray-500 font-normal ml-1">(Breakeven da Marca)</span></h3>
                      </div>
                      <span className="text-emerald-400 text-xs font-bold tracking-tight">Faltam R$ 3.200</span>
                    </div>
                    
                    <div className="relative z-10">
                      <div className="w-full h-3 bg-[#111] border border-white/5 rounded-full overflow-hidden relative">
                        {/* Marcador do breakeven target */}
                        <div className="absolute top-0 bottom-0 left-[85%] w-px bg-white/50 z-20"></div>
                        <div className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]" style={{ width: '70%' }}></div>
                      </div>
                      <div className="flex justify-between text-[10px] text-gray-500 mt-2 font-medium">
                        <span>R$ 0</span>
                        <span>Custos Fixos (Mês)</span>
                        <span className="text-white">R$ 25.000 Meta</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* --- NOVA LINHA DO COCKPIT --- */}

                {/* Tabela de Lead Quality / Parcerias (Esquerda, 8 colunas) */}
                <div className="col-span-12 lg:col-span-8 bg-[#0a0a0a] border border-white/5 rounded-2xl p-4 flex flex-col relative overflow-hidden group mt-2">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-cyan-500/10 rounded-lg">
                        <Users className="w-4 h-4 text-cyan-400" />
                      </div>
                      <h3 className="text-white text-sm font-semibold tracking-tight">Qualidade de Captação <span className="text-gray-500 font-normal ml-1">(B2B & Influenciadores)</span></h3>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-white/5 text-[10px] uppercase tracking-widest text-gray-500">
                          <th className="pb-3 font-medium">Data</th>
                          <th className="pb-3 font-medium">Nome / Empresa</th>
                          <th className="pb-3 font-medium">Origem</th>
                          <th className="pb-3 font-medium">Status</th>
                          <th className="pb-3 font-medium text-right">Ação</th>
                        </tr>
                      </thead>
                      <tbody className="text-xs">
                        {/* Linha 1 */}
                        <tr className="border-b border-white/5 group/row hover:bg-white/[0.02] transition-colors">
                          <td className="py-3 text-gray-400">Hoje, 14:12</td>
                          <td className="py-3 text-white font-medium">TechHouse B2B</td>
                          <td className="py-3 text-gray-400">Inbound (Orgânico)</td>
                          <td className="py-3">
                            <span className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-2 py-0.5 rounded-full text-[10px] font-bold">Em Negociação</span>
                          </td>
                          <td className="py-3 text-right">
                            <button className="text-cyan-400 hover:text-cyan-300 font-medium">Ver Dossiê</button>
                          </td>
                        </tr>
                        {/* Linha 2 */}
                        <tr className="border-b border-white/5 group/row hover:bg-white/[0.02] transition-colors">
                          <td className="py-3 text-gray-400">Hoje, 09:30</td>
                          <td className="py-3 text-white font-medium">Maria Clara <span className="text-gray-500 font-normal">(@mariaclara)</span></td>
                          <td className="py-3 text-gray-400">Prospecção Ativa</td>
                          <td className="py-3">
                            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full text-[10px] font-bold">Aprovado</span>
                          </td>
                          <td className="py-3 text-right">
                            <button className="text-gray-500 hover:text-white transition-colors"><MoreHorizontal className="w-4 h-4 ml-auto" /></button>
                          </td>
                        </tr>
                        {/* Linha 3 */}
                        <tr className="group/row hover:bg-white/[0.02] transition-colors">
                          <td className="py-3 text-gray-400">Ontem, 16:45</td>
                          <td className="py-3 text-white font-medium">Mega Ferragens</td>
                          <td className="py-3 text-gray-400">Indicação</td>
                          <td className="py-3">
                            <span className="bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-full text-[10px] font-bold">Rejeitado</span>
                          </td>
                          <td className="py-3 text-right">
                            <button className="text-gray-500 hover:text-white transition-colors"><MoreHorizontal className="w-4 h-4 ml-auto" /></button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Social Media Tracker (Direita, 4 colunas) */}
                <div className="col-span-12 lg:col-span-4 flex flex-col gap-4 mt-2">
                  <div className="flex-1 bg-[#0a0a0a] border border-white/5 rounded-2xl p-4 relative overflow-hidden flex flex-col">
                    <div className="absolute -right-10 -top-10 w-32 h-32 bg-purple-500/10 rounded-full blur-[40px] pointer-events-none"></div>
                    <div className="flex items-center justify-between mb-4 relative z-10">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                          <Instagram className="w-4 h-4 text-white" />
                        </div>
                        <h3 className="text-white text-sm font-semibold tracking-tight">Instagram Performance</h3>
                      </div>
                      <span className="text-xs text-gray-500">Últimos 7 dias</span>
                    </div>

                    <div className="space-y-4 relative z-10">
                      <div>
                        <span className="text-[10px] font-medium tracking-widest uppercase text-gray-500">Seguidores</span>
                        <div className="flex items-end gap-2 mt-0.5">
                          <span className="text-2xl font-bold text-white">135.145</span>
                          <span className="text-emerald-400 text-xs font-medium mb-1 flex items-center"><ArrowUpRight className="w-3 h-3 mr-0.5" /> 1.2%</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/5">
                        <div className="bg-[#111] border border-white/5 rounded-xl p-2.5 flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <Heart className="w-3 h-3 text-gray-500" />
                            <span className="text-xs text-gray-400">Likes</span>
                          </div>
                          <span className="text-white text-xs font-medium">42.5K</span>
                        </div>
                        <div className="bg-[#111] border border-white/5 rounded-xl p-2.5 flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <MessageCircle className="w-3 h-3 text-gray-500" />
                            <span className="text-xs text-gray-400">Coment.</span>
                          </div>
                          <span className="text-white text-xs font-medium">8.2K</span>
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] font-medium tracking-widest uppercase text-gray-500 mb-2 block">Top Posts (Alcance)</span>
                        <div className="flex gap-2">
                          <div className="w-1/3 aspect-[4/5] bg-[#1a1a1a] rounded-lg border border-white/10 overflow-hidden relative group cursor-pointer">
                            <div className="absolute inset-0 flex items-center justify-center text-gray-600 text-[10px]">Post 1</div>
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                              <span className="text-white text-[10px] font-bold">120K</span>
                            </div>
                          </div>
                          <div className="w-1/3 aspect-[4/5] bg-[#1a1a1a] rounded-lg border border-white/10 overflow-hidden relative group cursor-pointer">
                            <div className="absolute inset-0 flex items-center justify-center text-gray-600 text-[10px]">Post 2</div>
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                              <span className="text-white text-[10px] font-bold">95K</span>
                            </div>
                          </div>
                          <div className="w-1/3 aspect-[4/5] bg-[#1a1a1a] rounded-lg border border-white/10 overflow-hidden relative group cursor-pointer">
                            <div className="absolute inset-0 flex items-center justify-center text-gray-600 text-[10px]">Post 3</div>
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                              <span className="text-white text-[10px] font-bold">88K</span>
                            </div>
                          </div>
                        </div>
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
            <div className="flex-1 bg-[#111] border border-[#222] rounded-lg overflow-hidden flex flex-col">
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
          )}

          {/* TAB 3: PERFORMANCE */}
          {activeTab === "performance" && (
            <div className="flex-1 flex flex-col gap-3 min-h-0">
              <div className="bg-[#2A1313] border border-red-900/50 rounded-lg p-3 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                  <div>
                    <h4 className="text-red-400 font-semibold text-xs">Fadiga de Criativo: "Vídeo_Inverno_V2" (Meta)</h4>
                    <p className="text-red-300/80 text-[10px] mt-0.5">CAC de R$ 22,00 (Teto R$ 18,00). Freq: 4.8.</p>
                  </div>
                </div>
                <button className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-3 py-1.5 rounded-md text-xs font-medium">
                  Pausar
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3 flex-1 min-h-0">
                {[
                  { name: "Meta Ads", roas: "4.2x", spend: "R$ 2.100", conv: "142", icon: LayoutGrid, trend: "up" },
                  { name: "Mercado Ads", roas: "6.1x", spend: "R$ 800", conv: "89", icon: TrendingUp, trend: "up" },
                  { name: "Shopee Ads", roas: "2.8x", spend: "R$ 350", conv: "10", icon: MousePointerClick, trend: "down" }
                ].map(channel => (
                  <div key={channel.name} className="bg-[#111] border border-[#222] rounded-lg p-4 flex flex-col">
                    <div className="flex items-center gap-2 mb-3">
                      <channel.icon className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-xs font-semibold text-white">{channel.name}</span>
                    </div>
                    <div className="mb-auto">
                      <p className="text-[10px] text-gray-500 mb-0.5">ROAS</p>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-semibold text-white">{channel.roas}</span>
                        {channel.trend === 'up' ? <ArrowUpRight className="w-3 h-3 text-emerald-500" /> : <ArrowDownRight className="w-3 h-3 text-red-500" />}
                      </div>
                    </div>
                    <div className="flex justify-between pt-3 border-t border-[#222] mt-3">
                      <div>
                        <p className="text-[9px] text-gray-500">Investido</p>
                        <p className="text-xs font-medium text-gray-300">{channel.spend}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] text-gray-500">Conv.</p>
                        <p className="text-xs font-medium text-gray-300">{channel.conv}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: ORÇAMENTO */}
          {activeTab === "orcamento" && (
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-6 mt-4">
            <div className="grid grid-cols-4 gap-3 shrink-0">
              <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-3.5 flex flex-col justify-between relative overflow-hidden group hover:border-white/10 transition-colors">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-gray-500 text-[10px] font-medium tracking-widest uppercase">Orçamento</span>
                  <DollarSign className="w-3.5 h-3.5 text-gray-600" />
                </div>
                <div className="flex items-end justify-between">
                  <span className="text-lg font-semibold text-white tracking-tight">{currentKPI.orcamento}</span>
                  <span className="text-[10px] text-gray-500">{currentKPI.percentGasto}% gasto</span>
                </div>
                <div className="w-full h-1 bg-[#1a1a1a] rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)] transition-all duration-500" style={{ width: `${currentKPI.percentGasto}%` }}></div>
                </div>
              </div>

              <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-3.5 flex flex-col justify-between relative overflow-hidden group hover:border-white/10 transition-colors">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-gray-500 text-[10px] font-medium tracking-widest uppercase">ROAS</span>
                  <Target className="w-3.5 h-3.5 text-gray-600" />
                </div>
                <div className="flex items-center gap-2 mt-auto">
                  <span className="text-lg font-semibold text-white tracking-tight">{currentKPI.roas}</span>
                  <span className="flex items-center text-cyan-400 text-[10px] font-medium bg-cyan-500/10 px-1.5 py-0.5 rounded-full border border-cyan-500/20">
                    <ArrowUpRight className="w-2.5 h-2.5 mr-0.5" /> {currentKPI.roasTrend}%
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

              <div className="bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-white/5 hover:border-cyan-500/30 transition-all rounded-2xl p-3.5 flex items-center justify-between cursor-pointer group shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Flame className="w-3.5 h-3.5 text-cyan-400 drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]" />
                    <span className="text-white text-xs font-medium tracking-wide">Modo Scaling</span>
                  </div>
                  <p className="text-[10px] text-gray-400 leading-tight">Injetar verba automática<br/>na campanha vencedora.</p>
                </div>
              </div>
            </div>

            {/* Painéis Corporativos */}
            <div className="mt-6 flex flex-col gap-6 max-w-full pb-4">
              
              {/* Split Superior: Distribuição & Aprovações */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                
                {/* 1. Distribuição de Verba (Burn Rate & Split) */}
                <div className="lg:col-span-7 bg-[#0a0a0a] border border-white/5 rounded-2xl p-5 flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-white text-sm font-semibold tracking-tight">Split de Investimentos</h3>
                    <span className="text-xs text-gray-500 font-medium tracking-widest uppercase">Julho / 2026</span>
                  </div>
                  
                  <div className="space-y-5 mt-auto">
                    <div>
                      <div className="flex justify-between text-xs mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]"></span>
                          <span className="text-gray-300 font-medium">Tráfego Pago (Meta/TikTok)</span>
                        </div>
                        <span className="text-white font-bold">60%</span>
                      </div>
                      <div className="w-full h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                        <div className="h-full bg-cyan-500" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-xs mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]"></span>
                          <span className="text-gray-300 font-medium">Cachê Base (Influenciadores)</span>
                        </div>
                        <span className="text-white font-bold">25%</span>
                      </div>
                      <div className="w-full h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500" style={{ width: '25%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-xs mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]"></span>
                          <span className="text-gray-300 font-medium">Seeding & Envio de Produtos</span>
                        </div>
                        <span className="text-white font-bold">15%</span>
                      </div>
                      <div className="w-full h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500" style={{ width: '15%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Pipeline de Aprovações (Corporate Workflow) */}
                <div className="lg:col-span-5 bg-[#0a0a0a] border border-white/5 rounded-2xl p-5 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white text-sm font-semibold tracking-tight">Aprovações Pendentes</h3>
                    <div className="px-2 py-0.5 bg-yellow-500/10 border border-yellow-500/20 rounded-full flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-yellow-500" />
                      <span className="text-[10px] text-yellow-500 font-bold uppercase tracking-widest">3 Ações</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mt-1 flex-1 overflow-y-auto custom-scrollbar pr-1">
                    <div className="bg-[#111] border border-white/5 p-3 rounded-xl flex flex-col gap-2 relative overflow-hidden group hover:border-yellow-500/30 transition-all">
                      <div className="flex justify-between items-start">
                        <span className="text-xs text-white font-medium">Cachê Extra: Virgínia</span>
                        <span className="text-xs font-bold text-gray-300">R$ 15.000</span>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-[10px] text-gray-500">Campanha Black Friday</span>
                        <div className="flex gap-2">
                          <button className="text-[9px] font-bold px-2 py-1 bg-white/5 hover:bg-white/10 rounded uppercase text-gray-400">Rejeitar</button>
                          <button className="text-[9px] font-bold px-2 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded uppercase hover:bg-cyan-500/20">Aprovar</button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-[#111] border border-white/5 p-3 rounded-xl flex flex-col gap-2 relative overflow-hidden group hover:border-yellow-500/30 transition-all">
                      <div className="flex justify-between items-start">
                        <span className="text-xs text-white font-medium">Boost Meta Ads</span>
                        <span className="text-xs font-bold text-gray-300">R$ 5.000</span>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-[10px] text-gray-500">Escala de Criativo #04</span>
                        <div className="flex gap-2">
                          <button className="text-[9px] font-bold px-2 py-1 bg-white/5 hover:bg-white/10 rounded uppercase text-gray-400">Rejeitar</button>
                          <button className="text-[9px] font-bold px-2 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded uppercase hover:bg-cyan-500/20">Aprovar</button>
                        </div>
                      </div>
                    </div>
                  </div>
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
          </div>
        )}
      </div>

      </div>

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
                        <p className="text-[9px] text-gray-500 mt-0.5">{asset.type} • {asset.size}</p>
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
  );
}
