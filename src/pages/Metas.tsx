import { 
  Target, 
  CheckCircle2, 
  CircleDashed, 
  Rocket, 
  Store, 
  Users, 
  Video, 
  Globe, 
  Smartphone, 
  TrendingUp,
  ShoppingCart,
  Truck,
  DollarSign
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Metas() {
  const marketplaces = [
    { name: "Mercado Livre", status: "completed", icon: ShoppingCart, color: "text-yellow-500" },
    { name: "Shopee", status: "completed", icon: ShoppingCart, color: "text-orange-500" },
    { name: "Amazon", status: "completed", icon: ShoppingCart, color: "text-blue-500" },
    { name: "Magalu", status: "completed", icon: ShoppingCart, color: "text-blue-600" },
    { name: "TikTok", status: "pending", icon: Smartphone, color: "text-black dark:text-white" },
    { name: "Site Próprio", status: "pending", icon: Globe, color: "text-primary" },
  ];

  const completedCount = marketplaces.filter(m => m.status === "completed").length;
  const progressPercentage = (completedCount / marketplaces.length) * 100;

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8 pt-6 animate-in fade-in duration-500">
      {/* Cabeçalho de Visão */}
      <div className="flex flex-col space-y-3 mb-8">
        <div className="flex items-center gap-4">
          <Target className="h-10 w-10 text-[#00FF00] drop-shadow-[0_0_10px_rgba(0,255,0,0.3)]" />
          <h2 className="text-4xl font-light tracking-tight text-white">Estratégia e Crescimento</h2>
        </div>
        <p className="text-gray-400 text-sm font-medium max-w-3xl leading-relaxed">
          Acompanhe nossos objetivos estratégicos de expansão omnichannel e crescimento escalável. 
          Nossa meta é a excelência operacional, estabelecendo um padrão de mercado equivalente ao das maiores plataformas do setor.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Marketplaces Progress */}
        <div className="col-span-1 lg:col-span-2 bg-[#111111]/80 backdrop-blur-md border border-white/5 rounded-2xl p-8 flex flex-col justify-between shadow-2xl transition-all">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-2xl font-light text-white tracking-tight flex items-center gap-3">
                <Store className="h-6 w-6 text-[#00FF00]" />
                Presença em Marketplaces
              </h3>
              <span className="bg-white/5 text-white text-sm font-bold px-4 py-1.5 rounded-lg border border-white/10">
                {Math.round(progressPercentage)}%
              </span>
            </div>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-6">
              Expansão multicanal (Status: {completedCount} de {marketplaces.length})
            </p>

            {/* Cronograma de Próximos Passos */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <div className="flex-1 bg-[#0a0a0a] border border-white/5 rounded-xl p-4 flex items-center gap-4 hover:border-white/10 transition-all group">
                <div className="bg-white/5 p-2.5 rounded-lg border border-white/5 group-hover:scale-110 transition-transform">
                  <Globe className="h-5 w-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-[#00FF00] text-[10px] uppercase tracking-widest font-bold mb-0.5 flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF00] opacity-40"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00FF00]"></span>
                    </span>
                    Meta: Outubro
                  </p>
                  <p className="text-white font-bold text-sm">Site Próprio (D2C)</p>
                </div>
              </div>
              <div className="flex-1 bg-[#0a0a0a] border border-white/5 rounded-xl p-4 flex items-center gap-4 hover:border-white/10 transition-all group">
                <div className="bg-white/5 p-2.5 rounded-lg border border-white/5 group-hover:scale-110 transition-transform">
                  <Smartphone className="h-5 w-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-[#00FF00] text-[10px] uppercase tracking-widest font-bold mb-0.5 flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF00] opacity-40"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00FF00]"></span>
                    </span>
                    Meta: Novembro
                  </p>
                  <p className="text-white font-bold text-sm">TikTok Shop</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-8">
            <div className="w-full bg-white/5 rounded-full h-2.5 overflow-hidden">
              <div className="bg-[#00FF00] h-2.5 rounded-full shadow-[0_0_10px_rgba(0,255,0,0.5)]" style={{ width: `${progressPercentage}%` }}></div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {marketplaces.map((mk) => (
                <div key={mk.name} className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-[#0a0a0a] hover:border-white/10 transition-colors group">
                  <mk.icon className={`h-6 w-6 ${mk.color === 'text-primary' ? 'text-[#00FF00]' : mk.color === 'text-black dark:text-white' ? 'text-white' : mk.color} group-hover:scale-110 transition-transform`} />
                  <div className="flex flex-col">
                    <span className="font-bold text-white text-sm mb-0.5">{mk.name}</span>
                    <span className="text-[10px] uppercase tracking-widest text-gray-500 flex items-center gap-1.5 font-bold">
                      {mk.status === "completed" ? (
                        <><CheckCircle2 className="h-3 w-3 text-[#00FF00]" /> Ativo</>
                      ) : (
                        <><CircleDashed className="h-3 w-3 text-orange-500" /> A fazer</>
                      )}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Resumo Financeiro / Metas de Venda */}
        <div className="flex flex-col justify-between bg-[#111111]/80 backdrop-blur-md border border-white/5 rounded-2xl p-8 shadow-2xl">
          <div className="mb-6">
            <h3 className="text-2xl font-light text-white tracking-tight flex items-center gap-3 mb-2">
              <TrendingUp className="h-6 w-6 text-[#00FF00]" />
              Metas de Faturamento
            </h3>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Objetivos de receita bruta</p>
          </div>
          
          <div className="space-y-6 flex-1">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex flex-col">
                  <span className="text-white font-bold text-sm">Meta deste Ano</span>
                  <span className="text-[10px] text-gray-500 uppercase tracking-widest">Faturamento Bruto</span>
                </div>
                <span className="bg-[#00FF00]/10 text-[#00FF00] border border-[#00FF00]/20 text-xs font-bold py-1.5 px-3 rounded-lg">R$ 3.000.000</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex flex-col">
                  <span className="text-white font-bold text-sm">Meta do Ano que Vem</span>
                  <span className="text-[10px] text-gray-500 uppercase tracking-widest">Escala e Expansão</span>
                </div>
                <span className="bg-[#00FF00]/20 text-[#00FF00] border border-[#00FF00]/30 text-xs font-bold py-1.5 px-3 rounded-lg shadow-[0_0_10px_rgba(0,255,0,0.1)]">R$ 5.000.000</span>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed font-medium">
              Com a entrada no TikTok, Site Próprio e Afiliados, esperamos atingir a meta do ano que vem com maior margem de lucro.
            </p>
          </div>
          
          <div className="mt-8">
            <button className="w-full flex items-center justify-center gap-2 bg-[#00FF00] hover:bg-[#00FF00]/80 text-black px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-[0_0_15px_rgba(0,255,0,0.3)] hover:shadow-[0_0_20px_rgba(0,255,0,0.4)]">
              <Rocket className="h-4 w-4" />
              Acompanhar Resultados
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">

        {/* Card 1: Logística e Entrega */}
        <div className="bg-[#111315]/80 backdrop-blur-md border border-white/5 rounded-2xl p-6 flex flex-col justify-between shadow-lg hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(0,255,0,0.1)] hover:border-[#00FF00]/30 transition-all duration-500 animate-in slide-in-from-bottom-8 fade-in delay-100">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
              <h3 className="text-white text-lg font-semibold">Logística e Entrega</h3>
            </div>
            <p className="text-gray-400 text-sm mb-4">Experiência de Grandes Plataformas</p>
            <p className="text-gray-300 text-sm mb-6 leading-relaxed">
              Garantir entrega no mesmo dia para São Paulo (SP) e região do ABC, operando através da transportadora parceira já validada.
            </p>
          </div>
          {/* Botão Secundário Padronizado */}
          <button className="w-full py-3 px-4 bg-[#1A1D21] hover:bg-[#252A30] border border-white/10 text-white text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2">
            <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            Estrutura Ativa (Same-day Delivery)
          </button>
        </div>

        {/* Card 2: Programa de Afiliados */}
        <div className="bg-[#111315]/80 backdrop-blur-md border border-white/5 rounded-2xl p-6 flex flex-col justify-between shadow-lg hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(0,255,0,0.1)] hover:border-[#00FF00]/30 transition-all duration-500 animate-in slide-in-from-bottom-8 fade-in delay-200">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
              <h3 className="text-white text-lg font-semibold">Programa de Afiliados</h3>
            </div>
            <p className="text-gray-400 text-sm mb-4">Rede descentralizada de parceiros comerciais</p>
            <p className="text-gray-300 text-sm mb-6 leading-relaxed">
              Implementação de um programa estruturado de comissionamento, alavancando nossa capilaridade de vendas...
            </p>
          </div>
          
          <div>
            <div className="flex justify-between text-xs text-gray-400 mb-2">
              <span>Progresso</span>
              <span>10% Planejado</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-1.5 mb-6">
              <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: "10%" }}></div>
            </div>
            {/* Botão Padronizado */}
            <button className="w-full py-3 px-4 bg-[#1A1D21] hover:bg-[#252A30] border border-white/10 text-white text-sm font-medium rounded-lg transition-all duration-200">
              Gerenciar Plataforma
            </button>
          </div>
        </div>

        {/* Card 3: Live Commerce */}
        <div className="bg-[#111315]/80 backdrop-blur-md border border-white/5 rounded-2xl p-6 flex flex-col justify-between shadow-lg hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(0,255,0,0.1)] hover:border-[#00FF00]/30 transition-all duration-500 animate-in slide-in-from-bottom-8 fade-in delay-300">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
              <h3 className="text-white text-lg font-semibold">Live Commerce</h3>
            </div>
            <p className="text-gray-400 text-sm mb-4">Estratégia de vendas dinâmicas e interativas</p>
            <p className="text-gray-300 text-sm mb-6 leading-relaxed">
              Estruturação de transmissões ao vivo com foco em alta conversão e engajamento, utilizando plataformas de mídia...
            </p>
          </div>
          
          <div>
            <div className="flex justify-between text-xs text-gray-400 mb-2">
              <span>Progresso</span>
              <span>0% Iniciado</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-1.5 mb-6">
              <div className="bg-pink-500 h-1.5 rounded-full" style={{ width: "0%" }}></div>
            </div>
            {/* Botão Padronizado */}
            <button className="w-full py-3 px-4 bg-[#1A1D21] hover:bg-[#252A30] border border-white/10 text-white text-sm font-medium rounded-lg transition-all duration-200">
              Agendar Primeira Live
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
