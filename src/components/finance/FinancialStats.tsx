import { DashboardStats } from '@/types/finance';

interface FinancialStatsProps {
    stats: DashboardStats;
}

export const FinancialStats = ({ stats }: FinancialStatsProps) => {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    return (
        <div className="flex flex-col items-center justify-center pt-2 pb-12 w-full">
            
            {/* The Hero Metric */}
            <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <h3 className="text-gray-500 uppercase tracking-[0.5em] text-[10px] font-semibold mb-6 flex items-center justify-center gap-4 opacity-70">
                    <span className="w-12 h-px bg-white/10" />
                    Faturamento Total
                    <span className="w-12 h-px bg-white/10" />
                </h3>
                <div className="text-[15vw] md:text-[8rem] lg:text-[8.5rem] font-light tracking-tighter leading-none mb-8 bg-gradient-to-b from-white via-white to-white/40 bg-clip-text text-transparent drop-shadow-2xl whitespace-nowrap">
                    {formatCurrency(stats.totalYear).replace('R$', '').trim()}
                </div>
                <div className="flex items-center justify-center gap-3">
                    <div className="flex items-center gap-3 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
                        <span className="text-white/60 tracking-[0.2em] uppercase text-xs font-bold">
                            BRL
                        </span>
                        <div className="w-px h-3 bg-white/20" />
                        <span className="text-[10px] font-bold text-[#00FF00] uppercase tracking-widest flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#00FF00] animate-pulse" />
                            +12% VS ANO ANTERIOR
                        </span>
                    </div>
                </div>
            </div>

            {/* Secondary Metrics Row */}
            <div className="w-[90%] grid grid-cols-3 gap-8 md:gap-12 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300 border-t border-white/5 pt-10 relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-[#00FF00]/50 to-transparent" />
                
                {/* Média Mensal */}
                <div className="text-center flex flex-col items-center">
                    <div className="text-gray-500 uppercase tracking-[0.3em] text-[9px] font-bold mb-4 opacity-70">Média Mensal</div>
                    <div className="text-2xl md:text-4xl font-light text-white tracking-tight">{formatCurrency(stats.monthlyAverage).replace('R$', '').trim()}</div>
                    <div className="text-gray-500 text-[9px] uppercase tracking-widest font-bold mt-2">BRL</div>
                </div>

                {/* Melhor Canal */}
                <div className="text-center flex flex-col items-center border-l border-r border-white/5 px-4">
                    <div className="text-gray-500 uppercase tracking-[0.3em] text-[9px] font-bold mb-4 opacity-70">Melhor Canal</div>
                    <div className="text-2xl md:text-4xl font-light text-white tracking-tight truncate w-full">{stats.bestChannel.name}</div>
                    <div className="text-[#00FF00] text-[9px] uppercase tracking-widest font-bold mt-2">{formatCurrency(stats.bestChannel.value)}</div>
                </div>

                {/* Melhor Mês */}
                <div className="text-center flex flex-col items-center">
                    <div className="text-gray-500 uppercase tracking-[0.3em] text-[9px] font-bold mb-4 opacity-70">Melhor Mês</div>
                    <div className="text-2xl md:text-4xl font-light text-white tracking-tight">{stats.bestMonth.month}</div>
                    <div className="text-[#00FF00] text-[9px] uppercase tracking-widest font-bold mt-2">{formatCurrency(stats.bestMonth.value)}</div>
                </div>

            </div>

            {/* Bloco de Metas Massivo (Abaixo do Faturamento Total) */}
            <div className="w-[90%] mt-16 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500 border-t border-white/5 pt-16 relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px bg-gradient-to-r from-transparent via-[#00FF00]/50 to-transparent" />
                
                {(() => {
                    // Meta pode ser puxada de outro lugar, por enquanto estático para apresentação
                    const metaAno = 5000000; 
                    const faturamentoAtual = stats.totalYear;
                    
                    const isPassed = faturamentoAtual >= metaAno;
                    const diferenca = Math.abs(metaAno - faturamentoAtual);
                    const percent = metaAno > 0 ? ((faturamentoAtual / metaAno) * 100).toFixed(1) : '0.0';
                    
                    return (
                        <div className="flex flex-col items-center justify-center">
                            <h3 className="text-gray-500 uppercase tracking-[0.5em] text-[10px] font-semibold mb-8 flex items-center justify-center gap-4 opacity-70">
                                <span className="w-12 h-px bg-white/10" />
                                Meta Anual (2026)
                                <span className="w-12 h-px bg-white/10" />
                            </h3>
                            
                            <div className="text-[10vw] md:text-[5rem] lg:text-[6rem] font-light tracking-tighter leading-none mb-4 text-white/50 drop-shadow-2xl whitespace-nowrap">
                                {formatCurrency(metaAno).replace('R$', '').trim()}
                            </div>

                            <div className="w-full grid grid-cols-2 gap-8 md:gap-12 mt-10">
                                {/* Atual */}
                                <div className="text-center flex flex-col items-center border-r border-white/5 pr-4">
                                    <div className="text-gray-500 uppercase tracking-[0.3em] text-[9px] font-bold mb-4 opacity-70">Faturamento Atual</div>
                                    <div className="text-3xl md:text-5xl font-light text-white tracking-tight">{formatCurrency(faturamentoAtual).replace('R$', '').trim()}</div>
                                    <div className="text-[#00FF00] text-[9px] uppercase tracking-widest font-bold mt-2 flex items-center gap-1">
                                        + {percent}% CONCLUÍDO
                                    </div>
                                </div>

                                {/* Falta para Bater / Passou */}
                                <div className="text-center flex flex-col items-center px-4">
                                    <div className="text-gray-500 uppercase tracking-[0.3em] text-[9px] font-bold mb-4 opacity-70">
                                        {isPassed ? 'Meta Superada em' : 'Falta para a Meta'}
                                    </div>
                                    <div className={`text-3xl md:text-5xl font-light tracking-tight ${isPassed ? 'text-[#00FF00]' : 'text-white/80'}`}>
                                        {formatCurrency(diferenca).replace('R$', '').trim()}
                                    </div>
                                    <div className={`text-[9px] uppercase tracking-widest font-bold mt-2 flex items-center gap-1 ${isPassed ? 'text-[#00FF00]' : 'text-rose-500'}`}>
                                        {isPassed ? 'META BATIDA!' : 'A CORRER'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })()}
            </div>
            
        </div>
    );
};