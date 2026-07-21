import React from "react";
import { Users, Crown, Shield, Code, Palette, Zap, ArrowRight, Search, Mail, Phone, Calendar, Package } from "lucide-react";
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
      joined: "Dez 2025"
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
      joined: "Dez 2025"
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
      joined: "Jan 2026"
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
      joined: "Jan 2026"
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
      joined: "Fev 2026"
    }
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-48px)] bg-[#0A0A0A] rounded-[2rem] w-full font-sans overflow-hidden p-8 animate-in fade-in duration-700">
      
      {/* Cabeçalho Premium */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 relative z-10 gap-4">
        <div>
          <h1 className="text-4xl font-light text-white tracking-tighter mb-3">
            Gestão de <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Equipe.</span>
          </h1>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#00FF00] shadow-[0_0_10px_#00FF00] animate-pulse" />
            <span className="text-[#00FF00] text-xs font-bold tracking-widest uppercase">
              Estrutura Organizacional e Foco
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="w-4 h-4 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-white transition-colors" />
            <input 
              type="text" 
              placeholder="Pesquisar membro..." 
              className="bg-[#111111] border border-white/5 text-white text-sm rounded-2xl pl-12 pr-4 py-3 outline-none focus:border-white/20 transition-all w-72 focus:shadow-[0_0_20px_rgba(255,255,255,0.05)]"
            />
          </div>
        </div>
      </div>

      {/* Grid de Membros estilo Cards Financeiros */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10 overflow-y-auto pb-20 scrollbar-hide pr-2">
        {team.map((member) => (
          <div 
            key={member.id} 
            className="bg-[#111111] border border-white/5 hover:border-white/10 rounded-[2rem] p-8 transition-all duration-500 group relative overflow-hidden"
          >
            {/* Background Glow sutil */}
            <div className={`absolute -right-20 -top-20 w-64 h-64 bg-gradient-to-br ${member.color} rounded-full blur-[100px] opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700 pointer-events-none`} />
            
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-5">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${member.bgColor} ${member.borderColor} border relative group-hover:scale-105 transition-transform duration-500`}>
                  <member.icon className={`w-8 h-8 ${member.textColor}`} />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#00FF00] rounded-full border-4 border-[#111111]" />
                </div>
                <div>
                  <h2 className="text-3xl font-light text-white tracking-tighter">{member.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full ${member.bgColor} ${member.textColor} border ${member.borderColor}`}>
                      {member.role}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                  <Zap className="w-3 h-3 text-[#FFB703]" />
                  Foco Operacional
                </h3>
                <p className="text-white text-lg font-light tracking-tight">
                  {member.focus}
                </p>
              </div>

              <div>
                <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2">Responsabilidades</h3>
                <p className="text-gray-400 text-sm leading-relaxed font-light">
                  {member.description}
                </p>
              </div>

              <div className="pt-6 border-t border-white/5 flex flex-wrap gap-2">
                {member.tags.map(tag => (
                  <span key={tag} className="bg-white/5 border border-white/5 text-gray-400 text-xs px-4 py-2 rounded-xl font-medium tracking-wide">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Hover Arrow (Minimalista) + Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <div className="absolute right-8 bottom-8 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 z-20">
                  <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer backdrop-blur-md shadow-xl">
                    <ArrowRight className="w-4 h-4 text-white" />
                  </div>
                </div>
              </DialogTrigger>
              
              <DialogContent className="bg-[#111] border border-white/10 text-white rounded-3xl p-0 overflow-hidden max-w-lg">
                <div className="p-8 relative">
                  <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${member.color} rounded-full blur-[100px] opacity-10 pointer-events-none`} />


                  <DialogHeader className="mb-8 relative z-10">
                    <div className="flex items-center gap-5">
                      <div className={`w-20 h-20 rounded-3xl flex items-center justify-center overflow-hidden shadow-lg ${member.bgColor} ${member.borderColor} border`}>
                        {member.image ? (
                          <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                        ) : (
                          <member.icon className={`w-10 h-10 ${member.textColor}`} />
                        )}
                      </div>
                      <div>
                        <DialogTitle className="text-3xl font-light tracking-tighter mb-1">{member.name}</DialogTitle>
                        <span className={`text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full ${member.bgColor} ${member.textColor} border ${member.borderColor}`}>
                          {member.role}
                        </span>
                      </div>
                    </div>
                  </DialogHeader>

                  <div className="space-y-6 relative z-10">
                    <div className="bg-[#0A0A0A] p-4 rounded-2xl border border-white/5 flex flex-col gap-4">
                      <div className="flex items-center gap-3 text-gray-400 text-sm">
                        <Mail className="w-4 h-4 text-gray-500" /> {member.email}
                      </div>
                      <div className="flex items-center gap-3 text-gray-400 text-sm">
                        <Phone className="w-4 h-4 text-gray-500" /> {member.phone}
                      </div>
                      <div className="flex items-center gap-3 text-gray-400 text-sm">
                        <Calendar className="w-4 h-4 text-gray-500" /> Membro desde {member.joined}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-3">Resumo de Atividades</h4>
                      <p className="text-gray-300 font-light leading-relaxed text-sm">
                        {member.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-white/5">
                      <button className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 ${member.bgColor} ${member.textColor} border ${member.borderColor} hover:bg-opacity-80 transition-colors`}>
                        <Mail className="w-4 h-4" /> Enviar Mensagem
                      </button>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        ))}
      </div>
    </div>
  );
}
