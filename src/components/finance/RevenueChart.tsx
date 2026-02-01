import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MonthlyClosing } from "@/types/finance";
import { useMarketplaces } from "@/hooks/useMarketplaces";

interface RevenueChartProps {
    data: MonthlyClosing[];
}

export const RevenueChart = ({ data }: RevenueChartProps) => {
    const { marketplaces } = useMarketplaces();

    // Sort data by month to ensure correct order
    const sortedData = [...data].sort((a, b) => a.month.localeCompare(b.month));

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    const chartData = sortedData.map((item) => {
        const [year, month] = item.month.split("-");
        const date = new Date(parseInt(year), parseInt(month) - 1);
        const monthName = date.toLocaleString("pt-BR", { month: "short" });
        const capitalizedMonth =
            monthName.charAt(0).toUpperCase() + monthName.slice(1);

        // Create base object with common props
        const dataPoint: any = {
            name: capitalizedMonth,
            total: item.total,
            fullDate: item.month,
        };

        // Add individual marketplace revenues
        marketplaces.forEach(m => {
            dataPoint[m.id] = Number(item.revenues?.[m.id] || 0);
        });

        return dataPoint;
    });

    return (
        <Card className="col-span-4 bg-[#0A0A0A] border-[#1F1F1F] shadow-lg rounded-xl">
            <CardHeader>
                <CardTitle className="text-xl font-bold text-white mb-2">Evolução Mensal</CardTitle>
            </CardHeader>
            <CardContent className="pl-0">
                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" opacity={0.4} />
                            <XAxis
                                dataKey="name"
                                stroke="#666"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                dy={10}
                            />
                            <YAxis
                                stroke="#666"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `R$ ${value / 1000}k`}
                            />
                            <Tooltip
                                cursor={{ fill: "rgba(255,255,255,0.05)" }}
                                content={({ active, payload, label }) => {
                                    if (active && payload && payload.length) {
                                        // Calculate total for this specific tooltip instance to be safe
                                        const total = payload.reduce((acc: number, entry: any) => acc + (Number(entry.value) || 0), 0);

                                        return (
                                            <div className="rounded-xl border border-[#333] bg-[#121212] p-4 shadow-2xl min-w-[200px]">
                                                <div className="mb-2 border-b border-[#333] pb-2">
                                                    <p className="text-sm font-medium text-muted-foreground mb-1">{label}</p>
                                                    <p className="text-2xl font-bold text-white">
                                                        {formatCurrency(total)}
                                                    </p>
                                                </div>
                                                <div className="space-y-1.5">
                                                    {payload.map((entry: any, index: number) => {
                                                        const market = marketplaces.find(m => m.id === entry.dataKey);
                                                        const Icon = market?.icon;

                                                        return (
                                                            <div key={index} className="flex items-center justify-between text-xs">
                                                                <div className="flex items-center gap-2">
                                                                    {Icon ? (
                                                                        <Icon className="h-3 w-3" style={{ color: entry.color }} />
                                                                    ) : (
                                                                        <div
                                                                            className="h-2.5 w-2.5 rounded-full"
                                                                            style={{ backgroundColor: entry.color }}
                                                                        />
                                                                    )}
                                                                    <span className="text-gray-300">
                                                                        {entry.name}
                                                                    </span>
                                                                </div>
                                                                <span className="font-medium text-white">
                                                                    {formatCurrency(entry.value as number)}
                                                                </span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            {marketplaces.map((market, index) => (
                                <Bar
                                    key={market.id}
                                    dataKey={market.id}
                                    name={market.label}
                                    stackId="a"
                                    fill={market.color}
                                    radius={index === marketplaces.length - 1 ? [6, 6, 0, 0] : [0, 0, 0, 0]}
                                    maxBarSize={60}
                                />
                            ))}
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};
