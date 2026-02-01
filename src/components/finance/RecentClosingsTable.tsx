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

interface RecentClosingsTableProps {
    data: MonthlyClosing[];
    onDelete: (id: string) => void;
    onEdit: (closing: MonthlyClosing) => void;
}

import { useAuth } from "@/hooks/useAuth";

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
        <Card>
            <CardHeader>
                <CardTitle>Lançamentos Recentes</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Mês/Ano</TableHead>
                            {/* Dynamic Headers */}
                            {marketplaces.map(m => (
                                <TableHead key={m.id}>{m.label}</TableHead>
                            ))}
                            <TableHead className="font-bold">Total Geral</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedData.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell className="capitalize">
                                    {format(parseISO(row.month + "-01"), "MMMM/yyyy", {
                                        locale: ptBR,
                                    })}
                                </TableCell>
                                {/* Dynamic Cells */}
                                {marketplaces.map(m => (
                                    <TableCell key={m.id}>
                                        {formatCurrency(Number(row.revenues?.[m.id] || 0))}
                                    </TableCell>
                                ))}

                                <TableCell className="font-bold">{formatCurrency(row.total)}</TableCell>
                                <TableCell className="text-right">
                                    {isAdmin && (
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => onEdit(row)}
                                                className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => onDelete(row.id)}
                                                className="h-8 w-8 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                        {sortedData.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={marketplaces.length + 3} className="h-24 text-center">
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
