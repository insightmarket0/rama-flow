import React, { useState } from 'react';
import { Rocket, Paintbrush, MonitorPlay, Truck, CheckCircle2, ChevronRight, Edit2, Play, Check, Plus, GripVertical, History, Palette, Clock, MapPin, Calendar, HeartHandshake, Code, Box, CheckSquare } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function BrandHub() {
  const [slogans, setSlogans] = useState({
    ideas: ["A arte de morar bem.", "O toque que faltava.", "Conforto e design para você."],
    refining: ["Sua casa, nossa arte."],
    testing: ["Transformando espaços."],
    approved: []
  });

  return (
    <div className="flex flex-col h-full bg-[#0A0A0A] text-white p-8 overflow-y-auto">
      
      {/* HEADER */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light tracking-tight mb-1">
            Gestão de <span className="font-bold text-cyan-400">Marca & Expansão</span>
          </h1>
          <p className="text-gray-500 text-sm">Centro de comando estratégico da Rama.</p>
        </div>
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10 border-2 border-white/10">
            <AvatarImage src="https://i.pravatar.cc/150?u=will" />
            <AvatarFallback>WI</AvatarFallback>
          </Avatar>
        </div>
      </div>

      <Tabs defaultValue="identidade" className="w-full">
        <TabsList className="bg-[#111] border border-white/10 p-1 mb-6 rounded-xl h-auto">
          <TabsTrigger value="identidade" className="data-[state=active]:bg-[#222] data-[state=active]:text-cyan-400 px-6 py-2.5 rounded-lg text-sm font-medium transition-all">
            <Paintbrush className="w-4 h-4 mr-2" />
            1. Identidade e Evolução
          </TabsTrigger>
          <TabsTrigger value="ecommerce" className="data-[state=active]:bg-[#222] data-[state=active]:text-cyan-400 px-6 py-2.5 rounded-lg text-sm font-medium transition-all">
            <MonitorPlay className="w-4 h-4 mr-2" />
            2. E-Commerce & Logística
          </TabsTrigger>
          <TabsTrigger value="instaladores" className="data-[state=active]:bg-[#222] data-[state=active]:text-cyan-400 px-6 py-2.5 rounded-lg text-sm font-medium transition-all">
            <Truck className="w-4 h-4 mr-2" />
            3. Operação Instaladores
          </TabsTrigger>
        </TabsList>

        {/* ======================= ABA 1: IDENTIDADE ======================= */}
        <TabsContent value="identidade" className="flex flex-col gap-6 outline-none">
          
          {/* Slogan Kanban */}
          <div className="bg-[#111] border border-white/5 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold tracking-tight text-white/90">Painel de Ideação do Slogan</h3>
              <button className="bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-2">
                <Plus className="w-3 h-3" /> Nova Ideia
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Ideias Soltas */}
              <div className="bg-[#161618] border border-white/5 rounded-xl p-4 flex flex-col gap-3">
                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 border-b border-white/5 pb-2">Ideias Soltas</h4>
                {slogans.ideas.map((s, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-gray-300 flex gap-2 cursor-grab">
                    <GripVertical className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
                    <span>"{s}"</span>
                  </div>
                ))}
              </div>
              
              {/* Em Refinamento */}
              <div className="bg-[#161618] border border-white/5 rounded-xl p-4 flex flex-col gap-3">
                <h4 className="text-xs font-bold uppercase tracking-widest text-amber-500 border-b border-white/5 pb-2">Em Refinamento</h4>
                {slogans.refining.map((s, i) => (
                  <div key={i} className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 text-sm text-amber-100 flex gap-2 cursor-grab">
                    <GripVertical className="w-4 h-4 text-amber-600/50 flex-shrink-0 mt-0.5" />
                    <span>"{s}"</span>
                  </div>
                ))}
              </div>

              {/* Testes com Público */}
              <div className="bg-[#161618] border border-white/5 rounded-xl p-4 flex flex-col gap-3">
                <h4 className="text-xs font-bold uppercase tracking-widest text-blue-400 border-b border-white/5 pb-2">Testes c/ Público</h4>
                {slogans.testing.map((s, i) => (
                  <div key={i} className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-sm text-blue-100 flex gap-2 cursor-grab">
                    <GripVertical className="w-4 h-4 text-blue-600/50 flex-shrink-0 mt-0.5" />
                    <span>"{s}"</span>
                  </div>
                ))}
              </div>

              {/* Aprovado */}
              <div className="bg-[#161618] border border-emerald-500/10 rounded-xl p-4 flex flex-col gap-3 shadow-[0_0_15px_rgba(16,185,129,0.05)]">
                <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-500 border-b border-white/5 pb-2">Aprovado Oficial</h4>
                {slogans.approved.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center border-2 border-dashed border-emerald-500/20 rounded-lg p-4">
                    <span className="text-xs text-emerald-500/50 text-center">Arraste o slogan campeão aqui</span>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Controle de Versão Visual */}
            <div className="bg-[#111] border border-white/5 rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-semibold tracking-tight text-white/90 mb-4 flex items-center gap-2">
                <History className="w-4 h-4 text-gray-400" />
                Controle de Versão Visual
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#0A0A0A] rounded flex items-center justify-center border border-white/10">
                      <span className="font-bold text-cyan-400">R</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-emerald-400">Dark Mode V2 (Atual)</p>
                      <p className="text-xs text-gray-400">Ajuste de contraste no Cyan.</p>
                    </div>
                  </div>
                  <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-1 rounded">ATIVO</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl opacity-60">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded flex items-center justify-center border border-gray-200">
                      <span className="font-bold text-black">R</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-300">Light Mode V1</p>
                      <p className="text-xs text-gray-500">Versão original.</p>
                    </div>
                  </div>
                  <span className="bg-gray-500/20 text-gray-400 text-[10px] font-bold px-2 py-1 rounded">DEPRECADO</span>
                </div>
              </div>
            </div>

            {/* Brandbook Rápido */}
            <div className="bg-[#111] border border-white/5 rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-semibold tracking-tight text-white/90 mb-4 flex items-center gap-2">
                <Palette className="w-4 h-4 text-gray-400" />
                Brandbook Rápido
              </h3>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block mb-2">Cores Oficiais (HEX)</span>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-[#0A0A0A] border border-white/20"></div><span className="text-xs font-mono text-gray-300">#0A0A0A</span></div>
                    <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-[#22D3EE]"></div><span className="text-xs font-mono text-gray-300">#22D3EE</span></div>
                    <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-[#3B82F6]"></div><span className="text-xs font-mono text-gray-300">#3B82F6</span></div>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block mb-2">Tipografia</span>
                  <p className="text-sm font-medium text-gray-300">Inter / Roboto</p>
                  <p className="text-xs text-gray-500 mt-1">Pesos: Light, Medium, Bold</p>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block mb-2">Tom de Voz</span>
                <p className="text-sm text-gray-300 bg-[#161618] p-3 rounded-lg border border-white/5 italic">
                  "Profissional, acolhedor e direto. Focamos em transformar espaços com arte e eficiência, sem jargões complicados."
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ======================= ABA 2: E-COMMERCE ======================= */}
        <TabsContent value="ecommerce" className="flex flex-col gap-6 outline-none">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Roadmap */}
            <div className="bg-[#111] border border-white/5 rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-semibold tracking-tight text-white/90 mb-6 flex items-center gap-2">
                <Code className="w-4 h-4 text-cyan-400" />
                Roadmap de Desenvolvimento (Site)
              </h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3 border-b border-white/5 pb-2">Front-End (Experiência do Cliente)</h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg cursor-pointer transition-colors">
                      <input type="checkbox" defaultChecked className="accent-cyan-500 w-4 h-4 rounded" />
                      <span className="text-sm text-gray-300 line-through opacity-50">Layout da Home Page</span>
                    </label>
                    <label className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg cursor-pointer transition-colors">
                      <input type="checkbox" className="accent-cyan-500 w-4 h-4 rounded" />
                      <span className="text-sm text-white/90">Otimização da Página de Produto (Mobile)</span>
                    </label>
                    <label className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg cursor-pointer transition-colors">
                      <input type="checkbox" className="accent-cyan-500 w-4 h-4 rounded" />
                      <span className="text-sm text-white/90">Fluxo de Carrinho e Checkout</span>
                    </label>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3 border-b border-white/5 pb-2">Back-End (Integrações)</h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg cursor-pointer transition-colors">
                      <input type="checkbox" className="accent-cyan-500 w-4 h-4 rounded" />
                      <span className="text-sm text-white/90">Gateway de Pagamento (Stripe/MercadoPago)</span>
                    </label>
                    <label className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg cursor-pointer transition-colors">
                      <input type="checkbox" className="accent-cyan-500 w-4 h-4 rounded" />
                      <span className="text-sm text-white/90">Integração com ERP (Baixa de Estoque)</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Módulo Entrega Rápida */}
            <div className="bg-[#111] border border-white/5 rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-semibold tracking-tight text-white/90 mb-2 flex items-center gap-2">
                <Box className="w-4 h-4 text-emerald-400" />
                Módulo de Entrega Rápida
              </h3>
              <p className="text-sm text-gray-400 mb-6">Controle rigoroso entre o clique do cliente e a separação no estoque.</p>
              
              <div className="bg-[#161618] border border-emerald-500/20 rounded-xl p-5 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold text-white">Status da Integração (Frete)</span>
                  <span className="bg-amber-500/20 text-amber-400 text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1">
                    <Clock className="w-3 h-3" /> EM HOMOLOGAÇÃO
                  </span>
                </div>
                <div className="w-full bg-black rounded-full h-1.5">
                  <div className="bg-amber-400 h-1.5 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>

              <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3 border-b border-white/5 pb-2">Regras de Negócio (Configurações)</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-300">Raio de Cobertura</span>
                  </div>
                  <span className="text-sm font-bold text-cyan-400">Até 30km</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-300">Horário de Corte (Mesmo dia)</span>
                  </div>
                  <span className="text-sm font-bold text-cyan-400">Até 14h00</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-300">Tempo de Separação SLA</span>
                  </div>
                  <span className="text-sm font-bold text-cyan-400">45 minutos</span>
                </div>
              </div>
            </div>
            
          </div>
        </TabsContent>

        {/* ======================= ABA 3: INSTALADORES ======================= */}
        <TabsContent value="instaladores" className="flex flex-col gap-6 outline-none">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Fluxo de Agendamento */}
            <div className="bg-[#111] border border-white/5 rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-semibold tracking-tight text-white/90 mb-4 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-400" />
                Fluxo de Agendamento
              </h3>
              <p className="text-sm text-gray-400 mb-6 leading-relaxed">Venda e agendamento ocorrendo no mesmo fluxo do checkout.</p>
              
              <div className="relative pl-6 border-l-2 border-white/10 space-y-6">
                <div className="relative">
                  <div className="absolute -left-[31px] bg-emerald-500 rounded-full p-1 border-4 border-[#111]">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <h4 className="text-sm font-semibold text-white">Cliente seleciona "Com Instalação"</h4>
                </div>
                <div className="relative">
                  <div className="absolute -left-[31px] bg-blue-500 rounded-full p-1 border-4 border-[#111]">
                    <div className="w-3 h-3 bg-transparent rounded-full" />
                  </div>
                  <h4 className="text-sm font-semibold text-white">Integrar Calendário no Checkout</h4>
                  <p className="text-xs text-gray-500 mt-1">Buscar slots livres na agenda dos instaladores baseados no CEP.</p>
                  <span className="mt-2 inline-block bg-blue-500/20 text-blue-400 text-[10px] font-bold px-2 py-1 rounded">EM DESENVOLVIMENTO</span>
                </div>
                <div className="relative">
                  <div className="absolute -left-[31px] bg-[#222] rounded-full p-1 border-4 border-[#111]">
                    <div className="w-3 h-3" />
                  </div>
                  <h4 className="text-sm font-semibold text-gray-400">Confirmação via WhatsApp</h4>
                  <p className="text-xs text-gray-500 mt-1">Disparo automático após pagamento.</p>
                </div>
              </div>
            </div>

            {/* Gestão da Frota / App */}
            <div className="bg-[#111] border border-white/5 rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-semibold tracking-tight text-white/90 mb-4 flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-400" />
                Gestão & App do Instalador
              </h3>
              <p className="text-sm text-gray-400 mb-6 leading-relaxed">Ferramentas de campo para coordenação de agendas e rotas.</p>
              
              <div className="space-y-4">
                <div className="p-4 bg-[#161618] border border-white/5 rounded-xl flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-amber-400 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Roteirização por GPS</h4>
                    <p className="text-xs text-gray-400 mt-1">Agrupamento de instalações por região geográfica para otimização de combustível.</p>
                  </div>
                </div>
                <div className="p-4 bg-[#161618] border border-white/5 rounded-xl flex items-start gap-3">
                  <CheckSquare className="w-5 h-5 text-emerald-400 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Checklists de Conclusão</h4>
                    <p className="text-xs text-gray-400 mt-1">Obrigatoriedade de foto do serviço finalizado e assinatura digital do cliente.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Protocolo de Atendimento */}
            <div className="bg-[#111] border border-white/5 rounded-2xl p-6 shadow-xl flex flex-col">
              <h3 className="text-lg font-semibold tracking-tight text-white/90 mb-4 flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-pink-400" />
                Protocolo de Atendimento
              </h3>
              <p className="text-sm text-gray-400 mb-4">Diretrizes de postura. O instalador é a representação física da marca na casa do cliente.</p>
              
              <div className="flex-1 bg-gradient-to-br from-pink-500/10 to-purple-500/5 border border-pink-500/20 rounded-xl p-5">
                <h4 className="text-sm font-bold text-pink-400 mb-3">Manifesto do Instalador</h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-pink-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-200">Limpeza total pós-serviço.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-pink-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-200">Uso obrigatório de propé (proteção para calçados).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-pink-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-200">Comunicação baseada no tom de voz: Profissional e Acolhedor.</span>
                  </li>
                </ul>
              </div>
            </div>

          </div>
        </TabsContent>

      </Tabs>
    </div>
  );
}
