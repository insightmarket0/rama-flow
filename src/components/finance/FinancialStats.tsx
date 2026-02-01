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

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Faturamento Total (Ano)</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-primary">{formatCurrency(stats.totalYear)}</div>
                    <p className="text-xs text-muted-foreground">Acumulado do ano atual</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Média Mensal</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(stats.monthlyAverage)}</div>
                    <p className="text-xs text-muted-foreground">Média de faturamento por mês</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Melhor Canal</CardTitle>
                    <Trophy className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold capitalize">{stats.bestChannel.name}</div>
                    <p className="text-xs text-muted-foreground">
                        {formatCurrency(stats.bestChannel.value)} neste canal
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Melhor Mês</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold capitalize">{stats.bestMonth.month}</div>
                    <p className="text-xs text-muted-foreground">
                        {formatCurrency(stats.bestMonth.value)} faturados
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};
