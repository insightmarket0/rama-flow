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

  const [isUnlocked, setIsUnlocked] = useState(() => sessionStorage.getItem("financeiro_unlocked") === "true");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (isUnlocked && !loadingClosings && !loadingMarketplaces) {
      const t = setTimeout(() => setShowContent(true), 150);
      return () => clearTimeout(t);
    }
  }, [isUnlocked, loadingClosings, loadingMarketplaces]);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "2703") {
      sessionStorage.setItem("financeiro_unlocked", "true");
      setIsUnlocked(true);
      setError(false);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

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

  if (!isUnlocked) {
    return (
      <div className="flex flex-col lg:flex-row h-[calc(100vh-48px)] bg-[#0A0A0A] rounded-[2rem] w-full gap-8 font-sans overflow-hidden animate-in fade-in duration-700">
        
        {/* Lado Esquerdo - Tipografia / Branding */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-12 lg:px-20 border-r border-white/5 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00FF00]/5 to-transparent pointer-events-none" />
          
          <div className="flex items-center gap-2 mb-8 relative z-10">
            <div className="w-3 h-3 rounded-full bg-[#00FF00] shadow-[0_0_15px_#00FF00] animate-pulse" />
            <span className="text-[#00FF00] text-[10px] font-bold tracking-[0.2em] uppercase">
              Acesso Restrito
            </span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-light text-white tracking-tighter leading-none mb-6 relative z-10">
            Financeiro <br />
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Global.</span>
          </h1>
          
          <p className="text-gray-500 font-light text-lg max-w-md relative z-10">
            Insira o código de autorização para acessar os dados operacionais e de receita.
          </p>
        </div>

        {/* Lado Direito - Cofre Digital */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center bg-[#111111] relative z-10 p-12">
          
          <form onSubmit={handleUnlock} className="w-full max-w-sm space-y-12">
            <div className="flex justify-center mb-8">
              <div className="h-20 w-20 rounded-full border border-white/10 bg-[#0A0A0A] flex items-center justify-center shadow-2xl relative">
                <Lock className="w-8 h-8 text-gray-500" />
                <div className="absolute inset-0 rounded-full border border-[#00FF00]/20 animate-ping" />
              </div>
            </div>

            <div className="relative group">
              <Input
                type="password"
                placeholder="CÓDIGO"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`bg-transparent border-0 border-b-2 border-white/10 text-white h-20 text-center text-4xl tracking-[1em] focus:ring-0 focus:border-[#00FF00] transition-colors rounded-none px-0 ${error ? 'border-red-500 text-red-500' : ''}`}
                autoFocus
                style={{ WebkitTextSecurity: 'disc' }}
              />
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold tracking-widest uppercase text-gray-600 group-focus-within:text-[#00FF00] transition-colors">
                Waiting input...
              </span>
            </div>

            <button 
              type="submit"
              className="w-full h-14 bg-white/5 hover:bg-[#00FF00] hover:text-black text-white font-bold tracking-widest uppercase text-xs rounded-xl transition-all duration-300 flex items-center justify-center gap-3 group border border-white/5 hover:border-[#00FF00] shadow-[0_0_20px_rgba(0,0,0,0)] hover:shadow-[0_0_20px_rgba(0,255,0,0.2)]"
            >
              Autenticar <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </button>
          </form>

        </div>
      </div>
    );
  }

  return (
    <div className="bg-transparent text-white space-y-5 relative overflow-hidden animate-fade-in pb-10">

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

      {showContent ? (
        <>
          <FinancialStats stats={stats} />

          <div className="grid gap-5 md:grid-cols-7 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <RevenueChart data={closings} />
            <MarketplaceShareChart data={closings} />
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <RecentClosingsTable
              data={closings}
              onDelete={handleDeleteClosing}
              onEdit={handleEditClosing}
            />
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 opacity-50">
          <Loader2 className="h-8 w-8 animate-spin text-[#00FF00]" />
          <p className="text-gray-500 mt-4 text-sm font-medium">Renderizando painel...</p>
        </div>
      )}

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
