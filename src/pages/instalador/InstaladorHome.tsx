import React from "react";
import { MapPin, Clock, CheckCircle2, Navigation, MessageCircle, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MOCK_AGENDA = [
  {
    id: "svc-1",
    cliente: "João da Silva",
    telefone: "5511999999999",
    endereco: "Rua das Flores, 123 - Centro",
    horario: "09:00",
    tipo: "Instalação Kit Gás 2M",
    status: "pendente",
  },
  {
    id: "svc-2",
    cliente: "Maria Souza",
    telefone: "5511988888888",
    endereco: "Av. Brasil, 450 - Jd. Primavera",
    horario: "23:59", // Future time to not be late
    tipo: "Troca de Registro",
    status: "pendente",
  },
  {
    id: "svc-3",
    cliente: "Carlos Oliveira",
    telefone: "5511977777777",
    endereco: "Rua do Sol, 88 - Vila Nova",
    horario: "14:00",
    tipo: "Instalação Kit Gás 1M",
    status: "concluido",
  }
];

// Helper para verificar se está atrasado (mock simplificado)
const checkIsLate = (horarioStr: string) => {
  const [hours, minutes] = horarioStr.split(':').map(Number);
  const now = new Date();
  const serviceTime = new Date();
  serviceTime.setHours(hours, minutes, 0);
  return now > serviceTime;
};

export default function InstaladorHome() {
  const navigate = useNavigate();
  
  const pendentes = MOCK_AGENDA.filter(s => s.status === 'pendente');
  const concluidos = MOCK_AGENDA.filter(s => s.status === 'concluido');

  return (
    <div className="p-4 flex flex-col gap-6">
      
      {/* Header Profile */}
      <div className="flex flex-col gap-1 mt-2">
        <h1 className="text-2xl font-bold text-white tracking-tight">Bom dia, Roberto.</h1>
        <p className="text-gray-400 text-sm">Você tem <span className="text-[#00FF00] font-bold">{pendentes.length} instalações</span> hoje.</p>
      </div>

      {/* Serviços Pendentes */}
      <div className="flex flex-col gap-3">
        <h2 className="text-[#00FF00] text-[10px] font-bold tracking-widest uppercase">Próximos Serviços</h2>
        
        {pendentes.map((servico) => {
          const isLate = checkIsLate(servico.horario);
          
          return (
            <div 
              key={servico.id} 
              onClick={() => navigate(`/instalador/servico/${servico.id}`)}
              className={`bg-[#111111] border ${isLate ? 'border-red-500/30' : 'border-white/5'} rounded-2xl p-4 flex flex-col gap-4 relative overflow-hidden active:scale-[0.98] transition-all`}
            >
              {/* Status indicator */}
              <div className={`absolute top-0 left-0 w-1 h-full ${isLate ? 'bg-red-500' : 'bg-[#00FF00]'}`} />
              
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <span className="text-white font-bold text-lg">{servico.cliente}</span>
                  <span className="text-gray-400 text-xs font-medium mt-1">{servico.tipo}</span>
                </div>
                <div className={`bg-black/50 border ${isLate ? 'border-red-500/20' : 'border-white/5'} px-2 py-1 rounded-lg flex flex-col items-end gap-0.5`}>
                  <div className="flex items-center gap-1.5">
                    <Clock className={`w-3 h-3 ${isLate ? 'text-red-500' : 'text-[#00FF00]'}`} />
                    <span className="text-white font-bold text-xs">{servico.horario}</span>
                  </div>
                  {isLate && <span className="text-red-500 text-[9px] font-bold uppercase tracking-wider">Atrasado</span>}
                </div>
              </div>

              <div className="flex items-start gap-2 mt-2">
                <MapPin className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
                <span className="text-gray-400 text-sm leading-tight">{servico.endereco}</span>
              </div>
              
              <div className="mt-2 pt-3 border-t border-white/5 grid grid-cols-3 gap-2">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    const msg = encodeURIComponent(`Olá ${servico.cliente}! Sou o Roberto da RAMA, estou a caminho para sua instalação.`);
                    window.open(`https://wa.me/${servico.telefone}?text=${msg}`, '_blank');
                  }}
                  className="bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] rounded-xl py-3 text-xs font-bold flex flex-col items-center justify-center gap-1 transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-[10px]">Avisar</span>
                </button>

                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(servico.endereco)}`, '_blank');
                  }}
                  className="bg-white/5 hover:bg-white/10 text-white rounded-xl py-3 text-xs font-bold flex flex-col items-center justify-center gap-1 transition-colors"
                >
                  <Navigation className="w-5 h-5 text-blue-400" />
                  <span className="text-[10px]">Navegar</span>
                </button>

                <button 
                  className={`rounded-xl py-3 text-xs font-bold transition-colors flex items-center justify-center ${isLate ? 'bg-red-500 text-white' : 'bg-[#00FF00] text-black'}`}
                >
                  Iniciar
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Serviços Concluídos */}
      {concluidos.length > 0 && (
        <div className="flex flex-col gap-3 mt-4">
          <h2 className="text-gray-500 text-[10px] font-bold tracking-widest uppercase">Concluídos</h2>
          
          {concluidos.map((servico) => (
            <div 
              key={servico.id} 
              className="bg-[#111111]/50 border border-white/5 rounded-2xl p-4 flex flex-col gap-2 relative overflow-hidden opacity-70"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-gray-600" />
              <div className="flex justify-between items-center">
                <span className="text-white font-bold">{servico.cliente}</span>
                <CheckCircle2 className="w-5 h-5 text-gray-500" />
              </div>
              <span className="text-gray-400 text-xs">{servico.tipo}</span>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
