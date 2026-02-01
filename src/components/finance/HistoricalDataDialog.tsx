import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { History } from "lucide-react";

export const HistoricalDataDialog = () => {
    // Hardcoded historical data as requested
    const historicalData = [
        { year: 2024, total: 1116962.35 },
        { year: 2025, total: 1867737.96 },
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
                <Button variant="outline" size="icon" title="Histórico Anual" className="bg-[#0A0A0A] border-[#1F1F1F] hover:bg-[#1A1A1A] text-white">
                    <History className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#0A0A0A] border-[#1F1F1F]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-white">Histórico de Faturamento</DialogTitle>
                    <DialogDescription className="text-gray-400">
                        Consolidado anual de anos anteriores.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {historicalData.map((data) => (
                        <div key={data.year} className="flex items-center justify-between p-5 border border-[#1F1F1F] rounded-xl bg-[#121212] hover:bg-[#1A1A1A] transition-colors group">
                            <span className="text-xl font-bold text-gray-300 group-hover:text-white transition-colors">{data.year}</span>
                            <span className="text-2xl font-bold text-green-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.3)]">{formatCurrency(data.total)}</span>
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
};
