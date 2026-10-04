import React from "react";
import { MapPin, CalendarDays, MessageCircle, Wrench, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAgendaStore } from "../../store/useAgendaStore";
import { useInstaladorStore } from "../../store/useInstaladorStore";
import { format } from "date-fns";

const checkIsLate = (horarioStr: string) => {
  if (!horarioStr) return false;
  const parts = horarioStr.split(':');
  if (parts.length < 2) return false;
  const [hours, minutes] = parts.map(Number);
  const now = new Date();
  const serviceTime = new Date();
  serviceTime.setHours(hours, minutes, 0);
  return now > serviceTime;
};

export default function InstaladorHome() {
  const navigate = useNavigate();
  const servicos = useAgendaStore(state => state.servicos);
  const perfil = useInstaladorStore(state => state.perfil);
  
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const todaysServicos = servicos.filter(s => s.data === todayStr);
  const pendentes = todaysServicos.filter(s => s.status === 'pendente');
  const concluidos = todaysServicos.filter(s => s.status === 'concluido');

  // Calculate estimated earnings
  const earnings = todaysServicos.reduce((acc, curr) => {
    const val = parseFloat(curr.valor.replace('R$ ', '').replace(',', '.'));
    return acc + (isNaN(val) ? 0 : val);
  }, 0);

  return (
    <div className="bg-[#F8F9FA] min-h-screen pb-32 font-sans relative">
      
      {/* Top Header / Greeting */}
      <div className="pt-2 px-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-purple-100 overflow-hidden border-2 border-white shadow-sm flex items-center justify-center">
            <span className="text-xl">{perfil.avatar}</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-[#1A1C1E] font-bold text-lg leading-tight">
              Olá, {perfil.nome ? perfil.nome.split(' ')[0] : 'Instalador'} 👋
            </h1>
            <p className="text-gray-500 text-xs font-medium truncate max-w-[150px]">{perfil.frase}</p>
          </div>
        </div>
        <div 
          onClick={() => navigate('/instalador/servicos')}
          className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm relative cursor-pointer hover:bg-gray-50 active:scale-95 transition-all"
        >
          <CalendarDays className="w-5 h-5 text-gray-700" />
          {pendentes.length > 0 && <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></div>}
        </div>
      </div>

      {/* Main Purple Card */}
      <div className="px-6 mt-5">
        <div className="bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] rounded-[32px] p-6 text-white shadow-lg shadow-purple-200 relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          
          <div className="relative z-10">
            <p className="text-white/80 text-sm font-medium mb-1">Rendimento de Hoje</p>
            <div className="flex items-end gap-2">
              <h2 className="text-4xl font-black tracking-tight">R$ {earnings.toFixed(2).replace('.', ',')}</h2>
              <span className="text-white/90 text-xs mb-2">/ estimativa</span>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-6 relative z-10">
            <div className="bg-white/20 px-4 py-2 rounded-2xl flex-1 text-center backdrop-blur-sm">
              <span className="block text-xl font-bold">{pendentes.length}</span>
              <span className="text-[10px] text-white/80 uppercase font-bold tracking-wider">Pendentes</span>
            </div>
            <div className="bg-white/20 px-4 py-2 rounded-2xl flex-1 text-center backdrop-blur-sm">
              <span className="block text-xl font-bold">{concluidos.length}</span>
              <span className="text-[10px] text-white/80 uppercase font-bold tracking-wider">Concluídas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-6 mt-5 flex justify-between gap-4">
        <button onClick={() => navigate('/instalador/rota')} className="flex flex-col items-center gap-2 flex-1 group">
          <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-500 group-hover:bg-purple-100 transition-colors">
            <MapPin className="w-6 h-6" />
          </div>
          <span className="text-xs font-semibold text-gray-700">Rota</span>
        </button>
        <button 
          onClick={() => window.open('https://wa.me/5511947233878?text=Olá%20Rogério%2C%20preciso%20de%20suporte%20(App%20Instalador)', '_blank')}
          className="flex flex-col items-center gap-2 flex-1 group"
        >
          <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 group-hover:bg-blue-100 transition-colors">
            <MessageCircle className="w-6 h-6" />
          </div>
          <span className="text-xs font-semibold text-gray-700">Suporte</span>
        </button>
        <button onClick={() => navigate('/instalador/estoque')} className="flex flex-col items-center gap-2 flex-1 group">
          <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 group-hover:bg-orange-100 transition-colors">
            <Wrench className="w-6 h-6" />
          </div>
          <span className="text-xs font-semibold text-gray-700">Estoque</span>
        </button>
      </div>

      {/* Services List */}
      <div className="px-6 mt-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-bold text-[#1A1C1E]">Próximas Instalações</h3>
          <span className="text-purple-600 text-xs font-bold cursor-pointer">Ver Mapa</span>
        </div>

        <div className="flex flex-col gap-4">
          {pendentes.length === 0 ? (
            <div className="text-center py-6 text-gray-400 font-bold">Nenhum serviço pendente hoje!</div>
          ) : pendentes.map((servico) => {
            const isLate = checkIsLate(servico.horario);
            
            return (
              <div 
                key={servico.id}
                onClick={() => navigate(`/instalador/servico/${servico.id}`)}
                className="bg-white rounded-3xl p-4 flex flex-col gap-4 shadow-[0_2px_10px_rgba(0,0,0,0.03)] cursor-pointer active:scale-[0.98] transition-transform border border-gray-50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isLate ? 'bg-red-50 text-red-500' : 'bg-orange-50 text-orange-500'}`}>
                      <Wrench className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#1A1C1E]">{servico.cliente}</h4>
                      <p className="text-xs text-gray-400 font-medium mt-0.5">{servico.horario} • {servico.tipo}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-sm font-bold text-gray-900">{servico.valor}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isLate ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                      {isLate ? 'Atrasado' : 'No Prazo'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-2xl mt-1">
                  <div className="flex items-center gap-2 text-gray-500">
                    <MapPin className="w-4 h-4 shrink-0" />
                    <span className="text-xs font-medium truncate max-w-[180px]">{servico.endereco}</span>
                  </div>
                  <button className="shrink-0 w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-purple-600">
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
