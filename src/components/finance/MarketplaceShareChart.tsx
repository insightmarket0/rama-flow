import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts";
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
                id: market.id, // we need id for pastel mapping
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

    const formatTooltip = (value: number) => {
        return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
    };

    // Mapeamento de cores pastel para a rosca
    const pastelColors: Record<string, string> = {
        mercadolivre: "#FDE047", // Yellow 300
        shopee: "#FB923C", // Orange 400
        amazon: "#7DD3FC", // Sky 300
        magalu: "#60A5FA", // Blue 400
    };

    return (
        <div className="w-full flex flex-col items-center justify-center relative">
            <h4 className="text-gray-500 uppercase tracking-widest text-[10px] font-bold mb-8 opacity-70">
                Faturamento por Canal
            </h4>
            <div className="h-[320px] w-full relative opacity-95">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <defs>
                            <filter id="pieGlow" x="-20%" y="-20%" width="140%" height="140%">
                                <feGaussianBlur stdDeviation="6" result="blur" />
                                <feMerge>
                                    <feMergeNode in="blur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                            {marketplaces.map(m => (
                                <linearGradient key={`pie-grad-${m.id}`} id={`pie-grad-${m.id}`} x1="0" y1="0" x2="1" y2="1">
                                    <stop offset="0%" stopColor={m.color} stopOpacity={1} />
                                    <stop offset="100%" stopColor={m.color} stopOpacity={0.3} />
                                </linearGradient>
                            ))}
                        </defs>
                        <Pie
                            data={chartData.data}
                            cx="50%"
                            cy="50%"
                            innerRadius={90}
                            outerRadius={110}
                            paddingAngle={3}
                            dataKey="value"
                            stroke="none"
                            filter="url(#pieGlow)"
                            labelLine={false}
                            label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
                                const RADIAN = Math.PI / 180;
                                const radius = 30 + innerRadius + (outerRadius - innerRadius);
                                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                const y = cy + radius * Math.sin(-midAngle * RADIAN);
                                const market = marketplaces.find(m => m.label === chartData.data[index].name);
                                const Icon = market?.icon;

                                if (percent < 0.01) return null;

                                return (
                                    <g>
                                        <foreignObject x={x - 32} y={y - 14} width={64} height={28} className="overflow-visible">
                                            <div className="flex items-center justify-center gap-1.5 bg-[#0A0A0A]/90 backdrop-blur-xl rounded-md border border-white/10 px-2 py-1 shadow-[0_4px_12px_rgba(0,0,0,0.5)] transition-all">
                                                {Icon && <Icon className="h-3 w-3" style={{ color: chartData.data[index].color }} />}
                                                <span className="text-[10px] font-bold text-white tracking-widest">
                                                    {`${(percent * 100).toFixed(0)}%`}
                                                </span>
                                            </div>
                                        </foreignObject>
                                    </g>
                                );
                            }}
                        >
                            {chartData.data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={`url(#pie-grad-${entry.id})`} />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value: number) => formatTooltip(value)}
                            contentStyle={{
                                backgroundColor: "rgba(10,10,10,0.95)",
                                backdropFilter: "blur(12px)",
                                borderColor: "rgba(255,255,255,0.05)",
                                borderRadius: "8px",
                                color: "#E5E7EB",
                                padding: "12px",
                                fontSize: "12px"
                            }}
                            itemStyle={{ color: "#E5E7EB", fontWeight: "bold", fontSize: "14px" }}
                        />
                        <Legend
                            verticalAlign="bottom"
                            height={40}
                            content={(props) => {
                                const { payload } = props;
                                return (
                                    <ul className="flex flex-wrap justify-center gap-4 mt-8">
                                        {payload?.map((entry, index) => {
                                            const realColor = chartData.data[index]?.color || "#FFF";
                                            return (
                                                <li key={`item-${index}`} className="flex items-center gap-2">
                                                    <span 
                                                        className="w-1.5 h-1.5 rounded-full" 
                                                        style={{ 
                                                            backgroundColor: realColor,
                                                            boxShadow: `0 0 8px ${realColor}`
                                                        }} 
                                                    />
                                                    <span className="text-gray-400 text-[9px] uppercase tracking-[0.2em] font-bold">
                                                        {entry.value}
                                                    </span>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                );
                            }}
                        />
                    </PieChart>
                </ResponsiveContainer>
                {/* Centered Total */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
                    <span className="text-[8px] text-gray-500 font-bold uppercase tracking-[0.3em] mb-2 opacity-80">Total</span>
                    <span className="text-3xl font-light tracking-[-0.03em] bg-gradient-to-b from-white via-white to-white/40 bg-clip-text text-transparent drop-shadow-sm">
                        {formatCurrency(chartData.totalAll).replace("R$", "").trim()}
                    </span>
                    <span className="text-[8px] text-gray-500 uppercase tracking-widest font-bold mt-1">BRL</span>
                </div>
            </div>
        </div>
    );
};
