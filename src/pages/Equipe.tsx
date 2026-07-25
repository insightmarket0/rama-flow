import React, { useState } from "react";
import { Users, Crown, Shield, Code, Palette, Zap, ArrowRight, Search, Mail, Phone, Calendar, Package, Target, CheckCircle2, Activity, AlertCircle, TrendingUp, ChevronRight, ActivitySquare, ChevronUp, ChevronDown } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function Equipe() {
  const team = [
    {
      id: "rogerio",
      name: "Rogério",
      role: "Dono",
      focus: "Visão Geral e Estratégia",
      icon: Crown,
      color: "from-yellow-400 to-orange-500",
      textColor: "text-yellow-400",
      bgColor: "bg-yellow-400/10",
      borderColor: "border-yellow-400/20",
      description: "Responsável pela direção estratégica da empresa, definição de metas de alto nível e expansão do negócio.",
      tags: ["Estratégia", "Expansão", "Direção"],
      email: "rogerio@ramaflow.com",
      phone: "(11) 96666-6666",
      joined: "Dez 2025",
      autonomy: "Total (Direção Geral)",
      careerPlan: "Expansão internacional e escalabilidade de novos modelos de negócio.",
      strategicFocus: ["Governança", "Fusões e Aquisições", "Estratégia de Longo Prazo"],
      goals: ["Dobrar o faturamento anual", "Estruturar novos canais de distribuição", "Garantir a visão estratégica"],
      children: ["anderson"]
    },
    {
      id: "anderson",
      name: "Anderson",
      role: "Gestor Geral",
      focus: "Gestão de Tudo e Operação",
      icon: Shield,
      color: "from-blue-400 to-indigo-500",
      textColor: "text-blue-400",
      bgColor: "bg-blue-400/10",
      borderColor: "border-blue-400/20",
      description: "Coordena toda a operação do Rama Flow, acompanha indicadores financeiros e garante que a engrenagem da equipe gire perfeitamente.",
      tags: ["Gestão", "Operação", "Financeiro"],
      email: "anderson@ramaflow.com",
      phone: "(11) 97777-7777",
      joined: "Dez 2025",
      autonomy: "Total (Gestão de Operações e Financeiro)",
      careerPlan: "Consolidação como Chief Operating Officer (COO) e Chief Financial Officer (CFO).",
      strategicFocus: ["Otimização de Custos", "Estruturação de Equipes", "KPIs Financeiros"],
      goals: ["Reduzir custos operacionais em 15%", "Aumentar a margem de lucro líquida", "Escalar a capacidade de atendimento"],
      children: ["william", "alyson", "mara"]
    },
    {
      id: "william",
      name: "Will Mendes",
      role: "Design & Marketplaces",
      focus: "Contas de Marketplaces e Design",
      image: "/assets/will.jpg",
      icon: Palette,
      color: "from-pink-400 to-rose-500",
      textColor: "text-pink-400",
      bgColor: "bg-pink-400/10",
      borderColor: "border-pink-400/20",
      description: "Responsável pelo visual da marca, design de anúncios e gerenciamento estratégico das contas nos marketplaces.",
      tags: ["Design Visual", "Marketplaces", "Anúncios"],
      email: "william_tgt@hotmail.com",
      phone: "(11) 99999-9999",
      joined: "Jan 2026",
      autonomy: "Total na tomada de decisão (dentro das estratégias pré-definidas)",
      careerPlan: "Construção de Marca 360, profissionalismo no design alinhado à comunicação assertiva.",
      strategicFocus: ["Mercado Livre 2", "TikTok", "Criação de Marca e Conteúdo Estratégico"],
      goals: ["Vender mais atingindo as pessoas com conteúdo estratégico", "Saber expor corretamente para o público final", "Garantir profissionalismo visual em todos os touchpoints"],
      children: []
    },
    {
      id: "alyson",
      name: "Alyson",
      role: "Dev & Marketplaces",
      focus: "Marketplaces e Site da Loja",
      icon: Code,
      color: "from-[#00FF00] to-emerald-500",
      textColor: "text-[#00FF00]",
      bgColor: "bg-[#00FF00]/10",
      borderColor: "border-[#00FF00]/20",
      description: "Cuida da integração e gestão das contas de marketplace, além do desenvolvimento e manutenção técnica do site oficial da loja.",
      tags: ["Desenvolvimento", "Marketplaces", "E-commerce"],
      email: "alyson@ramaflow.com",
      phone: "(11) 98888-8888",
      joined: "Jan 2026",
      autonomy: "Técnica e Desenvolvimento",
      careerPlan: "Evoluir para Tech Lead da operação e engenharia de e-commerce.",
      strategicFocus: ["Integrações de Marketplaces", "Performance do Site", "Automações Técnicas"],
      goals: ["Manter 99.9% de uptime", "Otimizar velocidade de carregamento", "Desenvolver novas automações de integração"],
      children: []
    },
    {
      id: "mara",
      name: "Mara",
      role: "Logística & Expedição",
      focus: "Conferência e Envios",
      icon: Package,
      color: "from-teal-400 to-cyan-500",
      textColor: "text-teal-400",
      bgColor: "bg-teal-400/10",
      borderColor: "border-teal-400/20",
      description: "Peça fundamental da operação. Garante que todos os pedidos sejam separados, conferidos e despachados com agilidade e perfeição, sendo a última e mais importante barreira de qualidade antes do produto chegar ao cliente.",
      tags: ["Expedição", "Logística", "Qualidade"],
      email: "mara@ramaflow.com",
      phone: "(11) 95555-5555",
      joined: "Fev 2026",
      autonomy: "Gestão do fluxo logístico e expedição",
      careerPlan: "Head de Logística, supervisionando múltiplos polos de distribuição.",
      strategicFocus: ["Tempo de Expedição", "Controle de Qualidade (Erro Zero)", "Gestão de Transportadoras"],
      goals: ["Despachar 100% dos pedidos no mesmo dia", "Reduzir taxa de erro na separação para zero", "Otimizar custos de embalagem"],
      children: []
    }
  ];

  const renderNode = (nodeId: string) => {
    const member = team.find(m => m.id === nodeId);
    if (!member) return null;

    return (
      <li key={member.id}>
        <div className="inline-block relative z-10 transition-transform duration-300 hover:-translate-y-1 group">
          <Dialog>
            <DialogTrigger asChild>
              <div className="bg-[#111111] border border-white/5 hover:border-white/20 rounded-[1.5rem] p-5 cursor-pointer shadow-2xl relative overflow-hidden text-left min-w-[280px] max-w-[320px] backdrop-blur-md">
                <div className={`absolute -right-10 -top-10 w-32 h-32 bg-gradient-to-br ${member.color} rounded-full blur-[50px] opacity-[0.05] group-hover:opacity-[0.15] transition-opacity duration-700 pointer-events-none`} />
                
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${member.bgColor} ${member.borderColor} border relative overflow-hidden shrink-0`}>
                    {member.image && member.id === 'william' ? (
                       <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      <member.icon className={`w-6 h-6 ${member.textColor}`} />
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-medium text-white tracking-tight leading-tight">{member.name}</h2>
                    <p className="text-[11px] text-gray-400 mt-0.5">{member.role}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className={`text-[10px] font-bold uppercase tracking-[0.1em] px-2.5 py-1 rounded-md inline-flex items-center gap-1 ${member.bgColor} ${member.textColor} border ${member.borderColor}`}>
                    <member.icon className="w-3 h-3" />
                    {member.focus}
                  </div>
                </div>
                
                <div className="mt-4 pt-3 border-t border-white/5 text-center">
                  <span className="text-[10px] text-blue-400 font-medium hover:text-blue-300 transition-colors uppercase tracking-widest flex items-center justify-center gap-1">
                    Detalhes da Carreira <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </DialogTrigger>

            {/* Modal de Detalhes da Carreira */}
            <DialogContent className="bg-[#0A0A0A]/95 backdrop-blur-2xl border border-white/10 text-white rounded-[2rem] p-0 overflow-hidden sm:max-w-5xl max-h-[95vh] flex flex-col shadow-2xl">
              <div className="flex-1 overflow-hidden p-5 md:p-6 relative">
                {/* Background Glow Premium */}
                <div className={`absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br ${member.color} rounded-full blur-[140px] opacity-15 pointer-events-none -translate-y-1/2 translate-x-1/4 animate-pulse duration-1000`} />
                <div className={`absolute bottom-0 left-0 w-[300px] h-[300px] bg-gradient-to-tr ${member.color} rounded-full blur-[120px] opacity-10 pointer-events-none translate-y-1/3 -translate-x-1/3`} />

                <DialogHeader className="mb-4 relative z-10">
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
                    <div className={`relative w-20 h-20 md:w-24 md:h-24 rounded-[1.5rem] flex-shrink-0 flex items-center justify-center overflow-hidden shadow-2xl ${member.bgColor} ${member.borderColor} border-2 group`}>
                      <div className={`absolute inset-0 bg-gradient-to-tr ${member.color} opacity-20 group-hover:opacity-40 transition-opacity duration-500`} />
                      {member.image && member.id === 'william' ? (
                        <img src={member.image} alt={member.name} className="w-full h-full object-cover relative z-10" />
                      ) : (
                        <member.icon className={`w-10 h-10 ${member.textColor} relative z-10`} />
                      )}
                    </div>
                    
                    <div className="text-center md:text-left flex-1 pt-1">
                      <DialogTitle className="text-2xl md:text-3xl font-bold tracking-tighter mb-2 text-white">
                        {member.name}
                      </DialogTitle>
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                        <span className={`text-[9px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-lg ${member.bgColor} ${member.textColor} border ${member.borderColor} shadow-lg`}>
                          {member.role}
                        </span>
                        <span className="text-[9px] text-gray-400 font-medium bg-white/5 border border-white/10 px-2 py-1 rounded-lg">
                          Desde {member.joined}
                        </span>
                      </div>
                    </div>
                  </div>
                </DialogHeader>

                {/* Bento Grid Layout Compactado */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 relative z-10">
                  
                  {/* Plano de Carreira (Span 12) */}
                  <div className={`md:col-span-12 bg-gradient-to-br ${member.bgColor} border ${member.borderColor} p-4 rounded-2xl backdrop-blur-md relative overflow-hidden group animate-in slide-in-from-bottom-4 duration-500 shadow-xl`}>
                    <div className={`absolute right-0 top-0 w-48 h-48 bg-gradient-to-br ${member.color} opacity-20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:opacity-30 transition-opacity`} />
                    <h4 className={`text-[9px] font-bold ${member.textColor} uppercase tracking-[0.2em] mb-1.5 flex items-center gap-2`}>
                      <Crown className="w-3.5 h-3.5" /> Plano de Carreira
                    </h4>
                    <p className="text-white text-base font-medium leading-snug max-w-4xl">
                      {member.careerPlan}
                    </p>
                  </div>

                  {/* Focos Estratégicos (Span 7) */}
                  <div className="md:col-span-7 bg-white/[0.02] border border-white/5 p-4 rounded-2xl backdrop-blur-md hover:bg-white/[0.04] transition-colors animate-in slide-in-from-bottom-8 duration-700 shadow-lg group">
                    <h4 className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                      <Target className="w-3.5 h-3.5 text-gray-400 group-hover:text-white transition-colors" /> Focos Estratégicos
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {member.strategicFocus.map((focus, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-white/5 border border-white/10 text-gray-200 flex items-center gap-1.5 hover:border-white/20 hover:bg-white/10 transition-all hover:-translate-y-0.5 cursor-default">
                          <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${member.color} shadow-lg`} />
                          {focus}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Nível de Autonomia (Span 5) */}
                  <div className="md:col-span-5 bg-white/[0.02] border border-white/5 p-4 rounded-2xl backdrop-blur-md hover:bg-white/[0.04] transition-colors flex flex-col justify-center animate-in slide-in-from-bottom-8 duration-700 shadow-lg group">
                    <h4 className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                      <Shield className="w-3.5 h-3.5 text-gray-400 group-hover:text-white transition-colors" /> Nível de Autonomia
                    </h4>
                    <p className="text-gray-300 text-[13px] font-medium leading-snug">
                      {member.autonomy}
                    </p>
                  </div>

                  {/* Metas e KPIs (Span 12) */}
                  <div className="md:col-span-12 bg-white/[0.02] border border-white/5 p-4 rounded-2xl backdrop-blur-md animate-in slide-in-from-bottom-12 duration-1000 shadow-lg group">
                    <h4 className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5 text-gray-400 group-hover:text-white transition-colors" /> Principais Metas & KPIs
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {member.goals.map((goal, idx) => (
                        <div key={idx} className="bg-[#0A0A0A]/50 p-3 rounded-lg border border-white/5 flex items-start gap-2.5 hover:border-white/10 transition-all hover:-translate-y-1 hover:shadow-lg">
                          <div className={`mt-0.5 p-1 rounded-md ${member.bgColor} ${member.textColor} shadow-md shrink-0`}>
                            <CheckCircle2 className="w-3 h-3" />
                          </div>
                          <span className="text-gray-300 text-[13px] leading-snug font-medium">{goal}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        {member.children.length > 0 && (
          <>
            <div className="w-[3px] h-[30px] bg-slate-500/80 mx-auto relative z-0"></div>
            <ul>
              {member.children.map(childId => renderNode(childId))}
            </ul>
          </>
        )}
      </li>
    );
  };

  return (
    <div className="flex-1 w-full h-full relative flex flex-col items-center justify-center bg-transparent font-sans px-8 animate-in fade-in duration-700 overflow-hidden">
      <style dangerouslySetInnerHTML={{__html: `
        .org-tree ul {
          padding-top: 0px; position: relative;
          display: flex; justify-content: center;
          margin: 0; padding-left: 0;
        }
        .org-tree li {
          float: left; text-align: center;
          list-style-type: none;
          position: relative;
          padding: 20px 40px 0 40px;
        }
        .org-tree li::before, .org-tree li::after {
          content: '';
          position: absolute; top: 0; right: 50%;
          border-top: 2px solid rgba(71, 85, 105, 0.8);
          width: 50%; height: 20px;
        }
        .org-tree li::after {
          right: auto; left: 50%;
          border-left: 2px solid rgba(71, 85, 105, 0.8);
        }
        .org-tree li:only-child::after, .org-tree li:only-child::before {
          display: none;
        }
        .org-tree li:only-child {
          padding-top: 0;
        }
        .org-tree li:first-child::before, .org-tree li:last-child::after {
          border: 0 none;
        }
        .org-tree li:last-child::before {
          border-right: 2px solid rgba(71, 85, 105, 0.8);
          border-radius: 0 12px 0 0;
        }
        .org-tree li:first-child::after {
          border-radius: 12px 0 0 0;
        }
        .org-tree ul ul::before {
          content: '';
          position: absolute; top: 0; left: 50%;
          border-left: 2px solid rgba(71, 85, 105, 0.8);
          width: 0; height: 20px;
          transform: translateX(-50%);
        }
      `}} />

      {/* Cabeçalho Premium */}
      <div className="absolute top-6 left-8 right-8 flex justify-between items-start z-20 pointer-events-none">
        <div className="pointer-events-auto">
          <h1 className="text-3xl font-light text-white tracking-tighter mb-1">
            Gestão de <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Equipe.</span>
          </h1>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#00FF00] shadow-[0_0_10px_#00FF00] animate-pulse" />
            <span className="text-gray-400 text-[10px] font-bold tracking-widest uppercase">
              Organograma & Plano de Carreira
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 pointer-events-auto">
          <div className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2">
            <Users className="w-4 h-4" /> Total: {team.length} membros
          </div>
        </div>
      </div>

      {/* Organograma (Tree) */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full pt-16">
        <div className="org-tree transform scale-[0.85] origin-top md:scale-90 lg:scale-95 xl:scale-100">
          <ul>
            {renderNode("rogerio")}
          </ul>
        </div>
      </div>
    </div>
  );
}
