import React, { useState } from "react";
import { 
  Briefcase, Target, TrendingUp, Users, DollarSign, ArrowRight, 
  ShieldCheck, Zap, Globe, ShoppingBag, Box, Server, Paintbrush, 
  Network, Code2, Layers, Cpu, Fingerprint, Heart, MessageCircle, 
  Share2, Play, Search, User, Home, ShoppingCart
} from "lucide-react";

export default function BusinessPlan() {
  const [activeTab, setActiveTab] = useState<"estrategia" | "ecossistema" | "app">("estrategia");

  return (
    <div className="flex-1 w-full min-h-screen relative flex flex-col font-sans overflow-y-auto custom-scrollbar bg-transparent pb-10">
      
      {/* Glow de Fundo Estático */}
      <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/4 transition-all duration-1000" />
      
      {activeTab === "ecossistema" && (
         <div className="absolute top-1/2 left-0 w-[600px] h-[500px] bg-gradient-to-tr from-cyan-500/10 via-blue-500/5 to-transparent rounded-full blur-[100px] pointer-events-none -translate-x-1/2 transition-all duration-1000" />
      )}

      {/* Header Premium */}
      <div className="px-8 pt-10 pb-4 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
              <Briefcase className="w-5 h-5 text-indigo-400" />
            </div>
            <span className="text-indigo-400 text-xs font-bold tracking-[0.2em] uppercase">Mapeamento Corporativo</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-light text-white tracking-tighter">
            Business <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">Plan.</span>
          </h1>
          <p className="text-gray-400 text-sm mt-3 font-light max-w-2xl">
            Visão de longo prazo, modelo de negócios, expansão e a estrutura completa do ecossistema da empresa.
          </p>
        </div>
        
        <div className="flex flex-col items-end gap-4">
          <button className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-5 py-2.5 rounded-xl font-bold text-xs tracking-widest uppercase transition-all flex items-center gap-2">
            Baixar PDF <ArrowRight className="w-4 h-4" />
          </button>
          
          {/* Tabs de Navegação */}
          <div className="flex bg-[#0a0a0a] border border-white/5 p-1 rounded-xl">
            <button 
              onClick={() => setActiveTab("estrategia")}
              className={`px-4 lg:px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === "estrategia" ? "bg-white/10 text-white shadow-sm" : "text-gray-500 hover:text-gray-300"
              }`}
            >
              Plano Diretor
            </button>
            <button 
              onClick={() => setActiveTab("ecossistema")}
              className={`px-4 lg:px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === "ecossistema" ? "bg-white/10 text-white shadow-sm" : "text-gray-500 hover:text-gray-300"
              }`}
            >
              Ecossistema
            </button>
            <button 
              onClick={() => setActiveTab("app")}
              className={`px-4 lg:px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === "app" ? "bg-white/10 text-white shadow-sm" : "text-gray-500 hover:text-gray-300"
              }`}
            >
              Visão App
            </button>
          </div>
        </div>
      </div>

      {/* Conteúdo Dinâmico */}
      <div className="p-8 relative z-10 flex flex-col gap-8 max-w-7xl mx-auto w-full">
        
        {activeTab === "estrategia" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col gap-8">
            {/* Seção 1: Resumo Executivo */}
            <section>
              <h2 className="text-white text-xl font-bold tracking-tight mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-400" /> Resumo Executivo
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#111111] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400"><TrendingUp className="w-4 h-4" /></div>
                    <h3 className="text-white font-bold uppercase tracking-wider text-xs">Visão</h3>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed font-light">
                    Ser a referência nacional em utilidades domésticas e ferramentas, unindo eficiência logística (Rama Flow) com atendimento premium e agilidade extrema.
                  </p>
                </div>
                
                <div className="bg-[#111111] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400"><ShieldCheck className="w-4 h-4" /></div>
                    <h3 className="text-white font-bold uppercase tracking-wider text-xs">Missão</h3>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed font-light">
                    Entregar produtos de alta demanda com qualidade, segurança (como mangueiras de gás validadas) e a melhor experiência de compra nos marketplaces e loja própria.
                  </p>
                </div>
                
                <div className="bg-[#111111] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400"><Zap className="w-4 h-4" /></div>
                    <h3 className="text-white font-bold uppercase tracking-wider text-xs">Diferencial</h3>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed font-light">
                    Autonomia operacional total, expedição no mesmo dia (Flex), time enxuto altamente produtivo e processos validados (SOPs).
                  </p>
                </div>
              </div>
            </section>

            {/* Seção 2: Análise de Mercado & Estratégia */}
            <section>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                
                <div className="lg:col-span-8 bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <h2 className="text-white text-xl font-bold tracking-tight mb-6 flex items-center gap-2 relative z-10">
                    <Users className="w-5 h-5 text-purple-400" /> Estrutura & Expansão
                  </h2>
                  
                  <div className="space-y-6 relative z-10">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                        <span className="text-white font-bold text-lg">01</span>
                      </div>
                      <div>
                        <h4 className="text-white font-bold mb-1">Domínio de Marketplaces</h4>
                        <p className="text-gray-400 text-sm leading-relaxed font-light">
                          Consolidação de múltiplas contas Mercado Livre (Principal, Loja 2) e expansão em novos canais (Shopee, Amazon) com equipe dedicada a catálogos e ads.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                        <span className="text-white font-bold text-lg">02</span>
                      </div>
                      <div>
                        <h4 className="text-white font-bold mb-1">Operação Logística Própria</h4>
                        <p className="text-gray-400 text-sm leading-relaxed font-light">
                          Ampliação do modelo "Rama Flow" de expedição inteligente, zero erros na separação, reduzindo custos de embalagem e frete.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                        <span className="text-white font-bold text-lg">03</span>
                      </div>
                      <div>
                        <h4 className="text-white font-bold mb-1">Serviços Híbridos (Produtos + Serviço)</h4>
                        <p className="text-gray-400 text-sm leading-relaxed font-light">
                          Lançamento da vertical de instalação de mangueiras de gás em campo, gerando receita recorrente, cross-sell e fidelização local.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-4 flex flex-col gap-4">
                  <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] border border-white/5 rounded-3xl p-8 flex-1 flex flex-col justify-center relative overflow-hidden">
                    <DollarSign className="absolute -right-4 -bottom-4 w-32 h-32 text-green-500/5 rotate-12" />
                    <h3 className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-2">Meta Financeira (Y1)</h3>
                    <div className="text-5xl font-light text-white tracking-tighter mb-2">100%</div>
                    <p className="text-green-400 font-medium text-sm">Crescimento de Faturamento</p>
                  </div>
                  
                  <div className="bg-[#111111] border border-white/5 rounded-3xl p-8 flex-1 flex flex-col justify-center">
                    <h3 className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-4">Milestones</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" />
                        <span className="text-white text-sm">Equipe Base Formada</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]" />
                        <span className="text-white text-sm">Lançamento E-commerce PR</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_#f97316]" />
                        <span className="text-white text-sm">Técnico em Campo Ativo</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-gray-600" />
                        <span className="text-gray-500 text-sm">Abertura de Novo CD</span>
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
            
            <div className="flex items-center justify-between">
              <h2 className="text-white text-2xl font-light tracking-tight flex items-center gap-3">
                <Network className="w-6 h-6 text-cyan-400" /> Arquitetura do Negócio
              </h2>
              <span className="text-cyan-500 text-xs font-bold uppercase tracking-widest border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 rounded-full">
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
                <div className="bg-gradient-to-br from-[#111111] to-[#0a0a0a] border border-white/5 rounded-3xl p-6 group hover:border-pink-500/30 transition-all shadow-lg relative overflow-hidden">
                  <Fingerprint className="absolute -right-2 -bottom-2 w-24 h-24 text-pink-500/5 group-hover:text-pink-500/10 transition-colors" />
                  <div className="flex items-center gap-3 mb-4 relative z-10">
                    <div className="p-2 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400">
                      <Paintbrush className="w-5 h-5" />
                    </div>
                    <h3 className="text-white font-bold text-lg">Criação de Marca & Marketing</h3>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed font-light mb-4 relative z-10">
                    Desenvolvimento do Brand Book, produção de conteúdo visual, vídeos virais para TikTok/IG e alinhamento estético de todas as embalagens e anúncios.
                  </p>
                  <div className="flex flex-wrap gap-2 relative z-10">
                    <span className="bg-white/5 text-gray-300 text-[10px] uppercase font-bold px-2 py-1 rounded-md">Identidade Visual</span>
                    <span className="bg-white/5 text-gray-300 text-[10px] uppercase font-bold px-2 py-1 rounded-md">Social Media</span>
                    <span className="bg-white/5 text-gray-300 text-[10px] uppercase font-bold px-2 py-1 rounded-md">Demandas de Arte</span>
                  </div>
                </div>

                {/* Card: Marketplaces */}
                <div className="bg-gradient-to-br from-[#111111] to-[#0a0a0a] border border-white/5 rounded-3xl p-6 group hover:border-yellow-500/30 transition-all shadow-lg relative overflow-hidden">
                  <ShoppingBag className="absolute -right-2 -bottom-2 w-24 h-24 text-yellow-500/5 group-hover:text-yellow-500/10 transition-colors" />
                  <div className="flex items-center gap-3 mb-4 relative z-10">
                    <div className="p-2 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                    <h3 className="text-white font-bold text-lg">Ecossistema de Marketplaces</h3>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed font-light mb-4 relative z-10">
                    Nosso principal motor de tração. Múltiplas contas gerenciadas com estratégias agressivas de precificação, Ads e catálogo de alta conversão.
                  </p>
                  <div className="flex flex-wrap gap-2 relative z-10">
                    <span className="bg-[#FFE600]/10 border border-[#FFE600]/20 text-[#FFE600] text-[10px] uppercase font-bold px-2 py-1 rounded-md">Mercado Livre (Principal & Loja 2)</span>
                    <span className="bg-[#EE4D2D]/10 border border-[#EE4D2D]/20 text-[#EE4D2D] text-[10px] uppercase font-bold px-2 py-1 rounded-md">Shopee</span>
                    <span className="bg-[#FF9900]/10 border border-[#FF9900]/20 text-[#FF9900] text-[10px] uppercase font-bold px-2 py-1 rounded-md">Amazon</span>
                  </div>
                </div>

                {/* Card: Site / E-commerce Próprio */}
                <div className="bg-gradient-to-br from-[#111111] to-[#0a0a0a] border border-white/5 rounded-3xl p-6 group hover:border-blue-500/30 transition-all shadow-lg relative overflow-hidden">
                  <Globe className="absolute -right-2 -bottom-2 w-24 h-24 text-blue-500/5 group-hover:text-blue-500/10 transition-colors" />
                  <div className="flex items-center gap-3 mb-4 relative z-10">
                    <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                      <Globe className="w-5 h-5" />
                    </div>
                    <h3 className="text-white font-bold text-lg">Site Próprio & Serviços</h3>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed font-light mb-4 relative z-10">
                    E-commerce independente para fugir das taxas abusivas, focando em clientes fidelizados, kits customizados e o agendamento de serviços em campo (Técnicos).
                  </p>
                  <div className="flex flex-wrap gap-2 relative z-10">
                    <span className="bg-white/5 text-gray-300 text-[10px] uppercase font-bold px-2 py-1 rounded-md">Vendas Diretas</span>
                    <span className="bg-white/5 text-gray-300 text-[10px] uppercase font-bold px-2 py-1 rounded-md">Instalações em Campo</span>
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
                <div className="bg-gradient-to-br from-[#111111] to-[#0a0a0a] border border-white/5 rounded-3xl p-6 group hover:border-purple-500/30 transition-all shadow-lg relative overflow-hidden">
                  <Code2 className="absolute -left-2 -bottom-2 w-24 h-24 text-purple-500/5 group-hover:text-purple-500/10 transition-colors" />
                  <div className="flex items-center gap-3 mb-4 relative z-10">
                    <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                      <Server className="w-5 h-5" />
                    </div>
                    <h3 className="text-white font-bold text-lg">Sistemas de Pedidos & Integração</h3>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed font-light mb-4 relative z-10">
                    O cérebro que captura vendas de todos os canais. Sincronização de estoque multicanal (Hub/Bling), emissão de NF-e automatizada e roteirização.
                  </p>
                  <div className="flex flex-wrap gap-2 relative z-10">
                    <span className="bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] uppercase font-bold px-2 py-1 rounded-md">Hub de Integração</span>
                    <span className="bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] uppercase font-bold px-2 py-1 rounded-md">Emissor NF-e</span>
                  </div>
                </div>

                {/* Card: Sistema Interno */}
                <div className="bg-gradient-to-br from-[#111111] to-[#0a0a0a] border border-white/5 rounded-3xl p-6 group hover:border-emerald-500/30 transition-all shadow-lg relative overflow-hidden">
                  <Cpu className="absolute -left-2 -bottom-2 w-24 h-24 text-emerald-500/5 group-hover:text-emerald-500/10 transition-colors" />
                  <div className="flex items-center gap-3 mb-4 relative z-10">
                    <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      <Layers className="w-5 h-5" />
                    </div>
                    <h3 className="text-white font-bold text-lg">Sistema Interno (ERP & Painéis)</h3>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed font-light mb-4 relative z-10">
                    Este próprio sistema (Rama Flow OS). Centralização de gestão de equipe, metas, fluxo de suprimentos, divergências, finanças e tomada de decisão estratégica.
                  </p>
                  <div className="flex flex-wrap gap-2 relative z-10">
                    <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] uppercase font-bold px-2 py-1 rounded-md">Dashboard Financeiro</span>
                    <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] uppercase font-bold px-2 py-1 rounded-md">Organograma (Equipe)</span>
                    <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] uppercase font-bold px-2 py-1 rounded-md">Compras</span>
                  </div>
                </div>

                {/* Card: Expedição (Rama Flow) */}
                <div className="bg-gradient-to-br from-[#111111] to-[#0a0a0a] border border-white/5 rounded-3xl p-6 group hover:border-[#00FF00]/30 transition-all shadow-lg relative overflow-hidden">
                  <Box className="absolute -left-2 -bottom-2 w-24 h-24 text-[#00FF00]/5 group-hover:text-[#00FF00]/10 transition-colors" />
                  <div className="flex items-center gap-3 mb-4 relative z-10">
                    <div className="p-2 rounded-xl bg-[#00FF00]/10 border border-[#00FF00]/20 text-[#00FF00]">
                      <Box className="w-5 h-5" />
                    </div>
                    <h3 className="text-white font-bold text-lg">Expedição (Rama Flow)</h3>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed font-light mb-4 relative z-10">
                    O coração físico do negócio. Layout inteligente de bancadas, conferência bipada, Radar Logístico de envios (Flex/Agência) e gestão de embalagens otimizada.
                  </p>
                  <div className="flex flex-wrap gap-2 relative z-10">
                    <span className="bg-[#00FF00]/10 border border-[#00FF00]/20 text-[#00FF00] text-[10px] uppercase font-bold px-2 py-1 rounded-md">Portal de Expedição</span>
                    <span className="bg-[#00FF00]/10 border border-[#00FF00]/20 text-[#00FF00] text-[10px] uppercase font-bold px-2 py-1 rounded-md">Divergências</span>
                    <span className="bg-[#00FF00]/10 border border-[#00FF00]/20 text-[#00FF00] text-[10px] uppercase font-bold px-2 py-1 rounded-md">Radar Operacional</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

        {activeTab === "app" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col items-center">
            <div className="text-center mb-8">
              <h2 className="text-white text-3xl font-light tracking-tight">O Futuro do E-commerce</h2>
              <p className="text-gray-400 font-light max-w-lg mt-2 mx-auto">
                Simulação da nossa futura plataforma proprietária: uma experiência nativa de compra guiada por 
                vídeos curtos e avaliações reais.
              </p>
            </div>

            {/* Simulação do Celular */}
            <div className="relative w-[340px] h-[720px] bg-black rounded-[3rem] border-[8px] border-[#1A1A1A] shadow-2xl overflow-hidden flex flex-col ring-1 ring-white/10">
              
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#1A1A1A] rounded-b-3xl z-50" />

              {/* Status Bar */}
              <div className="absolute top-0 w-full h-12 flex justify-between items-center px-6 z-40 text-white text-[10px] font-medium pt-2">
                <span>9:41</span>
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full border border-white/50" />
                  <div className="w-3 h-3 rounded-full border border-white/50" />
                  <div className="w-4 h-3 bg-white/80 rounded-[2px]" />
                </div>
              </div>

              {/* Feed de Vídeo (TikTok Style) */}
              <div className="relative flex-1 bg-[#111] overflow-hidden group cursor-pointer">
                
                {/* Vídeo / Imagem de Fundo Simulando o Feed */}
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540569014015-19a7be504e3a?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-60 mix-blend-luminosity" />
                
                {/* Gradientes para Leitura */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90" />

                {/* Overlays do Feed */}
                <div className="absolute bottom-0 left-0 w-full p-4 pb-20 flex justify-between items-end">
                  
                  {/* Info do Produto (Esquerda) */}
                  <div className="flex-1 pr-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-xs shadow-lg">
                        RF
                      </div>
                      <span className="text-white font-medium text-sm drop-shadow-md">@ramaflow</span>
                      <span className="bg-white/20 text-white text-[9px] px-1.5 py-0.5 rounded-sm backdrop-blur-sm">Patrocinado</span>
                    </div>
                    <p className="text-white text-sm font-light mb-3 drop-shadow-md line-clamp-2">
                      Testei o Kit de Instalação de Gás com Válvula de Segurança da Rama Flow. Olha a facilidade e a economia! 🔥🛠️
                    </p>
                    
                    {/* Card do Produto Linkado */}
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3 flex gap-3 items-center cursor-pointer hover:bg-white/20 transition-colors shadow-lg">
                      <div className="w-12 h-12 bg-black/40 rounded-lg flex items-center justify-center border border-white/10">
                        <Box className="text-[#00FF00] w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white text-xs font-bold leading-tight">Kit Mangueira + Registro</h4>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-[#00FF00] font-bold text-sm">R$ 89,90</span>
                          <span className="text-gray-400 text-[10px] line-through">R$ 120</span>
                        </div>
                      </div>
                      <div className="bg-[#00FF00] text-black w-8 h-8 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(0,255,0,0.4)]">
                        <ShoppingCart className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Interações (Direita) */}
                  <div className="flex flex-col items-center gap-4 pb-4">
                    <div className="flex flex-col items-center gap-1 group/btn">
                      <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 group-hover/btn:bg-white/20 transition-colors shadow-lg">
                        <Heart className="w-5 h-5 text-white" fill="white" />
                      </div>
                      <span className="text-white text-[10px] font-bold drop-shadow-md">12.4k</span>
                    </div>
                    
                    <div className="flex flex-col items-center gap-1 group/btn">
                      <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 group-hover/btn:bg-white/20 transition-colors shadow-lg">
                        <MessageCircle className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-white text-[10px] font-bold drop-shadow-md">842</span>
                    </div>

                    <div className="flex flex-col items-center gap-1 group/btn">
                      <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 group-hover/btn:bg-white/20 transition-colors shadow-lg">
                        <Share2 className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-white text-[10px] font-bold drop-shadow-md">2k</span>
                    </div>
                  </div>

                </div>

                {/* Reviews Overlay Flutuante (Simulando comentários pulando na tela) */}
                <div className="absolute top-1/4 left-4 right-16 space-y-3 pointer-events-none opacity-90">
                   <div className="bg-black/60 backdrop-blur-md p-2.5 rounded-xl border border-white/10 w-fit animate-pulse shadow-lg">
                     <span className="text-white text-[10px] font-bold block mb-0.5">João M.</span>
                     <p className="text-gray-200 text-xs font-light">Produto top! Chegou no mesmo dia. 🙌</p>
                   </div>
                   <div className="bg-black/60 backdrop-blur-md p-2.5 rounded-xl border border-white/10 w-fit ml-8 animate-pulse delay-150 shadow-lg">
                     <span className="text-white text-[10px] font-bold block mb-0.5">Marcia T.</span>
                     <p className="text-gray-200 text-xs font-light">Excelente, técnico super educado!</p>
                   </div>
                </div>

              </div>

              {/* Barra de Navegação Inferior (App) */}
              <div className="h-16 bg-[#111] border-t border-white/10 flex justify-around items-center px-2 z-40 relative">
                <div className="flex flex-col items-center gap-1 text-gray-500 cursor-pointer hover:text-white transition-colors">
                  <Home className="w-5 h-5" />
                  <span className="text-[8px] font-bold uppercase tracking-wider">Início</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-gray-500 cursor-pointer hover:text-white transition-colors">
                  <Search className="w-5 h-5" />
                  <span className="text-[8px] font-bold uppercase tracking-wider">Buscar</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-[#00FF00] cursor-pointer -mt-4">
                  <div className="w-12 h-10 rounded-xl bg-white flex items-center justify-center relative shadow-[0_0_20px_rgba(255,255,255,0.4)]">
                    <div className="absolute -left-1 w-1 h-4 bg-[#00FF00] rounded-l-sm" />
                    <div className="absolute -right-1 w-1 h-4 bg-red-500 rounded-r-sm" />
                    <Play className="w-5 h-5 text-black ml-0.5" fill="black" />
                  </div>
                </div>
                <div className="flex flex-col items-center gap-1 text-gray-500 cursor-pointer hover:text-white transition-colors relative">
                  <ShoppingCart className="w-5 h-5" />
                  <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#00FF00] rounded-full border-2 border-[#111]" />
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
