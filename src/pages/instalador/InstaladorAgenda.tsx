import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, CheckCircle2, Navigation, Calendar } from "lucide-react";
import { format, addDays, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useAgendaStore } from "../../store/useAgendaStore";

export default function InstaladorAgenda() {
  const navigate = useNavigate();
  const servicos = useAgendaStore(state => state.servicos);
  
  // Format current dates
  const today = new Date();
  const dates = [
    { label: "Ontem", date: format(subDays(today, 1), 'yyyy-MM-dd') },
    { label: "Hoje", date: format(today, 'yyyy-MM-dd') },
    { label: "Amanhã", date: format(addDays(today, 1), 'yyyy-MM-dd') },
    { label: format(addDays(today, 2), "dd MMM", { locale: ptBR }), date: format(addDays(today, 2), 'yyyy-MM-dd') }
  ];

  const [selectedDate, setSelectedDate] = useState(dates[1].date);

  const currentServicos = servicos.filter(s => s.data === selectedDate);

  return (
    <div className="flex flex-col min-h-[100dvh] bg-[#F8F9FA] text-[#1A1C1E] selection:bg-purple-200">
      
      {/* Header Soft */}
      <header className="sticky top-0 z-40 bg-[#F8F9FA]/90 backdrop-blur-xl pt-2 pb-2 px-6 flex flex-col gap-4 border-b border-gray-200/50">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-[#1A1C1E]">Sua Agenda</h1>
            <p className="text-gray-500 text-xs font-medium">Controle de atendimentos</p>
          </div>
          <button className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-purple-600 hover:bg-purple-50 transition-colors active:scale-95">
            <Search className="w-5 h-5" />
          </button>
        </div>

        {/* Date Selector */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-2 px-2">
          {dates.map(d => (
            <button
              key={d.date}
              onClick={() => setSelectedDate(d.date)}
              className={`px-5 py-2.5 rounded-2xl whitespace-nowrap text-xs font-bold transition-all active:scale-95 ${
                selectedDate === d.date 
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg shadow-purple-500/20' 
                  : 'bg-white text-gray-500 border border-gray-100 hover:border-purple-200 hover:text-purple-600'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </header>

      <main className="flex-1 px-6 py-6 flex flex-col gap-4 pb-40">
        {currentServicos.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-20 text-gray-400">
            <Calendar className="w-12 h-12 mb-4 opacity-50" />
            <p className="font-bold">Nenhum serviço agendado</p>
          </div>
        ) : (
          currentServicos.map((servico, index) => {
            const isLate = servico.status === 'pendente' && index === 0 && selectedDate === format(today, 'yyyy-MM-dd'); // Fake logic for visual
            
            return (
              <div 
                key={servico.id}
                onClick={() => navigate(`/instalador/servico/${servico.id}`)}
                className="bg-white rounded-3xl p-5 flex flex-col gap-4 shadow-[0_2px_10px_rgba(0,0,0,0.03)] cursor-pointer active:scale-[0.98] transition-transform border border-gray-50 relative overflow-hidden"
              >
                {servico.status === 'concluido' && (
                  <div className="absolute top-0 left-0 w-1 h-full bg-green-500" />
                )}
                
                {/* Top Row: Client + Badges */}
                <div className="flex items-start justify-between">
                  <div className="flex flex-col">
                    <h3 className="text-base font-black text-[#1A1C1E]">{servico.cliente}</h3>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">{servico.tipo}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-sm font-black text-gray-900">{servico.valor}</span>
                    {servico.status === 'concluido' ? (
                      <span className="bg-green-50 text-green-600 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Concluído
                      </span>
                    ) : (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isLate ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'}`}>
                        {servico.horario} • {isLate ? 'Atrasado' : 'No Prazo'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Row: Address */}
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-2xl mt-1">
                  <div className="flex items-center gap-2 text-gray-500">
                    <MapPin className="w-4 h-4 shrink-0" />
                    <span className="text-xs font-medium truncate max-w-[180px]">{servico.endereco}</span>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(`https://waze.com/ul?q=${encodeURIComponent(servico.endereco)}`, '_blank');
                    }}
                    className="shrink-0 w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-purple-600 hover:bg-purple-50 transition-colors"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </main>
    </div>
  );
}
