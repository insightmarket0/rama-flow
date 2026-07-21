import { Wrench, ArrowRight } from "lucide-react";

export default function PainelDivergencias() {
  return (
    <div className="flex flex-col h-[calc(100vh-48px)] w-full bg-[#050505] rounded-[2rem] overflow-hidden shadow-2xl animate-in fade-in duration-500 border border-white/10 relative items-center justify-center">
      {/* Glow Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="flex flex-col items-center max-w-lg text-center z-10 p-10 bg-white/[0.02] backdrop-blur-md rounded-3xl border border-white/5 shadow-2xl">
        <div className="w-20 h-20 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 border border-emerald-500/20 shadow-[inset_0_0_20px_rgba(16,185,129,0.1)]">
          <Wrench className="w-10 h-10 text-emerald-500" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-100 mb-4 tracking-tight">Módulo em Construção</h1>
        
        <p className="text-gray-400 text-[14px] leading-relaxed mb-8">
          Este espaço foi reservado especialmente para a equipe de expedição. 
          Deixamos esta área como um "canvas em branco" para ser moldada exatamente de acordo com o que os operadores precisarem no dia a dia.
        </p>
        
        <button className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[14px] font-bold shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all hover:scale-105">
          O que a expedição precisa aqui? <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
