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
  const [activeD2CTab, setActiveD2CTab] = useState<"video" | "store">("video");

  return (
    <div className="flex-1 w-full min-h-screen relative flex flex-col font-sans overflow-y-auto overflow-x-hidden custom-scrollbar bg-[#050505] selection:bg-[#CCFF00] selection:text-black pb-0">
      
      {/* Glow de Fundo Estático */}
      <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-gradient-to-br  to-transparent rounded-none blur-[120px] pointer-events-none -translate-y-1/2  transition-all duration-1000" />
      
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
      <div className="flex flex-col space-y-3">
        <div className="flex items-center gap-4">
          <Target className="h-10 w-10 text-[#CCFF00] drop-shadow-[0_0_10px_rgba(0,255,0,0.3)]" />
          <h2 className="text-5xl lg:text-7xl font-black tracking-tighter uppercase text-white leading-none">Estratégia e Crescimento</h2>
        </div>
        <p className="text-gray-400 text-sm font-bold max-w-3xl leading-relaxed">
          Acompanhe nossos objetivos estratégicos de expansão omnichannel e crescimento escalável. 
          Nossa meta é a excelência operacional, estabelecendo um padrão de mercado equivalente ao das maiores plataformas do setor.
        </p>
      </div>

                    {/* Seção 1: Resumo Executivo Brutalista */}
            <section className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-4 border-white/20 shadow-2xl">
                
                {/* Card 1: VISÃO */}
                <div className="bg-[#CCFF00] p-6 lg:p-8 relative overflow-hidden group border-b-4 md:border-b-0 md:border-r-4 border-white/20 flex flex-col justify-start">
                  <div className="absolute -right-4 -bottom-10 text-[14rem] font-black text-black/10 leading-none pointer-events-none transition-transform duration-700 group-hover:scale-110">
                    1
                  </div>
                  <div>
                    <h3 className="text-black font-black uppercase tracking-tighter text-3xl lg:text-4xl mb-4 relative z-10 flex flex-col">
                      <span className="text-[11px] tracking-[0.4em] opacity-60 mb-2 font-bold">O FUTURO</span>
                      VISÃO
                    </h3>
                    <p className="text-black text-sm leading-relaxed font-bold relative z-10 max-w-[90%]">
                      Tornar-se a potência definitiva no varejo digital de utilidades e ferramentas em SP e ABC. Nosso foco é dominar os marketplaces e nosso ecossistema próprio através de entregas Same-Day (Flex), unindo a venda de produtos de alta demanda à execução de serviços.
                    </p>
                  </div>
                  <div className="mt-6 relative z-10">
                    <div className="w-16 h-1.5 bg-black" />
                  </div>
                </div>
                
                {/* Card 2: MISSÃO */}
                <div className="bg-[#050505] p-6 lg:p-8 relative overflow-hidden group border-b-4 md:border-b-0 md:border-r-4 border-white/20 flex flex-col justify-start">
                  <div className="absolute -right-4 -bottom-10 text-[14rem] font-black text-white/5 leading-none pointer-events-none transition-transform duration-700 group-hover:scale-110">
                    2
                  </div>
                  <div>
                    <h3 className="text-white font-black uppercase tracking-tighter text-3xl lg:text-4xl mb-4 relative z-10 flex flex-col">
                      <span className="text-[#CCFF00] text-[11px] tracking-[0.4em] mb-2 font-bold">O PROPÓSITO</span>
                      MISSÃO
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed font-bold relative z-10 max-w-[90%]">
                      Resolver a dor do cliente de ponta a ponta com agilidade e segurança. Entregamos os melhores produtos e oferecemos a instalação (cross-sell) diretamente na casa do cliente, garantindo uma jornada impecável do WhatsApp à entrega.
                    </p>
                  </div>
                  <div className="mt-6 relative z-10">
                    <div className="w-16 h-1.5 bg-[#CCFF00]" />
                  </div>
                </div>
                
                {/* Card 3: DIFERENCIAL */}
                <div className="bg-[#111111] p-6 lg:p-8 relative overflow-hidden group flex flex-col justify-between">
                  <div className="absolute -right-4 -bottom-10 text-[14rem] font-black text-white/5 leading-none pointer-events-none transition-transform duration-700 group-hover:scale-110">
                    3
                  </div>
                  <div>
                    <h3 className="text-white font-black uppercase tracking-tighter text-3xl lg:text-4xl mb-4 relative z-10 flex flex-col">
                      <span className="text-[11px] tracking-[0.4em] opacity-60 mb-2 font-bold text-[#CCFF00]">A VANTAGEM</span>
                      DIFERENCIAL
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed font-bold relative z-10 max-w-[90%]">
                      Ecossistema 100% integrado: logística própria ultrarrápida (Rama Flow), tecnologia interna de gestão (Rama System), IA humanizada no WhatsApp e Influenciadores locais. Nós não só vendemos, nós instalamos e fidelizamos.
                    </p>
                  </div>
                  <div className="mt-6 relative z-10">
                    <div className="w-16 h-1.5 bg-[#CCFF00]" />
                  </div>
                </div>
                
              </div>
            </section>

            {/* Marketplaces Progress Brutalista */}
      <section className="bg-black border-4 border-white/20 rounded-none flex flex-col justify-between shadow-2xl relative overflow-hidden mb-0">
        
        {/* TOP: Cabeçalho */}
        <div className="p-8 lg:p-10 border-b-4 border-white/20 relative">
          <div className="absolute -right-10 -top-10 text-[10rem] font-black text-white/5 pointer-events-none">
            MKTP
          </div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <h3 className="text-white font-black uppercase tracking-tighter text-3xl md:text-5xl flex items-center gap-4">
              <span className="text-[#CCFF00]">/</span>
              Presença em Marketplaces
            </h3>
            <span className="bg-[#CCFF00] text-black text-xl font-black px-6 py-2 border-4 border-white/20">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <p className="text-gray-400 text-sm font-bold uppercase tracking-[0.3em] relative z-10">
            Expansão Multicanal (Status: {completedCount} de {marketplaces.length})
          </p>
        </div>

        {/* MIDDLE: Metas Próximos Passos */}
        <div className="flex flex-col sm:flex-row border-b-4 border-white/20">
          <div className="flex-1 bg-[#111111] border-r-0 sm:border-r-4 border-b-4 sm:border-b-0 border-white/20 p-4 md:p-5 flex flex-col justify-center">
            <p className="text-[#CCFF00] text-[10px] uppercase tracking-[0.3em] font-bold mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-[#CCFF00] animate-pulse" />
              Meta: Outubro
            </p>
            <p className="text-white font-black uppercase text-2xl tracking-tighter">Site Próprio (D2C)</p>
          </div>
          <div className="flex-1 bg-[#050505] p-4 md:p-5 flex flex-col justify-center relative overflow-hidden group">
            <p className="text-[#CCFF00] text-[10px] uppercase tracking-[0.3em] font-bold mb-2 flex items-center gap-2 relative z-10">
              <span className="w-2 h-2 bg-[#CCFF00] animate-pulse" />
              Meta: Novembro
            </p>
            <p className="text-white font-black uppercase text-2xl tracking-tighter relative z-10">TikTok Shop</p>
          </div>
        </div>
        
        {/* BOTTOM: Progress Bar */}
        <div className="w-full bg-[#111111] h-6 border-b-4 border-white/20 relative">
          <div className="bg-[#CCFF00] h-full" style={{ width: `${progressPercentage}%` }}></div>
        </div>
        
        {/* BOTTOM: Grid de Marketplaces */}
        <div className="grid grid-cols-2 md:grid-cols-3">
            {marketplaces.map((mk, index) => (
              <div key={mk.name} className={`p-4 md:p-5 flex items-center justify-between group ${index < marketplaces.length - 3 ? 'border-b-4 border-white/20' : ''} ${(index + 1) % 3 !== 0 ? 'border-r-4 border-white/20' : ''}`}>
                <div className="flex items-center">
                  {mk.name === 'Mercado Livre' && <span className="bg-[#FFE600] text-black border-2 border-[#FFE600] text-[10px] md:text-xs uppercase font-black px-3 py-1.5">Mercado Livre</span>}
                  {mk.name === 'Shopee' && <span className="bg-[#EE4D2D] text-white border-2 border-[#EE4D2D] text-[10px] md:text-xs uppercase font-black px-3 py-1.5">Shopee</span>}
                  {mk.name === 'Amazon' && <span className="bg-[#FF9900] text-white border-2 border-[#FF9900] text-[10px] md:text-xs uppercase font-black px-3 py-1.5">Amazon</span>}
                  {mk.name === 'Magalu' && <span className="bg-[#0086FF] text-white border-2 border-[#0086FF] text-[10px] md:text-xs uppercase font-black px-3 py-1.5">Magalu</span>}
                  {mk.name === 'TikTok' && <span className="bg-white text-black border-2 border-white text-[10px] md:text-xs uppercase font-black px-3 py-1.5">TikTok Shop</span>}
                  {mk.name.includes('Site Pr') && <span className="bg-[#CCFF00] text-black border-2 border-[#CCFF00] text-[10px] md:text-xs uppercase font-black px-3 py-1.5">Site Próprio</span>}
                </div>
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold">
                  {mk.status === "completed" ? (
                    <span className="text-[#CCFF00]">ATIVO</span>
                  ) : (
                    <span className="text-orange-500">A FAZER</span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </section>
          
        {/* EXPANSÃO GEOGRÁFICA E MICRO-DISTRIBUIÇÃO */}
        <section className="bg-[#111111] border-4 border-white/20 p-6 lg:p-10 shadow-2xl relative overflow-hidden group mt-8">
          <div className="absolute -right-4 -bottom-10 text-[14rem] font-black text-white/5 leading-none pointer-events-none transition-transform duration-700 group-hover:scale-110">
            SUL
          </div>
          <div className="flex flex-col gap-6 relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-4 border-white/20 pb-4">
              <h3 className="text-white font-black uppercase tracking-tighter text-3xl md:text-5xl flex items-center gap-4">
                <span className="text-[#CCFF00]">//</span>
                Expansão Territorial
              </h3>
            </div>
            <p className="text-gray-400 text-sm font-bold uppercase tracking-[0.2em] mb-4">
              Projeto de Escala Nacional via Micro-Distribuição e Contas Regionais
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-4 border-white/20">
              {/* Fase 1: SP/ABC */}
              <div className="bg-[#050505] p-6 border-b-4 md:border-b-0 md:border-r-4 border-white/20 hover:bg-white/5 transition-colors">
                <span className="text-white/50 text-[10px] font-black uppercase tracking-widest mb-2 block">Fase 01 - Operação Atual</span>
                <h4 className="text-white font-black text-2xl uppercase tracking-tighter mb-2">Matriz SP / ABC</h4>
                <p className="text-gray-400 text-xs leading-relaxed font-bold">
                  Consolidação do ecossistema completo. Centro logístico principal, atendimento próprio e foco em entregas hiper-rápidas na região metropolitana.
                </p>
                <div className="mt-4 bg-[#CCFF00]/10 border border-[#CCFF00]/30 text-[#CCFF00] text-[10px] uppercase font-black px-3 py-1.5 inline-block">Dominância Estabelecida</div>
              </div>

              {/* Fase 2: Curitiba / Sul */}
              <div className="bg-[#111111] p-6 border-b-4 md:border-b-0 md:border-r-4 border-white/20 hover:bg-white/5 transition-colors">
                <span className="text-[#CCFF00] text-[10px] font-black uppercase tracking-widest mb-2 block animate-pulse">Fase 02 - Próximo Alvo</span>
                <h4 className="text-white font-black text-2xl uppercase tracking-tighter mb-2">Região Sul (Curitiba)</h4>
                <p className="text-white text-xs leading-relaxed font-bold">
                  Segunda conta estadual com <strong>parceiro operador local</strong> que cuida de toda a logística. A RAMA atua como distribuidora matriz, <span className="text-[#CCFF00]">lucrando direto na fonte (fornecimento)</span> e garantindo escalabilidade para o Sul sem inchar a operação interna.
                </p>
                <div className="mt-4 bg-orange-500/10 border border-orange-500/30 text-orange-500 text-[10px] uppercase font-black px-3 py-1.5 inline-block">Em Planejamento</div>
              </div>

              {/* Fase 3: Nordeste */}
              <div className="bg-[#050505] p-6 hover:bg-white/5 transition-colors">
                <span className="text-white/30 text-[10px] font-black uppercase tracking-widest mb-2 block">Fase 03 - Visão de Longo Prazo</span>
                <h4 className="text-white/80 font-black text-2xl uppercase tracking-tighter mb-2">Região Nordeste</h4>
                <p className="text-gray-500 text-xs leading-relaxed font-bold">
                  Após estabelecer com sucesso o modelo de distribuição e logística descentralizada no Sul, replicaremos a estrutura abrindo o próximo polo operacional para atingir e dominar a região Nordeste.
                </p>
                <div className="mt-4 bg-white/5 border border-white/10 text-white/40 text-[10px] uppercase font-black px-3 py-1.5 inline-block">Futuro</div>
              </div>
            </div>
          </div>
        </section>
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
                 <p className="text-white/80 text-xs md:text-sm leading-relaxed font-medium mb-4">
                   <strong className="text-[#FF00FF]">Eletrodomésticos & Fogões:</strong> O mercado brasileiro de eletrodomésticos de cozinha movimenta aproximadamente <strong className="text-white">R$ 145 bilhões anuais</strong>. O segmento de fogões e cooktops é o segundo maior pilar da linha branca, respondendo por <strong className="text-white">17% de todas as vendas e buscas</strong> no país.
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
             <div className="flex flex-col xl:flex-row gap-6 lg:gap-8 shrink-0 flex-wrap">
               {/* Bloco 1: Marketplace */}
               <div className="border-l-4 border-[#CCFF00] pl-4 flex flex-col justify-center">
                 <span className="text-white/50 text-[10px] font-black uppercase tracking-widest mb-1">Marketplace Brasil</span>
                 <span className="text-[#CCFF00] text-3xl lg:text-4xl font-black tracking-tighter leading-none mb-1">R$ 204 BI</span>
                 <span className="text-white/80 text-[10px] uppercase font-bold tracking-widest">Faturamento Anual</span>
               </div>
               
               {/* Bloco 2: Linha Branca */}
               <div className="border-l-4 border-[#FF00FF] pl-4 flex flex-col justify-center">
                 <span className="text-white/50 text-[10px] font-black uppercase tracking-widest mb-1">Eletrodomésticos</span>
                 <span className="text-[#FF00FF] text-3xl lg:text-4xl font-black tracking-tighter leading-none mb-1">R$ 145 BI</span>
                 <span className="text-white/80 text-[10px] uppercase font-bold tracking-widest">Volume Cozinha</span>
               </div>

               {/* Bloco 3: Farmácia */}
               <div className="border-l-4 border-[#00FFFF] pl-4 flex flex-col justify-center">
                 <span className="text-white/50 text-[10px] font-black uppercase tracking-widest mb-1">Setor Farmacêutico</span>
                 <span className="text-[#00FFFF] text-3xl lg:text-4xl font-black tracking-tighter leading-none mb-1">R$ 160 BI</span>
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

          {/* LINHA 8 - FULL WIDTH: Operação, Nuvemshop & Whats Marketplace */}
          <div className="md:col-span-3 bg-[#F4F4F0] border border-[#000000]/10 rounded-none p-6 lg:p-8 flex flex-col relative group">
             <h4 className="text-black text-[10px] lg:text-xs font-bold uppercase tracking-widest flex items-center gap-2 mb-6">
               <HeartHandshake className="w-4 h-4" /> Nuvemshop & Whats Marketplace
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

          
            
          {/* LINHA 7 - FULL WIDTH: O Motor de Marketing, Influência e Lives */}
          <div className="md:col-span-3 row-span-2 bg-[#111111] border-4 border-[#CCFF00] rounded-none p-6 lg:p-8 flex flex-col relative overflow-hidden group">
             <div className="absolute -top-24 -right-24 h-64 w-64 rounded-none bg-[#CCFF00]/5 hidden pointer-events-none" />
             <h4 className="text-[#CCFF00] text-xl lg:text-3xl font-black uppercase tracking-widest flex items-center gap-2 mb-6 relative z-10">
               <Sparkles className="w-4 h-4" /> Marca & Influência
             </h4>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 relative z-10">
               
               {/* Coluna A: O Programa de Influenciadores */}
               <div className="space-y-4">
                 <h5 className="text-[#CCFF00] text-xl md:text-2xl font-black flex items-center gap-2 uppercase tracking-tighter">
                   <span className="w-4 h-4 rounded-none bg-[#CCFF00] mr-2" /> 1. Influenciadores do ABC
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

          </section>

            {/* LINHA 8: REFERÊNCIAS */}
            <section className="bg-[#050505] border-4 border-white/20 p-6 lg:p-8 relative overflow-hidden group mt-6">
              <div className="flex flex-col gap-8 relative z-10">
                <div className="flex items-center gap-4 border-b-2 border-white/10 pb-4">
                  <div className="w-4 h-4 bg-[#CCFF00]" />
                  <h3 className="text-white text-2xl md:text-3xl font-black uppercase tracking-tighter">
                    Nossas <span className="text-[#CCFF00]">Referências</span>
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                  {/* Modelo de Negócios */}
                  <div className="flex flex-col gap-4">
                    <h4 className="text-white/50 text-[10px] font-black uppercase tracking-widest border-b border-white/10 pb-2 flex items-center gap-2">
                      <Target className="w-4 h-4 text-white/50" />
                      Formato de Negócios
                    </h4>
                    <div className="flex flex-col gap-3">
                      <div className="bg-white/5 p-4 border-l-4 border-[#CCFF00] hover:bg-white/10 transition-colors">
                        <span className="text-white font-bold text-lg block uppercase tracking-tight">Mercado Livre</span>
                        <span className="text-white/60 text-[11px] uppercase font-bold tracking-wider mt-1 block">Agilidade & Malha Logística</span>
                      </div>
                      <div className="bg-white/5 p-4 border-l-4 border-[#CCFF00] hover:bg-white/10 transition-colors">
                        <span className="text-white font-bold text-lg block uppercase tracking-tight">TikTok</span>
                        <span className="text-white/60 text-[11px] uppercase font-bold tracking-wider mt-1 block">Venda por Conteúdo Rápido</span>
                      </div>
                      <div className="bg-white/5 p-4 border-l-4 border-[#CCFF00] hover:bg-white/10 transition-colors">
                        <span className="text-white font-bold text-lg block uppercase tracking-tight">Marketplaces</span>
                        <span className="text-white/60 text-[11px] uppercase font-bold tracking-wider mt-1 block">Ecossistemas de Alto Crescimento</span>
                      </div>
                    </div>
                  </div>

                  {/* Marca e Influência */}
                  <div className="flex flex-col gap-4">
                    <h4 className="text-white/50 text-[10px] font-black uppercase tracking-widest border-b border-white/10 pb-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-white/50" />
                      Marca & Redes Sociais
                    </h4>
                    <div className="flex flex-col gap-3">
                      <div className="bg-[#CCFF00]/10 p-4 border-l-4 border-[#CCFF00] hover:bg-[#CCFF00]/20 transition-colors">
                        <span className="text-[#CCFF00] font-bold text-lg block uppercase tracking-tight">Tay Dantas</span>
                        <span className="text-white/80 text-[11px] uppercase font-bold tracking-wider mt-1 block">Vinci (Construção de Autoridade)</span>
                      </div>
                      <div className="bg-[#CCFF00]/10 p-4 border-l-4 border-[#CCFF00] hover:bg-[#CCFF00]/20 transition-colors">
                        <span className="text-[#CCFF00] font-bold text-lg block uppercase tracking-tight">Erich Shibata</span>
                        <span className="text-white/80 text-[11px] uppercase font-bold tracking-wider mt-1 block">Cimed (Identidade & Posicionamento)</span>
                      </div>
                    </div>
                  </div>

                  {/* Tráfego e Estratégia */}
                  <div className="flex flex-col gap-4">
                    <h4 className="text-white/50 text-[10px] font-black uppercase tracking-widest border-b border-white/10 pb-2 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-white/50" />
                      Estratégia & Tráfego
                    </h4>
                    <div className="flex flex-col gap-3 h-full">
                      <div className="bg-[#00FFFF]/10 p-4 border-l-4 border-[#00FFFF] hover:bg-[#00FFFF]/20 transition-colors h-full flex flex-col justify-center">
                        <span className="text-[#00FFFF] font-bold text-lg block uppercase tracking-tight">Rafael Kiso</span>
                        <span className="text-white/80 text-[11px] uppercase font-bold tracking-wider mt-2 block leading-relaxed">Especialista Absoluto em Tráfego Pago, Algoritmos e Distribuição Digital Estratégica.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

          </div>
        )}

        {activeTab === "ecossistema" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col gap-10">
            
            <div className="flex items-center justify-between mb-6 border-b-4 border-white/20 pb-4">
                <h2 className="text-white text-3xl font-black uppercase tracking-tighter flex items-center gap-4">
                  <span className="w-5 h-5 bg-[#CCFF00]"></span>
                  ARQUITETURA DO NEGÓCIO
                </h2>
                <span className="bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] px-4 py-2 border-2 border-transparent">
                  INTEGRAÇÃO MACRO
                </span>
              </div>

                          {/* Grid Principal do Ecossistema Brutalista */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border-4 border-white/20 bg-[#050505] shadow-2xl relative mb-12">
                
                {/* LINHA DE DIVISÃO CENTRAL DESKTOP */}
                <div className="hidden lg:block absolute top-0 bottom-0 left-1/2 w-1 bg-white/20" />

                {/* --- COLUNA ESQUERDA --- */}
                <div className="flex flex-col border-b-4 lg:border-b-0 border-white/20">
                  {/* CABEÇALHO ESQUERDA */}
                  <div className="bg-[#CCFF00] p-6 lg:p-10 border-b-4 border-white/20 flex items-center justify-between">
                    <h3 className="text-black font-black uppercase tracking-tighter text-2xl lg:text-3xl">AQUISIÇÃO</h3>
                    <span className="text-black text-[10px] font-black uppercase tracking-[0.3em]">Client-Facing</span>
                  </div>

                  
                    {/* ITEM 1 */}
                  <div className="p-6 lg:p-10 border-b-4 border-white/20 relative overflow-hidden group bg-[#111111]">
                    <div className="absolute -right-10 -bottom-10 text-[12rem] font-black text-white/5 pointer-events-none transition-transform duration-700 group-hover:scale-110">1</div>
                    <h4 className="text-white font-black text-3xl lg:text-4xl uppercase tracking-tighter mb-4 relative z-10 flex flex-col">
                      <span className="text-yellow-400 text-[11px] tracking-[0.4em] font-bold mb-2">MOTOR DE VOLUME</span>
                      Ecossistema de Marketplaces
                    </h4>
                    <p className="text-gray-400 text-sm font-bold leading-relaxed mb-8 relative z-10 max-w-[90%]">
                      Nosso principal motor de volume. Múltiplas contas gerenciadas estrategicamente com foco agressivo em precificação, Ads e um catálogo de produtos Curva A de alta demanda.
                    </p>
                    <div className="flex flex-wrap gap-2 relative z-10">
                      <span className="bg-[#FFE600] text-black border-2 border-[#FFE600] text-[10px] uppercase font-black px-3 py-1.5">Mercado Livre</span>
                      <span className="bg-[#EE4D2D] text-white border-2 border-[#EE4D2D] text-[10px] uppercase font-black px-3 py-1.5">Shopee</span>
                      <span className="bg-[#FF9900] text-white border-2 border-[#FF9900] text-[10px] uppercase font-black px-3 py-1.5">Amazon</span>
                      <span className="bg-[#0086FF] text-white border-2 border-[#0086FF] text-[10px] uppercase font-black px-3 py-1.5">Magalu</span>
                      <span className="bg-white text-black border-2 border-white text-[10px] uppercase font-black px-3 py-1.5">TikTok Shop</span>
                    </div>
                  </div>

                  {/* ITEM 2 */}
                  <div className="p-6 lg:p-8 border-b-4 border-white/20 relative overflow-hidden group bg-black">
                    <div className="absolute -right-10 -bottom-10 text-[12rem] font-black text-white/5 pointer-events-none transition-transform duration-700 group-hover:scale-110">2</div>
                    <h4 className="text-white font-black text-3xl lg:text-4xl uppercase tracking-tighter mb-4 relative z-10 flex flex-col">
                      <span className="text-blue-400 text-[11px] tracking-[0.4em] font-bold mb-2">CANAIS DIRETOS</span>
                      Nuvemshop & Whats
                    </h4>
                    <p className="text-gray-400 text-sm font-bold leading-relaxed mb-8 relative z-10 max-w-[90%]">
                      O canal para o público brasileiro: operação via WhatsApp. Copiloto de Inteligência Artificial para escala de atendimento humanizado e oferta de venda cruzada de produtos + serviços.
                    </p>
                    <div className="flex flex-wrap gap-2 relative z-10">
                      <span className="bg-white/5 text-white border-2 border-white/20 text-[10px] uppercase font-bold px-3 py-1.5">Copiloto IA</span>
                      <span className="bg-white/5 text-white border-2 border-white/20 text-[10px] uppercase font-bold px-3 py-1.5">Atendimento Humano</span>
                      <span className="bg-white/5 text-white border-2 border-white/20 text-[10px] uppercase font-bold px-3 py-1.5">Cross-Sell</span>
                    </div>
                  </div>
                {/* ITEM 3 */}
                  <div className="p-6 lg:p-10 relative overflow-hidden group bg-[#111111]">
                    <div className="absolute -right-10 -bottom-10 text-[12rem] font-black text-white/5 pointer-events-none transition-transform duration-700 group-hover:scale-110">3</div>
                    <h4 className="text-white font-black text-3xl lg:text-4xl uppercase tracking-tighter mb-4 relative z-10 flex flex-col">
                      <span className="text-[#CCFF00] text-[11px] tracking-[0.4em] font-bold mb-2">MÁQUINA REGIONAL</span>
                      Marketing & Influenciadores
                    </h4>
                    <p className="text-gray-400 text-sm font-bold leading-relaxed mb-8 relative z-10 max-w-[90%]">
                      Nossa máquina de influência regional. Conteúdo em vídeo retroalimentando o TikTok/IG, Lives Commerce semanais focadas em alta conversão e pessoas reais ancorando a confiança da marca.
                    </p>
                    <div className="flex flex-wrap gap-2 relative z-10">
                      <span className="bg-white/5 text-white border-2 border-white/20 text-[10px] uppercase font-bold px-3 py-1.5">Influenciadores do ABC</span>
                      <span className="bg-white/5 text-white border-2 border-white/20 text-[10px] uppercase font-bold px-3 py-1.5">Live Commerce</span>
                      <span className="bg-white/5 text-white border-2 border-white/20 text-[10px] uppercase font-bold px-3 py-1.5">Conteúdo Viral</span>
                    </div>
                  </div>

                  

                </div>
                  {/* --- COLUNA DIREITA --- */}
                <div className="flex flex-col bg-black">
                  {/* CABEÇALHO DIREITA */}
                  <div className="bg-white p-6 lg:p-10 border-b-4 border-white/20 flex items-center justify-between">
                    <h3 className="text-black font-black uppercase tracking-tighter text-2xl lg:text-3xl">OPERAÇÃO</h3>
                    <span className="text-black text-[10px] font-black uppercase tracking-[0.3em]">Back-End</span>
                  </div>

                  {/* ITEM 4 */}
                  <div className="p-6 lg:p-10 border-b-4 border-white/20 relative overflow-hidden group bg-black">
                    <div className="absolute -right-10 -bottom-10 text-[12rem] font-black text-white/5 pointer-events-none transition-transform duration-700 group-hover:scale-110">4</div>
                    <h4 className="text-white font-black text-3xl lg:text-4xl uppercase tracking-tighter mb-4 relative z-10 flex flex-col">
                      <span className="text-emerald-400 text-[11px] tracking-[0.4em] font-bold mb-2">O CÉREBRO</span>
                      Rama System Hub
                    </h4>
                    <p className="text-gray-400 text-sm font-bold leading-relaxed mb-8 relative z-10 max-w-[90%]">
                      Nosso sistema interno proprietário. Conciliação financeira automatizada, gestão preditiva de suprimentos (Bot de Compras), rastreio de gargalos e dashboard para tomada de decisão.
                    </p>
                    <div className="flex flex-wrap gap-2 relative z-10">
                      <span className="bg-white/5 text-white border-2 border-white/20 text-[10px] uppercase font-bold px-3 py-1.5">Conciliação Auto</span>
                      <span className="bg-white/5 text-white border-2 border-white/20 text-[10px] uppercase font-bold px-3 py-1.5">Bot Compras</span>
                      <span className="bg-white/5 text-white border-2 border-white/20 text-[10px] uppercase font-bold px-3 py-1.5">Previsibilidade</span>
                    </div>
                  </div>

                  {/* ITEM 5 */}
                  <div className="p-6 lg:p-8 relative overflow-hidden group bg-[#111111]">
                    <div className="absolute -right-10 -bottom-10 text-[12rem] font-black text-white/5 pointer-events-none transition-transform duration-700 group-hover:scale-110">5</div>
                    <h4 className="text-white font-black text-3xl lg:text-4xl uppercase tracking-tighter mb-4 relative z-10 flex flex-col">
                      <span className="text-[#CCFF00] text-[11px] tracking-[0.4em] font-bold mb-2">LOGÍSTICA</span>
                      Rama Flow (Same-Day)
                    </h4>
                    <p className="text-gray-400 text-sm font-bold leading-relaxed mb-8 relative z-10 max-w-[90%]">
                      O coração físico do negócio em SP/ABC. Expedição no mesmo dia (Flex), zero erros na separação, redução de custos com embalagens inteligentes e controle anti-fraude.
                    </p>
                    <div className="flex flex-wrap gap-2 relative z-10">
                      <span className="bg-white/5 text-white border-2 border-white/20 text-[10px] uppercase font-bold px-3 py-1.5">Same-Day Flex</span>
                      <span className="bg-white/5 text-white border-2 border-white/20 text-[10px] uppercase font-bold px-3 py-1.5">Zero Erros</span>
                      <span className="bg-white/5 text-white border-2 border-white/20 text-[10px] uppercase font-bold px-3 py-1.5">Radar Logístico</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
        )}

        {activeTab === "app" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col items-center">
              <div className="text-center mb-12">
                <h2 className="text-white text-3xl font-black tracking-tight">O Futuro do E-commerce</h2>
                <p className="text-gray-400 font-black max-w-lg mt-2 mx-auto">
                  Simulação da nossa futura plataforma proprietária: uma experiência nativa de compra guiada somada ao poder do atendimento consultivo via WhatsApp.
                </p>
              </div>
  
              {/* Simulação dos Celulares */}
              <div className="flex flex-col xl:flex-row gap-12 xl:gap-20 items-center justify-center w-full max-w-[1200px] mx-auto pb-10">
                
                {/* CELULAR 1: App */}
                <div className="flex flex-col gap-4 items-center">
                  <div className="flex flex-col items-center gap-1 text-center">
                    <span className="text-[#CCFF00] font-black tracking-widest uppercase text-sm flex items-center gap-2"><div className="w-2 h-2 bg-[#CCFF00] rounded-full animate-pulse"/> D2C: Compra Rápida</span>
                    <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Escala & Autoatendimento</span>
                  </div>
                  
                  <div className="relative w-[340px] h-[720px] bg-black rounded-[3rem] border-[8px] border-[#1A1A1A] shadow-2xl overflow-hidden flex flex-col ring-1 ring-white/10 shrink-0 font-sans">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#1A1A1A] rounded-b-3xl z-50" />
                    <div className="absolute top-0 w-full h-12 flex justify-between items-center px-6 z-40 text-white text-[10px] font-bold pt-2">
                      <span>9:41</span>
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-white/100" />
                        <div className="w-3 h-3 rounded-full bg-white/100" />
                        <div className="w-4 h-3 bg-white/80 rounded-[2px]" />
                      </div>
                    </div>
                    
{activeD2CTab === "video" ? (
  <div className="relative flex-1 bg-[#111111] overflow-hidden group cursor-pointer">
    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540569014015-19a7be504e3a?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-80" />
    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/90" />
    
    <div className="absolute bottom-0 left-0 w-full p-4 pb-20 flex justify-between items-end">
      <div className="flex-1 pr-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#CCFF00] to-indigo-500 p-0.5">
            <div className="w-full h-full bg-black rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg">RF</div>
          </div>
          <div className="flex flex-col">
              <span className="text-white font-bold text-sm drop-shadow-md">@ramaflow</span>
              <span className="text-[#CCFF00] text-[9px] font-bold uppercase tracking-wider">Patrocinado</span>
          </div>
        </div>
        <p className="text-white text-sm font-medium mb-4 drop-shadow-md leading-snug">
          Testei o <span className="font-bold">Kit de Instalação de Gás com Válvula de Segurança</span> da Rama Flow. Olha a facilidade e a economia! 🚀🔥
        </p>
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-2.5 flex gap-3 items-center cursor-pointer hover:bg-white/10 transition-colors shadow-2xl">
          <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center border border-white/5">
            <svg viewBox="0 0 24 24" className="text-[#CCFF00] w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
          </div>
          <div className="flex-1">
            <h4 className="text-white text-xs font-bold leading-tight">Kit Mangueira + Registro</h4>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-[#CCFF00] font-black text-sm">R$ 89,90</span>
              <span className="text-white/40 text-[10px] line-through">R$ 120</span>
            </div>
          </div>
          <button className="bg-[#CCFF00] text-black w-8 h-8 rounded-full flex items-center justify-center hover:bg-yellow-400 transition-colors shrink-0 shadow-md">
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-5 items-center mb-4">
        <div className="flex flex-col items-center gap-1">
          <div className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors">
            <svg viewBox="0 0 24 24" className="w-7 h-7 text-white drop-shadow-md" fill="white" stroke="currentColor" strokeWidth="1"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
          </div>
          <span className="text-white text-[11px] font-bold drop-shadow-md">12.4k</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors">
            <svg viewBox="0 0 24 24" className="w-7 h-7 text-white drop-shadow-md" fill="white" stroke="none" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
          </div>
          <span className="text-white text-[11px] font-bold drop-shadow-md">842</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors">
            <svg viewBox="0 0 24 24" className="w-7 h-7 text-white drop-shadow-md" fill="white" stroke="none"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" stroke="white" strokeWidth="2"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" stroke="white" strokeWidth="2"></line></svg>
          </div>
          <span className="text-white text-[11px] font-bold drop-shadow-md">2k</span>
        </div>
      </div>
    </div>

    <div className="absolute top-1/3 left-4 right-16 space-y-3 pointer-events-none opacity-95">
       <div className="bg-black/50 backdrop-blur-lg p-2.5 rounded-2xl rounded-tl-sm border border-white/10 w-fit animate-pulse shadow-xl flex items-center gap-2">
         <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-[10px] text-white font-bold">J</div>
         <div>
           <span className="text-white/60 text-[10px] font-bold block mb-0.5">João M.</span>
           <p className="text-white text-xs font-medium">Produto top! Chegou no mesmo dia.</p>
         </div>
       </div>
       <div className="bg-black/50 backdrop-blur-lg p-2.5 rounded-2xl rounded-tl-sm border border-white/10 w-fit ml-8 animate-pulse delay-150 shadow-xl flex items-center gap-2">
         <div className="w-6 h-6 rounded-full bg-pink-500 flex items-center justify-center text-[10px] text-white font-bold">M</div>
         <div>
           <span className="text-white/60 text-[10px] font-bold block mb-0.5">Marcia T.</span>
           <p className="text-white text-xs font-medium">Excelente, técnico super educado!</p>
         </div>
       </div>
    </div>
  </div>
) : (
  <div className="relative flex-1 bg-[#050505] overflow-y-auto custom-scrollbar flex flex-col pb-6">
    <div className="sticky top-0 w-full bg-black/80 backdrop-blur-xl border-b border-white/5 z-20 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#CCFF00] to-indigo-500 p-[1.5px]">
          <div className="w-full h-full bg-black rounded-full flex items-center justify-center text-white font-bold text-[9px]">RF</div>
        </div>
        <span className="text-white font-bold text-xs uppercase tracking-widest">Loja Oficial</span>
      </div>
      <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
      </div>
    </div>
    
    <div className="p-4 flex gap-2 overflow-x-auto custom-scrollbar pb-2">
      <div className="px-3 py-1.5 bg-[#CCFF00] text-black rounded-full text-[10px] font-bold whitespace-nowrap">Kits de Gás</div>
      <div className="px-3 py-1.5 bg-white/10 text-white rounded-full text-[10px] font-medium whitespace-nowrap">Fogões</div>
      <div className="px-3 py-1.5 bg-white/10 text-white rounded-full text-[10px] font-medium whitespace-nowrap">Peças</div>
    </div>

    <div className="px-4 grid grid-cols-2 gap-3 mt-2 pb-6">
      {/* Product 1 */}
      <div className="bg-[#0a0a0a] rounded-2xl p-1.5 border border-white/10 flex flex-col group hover:border-[#CCFF00]/50 transition-colors shadow-lg">
        <div className="w-full h-28 bg-[#1a1a1a] rounded-xl mb-2 overflow-hidden relative group-hover:opacity-90 transition-opacity">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=300&auto=format&fit=crop')] bg-cover bg-center opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute top-1.5 left-1.5 bg-[#CCFF00] text-black text-[8px] font-black px-1.5 py-0.5 rounded-sm uppercase tracking-wider">PREMIUM</div>
        </div>
        <div className="px-1 flex flex-col flex-1">
          <span className="text-white text-[10px] font-bold leading-snug line-clamp-2">Kit Premium de Gás Encanado + Registro de Segurança</span>
          <div className="mt-auto pt-2 flex items-center justify-between pb-1">
            <span className="text-[#CCFF00] font-black text-xs">R$ 149,90</span>
          </div>
        </div>
      </div>
      
      {/* Product 2 */}
      <div className="bg-[#0a0a0a] rounded-2xl p-1.5 border border-white/10 flex flex-col group hover:border-[#CCFF00]/50 transition-colors shadow-lg">
        <div className="w-full h-28 bg-[#1a1a1a] rounded-xl mb-2 overflow-hidden relative group-hover:opacity-90 transition-opacity">
           <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=300&auto=format&fit=crop')] bg-cover bg-center opacity-90" />
           <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
           <div className="absolute top-1.5 left-1.5 bg-black/50 backdrop-blur-sm text-white border border-white/10 text-[8px] font-black px-1.5 py-0.5 rounded-sm uppercase tracking-wider">CURVA A</div>
        </div>
        <div className="px-1 flex flex-col flex-1">
          <span className="text-white text-[10px] font-bold leading-snug line-clamp-2">Fogão Brastemp 4 Bocas Inox c/ Timer</span>
          <div className="mt-auto pt-2 flex items-center justify-between pb-1">
            <span className="text-[#CCFF00] font-black text-xs">R$ 1.299,00</span>
          </div>
        </div>
      </div>

      {/* Product 3 */}
      <div className="bg-[#0a0a0a] rounded-2xl p-1.5 border border-white/10 flex flex-col group hover:border-[#CCFF00]/50 transition-colors shadow-lg">
        <div className="w-full h-28 bg-[#1a1a1a] rounded-xl mb-2 overflow-hidden relative group-hover:opacity-90 transition-opacity">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1584286595398-a59f2afddaca?q=80&w=300&auto=format&fit=crop')] bg-cover bg-center opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute top-1.5 left-1.5 bg-[#FF00FF] text-white text-[8px] font-black px-1.5 py-0.5 rounded-sm uppercase tracking-wider">15% OFF</div>
        </div>
        <div className="px-1 flex flex-col flex-1">
          <span className="text-white text-[10px] font-bold leading-snug line-clamp-2">Kit Básico Mangueira Cobre 1.2m</span>
          <div className="mt-auto pt-2 flex items-center justify-between pb-1">
            <span className="text-[#CCFF00] font-black text-xs">R$ 89,90</span>
            <span className="text-white/40 text-[9px] line-through">R$ 105</span>
          </div>
        </div>
      </div>
      
      {/* Product 4 */}
      <div className="bg-[#0a0a0a] rounded-2xl p-1.5 border border-white/10 flex flex-col group hover:border-[#CCFF00]/50 transition-colors shadow-lg">
        <div className="w-full h-28 bg-[#1a1a1a] rounded-xl mb-2 overflow-hidden relative group-hover:opacity-90 transition-opacity">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=300&auto=format&fit=crop')] bg-cover bg-center opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute top-1.5 left-1.5 bg-[#00FFFF] text-black text-[8px] font-black px-1.5 py-0.5 rounded-sm uppercase tracking-wider">SERVIÇO</div>
        </div>
        <div className="px-1 flex flex-col flex-1">
          <span className="text-white text-[10px] font-bold leading-snug line-clamp-2">Instalação Técnica Especializada e Segura</span>
          <div className="mt-auto pt-2 flex items-center justify-between pb-1">
            <span className="text-[#CCFF00] font-black text-xs">R$ 90,00</span>
          </div>
        </div>
      </div>
    </div>
  </div>
)}
<div className="h-16 bg-[#000000] flex justify-around items-center px-2 z-40 relative">
                      <div onClick={() => setActiveD2CTab("video")} className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${activeD2CTab === "video" ? "text-white" : "text-white/50 hover:text-white"}`}>
                        <svg viewBox="0 0 24 24" className="w-6 h-6" fill={activeD2CTab === "video" ? "currentColor" : "none"} stroke="currentColor" strokeWidth={activeD2CTab === "video" ? "1" : "2"}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                        <span className={`text-[9px] ${activeD2CTab === "video" ? "font-bold" : "font-medium"}`}>Início</span>
                      </div>
                      <div onClick={() => setActiveD2CTab("store")} className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${activeD2CTab === "store" ? "text-white" : "text-white/50 hover:text-white"}`}>
                        <svg viewBox="0 0 24 24" className="w-6 h-6" fill={activeD2CTab === "store" ? "currentColor" : "none"} stroke="currentColor" strokeWidth={activeD2CTab === "store" ? "1" : "2"}><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                        <span className={`text-[9px] ${activeD2CTab === "store" ? "font-bold" : "font-medium"}`}>Loja</span>
                      </div>
                      <div className="flex flex-col items-center gap-1 text-[#CCFF00] cursor-pointer">
                        <div className="w-12 h-8 rounded-xl bg-white flex items-center justify-center relative shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                          <div className="absolute -left-1 w-1 h-3 bg-[#CCFF00] rounded-l-sm" />
                          <div className="absolute -right-1 w-1 h-3 bg-red-500 rounded-r-sm" />
                          <svg viewBox="0 0 24 24" className="w-4 h-4 text-black ml-0.5" fill="black"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                        </div>
                      </div>
                      <div className="flex flex-col items-center gap-1 text-white/50 cursor-pointer hover:text-white transition-colors">
                        <div className="relative">
                           <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                           <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#CCFF00] rounded-full animate-ping" />
                        </div>
                        <span className="text-[9px] font-medium">Carrinho</span>
                      </div>
                      <div className="flex flex-col items-center gap-1 text-white/50 cursor-pointer hover:text-white transition-colors">
                        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                        <span className="text-[9px] font-medium">Perfil</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* VS Badge */}
                <div className="hidden xl:flex flex-col gap-3 items-center">
                   <div className="w-[2px] h-32 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
                   <div className="w-12 h-12 rounded-full bg-[#111] border-2 border-white/20 flex items-center justify-center z-10 shrink-0">
                     <span className="text-white/40 font-black text-xs">+</span>
                   </div>
                   <div className="w-[2px] h-32 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
                </div>

                {/* CELULAR 2: WhatsApp */}
                <div className="flex flex-col gap-4 items-center">
                  <div className="flex flex-col items-center gap-1 text-center">
                    <span className="text-[#00a884] font-black tracking-widest uppercase text-sm flex items-center gap-2"><div className="w-2 h-2 bg-[#00a884] rounded-full animate-pulse"/> WhatsApp Copilot</span>
                    <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Cross-Sell & Consultivo</span>
                  </div>
                  <div className="relative w-[340px] h-[720px] bg-[#0b141a] rounded-[3rem] border-[8px] border-[#1A1A1A] shadow-2xl overflow-hidden flex flex-col ring-1 ring-white/10 shrink-0 font-sans">
                    
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#1A1A1A] rounded-b-3xl z-50" />
      
                    <div className="absolute top-0 w-full h-12 flex justify-between items-center px-6 z-40 text-white/70 text-[10px] font-bold pt-2">
                      <span>9:42</span>
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-none border-4 border-white/70" />
                        <div className="w-3 h-3 rounded-none border-4 border-white/70" />
                        <div className="w-4 h-3 bg-white/70 rounded-[2px]" />
                      </div>
                    </div>

                    <div className="bg-[#202c33] w-full pt-12 pb-3 px-4 flex items-center gap-3 z-30 shadow-sm relative">
                      <svg viewBox="0 0 24 24" className="text-[#8696a0] w-6 h-6 shrink-0" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                      <div className="w-10 h-10 rounded-full bg-black border border-white/10 flex items-center justify-center shrink-0">
                        <span className="text-[#CCFF00] font-black text-sm">L</span>
                      </div>
                      <div className="flex flex-col flex-1 leading-tight">
                        <div className="flex items-center gap-1">
                          <span className="text-[#e9edef] font-bold text-base whitespace-nowrap">Luna - Club RM</span>
                          <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#00a884] shrink-0" fill="currentColor"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1.9 14.7L6 12.6l1.5-1.5 2.6 2.6 6.4-6.4 1.5 1.5-7.9 7.9z"/></svg>
                        </div>
                        <span className="text-[#8696a0] text-[11px] whitespace-nowrap">Atendimento Oficial</span>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-3.5 flex flex-col gap-3.5 relative custom-scrollbar pb-6">
                      <div className="absolute inset-0 opacity-[0.04] bg-[url('https://i.pinimg.com/originals/8c/98/99/8c98994518b575bfd8c949e91d20548b.jpg')] bg-repeat" />

                      <div className="flex justify-center my-1 relative z-10">
                        <span className="bg-[#182229] text-[#8696a0] text-[10px] font-medium px-3 py-1 rounded-lg shadow-sm">Hoje</span>
                      </div>

                      {/* Client */}
                      <div className="flex flex-col items-end self-end max-w-[90%] relative z-10">
                        <div className="bg-[#005c4b] text-[#e9edef] text-[12px] px-2.5 py-1.5 rounded-xl rounded-tr-sm shadow-sm relative">
                          Olá! Vi aquele Fogão Brastemp 4 bocas no TikTok de vocês. Ainda tem pronta entrega?
                          <span className="text-[#8696a0] text-[9px] ml-2 float-right mt-1.5">09:40</span>
                        </div>
                      </div>

                      {/* Store */}
                      <div className="flex flex-col items-start self-start max-w-[90%] relative z-10 mt-1">
                        <div className="bg-[#202c33] text-[#e9edef] text-[12px] px-2.5 py-1.5 rounded-xl rounded-tl-sm shadow-sm relative">
                          Olá! Bem-vindo(a) à Luna - Club RM. 🚀
                        </div>
                      </div>
                      <div className="flex flex-col items-start self-start max-w-[90%] relative z-10 mt-[-8px]">
                        <div className="bg-[#202c33] text-[#e9edef] text-[12px] px-2.5 py-1.5 rounded-xl rounded-tl-sm shadow-sm relative">
                          Temos sim! O <strong>Fogão Brastemp (R$ 1.299)</strong> está no nosso CD central. Se fecharmos agora, nosso Flex entrega <strong>hoje à tarde</strong>!
                          <span className="text-[#8696a0] text-[9px] ml-2 float-right mt-1.5">09:41</span>
                        </div>
                      </div>

                      {/* Client */}
                      <div className="flex flex-col items-end self-end max-w-[90%] relative z-10 mt-1">
                        <div className="bg-[#005c4b] text-[#e9edef] text-[12px] px-2.5 py-1.5 rounded-xl rounded-tr-sm shadow-sm relative">
                          Ótimo, vou querer. Mas me mudei para um apê novo e não tenho a mangueira, nem quem instale.
                          <span className="text-[#8696a0] text-[9px] ml-2 float-right mt-1.5">09:41</span>
                        </div>
                      </div>

                      {/* Store */}
                      <div className="flex flex-col items-start self-start max-w-[90%] relative z-10 mt-1">
                        <div className="bg-[#202c33] text-[#e9edef] text-[12px] px-2.5 py-1.5 rounded-xl rounded-tl-sm shadow-sm relative">
                          Fique tranquilo(a)! Ninguém fica sem cozinhar com a Rama. 😊
                        </div>
                      </div>
                      <div className="flex flex-col items-start self-start max-w-[90%] relative z-10 mt-[-8px]">
                        <div className="bg-[#202c33] text-[#e9edef] text-[12px] px-2.5 py-1.5 rounded-xl rounded-tl-sm shadow-sm relative">
                          Posso incluir o <strong>Kit Gás Premium</strong> (Mangueira de Cobre + Registro) por R$ 149,90 e já enviar nosso técnico amanhã cedo por apenas +R$ 90,00?
                          <span className="text-[#8696a0] text-[9px] ml-2 float-right mt-1.5">09:42</span>
                        </div>
                      </div>

                      {/* Client */}
                      <div className="flex flex-col items-end self-end max-w-[90%] relative z-10 mt-1">
                        <div className="bg-[#005c4b] text-[#e9edef] text-[12px] px-2.5 py-1.5 rounded-xl rounded-tr-sm shadow-sm relative">
                          Nossa, perfeito! Pode fechar o pacote completo então.
                          <span className="text-[#8696a0] text-[9px] ml-2 float-right mt-1.5">09:42</span>
                        </div>
                      </div>

                      {/* Store - Fatura */}
                      <div className="flex flex-col items-start self-start max-w-[95%] relative z-10 mt-1">
                        <div className="bg-[#202c33] p-1.5 rounded-xl rounded-tl-sm shadow-sm w-[260px] relative">
                          <div className="bg-[#0b141a] rounded-lg p-3 flex flex-col gap-2">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-[#00a884] font-bold text-[10px] uppercase tracking-wider flex items-center gap-1.5">
                                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
                                Fatura RAMA
                              </span>
                            </div>
                            <div className="text-white font-black text-2xl mb-1">R$ 1.538,90</div>
                            
                            <div className="flex flex-col gap-1 text-[#8696a0] text-[10px] font-medium border-t border-white/5 pt-2">
                              <div className="flex justify-between"><span>Fogão Brastemp 4B</span><span className="text-white">1.299,00</span></div>
                              <div className="flex justify-between"><span>Kit Gás Premium</span><span className="text-white">149,90</span></div>
                              <div className="flex justify-between"><span>Instalação (Técnico)</span><span className="text-white">90,00</span></div>
                            </div>

                            <button className="w-full bg-[#00a884] hover:bg-[#008f6f] text-[#0b141a] font-bold py-2 rounded-md mt-2 text-[12px] transition-colors flex items-center justify-center gap-1.5 shadow-md">
                              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                              Pagar via PIX
                            </button>
                          </div>
                          <span className="text-[#8696a0] text-[9px] float-right mt-1.5 mr-1 mb-0.5">09:42</span>
                        </div>
                      </div>

                      <div className="flex flex-col items-start self-start max-w-[90%] relative z-10 mt-[-8px]">
                        <div className="bg-[#202c33] text-[#e9edef] text-[12px] px-2.5 py-1.5 rounded-xl rounded-tl-sm shadow-sm relative">
                          O técnico João chegará amanhã às 09:00 com o kit. E o fogão chega hoje até as 18h! 😉
                          <span className="text-[#8696a0] text-[9px] ml-2 float-right mt-1.5">09:43</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-[#202c33] px-3 py-2 flex items-center gap-2 z-30 relative">
                      <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#8696a0] shrink-0" fill="currentColor"><path d="M11.999 14.942c2.001 0 3.531-1.53 3.531-3.531V4.35c0-2.001-1.53-3.531-3.531-3.531S8.469 2.349 8.469 4.35v7.061c0 2.001 1.53 3.531 3.531 3.531z"/><path d="M17.634 11.411c0 3.116-2.529 5.644-5.644 5.644s-5.645-2.528-5.645-5.644H4.559c0 3.829 2.915 6.98 6.574 7.481v3.91h2.72v-3.91c3.659-.501 6.574-3.652 6.574-7.481h-1.793z"/></svg>
                      <div className="flex-1 bg-[#2a3942] rounded-full flex items-center px-4 py-2.5">
                        <span className="text-[#8696a0] text-[14px]">Mensagem</span>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-[#00a884] flex items-center justify-center shrink-0">
                        <svg viewBox="0 0 24 24" className="w-5 h-5 text-black" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
}
