import React, { useState } from "react";
import { Asterisk, Terminal, Database, Code2, Rocket, Server, GitBranch, Github, Layout, CheckCircle2, Circle, Clock, Bug, Sparkles } from "lucide-react";

export default function SistemaDev() {
  const [activeTab, setActiveTab] = useState("visao-geral");

  return (
    <div className="flex-1 p-6 md:p-8 animate-in fade-in duration-500 max-w-7xl mx-auto w-full">
      
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00FF00] shadow-[0_0_8px_rgba(0,255,0,0.8)] animate-pulse" />
            <span className="text-[#00FF00] text-xs font-bold uppercase tracking-[0.2em]">Dev Center</span>
          </div>
          <h2 className="text-4xl font-light tracking-tight text-white flex items-center gap-3">
            <Terminal className="h-8 w-8 text-gray-400" />
            Rama System Hub
          </h2>
          <p className="text-gray-500 mt-2">
            Acompanhamento do desenvolvimento, arquitetura e documentação do sistema (Alyson Dev).
          </p>
        </div>

        <div className="flex bg-[#111111] p-1 rounded-xl border border-white/5 w-fit">
          <button 
            onClick={() => setActiveTab("visao-geral")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "visao-geral" ? "bg-white/10 text-white" : "text-gray-500 hover:text-gray-300"}`}
          >
            Visão Geral
          </button>
          <button 
            onClick={() => setActiveTab("tarefas")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "tarefas" ? "bg-white/10 text-white" : "text-gray-500 hover:text-gray-300"}`}
          >
            Acompanhamento Dev
          </button>
          <button 
            onClick={() => setActiveTab("arquitetura")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "arquitetura" ? "bg-white/10 text-white" : "text-gray-500 hover:text-gray-300"}`}
          >
            Arquitetura
          </button>
        </div>
      </div>

      {activeTab === "visao-geral" && (
        <div className="space-y-6">
          {/* LINHA 9 - FULL WIDTH: O Sistema Interno */}
          <div className="md:col-span-3 row-span-2 bg-gradient-to-r from-blue-600 to-indigo-800 rounded-[2rem] p-6 lg:p-8 flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden">
             <div className="absolute inset-0 bg-black/10" />
             <div className="md:w-1/3 relative z-10 mb-6 md:mb-0">
               <h4 className="text-white/80 text-[10px] lg:text-xs font-bold uppercase tracking-widest flex items-center gap-2 mb-2">
                 <Asterisk className="w-4 h-4" /> O Cérebro da Operação
               </h4>
               <h3 className="text-white text-2xl lg:text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                 Sistema Interno
               </h3>
               <p className="text-white/80 text-xs mt-2 font-medium">
                 Tudo que um dono de marketplace precisa em um único lugar.
               </p>
             </div>
             
             <div className="md:w-2/3 flex flex-wrap gap-3 relative z-10">
               <div className="flex-1 min-w-[200px] bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl">
                 <strong className="text-white block text-sm mb-1">Previsibilidade</strong>
                 <p className="text-white/70 text-xs">Visão clara de quais pedidos fazer ao fornecedor.</p>
               </div>
               <div className="flex-1 min-w-[200px] bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl">
                 <strong className="text-white block text-sm mb-1">Automação Financeira</strong>
                 <p className="text-white/70 text-xs">Pagar contas sozinho e conciliação exata de recebíveis dos marketplaces.</p>
               </div>
               <div className="flex-1 min-w-[200px] bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl">
                 <strong className="text-white block text-sm mb-1">Análise de Gargalos</strong>
                 <p className="text-white/70 text-xs">Dashboard inteligente para identificar e resolver gargalos logísticos e operacionais.</p>
               </div>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-8 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#00FF00]/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 pointer-events-none group-hover:bg-[#00FF00]/10 transition-colors duration-700" />
              
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Rocket className="h-5 w-5 text-[#00FF00]" />
                O que é o Rama System?
              </h3>
              <p className="text-gray-400 leading-relaxed mb-6">
                O Rama System (ou Rama Flow) é a espinha dorsal operacional da empresa. 
                Construído para centralizar demandas, controle financeiro, expedição e marketing em uma única plataforma ultra-rápida, 
                removendo a dependência de planilhas dispersas e centralizando o conhecimento corporativo.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#111] p-4 rounded-xl border border-white/5">
                  <Database className="h-5 w-5 text-blue-400 mb-2" />
                  <h4 className="text-white font-bold text-sm mb-1">Banco de Dados</h4>
                  <p className="text-xs text-gray-500">Supabase (PostgreSQL) com RLS para segurança de nível de linha.</p>
                </div>
                <div className="bg-[#111] p-4 rounded-xl border border-white/5">
                  <Layout className="h-5 w-5 text-pink-400 mb-2" />
                  <h4 className="text-white font-bold text-sm mb-1">Frontend (UI)</h4>
                  <p className="text-xs text-gray-500">React + Vite + TailwindCSS. Focado em UX minimalista e glassmorphism.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               <div className="bg-[#111111] border border-white/5 rounded-2xl p-6">
                 <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                   <GitBranch className="h-4 w-4 text-orange-400" />
                   Versão Atual
                 </h3>
                 <div className="flex items-end gap-3 mb-2">
                   <span className="text-4xl font-light text-white">v2.4.0</span>
                   <span className="text-[#00FF00] text-sm font-bold mb-1">Estável</span>
                 </div>
                 <p className="text-xs text-gray-500">Último deploy há 2 dias</p>
               </div>

               <div className="bg-[#111111] border border-white/5 rounded-2xl p-6">
                 <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                   <Github className="h-4 w-4 text-white" />
                   Repositório
                 </h3>
                 <p className="text-sm text-gray-400 mb-4">Código fonte versionado e mantido no GitHub.</p>
                 <button className="w-full py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-xs font-bold transition-colors">
                   Acessar Código
                 </button>
               </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-[#0A0A0A] border border-[#222] rounded-2xl p-6 shadow-xl">
              <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-yellow-400" />
                Últimas Atualizações
              </h3>
              
              <div className="space-y-5 relative before:absolute before:inset-y-0 before:left-[7px] before:w-px before:bg-white/10">
                <div className="relative pl-6">
                  <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-[#111] border-2 border-[#00FF00] z-10" />
                  <p className="text-sm text-white font-medium">Mural de Ajustes</p>
                  <p className="text-xs text-gray-500 mt-1">Redesign completo do painel de auditoria e tickets.</p>
                  <span className="text-[10px] text-[#00FF00] font-bold uppercase mt-2 block">Hoje</span>
                </div>
                <div className="relative pl-6">
                  <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-[#111] border-2 border-gray-600 z-10" />
                  <p className="text-sm text-gray-300 font-medium">Portal de Expedição</p>
                  <p className="text-xs text-gray-500 mt-1">Sistema de bipes e conferência de caixas integrado.</p>
                  <span className="text-[10px] text-gray-600 font-bold uppercase mt-2 block">Há 3 dias</span>
                </div>
                <div className="relative pl-6">
                  <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-[#111] border-2 border-gray-600 z-10" />
                  <p className="text-sm text-gray-300 font-medium">Controle Financeiro</p>
                  <p className="text-xs text-gray-500 mt-1">Módulo de contratos inteligentes e comissões.</p>
                  <span className="text-[10px] text-gray-600 font-bold uppercase mt-2 block">Há 1 semana</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      )}

      {activeTab === "tarefas" && (
        <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-light text-white mb-1">Acompanhamento Alyson Dev</h3>
              <p className="text-sm text-gray-500">Kanban de tarefas de desenvolvimento ativo.</p>
            </div>
            <button className="px-4 py-2 bg-[#00FF00]/10 hover:bg-[#00FF00]/20 text-[#00FF00] rounded-lg text-sm font-bold transition-colors">
              + Nova Tarefa Dev
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* A Fazer */}
            <div className="bg-[#111111] rounded-xl p-4 border border-white/5">
              <h4 className="text-white font-bold mb-4 flex items-center justify-between">
                <span>A Fazer (Backlog)</span>
                <span className="bg-white/10 px-2 py-0.5 rounded text-xs">3</span>
              </h4>
              <div className="space-y-3">
                <div className="bg-black/40 p-4 rounded-lg border border-white/5 cursor-pointer hover:border-white/20 transition-colors">
                  <span className="text-[9px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded uppercase font-bold tracking-wider mb-2 inline-block">Nova Feature</span>
                  <p className="text-sm text-gray-300 font-medium mb-3">Módulo de Integração com Bling ERP</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Sprint 4</span>
                    <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[9px] text-white">AD</span>
                  </div>
                </div>
                <div className="bg-black/40 p-4 rounded-lg border border-white/5 cursor-pointer hover:border-white/20 transition-colors">
                  <span className="text-[9px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded uppercase font-bold tracking-wider mb-2 inline-block">Refatoração</span>
                  <p className="text-sm text-gray-300 font-medium mb-3">Otimizar queries do Dashboard Financeiro</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Backlog</span>
                    <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[9px] text-white">AD</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Em Progresso */}
            <div className="bg-[#111111] rounded-xl p-4 border border-[#00FF00]/10 shadow-[0_0_20px_rgba(0,255,0,0.02)]">
              <h4 className="text-[#00FF00] font-bold mb-4 flex items-center justify-between">
                <span className="flex items-center gap-2"><Circle className="h-3 w-3 animate-pulse fill-[#00FF00]" /> Em Progresso</span>
                <span className="bg-[#00FF00]/10 px-2 py-0.5 rounded text-xs text-[#00FF00]">1</span>
              </h4>
              <div className="space-y-3">
                <div className="bg-black/60 p-4 rounded-lg border border-[#00FF00]/20 cursor-pointer hover:border-[#00FF00]/40 transition-colors relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#00FF00] to-transparent opacity-50" />
                  <span className="text-[9px] bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded uppercase font-bold tracking-wider mb-2 inline-block">Bugfix</span>
                  <p className="text-sm text-gray-200 font-medium mb-3">Correção no salvamento do Mural de Ajustes</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="text-[#00FF00] text-[10px] font-bold uppercase">Hoje</span>
                    <span className="w-5 h-5 rounded-full bg-[#00FF00]/20 border border-[#00FF00]/50 flex items-center justify-center text-[9px] text-[#00FF00] font-bold">AD</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Concluído */}
            <div className="bg-[#111111] rounded-xl p-4 border border-white/5">
              <h4 className="text-gray-400 font-bold mb-4 flex items-center justify-between">
                <span>Concluído</span>
                <span className="bg-white/10 px-2 py-0.5 rounded text-xs">22</span>
              </h4>
              <div className="space-y-3 opacity-60">
                <div className="bg-black/40 p-4 rounded-lg border border-white/5">
                  <span className="text-[9px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded uppercase font-bold tracking-wider mb-2 inline-block">Deploy</span>
                  <p className="text-sm text-gray-400 font-medium mb-3 line-through">Lembretes e Workspace Pessoal</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1 text-green-500"><CheckCircle2 className="h-3 w-3" /> Finalizado</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "arquitetura" && (
        <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[400px]">
          <Server className="h-16 w-16 text-gray-700 mb-4" />
          <h3 className="text-xl text-white font-bold mb-2">Mapeamento de Arquitetura</h3>
          <p className="text-gray-500 max-w-md text-center mb-6">
            Esta seção detalhará a modelagem de banco de dados, fluxos de autenticação e comunicação com APIs externas.
          </p>
          <button className="px-6 py-2 border border-white/10 hover:bg-white/5 rounded-lg text-sm text-white transition-colors">
            Adicionar Diagrama
          </button>
        </div>
      )}
    </div>
  );
}
