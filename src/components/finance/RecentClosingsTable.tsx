import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MonthlyClosing } from "@/types/finance";
import { Trash2, Pencil } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useMarketplaces } from "@/hooks/useMarketplaces";
import { useAuth } from "@/hooks/useAuth";

interface RecentClosingsTableProps {
    data: MonthlyClosing[];
    onDelete: (id: string) => void;
    onEdit: (closing: MonthlyClosing) => void;
}

export const RecentClosingsTable = ({
    data,
    onDelete,
    onEdit,
}: RecentClosingsTableProps) => {
    const { marketplaces } = useMarketplaces();
    const { user } = useAuth();
    const isAdmin = user?.email === "livia@hotmail.com";

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(value);
    };

    const sortedData = [...data].sort((a, b) => b.month.localeCompare(a.month));

    return (
        <div className="w-full relative mt-8">
            <div className="mb-6 flex items-center justify-between">
                <h4 className="text-gray-500 uppercase tracking-[0.3em] text-[10px] font-bold opacity-70">
                    Lançamentos Recentes
                </h4>
                <div className="h-px bg-gradient-to-r from-white/10 to-transparent flex-1 ml-4" />
            </div>
            
            <div className="w-full overflow-hidden">
                <Table>
                    <TableHeader className="bg-transparent">
                        <TableRow className="border-b border-white/5 hover:bg-transparent">
                            <TableHead className="text-gray-500 uppercase text-[10px] tracking-widest font-bold w-[120px]">Mês/Ano</TableHead>
                            {/* Dynamic Headers */}
                            {marketplaces.map(m => (
                                <TableHead key={m.id} className="text-right text-gray-500 uppercase text-[10px] tracking-widest font-bold">{m.label}</TableHead>
                            ))}
                            <TableHead className="text-right text-gray-500 uppercase text-[10px] tracking-widest font-bold">Lucro Líquido</TableHead>
                            <TableHead className="text-right text-gray-500 uppercase text-[10px] tracking-widest font-bold">Total Geral</TableHead>
                            <TableHead className="text-right text-gray-500 uppercase text-[10px] tracking-widest font-bold">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedData.map((row) => (
                            <TableRow key={row.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                <TableCell className="font-bold text-white capitalize text-xs tracking-wider">
                                    {format(parseISO(row.month + "-01"), "MMMM/yyyy", {
                                        locale: ptBR,
                                    })}
                                </TableCell>
                                {marketplaces.map(market => (
                                    <TableCell key={`td-${row.id}-${market.id}`} className="text-right text-gray-400 font-light text-sm tracking-wide">
                                        {formatCurrency(Number(row.revenues?.[market.id] || 0))}
                                    </TableCell>
                                ))}
                                <TableCell className="text-right text-[#00FF00] font-medium tracking-wide drop-shadow-[0_0_8px_rgba(0,255,0,0.3)]">
                                    {formatCurrency(row.netProfit || 0)}
                                </TableCell>
                                <TableCell className="text-right text-[#00FF00] font-bold tracking-wide drop-shadow-[0_0_12px_rgba(0,255,0,0.5)]">
                                    {formatCurrency(row.total)}
                                </TableCell>
                                <TableCell className="text-right">
                                    {isAdmin && (
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => onEdit(row)}
                                                className="h-8 w-8 text-white/40 hover:text-white hover:bg-white/10 rounded-none transition-all"
                                            >
                                                <Pencil className="h-3 w-3" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => onDelete(row.id)}
                                                className="h-8 w-8 text-white/40 hover:text-red-500 hover:bg-red-500/10 rounded-none transition-all"
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                        {sortedData.length === 0 && (
                            <TableRow className="border-white/5 hover:bg-transparent">
                                <TableCell colSpan={marketplaces.length + 4} className="h-24 text-center text-gray-500 uppercase tracking-widest text-xs font-bold">
                                    Nenhum fechamento registrado.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};
