import React from "react";
import { 
  Trophy, 
  Medal, 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  Activity,
  Target,
  AlertTriangle
} from "lucide-react";
import { IntegrationFlowMap } from "@/components/ui/IntegrationFlowMap";

// ---- MOCKS PARA O LEADERBOARD E ATIVIDADES ----
const MOCK_LEADERBOARD = [
  {
    id: "user_operacao_1",
    name: "Lucas",
    role: "Operação Marketplace",
    initials: "LU",
    rank: 1,
    metrics: {
      tickets_resolved: 45,
      announcements_read_on_time: "98%",
      avg_response_time: "15m" // Tempo médio para dar ciente num aviso
    },
    trend: "up"
  },
  {
    id: "user_operacao_2",
    name: "João",
    role: "Operação Marketplace",
    initials: "JO",
    rank: 2,
    metrics: {
      tickets_resolved: 38,
      announcements_read_on_time: "92%",
      avg_response_time: "45m"
    },
    trend: "stable"
  }
];

const MOCK_RECENT_ACTIVITY = [
  { id: 1, user: "Lucas", action: "resolveu um ajuste de anúncio", context: "SKU: KITGAS001 (Mercado Livre)", time: "Há 5 min", isPositive: true },
  { id: 2, user: "João", action: "deu Ciente em um aviso crítico", context: "Mural de Alinhamento", time: "Há 12 min", isPositive: true },
  { id: 3, user: "Lucas", action: "concluiu uma urgência atrasada", context: "Atualizar foto do kit de gás", time: "Há 45 min", isPositive: true },
  { id: 4, user: "Sistema", action: "emitiu alerta de SLA estourado", context: "João ainda não leu o aviso de Padrão de Imagens", time: "Há 2 horas", isPositive: false },
];

