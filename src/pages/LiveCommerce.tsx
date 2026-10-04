import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Video, 
  Users, 
  Package, 
  Calendar, 
  TrendingUp, 
  DollarSign, 
  PlayCircle, 
  CheckCircle2, 
  Clock, 
  Truck,
  Plus,
  MoreHorizontal,
  Search,
  BarChart3,
  Trophy,
  ShoppingBag,
  Smartphone,
  Activity,
  ArrowUpRight,
  Star
} from "lucide-react";
import { AreaChart, Area, BarChart, Bar, ResponsiveContainer, YAxis, XAxis, Tooltip } from "recharts";
import { toast } from "sonner";

export default function LiveCommerce() {
  const [activeTab, setActiveTab] = useState("planner");

  return (
    <div className="flex-1 h-full overflow-y-auto bg-[#050505] text-white pt-4 md:pt-[18px] pl-20 md:pl-[104px] pr-4 md:pr-8 animate-in fade-in duration-500 font-sans selection:bg-[#00E5FF] selection:text-black pb-24">
      {/* HEADER */}
      <div className="w-full flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
            <span className="text-[#00E5FF]">Live Commerce.</span>
          </h1>
          <div className="hidden md:block w-px h-8 bg-[#00E5FF]/40"></div>
          <div className="md:hidden w-10 h-px bg-[#00E5FF]/40 my-1"></div>
          <p className="text-gray-400 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] max-w-xs leading-relaxed">
            TikTok Shop • Shopee • Mercado Livre
          </p>
        </div>
        <div className="flex items-center gap-3 bg-[#111111] p-1.5 rounded-full border border-white/5">
          <button 
            onClick={() => setActiveTab("planner")}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'planner' ? 'bg-[#00E5FF]/10 text-[#00E5FF]' : 'text-gray-500 hover:text-white'}`}
          >
            Planner
          </button>
          <button 
            onClick={() => setActiveTab("creators")}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'creators' ? 'bg-[#00E5FF]/10 text-[#00E5FF]' : 'text-gray-500 hover:text-white'}`}
          >
            Creators CRM
          </button>
          <button 
            onClick={() => setActiveTab("seeding")}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'seeding' ? 'bg-[#00E5FF]/10 text-[#00E5FF]' : 'text-gray-500 hover:text-white'}`}
          >
            Seeding
          </button>
        </div>
      </div>

      {/* MODULES */}
      {activeTab === "planner" && <LivePlannerModule />}
      {activeTab === "creators" && <CreatorsCRMModule />}
      {activeTab === "seeding" && <SeedingModule />}
    </div>
  );
}

function LivePlannerModule() {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const lives = [
    { 
      id: 1, 
      title: "Mega Oferta Shopee", 
      platform: "Shopee", 
      date: "Hoje, 19:00", 
      status: "AO VIVO", 
      target: "R$ 5.000", 
      highlight: "Kit Skincare Premium", 
      productsCount: "+12 itens",
      host: "Maria Clara",
      hostInitials: "MC",
      viewers: "1.4k",
      color: "text-orange-500", 
      bg: "bg-orange-500/10", 
      border: "border-orange-500/20" 
    },
    { 
      id: 2, 
      title: "Flash Sale Noturna", 
      platform: "TikTok", 
      date: "Amanhã, 21:00", 
      status: "Roteirizando", 
      target: "R$ 3.500", 
      highlight: "Sérum Facial Vit C", 
      productsCount: "+8 itens",
      host: "João Pedro",
      hostInitials: "JP",
      viewers: null,
      color: "text-pink-500", 
      bg: "bg-pink-500/10", 
      border: "border-pink-500/20" 
    },
    { 
      id: 3, 
      title: "Esquenta Black Friday", 
      platform: "TikTok", 
      date: "Sexta, 20:00", 
      status: "Agendada", 
      target: "R$ 12.000", 
      highlight: "Combo Beleza Total", 
      productsCount: "+20 itens",
      host: "Ana Silva",
      hostInitials: "AS",
      viewers: null,
      color: "text-pink-500", 
      bg: "bg-pink-500/10", 
      border: "border-pink-500/20" 
    },
  ];

  const topProducts = [
    { name: "Kit Skincare Premium", sold: 450, rev: "R$ 12.5k", trend: "+12%" },
    { name: "Sérum Facial Vit C", sold: 320, rev: "R$ 8.2k", trend: "+5%" },
    { name: "Gota Mágica Hair", sold: 210, rev: "R$ 4.1k", trend: "-2%" }
  ];

  const topCreators = [
    { name: "Maria Clara", handle: "@mariaclara.beauty", roi: "4.2x", rev: "R$ 32k" },
    { name: "João Pedro", handle: "@jp.reviews", roi: "3.8x", rev: "R$ 18k" },
  ];

  const chartData = [
    { name: "Seg", shopee: 4000, tiktok: 2400 },
    { name: "Ter", shopee: 3000, tiktok: 1398 },
    { name: "Qua", shopee: 2000, tiktok: 9800 },
    { name: "Qui", shopee: 2780, tiktok: 3908 },
    { name: "Sex", shopee: 1890, tiktok: 4800 },
    { name: "Sáb", shopee: 2390, tiktok: 3800 },
    { name: "Dom", shopee: 3490, tiktok: 4300 },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col gap-6">
      
      {/* 1. Kpis Universais & Plataformas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-6">
          <div className="bg-[#111] border border-orange-500/20 p-6 rounded-2xl relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl group-hover:bg-orange-500/20 transition-all"></div>
            <div className="flex justify-between items-center mb-4 relative z-10">
              <span className="text-[10px] text-orange-500 font-bold uppercase tracking-widest flex items-center gap-2"><ShoppingBag className="w-3.5 h-3.5"/> Shopee Live</span>
              <span className="text-xs font-bold text-white bg-white/5 px-2 py-1 rounded-md">65%</span>
            </div>
            <div className="text-3xl font-black text-white relative z-10">R$ 85.4k</div>
            <div className="text-[10px] text-gray-500 uppercase tracking-widest mt-2 font-bold relative z-10">Faturamento Mensal</div>
          </div>
          
          <div className="bg-[#111] border border-pink-500/20 p-6 rounded-2xl relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-pink-500/10 rounded-full blur-2xl group-hover:bg-pink-500/20 transition-all"></div>
            <div className="flex justify-between items-center mb-4 relative z-10">
              <span className="text-[10px] text-pink-500 font-bold uppercase tracking-widest flex items-center gap-2"><Smartphone className="w-3.5 h-3.5"/> TikTok Shop</span>
              <span className="text-xs font-bold text-white bg-white/5 px-2 py-1 rounded-md">35%</span>
            </div>
            <div className="text-3xl font-black text-white relative z-10">R$ 46.0k</div>
            <div className="text-[10px] text-gray-500 uppercase tracking-widest mt-2 font-bold relative z-10">Faturamento Mensal</div>
          </div>
        </div>

        <MetricCard title="Taxa de Conversão Média" value="4.8%" icon={<Activity className="w-5 h-5 text-[#00E5FF]" />} />
        <MetricCard title="Viewers Totais (Mês)" value="45.2k" icon={<Users className="w-5 h-5 text-[#00E5FF]" />} />
      </div>

      {/* 2. Gráficos & Top Rankings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Gráfico de Faturamento Misto */}
        <div className="col-span-1 lg:col-span-2 bg-[#111111] border border-white/5 p-6 rounded-3xl relative overflow-hidden flex flex-col">
          <div className="flex justify-between items-center mb-6">
             <h2 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
               <BarChart3 className="w-4 h-4 text-[#00E5FF]" /> Performance por Dia
             </h2>
             <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest">
               <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-orange-500"></div> Shopee</div>
               <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-pink-500"></div> TikTok</div>
             </div>
          </div>
          <div className="w-full h-[280px] pb-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 25 }}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#888' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#666' }} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                  contentStyle={{ backgroundColor: '#050505', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="shopee" stackId="a" fill="#f97316" radius={[0, 0, 4, 4]} />
                <Bar dataKey="tiktok" stackId="a" fill="#ec4899" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Performers Column */}
        <div className="col-span-1 flex flex-col gap-6">
          {/* Top Products */}
          <div className="bg-[#111111] border border-white/5 p-6 rounded-3xl">
            <h2 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2 mb-4">
               <Trophy className="w-4 h-4 text-yellow-400" /> Produtos Campeões
            </h2>
            <div className="flex flex-col gap-3">
              {topProducts.map((prod, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setSelectedProduct(prod)}
                  className="w-full text-left flex justify-between items-center p-3 bg-black/40 rounded-xl border border-white/5 hover:border-[#00FF00]/30 transition-all cursor-pointer group"
                >
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-200 group-hover:text-white transition-colors">{prod.name}</span>
                    <span className="text-[10px] text-gray-500 uppercase font-bold mt-0.5">{prod.sold} vendas</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-bold text-[#00FF00]">{prod.rev}</span>
                    <span className="text-[9px] text-gray-400 mt-0.5">{prod.trend}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* 3. Top Blogueiras & Agenda */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Top Creators Leaderboard */}
        <div className="col-span-1 bg-[#111111] border border-white/5 p-6 rounded-3xl">
            <h2 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2 mb-5">
               <Star className="w-4 h-4 text-[#00E5FF]" /> Top Creators (ROI)
            </h2>
            <div className="flex flex-col gap-4">
              {topCreators.map((creator, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#00E5FF]/20 to-purple-500/20 border border-white/10 flex items-center justify-center font-bold text-xs text-white">
                    {idx + 1}º
                  </div>
                  <div className="flex flex-col flex-1">
                    <span className="text-sm font-bold text-gray-200">{creator.name}</span>
                    <span className="text-[10px] text-gray-500 tracking-widest uppercase">{creator.handle}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-bold text-[#00FF00]">{creator.roi}</span>
                    <span className="text-[9px] text-gray-500 uppercase font-bold">{creator.rev}</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-3 border border-white/5 rounded-xl text-xs font-bold text-gray-400 uppercase tracking-widest hover:bg-white/5 hover:text-white transition-colors">
              Ver Ranking Completo
            </button>
        </div>

        {/* Agenda Operacional PRO */}
        <div className="col-span-1 lg:col-span-2 bg-[#111111] border border-white/5 p-6 rounded-3xl relative overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#00E5FF]" /> Agenda de Lives
            </h2>
            <div className="flex items-center gap-3">
              <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest hidden md:block">Próximos 7 dias</span>
              <button className="flex items-center gap-2 bg-[#00E5FF]/10 hover:bg-[#00E5FF]/20 text-[#00E5FF] px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors">
                <Plus className="w-3.5 h-3.5" /> Agendar
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {lives.map(live => {
              const isLive = live.status === "AO VIVO";
              
              return (
                <div key={live.id} className={`flex flex-col md:flex-row md:items-center justify-between p-4 rounded-2xl bg-[#0a0a0a] border ${isLive ? 'border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 'border-white/5 hover:border-white/20'} transition-all group`}>
                  
                  <div className="flex items-center gap-4 mb-4 md:mb-0 w-full md:w-[35%]">
                    <div className="relative">
                      <div className={`w-10 h-10 rounded-full ${live.bg} flex items-center justify-center border ${live.border}`}>
                        {live.platform === 'Shopee' ? <ShoppingBag className={`w-4 h-4 ${live.color}`} /> : <Smartphone className={`w-4 h-4 ${live.color}`} />}
                      </div>
                      {isLive && <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-[#0a0a0a] animate-pulse"></div>}
                    </div>
                    <div className="flex flex-col">
                      <h4 className="font-bold text-white text-sm tracking-tight">{live.title}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-[9px] font-bold uppercase tracking-widest ${live.color}`}>{live.platform}</span>
                        <span className="text-[9px] text-gray-600 font-bold">•</span>
                        <span className={`text-[9px] font-bold uppercase tracking-widest ${isLive ? 'text-red-400 animate-pulse' : 'text-gray-500'}`}>{live.date}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 w-full md:w-[25%] mb-4 md:mb-0">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500/20 to-blue-500/20 border border-white/10 flex items-center justify-center text-[9px] font-bold text-white">
                      {live.hostInitials}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Apresentação</span>
                      <span className="font-bold text-gray-200 text-xs">{live.host}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full md:w-[40%]">
                    <div className="flex flex-col max-w-[110px]">
                      <span className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Produtos ({live.productsCount})</span>
                      <span className="font-bold text-gray-300 text-xs truncate">{live.highlight}</span>
                    </div>
                    
                    <div className="flex flex-col text-right">
                      <span className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Meta Base</span>
                      <span className="font-bold text-[#00FF00] text-sm">{live.target}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      {isLive ? (
                        <div className="px-2.5 py-1 rounded-md bg-red-500/10 border border-red-500/30 text-[9px] font-bold text-red-500 uppercase tracking-wider flex items-center gap-1.5 animate-pulse">
                          Ao Vivo <Users className="w-3 h-3" /> {live.viewers}
                        </div>
                      ) : (
                        <div className={`px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[9px] font-bold ${live.color} uppercase tracking-wider`}>
                          {live.status}
                        </div>
                      )}
                      <button className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-white/10 hover:text-white transition-colors border border-transparent hover:border-white/10">
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* DIALOG DE PRODUTO SELECIONADO */}
      <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        <DialogContent className="bg-[#111111] border border-white/10 text-white sm:max-w-[600px] p-6 z-[200]">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl font-bold flex items-center gap-3">
              <Trophy className="w-5 h-5 text-yellow-400" />
              {selectedProduct?.name}
            </DialogTitle>
          </DialogHeader>

          {selectedProduct && (
            <div className="flex flex-col gap-6">
              {/* KPIs Principais */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
                  <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold block mb-1">Vendas Totais</span>
                  <span className="text-2xl font-black text-white">{selectedProduct.sold}</span>
                  <span className="text-xs text-[#00FF00] ml-2 font-bold">{selectedProduct.trend}</span>
                </div>
                <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
                  <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold block mb-1">Faturamento Bruto</span>
                  <span className="text-2xl font-black text-[#00FF00]">{selectedProduct.rev}</span>
                </div>
              </div>

              {/* Informações de Performance */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Pico de Vendas</span>
                  <span className="text-sm font-bold text-gray-200">Terça-feira (21:00)</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Plataforma Principal</span>
                  <span className="text-sm font-bold text-orange-500 flex items-center gap-1.5"><ShoppingBag className="w-3.5 h-3.5" /> Shopee (68%)</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Melhor Turno</span>
                  <span className="text-sm font-bold text-gray-200">Noturno (19h às 23h)</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Público-Alvo Core</span>
                  <span className="text-sm font-bold text-gray-200">Mulheres 18-35 anos</span>
                </div>
              </div>

              {/* Distribuicao por Periodo (Visual) */}
              <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold block mb-4">Distribuição por Período de Live</span>
                <div className="flex flex-col gap-3">
                  <div>
                    <div className="flex justify-between text-xs font-bold text-gray-300 mb-1.5">
                      <span>Manhã (08h - 12h)</span>
                      <span>15%</span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: '15%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-bold text-gray-300 mb-1.5">
                      <span>Tarde (12h - 18h)</span>
                      <span>25%</span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-500 rounded-full" style={{ width: '25%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-bold text-gray-300 mb-1.5">
                      <span>Noite (18h - 23h)</span>
                      <span className="text-[#00FF00]">60%</span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden shadow-[0_0_10px_rgba(255,20,147,0.2)]">
                      <div className="h-full bg-pink-500 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CreatorsCRMModule() {
  const creators = [
    { id: 1, name: "Maria Clara", handle: "@mariaclara.beauty", niche: "Beleza", followers: "250k", er: "3.2%", roi: "2.4x" },
    { id: 2, name: "João Pedro", handle: "@jp.reviews", niche: "Tecnologia", followers: "120k", er: "5.1%", roi: "4.1x" },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-[#111111] border border-white/5 p-8 rounded-3xl relative overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
            <Users className="w-5 h-5 text-[#00E5FF]" /> Base de Influenciadores
          </h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Buscar creator..." className="bg-black border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-[#00E5FF]/50 w-64" />
            </div>
            <button className="flex items-center gap-2 bg-[#00E5FF]/10 hover:bg-[#00E5FF]/20 text-[#00E5FF] px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors">
              <Plus className="w-4 h-4" /> Adicionar
            </button>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-[10px] text-gray-500 uppercase tracking-widest">
                <th className="pb-4 font-bold">Creator</th>
                <th className="pb-4 font-bold">Nicho</th>
                <th className="pb-4 font-bold">Seguidores</th>
                <th className="pb-4 font-bold">Engajamento (ER)</th>
                <th className="pb-4 font-bold">ROI Histórico</th>
                <th className="pb-4 font-bold text-right">Ação</th>
              </tr>
            </thead>
            <tbody>
              {creators.map(c => (
                <tr key={c.id} className="border-b border-white/5 group hover:bg-white/5 transition-colors">
                  <td className="py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-white">{c.name}</span>
                      <span className="text-xs text-gray-500">{c.handle}</span>
                    </div>
                  </td>
                  <td className="py-4"><span className="px-2 py-1 bg-white/5 rounded-md text-xs font-medium text-gray-300">{c.niche}</span></td>
                  <td className="py-4 text-sm text-gray-300">{c.followers}</td>
                  <td className="py-4 text-sm text-[#00E5FF] font-medium">{c.er}</td>
                  <td className="py-4 text-sm font-bold text-[#00FF00]">{c.roi}</td>
                  <td className="py-4 text-right">
                    <button className="text-gray-500 hover:text-white transition-colors"><MoreHorizontal className="w-4 h-4 ml-auto" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SeedingModule() {
  const seedings = [
    { id: 1, creator: "@mariaclara.beauty", product: "Kit Skincare Premium", status: "Enviado", tracking: "BR123456789", posted: false },
    { id: 2, creator: "@jp.reviews", product: "Fone Bluetooth XYZ", status: "Recebido", tracking: "BR987654321", posted: true },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-[#111111] border border-white/5 p-8 rounded-3xl relative overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
            <Package className="w-5 h-5 text-[#00E5FF]" /> Logística de Seeding
          </h2>
          <button className="flex items-center gap-2 bg-[#00E5FF]/10 hover:bg-[#00E5FF]/20 text-[#00E5FF] px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors">
            <Plus className="w-4 h-4" /> Novo Envio
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {seedings.map(seed => (
            <div key={seed.id} className="flex items-center justify-between p-4 rounded-xl bg-[#0a0a0a] border border-white/5 group">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${seed.status === 'Recebido' ? 'bg-[#00FF00]/10 border-[#00FF00]/20' : 'bg-orange-500/10 border-orange-500/20'}`}>
                  {seed.status === 'Recebido' ? <CheckCircle2 className="w-5 h-5 text-[#00FF00]" /> : <Truck className="w-5 h-5 text-orange-500" />}
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-white text-sm">{seed.creator}</span>
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">{seed.product}</span>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className="flex flex-col text-right">
                  <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Rastreio</span>
                  <span className="text-xs font-mono text-gray-300">{seed.tracking}</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Postou?</span>
                  <button 
                    className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${seed.posted ? 'bg-[#00E5FF] text-black' : 'bg-white/5 border border-white/10 text-transparent hover:border-white/30'}`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    </div>
  );
}

function MetricCard({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) {
  return (
    <div className="bg-[#111111] border border-white/5 p-6 rounded-2xl flex flex-col justify-between">
      <div className="flex justify-between items-center mb-4">
        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{title}</span>
        {icon}
      </div>
      <div className="text-3xl font-black text-white">{value}</div>
    </div>
  );
}
