import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardStats } from "@/types/finance";
import { DollarSign, TrendingUp, Trophy, Calendar } from "lucide-react";

interface FinancialStatsProps {
    stats: DashboardStats;
}

export const FinancialStats = ({ stats }: FinancialStatsProps) => {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(value);
    };

    const cardClass = "bg-[#0A0A0A] border-[#1F1F1F] text-card-foreground shadow-lg rounded-xl overflow-hidden relative";
    const gradientOverlay = "absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none";

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Faturamento Total */}
            <Card className={cardClass}>
                <div className={gradientOverlay} />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                    <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Faturamento Total (Ano)</CardTitle>
                    <DollarSign className="h-6 w-6 text-green-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                </CardHeader>
                <CardContent className="relative z-10">
                    <div className="text-3xl font-extrabold text-white mt-1">{formatCurrency(stats.totalYear)}</div>
                    <p className="text-xs text-muted-foreground mt-2">Acumulado do ano atual</p>
                </CardContent>
            </Card>

            {/* Média Mensal */}
            <Card className={cardClass}>
                <div className={gradientOverlay} />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                    <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Média Mensal</CardTitle>
                    <TrendingUp className="h-6 w-6 text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                </CardHeader>
                <CardContent className="relative z-10">
                    <div className="text-3xl font-extrabold text-white mt-1">{formatCurrency(stats.monthlyAverage)}</div>
                    <p className="text-xs text-muted-foreground mt-2">Média de faturamento por mês</p>
                </CardContent>
            </Card>

            {/* Melhor Canal */}
            <Card className={cardClass}>
                <div className={gradientOverlay} />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                    <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Melhor Canal</CardTitle>
                    <Trophy className="h-6 w-6 text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
                </CardHeader>
                <CardContent className="relative z-10">
                    <div className="text-3xl font-extrabold text-white capitalize mt-1 truncate">{stats.bestChannel.name}</div>
                    <p className="text-xs text-muted-foreground mt-2">
                        <span className="text-white font-medium">{formatCurrency(stats.bestChannel.value)}</span> neste canal
                    </p>
                </CardContent>
            </Card>

            {/* Melhor Mês */}
            <Card className={cardClass}>
                <div className={gradientOverlay} />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                    <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Melhor Mês</CardTitle>
                    <Calendar className="h-6 w-6 text-purple-500 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                </CardHeader>
                <CardContent className="relative z-10">
                    <div className="text-3xl font-extrabold text-white capitalize mt-1">{stats.bestMonth.month}</div>
                    <p className="text-xs text-muted-foreground mt-2">
                        <span className="text-white font-medium">{formatCurrency(stats.bestMonth.value)}</span> faturados
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};
