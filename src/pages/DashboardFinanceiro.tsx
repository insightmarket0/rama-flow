import { useMemo, useState, useEffect } from "react";
import { FinancialStats } from "@/components/finance/FinancialStats";
import { RevenueChart } from "@/components/finance/RevenueChart";
import { MarketplaceShareChart } from "@/components/finance/MarketplaceShareChart";
import { RecentClosingsTable } from "@/components/finance/RecentClosingsTable";
import { ClosingFormDialog } from "@/components/finance/ClosingFormDialog";
import { MarketplacesDialog } from "@/components/finance/MarketplacesDialog";
import { MonthlyClosing, DashboardStats } from "@/types/finance";
import { useFinancialClosings } from "@/hooks/useFinancialClosings";
import { useMarketplaces } from "@/hooks/useMarketplaces";
import { Loader2, Plus, AlertCircle, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { HistoricalDataDialog } from "@/components/finance/HistoricalDataDialog";
import { NewFeatureModal } from "@/components/NewFeatureModal";

import { useAuth } from "@/hooks/useAuth";

const DashboardFinanceiro = () => {
  const { user } = useAuth();
  const { closings, isLoading: loadingClosings, createClosing, deleteClosing, updateClosing } =
    useFinancialClosings();
  const { marketplaces, isLoading: loadingMarketplaces } = useMarketplaces();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClosing, setEditingClosing] = useState<MonthlyClosing | null>(null);

  const isAuthorized = user?.email === "rogerio@ramaflow.com" || 
                       user?.email === "livia@hotmail.com" || 
                       user?.email === "suporte.ramamagazine@gmail.com";

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

  if (!isAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-48px)] bg-[#0A0A0A] rounded-[2rem] w-full text-center space-y-6 animate-in fade-in duration-700 p-8">
        <div className="w-20 h-20 rounded-full border border-red-500/30 bg-red-500/10 flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.2)]">
          <Lock className="w-10 h-10 text-red-500" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Acesso Restrito</h2>
          <p className="text-gray-400">Esta página é exclusiva para a Diretoria (Anderson e Rogério).</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-transparent text-white relative overflow-hidden animate-in fade-in duration-700 pb-10">

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10 mb-4">
        <div className="flex items-center gap-4">
          <h1 className="text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase text-white/80">
            Dashboard Financeiro
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="opacity-60 hover:opacity-100 transition-opacity">
            <HistoricalDataDialog currentTotal={stats.totalYear} />
          </div>

          {/* Access Control: Only specific user can edit */}
          {user?.email === "livia@hotmail.com" && (
            <>
              <div className="opacity-60 hover:opacity-100 transition-opacity">
                <MarketplacesDialog />
              </div>
              <Button
                variant="outline"
                className="bg-transparent hover:bg-white/5 border-white/10 text-white text-[10px] uppercase tracking-widest font-bold h-8 rounded-none transition-all"
                onClick={handleCreateNew}
              >
                <Plus className="mr-2 h-3 w-3" />
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

      <div className="grid lg:grid-cols-12 gap-8 items-center mb-16 relative">
        <div className="lg:col-span-8">
          <FinancialStats stats={stats} />
        </div>
        {/* Divisor Vertical */}
        <div className="hidden lg:block absolute top-[10%] bottom-[10%] left-[66.66%] w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
        
        <div className="lg:col-span-4 hidden lg:flex flex-col justify-center h-full">
          <MarketplaceShareChart data={closings} />
        </div>
      </div>

      <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500 mb-16">
        <RevenueChart data={closings} />
      </div>

      <div className="w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
        <RecentClosingsTable
          data={closings}
          onDelete={handleDeleteClosing}
          onEdit={handleEditClosing}
        />
      </div>

      <ClosingFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        initialData={editingClosing}
        onSave={handleSaveClosing}
      />

      <NewFeatureModal />
    </div>
  );
};

export default DashboardFinanceiro;
