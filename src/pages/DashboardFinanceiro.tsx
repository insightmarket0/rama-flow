import { useMemo, useState } from "react";
import { FinancialStats } from "@/components/finance/FinancialStats";
import { RevenueChart } from "@/components/finance/RevenueChart";
import { MarketplaceShareChart } from "@/components/finance/MarketplaceShareChart";
import { RecentClosingsTable } from "@/components/finance/RecentClosingsTable";
import { ClosingFormDialog } from "@/components/finance/ClosingFormDialog";
import { MarketplacesDialog } from "@/components/finance/MarketplacesDialog";
import { MonthlyClosing, DashboardStats } from "@/types/finance";
import { useFinancialClosings } from "@/hooks/useFinancialClosings";
import { useMarketplaces } from "@/hooks/useMarketplaces";
import { Loader2, Plus, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { HistoricalDataDialog } from "@/components/finance/HistoricalDataDialog";

import { useAuth } from "@/hooks/useAuth";

const DashboardFinanceiro = () => {
  const { user } = useAuth();
  const { closings, isLoading: loadingClosings, createClosing, deleteClosing, updateClosing } =
    useFinancialClosings();
  const { marketplaces, isLoading: loadingMarketplaces } = useMarketplaces();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClosing, setEditingClosing] = useState<MonthlyClosing | null>(null);

  // Calculate statistics
  const stats: DashboardStats = useMemo(() => {
    if (closings.length === 0) {
      return {
        totalYear: 0,
        monthlyAverage: 0,
        bestChannel: { name: "-", value: 0 },
        bestMonth: { month: "-", value: 0 },
      };
    }

    const currentYear = new Date().getFullYear().toString();
    const currentYearClosings = closings.filter((c) =>
      c.month.startsWith(currentYear)
    );

    const totalYear = currentYearClosings.reduce(
      (acc, curr) => acc + curr.total,
      0
    );
    const monthlyAverage = totalYear / (currentYearClosings.length || 1);

    // Dynamic Channel Totals
    const channelTotals: Record<string, number> = {};
    closings.forEach(closing => {
      Object.entries(closing.revenues || {}).forEach(([shopId, value]) => {
        channelTotals[shopId] = (channelTotals[shopId] || 0) + (Number(value) || 0);
      });
    });

    const bestChannelEntry = Object.entries(channelTotals).reduce((a, b) =>
      a[1] > b[1] ? a : b,
      ["-", 0]
    );

    // Resolve Label from ID
    const bestChannelLabel = marketplaces.find(m => m.id === bestChannelEntry[0])?.label || bestChannelEntry[0];

    const bestMonthEntry = closings.reduce((a, b) =>
      a.total > b.total ? a : b,
      closings[0]
    );

    let monthName = "-";
    if (bestMonthEntry) {
      const [year, month] = bestMonthEntry.month.split("-");
      const date = new Date(parseInt(year), parseInt(month) - 1);
      monthName = date.toLocaleString("pt-BR", { month: "long" });
    }

    return {
      totalYear,
      monthlyAverage,
      bestChannel: {
        name: bestChannelLabel,
        value: bestChannelEntry[1],
      },
      bestMonth: {
        month: monthName,
        value: bestMonthEntry ? bestMonthEntry.total : 0,
      },
    };
  }, [closings, marketplaces]);

  const handleSaveClosing = (
    data: Omit<MonthlyClosing, "id" | "total">
  ) => {
    if (editingClosing) {
      updateClosing.mutate({
        ...editingClosing,
        ...data,
        total: 0, // Recalculated by hook
      });
    } else {
      createClosing.mutate(data);
    }
  };

  const handleDeleteClosing = (id: string) => {
    deleteClosing.mutate(id);
  };

  const handleEditClosing = (closing: MonthlyClosing) => {
    setEditingClosing(closing);
    setIsDialogOpen(true);
  };

  const handleCreateNew = () => {
    setEditingClosing(null);
    setIsDialogOpen(true);
  };

  if (loadingClosings || loadingMarketplaces) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Dashboard Financeiro
          </h1>
          <p className="text-muted-foreground mt-1">
            Gestão de receitas por marketplace
          </p>
        </div>
        <div className="flex items-center gap-2">
          <HistoricalDataDialog />
          {/* Access Control: Only specific user can edit */}
          {user?.email === "livia@hotmail.com" && (
            <>
              <MarketplacesDialog />
              <Button
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
                onClick={handleCreateNew}
              >
                <Plus className="mr-2 h-4 w-4" />
                Novo Fechamento
              </Button>
            </>
          )}
        </div>
      </div>

      {marketplaces.length === 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Nenhum canal configurado</AlertTitle>
          <AlertDescription>
            Você precisa adicionar pelo menos um marketplace para começar a registrar fechamentos.
            Clique no ícone de engrenagem acima.
          </AlertDescription>
        </Alert>
      )}

      <FinancialStats stats={stats} />

      <div className="grid gap-6 md:grid-cols-7">
        <RevenueChart data={closings} />
        {/* MarketplaceShareChart needs refactoring or props to handle dynamic colors/labels */}
        <MarketplaceShareChart data={closings} />
      </div>

      <RecentClosingsTable
        data={closings}
        onDelete={handleDeleteClosing}
        onEdit={handleEditClosing}
      />

      <ClosingFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        initialData={editingClosing}
        onSave={handleSaveClosing}
      />
    </div>
  );
};

export default DashboardFinanceiro;
