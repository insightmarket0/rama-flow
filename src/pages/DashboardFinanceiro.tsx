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
    <div className="min-h-screen bg-black text-white p-8 space-y-8 relative overflow-hidden animate-fade-in pb-10">
      {/* Premium Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-green-500/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,_#000000_0%,_#050505_100%)] -z-10" />

      {/* Ambient Light */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-white/5 to-transparent pointer-events-none opacity-50" />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-white/10 relative z-10">
        <div className="space-y-0.5">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
            Dashboard Financeiro
          </h1>
          <p className="text-sm text-muted-foreground font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Gestão de receitas em tempo real
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white/5 p-1.5 rounded-xl border border-white/10 backdrop-blur-md">
          <div className="flex items-center gap-1 border-r border-white/10 pr-3 mr-1">
            <HistoricalDataDialog />
          </div>

          {/* Access Control: Only specific user can edit */}
          {user?.email === "livia@hotmail.com" && (
            <>
              <MarketplacesDialog />
              <Button
                className="bg-[#FFE600] hover:bg-[#FFE600]/90 text-black font-bold shadow-[0_0_20px_rgba(255,230,0,0.3)] transition-all duration-300 hover:scale-105"
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
