import React from "react";
import { Globe, Layout, Briefcase, CreditCard, User, Mail, Sparkles, Bell } from "lucide-react";

const TEAM_MEMBERS = [
  { id: 1, role: "Direção", name: "Anderson", icon: User, desc: "Gestão • Estratégia • Processos" },
  { id: 2, role: "Comercial", name: "Will Mendes", icon: Layout, desc: "Marketplaces • Vendas • Anúncios" },
  { id: 3, role: "Operação", name: "Rogério", icon: Briefcase, desc: "Logística • Expedição • Suporte" },
  { id: 4, role: "Design", name: "Alyson", icon: Sparkles, desc: "Criativos • Identidade • Mídia" }
];

export const IntegrationFlowMap = () => {
  return (
    <div className="w-full h-full bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 relative overflow-hidden flex flex-col xl:flex-row gap-8 items-center justify-between font-sans shadow-2xl">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#00FF00]/5 rounded-full blur-[120px] pointer-events-none" />

      {/* LEFT COLUMN: Inputs / Sources (Com Scroll Infinito) */}
      <div className="w-full xl:w-1/4 relative z-10 h-full overflow-hidden group">
        {/* Máscaras de Gradiente (Fade no topo e na base) */}
        <div className="absolute top-0 left-0 w-full h-12 bg-gradient-to-b from-[#0A0A0A] to-transparent z-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-[#0A0A0A] to-transparent z-20 pointer-events-none" />
        
        {/* Trilha do Marquee Vertical */}
        <div className="flex flex-col gap-6 animate-marquee-vertical group-hover:[animation-play-state:paused] pt-10">
          
          {[...TEAM_MEMBERS, ...TEAM_MEMBERS].map((member, index) => {
            const Icon = member.icon;
            return (
              <div key={`${member.id}-${index}`} className="space-y-2 shrink-0">
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest pl-1">{member.role}</p>
                <div className="bg-[#111111] border border-white/5 rounded-xl p-4 shadow-lg hover:border-[#00FF00]/30 transition-colors cursor-pointer group/card">
                  <div className="flex items-center gap-3 mb-3">
                    <Icon className="text-[#00FF00] w-5 h-5 group-hover/card:animate-pulse" />
                    <h3 className="text-white font-bold text-sm tracking-wide">{member.name}</h3>
                  </div>
                  <p className="text-gray-400 text-xs leading-relaxed">{member.desc}</p>
                </div>
              </div>
            );
          })}

        </div>
      </div>
      {/* CENTER: SVG Animation Connector */}
      <div className="hidden xl:block w-1/4 h-full relative z-0">
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 200 500">
          <defs>
            <linearGradient id="neonGlow" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#00FF00" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#00FF00" stopOpacity="1" />
            </linearGradient>
            
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Path 1: From Top (Integrations) to Center */}
          <path id="path1" d="M 0,100 C 100,100 100,250 180,250" fill="none" stroke="#333" strokeWidth="2" strokeDasharray="4 4" />
          <circle r="4" fill="#00FF00" filter="url(#glow)">
            <animateMotion dur="3s" repeatCount="indefinite" path="M 0,100 C 100,100 100,250 180,250" />
          </circle>

          {/* Path 2: From Middle (Work) to Center */}
          <path id="path2" d="M 0,250 C 100,250 100,250 180,250" fill="none" stroke="#333" strokeWidth="2" strokeDasharray="4 4" />
          <circle r="4" fill="#00FF00" filter="url(#glow)">
            <animateMotion dur="2.5s" repeatCount="indefinite" path="M 0,250 C 100,250 100,250 180,250" />
          </circle>

          {/* Path 3: From Bottom (Platform) to Center */}
          <path id="path3" d="M 0,400 C 100,400 100,250 180,250" fill="none" stroke="#333" strokeWidth="2" strokeDasharray="4 4" />
          <circle r="4" fill="#00FF00" filter="url(#glow)">
            <animateMotion dur="3.5s" repeatCount="indefinite" path="M 0,400 C 100,400 100,250 180,250" />
          </circle>

          {/* Central Hub Node */}
          <rect x="176" y="242" width="16" height="16" rx="4" fill="#111111" stroke="#00FF00" strokeWidth="2" className="animate-pulse" />
          <circle cx="184" cy="250" r="3" fill="#00FF00" />

        </svg>
      </div>

      {/* RIGHT COLUMN: Output / Analysis */}
      <div className="w-full xl:w-2/5 flex flex-col gap-4 relative z-10 h-full justify-center">
        
        {/* Main Alert Card */}
        <div className="bg-gradient-to-br from-[#1a0a0a] to-[#0a0a0a] rounded-2xl p-5 shadow-2xl relative overflow-hidden border border-red-500/20 group hover:border-red-500/40 transition-colors">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500/0 via-red-500/50 to-red-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <div className="flex items-center justify-between mb-4">
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold px-2.5 py-1 rounded-md flex items-center gap-2 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> Crítico: Gargalo
            </div>
            <div className="text-gray-500 text-xs font-medium">Agora</div>
          </div>
          
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-light text-white tracking-tight mb-1">Atenção na Fila</h2>
              <p className="text-gray-400 text-sm">4 Chamados Pendentes</p>
            </div>
            <div className="bg-red-500/10 p-2 rounded-xl cursor-pointer hover:bg-red-500/20 transition-colors border border-red-500/20">
              <Bell className="w-5 h-5 text-red-500" />
            </div>
          </div>

          <div className="mt-6 border border-red-500/10 bg-red-500/5 rounded-xl p-3 text-sm font-medium text-red-200/80">
            Will Mendes tem 4 urgências pendentes de resolução na plataforma.
          </div>

          <div className="flex items-center justify-between mt-4">
            <span className="text-gray-500 text-xs uppercase tracking-widest font-bold">Ação Exigida</span>
            <a href="#" className="text-red-400 text-sm font-bold flex items-center gap-2 hover:text-red-300 transition-colors">
              Resolver Imediatamente <span>&rarr;</span>
            </a>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-[#111111]/80 backdrop-blur-sm border border-white/5 rounded-2xl p-4 flex flex-col justify-between hover:border-white/10 transition-colors">
            <p className="text-gray-500 text-[10px] uppercase tracking-widest font-bold mb-4">Urgências</p>
            <div>
              <div className="text-[#00FF00] text-4xl font-light tracking-tighter mb-1">4</div>
              <p className="text-gray-500 text-xs">Pendentes</p>
            </div>
          </div>
          <div className="bg-[#111111]/80 backdrop-blur-sm border border-white/5 rounded-2xl p-4 flex flex-col justify-between hover:border-white/10 transition-colors">
            <p className="text-gray-500 text-[10px] uppercase tracking-widest font-bold mb-4">Mural</p>
            <div>
              <div className="text-white text-4xl font-light tracking-tighter mb-1">1</div>
              <p className="text-gray-500 text-xs">Aviso não lido</p>
            </div>
          </div>
          <div className="bg-[#111111]/80 backdrop-blur-sm border border-white/5 rounded-2xl p-4 flex flex-col justify-between hover:border-white/10 transition-colors">
            <p className="text-gray-500 text-[10px] uppercase tracking-widest font-bold mb-4">Ajustes MKT</p>
            <div>
              <div className="text-white text-4xl font-light tracking-tighter mb-1">2</div>
              <p className="text-gray-500 text-xs">Para revisar</p>
            </div>
          </div>
        </div>

        {/* QAI Analysis */}
        <div className="bg-[#111111]/80 backdrop-blur-sm border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-colors">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <Sparkles className="text-[#00FF00] w-4 h-4" />
              <h3 className="text-white font-medium text-sm tracking-wide">Desempenho da Equipe</h3>
            </div>
            <span className="text-[#00FF00] text-[10px] uppercase tracking-widest font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00FF00] animate-pulse" /> Ativo
            </span>
          </div>
          <div className="space-y-4">
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden relative">
              <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#00FF00]/40 to-[#00FF00] w-3/4 rounded-full shadow-[0_0_10px_#00FF00]" />
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden relative">
              <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#00FF00]/20 to-[#00FF00]/60 w-1/2 rounded-full" />
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden relative">
              <div className="absolute top-0 left-0 h-full bg-[#333] w-1/4 rounded-full" />
            </div>
          </div>
        </div>

        {/* Bottom Numbers */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-[#111111]/80 backdrop-blur-sm border border-white/5 rounded-2xl p-4 flex items-end justify-between">
            <div className="text-white text-xl font-light tracking-tight">98<span className="text-sm text-gray-500">%</span></div>
            <p className="text-gray-500 text-[9px] uppercase tracking-widest font-bold mb-1">Aproveitamento</p>
          </div>
          <div className="bg-[#111111]/80 backdrop-blur-sm border border-white/5 rounded-2xl p-4 flex items-end justify-between">
            <div className="text-white text-xl font-light tracking-tight">7</div>
            <p className="text-gray-500 text-[9px] uppercase tracking-widest font-bold mb-1">Entregas</p>
          </div>
          <div className="bg-[#111111]/80 backdrop-blur-sm border border-white/5 rounded-2xl p-4 flex items-end justify-between">
            <div className="text-white text-xl font-light tracking-tight">5<span className="text-sm text-gray-500">m</span> 30<span className="text-sm text-gray-500">s</span></div>
            <p className="text-gray-500 text-[9px] uppercase tracking-widest font-bold mb-1">Tempo</p>
          </div>
        </div>

      </div>

    </div>
  );
};
