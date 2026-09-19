import React, { useState } from "react";
import { 
  Briefcase, Target, TrendingUp, Users, DollarSign, ArrowRight, 
  ShieldCheck, Zap, Globe, ShoppingBag, Box, Server, Paintbrush, 
  Network, Code2, Layers, Cpu, Fingerprint, Heart, MessageCircle, 
  Share2, Play, Search, User, Home, ShoppingCart, CheckCircle2, CircleDashed, Rocket, Store, Video, Smartphone, Asterisk, Sparkles, Sprout, HeartHandshake, Leaf, Circle
} from "lucide-react";

export default function BusinessPlan() {
  const marketplaces = [
    { name: "Mercado Livre", status: "completed", icon: ShoppingCart, color: "text-yellow-500" },
    { name: "Shopee", status: "completed", icon: ShoppingCart, color: "text-orange-500" },
    { name: "Amazon", status: "completed", icon: ShoppingCart, color: "text-blue-500" },
    { name: "Magalu", status: "completed", icon: ShoppingCart, color: "text-blue-600" },
    { name: "TikTok", status: "pending", icon: Smartphone, color: "text-black dark:text-white" },
    { name: "Site Próprio", status: "pending", icon: Globe, color: "text-primary" },
  ];
  const completedCount = marketplaces.filter(m => m.status === "completed").length;
  const progressPercentage = (completedCount / marketplaces.length) * 100;
  const [activeTab, setActiveTab] = useState<"estrategia" | "metas" | "ecossistema" | "app">("estrategia");
  const [activeGeneration, setActiveGeneration] = useState<string | null>(null);
  const [activeMarketVision, setActiveMarketVision] = useState<"farma" | "atendimento">("farma");

  return (
    <div className="flex-1 w-full min-h-screen relative flex flex-col font-sans overflow-y-auto custom-scrollbar bg-[#050505] selection:bg-[#CCFF00] selection:text-black pb-10">
      
      {/* Glow de Fundo Estático */}
      <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-gradient-to-br  to-transparent rounded-none blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/4 transition-all duration-1000" />
      
      {activeTab === "ecossistema" && (
         <div className="absolute top-1/2 left-0 w-[600px] h-[500px] bg-gradient-to-tr  to-transparent rounded-none blur-[100px] pointer-events-none -translate-x-1/2 transition-all duration-1000" />
      )}

      {/* HEADER / HERO - BRUTALIST */}
      <div className="pl-4 pr-8 lg:pr-12 pt-0 pb-6 relative z-10 flex flex-col gap-2 max-w-[1600px] w-full">
        
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 w-full">
          {/* Lado Esquerdo: BUSINESS PLAN */}
          <div className="flex flex-col w-full lg:w-auto cursor-pointer" onClick={() => setActiveTab("estrategia")}>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[#CCFF00] font-black uppercase tracking-widest text-sm">
                Painel Estratégico
              </span>
              <span className="text-[#CCFF00] font-black opacity-30 text-sm">/</span>
              <span className="text-white/80 font-black uppercase tracking-widest text-sm">
                Vendemos Soluções
              </span>
            </div>
            <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none text-white hover:text-gray-200 transition-colors">
              BUSINESS
            </h1>
            <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none text-[#CCFF00] hover:text-[#aadd00] transition-colors -mt-2">
              PLAN.
            </h1>
          </div>
          
          {/* Lado Direito: Texto + Tabs */}
          <div className="flex flex-col items-end gap-6 w-full lg:w-auto flex-shrink-0">
            <div className="border-l-4 lg:border-l-0 lg:border-r-4 border-[#CCFF00] pl-6 lg:pl-0 lg:pr-6 text-left lg:text-right w-full lg:max-w-xl">
              <p className="text-gray-400 text-lg md:text-xl font-bold leading-relaxed">
                Visão de longo prazo, modelo de negócios, expansão e a estrutura completa do ecossistema da empresa.
              </p>
            </div>
            
            <div className="flex flex-wrap sm:flex-nowrap bg-[#111111] border-4 border-white/10 p-1 rounded-none gap-1 w-full lg:w-auto">
              <button 
                onClick={() => setActiveTab("metas")}
                className={`flex-1 px-4 sm:px-6 py-4 rounded-none text-sm font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                  activeTab === "metas" ? "bg-[#CCFF00] text-black shadow-none" : "text-gray-400 hover:text-white hover:bg-white/10"
                }`}
              >
                Metas & Visão
              </button>
              <button 
                onClick={() => setActiveTab("ecossistema")}
                className={`flex-1 px-4 sm:px-6 py-4 rounded-none text-sm font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                  activeTab === "ecossistema" ? "bg-[#CCFF00] text-black shadow-none" : "text-gray-400 hover:text-white hover:bg-white/10"
                }`}
              >
                Ecossistema
              </button>
              <button 
                onClick={() => setActiveTab("app")}
                className={`flex-1 px-4 sm:px-6 py-4 rounded-none text-sm font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                  activeTab === "app" ? "bg-[#CCFF00] text-black shadow-none" : "text-gray-400 hover:text-white hover:bg-white/10"
                }`}
              >
                Visão App
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Dinâmico */}
      <div className="pl-4 pr-8 lg:pr-12 pt-4 pb-8 relative z-10 flex flex-col gap-6 lg:gap-8 max-w-[1600px] w-full">
        
        {activeTab === "metas" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col gap-6 lg:gap-8">
            {/* Cabeçalho de Visão */}
      <div className="flex flex-col space-y-3 mb-8">
        <div className="flex items-center gap-4">
          <Target className="h-10 w-10 text-[#CCFF00] drop-shadow-[0_0_10px_rgba(0,255,0,0.3)]" />
          <h2 className="text-5xl lg:text-7xl font-black tracking-tighter uppercase text-white leading-none">Estratégia e Crescimento</h2>
        </div>
        <p className="text-gray-400 text-sm font-bold max-w-3xl leading-relaxed">
          Acompanhe nossos objetivos estratégicos de expansão omnichannel e crescimento escalável. 
          Nossa meta é a excelência operacional, estabelecendo um padrão de mercado equivalente ao das maiores plataformas do setor.
        </p>
      </div>

          {/* Seção 1: Resumo Executivo */}
            <section>
              <h2 className="text-white text-xl font-bold tracking-tight mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-[#CCFF00]" /> Resumo Executivo
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#111111] border-4 border-white/10 rounded-none p-6 hover:border-white/10 transition-colors shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-none bg-blue-500/10 text-blue-400"><TrendingUp className="w-4 h-4" /></div>
                    <h3 className="text-white font-bold uppercase tracking-wider text-xs">Visão</h3>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed font-black">
                    Tornar-se a potência definitiva no varejo digital de utilidades e ferramentas em SP e ABC. Nosso foco é dominar os marketplaces e nosso ecossistema próprio através de entregas Same-Day (Flex), unindo a venda de produtos de alta demanda (Curva A) à execução de serviços.
                  </p>
                </div>
                
                <div className="bg-[#111111] border-4 border-white/10 rounded-none p-6 hover:border-white/10 transition-colors shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-none bg-emerald-500/10 text-emerald-400"><ShieldCheck className="w-4 h-4" /></div>
                    <h3 className="text-white font-bold uppercase tracking-wider text-xs">Missão</h3>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed font-black">
                    Resolver a dor do cliente de ponta a ponta com agilidade e segurança. Entregamos os melhores produtos e oferecemos a instalação (cross-sell) diretamente na casa do cliente, garantindo uma jornada impecável do WhatsApp à entrega.
                  </p>
                </div>
                
                <div className="bg-[#111111] border-4 border-white/10 rounded-none p-6 hover:border-white/10 transition-colors shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-none bg-amber-500/10 text-amber-400"><Zap className="w-4 h-4" /></div>
                    <h3 className="text-white font-bold uppercase tracking-wider text-xs">Diferencial</h3>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed font-black">
                    Ecossistema 100% integrado: logística própria ultrarrápida (Rama Flow), tecnologia interna de gestão (Rama System), IA humanizada no WhatsApp e o Exército do ABC (influenciadores locais). Nós não só vendemos, nós instalamos e fidelizamos.
                  </p>
                </div>
              </div>
            </section>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Marketplaces Progress */}
        <div className="col-span-1 lg:col-span-2 bg-[#111111]/80 backdrop-blur-md border-4 border-white/10 rounded-none p-8 flex flex-col justify-between shadow-2xl transition-all">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                <Store className="h-6 w-6 text-[#CCFF00]" />
                Presença em Marketplaces
              </h3>
              <span className="bg-white/5 text-white text-sm font-bold px-4 py-1.5 rounded-none border-4 border-white/10">
                {Math.round(progressPercentage)}%
              </span>
            </div>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-6">
              Expansão multicanal (Status: {completedCount} de {marketplaces.length})
            </p>

            {/* Cronograma de Próximos Passos */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <div className="flex-1 bg-[#111111] border-4 border-white/10 rounded-none p-4 flex items-center gap-4 hover:border-white/10 transition-all group">
                <div className="bg-white/5 p-2.5 rounded-none border-4 border-white/10 group-hover:scale-110 transition-transform">
                  <Globe className="h-5 w-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-[#CCFF00] text-[10px] uppercase tracking-widest font-bold mb-0.5 flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-none bg-[#CCFF00] opacity-40"></span>
                      <span className="relative inline-flex rounded-none h-2 w-2 bg-[#CCFF00]"></span>
                    </span>
                    Meta: Outubro
                  </p>
                  <p className="text-white font-bold text-sm">Site Próprio (D2C)</p>
                </div>
              </div>
              <div className="flex-1 bg-[#111111] border-4 border-white/10 rounded-none p-4 flex items-center gap-4 hover:border-white/10 transition-all group">
                <div className="bg-white/5 p-2.5 rounded-none border-4 border-white/10 group-hover:scale-110 transition-transform">
                  <Smartphone className="h-5 w-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-[#CCFF00] text-[10px] uppercase tracking-widest font-bold mb-0.5 flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-none bg-[#CCFF00] opacity-40"></span>
                      <span className="relative inline-flex rounded-none h-2 w-2 bg-[#CCFF00]"></span>
                    </span>
                    Meta: Novembro
                  </p>
                  <p className="text-white font-bold text-sm">TikTok Shop</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-8">
            <div className="w-full bg-white/5 rounded-none h-2.5 overflow-hidden">
              <div className="bg-[#CCFF00] h-2.5 rounded-none shadow-[0_0_10px_rgba(0,255,0,0.5)]" style={{ width: `${progressPercentage}%` }}></div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {marketplaces.map((mk) => (
                <div key={mk.name} className="flex items-center gap-4 p-4 rounded-none border-4 border-white/10 bg-[#111111] hover:border-white/10 transition-colors group">
                  <mk.icon className={`h-6 w-6 ${mk.color === 'text-primary' ? 'text-[#CCFF00]' : mk.color === 'text-black dark:text-white' ? 'text-white' : mk.color} group-hover:scale-110 transition-transform`} />
                  <div className="flex flex-col">
                    <span className="font-bold text-white text-sm mb-0.5">{mk.name}</span>
                    <span className="text-[10px] uppercase tracking-widest text-gray-500 flex items-center gap-1.5 font-bold">
                      {mk.status === "completed" ? (
                        <><CheckCircle2 className="h-3 w-3 text-[#CCFF00]" /> Ativo</>
                      ) : (
                        <><CircleDashed className="h-3 w-3 text-orange-500" /> A fazer</>
                      )}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Resumo Financeiro / Metas de Venda */}
        <div className="flex flex-col justify-between bg-[#111111]/80 backdrop-blur-md border-4 border-white/10 rounded-none p-8 shadow-2xl">
          <div className="mb-6">
            <h3 className="text-2xl font-black text-white tracking-tight flex items-center gap-3 mb-2">
              <TrendingUp className="h-6 w-6 text-[#CCFF00]" />
              Metas de Faturamento
            </h3>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Objetivos de receita bruta</p>
          </div>
          
          <div className="space-y-6 flex-1">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex flex-col">
                  <span className="text-white font-bold text-sm">Meta deste Ano</span>
                  <span className="text-[10px] text-gray-500 uppercase tracking-widest">Faturamento Bruto</span>
                </div>
                <span className="bg-[#CCFF00]/10 text-[#CCFF00] border border-[#00FF00]/20 text-xs font-bold py-1.5 px-3 rounded-none">R$ 3.000.000</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex flex-col">
                  <span className="text-white font-bold text-sm">Meta do Ano que Vem</span>
                  <span className="text-[10px] text-gray-500 uppercase tracking-widest">Escala e Expansão</span>
                </div>
                <span className="bg-[#CCFF00]/20 text-[#CCFF00] border border-[#00FF00]/30 text-xs font-bold py-1.5 px-3 rounded-none shadow-[0_0_10px_rgba(0,255,0,0.1)]">R$ 5.000.000</span>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed font-bold">
              Com a entrada no TikTok, Site Próprio e Afiliados, esperamos atingir a meta do ano que vem com maior margem de lucro.
            </p>
          </div>
          
          <div className="mt-8">
            <button className="w-full flex items-center justify-center gap-2 bg-[#CCFF00] hover:bg-[#CCFF00]/80 text-black px-6 py-3 rounded-none text-sm font-bold transition-all shadow-[0_0_15px_rgba(0,255,0,0.3)] hover:shadow-[0_0_20px_rgba(0,255,0,0.4)]">
              <Rocket className="h-4 w-4" />
              Acompanhar Resultados
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">

        {/* Card 1: Logística e Entrega */}
        <div className="bg-[#111315]/80 backdrop-blur-md border-4 border-white/10 rounded-none p-6 flex flex-col justify-between shadow-lg hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(0,255,0,0.1)] hover:border-[#00FF00]/30 transition-all duration-500 animate-in slide-in-from-bottom-8 fade-in delay-100">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
              <h3 className="text-white text-lg font-black">Logística e Entrega</h3>
            </div>
            <p className="text-gray-400 text-sm mb-4">Experiência de Grandes Plataformas</p>
            <p className="text-gray-300 text-sm mb-6 leading-relaxed">
              Garantir entrega no mesmo dia para São Paulo (SP) e região do ABC, operando através da transportadora parceira já validada.
            </p>
          </div>
          {/* Botão Secundário Padronizado */}
          <button className="w-full py-3 px-4 bg-[#1A1D21] hover:bg-[#252A30] border-4 border-white/10 text-white text-sm font-bold rounded-none transition-all duration-200 flex items-center justify-center gap-2">
            <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            Estrutura Ativa (Same-day Delivery)
          </button>
        </div>

        {/* Card 2: Programa de Afiliados */}
        <div className="bg-[#111315]/80 backdrop-blur-md border-4 border-white/10 rounded-none p-6 flex flex-col justify-between shadow-lg hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(0,255,0,0.1)] hover:border-[#00FF00]/30 transition-all duration-500 animate-in slide-in-from-bottom-8 fade-in delay-200">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
              <h3 className="text-white text-lg font-black">Programa de Afiliados</h3>
            </div>
            <p className="text-gray-400 text-sm mb-4">Rede descentralizada de parceiros comerciais</p>
            <p className="text-gray-300 text-sm mb-6 leading-relaxed">
              Implementação de um programa estruturado de comissionamento, alavancando nossa capilaridade de vendas...
            </p>
          </div>
          
          <div>
            <div className="flex justify-between text-xs text-gray-400 mb-2">
              <span>Progresso</span>
              <span>10% Planejado</span>
            </div>
            <div className="w-full bg-gray-800 rounded-none h-1.5 mb-6">
              <div className="bg-purple-500 h-1.5 rounded-none" style={{ width: "10%" }}></div>
            </div>
            {/* Botão Padronizado */}
            <button className="w-full py-3 px-4 bg-[#1A1D21] hover:bg-[#252A30] border-4 border-white/10 text-white text-sm font-bold rounded-none transition-all duration-200">
              Gerenciar Plataforma
            </button>
          </div>
        </div>

        {/* Card 3: Live Commerce */}
        <div className="bg-[#111315]/80 backdrop-blur-md border-4 border-white/10 rounded-none p-6 flex flex-col justify-between shadow-lg hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(0,255,0,0.1)] hover:border-[#00FF00]/30 transition-all duration-500 animate-in slide-in-from-bottom-8 fade-in delay-300">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
              <h3 className="text-white text-lg font-black">Live Commerce</h3>
            </div>
            <p className="text-gray-400 text-sm mb-4">Estratégia de vendas dinâmicas e interativas</p>
            <p className="text-gray-300 text-sm mb-6 leading-relaxed">
              Estruturação de transmissões ao vivo com foco em alta conversão e engajamento, utilizando plataformas de mídia...
            </p>
          </div>
          
          <div>
            <div className="flex justify-between text-xs text-gray-400 mb-2">
              <span>Progresso</span>
              <span>0% Iniciado</span>
            </div>
            <div className="w-full bg-gray-800 rounded-none h-1.5 mb-6">
              <div className="bg-pink-500 h-1.5 rounded-none" style={{ width: "0%" }}></div>
            </div>
            {/* Botão Padronizado */}
            <button className="w-full py-3 px-4 bg-[#1A1D21] hover:bg-[#252A30] border-4 border-white/10 text-white text-sm font-bold rounded-none transition-all duration-200">
              Agendar Primeira Live
            </button>
          </div>
        </div>

      </div>
          </div>
        )}

        {activeTab === "estrategia" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col gap-6 lg:gap-8">
            


            <section className="flex flex-col gap-6">
              {/* NOVA LINHA 5: DETALHAMENTO DE PÚBLICO E GEOLOCALIZAÇÃO */}
           {/* Primeira Linha (Ocupa 3 colunas) - Perfil de Público e Focos */}
           <div className="md:col-span-3 bg-[#111111] border-4 border-white/10 rounded-none p-6 flex flex-col lg:flex-row gap-6 lg:items-start justify-between relative z-20">
             
             {/* Esquerda: Geração e Classe */}
             <div className="flex flex-col gap-3 lg:w-[350px] shrink-0 relative">
                <h4 className="text-[#CCFF00] text-xl md:text-2xl font-black uppercase tracking-tighter flex items-center gap-2 mb-1">
                  <Asterisk className="w-4 h-4" /> Perfil de Público
                </h4>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => setActiveGeneration(activeGeneration === 'Z' ? null : 'Z')}
                    className={`flex-1 whitespace-nowrap text-sm uppercase font-black px-2 py-2 border-2 rounded-none transition-colors ${
                      activeGeneration === 'Z' ? 'bg-[#CCFF00] text-black border-[#CCFF00]' : 'bg-white/10 text-white border-white/20 hover:border-white/40'
                    }`}>Geração Z</button>
                  <button 
                    onClick={() => setActiveGeneration(activeGeneration === 'X' ? null : 'X')}
                    className={`flex-1 whitespace-nowrap text-sm uppercase font-black px-2 py-2 border-2 rounded-none transition-colors ${
                      activeGeneration === 'X' ? 'bg-[#CCFF00] text-black border-[#CCFF00]' : 'bg-white/10 text-white border-white/20 hover:border-white/40'
                    }`}>Geração X</button>
                  <button 
                    onClick={() => setActiveGeneration(activeGeneration === 'M' ? null : 'M')}
                    className={`flex-1 whitespace-nowrap text-sm uppercase font-black px-2 py-2 border-2 rounded-none transition-colors ${
                      activeGeneration === 'M' ? 'bg-[#CCFF00] text-black border-[#CCFF00]' : 'bg-white/10 text-white border-white/20 hover:border-white/40'
                    }`}>Millennials</button>
                </div>

                {activeGeneration && (
                  <div className="absolute top-[85px] left-0 z-50 w-[105%] bg-[#111111] border-2 border-[#CCFF00] p-5 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                    {activeGeneration === 'Z' && (
                      <>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[#CCFF00] font-black uppercase text-sm tracking-widest">Geração Z</span>
                          <span className="text-white text-[11px] font-bold bg-white/10 px-2 py-1">~9 a 24 ANOS</span>
                        </div>
                        <p className="text-gray-300 text-sm font-medium leading-relaxed">
                          Ex: A Ayla. Eles influenciam e decidem o que os pais compram (daqui a pouco já vai querer maquiagem, tecnologia).
                        </p>
                      </>
                    )}
                    {activeGeneration === 'X' && (
                      <>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[#CCFF00] font-black uppercase text-sm tracking-widest">Geração X</span>
                          <span className="text-white text-[11px] font-bold bg-white/10 px-2 py-1">~41 a 59 ANOS</span>
                        </div>
                        <p className="text-gray-300 text-sm font-medium leading-relaxed">
                          A sua geração. É a galera que tem mais dinheiro, porém as propagandas atuais não sabem conversar com o público mais velho.
                        </p>
                      </>
                    )}
                    {activeGeneration === 'M' && (
                      <>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[#CCFF00] font-black uppercase text-sm tracking-widest">Millennials</span>
                          <span className="text-white text-[11px] font-bold bg-white/10 px-2 py-1">~25 a 40 ANOS</span>
                        </div>
                        <p className="text-gray-300 text-sm font-medium leading-relaxed">
                          Pessoas que estão se estabelecendo em suas carreiras agora, comprando imóveis, móveis e construindo família.
                        </p>
                      </>
                    )}
                  </div>
                )}

                <div className="flex flex-row items-center gap-2 mt-2 w-full">
                  <span className="flex-1 text-center border border-[#CCFF00]/40 text-[#CCFF00] text-[11px] uppercase font-black px-2 py-2 rounded-none whitespace-nowrap tracking-tight">
                    Classe Social: Média Alta
                  </span>
                  <span className="flex-1 text-center border border-[#00FFFF]/40 text-[#00FFFF] text-[11px] uppercase font-black px-2 py-2 rounded-none whitespace-nowrap tracking-tight">
                    Foco: Produtos Curva A
                  </span>
                </div>
             </div>

             {/* Centro-Esquerda: Outros Segmentos */}
             <div className="flex-1 border-l-4 border-white/10 pl-5 lg:pl-7 max-w-[220px]">
               <h4 className="text-[#CCFF00] text-lg font-black uppercase tracking-tighter mb-3 leading-tight">
                 Segmentos &<br/>Estratégia
               </h4>
               <div className="flex flex-col gap-2">
                 <p className="text-white/80 text-[11px] leading-tight font-bold">
                   <strong className="text-white">Residências:</strong> Alto padrão.
                 </p>
                 <p className="text-white/80 text-[11px] leading-tight font-bold">
                   <strong className="text-white">Condomínios de Prédios:</strong> Foco em síndicos.
                 </p>
                 <p className="text-white/80 text-[11px] leading-tight font-bold">
                   <strong className="text-white">Escritórios (Centros):</strong> Contato rápido e direto.
                 </p>
                 <p className="text-white/80 text-[11px] leading-tight font-bold">
                   <strong className="text-white">Clínicas:</strong> Em análise.
                 </p>
               </div>
             </div>

             {/* Meio: Bairros Santo André */}
             <div className="flex-1 border-l-4 border-white/10 pl-5 lg:pl-7 max-w-[220px]">
               <h4 className="text-white/60 text-lg font-black uppercase tracking-tighter mb-3 leading-tight">
                 Santo André<br/>(Bairros Nobres)
               </h4>
               <p className="text-white/80 text-xs leading-relaxed font-bold">
                 Jardim • Campestre • Vila Bastos • Vila Assunção • Vila Gilda • Valparaíso • Vila Alpina
               </p>
             </div>

             {/* Centro-Direita: Bairros SBC */}
             <div className="flex-1 border-l-4 border-white/10 pl-5 lg:pl-7 max-w-[220px]">
               <h4 className="text-white/60 text-lg font-black uppercase tracking-tighter mb-3 leading-tight">
                 São Bernardo<br/>do Campo
               </h4>
               <p className="text-white/80 text-xs leading-relaxed font-bold">
                 Jardim do Mar • Nova Petrópolis • Parque dos Pássaros • Jardim Chácara Inglesa • Rudge Ramos • Centro • Vila Euclides
               </p>
             </div>

             {/* Direita: Foco Grande SP */}
             <div className="flex-none border-l-4 border-[#CCFF00] pl-5 lg:pl-7 flex flex-col justify-center">
               <h2 className="text-[#CCFF00] text-5xl lg:text-[3.5rem] font-black uppercase tracking-tighter leading-[0.85]">
                 FOCO<br />GRANDE<br />SP
               </h2>
             </div>
           </div>

           {/* NOVA LINHA 5.5: VISÃO DE MERCADO E EXPANSÃO (Ocupa 3 colunas) */}
           <div className="md:col-span-3 bg-[#050505] border-4 border-white/10 rounded-none p-6 lg:p-8 flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between">
             
             {/* Textos Explicativos */}
             <div className="flex-1 lg:max-w-xl">
               <h3 className="text-white text-2xl md:text-3xl font-black uppercase tracking-tighter mb-4 flex items-center gap-2">
                 O Tamanho do <span className="text-[#CCFF00]">Mercado</span>
               </h3>
               <div className="space-y-4">
                 <p className="text-white/80 text-xs md:text-sm leading-relaxed font-medium">
                   <strong className="text-[#CCFF00]">Marketplace Nacional:</strong> O setor de marketplaces no Brasil é a infraestrutura central do varejo digital, registrando um faturamento de <strong className="text-white">R$ 204,3 bilhões no último ano</strong>. Nossa operação foi estruturada matematicamente para processar e escalar vendas dentro desse ecossistema, garantindo eficiência logística e alta taxa de conversão.
                 </p>

                 <div className="flex flex-col gap-3">
                   {/* Toggles */}
                   <div className="flex flex-wrap gap-2">
                     <button 
                       onClick={() => setActiveMarketVision("farma")}
                       className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest border-2 transition-colors ${
                         activeMarketVision === "farma" ? "bg-[#00FFFF] text-black border-[#00FFFF]" : "bg-transparent text-white/50 border-white/20 hover:text-white"
                       }`}
                     >
                       O Múltiplo Alcance
                     </button>
                     <button 
                       onClick={() => setActiveMarketVision("atendimento")}
                       className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest border-2 transition-colors ${
                         activeMarketVision === "atendimento" ? "bg-[#00FFFF] text-black border-[#00FFFF]" : "bg-transparent text-white/50 border-white/20 hover:text-white"
                       }`}
                     >
                       <MessageCircle className="w-3.5 h-3.5" /> Atendimento "Abrasileirado"
                     </button>
                   </div>

                   {/* Conteúdo Expansivo */}
                   <div className="min-h-[72px]">
                     {activeMarketVision === "farma" ? (
                       <p className="text-white/80 text-xs md:text-sm leading-relaxed font-medium animate-in fade-in zoom-in-95 duration-200">
                         O mercado farmacêutico alcançou <strong className="text-white">R$ 160,7 bilhões anuais</strong> (com o digital superando R$ 20 bi), e vai muito além dos remédios. Nossa máquina já possui altíssima tração e previsibilidade em <strong className="text-white">cosméticos elitizados</strong> e <strong className="text-white">fraldas</strong>. O objetivo estratégico é acoplar essa recorrência diária à nossa operação, dominando toda a esteira de saúde, higiene e beleza.
                       </p>
                     ) : (
                       <p className="text-white/80 text-xs md:text-sm leading-relaxed font-medium animate-in fade-in zoom-in-95 duration-200">
                         Nosso grande diferencial será o <strong className="text-white">Farmacêutico Online</strong>. Um atendimento humano, caloroso e ágil, focado na indicação de medicamentos sem receita — ou no atendimento rápido para quem já possui a prescrição. Isso gera uma consolidação e fidelização brutal de clientes que as redes tradicionais frias não entregam.
                       </p>
                     )}
                   </div>
                 </div>
               </div>
             </div>

             {/* Indicadores Visuais */}
             <div className="flex flex-col sm:flex-row gap-6 lg:gap-12 shrink-0">
               {/* Bloco 1: Marketplace */}
               <div className="border-l-4 border-[#CCFF00] pl-5 flex flex-col justify-center">
                 <span className="text-white/50 text-[10px] font-black uppercase tracking-widest mb-1">Marketplace Brasil</span>
                 <span className="text-[#CCFF00] text-4xl lg:text-5xl font-black tracking-tighter leading-none mb-1">R$ 204 BI</span>
                 <span className="text-white/80 text-[10px] uppercase font-bold tracking-widest">Faturamento Anual</span>
               </div>
               
               {/* Bloco 2: Farmácia */}
               <div className="border-l-4 border-[#00FFFF] pl-5 flex flex-col justify-center">
                 <span className="text-white/50 text-[10px] font-black uppercase tracking-widest mb-1">Setor Farmacêutico</span>
                 <span className="text-[#00FFFF] text-4xl lg:text-5xl font-black tracking-tighter leading-none mb-1">R$ 160 BI</span>
                 <span className="text-white/80 text-[10px] uppercase font-bold tracking-widest">Volume de Mercado</span>
               </div>
             </div>
           </div>

           {/* LINHA 6 - COLUNAS 1 E 2: Manifesto & Estratégia B2B */}
           <div className="md:col-span-2 bg-[#111111] border-4 border-white/10 rounded-none p-5 lg:p-6 flex flex-col justify-center relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <Asterisk className="w-32 h-32 text-[#CCFF00] -rotate-12" strokeWidth={1} />
              </div>
              
              <div className="relative z-10 flex flex-col gap-4 lg:max-w-[90%]">
                <p className="text-white text-sm md:text-base leading-relaxed font-bold">
                  Criado por brasileiros para brasileiros. Somos uma plataforma <span className="bg-[#CCFF00] text-black px-1 uppercase tracking-tight font-black">B2C e B2B</span>, buscando ser um marketplace focado na <strong className="text-white">Curva A</strong> dos produtos, mirando sempre no ticket médio mais alto. 
                </p>
                
                <div className="bg-white/5 border border-white/10 p-4">
                  <span className="text-[#CCFF00] text-[10px] uppercase font-black tracking-widest block mb-1">A Força B2B (Corporate)</span>
                  <p className="text-white/90 text-sm md:text-base leading-relaxed font-bold">
                    Nosso alvo ativo inclui <strong className="text-white">escritórios, clínicas e empresas</strong>. Ambientes que precisam de abastecimento e produtos de forma <strong className="text-[#CCFF00]">recorrente</strong>. Resolvemos a dor do suprimento deles e garantimos uma média de lucro muito superior e previsível para a nossa operação.
                  </p>
                </div>

                <div className="border-l-2 border-white/20 pl-4 py-0.5">
                  <p className="text-white/60 text-sm md:text-base leading-relaxed font-medium italic">
                    "As referências sempre são as grandes dominantes, mas não competimos diretamente. Não encontrou o seu produto no nosso site? Compre no Mercado Livre, receba seu pedido no mesmo dia."
                  </p>
                </div>
              </div>
           </div>

           {/* LINHA 6 - COLUNA 3: Futuro & Experiência */}
           <div className="md:col-span-1 bg-[#CCFF00] rounded-none p-6 lg:p-8 flex flex-col justify-center relative overflow-hidden group border-4 border-black">
              <h4 className="text-black text-2xl lg:text-3xl font-black uppercase tracking-widest flex items-center gap-2 mb-6">
                <HeartHandshake className="w-5 h-5" /> Futuro & Experiência
              </h4>
              <div className="space-y-5">
                {/* Distribuidores */}
                <div>
                  <span className="text-black/60 text-[10px] font-black uppercase tracking-widest block mb-1">Estratégia de Fabricantes</span>
                  <div className="text-black text-xs lg:text-sm font-medium leading-relaxed space-y-2 mt-2">
                    <p>
                      <strong className="font-black">1. A Isca Logística:</strong> Cobramos uma margem mínima inicial para oferecer entrega no mesmo dia, atraindo o estoque do fabricante para nossa base.
                    </p>
                    <p>
                      <strong className="font-black">2. Validação & Domínio:</strong> Testamos o produto no mercado com risco zero. Com a demanda validada, renegociamos uma margem agressiva ou importamos o mesmo produto diretamente da China, assumindo todo o lucro.
                    </p>
                  </div>
                </div>
                
                <div className="h-[2px] w-full bg-black/10" />

                {/* Cliente Final */}
                <div>
                  <span className="text-black/60 text-[10px] font-black uppercase tracking-widest block mb-1">A Experiência do Consumidor</span>
                  <div className="text-black text-xs lg:text-sm font-medium leading-relaxed space-y-2 mt-2">
                    <p>
                      <strong className="font-black">1. Unboxing VIP:</strong> Entrega em mãos via motoboy com embalagens preparadas, garantindo uma experiência premium (ex: recebendo um iPhone).
                    </p>
                    <p>
                      <strong className="font-black">2. Solução Completa:</strong> Não vendemos só o produto. Vendemos o fogão, a mangueira e a instalação no mesmo carrinho. Resolvemos 100% do problema.
                    </p>
                    <p>
                      <strong className="font-black">3. Fricção Zero:</strong> Processo de devolução e troca impecável e sem burocracia, sem que o cliente precise sair de casa.
                    </p>
                    <p>
                      <strong className="font-black">4. Visão de Futuro:</strong> Venderemos o celular, a película, a assistência técnica e o seguro na mesma jornada. Um ecossistema absolutamente completo.
                    </p>
                  </div>
                </div>
              </div>
           </div>

          {/* LINHA 7 - FULL WIDTH: O Motor de Marketing, Influência e Lives */}
          <div className="md:col-span-3 row-span-2 bg-[#111111] border-4 border-[#CCFF00] rounded-none p-6 lg:p-8 flex flex-col relative overflow-hidden group">
             <div className="absolute -top-24 -right-24 h-64 w-64 rounded-none bg-[#CCFF00]/5 hidden pointer-events-none" />
             <h4 className="text-[#CCFF00] text-xl lg:text-3xl font-black uppercase tracking-widest flex items-center gap-2 mb-6 relative z-10">
               <Sparkles className="w-4 h-4" /> Playbook de Marca & Influência (Padrão Shopee/ML)
             </h4>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 relative z-10">
               
               {/* Coluna A: O Programa de Influenciadores */}
               <div className="space-y-4">
                 <h5 className="text-[#CCFF00] text-xl md:text-2xl font-black flex items-center gap-2 uppercase tracking-tighter">
                   <span className="w-4 h-4 rounded-none bg-[#CCFF00] mr-2" /> 1. O Exército do ABC
                 </h5>
                 <p className="text-white/70 text-xs leading-relaxed">
                   <strong>Perfil:</strong> 4 blogueiras com alto engajamento + 1 profissional técnico para produtos sérios. Precisam ser da região do ABC e ter fit com nossos produtos.
                 </p>
                 <p className="text-white/70 text-xs leading-relaxed">
                   <strong>Acordo e Entregáveis:</strong> Cache de R$ 100 + comissão por venda (cupom/link). Recebem 5 produtos em uma <i>Caixa Personalizada RAMA</i>. Em troca, entregam 3 vídeos diferentes por produto.
                 </p>
                 <p className="text-white/70 text-xs leading-relaxed">
                   <strong>Gestão (O Funil):</strong> Todos recebem um Script Guia. Controle estrito de prazos: quando foi pago, quando chega o produto, dias das postagens e Collabs.
                 </p>
               </div>

               {/* Coluna B: Conteúdo e Live Commerce */}
               <div className="space-y-4">
                 <h5 className="text-[#CCFF00] text-xl md:text-2xl font-black flex items-center gap-2 uppercase tracking-tighter">
                   <span className="w-4 h-4 rounded-none bg-[#CCFF00] mr-2" /> 2. Formatos e Lives
                 </h5>
                 <p className="text-white/70 text-xs leading-relaxed">
                   <strong>A Máquina de Vídeos:</strong> O conteúdo dos influencers retroalimentará nosso TikTok e Instagram. 
                 </p>
                 <p className="text-white/70 text-xs leading-relaxed">
                   <strong>Mini-filmes e Estilo de Vida:</strong> Vídeos de conversação (ex: estilo David Ludolf) sem venda forçada. Termina com: <i>"Gostou? Link na bio."</i>
                 </p>
                 <p className="text-white/70 text-xs leading-relaxed">
                   <strong>Live Commerce:</strong> Apresentador fixo guiado por roteiro (Sábados/Domingos). O cenário é real: fundo com o estoque físico ou área de embalagem rolando ao vivo para gerar autoridade.
                 </p>
               </div>

               {/* Coluna C: Personas e a Grande Promessa */}
               <div className="space-y-4">
                 <h5 className="text-[#CCFF00] text-xl md:text-2xl font-black flex items-center gap-2 uppercase tracking-tighter">
                   <span className="w-4 h-4 rounded-none bg-[#CCFF00] mr-2" /> 3. Personas & Promessa
                 </h5>
                 <p className="text-white/70 text-xs leading-relaxed">
                   <strong>As Faces da Marca:</strong> Para o público mais velho e tradicional (Facebook), o rosto do <strong>Rogério</strong> (passa credibilidade e confiança). Para o público jovem, um novo comunicador ágil.
                 </p>
                 <p className="text-[#CCFF00] text-xs font-bold leading-relaxed mt-4 p-3 bg-white/5 rounded-none border border-[#CCFF00]/20">
                   A Promessa Inquebrável:<br/>
                   <span className="text-white font-bold">O influencer divulga, o cliente compra. A RAMA entrega os produtos Curva A no mesmo dia (Prazo de 1 dia) em todo o ABC.</span>
                 </p>
               </div>

             </div>
          </div>

          {/* LINHA 8 - FULL WIDTH: Operação, Nuvemshop & Whats Marketplace */}
          <div className="md:col-span-3 bg-[#F4F4F0] border border-[#000000]/10 rounded-none p-6 lg:p-8 flex flex-col relative group">
             <h4 className="text-black text-[10px] lg:text-xs font-bold uppercase tracking-widest flex items-center gap-2 mb-6">
               <HeartHandshake className="w-4 h-4" /> Operação: Nuvemshop & Whats Marketplace
             </h4>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {/* Coluna 1: O Whats Marketplace */}
               <div className="space-y-3">
                 <h5 className="text-black text-sm font-bold">O Whats Marketplace</h5>
                 <p className="text-black/80 text-xs leading-relaxed">
                   <strong>Onde o brasileiro está:</strong> Teremos a base na Nuvemshop, mas a operação vai fluir 100% pelo WhatsApp. Tudo altamente personalizável para cada cliente.
                 </p>
                 <p className="text-black/80 text-xs leading-relaxed">
                   Início regional focado na grande São Paulo e ABC, usando a proximidade como nossa maior arma.
                 </p>
               </div>

               {/* Coluna 2: Tecnologia + Humanização */}
               <div className="space-y-3">
                 <h5 className="text-black text-sm font-bold">Tecnologia Humanizada</h5>
                 <p className="text-black/80 text-xs leading-relaxed">
                   <strong>Copiloto de IA + Toque Humano:</strong> A Inteligência Artificial lê o cliente e já gera a resposta perfeita (adaptando o linguajar para criar conexão e respeito). O atendente humano apenas revisa, dá o 'OK' e envia.
                 </p>
                 <p className="text-black/80 text-xs leading-relaxed">
                   <strong>Escala Absoluta:</strong> Com esse sistema, um único atendente gerencia múltiplas conversas simultâneas com agilidade extrema, sem nunca perder o calor humano. Faremos marketing forte em cima disso.
                 </p>
               </div>

               {/* Coluna 3: A Oferta & Instalação */}
               <div className="space-y-3">
                 <h5 className="text-black text-sm font-bold">Oferta & Logística</h5>
                 <p className="text-black/80 text-xs leading-relaxed">
                   <strong>Produtos Curva A:</strong> Começamos forte com a Curva A da RAMA (comissão em cima). 
                 </p>
                 <div className="bg-white p-3 rounded-none border border-[#000000]/5 text-black text-xs leading-relaxed">
                   <strong>Frete Grátis</strong> (já incluído no valor).<br/>
                   <strong>Instalação SP e ABC:</strong> Venda de serviço cruzado (Cross-sell), como oferecer a mangueira instalada junto com o produto.
                 </div>
               </div>
             </div>
          </div>

          
            </section>

          </div>
        )}

        {activeTab === "ecossistema" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col gap-10">
            
            <div className="flex items-center justify-between">
              <h2 className="text-white text-2xl font-black tracking-tight flex items-center gap-3">
                <Network className="w-6 h-6 text-cyan-400" /> Arquitetura do Negócio
              </h2>
              <span className="text-cyan-500 text-xs font-bold uppercase tracking-widest border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 rounded-none">
                Integração Macro
              </span>
            </div>

            {/* Grid Principal do Ecossistema */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
              
              {/* Conector Visual no Desktop */}
              <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1px] h-3/4 bg-gradient-to-b from-transparent via-white/10 to-transparent" />

              {/* Coluna Esquerda: Front-End & Aquisição */}
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-[1px] w-8 bg-cyan-500" />
                  <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Client-Facing (Aquisição)</span>
                </div>

                {/* Card: Criação de Marca & Marketing */}
                <div className="bg-gradient-to-br from-[#111111] to-[#0a0a0a] border-4 border-white/10 rounded-none p-6 group hover:border-pink-500/30 transition-all shadow-lg relative overflow-hidden">
                  <Fingerprint className="absolute -right-2 -bottom-2 w-24 h-24 text-pink-500/5 group-hover:text-pink-500/10 transition-colors" />
                  <div className="flex items-center gap-3 mb-4 relative z-10">
                    <div className="p-2 rounded-none bg-pink-500/10 border border-pink-500/20 text-pink-400">
                      <Paintbrush className="w-5 h-5" />
                    </div>
                    <h3 className="text-white font-bold text-lg">Marketing & O Exército do ABC</h3>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed font-black mb-4 relative z-10">
                    Nossa máquina de influência regional. Conteúdo em vídeo retroalimentando o TikTok/IG, Lives Commerce semanais focadas em alta conversão e pessoas reais ancorando a confiança da marca.
                  </p>
                  <div className="flex flex-wrap gap-2 relative z-10">
                    <span className="bg-white/5 text-gray-300 text-[10px] uppercase font-bold px-2 py-1 rounded-md">Exército do ABC</span>
                    <span className="bg-white/5 text-gray-300 text-[10px] uppercase font-bold px-2 py-1 rounded-md">Live Commerce</span>
                    <span className="bg-white/5 text-gray-300 text-[10px] uppercase font-bold px-2 py-1 rounded-md">Conteúdo Viral</span>
                  </div>
                </div>

                {/* Card: Marketplaces */}
                <div className="bg-gradient-to-br from-[#111111] to-[#0a0a0a] border-4 border-white/10 rounded-none p-6 group hover:border-yellow-500/30 transition-all shadow-lg relative overflow-hidden">
                  <ShoppingBag className="absolute -right-2 -bottom-2 w-24 h-24 text-yellow-500/5 group-hover:text-yellow-500/10 transition-colors" />
                  <div className="flex items-center gap-3 mb-4 relative z-10">
                    <div className="p-2 rounded-none bg-yellow-500/10 border border-yellow-500/20 text-yellow-400">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                    <h3 className="text-white font-bold text-lg">Ecossistema de Marketplaces</h3>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed font-black mb-4 relative z-10">
                    Nosso principal motor de volume. Múltiplas contas gerenciadas estrategicamente com foco agressivo em precificação, Ads e um catálogo de produtos Curva A de alta demanda.
                  </p>
                  <div className="flex flex-wrap gap-2 relative z-10">
                    <span className="bg-[#FFE600]/10 border border-[#FFE600]/20 text-[#FFE600] text-[10px] uppercase font-bold px-2 py-1 rounded-md">Mercado Livre (Principal & Loja 2)</span>
                    <span className="bg-[#EE4D2D]/10 border border-[#EE4D2D]/20 text-[#EE4D2D] text-[10px] uppercase font-bold px-2 py-1 rounded-md">Shopee</span>
                    <span className="bg-[#FF9900]/10 border border-[#FF9900]/20 text-[#FF9900] text-[10px] uppercase font-bold px-2 py-1 rounded-md">Amazon</span>
                  </div>
                </div>

                {/* Card: Site / E-commerce Próprio */}
                <div className="bg-gradient-to-br from-[#111111] to-[#0a0a0a] border-4 border-white/10 rounded-none p-6 group hover:border-blue-500/30 transition-all shadow-lg relative overflow-hidden">
                  <Globe className="absolute -right-2 -bottom-2 w-24 h-24 text-blue-500/5 group-hover:text-blue-500/10 transition-colors" />
                  <div className="flex items-center gap-3 mb-4 relative z-10">
                    <div className="p-2 rounded-none bg-blue-500/10 border border-blue-500/20 text-blue-400">
                      <Globe className="w-5 h-5" />
                    </div>
                    <h3 className="text-white font-bold text-lg">Nuvemshop & Whats Marketplace</h3>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed font-black mb-4 relative z-10">
                    O canal para o público brasileiro: operação via WhatsApp. Copiloto de Inteligência Artificial para escala de atendimento humanizado e oferta de venda cruzada de produtos + serviços de instalação.
                  </p>
                  <div className="flex flex-wrap gap-2 relative z-10">
                    <span className="bg-white/5 text-gray-300 text-[10px] uppercase font-bold px-2 py-1 rounded-md">Copiloto IA</span>
                    <span className="bg-white/5 text-gray-300 text-[10px] uppercase font-bold px-2 py-1 rounded-md">Atendimento Humanizado</span>
                    <span className="bg-white/5 text-gray-300 text-[10px] uppercase font-bold px-2 py-1 rounded-md">Serviços Cross-sell</span>
                  </div>
                </div>

              </div>

              {/* Coluna Direita: Back-End & Operação */}
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-2 mb-2 justify-end text-right md:flex-row-reverse">
                  <div className="h-[1px] w-8 bg-purple-500" />
                  <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Back-End (Operacional)</span>
                </div>

                {/* Card: Sistema de Pedidos */}
                <div className="bg-gradient-to-br from-[#111111] to-[#0a0a0a] border-4 border-white/10 rounded-none p-6 group hover:border-purple-500/30 transition-all shadow-lg relative overflow-hidden">
                  <Code2 className="absolute -left-2 -bottom-2 w-24 h-24 text-[#CCFF00]/5 group-hover:text-[#CCFF00]/10 transition-colors" />
                  <div className="flex items-center gap-3 mb-4 relative z-10">
                    <div className="p-2 rounded-none bg-purple-500/10 border border-purple-500/20 text-purple-400">
                      <Server className="w-5 h-5" />
                    </div>
                    <h3 className="text-white font-bold text-lg">Hub de Integração & Estoque</h3>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed font-black mb-4 relative z-10">
                    O cérebro que captura vendas de todos os canais simultaneamente. Sincronização de estoque multicanal (Hub/Bling), emissão de NF-e automatizada e roteirização inteligente.
                  </p>
                  <div className="flex flex-wrap gap-2 relative z-10">
                    <span className="bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] uppercase font-bold px-2 py-1 rounded-md">Hub Multicanal</span>
                    <span className="bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] uppercase font-bold px-2 py-1 rounded-md">Emissor NF-e</span>
                  </div>
                </div>

                {/* Card: Sistema Interno */}
                <div className="bg-gradient-to-br from-[#111111] to-[#0a0a0a] border-4 border-white/10 rounded-none p-6 group hover:border-emerald-500/30 transition-all shadow-lg relative overflow-hidden">
                  <Cpu className="absolute -left-2 -bottom-2 w-24 h-24 text-emerald-500/5 group-hover:text-emerald-500/10 transition-colors" />
                  <div className="flex items-center gap-3 mb-4 relative z-10">
                    <div className="p-2 rounded-none bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      <Layers className="w-5 h-5" />
                    </div>
                    <h3 className="text-white font-bold text-lg">Cérebro da Operação (Rama System Hub)</h3>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed font-black mb-4 relative z-10">
                    Nosso sistema interno proprietário. Conciliação financeira automatizada, gestão preditiva de suprimentos (Bot de Compras), rastreio de gargalos e dashboard para tomada de decisão.
                  </p>
                  <div className="flex flex-wrap gap-2 relative z-10">
                    <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] uppercase font-bold px-2 py-1 rounded-md">Conciliação Financeira</span>
                    <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] uppercase font-bold px-2 py-1 rounded-md">Bot de Suprimentos</span>
                    <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] uppercase font-bold px-2 py-1 rounded-md">Previsibilidade</span>
                  </div>
                </div>

                {/* Card: Expedição (Rama Flow) */}
                <div className="bg-gradient-to-br from-[#111111] to-[#0a0a0a] border-4 border-white/10 rounded-none p-6 group hover:border-[#00FF00]/30 transition-all shadow-lg relative overflow-hidden">
                  <Box className="absolute -left-2 -bottom-2 w-24 h-24 text-[#CCFF00]/5 group-hover:text-[#CCFF00]/10 transition-colors" />
                  <div className="flex items-center gap-3 mb-4 relative z-10">
                    <div className="p-2 rounded-none bg-[#CCFF00]/10 border border-[#00FF00]/20 text-[#CCFF00]">
                      <Box className="w-5 h-5" />
                    </div>
                    <h3 className="text-white font-bold text-lg">Logística Same-Day (Rama Flow)</h3>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed font-black mb-4 relative z-10">
                    O coração físico do negócio em SP/ABC. Expedição no mesmo dia (Flex), zero erros na separação, redução de custos com embalagens inteligentes e controle anti-fraude.
                  </p>
                  <div className="flex flex-wrap gap-2 relative z-10">
                    <span className="bg-[#CCFF00]/10 border border-[#00FF00]/20 text-[#CCFF00] text-[10px] uppercase font-bold px-2 py-1 rounded-md">Same-Day Delivery</span>
                    <span className="bg-[#CCFF00]/10 border border-[#00FF00]/20 text-[#CCFF00] text-[10px] uppercase font-bold px-2 py-1 rounded-md">Zero Erros</span>
                    <span className="bg-[#CCFF00]/10 border border-[#00FF00]/20 text-[#CCFF00] text-[10px] uppercase font-bold px-2 py-1 rounded-md">Radar Logístico</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

        {activeTab === "app" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col items-center">
            <div className="text-center mb-8">
              <h2 className="text-white text-3xl font-black tracking-tight">O Futuro do E-commerce</h2>
              <p className="text-gray-400 font-black max-w-lg mt-2 mx-auto">
                Simulação da nossa futura plataforma proprietária: uma experiência nativa de compra guiada por 
                vídeos curtos e avaliações reais.
              </p>
            </div>

            {/* Simulação do Celular */}
            <div className="relative w-[340px] h-[720px] bg-black rounded-[3rem] border-[8px] border-[#1A1A1A] shadow-2xl overflow-hidden flex flex-col ring-1 ring-white/10">
              
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#1A1A1A] rounded-b-3xl z-50" />

              {/* Status Bar */}
              <div className="absolute top-0 w-full h-12 flex justify-between items-center px-6 z-40 text-white text-[10px] font-bold pt-2">
                <span>9:41</span>
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-none border-4 border-white/100" />
                  <div className="w-3 h-3 rounded-none border-4 border-white/100" />
                  <div className="w-4 h-3 bg-white/80 rounded-[2px]" />
                </div>
              </div>

              {/* Feed de Vídeo (TikTok Style) */}
              <div className="relative flex-1 bg-[#111111] overflow-hidden group cursor-pointer">
                
                {/* Vídeo / Imagem de Fundo Simulando o Feed */}
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540569014015-19a7be504e3a?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-60 mix-blend-luminosity" />
                
                {/* Gradientes para Leitura */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90" />

                {/* Overlays do Feed */}
                <div className="absolute bottom-0 left-0 w-full p-4 pb-20 flex justify-between items-end">
                  
                  {/* Info do Produto (Esquerda) */}
                  <div className="flex-1 pr-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-none bg-indigo-500 flex items-center justify-center text-white font-bold text-xs shadow-lg">
                        RF
                      </div>
                      <span className="text-white font-bold text-sm drop-shadow-md">@ramaflow</span>
                      <span className="bg-white/20 text-white text-[9px] px-1.5 py-0.5 rounded-sm backdrop-blur-sm">Patrocinado</span>
                    </div>
                    <p className="text-white text-sm font-black mb-3 drop-shadow-md line-clamp-2">
                      Testei o Kit de Instalação de Gás com Válvula de Segurança da Rama Flow. Olha a facilidade e a economia! 🔥🛠️
                    </p>
                    
                    {/* Card do Produto Linkado */}
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-none p-3 flex gap-3 items-center cursor-pointer hover:bg-white/20 transition-colors shadow-lg">
                      <div className="w-12 h-12 bg-[#111111] rounded-none flex items-center justify-center border-4 border-white/10">
                        <Box className="text-[#CCFF00] w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white text-xs font-bold leading-tight">Kit Mangueira + Registro</h4>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-[#CCFF00] font-bold text-sm">R$ 89,90</span>
                          <span className="text-gray-400 text-[10px] line-through">R$ 120</span>
                        </div>
                      </div>
                      <div className="bg-[#CCFF00] text-black w-8 h-8 rounded-none flex items-center justify-center shadow-[0_0_10px_rgba(0,255,0,0.4)]">
                        <ShoppingCart className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Interações (Direita) */}
                  <div className="flex flex-col items-center gap-4 pb-4">
                    <div className="flex flex-col items-center gap-1 group/btn">
                      <div className="w-10 h-10 rounded-none bg-[#111111] backdrop-blur-md flex items-center justify-center border-4 border-white/10 group-hover/btn:bg-white/20 transition-colors shadow-lg">
                        <Heart className="w-5 h-5 text-white" fill="white" />
                      </div>
                      <span className="text-white text-[10px] font-bold drop-shadow-md">12.4k</span>
                    </div>
                    
                    <div className="flex flex-col items-center gap-1 group/btn">
                      <div className="w-10 h-10 rounded-none bg-[#111111] backdrop-blur-md flex items-center justify-center border-4 border-white/10 group-hover/btn:bg-white/20 transition-colors shadow-lg">
                        <MessageCircle className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-white text-[10px] font-bold drop-shadow-md">842</span>
                    </div>

                    <div className="flex flex-col items-center gap-1 group/btn">
                      <div className="w-10 h-10 rounded-none bg-[#111111] backdrop-blur-md flex items-center justify-center border-4 border-white/10 group-hover/btn:bg-white/20 transition-colors shadow-lg">
                        <Share2 className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-white text-[10px] font-bold drop-shadow-md">2k</span>
                    </div>
                  </div>

                </div>

                {/* Reviews Overlay Flutuante (Simulando comentários pulando na tela) */}
                <div className="absolute top-1/4 left-4 right-16 space-y-3 pointer-events-none opacity-90">
                   <div className="bg-black/60 backdrop-blur-md p-2.5 rounded-none border-4 border-white/10 w-fit animate-pulse shadow-lg">
                     <span className="text-white text-[10px] font-bold block mb-0.5">João M.</span>
                     <p className="text-gray-200 text-xs font-black">Produto top! Chegou no mesmo dia. 🙌</p>
                   </div>
                   <div className="bg-black/60 backdrop-blur-md p-2.5 rounded-none border-4 border-white/10 w-fit ml-8 animate-pulse delay-150 shadow-lg">
                     <span className="text-white text-[10px] font-bold block mb-0.5">Marcia T.</span>
                     <p className="text-gray-200 text-xs font-black">Excelente, técnico super educado!</p>
                   </div>
                </div>

              </div>

              {/* Barra de Navegação Inferior (App) */}
              <div className="h-16 bg-[#111111] border-t border-white/10 flex justify-around items-center px-2 z-40 relative">
                <div className="flex flex-col items-center gap-1 text-gray-500 cursor-pointer hover:text-white transition-colors">
                  <Home className="w-5 h-5" />
                  <span className="text-[8px] font-bold uppercase tracking-wider">Início</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-gray-500 cursor-pointer hover:text-white transition-colors">
                  <Search className="w-5 h-5" />
                  <span className="text-[8px] font-bold uppercase tracking-wider">Buscar</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-[#CCFF00] cursor-pointer -mt-4">
                  <div className="w-12 h-10 rounded-none bg-white flex items-center justify-center relative shadow-[0_0_20px_rgba(255,255,255,0.4)]">
                    <div className="absolute -left-1 w-1 h-4 bg-[#CCFF00] rounded-l-sm" />
                    <div className="absolute -right-1 w-1 h-4 bg-red-500 rounded-r-sm" />
                    <Play className="w-5 h-5 text-black ml-0.5" fill="black" />
                  </div>
                </div>
                <div className="flex flex-col items-center gap-1 text-gray-500 cursor-pointer hover:text-white transition-colors relative">
                  <ShoppingCart className="w-5 h-5" />
                  <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#CCFF00] rounded-none border-2 border-[#111]" />
                  <span className="text-[8px] font-bold uppercase tracking-wider">Carrinho</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-gray-500 cursor-pointer hover:text-white transition-colors">
                  <User className="w-5 h-5" />
                  <span className="text-[8px] font-bold uppercase tracking-wider">Perfil</span>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
