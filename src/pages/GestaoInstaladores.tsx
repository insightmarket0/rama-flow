import React, { useState } from "react";
import { Users, Truck, Wrench, PackagePlus, AlertTriangle, BatteryMedium, Navigation, Radio, MapPin, Phone, X, BellRing, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function GestaoInstaladores() {
  const navigate = useNavigate();
  const [selectedInstalador, setSelectedInstalador] = useState<string | null>("roberto");
  const [showAgenda, setShowAgenda] = useState(false);

  const handlePushBateria = () => {
    alert("📡 Notificação Push Forçada enviada para Van 04:\n\n'ATENÇÃO: Risco de perda de comunicação. Conecte o dispositivo ao carregador imediatamente.'");
  };

  return (
    <div className="flex h-[100dvh] w-full bg-[#050505] font-sans overflow-hidden relative selection:bg-[#00FF00]/30 animate-in fade-in duration-700">
      
      {/* =========================================
          CAMADA 0: O MAPA TÁTICO (FULL SCREEN)
          ========================================= */}
      <div 
        className="absolute inset-0 z-0 bg-[#050505]"
        style={{
          backgroundImage: 'url(/map_bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundBlendMode: 'luminosity'
        }}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />

        {/* --- Elementos SVG do Mapa --- */}
        {selectedInstalador === "roberto" && (
          <>
            <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              {/* Passado (Snail Trail Cinza Translúcido) */}
              <path 
                d="M 600 800 Q 700 500 900 400" 
                fill="none" 
                stroke="#ffffff" 
                strokeWidth="2" 
                className="opacity-20"
              />
              {/* Futuro (Projeção Verde Neon) */}
              <path 
                d="M 900 400 T 1100 450" 
                fill="none" 
                stroke="#00FF00" 
                strokeWidth="3" 
                strokeDasharray="6,6"
                className="opacity-60 animate-pulse"
              />
            </svg>

            {/* Pino de Instalação 1 (Futura - Final do dia) */}
            <div className="absolute top-[200px] left-[1300px] transform -translate-x-1/2 -translate-y-1/2 group">
              <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-sm shadow-xl">
                <MapPin className="w-4 h-4 text-gray-400" />
              </div>
              <span className="absolute top-10 left-1/2 -translate-x-1/2 whitespace-nowrap text-gray-400 font-bold text-[10px] uppercase bg-black/80 px-2 py-1 rounded border border-white/10">16:00 - São Bernardo</span>
            </div>

            {/* Pino de Instalação 2 (Destino Atual - No Prazo) */}
            <div className="absolute top-[450px] left-[1100px] transform -translate-x-1/2 -translate-y-1/2">
              <div className="relative flex items-center justify-center">
                {/* Geofence (Branco Translúcido / Vidro) */}
                <div className="absolute w-64 h-64 rounded-full border border-dashed border-white/20 bg-white/5 backdrop-blur-[1px]" />
                
                {/* O Pino do Destino */}
                <div className="bg-white/10 border border-white/20 w-5 h-5 rounded-full shadow-2xl flex items-center justify-center backdrop-blur-md">
                  <div className="w-1.5 h-1.5 bg-white/50 rounded-full" />
                </div>
                
                {/* Caixa de Destino (Verde/No Prazo) */}
                <div className="absolute top-8 whitespace-nowrap bg-black/90 px-3 py-2 rounded-xl border border-white/10 backdrop-blur-md shadow-2xl flex flex-col items-center">
                  <span className="text-white font-bold text-xs">Cliente: Santo André</span>
                  <span className="text-[#00FF00] text-[10px] font-bold uppercase tracking-wider mt-1 flex items-center gap-1">
                     SLA Geofence: 50m
                  </span>
                </div>
              </div>
            </div>

            {/* Pino do Veículo (Roberto) */}
            <div className="absolute top-[400px] left-[900px] transform -translate-x-1/2 -translate-y-1/2 z-20">
              <div className="relative flex items-center justify-center">
                <div className="absolute w-16 h-16 rounded-full bg-[#00FF00]/20 animate-ping" />
                <div className="bg-[#00FF00] w-8 h-8 rounded-full shadow-[0_0_30px_#00FF00] border-2 border-black z-10 flex items-center justify-center">
                  <Navigation className="w-4 h-4 text-black fill-black transform rotate-45" />
                </div>
              </div>
              
              {/* Telemetria Flutuante ao lado do carro */}
              <div className="absolute top-12 left-1/2 -translate-x-1/2 w-52 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-3 shadow-2xl">
                <div className="flex justify-between items-start mb-2 border-b border-white/5 pb-2">
                  <span className="text-white font-bold text-xs uppercase tracking-widest">Van 04</span>
                  
                  {/* Bateria */}
                  <button 
                    onClick={handlePushBateria}
                    className="flex items-center gap-1 bg-red-500/10 hover:bg-red-500/30 px-2 py-1 rounded border border-red-500/30 transition-colors group cursor-pointer"
                    title="Forçar alerta no dispositivo"
                  >
                    <BatteryMedium className="w-3 h-3 text-red-500" />
                    <span className="text-red-500 text-[10px] font-bold">18%</span>
                    <BellRing className="w-2.5 h-2.5 text-red-500/50 group-hover:text-red-500 ml-1 transition-colors" />
                  </button>

                </div>
                <div className="flex justify-between items-end">
                  <div className="flex flex-col">
                    <span className="text-gray-500 text-[9px] uppercase tracking-wider">Velocidade</span>
                    <span className="text-white font-bold text-base leading-none">42 <span className="text-[10px] text-gray-500">km/h</span></span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-gray-500 text-[9px] uppercase tracking-wider">Chegada</span>
                    <span className="text-[#00FF00] font-bold text-base leading-none">14 <span className="text-[10px] text-[#00FF00]/60">min</span></span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* =========================================
          CAMADA 1: SIDEBAR ESQUERDA FLUTUANTE (Lista de Instaladores)
          ========================================= */}
      <aside className="absolute left-6 top-6 bottom-6 z-10 w-[400px] bg-black/60 backdrop-blur-2xl border border-white/10 rounded-3xl flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
        
        {/* Header do Sidebar */}
        <div className="p-6 border-b border-white/5 flex flex-col gap-6 bg-black/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-[#00FF00]/10 p-2 rounded-xl border border-[#00FF00]/20">
                <Radio className="h-5 w-5 text-[#00FF00] animate-pulse" />
              </div>
              <h1 className="text-xl font-extrabold text-white tracking-tight uppercase">
                Rama Logística
              </h1>
            </div>
            <button className="bg-white/5 text-white border border-white/10 p-2 rounded-lg hover:bg-white/10 transition-colors">
              <Wrench className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex gap-4">
            <div className="flex-1 bg-black/50 border border-white/5 rounded-xl p-3 flex flex-col">
              <span className="text-gray-500 text-[9px] font-bold uppercase tracking-widest">Faturamento Dia</span>
              <span className="text-[#00FF00] font-bold text-sm mt-1">R$ 1.250,00</span>
            </div>
            <div className="flex-1 bg-black/50 border border-white/5 rounded-xl p-3 flex flex-col">
              <span className="text-gray-500 text-[9px] font-bold uppercase tracking-widest">Ativas na Rua</span>
              <span className="text-white font-bold text-sm mt-1">1 Van</span>
            </div>
          </div>
        </div>

        {/* Lista de Instaladores */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 custom-scrollbar">
          
          {/* Card Roberto (Operação Normal) */}
          <div 
            onClick={() => setSelectedInstalador("roberto")}
            className={`border rounded-2xl p-4 flex flex-col gap-3 relative overflow-hidden transition-all cursor-pointer shadow-xl ${
              selectedInstalador === "roberto" 
                ? 'bg-[#151515] border-[#00FF00]/30 shadow-[0_0_20px_rgba(0,255,0,0.05)]' 
                : 'bg-[#111111]/60 border-white/5 hover:border-white/10'
            }`}
          >
            <div className="absolute top-0 right-0 w-1.5 h-full bg-[#00FF00]" />
            
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center font-bold text-sm text-white">
                  R
                </div>
                <div className="flex flex-col">
                  <h3 className="text-white font-bold text-base leading-tight">Roberto Silva</h3>
                  <span className="text-[#00FF00] text-[9px] font-bold uppercase tracking-widest mt-1 flex items-center gap-1">
                     EM ROTA (NO PRAZO)
                  </span>
                </div>
              </div>
            </div>

            {/* Indicadores Ativos */}
            <div className="grid grid-cols-2 gap-3 mt-1 bg-black/40 rounded-xl p-3 border border-white/5">
              <div className="flex flex-col gap-0.5">
                <span className="text-gray-500 text-[9px] font-bold uppercase tracking-widest">Progresso Dia</span>
                <span className="text-white text-lg font-bold leading-none">1/3</span>
                <span className="text-[#00FF00] text-[9px] font-bold uppercase mt-1">
                  R$ 1.250,00
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-gray-500 text-[9px] font-bold uppercase tracking-widest">Estoque</span>
                <span className="text-white text-lg font-bold leading-none">8 Kits</span>
                <span className="text-amber-500 text-[9px] font-bold uppercase mt-1">
                  Imob: R$ 3.840,00
                </span>
              </div>
            </div>

            <div className="flex gap-2 mt-1">
              <button onClick={() => setShowAgenda(true)} className="flex-1 bg-white/5 hover:bg-white/10 text-white border border-white/5 rounded-lg py-2 text-[10px] uppercase tracking-widest font-bold transition-colors">
                Agenda
              </button>
              <button className="flex-1 bg-[#00FF00]/10 hover:bg-[#00FF00]/20 text-[#00FF00] border border-[#00FF00]/20 rounded-lg py-2 text-[10px] uppercase tracking-widest font-bold transition-colors flex items-center justify-center gap-1">
                <Phone className="w-3 h-3" /> Ligar
              </button>
            </div>
          </div>

          {/* Adicionar Equipe */}
          <div className="bg-transparent border border-white/10 rounded-2xl p-4 flex items-center justify-center gap-2 border-dashed hover:bg-white/5 transition-colors cursor-pointer mt-2">
            <Users className="w-4 h-4 text-gray-500" />
            <span className="text-gray-500 font-bold text-xs uppercase tracking-widest">Nova Equipe</span>
          </div>

        </div>
      </aside>

      {/* =========================================
          CAMADA 2: ELEMENTOS FLUTUANTES GLOBAIS
          ========================================= */}
      {/* Alerta de Atraso removido na simulação normal */}
      {/* <div className="absolute top-6 right-6 z-20 flex gap-4 pointer-events-none">
        <div className="bg-red-500/10 backdrop-blur-md border border-red-500/20 px-4 py-2 rounded-full flex items-center gap-2 pointer-events-auto shadow-2xl">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-red-500 font-bold text-[10px] tracking-widest uppercase">1 SLA Atrasado</span>
        </div>
      </div> */}

      {/* =========================================
          CAMADA 3: MODAL DE AGENDA (DRAWER)
          ========================================= */}
      {showAgenda && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-[450px] h-full bg-[#0A0A0A] border-l border-white/10 shadow-2xl p-6 flex flex-col animate-in slide-in-from-right-8 duration-300">
            <div className="flex justify-between items-center mb-8">
              <div className="flex flex-col">
                <h2 className="text-2xl font-extrabold text-white">Agenda do Dia</h2>
                <span className="text-[#00FF00] font-bold text-xs uppercase tracking-widest mt-1">Roberto Silva (Van 04)</span>
              </div>
              <button onClick={() => setShowAgenda(false)} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-2">
              
              <div className="bg-[#111111] border border-white/5 rounded-2xl p-4 flex flex-col opacity-60">
                <div className="flex justify-between items-start border-b border-white/5 pb-3 mb-3">
                  <div className="flex flex-col">
                    <span className="text-gray-400 font-bold text-sm">OS-9021</span>
                    <span className="text-gray-500 text-[10px] uppercase tracking-widest">09:00 - 10:30</span>
                  </div>
                  <span className="bg-[#00FF00]/10 text-[#00FF00] px-2 py-1 rounded text-[9px] font-bold uppercase border border-[#00FF00]/20">Concluído</span>
                </div>
                <span className="text-gray-300 font-bold text-sm">Instalação Kit Gás 2M</span>
                <span className="text-gray-500 text-xs mt-1">Av. Goiás, 1500 - São Caetano</span>
              </div>

              {/* Serviço 2 - Em Andamento (No Prazo) */}
              <div className="bg-[#151515] border border-[#00FF00]/20 shadow-[0_0_15px_rgba(0,255,0,0.05)] rounded-2xl p-4 flex flex-col relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#00FF00]" />
                <div className="flex justify-between items-start border-b border-white/5 pb-3 mb-3 pl-2">
                  <div className="flex flex-col">
                    <span className="text-white font-bold text-sm">OS-9022</span>
                    <span className="text-[#00FF00] font-bold text-[10px] uppercase tracking-widest">11:00 - 12:30 (Em Rota)</span>
                  </div>
                  <span className="bg-[#00FF00]/10 text-[#00FF00] px-2 py-1 rounded text-[9px] font-bold uppercase border border-[#00FF00]/20 flex items-center gap-1">
                    <Navigation className="w-3 h-3" /> No Prazo
                  </span>
                </div>
                <div className="pl-2 flex flex-col">
                  <span className="text-white font-bold text-sm">Instalação Kit Gás 1M</span>
                  <span className="text-gray-400 text-xs mt-1">Rua das Flores, 123 - Santo André</span>
                </div>
              </div>

              <div className="bg-[#111111] border border-white/5 rounded-2xl p-4 flex flex-col">
                <div className="flex justify-between items-start border-b border-white/5 pb-3 mb-3">
                  <div className="flex flex-col">
                    <span className="text-gray-400 font-bold text-sm">OS-9023</span>
                    <span className="text-gray-500 text-[10px] uppercase tracking-widest">16:00 - 17:30</span>
                  </div>
                  <span className="bg-white/5 text-gray-400 px-2 py-1 rounded text-[9px] font-bold uppercase border border-white/10">Pendente</span>
                </div>
                <span className="text-white font-bold text-sm">Manutenção Preventiva</span>
                <span className="text-gray-400 text-xs mt-1">Av. Kennedy, 500 - São Bernardo</span>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
