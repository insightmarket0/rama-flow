import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { History, TrendingUp } from "lucide-react";

interface HistoricalDataDialogProps {
    currentTotal?: number;
}

export const HistoricalDataDialog = ({ currentTotal = 0 }: HistoricalDataDialogProps) => {
    // Hardcoded historical data + current year
    const historicalData = [
        { year: 2024, total: 1116962.35 },
        { year: 2025, total: 1867737.96 },
        { year: new Date().getFullYear(), total: currentTotal, isCurrent: true },
    ];

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(value);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon" title="Histórico Anual" className="bg-transparent hover:bg-white/5 border-white/10 text-white rounded-none h-8 w-8">
                    <History className="h-3 w-3" />
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#0A0A0A]/95 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden rounded-2xl">
                {/* Tech background elements */}
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#00FF00]/50 to-transparent" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-[#00FF00]/5 rounded-full blur-[100px] pointer-events-none" />
                
                <DialogHeader className="relative z-10">
                    <DialogTitle className="text-xl font-bold tracking-widest uppercase text-white/90">Histórico de Faturamento</DialogTitle>
                    <DialogDescription className="text-gray-500 uppercase tracking-widest text-[10px] font-bold">
                        Evolução consolidada anual
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-6 relative z-10">
                    {historicalData.map((data, index) => {
                        const previousYear = index > 0 ? historicalData[index - 1] : null;
                        let growth = 0;
                        if (previousYear && previousYear.total > 0) {
                            growth = ((data.total - previousYear.total) / previousYear.total) * 100;
                        }

                        return (
                            <div key={data.year} className={`flex items-center justify-between p-5 border ${data.isCurrent ? 'border-[#00FF00]/30 bg-[#00FF00]/5' : 'border-white/5 bg-[#121212]'} rounded-xl transition-all hover:bg-white/[0.02] relative overflow-hidden group`}>
                                {data.isCurrent && (
                                    <div className="absolute top-0 left-0 w-1 h-full bg-[#00FF00] shadow-[0_0_10px_#00FF00]" />
                                )}
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-3">
                                        <span className={`text-xl font-black ${data.isCurrent ? 'text-white' : 'text-gray-400 group-hover:text-white'} transition-colors`}>{data.year}</span>
                                        {data.isCurrent && (
                                            <span className="bg-[#00FF00] text-black text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider animate-pulse">Atual</span>
                                        )}
                                    </div>
                                    {previousYear && growth !== 0 && (
                                        <div className="flex items-center gap-1.5 mt-1 opacity-80 group-hover:opacity-100 transition-opacity">
                                            <TrendingUp className={`w-3 h-3 ${growth > 0 ? 'text-[#00FF00]' : 'text-red-500'}`} />
                                            <span className={`text-[10px] font-bold tracking-widest ${growth > 0 ? 'text-[#00FF00]' : 'text-red-500'}`}>
                                                {growth > 0 ? '+' : ''}{growth.toFixed(1)}% VS ANO ANTERIOR
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <span className={`text-2xl font-bold tracking-tight ${data.isCurrent ? 'text-white drop-shadow-sm' : 'text-gray-300'}`}>
                                    {formatCurrency(data.total)}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </DialogContent>
        </Dialog>
    );
};
