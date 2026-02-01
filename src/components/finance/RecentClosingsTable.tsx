import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
        <Card className="bg-[#0A0A0A] border-[#1F1F1F] shadow-lg rounded-xl overflow-hidden">
            <CardHeader className="border-b border-[#1F1F1F]">
                <CardTitle className="text-xl font-bold text-white">Lançamentos Recentes</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader className="bg-[#121212]">
                        <TableRow className="border-[#1F1F1F] hover:bg-[#121212]">
                            <TableHead className="text-gray-400 font-medium">Mês/Ano</TableHead>
                            {/* Dynamic Headers */}
                            {marketplaces.map(m => (
                                <TableHead key={m.id} className="text-gray-400 font-medium">{m.label}</TableHead>
                            ))}
                            <TableHead className="text-gray-200 font-bold">Total Geral</TableHead>
                            <TableHead className="text-right text-gray-400">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedData.map((row) => (
                            <TableRow key={row.id} className="border-[#1F1F1F] hover:bg-[#121212]/50 transition-colors">
                                <TableCell className="capitalize text-gray-300 font-medium">
                                    {format(parseISO(row.month + "-01"), "MMMM/yyyy", {
                                        locale: ptBR,
                                    })}
                                </TableCell>
                                {/* Dynamic Cells */}
                                {marketplaces.map(m => (
                                    <TableCell key={m.id} className="text-gray-400">
                                        {formatCurrency(Number(row.revenues?.[m.id] || 0))}
                                    </TableCell>
                                ))}

                                <TableCell className="font-bold text-green-500">{formatCurrency(row.total)}</TableCell>
                                <TableCell className="text-right">
                                    {isAdmin && (
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => onEdit(row)}
                                                className="h-8 w-8 text-blue-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => onDelete(row.id)}
                                                className="h-8 w-8 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                        {sortedData.length === 0 && (
                            <TableRow className="border-[#1F1F1F]">
                                <TableCell colSpan={marketplaces.length + 3} className="h-24 text-center text-gray-500">
                                    Nenhum fechamento registrado.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};
