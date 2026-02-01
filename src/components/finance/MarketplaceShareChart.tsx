import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MonthlyClosing } from "@/types/finance";
import { useMarketplaces } from "@/hooks/useMarketplaces";

interface MarketplaceShareChartProps {
    data: MonthlyClosing[];
}

export const MarketplaceShareChart = ({ data }: MarketplaceShareChartProps) => {
    const { marketplaces } = useMarketplaces();

    // Aggregate totals by marketplace dynamic keys
    const totals: Record<string, number> = {};

    data.forEach(closing => {
        Object.entries(closing.revenues || {}).forEach(([shopId, value]) => {
            totals[shopId] = (totals[shopId] || 0) + (Number(value) || 0);
        });
    });

    const chartData = marketplaces.map(market => ({
        name: market.label,
        value: totals[market.id] || 0,
        color: market.color // Use user-defined color
    })).filter(item => item.value > 0);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(value);
    };

    return (
        <Card className="col-span-3">
            <CardHeader>
                <CardTitle>Share por Marketplace</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value: number) => formatCurrency(value)}
                                contentStyle={{
                                    backgroundColor: "hsl(var(--card))",
                                    borderColor: "hsl(var(--border))",
                                    borderRadius: "var(--radius)",
                                }}
                                itemStyle={{ color: "hsl(var(--foreground))" }}
                            />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};
