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
                <Button variant="outline" size="icon" title="Histórico Anual">
                    <History className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Histórico de Faturamento</DialogTitle>
                    <DialogDescription>
                        Consolidado anual de anos anteriores.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {historicalData.map((data) => (
                        <div key={data.year} className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-muted/50 transition-colors">
                            <span className="text-lg font-bold text-muted-foreground">{data.year}</span>
                            <span className="text-xl font-bold text-emerald-500">{formatCurrency(data.total)}</span>
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
};
