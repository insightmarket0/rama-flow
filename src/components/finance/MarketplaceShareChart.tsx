import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MonthlyClosing } from "@/types/finance";
import { useMarketplaces } from "@/hooks/useMarketplaces";
import { useMemo } from "react";

interface MarketplaceShareChartProps {
    data: MonthlyClosing[];
}

export const MarketplaceShareChart = ({ data }: MarketplaceShareChartProps) => {
    const { marketplaces } = useMarketplaces();

    const chartData = useMemo(() => {
        // Aggregate totals by marketplace dynamic keys
        const totals: Record<string, number> = {};
        let totalAll = 0;

        data.forEach(closing => {
            Object.entries(closing.revenues || {}).forEach(([shopId, value]) => {
                const amount = Number(value) || 0;
                totals[shopId] = (totals[shopId] || 0) + amount;
                totalAll += amount;
            });
        });

        return {
            data: marketplaces.map(market => ({
                name: market.label,
                value: totals[market.id] || 0,
                color: market.color
            })).filter(item => item.value > 0),
            totalAll
        };
    }, [data, marketplaces]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    return (
        <Card className="col-span-3 bg-[#0A0A0A] border-[#1F1F1F] shadow-lg rounded-xl">
            <CardHeader>
                <CardTitle className="text-xl font-bold text-white">Share por Marketplace</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData.data}
                                cx="50%"
                                cy="50%"
                                innerRadius={85}
                                outerRadius={105}
                                paddingAngle={2}
                                dataKey="value"
                                stroke="none"
                            >
                                {chartData.data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value: number) => formatCurrency(value)}
                                contentStyle={{
                                    backgroundColor: "#121212",
                                    borderColor: "#333",
                                    borderRadius: "12px",
                                    color: "#fff"
                                }}
                                itemStyle={{ color: "#fff" }}
                            />
                            <Legend
                                verticalAlign="bottom"
                                height={36}
                                iconType="circle"
                                formatter={(value) => <span className="text-gray-300 font-medium ml-1">{value}</span>}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    {/* Centered Total */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
                        <span className="text-sm text-muted-foreground font-medium uppercase tracking-wide">Total</span>
                        <span className="text-2xl font-bold text-white">
                            {formatCurrency(chartData.totalAll)}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
