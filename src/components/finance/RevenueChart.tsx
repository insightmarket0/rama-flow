import {
    Bar,
    ComposedChart,
    Line,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    CartesianGrid,
} from "recharts";
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
            netProfit: item.netProfit || 0,
        };

        // Add individual marketplace revenues
        marketplaces.forEach(m => {
            dataPoint[m.id] = Number(item.revenues?.[m.id] || 0);
        });

        return dataPoint;
    });

    return (
        <div className="w-full flex flex-col items-center justify-end relative">
            <h4 className="text-gray-500 uppercase tracking-widest text-[10px] font-bold mb-8 opacity-70">
                Evolução Mensal
            </h4>
            <div className="h-[250px] w-full max-w-4xl opacity-90">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                        <defs>
                            {marketplaces.map(m => (
                                <linearGradient key={`grad-${m.id}`} id={`grad-${m.id}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={m.color} stopOpacity={1} />
                                    <stop offset="100%" stopColor={m.color} stopOpacity={0.2} />
                                </linearGradient>
                            ))}
                            <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                                <feGaussianBlur stdDeviation="4" result="blur" />
                                <feMerge>
                                    <feMergeNode in="blur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff" opacity={0.03} />
                        <XAxis
                            dataKey="name"
                            stroke="#555"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            dy={10}
                            tickFormatter={(value) => value.toUpperCase()}
                        />
                        <Tooltip
                            cursor={{ fill: "rgba(255,255,255,0.02)" }}
                            content={({ active, payload, label }) => {
                                if (active && payload && payload.length) {
                                    // Calculate total only from marketplace entries (ignore netProfit)
                                    const total = payload
                                        .filter(p => p.dataKey !== 'netProfit')
                                        .reduce((acc: number, entry: any) => acc + (Number(entry.value) || 0), 0);

                                    const netProfitEntry = payload.find(p => p.dataKey === 'netProfit');

                                    return (
                                        <div className="rounded-2xl border border-white/5 bg-[#0A0A0A]/90 backdrop-blur-xl p-4 shadow-2xl min-w-[220px]">
                                            <div className="mb-2 border-b border-white/5 pb-2">
                                                <p className="text-[10px] font-bold text-gray-500 mb-1 tracking-widest uppercase">{label}</p>
                                                <div className="flex justify-between items-end">
                                                    <p className="text-2xl font-light text-white tracking-tighter">
                                                        {formatCurrency(total)}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="space-y-2 mb-3">
                                                {payload
                                                    .filter(p => p.dataKey !== 'netProfit')
                                                    .map((entry: any, index: number) => {
                                                    const market = marketplaces.find(m => m.id === entry.dataKey);
                                                    const Icon = market?.icon;

                                                    return (
                                                        <div key={index} className="flex items-center justify-between text-[10px] uppercase tracking-wider">
                                                            <div className="flex items-center gap-2">
                                                                {Icon ? (
                                                                    <Icon className="h-3 w-3" style={{ color: entry.color }} />
                                                                ) : (
                                                                    <div
                                                                        className="h-2 w-2 rounded-full"
                                                                        style={{ backgroundColor: entry.color }}
                                                                    />
                                                                )}
                                                                <span className="text-gray-400">
                                                                    {entry.name}
                                                                </span>
                                                            </div>
                                                            <span className="font-bold text-white">
                                                                {formatCurrency(entry.value as number)}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            
                                            {netProfitEntry && (
                                                <div className="pt-3 border-t border-[#00FF00]/10 mt-1">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[10px] font-bold text-[#00FF00] uppercase tracking-widest">Lucro Líquido</span>
                                                        <span className="text-sm font-bold text-[#00FF00]" style={{ filter: "drop-shadow(0 0 5px rgba(0,255,0,0.5))" }}>
                                                            {formatCurrency(netProfitEntry.value as number)}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
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
                                fill={`url(#grad-${market.id})`}
                                radius={index === marketplaces.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                                maxBarSize={40}
                            />
                        ))}
                        
                        <Line
                            type="monotone"
                            dataKey="netProfit"
                            name="Lucro Líquido"
                            stroke="#00FF00"
                            strokeWidth={2}
                            dot={{ r: 0 }}
                            activeDot={{ r: 4, fill: "#00FF00", stroke: "#000", strokeWidth: 2 }}
                            filter="url(#neonGlow)"
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
