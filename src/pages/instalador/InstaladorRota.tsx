import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, MapPin, Navigation2, CheckCircle2 } from "lucide-react";
import { useAgendaStore } from "../../store/useAgendaStore";
import { format } from "date-fns";

export default function InstaladorRota() {
  const navigate = useNavigate();
  const servicos = useAgendaStore(state => state.servicos);

  const stops = useMemo(() => {
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const todaysServicos = servicos
      .filter(s => s.data === todayStr)
      .sort((a, b) => a.horario.localeCompare(b.horario));

    // A Base sempre será o primeiro ponto. 
    // Vamos considerar "completa" se o cara já fez o primeiro serviço, ou se já começou o dia.
    // Pra simplificar, a Base sempre fica verde se tiver serviços.
    const baseStop = {
      id: "base",
      cliente: "Você (Partida)",
      endereco: "Sua Base Operacional",
      horario: "Início do dia",
      isCompleted: true,
      isNext: false,
      realId: null
    };

    let foundNext = false;
    const mappedServicos = todaysServicos.map(s => {
      const isCompleted = s.status === 'concluido';
      let isNext = false;
      
      if (!isCompleted && !foundNext) {
        isNext = true;
        foundNext = true;
      }

      return {
        id: s.id,
        realId: s.id,
        cliente: s.cliente,
        endereco: s.endereco,
        horario: s.horario,
        isCompleted: isCompleted,
        isNext: isNext
      };
    });

    return [baseStop, ...mappedServicos];
  }, [servicos]);

  const totalParadas = stops.length - 1; // exclui a base
  const paradasFeitas = stops.filter(s => s.isCompleted && s.id !== "base").length;

  return (
    <div className="flex flex-col min-h-[100dvh] bg-[#F8F9FA] text-[#1A1C1E] selection:bg-purple-200">
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#F8F9FA]/90 backdrop-blur-xl pt-2 pb-2 px-6 flex items-center justify-between border-b border-gray-200/50">
        <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-600 shadow-sm border border-gray-100 hover:bg-gray-50 active:scale-95 transition-all">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-black tracking-tight text-[#1A1C1E] absolute left-1/2 -translate-x-1/2">Rota Otimizada</h1>
      </header>

      {/* Fake Map Area */}
      <div className="w-full h-64 bg-gray-200 relative overflow-hidden flex items-center justify-center">
        {/* Decorative Map Pattern */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#1A1C1E 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
        
        {/* Route Line */}
        <svg className="absolute w-full h-full" style={{ zIndex: 1 }}>
          <path d="M 50 200 C 100 200, 150 50, 250 100 S 350 150, 400 50" fill="transparent" stroke="#8B5CF6" strokeWidth="4" strokeDasharray="8 8" />
        </svg>

        {/* Markers */}
        <div className="absolute left-[50px] bottom-[50px] w-4 h-4 bg-gray-800 rounded-full z-10 shadow-lg shadow-black/20 border-2 border-white"></div>
        <div className="absolute left-[250px] top-[100px] w-6 h-6 bg-purple-600 rounded-full z-10 flex items-center justify-center shadow-lg shadow-purple-500/40 border-2 border-white animate-bounce">
          <MapPin className="w-3 h-3 text-white" />
        </div>
        <div className="absolute right-[50px] top-[50px] w-4 h-4 bg-gray-400 rounded-full z-10 shadow-lg border-2 border-white"></div>
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#F8F9FA] via-transparent to-transparent z-20"></div>
      </div>

      <main className="flex-1 px-6 py-4 flex flex-col gap-6 pb-40 relative z-30">
        
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Progresso do Dia</span>
            <span className="text-lg font-black text-gray-900">{paradasFeitas} de {totalParadas} Paradas</span>
          </div>
          <div className="bg-purple-100 text-purple-600 font-bold px-3 py-1 rounded-full text-xs">
            Ativo
          </div>
        </div>

        {/* Timeline Steps */}
        <div className="flex flex-col gap-0 mt-2">
          {stops.map((stop, index) => (
            <div 
              key={stop.id} 
              className={`flex gap-4 relative ${stop.realId ? 'cursor-pointer hover:bg-gray-50 rounded-xl p-2 -ml-2 transition-colors' : 'p-2 -ml-2'}`}
              onClick={() => {
                if (stop.realId) navigate(`/instalador/servico/${stop.realId}`);
              }}
            >
              {/* Line connector */}
              {index !== stops.length - 1 && (
                <div className={`absolute left-5 top-10 bottom-[-16px] w-0.5 ${stop.isCompleted ? 'bg-green-500' : 'bg-gray-200'}`}></div>
              )}
              
              <div className="flex flex-col items-center z-10 shrink-0">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center mt-1 shadow-sm ${
                  stop.isCompleted 
                    ? 'bg-green-500 text-white' 
                    : stop.isNext 
                      ? 'bg-purple-600 text-white ring-4 ring-purple-100' 
                      : 'bg-white border-2 border-gray-200 text-gray-400'
                }`}>
                  {stop.isCompleted ? <CheckCircle2 className="w-3 h-3" /> : <div className="w-2 h-2 rounded-full bg-current"></div>}
                </div>
              </div>
              
              <div className={`flex flex-col pb-6 ${stop.isNext || stop.id === 'base' ? '' : 'opacity-70'}`}>
                <span className={`text-[10px] font-bold uppercase tracking-widest ${stop.isNext ? 'text-purple-600' : 'text-gray-400'}`}>
                  {stop.horario}
                </span>
                <span className={`text-base font-bold ${stop.isCompleted && stop.id !== 'base' ? 'text-gray-500 line-through decoration-gray-300' : 'text-gray-900'}`}>
                  {stop.cliente}
                </span>
                <span className="text-sm text-gray-500 font-medium leading-relaxed mt-0.5">
                  {stop.endereco}
                </span>
                
                {stop.isNext && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(`https://waze.com/ul?q=${encodeURIComponent(stop.endereco)}`, '_blank');
                    }}
                    className="mt-3 bg-purple-50 text-purple-600 font-bold text-xs uppercase tracking-widest px-4 py-2 rounded-xl flex items-center gap-2 w-fit hover:bg-purple-100 transition-colors"
                  >
                    <Navigation2 className="w-3 h-3" /> Iniciar Rota (Waze)
                  </button>
                )}
              </div>
            </div>
          ))}
          {totalParadas === 0 && (
            <div className="text-center text-gray-500 py-10 font-bold">Nenhuma parada programada para hoje.</div>
          )}
        </div>

      </main>

    </div>
  );
}