export default function RankingEquipe() {
  
  return (
    <div className="flex-1 p-4 md:p-8 pt-6 animate-in fade-in duration-500 max-w-6xl mx-auto w-full">
      
      {/* Header */}
      <div className="mb-8 border-b border-white/5 pb-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-3 h-3 rounded-full bg-[#00FF00] shadow-[0_0_10px_#00FF00] animate-pulse" />
          <span className="text-[#00FF00] text-[10px] font-bold tracking-[0.2em] uppercase opacity-80">
            Monitoramento Global
          </span>
        </div>
        <h2 className="text-4xl md:text-5xl font-light text-white tracking-tight leading-none">
          Radar da <span className="font-medium text-[#00FF00]">Equipe</span>
        </h2>
        <p className="text-gray-500 mt-4 text-sm max-w-2xl">
          Acompanhe o fluxo de tarefas, resoluções e o desempenho operacional dos membros chave da sua operação em tempo real.
        </p>
      </div>

      {/* Radar (Mapa de Integrações) */}
      <div className="mb-12 h-[500px] bg-[#111315]/40 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden shadow-lg">
        <div className="p-6 border-b border-white/5 bg-[#111315]/80 flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#00FF00] shadow-[0_0_10px_#00FF00] animate-pulse" />
          <h3 className="text-[#00FF00] text-[10px] font-bold tracking-[0.2em] uppercase opacity-80">
            Monitoramento Global de Processos
          </h3>
        </div>
        <div className="h-[calc(100%-60px)]">
          <IntegrationFlowMap />
        </div>
      </div>

      {/* Resumo da Semana (KPIs Globais) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-[#111315]/80 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle2 className="h-5 w-5 text-green-400" />
            <h3 className="text-gray-400 font-medium">Ajustes Entregues</h3>
          </div>
          <div className="text-3xl font-bold text-white mb-1">83</div>
          <p className="text-xs text-green-400 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> +12% vs semana passada
          </p>
        </div>

        <div className="bg-[#111315]/80 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="h-5 w-5 text-blue-400" />
            <h3 className="text-gray-400 font-medium">SLA Médio "Ciente"</h3>
          </div>
          <div className="text-3xl font-bold text-white mb-1">30m</div>
          <p className="text-xs text-blue-400 flex items-center gap-1">
            Tempo médio de resposta aos avisos
          </p>
        </div>

        <div className="bg-[#111315]/80 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <Target className="h-5 w-5 text-amber-400" />
            <h3 className="text-gray-400 font-medium">Taxa de Conformidade</h3>
          </div>
          <div className="text-3xl font-bold text-white mb-1">95%</div>
          <p className="text-xs text-amber-400 flex items-center gap-1">
            Avisos lidos no prazo vs Ignorados
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Coluna 1 e 2: O Pódio (Leaderboard) */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Medal className="h-6 w-6 text-white/50" />
            O Pódio (Volume de Entregas)
          </h3>

          {MOCK_LEADERBOARD.map((user) => {
            const isFirst = user.rank === 1;
            
            return (
              <div 
                key={user.id} 
                className={`relative overflow-hidden rounded-2xl p-6 transition-all shadow-xl ${
                  isFirst 
                    ? 'bg-gradient-to-r from-yellow-500/10 via-[#111315]/90 to-[#111315]/90 border border-yellow-500/30 shadow-yellow-500/5' 
                    : 'bg-[#111315]/80 border border-white/5'
                }`}
              >
                {/* Efeito de Brilho Fundo se for 1º */}
                {isFirst && <div className="absolute top-0 left-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl -translate-x-10 -translate-y-10" />}

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  
                  {/* Info Usuário */}
                  <div className="flex items-center gap-5">
                    <div className={`relative flex items-center justify-center shrink-0 rounded-full font-bold text-lg ${
                      isFirst ? 'h-16 w-16 bg-yellow-500/20 text-yellow-500 border-2 border-yellow-500/50' : 'h-14 w-14 bg-white/5 text-gray-300 border border-white/10'
                    }`}>
                      {user.initials}
                      {isFirst && (
                        <div className="absolute -top-2 -right-2 bg-yellow-500 text-black text-[10px] w-6 h-6 rounded-full flex items-center justify-center border-2 border-[#111315]">
                          1º
                        </div>
                      )}
                      {!isFirst && (
                        <div className="absolute -bottom-1 -right-1 bg-gray-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#111315]">
                          {user.rank}º
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <h4 className={`text-xl font-bold ${isFirst ? 'text-yellow-400' : 'text-white'}`}>{user.name}</h4>
                      <p className="text-sm text-gray-400">{user.role}</p>
                    </div>
                  </div>

                  {/* Métricas do Usuário */}
                  <div className="flex flex-wrap items-center gap-8">
                    <div className="text-center md:text-right">
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Ajustes Resolvidos</p>
                      <p className="text-2xl font-bold text-white">{user.metrics.tickets_resolved}</p>
                    </div>
                    
                    <div className="text-center md:text-right">
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Leitura de Avisos</p>
                      <p className="text-xl font-bold text-green-400">{user.metrics.announcements_read_on_time}</p>
                    </div>

                    <div className="text-center md:text-right">
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">SLA Resposta</p>
                      <p className="text-xl font-bold text-blue-400">{user.metrics.avg_response_time}</p>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Coluna 3: Atividade Recente (Feed de Auditoria) */}
        <div>
          <div className="bg-[#111315]/80 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-lg h-full">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Activity className="h-5 w-5 text-gray-400" />
              Feed de Auditoria
            </h3>

            <div className="space-y-6">
              {MOCK_RECENT_ACTIVITY.map((activity, index) => (
                <div key={activity.id} className="relative pl-6">
                  {/* Linha do Timeline */}
                  {index !== MOCK_RECENT_ACTIVITY.length - 1 && (
                    <div className="absolute left-2.5 top-6 bottom-[-24px] w-[1px] bg-white/10" />
                  )}
                  
                  {/* Ponto do Timeline */}
                  <div className={`absolute left-1.5 top-1.5 w-2 h-2 rounded-full ${
                    activity.isPositive ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'
                  }`} />

                  <div>
                    <p className="text-sm text-gray-300">
                      <span className="font-semibold text-white">{activity.user}</span> {activity.action}
                    </p>
                    <p className="text-xs text-gray-400 mt-1 font-medium bg-white/5 inline-block px-2 py-0.5 rounded border border-white/5">
                      {activity.context}
                    </p>
                    <p className="text-[10px] text-gray-500 mt-1.5 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-8 py-2 text-sm text-gray-400 hover:text-white border border-white/5 hover:bg-white/5 rounded-lg transition-colors">
              Ver Histórico Completo
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
