import React from "react";
import { HardHat, Wrench, Construction, ArrowLeft, Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function GestaoInstaladores() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full text-center px-4 animate-in fade-in zoom-in duration-500">
      
      {/* Ícone 3D-like Glowing */}
      <div className="relative mb-8 group">
        <div className="absolute inset-0 bg-yellow-500/20 blur-3xl rounded-full scale-150 group-hover:bg-yellow-500/30 transition-all duration-700"></div>
        <div className="relative bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] p-6 rounded-3xl border border-yellow-500/20 shadow-2xl overflow-hidden">
          {/* Listras de construção no fundo do ícone */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 10px, #FFE600 10px, #FFE600 20px)" }}></div>
          <Construction className="w-24 h-24 text-yellow-500 relative z-10 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]" strokeWidth={1.5} />
        </div>
      </div>

      {/* Títulos e Textos */}
      <div className="space-y-4 max-w-2xl relative z-10">
        <span className="text-yellow-500 font-bold tracking-widest uppercase text-xs px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-full inline-block mb-2">
          Work in Progress
        </span>
        
        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
          Gestão de Instaladores
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
            Em Construção
          </span>
        </h1>
        
        <p className="text-gray-400 text-lg md:text-xl font-light leading-relaxed mt-4">
          Esta tela está sendo desenvolvida. Em breve, você terá o controle total do 
          <strong className="text-white font-medium"> Radar Logístico</strong>, gestão de vans (Flex) e alocação da equipe de instalações de forma inteligente.
        </p>
      </div>

      {/* Grid de features futuras */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 max-w-3xl w-full text-left relative z-10">
        <div className="bg-[#111111] border border-white/5 p-5 rounded-2xl">
          <HardHat className="w-6 h-6 text-yellow-500 mb-3" />
          <h3 className="text-white font-bold mb-1">Radar Logístico</h3>
          <p className="text-xs text-gray-500">Mapeamento em tempo real da equipe na rua (SP e ABC).</p>
        </div>
        <div className="bg-[#111111] border border-white/5 p-5 rounded-2xl">
          <Truck className="w-6 h-6 text-orange-500 mb-3" />
          <h3 className="text-white font-bold mb-1">Gestão de Frotas</h3>
          <p className="text-xs text-gray-500">Monitoramento de entregas Flex e ocorrências.</p>
        </div>
        <div className="bg-[#111111] border border-white/5 p-5 rounded-2xl">
          <Wrench className="w-6 h-6 text-amber-500 mb-3" />
          <h3 className="text-white font-bold mb-1">Serviços Híbridos</h3>
          <p className="text-xs text-gray-500">Agenda e controle de técnicos de instalação da Nuvemshop.</p>
        </div>
      </div>

      {/* Botão de Voltar */}
      <button 
        onClick={() => navigate(-1)}
        className="mt-12 bg-white/5 hover:bg-white/10 text-white border border-white/10 px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wider transition-all flex items-center gap-2 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Voltar 
      </button>

    </div>
  );
}
